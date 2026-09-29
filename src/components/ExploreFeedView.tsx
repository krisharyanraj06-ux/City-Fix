import React, { useState, useMemo } from 'react';
import { CivicIssue, IssueCategory, IssueStatus } from '../types/civic';
import { CivicMap } from './CivicMap';
import { IssueCard } from './IssueCard';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
  PlusCircle,
  AlertCircle,
  Hammer,
  Lightbulb,
  Droplets,
  Trash2,
  Building2,
  TrafficCone,
  Layers,
  Map as MapIcon,
  List,
  UserCheck
} from 'lucide-react';

interface ExploreFeedViewProps {
  issues: CivicIssue[];
  selectedIssueId: string | null;
  onSelectIssue: (issue: CivicIssue) => void;
  onUpvote: (id: string, e: React.MouseEvent) => void;
  onOpenReportModal: () => void;
}

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All Categories' },
  { key: 'pothole', label: 'Potholes & Roads' },
  { key: 'streetlight', label: 'Streetlights & Power' },
  { key: 'water_leakage', label: 'Water Leakage' },
  { key: 'garbage', label: 'Garbage & Sanitation' },
  { key: 'infrastructure', label: 'Infrastructure & Parks' },
  { key: 'traffic_signal', label: 'Traffic & Signals' },
];

export const ExploreFeedView: React.FC<ExploreFeedViewProps> = ({
  issues,
  selectedIssueId,
  onSelectIssue,
  onUpvote,
  onOpenReportModal,
}) => {
  const { currentUser, openAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusTab, setStatusTab] = useState<'all' | 'active' | 'resolved' | 'my_issues'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'upvotes' | 'priority'>('upvotes');
  const [mobileTab, setMobileTab] = useState<'feed' | 'map'>('feed');
  const myIssuesCount = useMemo(() => {
    if (!currentUser) return 0;
    return issues.filter(i => 
      i.userId === currentUser.id || 
      currentUser.reportedIssueIds.includes(i.id) ||
      (currentUser.email && i.reporter?.email?.toLowerCase() === currentUser.email.toLowerCase())
    ).length;
  }, [issues, currentUser]);

  const handleReportClick = () => {
    if (!currentUser) {
      openAuthModal('prompt', onOpenReportModal);
    } else {
      onOpenReportModal();
    }
  };

  // Filter & sort logic
  const filteredIssues = useMemo(() => {
    let result = [...issues];

    // Status tab
    if (statusTab === 'active') {
      result = result.filter(i => i.status !== 'resolved' && i.status !== 'rejected');
    } else if (statusTab === 'resolved') {
      result = result.filter(i => i.status === 'resolved');
    } else if (statusTab === 'my_issues') {
      if (currentUser) {
        result = result.filter(i => 
          i.userId === currentUser.id || 
          currentUser.reportedIssueIds.includes(i.id) ||
          (currentUser.email && i.reporter?.email?.toLowerCase() === currentUser.email.toLowerCase())
        );
      } else {
        result = [];
      }
    }

    // Category
    if (categoryFilter !== 'all') {
      result = result.filter(i => i.category === categoryFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.id.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.location.address.toLowerCase().includes(q) ||
        i.department.toLowerCase().includes(q) ||
        i.ward.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'upvotes') {
      result.sort((a, b) => b.upvotes - a.upvotes);
    } else if (sortBy === 'priority') {
      const weight = { critical: 4, high: 3, medium: 2, low: 1 };
      result.sort((a, b) => weight[b.priority] - weight[a.priority]);
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [issues, statusTab, categoryFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-4">
      {/* Civic Action & Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4 max-w-2xl">
          <div className="hidden sm:flex relative w-16 h-16 rounded-2xl overflow-hidden bg-white p-1 shadow-lg shrink-0 border border-blue-300/40">
            <img src="/cityfix-logo.jpg" alt="CityFix Emblem" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[11px] font-bold tracking-wider text-blue-200 uppercase block">
              Official Municipal Citizen Service Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              See Something Broken? Report It to City Hall.
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Report road potholes, failing streetlights, waterline leaks, and overflowing waste. Your reports directly dispatch municipal maintenance units and track SLA resolution in public view.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReportClick}
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-blue-900 font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>Report a Problem</span>
        </button>
      </div>

      {/* Mobile Feed / Map Switcher */}
      <div className="lg:hidden flex items-center justify-center p-1 bg-slate-200 rounded-xl">
        <button
          type="button"
          onClick={() => setMobileTab('feed')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mobileTab === 'feed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          <List className="w-4 h-4" />
          <span>Complaints Feed ({filteredIssues.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('map')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mobileTab === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>GIS Map View</span>
        </button>
      </div>

      {/* Main Split Layout: Left Map / Right Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Interactive GIS Vector Map (Sticky on Desktop) */}
        <div className={`lg:col-span-6 lg:sticky lg:top-24 space-y-2 ${mobileTab === 'feed' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span className="flex items-center gap-1.5">
              <MapIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Smart City GIS Incident Density Map</span>
            </span>
            <span>Click any marker to inspect</span>
          </div>

          <div className="h-[520px] rounded-2xl overflow-hidden shadow-sm">
            <CivicMap
              issues={filteredIssues}
              selectedIssueId={selectedIssueId}
              onSelectIssue={onSelectIssue}
              activeCategoryFilter={categoryFilter}
            />
          </div>
        </div>

        {/* Right Side: Complaints Feed with Controls */}
        <div className={`lg:col-span-6 space-y-4 ${mobileTab === 'map' ? 'hidden lg:block' : 'block'}`}>
          {/* Controls Bar: Search, Status Tabs, Sort */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search complaints, streets, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Status Tabs & Sorting Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
              {/* Status Segmented Control */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setStatusTab('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    statusTab === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({issues.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusTab('active')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    statusTab === 'active'
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => setStatusTab('resolved')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    statusTab === 'resolved'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Resolved
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!currentUser) {
                      openAuthModal('signin', () => setStatusTab('my_issues'));
                    } else {
                      setStatusTab('my_issues');
                    }
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${
                    statusTab === 'my_issues'
                      ? 'bg-white text-indigo-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3 h-3 text-indigo-600" />
                  <span>My Complaints ({myIssuesCount})</span>
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ArrowUpDown className="w-3 h-3 text-slate-400" />
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="upvotes">Most Upvoted (Urgent)</option>
                  <option value="priority">Priority Severity</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Category Filter Horizontal Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {CATEGORY_FILTERS.map((cat) => {
                const isSelected = categoryFilter === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategoryFilter(cat.key)}
                    className={`whitespace-nowrap px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900">{filteredIssues.length}</strong> reported incidents
            </span>
            <span className="text-[11px]">
              Click card to inspect verified timeline & photo proof
            </span>
          </div>

          {/* Feed Issue Cards */}
          <div className="space-y-3">
            {filteredIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                isSelected={selectedIssueId === issue.id}
                onSelect={onSelectIssue}
                onUpvote={onUpvote}
              />
            ))}

            {filteredIssues.length === 0 && (
              <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">No matching issues found</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try clearing your search query or adjusting category filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setStatusTab('all');
                  }}
                  className="mt-2 px-3 py-1.5 text-xs text-blue-600 font-semibold hover:bg-blue-50 rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
