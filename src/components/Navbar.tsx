import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  BarChart3, 
  PlusCircle, 
  ShieldCheck, 
  HardHat, 
  User, 
  SlidersHorizontal,
  Compass,
  Sparkles,
  Leaf,
  LogIn,
  LogOut,
  ChevronDown,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab = 'explore' | 'track' | 'analytics' | 'about' | 'vision' | 'authority';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenReportModal: () => void;
  isAuthorityMode: boolean;
  onToggleAuthorityMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenReportModal,
  isAuthorityMode,
  onToggleAuthorityMode,
}) => {
  const { currentUser, openAuthModal, signout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleReportClick = () => {
    if (!currentUser) {
      openAuthModal('prompt', onOpenReportModal);
    } else {
      onOpenReportModal();
    }
  };
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro-bar: civic notice & municipality status */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">City Municipal Operations Active</span>
          <span className="hidden sm:inline text-slate-500">·</span>
          <span className="hidden sm:inline text-slate-400">Public Works • Water Board • Electricity • Sanitation</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Emergency Helpline: <span className="text-white font-mono font-semibold">311 / 911</span></span>
          <div className="h-3 w-px bg-slate-700" />
          <button
            type="button"
            onClick={onToggleAuthorityMode}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            {isAuthorityMode ? (
              <>
                <User className="w-3 h-3" />
                <span>Switch to Citizen View</span>
              </>
            ) : (
              <>
                <HardHat className="w-3 h-3" />
                <span>Officer / Authority Login</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand with User Provided Image Logo */}
        <div 
          onClick={() => onTabChange('explore')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-blue-200 shadow-md shadow-blue-500/15 flex items-center justify-center group-hover:scale-105 group-hover:border-blue-400 transition-all p-0.5">
            <img
              src="/cityfix-logo.jpg"
              alt="CityFix Official Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-lg tracking-tight">
                CityFix
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                GOV PORTAL
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none">
              Citizen Reporting & Resolution
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            type="button"
            onClick={() => onTabChange('explore')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === 'explore'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Map & Feed</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('track')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === 'track'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Complaint</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('analytics')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === 'analytics'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>City Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('about')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === 'about'
                ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>About Our Goal</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('vision')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === 'vision'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Future & Sustainability</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('authority')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === 'authority'
                ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <HardHat className="w-3.5 h-3.5 text-blue-600" />
            <span>Authority Desk</span>
            {isAuthorityMode && (
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
            )}
          </button>
        </nav>

        {/* Right CTA & Citizen Profile */}
        <div className="flex items-center gap-2.5">
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="block text-xs font-bold leading-none">{currentUser.name}</span>
                  <span className="text-[10px] text-slate-500 font-normal leading-tight">
                    {currentUser.ward?.split(' - ')[0] || 'Resident'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-2.5"
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div className="border-b border-slate-100 pb-2.5 px-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Active Citizen Account
                    </span>
                    <p className="font-bold text-slate-900 text-sm">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    {currentUser.ward && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        {currentUser.ward}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 px-1 py-1">
                    <span className="text-slate-400 text-[11px] block">Reported Issues</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {currentUser.reportedIssueIds.length} Complaints Filed
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        signout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Citizen Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReportClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report an Issue</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50 text-xs">
        <button
          type="button"
          onClick={() => onTabChange('explore')}
          className={`flex-1 py-1 text-center font-medium ${currentTab === 'explore' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Feed
        </button>
        <button
          type="button"
          onClick={() => onTabChange('track')}
          className={`flex-1 py-1 text-center font-medium ${currentTab === 'track' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Track
        </button>
        <button
          type="button"
          onClick={() => onTabChange('analytics')}
          className={`flex-1 py-1 text-center font-medium ${currentTab === 'analytics' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Analytics
        </button>
        <button
          type="button"
          onClick={() => onTabChange('about')}
          className={`flex-1 py-1 text-center font-medium ${currentTab === 'about' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Our Goal
        </button>
        <button
          type="button"
          onClick={() => onTabChange('vision')}
          className={`flex-1 py-1 text-center font-medium ${currentTab === 'vision' ? 'text-emerald-600 font-bold' : 'text-slate-600'}`}
        >
          Vision
        </button>
        <button
          type="button"
          onClick={() => onTabChange('authority')}
          className={`flex-1 py-1 text-center font-medium ${currentTab === 'authority' ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
        >
          Authority
        </button>
      </div>
    </header>
  );
};

