import React, { useEffect, useRef, useState } from 'react';
import { Leaf, Sun, Wind, Sparkles, Eye, EyeOff } from 'lucide-react';

interface SmartCityBackgroundProps {
  opacity?: number;
}

export const SmartCityBackground: React.FC<SmartCityBackgroundProps> = ({
  opacity = 0.95,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'twilight'>('day');
  const [showBackdropControls, setShowBackdropControls] = useState(false);
  const [ambientIntensity, setAmbientIntensity] = useState<'normal' | 'cinematic'>('normal');

  // Floating solar pollen & light motes canvas effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle definition: bio-luminescent solar spore motes
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulseSpeed: number;
      pulseOffset: number;
      hue: number;
    }

    const particlesCount = Math.min(width < 768 ? 35 : 70, 90);
    const particles: Particle[] = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.4 ? 155 : 190, // Emerald biophilic green vs cyan solar
      });
    }

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Render floating bioluminescent motes
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulseOffset += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulseOffset));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${currentOpacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 55%, ${currentOpacity * 0.8})`;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [timeOfDay]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-1000"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* 1. Base Utopian Sky Gradient */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          timeOfDay === 'day'
            ? 'bg-gradient-to-b from-sky-100 via-emerald-50/70 to-slate-100'
            : 'bg-gradient-to-b from-slate-900 via-teal-950 to-slate-950'
        }`}
      />

      {/* 2. Soft Multiverse Sunbeam / Solar Caustics Glow */}
      <div 
        className={`absolute -top-32 -left-20 w-[850px] h-[850px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
          timeOfDay === 'day'
            ? 'bg-gradient-to-br from-amber-200/35 via-emerald-200/25 to-sky-300/20'
            : 'bg-gradient-to-br from-emerald-500/15 via-teal-400/10 to-indigo-600/15'
        }`}
      />

      <div 
        className={`absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 ${
          timeOfDay === 'day'
            ? 'bg-gradient-to-bl from-teal-200/30 via-emerald-100/35 to-blue-200/20'
            : 'bg-gradient-to-bl from-cyan-600/15 via-emerald-700/10 to-transparent'
        }`}
      />

      {/* 3. Layered Vector Skyline of Earth-838 Biophilic Metropolis */}
      <div className="absolute inset-x-0 bottom-0 h-[680px] w-full flex items-end">
        {/* Layer A: Far Distant Spires & Mega Solarpunk Arcs (Subtle Silhouette) */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-[620px] text-slate-300/40 dark:text-teal-900/30"
          preserveAspectRatio="none"
          viewBox="0 0 1600 600"
          fill="none"
        >
          {/* Distant Spire 1 (Solar Crystal Tower) */}
          <path
            d="M 120 600 L 140 180 L 160 80 L 180 180 L 200 600 Z"
            fill={timeOfDay === 'day' ? '#c7dfd6' : '#0c2e28'}
            opacity="0.5"
          />
          {/* Circular Clean Energy Ring on Distant Tower */}
          <ellipse
            cx="160"
            cy="140"
            rx="45"
            ry="12"
            stroke={timeOfDay === 'day' ? '#10b981' : '#34d399'}
            strokeWidth="2.5"
            strokeDasharray="6 4"
            fill="none"
            className="animate-spin origin-[160px_140px]"
            style={{ animationDuration: '40s' }}
          />

          {/* Distant Terraced Arc Tower */}
          <path
            d="M 320 600 Q 380 200 480 150 Q 560 220 620 600 Z"
            fill={timeOfDay === 'day' ? '#d0e5de' : '#0d3730'}
            opacity="0.45"
          />

          {/* Central Mega Crystalline Arc (Illuminati Multiverse Spire) */}
          <path
            d="M 740 600 L 780 120 L 800 40 L 820 120 L 860 600 Z"
            fill={timeOfDay === 'day' ? '#bdded4' : '#10433a'}
            opacity="0.6"
          />
          <ellipse
            cx="800"
            cy="110"
            rx="75"
            ry="20"
            stroke={timeOfDay === 'day' ? '#0ea5e9' : '#38bdf8'}
            strokeWidth="3"
            strokeDasharray="8 6"
            fill="none"
            className="animate-spin origin-[800px_110px]"
            style={{ animationDuration: '60s' }}
          />

          {/* Distant Biophilic Curve Spire */}
          <path
            d="M 1040 600 Q 1100 240 1180 160 Q 1240 230 1280 600 Z"
            fill={timeOfDay === 'day' ? '#cde1db' : '#0c3029'}
            opacity="0.45"
          />

          {/* East Solar Obelisk */}
          <path
            d="M 1390 600 L 1420 160 L 1440 90 L 1460 160 L 1490 600 Z"
            fill={timeOfDay === 'day' ? '#c2ddd4' : '#0e3a32'}
            opacity="0.5"
          />
        </svg>

        {/* Layer B: Midground Biophilic Skyscraper Towers with Vertical Forest Terraces */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-[480px]"
          preserveAspectRatio="none"
          viewBox="0 0 1600 500"
          fill="none"
        >
          {/* Definitions for gradients and textures */}
          <defs>
            <linearGradient id="towerGlassDay" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#bae6fd" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="towerGlassTwilight" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f2b38" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#064e3b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#042f2e" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="energyBeam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Tower 1 (West Campus / Amity Eco-Tower style) */}
          <g>
            <path
              d="M 40 500 L 70 180 C 110 160 150 170 180 180 L 210 500 Z"
              fill={timeOfDay === 'day' ? 'url(#towerGlassDay)' : 'url(#towerGlassTwilight)'}
              stroke={timeOfDay === 'day' ? '#93c5fd' : '#14b8a6'}
              strokeWidth="1.5"
            />
            {/* Cascading Green Terraces on Tower 1 */}
            <path d="M 60 220 Q 125 210 190 220 L 190 232 Q 125 222 60 232 Z" fill="#10b981" />
            <path d="M 55 270 Q 125 258 195 270 L 195 282 Q 125 270 55 282 Z" fill="#059669" />
            <path d="M 50 320 Q 125 306 200 320 L 200 332 Q 125 318 50 332 Z" fill="#047857" />
            <path d="M 45 380 Q 125 365 205 380 L 205 392 Q 125 377 45 392 Z" fill="#065f46" />

            {/* Glowing Vertical Fiber Line */}
            <line
              x1="125"
              y1="170"
              x2="125"
              y2="490"
              stroke="#34d399"
              strokeWidth="2"
              strokeDasharray="12 8"
              opacity="0.8"
            />
          </g>

          {/* Tower 2: High Biophilic Hexagonal Spire with Rooftop Glass Arboretum */}
          <g>
            <path
              d="M 270 500 L 300 130 L 370 70 L 440 130 L 470 500 Z"
              fill={timeOfDay === 'day' ? 'url(#towerGlassDay)' : 'url(#towerGlassTwilight)'}
              stroke={timeOfDay === 'day' ? '#6ee7b7' : '#059669'}
              strokeWidth="2"
            />
            {/* Glass Geodesic Dome Arboretum at Peak */}
            <ellipse
              cx="370"
              cy="75"
              rx="40"
              ry="25"
              fill={timeOfDay === 'day' ? '#ecfdf5' : '#064e3b'}
              stroke="#10b981"
              strokeWidth="2"
            />
            {/* Mini Trees in Dome */}
            <circle cx="360" cy="72" r="6" fill="#10b981" />
            <circle cx="375" cy="70" r="7" fill="#059669" />
            <circle cx="385" cy="74" r="5" fill="#34d399" />

            {/* Hanging Planter Balconies */}
            <rect x="295" y="170" width="150" height="12" rx="6" fill="#10b981" opacity="0.9" />
            <rect x="290" y="230" width="160" height="12" rx="6" fill="#059669" opacity="0.9" />
            <rect x="285" y="300" width="170" height="14" rx="7" fill="#047857" opacity="0.9" />
            <rect x="280" y="380" width="180" height="14" rx="7" fill="#065f46" opacity="0.9" />
          </g>

          {/* Elevated High-Speed Sky-Transit Tube between Tower 1 & 2 */}
          <path
            d="M 180 260 C 230 250 250 240 300 240"
            stroke={timeOfDay === 'day' ? '#38bdf8' : '#22d3ee'}
            strokeWidth="5"
            strokeOpacity="0.75"
            fill="none"
          />

          {/* Central Complex: Multiverse Grand Solarpunk Citadel */}
          <g>
            {/* Base terraced structure */}
            <path
              d="M 620 500 L 660 160 C 720 100 880 100 940 160 L 980 500 Z"
              fill={timeOfDay === 'day' ? 'url(#towerGlassDay)' : 'url(#towerGlassTwilight)'}
              stroke={timeOfDay === 'day' ? '#38bdf8' : '#0284c7'}
              strokeWidth="2"
            />
            {/* Center Crown Spire with Vertical Wind Turbine Ribbon */}
            <rect x="785" y="40" width="30" height="120" rx="6" fill={timeOfDay === 'day' ? '#dbeafe' : '#0c4a6e'} />
            <path
              d="M 790 40 Q 800 20 810 40 Q 800 60 790 40 Z"
              fill="#10b981"
            />

            {/* Lush Tiered Sky-Courtyards */}
            <path d="M 670 200 Q 800 180 930 200 L 930 216 Q 800 196 670 216 Z" fill="#10b981" />
            <path d="M 655 260 Q 800 240 945 260 L 945 276 Q 800 256 655 276 Z" fill="#059669" />
            <path d="M 640 330 Q 800 310 960 330 L 960 348 Q 800 328 640 348 Z" fill="#047857" />
            <path d="M 630 410 Q 800 390 970 410 L 970 430 Q 800 410 630 430 Z" fill="#065f46" />

            {/* Glowing Core Energy Conduit */}
            <line
              x1="800"
              y1="120"
              x2="800"
              y2="495"
              stroke="#06b6d4"
              strokeWidth="4"
              strokeDasharray="16 10"
              opacity="0.85"
            />
          </g>

          {/* East Biophilic Twin Towers (DPS More / Green Energy Innovation Hub) */}
          <g>
            <path
              d="M 1120 500 L 1150 140 C 1190 120 1230 120 1270 140 L 1300 500 Z"
              fill={timeOfDay === 'day' ? 'url(#towerGlassDay)' : 'url(#towerGlassTwilight)'}
              stroke={timeOfDay === 'day' ? '#6ee7b7' : '#14b8a6'}
              strokeWidth="2"
            />
            {/* Helical Solar Ribbon wrapping around tower */}
            <path
              d="M 1140 210 Q 1210 180 1280 230"
              stroke="#34d399"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M 1130 290 Q 1210 260 1290 310"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M 1125 380 Q 1210 350 1295 400"
              stroke="#059669"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />

            {/* Spire solar crystal at top */}
            <polygon
              points="1210,80 1220,110 1210,130 1200,110"
              fill="#38bdf8"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
          </g>

          {/* Far East Needle Hub */}
          <g>
            <path
              d="M 1420 500 L 1450 190 L 1475 90 L 1500 190 L 1530 500 Z"
              fill={timeOfDay === 'day' ? 'url(#towerGlassDay)' : 'url(#towerGlassTwilight)'}
              stroke={timeOfDay === 'day' ? '#93c5fd' : '#0369a1'}
              strokeWidth="1.5"
            />
            <rect x="1440" y="240" width="70" height="10" rx="5" fill="#10b981" />
            <rect x="1435" y="320" width="80" height="10" rx="5" fill="#059669" />
          </g>

          {/* Grand Translucent Skybridge Corridor connecting Central Citadel to East Hub */}
          <path
            d="M 940 260 C 1010 240 1060 220 1140 210"
            stroke={timeOfDay === 'day' ? '#38bdf8' : '#06b6d4'}
            strokeWidth="6"
            strokeOpacity="0.8"
            fill="none"
          />
        </svg>

        {/* Layer C: Animated High-Speed Maglev Pods Gliding along Translucent Skyways */}
        <div className="absolute inset-x-0 bottom-44 pointer-events-none h-10 w-full overflow-hidden">
          {/* Sky-Pod 1 moving West to East */}
          <div 
            className="absolute top-1 flex items-center gap-1 animate-city-glide-east"
            style={{ animationDuration: '28s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
          >
            <div className="w-12 h-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-sky-200 to-white shadow-md shadow-cyan-400/60 border border-white/80 flex items-center px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            </div>
            <div className="w-8 h-1 bg-gradient-to-r from-cyan-400/80 to-transparent rounded-full blur-[1px]" />
          </div>

          {/* Sky-Pod 2 moving East to West along lower corridor */}
          <div 
            className="absolute top-6 flex items-center gap-1 animate-city-glide-west"
            style={{ animationDuration: '34s', animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
          >
            <div className="w-8 h-1 bg-gradient-to-l from-emerald-400/80 to-transparent rounded-full blur-[1px]" />
            <div className="w-14 h-3.5 rounded-full bg-gradient-to-l from-emerald-400 via-teal-200 to-white shadow-md shadow-emerald-400/60 border border-white/80 flex items-center justify-end px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            </div>
          </div>
        </div>

        {/* Layer D: Foreground Biophilic Botanical Canopy & Ground Gardens */}
        <svg
          className="absolute inset-x-0 bottom-0 w-full h-[140px]"
          preserveAspectRatio="none"
          viewBox="0 0 1600 140"
          fill="none"
        >
          {/* Layer of rolling lush botanical park hills */}
          <path
            d="M 0 140 L 0 50 Q 200 20 400 45 Q 600 70 800 35 Q 1000 10 1200 40 Q 1400 65 1600 30 L 1600 140 Z"
            fill={timeOfDay === 'day' ? '#059669' : '#022c22'}
            opacity="0.9"
          />
          <path
            d="M 0 140 L 0 70 Q 250 40 500 65 Q 750 90 1000 55 Q 1250 30 1450 60 L 1600 45 L 1600 140 Z"
            fill={timeOfDay === 'day' ? '#047857' : '#011c15'}
            opacity="0.95"
          />
          {/* Subtle Ground Solar Path Lights */}
          <circle cx="200" cy="55" r="3" fill="#6ee7b7" />
          <circle cx="450" cy="68" r="3" fill="#6ee7b7" />
          <circle cx="720" cy="60" r="3" fill="#38bdf8" />
          <circle cx="980" cy="52" r="3" fill="#6ee7b7" />
          <circle cx="1250" cy="48" r="3" fill="#38bdf8" />
          <circle cx="1480" cy="62" r="3" fill="#6ee7b7" />
        </svg>
      </div>

      {/* 4. Canvas for Floating Solar Spores, Bio-Motes, and Upward Thermal Glints */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 5. Ambient City Aura Indicator & Controls Pill (Subtle bottom-left) */}
      <div className="fixed bottom-3 left-3 z-30 pointer-events-auto flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-sm text-[11px] font-medium text-slate-700 dark:text-slate-300">
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
          <Leaf className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Earth-838 Solarpunk Biosphere</span>
          <span className="sm:hidden">Bio-Skyline</span>
        </span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <button
          type="button"
          onClick={() => setTimeOfDay(timeOfDay === 'day' ? 'twilight' : 'day')}
          className="hover:text-blue-600 transition-colors flex items-center gap-1 text-[10px]"
          title="Toggle Daytime / Twilight Aura"
        >
          {timeOfDay === 'day' ? (
            <>
              <Sun className="w-3 h-3 text-amber-500" />
              <span className="hidden md:inline">Day</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline">Twilight</span>
            </>
          )}
        </button>
      </div>

      {/* Keyframe animations injected via inline style tag for smooth hardware acceleration */}
      <style>{`
        @keyframes cityGlideEast {
          0% {
            transform: translateX(-120px);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateX(1800px);
            opacity: 0;
          }
        }
        @keyframes cityGlideWest {
          0% {
            transform: translateX(1800px);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateX(-120px);
            opacity: 0;
          }
        }
        .animate-city-glide-east {
          animation: cityGlideEast 26s linear infinite;
        }
        .animate-city-glide-west {
          animation: cityGlideWest 32s linear infinite;
        }
      `}</style>
    </div>
  );
};
