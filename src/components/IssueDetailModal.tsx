import React, { useState } from 'react';
import { CivicIssue, IssueStatus } from '../types/civic';
import { formatDate, getStatusDetails, formatTimeAgo } from '../utils/formatters';
import {
  X,
  MapPin,
  Clock,
  ThumbsUp,
  Send,
  ShieldCheck,
  HardHat,
  CheckCircle2,
  AlertTriangle,
  Building,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface IssueDetailModalProps {
  issue: CivicIssue | null;
  onClose: () => void;
  onUpvote?: (id: string) => void;
  onAddComment?: (id: string, comment: { author: string; content: string; role: 'citizen' | 'official' }) => Promise<void>;
  isAuthorityMode?: boolean;
  onOpenAuthorityAction?: (issue: CivicIssue) => void;
}

const LIFECYCLE_STEPS: { status: IssueStatus; label: string; desc: string }[] = [
  { status: 'submitted', label: 'Submitted', desc: 'Received & logged' },
  { status: 'under_review', label: 'Under Review', desc: 'Triage & safety check' },
  { status: 'assigned', label: 'Crew Dispatched', desc: 'Work order assigned' },
  { status: 'in_progress', label: 'In Progress', desc: 'Field repair underway' },
  { status: 'resolved', label: 'Resolved', desc: 'Verified & closed' },
];

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onUpvote,
  onAddComment,
  isAuthorityMode = false,
  onOpenAuthorityAction,
}) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activePhotoTab, setActivePhotoTab] = useState<'reported' | 'resolved'>('reported');

  if (!issue) return null;

  const currentStatusInfo = getStatusDetails(issue.status);
  const currentStep = currentStatusInfo.step;
  const isCritical = issue.priority === 'critical' && issue.status !== 'resolved';

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      await onAddComment?.(issue.id, {
        author: authorName.trim() || (isAuthorityMode ? 'Municipal Desk Officer' : 'Concerned Citizen'),
        content: commentText.trim(),
        role: isAuthorityMode ? 'official' : 'citizen',
      });
      setCommentText('');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/75 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              {issue.id}
            </span>
            <div className="text-xs text-slate-500">
              <span>{issue.ward}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span>{formatDate(issue.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthorityMode && onOpenAuthorityAction && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuthorityAction(issue);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-sm transition-colors"
              >
                <HardHat className="w-3.5 h-3.5" />
                <span>Authority Dispatch / Update</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Title & Status Headline */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <span>{issue.department}</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-700">{issue.categoryLabel}</span>
              {isCritical && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Critical Hazard
                  </span>
                </>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {issue.title}
            </h2>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {issue.description}
            </p>
          </div>

          {/* Lifecycle Stepper */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Municipal Resolution Lifecycle
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {LIFECYCLE_STEPS.map((step, idx) => {
                const stepNum = idx + 1;
                const isPassed = currentStep >= stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                  <div
                    key={step.status}
                    className={`relative p-2.5 rounded-lg border text-xs transition-all ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold ring-1 ring-blue-400'
                        : isPassed
                        ? 'bg-white border-emerald-200 text-emerald-800'
                        : 'bg-white/60 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent 
                          ? 'bg-blue-600 text-white' 
                          : isPassed 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isPassed && !isCurrent ? '✓' : stepNum}
                      </span>
                      <span className="truncate">{step.label}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Photos: Reported Incident vs Official Resolution Proof */}
          {(issue.photoUrl || issue.resolutionPhotoUrl) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePhotoTab('reported')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      activePhotoTab === 'reported'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Citizen Evidence Photo
                  </button>
                  {issue.resolutionPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setActivePhotoTab('resolved')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                        activePhotoTab === 'resolved'
                          ? 'bg-emerald-600 text-white'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolution Proof Photo
                    </button>
                  )}
                </div>
                <span className="text-xs text-slate-400">
                  {activePhotoTab === 'reported' ? 'Submitted with complaint' : 'Uploaded by Municipal Field Engineer'}
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 max-h-72 flex items-center justify-center">
                {activePhotoTab === 'reported' && issue.photoUrl && (
                  <img
                    src={issue.photoUrl}
                    alt="Citizen evidence photo"
                    className="w-full h-72 object-cover"
                  />
                )}
                {activePhotoTab === 'resolved' && issue.resolutionPhotoUrl && (
                  <img
                    src={issue.resolutionPhotoUrl}
                    alt="Municipal official resolution proof"
                    className="w-full h-72 object-cover"
                  />
                )}
              </div>
            </div>
          )}

          {/* Official Resolution Summary (if resolved) */}
          {issue.status === 'resolved' && issue.resolutionNotes && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Municipal Resolution</span>
                {issue.resolvedAt && (
                  <span className="font-normal text-emerald-700">· Closed on {formatDate(issue.resolvedAt)}</span>
                )}
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {issue.resolutionNotes}
              </p>
            </div>
          )}

          {/* Two-Column Grid: Location & Assignment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Incident Location
              </h4>
              <p className="text-sm font-semibold text-slate-900">{issue.location.address}</p>
              {issue.location.landmark && (
                <p className="text-xs text-slate-600">Landmark: {issue.location.landmark}</p>
              )}
              <div className="text-[11px] font-mono text-slate-400">
                GPS: {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
              </div>
            </div>

            {/* Assignment & Crew Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <HardHat className="w-3.5 h-3.5 text-blue-600" /> Dispatch & Field Crew
              </h4>
              {issue.assignedTo ? (
                <>
                  <p className="text-sm font-semibold text-slate-900">{issue.assignedTo.crewName}</p>
                  <p className="text-xs text-slate-600">Supervising: {issue.assignedTo.officer}</p>
                  {issue.assignedTo.targetResolutionDate && (
                    <p className="text-xs text-blue-700 font-medium">
                      Target SLA: {formatDate(issue.assignedTo.targetResolutionDate)}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Currently undergoing triage in Central Municipal Dispatch Queue.
                </p>
              )}
            </div>
          </div>

          {/* Upvote & Citizen Action Bar */}
          <div className="flex items-center justify-between p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
            <div>
              <p className="text-xs font-bold text-blue-950">Community Endorsement</p>
              <p className="text-xs text-blue-800">
                {issue.upvotes} citizen{issue.upvotes !== 1 ? 's' : ''} have confirmed this issue exists in their neighborhood.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onUpvote?.(issue.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Confirm / Upvote ({issue.upvotes})</span>
            </button>
          </div>

          {/* Audit Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Verified Audit Trail
            </h4>
            <div className="relative border-l-2 border-slate-200 pl-4 ml-2 space-y-4">
              {issue.timeline.map((event) => (
                <div key={event.id} className="relative group">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-1 ring-blue-200" />
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-800">{event.title}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{formatDate(event.timestamp)}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] font-medium text-blue-600">{event.author}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600 leading-normal">{event.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen & Authority Comments Section */}
          <div className="border-t border-slate-200 pt-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Citizen Updates & Dispatch Notes ({issue.comments.length})
            </h4>

            {/* Comments List */}
            {issue.comments.length > 0 ? (
              <div className="space-y-2.5">
                {issue.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-xl border text-xs ${
                      comment.role === 'official'
                        ? 'bg-blue-50/70 border-blue-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{comment.author}</span>
                        {comment.role === 'official' && (
                          <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                            OFFICIAL
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400">{formatDate(comment.timestamp)}</span>
                    </div>
                    <p className="text-slate-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No community comments posted yet.</p>
            )}

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Neighbor, John)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-1/3 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Add a field observation or community update..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !commentText.trim()}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official CityFix Public Record · SLA Target Guaranteed</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
