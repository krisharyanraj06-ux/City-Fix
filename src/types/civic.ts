export type IssueCategory =
  | 'pothole'
  | 'streetlight'
  | 'water_leakage'
  | 'garbage'
  | 'infrastructure'
  | 'traffic_signal'
  | 'other';

export type IssueStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export type CivicDepartment =
  | 'Public Works & Roads'
  | 'Electricity & Lighting'
  | 'Water Supply & Sewerage'
  | 'Sanitation & Waste Management'
  | 'Parks & Recreation'
  | 'Traffic & Transportation';

export type WardName =
  | 'Ward 1 - DPS More & Amity Campus'
  | 'Ward 2 - Bailey Road & Rupaspur'
  | 'Ward 3 - Saguna More Hub'
  | 'Ward 4 - Gola Road Sector'
  | 'Ward 5 - Khagaul Canal Link'
  | 'Ward 6 - Danapur Cantonment Zone';

export interface IssueTimelineEvent {
  id: string;
  status: IssueStatus;
  timestamp: string;
  title: string;
  note: string;
  author: string;
  role: 'citizen' | 'system' | 'authority';
}

export interface IssueComment {
  id: string;
  author: string;
  role: 'citizen' | 'official';
  content: string;
  timestamp: string;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  categoryLabel: string;
  department: CivicDepartment;
  ward: WardName;
  location: {
    address: string;
    landmark?: string;
    lat: number;
    lng: number;
  };
  photoUrl?: string;
  resolutionPhotoUrl?: string;
  status: IssueStatus;
  priority: IssuePriority;
  reporter: {
    name: string;
    phone?: string;
    email?: string;
    isAnonymous: boolean;
  };
  assignedTo?: {
    crewName: string;
    officer: string;
    assignedAt: string;
    targetResolutionDate?: string;
  };
  resolutionNotes?: string;
  resolvedAt?: string;
  upvotes: number;
  timeline: IssueTimelineEvent[];
  comments: IssueComment[];
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CitizenUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ward?: WardName;
  avatarUrl?: string;
  createdAt: string;
  reportedIssueIds: string[];
}

export interface DepartmentMetric {
  department: CivicDepartment;
  total: number;
  resolved: number;
  pending: number;
  avgResolutionHours: number;
  slaComplianceRate: number; // percentage (0-100)
}

export interface WardMetric {
  ward: WardName;
  totalIssues: number;
  resolvedIssues: number;
  criticalIssues: number;
}

export interface CivicStats {
  totalIssues: number;
  resolvedIssues: number;
  inProgressIssues: number;
  underReviewIssues: number;
  submittedIssues: number;
  criticalIssues: number;
  overallResolutionRate: number;
  avgResolutionDays: number;
  citizensEngaged: number;
  departmentMetrics: DepartmentMetric[];
  wardMetrics: WardMetric[];
}
