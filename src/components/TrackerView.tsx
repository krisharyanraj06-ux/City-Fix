import React, { useState } from 'react';
import { CivicIssue } from '../types/civic';
import { getStatusDetails, formatDate, formatTimeAgo } from '../utils/formatters';
import { 
  Search, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  HardHat, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ThumbsUp,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface TrackerViewProps {
  allIssues: CivicIssue[];
  initialSearchId?: string;
  onSelectIssue: (issue: CivicIssue) => void;
  onUpvote?: (id: string) => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({
  allIssues,
  initialSearchId = '',
  onSelectIssue,
  onUpvote,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchId);
  const [searchedIssue, setSearchedIssue] = useState<CivicIssue | null>(() => {
    if (initialSearchId) {
      return allIssues.find(i => i.id.toUpperCase() === initialSearchId.toUpperCase()) || null;
    }
    return null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialSearchId));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    setHasSearched(true);
    const found = allIssues.find(
      i => i.id.toUpperCase() === query || 
           (i.reporter.phone && i.reporter.phone.includes(searchQuery.trim()))
    );
    setSearchedIssue(found || null);
  };

  const handleSelectQuickTicket = (issue: CivicIssue) => {
    setSearchQuery(issue.id);
    setSearchedIssue(issue);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 text-center space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-blue-400 font-semibold">
          Real-Time Municipal SLA Tracking
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Track Your Civic Complaint
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Enter your official public Ticket ID (e.g. <span className="font-mono text-blue-300 font-semibold">CF-2026-1042</span>) or registered phone number to view live field remediation updates.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. CF-2026-1042 or 555-234-8901"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
          >
            Track
          </button>
        </form>

        {/* Quick Ticket Samples */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-[11px] text-slate-500">Recent active tickets:</span>
          {allIssues.slice(0, 4).map((issue) => (
            <button
              key={issue.id}
              type="button"
              onClick={() => handleSelectQuickTicket(issue)}
              className="font-mono text-xs text-blue-400 hover:text-blue-300 bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
            >
              {issue.id}
            </button>
          ))}
        </div>
      </div>

      {/* Search Result Display */}
      {hasSearched && (
        <div className="space-y-6">
          {searchedIssue ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
              {/* Result Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-base font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                      {searchedIssue.id}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {searchedIssue.ward}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      Lodged {formatDate(searchedIssue.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {searchedIssue.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectIssue(searchedIssue)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span>Open Full Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status Stepper Progression */}
              <div className="p-6 border-b border-slate-200 bg-white">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-bold uppercase tracking-wider text-slate-700">Official Municipal Lifecycle Status</span>
                  <span className="font-semibold text-blue-600 capitalize">
                    {searchedIssue.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Progress Bar & Dots */}
                {(() => {
                  const statusDetails = getStatusDetails(searchedIssue.status);
                  const step = statusDetails.step;
                  const steps = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

                  return (
                    <div className="mt-4">
                      <div className="relative flex items-center justify-between">
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-100 z-0" />
                        <div 
                          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-blue-600 z-0 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, ((step - 1) / (steps.length - 1)) * 100))}%` }}
                        />

                        {steps.map((label, idx) => {
                          const num = idx + 1;
                          const isDone = step >= num;
                          const isCurrent = step === num;
                          return (
                            <div key={label} className="relative z-10 flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isCurrent
                                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md scale-110'
                                    : isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border-2 border-slate-200 text-slate-400'
                                }`}
                              >
                                {isDone && !isCurrent ? '✓' : num}
                              </div>
                              <span className={`text-[11px] mt-2 font-medium ${isCurrent ? 'text-blue-900 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Info Breakdown: Location, Department, SLA */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-200 bg-slate-50/50">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Incident Location</span>
                  <p className="text-xs font-semibold text-slate-800">{searchedIssue.location.address}</p>
                  {searchedIssue.location.landmark && (
                    <p className="text-[11px] text-slate-500">Ref: {searchedIssue.location.landmark}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Jurisdictional Dept</span>
                  <p className="text-xs font-semibold text-slate-800">{searchedIssue.department}</p>
                  <p className="text-[11px] text-slate-500">{searchedIssue.categoryLabel}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Assigned Team</span>
                  {searchedIssue.assignedTo ? (
                    <>
                      <p className="text-xs font-semibold text-slate-800">{searchedIssue.assignedTo.crewName}</p>
                      <p className="text-[11px] text-slate-500">Lead: {searchedIssue.assignedTo.officer}</p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Central Queue / Pending Assignment</p>
                  )}
                </div>
              </div>

              {/* Verified Timeline Log */}
              <div className="p-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Official Remediation Timeline
                </h4>
                <div className="relative border-l-2 border-slate-200 pl-4 ml-2 space-y-4">
                  {searchedIssue.timeline.map((event) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-1 ring-blue-200" />
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-900">{event.title}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{formatDate(event.timestamp)}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-blue-600 font-semibold">{event.author}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600">{event.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Complaint Not Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No civic complaint matches the query "{searchQuery}". Please verify your ticket number format (e.g. CF-2026-XXXX).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
