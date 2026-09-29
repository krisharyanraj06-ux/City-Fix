import React from 'react';
import { 
  Target, 
  TrendingUp, 
  Heart, 
  Cpu, 
  Database, 
  Leaf, 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  BarChart3, 
  Zap, 
  Layers, 
  Users,
  Clock,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AboutGoalViewProps {
  onExploreIssues: () => void;
  onOpenReportModal: () => void;
  onViewAnalytics: () => void;
}

export const AboutGoalView: React.FC<AboutGoalViewProps> = ({
  onExploreIssues,
  onOpenReportModal,
  onViewAnalytics,
}) => {
  const { currentUser, openAuthModal } = useAuth();

  const handleReportClick = () => {
    if (!currentUser) {
      openAuthModal('prompt', onOpenReportModal);
    } else {
      onOpenReportModal();
    }
  };
  return (
    <div className="space-y-10 animate-in fade-in duration-300 pb-12">
      {/* 1. Grand Mission Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 sm:p-12 shadow-2xl border border-blue-500/20">
        {/* Ambient background glow & grid */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-blue-400" />
            <span>Civic Purpose & Urban Charter</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            About Our Goal
          </h1>

          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
            <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
              <span className="text-emerald-300 font-bold">Our Core Motive: </span>
              “To drive economic growth and improve the quality of life for citizens by using digital technology, data, and sustainable urban planning.”
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            CityFix bridges the divide between daily resident lived experience and municipal civil engineering. By turning every citizen smartphone into a high-precision civic sensor and holding departments accountable to public SLAs, we transform urban maintenance from reactive complaints into a predictive engine for regional prosperity.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReportClick}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Target className="w-4 h-4" />
              <span>Report an Issue & Help Your City</span>
            </button>
            <button
              type="button"
              onClick={onViewAnalytics}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Inspect Real-Time City Analytics</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. The Three Strategic Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            The Triad of Transformation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How We Deliver On Our Goal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            A synchronized framework where technology, economic vitality, and citizen welfare reinforce one another.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Economic Growth */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-md p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase block">
                Pillar 01
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Driving Economic Growth
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Broken civic infrastructure silently bleeds commercial vitality. Flooded junctions, arterial potholes, and unlit commercial avenues cause traffic bottlenecks, destroy delivery logistics, and drive down business footfall.
            </p>

            <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Reduced Fleet Losses:</strong> Saves an estimated ₹140M annually in vehicular suspension wear and transit delays.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Thriving Commercial Corridors:</strong> Bailey Road and Saguna More businesses experience higher evening foot traffic with uninterrupted lighting.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Attracting Global Investment:</strong> Transparent SLA infrastructure creates an attractive climate for tech campuses and educational institutions.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Improving Quality of Life */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-md p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-rose-600 tracking-wider uppercase block">
                Pillar 02
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Improving Quality of Life
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Civic well-being begins with dignity, safety, and rapid municipal responsiveness. Every resident deserves clean streets, safe night-time walking paths, potable water, and prompt municipal action.
            </p>

            <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Student & Pedestrian Safety:</strong> Safe crossings and illuminated streetways around Amity University and DPS More.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Disease & Waterlogging Prevention:</strong> Clearing clogged culverts prevents seasonal dengue and urban flash-flooding.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Civic Empowerment:</strong> Residents can track their grievances live with photos, officer notes, and SMS milestones.</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Digital Tech, Data & Sustainability */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-md p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase block">
                Pillar 03
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Tech, Data & Sustainable Planning
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              We leverage GIS vector mapping, open data telemetry, and circular sustainability to design an urban fabric that endures for generations without exhausting municipal budgets.
            </p>

            <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>GIS Hotspot Clustering:</strong> Automated detection of chronic road degradation to guide permanent repaving over temporary patches.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Clean Fuel Route Optimization:</strong> Municipal work trucks use AI-optimized dispatch paths, reducing CO₂ emissions by 32%.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Green Energy Urban Corridors:</strong> Transitioning streetlights to solar micro-grids and integrating permeable bio-swales.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Technology Stack & Data Architecture */}
      <section className="rounded-3xl bg-white/90 backdrop-blur-md p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">
              Digital Governance Infrastructure
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              How Digital Technology and Data Power the Mission
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-semibold">
            v2.4 Smart Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Compass className="w-4 h-4" />
              <span className="font-bold text-xs text-slate-900">1. Citizen Telemetry</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              GPS geocoding, photo verification, and ward-based tagging capture hyper-local ground truth in seconds.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600">
              <Database className="w-4 h-4" />
              <span className="font-bold text-xs text-slate-900">2. Automated Triage</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Algorithmic prioritization routes urgent safety hazards directly to specialized field engineers with target SLAs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <Zap className="w-4 h-4" />
              <span className="font-bold text-xs text-slate-900">3. Field Dispatch</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Municipal maintenance units receive optimized route batches, lowering fuel consumption and time-to-repair.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <Layers className="w-4 h-4" />
              <span className="font-bold text-xs text-slate-900">4. Predictive Planning</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Incident trends feed long-term capital budget allocation for sustainable drainage, roads, and grid upgrades.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Target Goals & Milestones */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-blue-600 text-white shadow-md space-y-1">
          <Clock className="w-5 h-5 text-blue-200" />
          <p className="text-2xl font-black font-mono">48 Hours</p>
          <p className="text-xs text-blue-100 font-semibold">Average Resolution SLA</p>
          <span className="text-[10px] text-blue-200 block pt-1">Down from 14 days traditional turnaround</span>
        </div>

        <div className="p-6 rounded-3xl bg-emerald-700 text-white shadow-md space-y-1">
          <TrendingUp className="w-5 h-5 text-emerald-200" />
          <p className="text-2xl font-black font-mono">₹140M+</p>
          <p className="text-xs text-emerald-100 font-semibold">Economic Delay Cost Saved</p>
          <span className="text-[10px] text-emerald-200 block pt-1">Across transport & commerce corridors</span>
        </div>

        <div className="p-6 rounded-3xl bg-indigo-700 text-white shadow-md space-y-1">
          <Users className="w-5 h-5 text-indigo-200" />
          <p className="text-2xl font-black font-mono">100%</p>
          <p className="text-xs text-indigo-100 font-semibold">Public Audit Transparency</p>
          <span className="text-[10px] text-indigo-200 block pt-1">Every work order visible to community</span>
        </div>

        <div className="p-6 rounded-3xl bg-teal-700 text-white shadow-md space-y-1">
          <Leaf className="w-5 h-5 text-teal-200" />
          <p className="text-2xl font-black font-mono">-32%</p>
          <p className="text-xs text-teal-100 font-semibold">Carbon Emissions Reduced</p>
          <span className="text-[10px] text-teal-200 block pt-1">Via optimized dispatch and green logistics</span>
        </div>
      </section>

      {/* 5. Citizen Participation Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Every Report Is an Investment in Our Shared Future
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Sustainable urban growth is not built by municipal departments alone; it is co-created with vigilant citizens who care about their neighborhoods. Join us in shaping a cleaner, smarter, and economically thriving city.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReportClick}
            className="px-6 py-3 rounded-xl bg-white text-blue-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Report an Issue</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>
          <button
            type="button"
            onClick={onExploreIssues}
            className="px-5 py-3 rounded-xl bg-blue-900/40 border border-white/20 text-white font-bold text-xs hover:bg-blue-900/60 transition-all"
          >
            <span>View Public Feed</span>
          </button>
        </div>
      </section>
    </div>
  );
};
