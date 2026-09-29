import React, { useState } from 'react';
import { 
  Building2, 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  HeartHandshake, 
  TrendingUp, 
  Clock, 
  Droplets, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  Award,
  Users2
} from 'lucide-react';

export const CivicVisionSection: React.FC = () => {
  const [pledgeTaken, setPledgeTaken] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(1482);

  const handleTakePledge = () => {
    if (!pledgeTaken) {
      setPledgeTaken(true);
      setPledgeCount(prev => prev + 1);
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-slate-200 space-y-12">
      {/* Hero Header with Brand Logo & Vision Statement */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>THE LONG-TERM CIVIC HORIZON · SUSTAINABILITY & EMPOWERMENT</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Building a Resilient Smart City Through the Power of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400">
                Awakened Citizens
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              CityFix is not merely a complaint logger—it is a digital bridge transforming everyday citizens from passive bystanders into proactive custodians of our urban commons. Discover how continuous civic co-governance ensures long-term sustainability, eradicates daily living frustrations, and safeguards the future of our metropolis.
            </p>
          </div>

          {/* Logo Showcase Card */}
          <div className="shrink-0 flex flex-col items-center p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-md shadow-xl text-center max-w-xs">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-white p-1.5 shadow-lg border-2 border-blue-400/40 group hover:scale-105 transition-transform duration-300">
              <img
                src="/cityfix-logo.jpg"
                alt="CityFix Official Emblem"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <span className="mt-3 font-mono font-bold text-xs text-blue-400 tracking-wider uppercase">
              Official CityFix Emblem
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Symbol of connected smart infrastructure, cloud digital governance, and endless civic sustainability.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Fixing Our Daily Life Issues */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                Immediate Daily Impact
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Fixing Our Daily Life Frustrations
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Civic deterioration silently steals time, peace of mind, and hard-earned savings. By establishing direct lines between reporting citizens and municipal engineering dispatchers, CityFix resolves the friction points of everyday urban existence:
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Pothole-Free Commuting:</strong> Prevents costly rim bending, tire blowouts, and erratic vehicular swerving on transit corridors through rapid overnight cold-mix patching.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Nocturnal Safety & Dignity:</strong> Well-lit streets protect women, children, and late-shift workers, cutting neighborhood street crime and pedestrian vehicle collisions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Clean Sidewalks & Pure Water:</strong> Quick isolation of fractured water mains ensures drinking water reaches residential taps instead of flooding sidewalks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Eliminating Bureaucratic Red Tape:</strong> No endless phone transfers or office queues. Instant digital tickets with public accountability bring resolution to your doorstep.
              </span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Long-Term City Benefits & Economic Resilience */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                Economic & Structural Health
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Long-Term Economic Benefits to the City
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Minor neglect compounds into catastrophic municipal expenditure. Early intervention through citizen reporting transforms the financial health of the municipality:
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">1:10 Preventive Cost Savings:</strong> Sealing a hairline road fissure costs 1/10th of completely reconstructing a collapsed road sub-base. Millions in public tax funds are preserved annually.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Algorithmic Resource Dispatch:</strong> Repair crews, asphalt pavers, and sanitation trucks are dispatched based on geographic clustering, cutting fuel waste and wear.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Data-Driven Capital Budgeting:</strong> City planners leverage chronic issue heatmaps to replace aging water mains or redesign faulty intersections before accidents happen.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Higher Livability & Investment:</strong> Well-maintained urban wards attract clean businesses, boost local property values, and enhance municipal bond credit ratings.
              </span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: Sustainability & Urban Ecology */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block">
                Ecological Stewardship
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Sustainability & Eco-Resilient Urbanism
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Smart cities are sustainable cities. CityFix directly accelerates municipal sustainability goals by curtailing ecological waste:
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Preserving Potable Water:</strong> Rapid geocoded leak detection prevents millions of liters of treated drinking water from being squandered into storm drains.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Carbon Emission Mitigation:</strong> Smooth pavements lower vehicle rolling resistance and idling congestion. Smart streetlamp repair accelerates transition to energy-efficient LED corridors.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Groundwater & Soil Protection:</strong> Fast clearance of illegal waste spills and compactor overflows prevents toxic leachate from poisoning municipal waterways.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Thriving Urban Parks:</strong> Prompt maintenance of park playground equipment, fountains, and canopy trees preserves recreational green spaces for children and families.
              </span>
            </li>
          </ul>
        </div>

        {/* Pillar 4: Awakening the Citizen */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                Democratic Co-Governance
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Awakening the Citizen · Shared Ownership
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            The deepest transformation is psychological. A city flourishes not when citizens expect officials to do everything in secret, but when citizens feel true pride and ownership of their shared home:
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">From Apathy to Agency:</strong> When a resident reports a broken streetlight and sees an engineer fix it within 24 hours with verified photo proof, cynicism turns into civic trust.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Radical Anti-Corruption Transparency:</strong> Public audit logs, verifiable timestamps, and photo sign-offs ensure public funds are spent on genuine repairs with zero ghost work orders.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Community Cohesion & Upvoting:</strong> Neighbors join together to upvote local priorities, amplifying marginalized voices in underserved outer wards.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Intergenerational Stewardship:</strong> Instilling in children and young residents the conviction that our public streets, squares, and parks are sacred communal assets.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* 2035 Target Projections Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-blue-400 font-semibold">
              MUNICIPAL HORIZON 2026 – 2035
            </span>
            <h4 className="text-xl font-extrabold text-white mt-0.5">
              Projected Decade Impact Milestones
            </h4>
          </div>
          <span className="text-xs text-slate-400">
            Modeled on proactive citizen co-governance telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-center space-y-1">
            <span className="text-3xl font-black text-blue-400 font-mono">-64%</span>
            <span className="text-xs font-bold text-slate-200 block">Pavement Failures</span>
            <p className="text-[11px] text-slate-400">Early micro-repair prevents road rebuilds</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-center space-y-1">
            <span className="text-3xl font-black text-emerald-400 font-mono">380M+</span>
            <span className="text-xs font-bold text-slate-200 block">Liters Water Saved</span>
            <p className="text-[11px] text-slate-400">Preventing underground potable waste</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-center space-y-1">
            <span className="text-3xl font-black text-amber-400 font-mono">&lt; 18h</span>
            <span className="text-xs font-bold text-slate-200 block">Median Turnaround</span>
            <p className="text-[11px] text-slate-400">From submission to on-site remediation</p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-center space-y-1">
            <span className="text-3xl font-black text-indigo-400 font-mono">96.8%</span>
            <span className="text-xs font-bold text-slate-200 block">Public Trust Index</span>
            <p className="text-[11px] text-slate-400">Verified by open digital resolution sign-offs</p>
          </div>
        </div>
      </div>

      {/* The Awakened Citizen's Pledge */}
      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-blue-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-blue-600" />
            <span>The Awakened Citizen's Digital Covenant</span>
          </div>
          <h4 className="text-xl font-extrabold text-slate-900">
            Take the Awakened Citizen's Pledge Today
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            "I pledge to be the eyes and heart of my neighborhood. I will not pass by broken infrastructure in silence. I will report civic hazards, upvote neighborhood safety repairs, and protect our city's green and public spaces with pride and dignity."
          </p>
          <div className="text-[11px] text-slate-500 font-medium">
            Join <strong className="text-blue-700 font-mono">{pledgeCount.toLocaleString()}</strong> committed citizens actively shaping their city.
          </div>
        </div>

        <button
          type="button"
          onClick={handleTakePledge}
          className={`shrink-0 px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 ${
            pledgeTaken
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
          }`}
        >
          {pledgeTaken ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Pledge Confirmed · Awakened Citizen</span>
            </>
          ) : (
            <>
              <Users2 className="w-4 h-4" />
              <span>Sign the Citizen Pledge</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
