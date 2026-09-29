import React from 'react';
import { CivicIssue } from '../types/civic';
import { getStatusDetails, formatTimeAgo, CATEGORY_INFO } from '../utils/formatters';
import { 
  ThumbsUp, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Hammer,
  Lightbulb,
  Droplets,
  Trash2,
  Building2,
  TrafficCone,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

interface IssueCardProps {
  issue: CivicIssue;
  onSelect: (issue: CivicIssue) => void;
  onUpvote?: (id: string, e: React.MouseEvent) => void;
  isSelected?: boolean;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  pothole: Hammer,
  streetlight: Lightbulb,
  water_leakage: Droplets,
  garbage: Trash2,
  infrastructure: Building2,
  traffic_signal: TrafficCone,
  other: HelpCircle,
};

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onSelect,
  onUpvote,
  isSelected = false,
}) => {
  const statusInfo = getStatusDetails(issue.status);
  const IconComponent = CATEGORY_ICONS[issue.category] || HelpCircle;
  const isCritical = issue.priority === 'critical' && issue.status !== 'resolved';

  return (
    <div
      onClick={() => onSelect(issue)}
      className={`group relative bg-white border transition-all duration-150 rounded-xl p-4 cursor-pointer hover:shadow-md ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-sm'
          : 'border-slate-200 hover:border-slate-300'
      } ${isCritical ? 'border-l-4 border-l-red-500' : ''}`}
    >
      {/* Quiet Kicker: Ticket ID · Ward · Time */}
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-600">
          <span>{issue.id}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-sans font-medium text-slate-500">{issue.ward.split(' - ')[1] || issue.ward}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(issue.createdAt)}</span>
        </div>
      </div>

      {/* Main Title & Thumbnail */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {issue.title}
          </h3>
          <p className="mt-1 text-xs text-slate-600 line-clamp-2">
            {issue.description}
          </p>
        </div>

        {issue.photoUrl && (
          <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
            <img
              src={issue.photoUrl}
              alt="Issue incident photo"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
            {issue.status === 'resolved' && (
              <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location Address */}
      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 truncate">
        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="truncate">{issue.location.address}</span>
      </div>

      {/* Bottom Metadata & Controls (Zero-Pill Discipline: unboxed text with dots) */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
          <span className="font-semibold text-slate-700">{statusInfo.label}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-500 flex items-center gap-1">
            <IconComponent className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[120px]">{issue.categoryLabel}</span>
          </span>
          {isCritical && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-red-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Critical
              </span>
            </>
          )}
        </div>

        {/* Upvote Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onUpvote?.(issue.id, e);
            }}
            title="Upvote this complaint to increase municipal urgency"
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-semibold transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{issue.upvotes}</span>
          </button>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
        </div>
      </div>
    </div>
  );
};
