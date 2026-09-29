import { IssueCategory, IssuePriority, IssueStatus } from '../types/civic';

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatTimeAgo(isoString: string): string {
  try {
    const now = new Date().getTime();
    const past = new Date(isoString).getTime();
    const diffHours = Math.floor((now - past) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(isoString);
  } catch {
    return 'Recently';
  }
}

export function getStatusDetails(status: IssueStatus) {
  switch (status) {
    case 'submitted':
      return {
        label: 'Submitted',
        step: 1,
        colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
        dotColor: 'bg-amber-500',
        description: 'Received by Municipal Registry, awaiting dispatcher review',
      };
    case 'under_review':
      return {
        label: 'Under Review',
        step: 2,
        colorClass: 'text-sky-700 bg-sky-50 border-sky-200',
        dotColor: 'bg-sky-500',
        description: 'Triage officer assessing jurisdiction, priority, and crew availability',
      };
    case 'assigned':
      return {
        label: 'Crew Assigned',
        step: 3,
        colorClass: 'text-blue-700 bg-blue-50 border-blue-200',
        dotColor: 'bg-blue-500',
        description: 'Dispatched to specialized municipal field operations crew',
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        step: 4,
        colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        dotColor: 'bg-indigo-500',
        description: 'Field engineers actively working on-site to remediate issue',
      };
    case 'resolved':
      return {
        label: 'Resolved',
        step: 5,
        colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        dotColor: 'bg-emerald-500',
        description: 'Remediation completed and verified with photographic sign-off',
      };
    case 'rejected':
      return {
        label: 'Non-Actionable',
        step: 0,
        colorClass: 'text-stone-700 bg-stone-100 border-stone-200',
        dotColor: 'bg-stone-500',
        description: 'Outside municipal jurisdiction or duplicate record',
      };
    default:
      return {
        label: status,
        step: 1,
        colorClass: 'text-slate-700 bg-slate-100 border-slate-200',
        dotColor: 'bg-slate-400',
        description: 'Current status recorded',
      };
  }
}

export function getPriorityBadge(priority: IssuePriority) {
  switch (priority) {
    case 'critical':
      return {
        label: 'Critical Hazard',
        textColor: 'text-red-700',
        borderColor: 'border-l-red-500',
        bgSubtle: 'bg-red-50',
      };
    case 'high':
      return {
        label: 'High Priority',
        textColor: 'text-orange-700',
        borderColor: 'border-l-orange-500',
        bgSubtle: 'bg-orange-50',
      };
    case 'medium':
      return {
        label: 'Standard',
        textColor: 'text-slate-700',
        borderColor: 'border-l-slate-400',
        bgSubtle: 'bg-slate-50',
      };
    case 'low':
      return {
        label: 'Routine',
        textColor: 'text-slate-500',
        borderColor: 'border-l-slate-300',
        bgSubtle: 'bg-slate-50',
      };
  }
}

export const CATEGORY_INFO: Record<
  IssueCategory,
  { label: string; department: string; slaDays: number; icon: string }
> = {
  pothole: {
    label: 'Pothole & Road Hazard',
    department: 'Public Works & Roads',
    slaDays: 2,
    icon: 'Hammer',
  },
  streetlight: {
    label: 'Streetlights & Electrical',
    department: 'Electricity & Lighting',
    slaDays: 1,
    icon: 'Lightbulb',
  },
  water_leakage: {
    label: 'Water Supply & Leakage',
    department: 'Water Supply & Sewerage',
    slaDays: 1,
    icon: 'Droplets',
  },
  garbage: {
    label: 'Garbage & Sanitation',
    department: 'Sanitation & Waste Management',
    slaDays: 1,
    icon: 'Trash2',
  },
  infrastructure: {
    label: 'Public Infrastructure',
    department: 'Public Works & Roads',
    slaDays: 4,
    icon: 'Building2',
  },
  traffic_signal: {
    label: 'Traffic & Signals',
    department: 'Traffic & Transportation',
    slaDays: 1,
    icon: 'TrafficCone',
  },
  other: {
    label: 'Other Civic Concern',
    department: 'Public Works & Roads',
    slaDays: 5,
    icon: 'HelpCircle',
  },
};
