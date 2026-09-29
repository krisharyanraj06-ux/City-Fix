import React, { useState } from 'react';
import { CivicIssue, IssueStatus, CivicDepartment, WardName } from '../types/civic';
import { getStatusDetails, formatDate, formatTimeAgo } from '../utils/formatters';
import {
  HardHat,
  Filter,
  Search,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  Send,
  Eye,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface AuthorityDashboardProps {
  issues: CivicIssue[];
  onSelectIssue: (issue: CivicIssue) => void;
  onUpdateStatus: (
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
  ) => Promise<void>;
  onResetSeed?: () => Promise<void>;
}

const FIELD_CREWS: Record<CivicDepartment, string[]> = {
  'Public Works & Roads': [
    'Patna West Rapid Pavement Unit #02',
    'Bailey Road Flyover Maintenance Wing',
    'Danapur Urban Road Safety Squad',
  ],
  'Electricity & Lighting': [
    'Bailey Road High-Mast Electrical Unit',
    'Danapur Feeder Line Squad',
    'DPS More Corridor Lighting Team',
  ],
  'Water Supply & Sewerage': [
    'Saguna More Drainage Division',
    'Danapur Pipeline Emergency Unit',
    'Khagaul Canal Desilting Fleet',
  ],
  'Sanitation & Waste Management': [
    'Gola Road Compactor Dumper Fleet',
    'Rupaspur Flying Sanitation Squad',
    'Bailey Road Commercial Waste Team',
  ],
  'Parks & Recreation': [
    'Patna Eco-Park & Urban Forestry Crew',
    'Danapur Public Grounds Safety Unit',
  ],
  'Traffic & Transportation': [
    'Patna Smart City Intelligent Traffic Wing',
    'DPS More Signal Control Team',
  ],
};

const SAMPLE_RESOLUTION_PROOFS = [
  { name: 'Paved Asphalt', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?auto=format&fit=crop&w=800&q=80' },
  { name: 'Fixed Lighting', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cleared Street', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80' },
];

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  issues,
  onSelectIssue,
  onUpdateStatus,
  onResetSeed,
}) => {
  // Filters
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Officer identity
  const [officerName, setOfficerName] = useState<string>('Er. Rakesh Verma, AE');
  const [officerRole, setOfficerRole] = useState<string>('Patna West Municipal Division');

  // Dispatch / Update Modal
  const [activeIssueForUpdate, setActiveIssueForUpdate] = useState<CivicIssue | null>(null);
  const [newStatus, setNewStatus] = useState<IssueStatus>('in_progress');
  const [selectedCrew, setSelectedCrew] = useState<string>('');
  const [actionNote, setActionNote] = useState<string>('');
  const [resolutionRemarks, setResolutionRemarks] = useState<string>('');
  const [resolutionPhoto, setResolutionPhoto] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    if (deptFilter !== 'all' && issue.department !== deptFilter) return false;
    if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        issue.id.toLowerCase().includes(q) ||
        issue.title.toLowerCase().includes(q) ||
        issue.location.address.toLowerCase().includes(q) ||
        issue.ward.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Triage metrics
  const unassignedCount = issues.filter(i => i.status === 'submitted' || i.status === 'under_review').length;
  const activeFieldCount = issues.filter(i => i.status === 'assigned' || i.status === 'in_progress').length;
  const criticalCount = issues.filter(i => i.priority === 'critical' && i.status !== 'resolved').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;

  const handleOpenUpdate = (issue: CivicIssue) => {
    setActiveIssueForUpdate(issue);
    setNewStatus(
      issue.status === 'submitted' ? 'under_review' :
      issue.status === 'under_review' ? 'assigned' :
      issue.status === 'assigned' ? 'in_progress' :
      'resolved'
    );
    const availableCrews = FIELD_CREWS[issue.department] || [];
    setSelectedCrew(issue.assignedTo?.crewName || availableCrews[0] || 'Municipal Response Crew');
    setActionNote('');
    setResolutionRemarks(issue.resolutionNotes || '');
    setResolutionPhoto(issue.resolutionPhotoUrl || '');
  };

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIssueForUpdate) return;

    try {
      setIsUpdating(true);
      await onUpdateStatus(activeIssueForUpdate.id, {
        status: newStatus,
        note: actionNote.trim() || `Status updated to ${newStatus.replace('_', ' ').toUpperCase()} by ${officerName}.`,
        officerName,
        assignedTo: {
          crewName: selectedCrew,
          officer: officerName,
          targetResolutionDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        },
        resolutionNotes: newStatus === 'resolved' ? (resolutionRemarks.trim() || 'Work completed and verified.') : undefined,
        resolutionPhotoUrl: newStatus === 'resolved' ? resolutionPhoto.trim() || undefined : undefined,
      });
      setActiveIssueForUpdate(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Title', 'Category', 'Department', 'Ward', 'Address', 'Status', 'Priority', 'Upvotes', 'Reported At'];
    const rows = filteredIssues.map(i => [
      i.id,
      `"${i.title.replace(/"/g, '""')}"`,
      i.category,
      `"${i.department}"`,
      `"${i.ward}"`,
      `"${i.location.address.replace(/"/g, '""')}"`,
      i.status,
      i.priority,
      i.upvotes,
      i.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CityFix_Audit_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset all civic complaints to standard municipal seed data?')) return;
    try {
      setIsResetting(true);
      await onResetSeed?.();
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Officer Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-blue-400 font-semibold tracking-wide">
                MUNICIPAL DISPATCH CONTROL DESK
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-medium">Session Active</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight mt-0.5">
              Operations & Work Order Triage
            </h2>
          </div>
        </div>

        {/* Officer Switcher */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">Logged In Officer</span>
            <span className="text-xs font-bold text-slate-200">{officerName}</span>
          </div>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            title="Export CSV Audit"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Audit CSV</span>
          </button>
          <button
            type="button"
            onClick={handleResetData}
            disabled={isResetting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 text-xs font-semibold border border-slate-700 transition-colors"
            title="Reset to default seed complaints"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Seed</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Ribbons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Needs Triage
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-amber-600">{unassignedCount}</span>
            <span className="text-xs text-slate-400">Submitted / Review</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Field Crews Active
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-blue-600">{activeFieldCount}</span>
            <span className="text-xs text-slate-400">Assigned & Working</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Critical Hazards
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-red-600">{criticalCount}</span>
            <span className="text-xs text-red-600 font-semibold">Priority 1 SLA</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Verified Resolved
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-black text-emerald-600">{resolvedCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">Sign-off Closed</span>
          </div>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ticket, address, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Departments</option>
            <option value="Public Works & Roads">Public Works & Roads</option>
            <option value="Electricity & Lighting">Electricity & Lighting</option>
            <option value="Water Supply & Sewerage">Water Supply & Sewerage</option>
            <option value="Sanitation & Waste Management">Sanitation & Waste Management</option>
            <option value="Parks & Recreation">Parks & Recreation</option>
            <option value="Traffic & Transportation">Traffic & Transportation</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Triage & Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-4">Ticket & Title</th>
                <th className="py-3 px-4">Department & Ward</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dispatched Crew</th>
                <th className="py-3 px-4 text-center">Urgency</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.map((issue) => {
                const statusDetails = getStatusDetails(issue.status);
                const isCritical = issue.priority === 'critical' && issue.status !== 'resolved';

                return (
                  <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Ticket & Title */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-blue-600">{issue.id}</div>
                      <div className="font-semibold text-slate-900 line-clamp-1 max-w-xs">
                        {issue.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                        {issue.location.address}
                      </div>
                    </td>

                    {/* Department & Ward */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{issue.department}</div>
                      <div className="text-[11px] text-slate-500">{issue.ward.split(' - ')[1] || issue.ward}</div>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        issue.priority === 'critical' ? 'text-red-700 font-bold' :
                        issue.priority === 'high' ? 'text-orange-700' : 'text-slate-600'
                      }`}>
                        {isCritical && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                        <span className="capitalize">{issue.priority}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusDetails.dotColor}`} />
                        <span className="font-semibold text-slate-700">{statusDetails.label}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {formatTimeAgo(issue.updatedAt || issue.createdAt)}
                      </div>
                    </td>

                    {/* Assigned Crew */}
                    <td className="py-3 px-4">
                      {issue.assignedTo ? (
                        <div>
                          <div className="font-medium text-slate-800 line-clamp-1 max-w-[180px]">
                            {issue.assignedTo.crewName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Sup: {issue.assignedTo.officer}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Upvotes */}
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {issue.upvotes}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenUpdate(issue)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors"
                      >
                        Dispatch / Update
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectIssue(issue)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="View Detailed Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredIssues.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No complaints found matching the current filters.
          </div>
        )}
      </div>

      {/* Status Update / Dispatch Drawer Modal */}
      {activeIssueForUpdate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">
                  {activeIssueForUpdate.id}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Update Status & Dispatch Crew
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveIssueForUpdate(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitUpdate} className="space-y-4 text-xs">
              {/* Target Status */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Lifecycle Status Transition:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['under_review', 'assigned', 'in_progress', 'resolved', 'rejected'] as IssueStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`p-2 rounded-lg border font-semibold capitalize text-center transition-all ${
                        newStatus === st
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign Field Crew */}
              {(newStatus === 'assigned' || newStatus === 'in_progress' || newStatus === 'resolved') && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assign Field Unit:
                  </label>
                  <select
                    value={selectedCrew}
                    onChange={(e) => setSelectedCrew(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-slate-800 bg-white"
                  >
                    {(FIELD_CREWS[activeIssueForUpdate.department] || [
                      'Municipal Response Crew',
                      'Rapid Action Unit',
                    ]).map((crew) => (
                      <option key={crew} value={crew}>{crew}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Work Order / Remediation Note */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Official Log / Work Order Instruction:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dispatched asphalt roller crew for overnight compaction. Traffic safety perimeter established."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Resolution Remarks & Proof Photo if marking resolved */}
              {newStatus === 'resolved' && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">
                      Final Resolution Remarks (Public):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cavity repaved with high-durability bituminous mix. Verified by inspector."
                      value={resolutionRemarks}
                      onChange={(e) => setResolutionRemarks(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 focus:outline-none bg-white text-emerald-950 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-emerald-900 mb-1">
                      Proof of Resolution Photo URL:
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={resolutionPhoto}
                      onChange={(e) => setResolutionPhoto(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-emerald-300 focus:outline-none bg-white text-emerald-950"
                    />
                    <div className="flex gap-2 mt-1.5">
                      {SAMPLE_RESOLUTION_PROOFS.map(p => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => setResolutionPhoto(p.url)}
                          className="text-[10px] text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200 px-2 py-0.5 rounded font-medium"
                        >
                          + {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveIssueForUpdate(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors"
                >
                  {isUpdating ? 'Recording...' : 'Commit Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
