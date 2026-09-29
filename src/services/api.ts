import { CivicIssue, CivicStats, IssueStatus } from '../types/civic';
import { INITIAL_ISSUES } from '../server/seedData';

const BASE_URL = '/api';

export async function fetchIssues(filters?: {
  status?: string;
  category?: string;
  department?: string;
  ward?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
}): Promise<CivicIssue[]> {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value);
        }
      });
    }

    const response = await fetch(`${BASE_URL}/issues?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch issues');
    return await response.json();
  } catch (err) {
    console.warn('API error, falling back to local dataset', err);
    return INITIAL_ISSUES;
  }
}

export async function fetchIssueById(id: string): Promise<CivicIssue | null> {
  try {
    const response = await fetch(`${BASE_URL}/issues/${encodeURIComponent(id)}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('API error fetching issue', err);
    return INITIAL_ISSUES.find(i => i.id.toUpperCase() === id.toUpperCase()) || null;
  }
}

export async function createIssue(payload: Partial<CivicIssue>): Promise<CivicIssue> {
  const response = await fetch(`${BASE_URL}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Failed to create issue' }));
    throw new Error(err.error || 'Failed to submit complaint');
  }

  return await response.json();
}

export async function updateIssueStatus(
  id: string,
  data: {
    status: IssueStatus;
    note?: string;
    officerName?: string;
    assignedTo?: {
      crewName: string;
      officer?: string;
      targetResolutionDate?: string;
    };
    resolutionNotes?: string;
    resolutionPhotoUrl?: string;
  }
): Promise<CivicIssue> {
  const response = await fetch(`${BASE_URL}/issues/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Failed to update issue status' }));
    throw new Error(err.error || 'Status update failed');
  }

  return await response.json();
}

export async function upvoteIssue(id: string): Promise<{ id: string; upvotes: number }> {
  const response = await fetch(`${BASE_URL}/issues/${encodeURIComponent(id)}/upvote`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to upvote');
  return await response.json();
}

export async function addIssueComment(
  id: string,
  comment: { author: string; content: string; role: 'citizen' | 'official' }
) {
  const response = await fetch(`${BASE_URL}/issues/${encodeURIComponent(id)}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  if (!response.ok) throw new Error('Failed to post comment');
  return await response.json();
}

export async function fetchCivicStats(): Promise<CivicStats> {
  try {
    const response = await fetch(`${BASE_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return await response.json();
  } catch (err) {
    console.warn('API error fetching stats', err);
    return {
      totalIssues: INITIAL_ISSUES.length,
      resolvedIssues: INITIAL_ISSUES.filter(i => i.status === 'resolved').length,
      inProgressIssues: INITIAL_ISSUES.filter(i => i.status === 'in_progress' || i.status === 'assigned').length,
      underReviewIssues: INITIAL_ISSUES.filter(i => i.status === 'under_review').length,
      submittedIssues: INITIAL_ISSUES.filter(i => i.status === 'submitted').length,
      criticalIssues: INITIAL_ISSUES.filter(i => i.priority === 'critical' && i.status !== 'resolved').length,
      overallResolutionRate: 40,
      avgResolutionDays: 2.1,
      citizensEngaged: 245,
      departmentMetrics: [],
      wardMetrics: [],
    };
  }
}

export async function resetSeedData(): Promise<void> {
  await fetch(`${BASE_URL}/seed`, { method: 'POST' });
}
