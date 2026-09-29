import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { INITIAL_ISSUES } from './src/server/seedData';
import { CivicIssue, CivicStats, DepartmentMetric, WardMetric, IssueStatus, CivicDepartment, WardName } from './src/types/civic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// In-memory issue store with fallback to seed data
let issues: CivicIssue[] = JSON.parse(JSON.stringify(INITIAL_ISSUES));

// Helper: recalculate statistics
function calculateStats(): CivicStats {
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const inProgressIssues = issues.filter(i => i.status === 'in_progress' || i.status === 'assigned').length;
  const underReviewIssues = issues.filter(i => i.status === 'under_review').length;
  const submittedIssues = issues.filter(i => i.status === 'submitted').length;
  const criticalIssues = issues.filter(i => i.priority === 'critical' && i.status !== 'resolved').length;

  const overallResolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  // Calculate average resolution days for resolved issues
  let totalResolutionHours = 0;
  let resolvedWithDatesCount = 0;
  issues.forEach(issue => {
    if (issue.status === 'resolved' && issue.resolvedAt && issue.createdAt) {
      const start = new Date(issue.createdAt).getTime();
      const end = new Date(issue.resolvedAt).getTime();
      const diffHours = Math.max(1, (end - start) / (1000 * 60 * 60));
      totalResolutionHours += diffHours;
      resolvedWithDatesCount++;
    }
  });

  const avgResolutionDays = resolvedWithDatesCount > 0 
    ? Number((totalResolutionHours / resolvedWithDatesCount / 24).toFixed(1))
    : 2.1;

  // Department metrics
  const departments: CivicDepartment[] = [
    'Public Works & Roads',
    'Electricity & Lighting',
    'Water Supply & Sewerage',
    'Sanitation & Waste Management',
    'Parks & Recreation',
    'Traffic & Transportation'
  ];

  const departmentMetrics: DepartmentMetric[] = departments.map(dept => {
    const deptIssues = issues.filter(i => i.department === dept);
    const resolved = deptIssues.filter(i => i.status === 'resolved').length;
    const pending = deptIssues.filter(i => i.status !== 'resolved' && i.status !== 'rejected').length;
    
    // SLA compliance estimate
    const complianceBase = resolved > 0 ? Math.min(98, Math.max(76, Math.round((resolved / (deptIssues.length || 1)) * 100) + 15)) : 88;

    return {
      department: dept,
      total: deptIssues.length,
      resolved,
      pending,
      avgResolutionHours: Math.round(18 + (dept.length % 7) * 4),
      slaComplianceRate: complianceBase,
    };
  });

  // Ward metrics
  const wards: WardName[] = [
    'Ward 1 - DPS More & Amity Campus',
    'Ward 2 - Bailey Road & Rupaspur',
    'Ward 3 - Saguna More Hub',
    'Ward 4 - Gola Road Sector',
    'Ward 5 - Khagaul Canal Link',
    'Ward 6 - Danapur Cantonment Zone'
  ];

  const wardMetrics: WardMetric[] = wards.map(ward => {
    const wardIssues = issues.filter(i => i.ward === ward);
    return {
      ward,
      totalIssues: wardIssues.length,
      resolvedIssues: wardIssues.filter(i => i.status === 'resolved').length,
      criticalIssues: wardIssues.filter(i => i.priority === 'critical' && i.status !== 'resolved').length,
    };
  });

  const citizensEngaged = issues.reduce((acc, curr) => acc + (curr.upvotes || 0) + (curr.comments?.length || 0), 180);

  return {
    totalIssues,
    resolvedIssues,
    inProgressIssues,
    underReviewIssues,
    submittedIssues,
    criticalIssues,
    overallResolutionRate,
    avgResolutionDays,
    citizensEngaged,
    departmentMetrics,
    wardMetrics,
  };
}

// REST APIs
// 1. Get all issues with filters
app.get('/api/issues', (req, res) => {
  const { status, category, department, ward, priority, search, sortBy } = req.query;

  let filtered = [...issues];

  if (status && status !== 'all') {
    filtered = filtered.filter(i => i.status === status);
  }
  if (category && category !== 'all') {
    filtered = filtered.filter(i => i.category === category);
  }
  if (department && department !== 'all') {
    filtered = filtered.filter(i => i.department === department);
  }
  if (ward && ward !== 'all') {
    filtered = filtered.filter(i => i.ward === ward);
  }
  if (priority && priority !== 'all') {
    filtered = filtered.filter(i => i.priority === priority);
  }
  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase();
    filtered = filtered.filter(i => 
      i.id.toLowerCase().includes(q) ||
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.location.address.toLowerCase().includes(q) ||
      (i.location.landmark && i.location.landmark.toLowerCase().includes(q)) ||
      i.department.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortBy === 'upvotes') {
    filtered.sort((a, b) => b.upvotes - a.upvotes);
  } else if (sortBy === 'priority') {
    const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
    filtered.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  } else {
    // default: newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(filtered);
});

// 2. Get single issue by ID
app.get('/api/issues/:id', (req, res) => {
  const { id } = req.params;
  const issue = issues.find(i => i.id.toUpperCase() === id.toUpperCase());
  if (!issue) {
    res.status(404).json({ error: 'Complaint ticket not found' });
    return;
  }
  res.json(issue);
});

// 3. Create new issue report
app.post('/api/issues', (req, res) => {
  const data = req.body;
  if (!data.title || !data.category || !data.department || !data.location?.address) {
    res.status(400).json({ error: 'Missing mandatory fields: title, category, department, address are required.' });
    return;
  }

  const generatedNum = Math.floor(1000 + Math.random() * 9000);
  const newId = `CF-2026-${generatedNum}`;
  const now = new Date().toISOString();

  const newIssue: CivicIssue = {
    id: newId,
    title: data.title.trim(),
    description: data.description?.trim() || 'No detailed description provided.',
    category: data.category,
    categoryLabel: data.categoryLabel || data.category,
    department: data.department,
    ward: data.ward || 'Ward 1 - DPS More & Amity Campus',
    location: {
      address: data.location.address.trim(),
      landmark: data.location.landmark?.trim() || undefined,
      lat: Number(data.location.lat) || 25.6125 + (Math.random() - 0.5) * 0.02,
      lng: Number(data.location.lng) || 85.0565 + (Math.random() - 0.5) * 0.02,
    },
    photoUrl: data.photoUrl || undefined,
    status: 'submitted',
    priority: data.priority || 'medium',
    reporter: {
      name: data.reporter?.name?.trim() || (data.reporter?.isAnonymous ? 'Anonymous Citizen' : 'Civic Reporter'),
      phone: data.reporter?.phone?.trim() || undefined,
      email: data.reporter?.email?.trim() || undefined,
      isAnonymous: Boolean(data.reporter?.isAnonymous),
    },
    upvotes: 1,
    timeline: [
      {
        id: `t-${newId}-1`,
        status: 'submitted',
        timestamp: now,
        title: 'Complaint Registered',
        note: `Initial civic report submitted by ${data.reporter?.isAnonymous ? 'anonymous citizen' : (data.reporter?.name || 'citizen')} via CityFix Web Portal.`,
        author: data.reporter?.isAnonymous ? 'Citizen' : (data.reporter?.name || 'Citizen'),
        role: 'citizen',
      },
    ],
    comments: [],
    userId: data.userId || undefined,
    createdAt: now,
    updatedAt: now,
  };

  issues.unshift(newIssue);
  res.status(201).json(newIssue);
});

// 4. Update status & dispatch (Authority endpoint)
app.patch('/api/issues/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note, assignedTo, resolutionNotes, resolutionPhotoUrl, officerName } = req.body;

  const issueIndex = issues.findIndex(i => i.id.toUpperCase() === id.toUpperCase());
  if (issueIndex === -1) {
    res.status(404).json({ error: 'Issue not found' });
    return;
  }

  const issue = issues[issueIndex];
  const now = new Date().toISOString();
  const newStatus = status as IssueStatus;

  let title = `Status changed to ${newStatus.replace('_', ' ').toUpperCase()}`;
  if (newStatus === 'assigned') title = 'Field Unit Dispatched';
  if (newStatus === 'in_progress') title = 'Remediation Underway';
  if (newStatus === 'resolved') title = 'Official Resolution Confirmed';
  if (newStatus === 'rejected') title = 'Issue Rejected / Non-Jurisdictional';

  // Build timeline event
  issue.timeline.push({
    id: `t-${id}-${issue.timeline.length + 1}`,
    status: newStatus,
    timestamp: now,
    title,
    note: note || `Updated by Municipal Desk: ${newStatus}`,
    author: officerName || 'Municipal Authority Desk',
    role: 'authority',
  });

  issue.status = newStatus;
  issue.updatedAt = now;

  if (assignedTo) {
    issue.assignedTo = {
      crewName: assignedTo.crewName || 'Municipal Response Crew',
      officer: officerName || assignedTo.officer || 'Supervising Officer',
      assignedAt: now,
      targetResolutionDate: assignedTo.targetResolutionDate || undefined,
    };
  }

  if (newStatus === 'resolved') {
    issue.resolvedAt = now;
    if (resolutionNotes) {
      issue.resolutionNotes = resolutionNotes;
    }
    if (resolutionPhotoUrl) {
      issue.resolutionPhotoUrl = resolutionPhotoUrl;
    }
  }

  issues[issueIndex] = issue;
  res.json(issue);
});

// 5. Upvote issue
app.post('/api/issues/:id/upvote', (req, res) => {
  const { id } = req.params;
  const issue = issues.find(i => i.id.toUpperCase() === id.toUpperCase());
  if (!issue) {
    res.status(404).json({ error: 'Issue not found' });
    return;
  }
  issue.upvotes = (issue.upvotes || 0) + 1;
  res.json({ id: issue.id, upvotes: issue.upvotes });
});

// 6. Post comment to issue
app.post('/api/issues/:id/comments', (req, res) => {
  const { id } = req.params;
  const { author, content, role } = req.body;
  if (!content || !content.trim()) {
    res.status(400).json({ error: 'Comment content cannot be blank' });
    return;
  }

  const issue = issues.find(i => i.id.toUpperCase() === id.toUpperCase());
  if (!issue) {
    res.status(404).json({ error: 'Issue not found' });
    return;
  }

  const newComment = {
    id: `c-${id}-${Date.now()}`,
    author: author?.trim() || 'Citizen',
    role: (role === 'official' ? 'official' : 'citizen') as 'citizen' | 'official',
    content: content.trim(),
    timestamp: new Date().toISOString(),
  };

  issue.comments = issue.comments || [];
  issue.comments.push(newComment);
  res.status(201).json(newComment);
});

// 7. Get civic statistics
app.get('/api/stats', (req, res) => {
  const stats = calculateStats();
  res.json(stats);
});

// 8. Reset to seed
app.post('/api/seed', (req, res) => {
  issues = JSON.parse(JSON.stringify(INITIAL_ISSUES));
  res.json({ message: 'Civic issue registry reset to default municipal seed dataset.', count: issues.length });
});

// Start Express server and connect Vite in development
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CityFix API] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[CityFix API] Failed to start server:', err);
});
