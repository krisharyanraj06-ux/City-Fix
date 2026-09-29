import React, { useState, useEffect, useCallback } from 'react';
import { CivicIssue, CivicStats, IssueStatus } from './types/civic';
import { 
  fetchIssues, 
  fetchCivicStats, 
  createIssue, 
  updateIssueStatus, 
  upvoteIssue, 
  addIssueComment,
  resetSeedData
} from './services/api';
import { Navbar, NavTab } from './components/Navbar';
import { ExploreFeedView } from './components/ExploreFeedView';
import { TrackerView } from './components/TrackerView';
import { AnalyticsView } from './components/AnalyticsView';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { IssueDetailModal } from './components/IssueDetailModal';
import { ReportIssueModal } from './components/ReportIssueModal';
import { CivicVisionSection } from './components/CivicVisionSection';
import { AboutGoalView } from './components/AboutGoalView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { SmartCityBackground } from './components/SmartCityBackground';
import { 
  Building2, 
  ShieldCheck, 
  Phone, 
  FileText, 
  HeartHandshake,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <CityFixPortal />
    </AuthProvider>
  );
}

function CityFixPortal() {
  const { currentUser, openAuthModal } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('explore');
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [stats, setStats] = useState<CivicStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Selection state
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthorityMode, setIsAuthorityMode] = useState(false);
  const [trackedTicketId, setTrackedTicketId] = useState<string>('');

  const handleOpenReportModal = useCallback(() => {
    if (!currentUser) {
      openAuthModal('prompt', () => setIsReportModalOpen(true));
    } else {
      setIsReportModalOpen(true);
    }
  }, [currentUser, openAuthModal]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedIssues, fetchedStats] = await Promise.all([
        fetchIssues(),
        fetchCivicStats(),
      ]);
      setIssues(fetchedIssues);
      setStats(fetchedStats);
    } catch (err) {
      console.error('Failed to load civic data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle New Complaint
  const handleCreateIssue = async (newIssueData: Partial<CivicIssue>): Promise<CivicIssue> => {
    const created = await createIssue(newIssueData);
    setIssues((prev) => [created, ...prev]);
    // Refresh stats
    fetchCivicStats().then(setStats);
    showToast(`Complaint ${created.id} officially registered!`);
    return created;
  };

  // Handle Upvote
  const handleUpvote = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      // Optimistic update
      setIssues((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item
        )
      );
      if (selectedIssue && selectedIssue.id === id) {
        setSelectedIssue((prev) => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
      }

      await upvoteIssue(id);
      showToast('Thank you! Your vote adds urgency to this complaint.');
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  // Handle Status Update (Authority action)
  const handleUpdateStatus = async (
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
  ) => {
    const updated = await updateIssueStatus(id, data);
    setIssues((prev) => prev.map((item) => (item.id === id ? updated : item)));
    if (selectedIssue && selectedIssue.id === id) {
      setSelectedIssue(updated);
    }
    fetchCivicStats().then(setStats);
    showToast(`Work order updated: ${updated.id} set to ${updated.status.replace('_', ' ').toUpperCase()}`);
  };

  // Handle Comment Submission
  const handleAddComment = async (
    id: string,
    comment: { author: string; content: string; role: 'citizen' | 'official' }
  ) => {
    const newComment = await addIssueComment(id, comment);
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            comments: [...(item.comments || []), newComment],
          };
        }
        return item;
      })
    );

    if (selectedIssue && selectedIssue.id === id) {
      setSelectedIssue((prev) =>
        prev
          ? {
              ...prev,
              comments: [...(prev.comments || []), newComment],
            }
          : null
      );
    }
    showToast('Comment posted to public audit log.');
  };

  // Reset to seed data
  const handleResetSeed = async () => {
    await resetSeedData();
    await loadData();
    showToast('Registry restored to default municipal dataset.');
  };

  return (
    <div className="min-h-screen relative flex flex-col text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Living Multiverse Biophilic Smart City Animated Backdrop */}
      <SmartCityBackground />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === 'authority') {
            setIsAuthorityMode(true);
          }
        }}
        onOpenReportModal={handleOpenReportModal}
        isAuthorityMode={isAuthorityMode}
        onToggleAuthorityMode={() => {
          setIsAuthorityMode(!isAuthorityMode);
          if (!isAuthorityMode) {
            setCurrentTab('authority');
          } else if (currentTab === 'authority') {
            setCurrentTab('explore');
          }
        }}
      />

      {/* Main Container with Frosted Glass Layering */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">
              Connecting to Municipal Incident Registry...
            </p>
          </div>
        ) : (
          <>
            {currentTab === 'explore' && (
              <>
                <ExploreFeedView
                  issues={issues}
                  selectedIssueId={selectedIssue?.id || null}
                  onSelectIssue={(issue) => setSelectedIssue(issue)}
                  onUpvote={handleUpvote}
                  onOpenReportModal={handleOpenReportModal}
                />
                <CivicVisionSection />
              </>
            )}

            {currentTab === 'track' && (
              <TrackerView
                allIssues={issues}
                initialSearchId={trackedTicketId}
                onSelectIssue={(issue) => setSelectedIssue(issue)}
                onUpvote={handleUpvote}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView stats={stats} />
            )}

            {currentTab === 'about' && (
              <AboutGoalView
                onExploreIssues={() => setCurrentTab('explore')}
                onOpenReportModal={handleOpenReportModal}
                onViewAnalytics={() => setCurrentTab('analytics')}
              />
            )}

            {currentTab === 'vision' && (
              <CivicVisionSection />
            )}

            {currentTab === 'authority' && (
              <AuthorityDashboard
                issues={issues}
                onSelectIssue={(issue) => setSelectedIssue(issue)}
                onUpdateStatus={handleUpdateStatus}
                onResetSeed={handleResetSeed}
              />
            )}
          </>
        )}
      </main>

      {/* Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpvote={handleUpvote}
          onAddComment={handleAddComment}
          isAuthorityMode={isAuthorityMode}
          onOpenAuthorityAction={() => {
            setCurrentTab('authority');
          }}
        />
      )}

      {/* Report Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateIssue}
        onTrackCreatedIssue={(ticketId) => {
          setTrackedTicketId(ticketId);
          setCurrentTab('track');
        }}
      />

      {/* Citizen Authentication Modal */}
      <AuthModal />

      {/* Municipal Footer with Glass Blur */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/85 backdrop-blur-md text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Brand & Charter */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-slate-200 p-0.5 shadow-sm">
                  <img
                    src="/cityfix-logo.jpg"
                    alt="CityFix Official Emblem"
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <span className="font-extrabold text-slate-900 text-sm">
                  CityFix
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold border border-blue-200">
                  SMART GOV
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Empowering citizens and municipal engineers with open civic reporting, geocoded dispatching, and transparent SLA tracking for long-term urban sustainability.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurrentTab('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors pt-1"
              >
                <span>Read About Our Goal & Economic Motive</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>

            {/* Col 2: Municipal Services */}
            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-2">
                Municipal Services
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li>• Public Works & Road Repair</li>
                <li>• Water Supply & Hydrant Maintenance</li>
                <li>• Street Lighting & Electrical Grid</li>
                <li>• Solid Waste & Compactor Routing</li>
                <li>• Parks, Recreation & Urban Safety</li>
              </ul>
            </div>

            {/* Col 3: Citizen Rights & SLAs */}
            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-2">
                Citizen Governance Charter
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>24-Hour Safety Triage Guarantee</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>100% Photographic Sign-off Proof</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Anonymous Reporting Supported</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Urgent Contact */}
            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block mb-2">
                Emergency & Escalations
              </span>
              <p className="text-xs text-slate-600 mb-2">
                For gas leaks, fallen live power lines, or active flash flooding:
              </p>
              <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <span>Immediate Danger: Call 911 / 311</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              © 2026 Municipal Digital Governance Administration. All Public Records Open Access.
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                type="button"
                onClick={() => {
                  setCurrentTab('vision');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className="hover:text-emerald-600 font-semibold text-slate-600 transition-colors"
              >
                2035 Civic Vision & Sustainability
              </button>
              <span>·</span>
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Open Data API</span>
              <span>·</span>
              <span>Service Level Agreements (SLA)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
