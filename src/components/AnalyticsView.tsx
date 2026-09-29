import React from 'react';
import { CivicStats } from '../types/civic';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Building2, 
  MapPin, 
  AlertTriangle 
} from 'lucide-react';

interface AnalyticsViewProps {
  stats: CivicStats | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs">
        Loading smart city analytics telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 max-w-6xl mx-auto">
      {/* Overview Hero Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold block mb-1">
          Smart City Governance Telemetry · Open Municipal Ledger
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Civic Resolution & Transparency Analytics
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Real-time accountability metrics detailing citizen complaints lodged, dispatch turnaround times, and departmental SLA compliance across all municipal wards.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Complaints
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {stats.totalIssues}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Logged in registry</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Resolution Rate
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {stats.overallResolutionRate}%
          </div>
          <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">Target: &gt;80%</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Avg Turnaround
          </span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {stats.avgResolutionDays} <span className="text-xs font-medium text-slate-500">days</span>
          </div>
          <span className="text-[10px] text-blue-600 font-medium mt-0.5 block">Fast field dispatch</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Active in Field
          </span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {stats.inProgressIssues}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Crews on-site</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Critical Hazards
          </span>
          <div className="text-2xl font-black text-red-600 mt-1">
            {stats.criticalIssues}
          </div>
          <span className="text-[10px] text-red-600 font-medium mt-0.5 block">Priority 1 triage</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Citizen Votes
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {stats.citizensEngaged}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Community feedback</span>
        </div>
      </div>

      {/* Two Column Layout: Department SLAs & Ward Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department SLA Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Departmental Performance & SLA Compliance
              </h3>
              <p className="text-xs text-slate-500">
                Work order closure efficiency per municipal engineering branch
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {stats.departmentMetrics.map((dept) => {
              return (
                <div key={dept.department} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{dept.department}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">
                        {dept.resolved} of {dept.total} resolved
                      </span>
                      <span className="font-bold text-emerald-600 font-mono">
                        {dept.slaComplianceRate}% SLA
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${dept.total > 0 ? Math.min(100, Math.round((dept.resolved / dept.total) * 100)) : 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Pending in queue: {dept.pending}</span>
                    <span>Avg resolution: ~{dept.avgResolutionHours}h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ward Distribution & Density */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Ward Issue Density & Risk Index
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of civic reports across city geographical sectors
            </p>
          </div>

          <div className="divide-y divide-slate-100 pt-2">
            {stats.wardMetrics.map((ward) => (
              <div key={ward.ward} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">{ward.ward}</span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>{ward.totalIssues} total complaints</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-emerald-600 font-medium">{ward.resolvedIssues} resolved</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ward.criticalIssues > 0 ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-200">
                      <AlertTriangle className="w-3 h-3" />
                      {ward.criticalIssues} Critical
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      Normal Density
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Citizen Governance Charter Note */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>MUNICIPAL DIGITAL CHARTER GUARANTEE</span>
          </div>
          <h4 className="text-base font-bold">
            Guaranteed Public Accountability & Photographic Verification
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every complaint registered on CityFix is assigned an immutable public tracking code. Issues cannot be marked as resolved without verified photographic proof and sign-off by a licensed municipal engineer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center min-w-[120px]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">SLA Commitment</span>
            <span className="text-lg font-bold text-white font-mono">24 - 48 Hours</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-center min-w-[120px]">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Verification</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">100% Photo Proof</span>
          </div>
        </div>
      </div>
    </div>
  );
};
