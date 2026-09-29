import React, { useState, useMemo } from 'react';
import { CivicIssue, IssueCategory, WardName } from '../types/civic';
import { 
  MapPin, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Flame, 
  Crosshair, 
  Compass, 
  GraduationCap,
  School,
  TrafficCone
} from 'lucide-react';

interface CivicMapProps {
  issues: CivicIssue[];
  selectedIssueId?: string | null;
  onSelectIssue?: (issue: CivicIssue) => void;
  pickerMode?: boolean;
  selectedCoordinates?: { lat: number; lng: number } | null;
  onPickCoordinates?: (coords: { lat: number; lng: number; ward: WardName; suggestedAddress: string }) => void;
  activeCategoryFilter?: string;
  onCategoryFilterChange?: (cat: string) => void;
}

// Map geographic bounds centered specifically on Amity University Patna & DPS More corridor
const MIN_LAT = 25.5960;
const MAX_LAT = 25.6260;
const MIN_LNG = 85.0380;
const MAX_LNG = 85.0780;

// Convert geographic lat/lng to SVG percentage (0 - 100)
function geoToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 100;
  // Invert Y since SVG 0 is at the top (higher latitude is up)
  const y = (1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * 100;
  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
  };
}

// Convert SVG click percentages back to approximate lat/lng
function svgToGeo(xPercent: number, yPercent: number): { lat: number; lng: number } {
  const lng = MIN_LNG + (xPercent / 100) * (MAX_LNG - MIN_LNG);
  const lat = MAX_LAT - (yPercent / 100) * (MAX_LAT - MIN_LAT);
  return {
    lat: Number(lat.toFixed(5)),
    lng: Number(lng.toFixed(5)),
  };
}

// Detect approximate ward based on position around Amity University & DPS More
function detectWard(x: number, y: number): { ward: WardName; address: string } {
  if (x >= 40 && x <= 65 && y >= 35 && y <= 65) {
    return { ward: 'Ward 1 - DPS More & Amity Campus', address: 'Near Amity University Patna Campus, Bailey Road' };
  } else if (x < 40 && y >= 35 && y <= 65) {
    return { ward: 'Ward 1 - DPS More & Amity Campus', address: 'DPS More Chowk, Delhi Public School Road, Rupaspur' };
  } else if (x > 65 && y >= 35 && y <= 65) {
    return { ward: 'Ward 2 - Bailey Road & Rupaspur', address: 'Rupaspur Flyover Ramp, Bailey Road Corridor' };
  } else if (x <= 30 && y >= 30) {
    return { ward: 'Ward 3 - Saguna More Hub', address: 'Saguna More Main Crossing, Danapur Link' };
  } else if (y < 35 && x >= 45) {
    return { ward: 'Ward 4 - Gola Road Sector', address: 'Gola Road Commercial Market, Near T-Point' };
  } else if (y > 65 && x <= 50) {
    return { ward: 'Ward 5 - Khagaul Canal Link', address: 'Khagaul Canal Bank Road, Danapur Station Side' };
  } else {
    return { ward: 'Ward 6 - Danapur Cantonment Zone', address: 'Danapur Cantonment Road' };
  }
}

export const CivicMap: React.FC<CivicMapProps> = ({
  issues,
  selectedIssueId,
  onSelectIssue,
  pickerMode = false,
  selectedCoordinates,
  onPickCoordinates,
  activeCategoryFilter = 'all',
  onCategoryFilterChange,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [hoveredIssue, setHoveredIssue] = useState<CivicIssue | null>(null);
  const [selectedWard, setSelectedWard] = useState<string>('all');

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      if (activeCategoryFilter !== 'all' && issue.category !== activeCategoryFilter) {
        return false;
      }
      if (selectedWard !== 'all' && issue.ward !== selectedWard) {
        return false;
      }
      return true;
    });
  }, [issues, activeCategoryFilter, selectedWard]);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pickerMode || !onPickCoordinates) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const geo = svgToGeo(x, y);
    const wardInfo = detectWard(x, y);

    onPickCoordinates({
      lat: geo.lat,
      lng: geo.lng,
      ward: wardInfo.ward,
      suggestedAddress: wardInfo.address,
    });
  };

  const pickerPos = useMemo(() => {
    if (!selectedCoordinates) return null;
    return geoToSvg(selectedCoordinates.lat, selectedCoordinates.lng);
  }, [selectedCoordinates]);

  return (
    <div className="relative w-full h-full min-h-[440px] bg-slate-950 rounded-xl overflow-hidden shadow-inner border border-slate-800 flex flex-col select-none">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Ward Selector */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 shadow-md text-xs text-slate-200">
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-medium text-slate-400">Ward:</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">All Patna Wards</option>
            <option value="Ward 1 - DPS More & Amity Campus" className="bg-slate-900 text-white">Ward 1 - DPS More & Amity Campus</option>
            <option value="Ward 2 - Bailey Road & Rupaspur" className="bg-slate-900 text-white">Ward 2 - Bailey Road & Rupaspur</option>
            <option value="Ward 3 - Saguna More Hub" className="bg-slate-900 text-white">Ward 3 - Saguna More Hub</option>
            <option value="Ward 4 - Gola Road Sector" className="bg-slate-900 text-white">Ward 4 - Gola Road Sector</option>
            <option value="Ward 5 - Khagaul Canal Link" className="bg-slate-900 text-white">Ward 5 - Khagaul Canal Link</option>
            <option value="Ward 6 - Danapur Cantonment Zone" className="bg-slate-900 text-white">Ward 6 - Danapur Cantonment Zone</option>
          </select>
        </div>

        {/* Right: Map Layers & Zoom */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-700/80 shadow-md text-xs text-slate-300">
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              showHeatmap ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium' : 'hover:bg-slate-800 text-slate-400'
            }`}
            title="Toggle Issue Density Heatmap"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Density Heatmap</span>
          </button>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => { setZoomLevel(1); setSelectedWard('all'); }}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Location Banner (Patna, DPS More & Amity University) */}
      <div className="absolute top-12 left-3 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-800 text-[11px] text-slate-300">
        <MapPin className="w-3 h-3 text-red-400" />
        <span className="font-semibold text-white">Patna GIS:</span>
        <span className="text-blue-300 font-mono">DPS More • Amity University • Bailey Road</span>
      </div>

      {/* Picker Mode Instruction Banner */}
      {pickerMode && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="flex items-center gap-2 bg-blue-600/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-blue-400 animate-pulse">
            <Crosshair className="w-4 h-4" />
            <span>Click on the map to pinpoint issue near Amity University / DPS More</span>
          </div>
        </div>
      )}

      {/* SVG GIS Map Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden cursor-crosshair">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          onClick={handleSvgClick}
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <defs>
            {/* Grid pattern for GIS gridlines */}
            <pattern id="gisGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.2" />
            </pattern>
            {/* Heatmap blur filter */}
            <filter id="heatBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
            {/* Pin Glow */}
            <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="0.8" floodColor="#38bdf8" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background GIS Grid */}
          <rect width="100" height="100" fill="#090d16" />
          <rect width="100" height="100" fill="url(#gisGrid)" />

          {/* Khagaul Canal Waterway (Sone Canal Link) */}
          <path
            d="M 12 100 C 18 80, 24 68, 20 50 C 16 35, 10 20, 4 0 L 8 0 C 14 20, 20 35, 24 50 C 28 68, 22 80, 16 100 Z"
            fill="#0369a1"
            fillOpacity="0.35"
            stroke="#0284c7"
            strokeWidth="0.4"
          />
          <text x="16" y="88" fill="#38bdf8" fontSize="1.8" opacity="0.5" textAnchor="middle" transform="rotate(-70 16 88)">
            Khagaul Canal Road
          </text>

          {/* Campus Polygon: AMITY UNIVERSITY PATNA */}
          <rect
            x="48"
            y="52"
            width="24"
            height="18"
            rx="1.5"
            fill="#1e3a8a"
            fillOpacity="0.3"
            stroke="#3b82f6"
            strokeWidth="0.5"
            strokeDasharray="1,0.5"
          />
          {/* Amity Building Outline */}
          <rect x="52" y="55" width="16" height="8" rx="0.8" fill="#2563eb" fillOpacity="0.4" stroke="#60a5fa" strokeWidth="0.3" />
          <circle cx="50" cy="54" r="1.5" fill="#3b82f6" />
          <text x="60" y="60.5" fill="#93c5fd" fontSize="2.2" fontWeight="700" textAnchor="middle">
            AMITY UNIVERSITY PATNA
          </text>
          <text x="60" y="66" fill="#60a5fa" fontSize="1.6" textAnchor="middle" opacity="0.8">
            Main Campus & Academic Block
          </text>

          {/* Delhi Public School (DPS) Campus Zone */}
          <rect
            x="28"
            y="26"
            width="18"
            height="15"
            rx="1.5"
            fill="#065f46"
            fillOpacity="0.25"
            stroke="#10b981"
            strokeWidth="0.4"
          />
          <text x="37" y="34" fill="#34d399" fontSize="2.0" fontWeight="700" textAnchor="middle">
            DELHI PUBLIC SCHOOL
          </text>
          <text x="37" y="38" fill="#10b981" fontSize="1.5" textAnchor="middle" opacity="0.8">
            DPS Patna Campus
          </text>

          {/* Major Arterial 1: BAILEY ROAD (Jawaharlal Nehru Marg) */}
          {/* Service road south */}
          <line x1="0" y1="51" x2="100" y2="51" stroke="#334155" strokeWidth="0.8" />
          {/* Main 6-lane carriageway */}
          <line x1="0" y1="48" x2="100" y2="48" stroke="#475569" strokeWidth="2.4" />
          <line x1="0" y1="48" x2="100" y2="48" stroke="#f1f5f9" strokeWidth="0.4" strokeDasharray="2,1.5" />
          {/* Service road north */}
          <line x1="0" y1="45" x2="100" y2="45" stroke="#334155" strokeWidth="0.8" />
          
          <text x="82" y="46.5" fill="#e2e8f0" fontSize="2.2" fontWeight="800" letterSpacing="0.1em">
            BAILEY ROAD (NH-98)
          </text>

          {/* DPS MORE CHOWK - Major Node & Flyover Underpass */}
          <circle cx="38" cy="48" r="4.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.8" />
          <circle cx="38" cy="48" r="2.5" fill="#0284c7" />
          <rect x="29" y="42" width="18" height="4" rx="1" fill="#0f172a" stroke="#38bdf8" strokeWidth="0.3" />
          <text x="38" y="44.8" fill="#38bdf8" fontSize="2.3" fontWeight="800" textAnchor="middle">
            DPS MORE CHOWK
          </text>

          {/* North Road to DPS & Gola Road Connector */}
          <line x1="38" y1="48" x2="38" y2="0" stroke="#334155" strokeWidth="1.2" />
          <line x1="38" y1="48" x2="38" y2="0" stroke="#64748b" strokeWidth="0.3" strokeDasharray="1,1" />
          <text x="40" y="16" fill="#94a3b8" fontSize="1.8" textAnchor="start">
            To DPS Road & Gola Rd
          </text>

          {/* Saguna More Crossing (West) */}
          <circle cx="10" cy="48" r="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="0.6" />
          <text x="10" y="43" fill="#f59e0b" fontSize="2.2" fontWeight="700" textAnchor="middle">
            SAGUNA MORE
          </text>
          <line x1="10" y1="48" x2="10" y2="100" stroke="#334155" strokeWidth="1.2" />
          <text x="11" y="70" fill="#94a3b8" fontSize="1.7">
            To Danapur Stn & AIIMS
          </text>

          {/* Rupaspur Flyover (East) */}
          <rect x="70" y="46.5" width="26" height="3" rx="1.5" fill="#475569" stroke="#94a3b8" strokeWidth="0.5" />
          <text x="83" y="52" fill="#cbd5e1" fontSize="1.8" fontWeight="600" textAnchor="middle">
            Rupaspur Flyover
          </text>

          {/* Gola Road Arterial (North East) */}
          <line x1="68" y1="48" x2="68" y2="0" stroke="#334155" strokeWidth="1.2" />
          <text x="70" y="20" fill="#94a3b8" fontSize="1.8">
            Gola Road Sector
          </text>

          {/* Danapur Link (South) */}
          <line x1="58" y1="70" x2="58" y2="100" stroke="#1e293b" strokeWidth="1.0" />

          {/* Quiet Ward Watermarks */}
          <g opacity="0.3" fontSize="2.0" fontWeight="600" fill="#64748b" letterSpacing="0.08em">
            <text x="56" y="76" textAnchor="middle">WARD 1 · AMITY & DPS SECTOR</text>
            <text x="84" y="65" textAnchor="middle">WARD 2 · RUPASPUR</text>
            <text x="14" y="32" textAnchor="middle">WARD 3 · SAGUNA MORE</text>
            <text x="80" y="12" textAnchor="middle">WARD 4 · GOLA ROAD</text>
            <text x="26" y="80" textAnchor="middle">WARD 5 · KHAGAUL CANAL</text>
          </g>

          {/* Heatmap Layer if activated */}
          {showHeatmap && (
            <g filter="url(#heatBlur)" opacity="0.75">
              {filteredIssues.map((issue) => {
                const pos = geoToSvg(issue.location.lat, issue.location.lng);
                const isCritical = issue.priority === 'critical';
                return (
                  <circle
                    key={`heat-${issue.id}`}
                    cx={pos.x}
                    cy={pos.y}
                    r={isCritical ? 8 : 5}
                    fill={isCritical ? '#ef4444' : '#f59e0b'}
                    opacity={isCritical ? 0.8 : 0.5}
                  />
                );
              })}
            </g>
          )}

          {/* Issue Pins */}
          {!showHeatmap && filteredIssues.map((issue) => {
            const pos = geoToSvg(issue.location.lat, issue.location.lng);
            const isSelected = selectedIssueId === issue.id;
            const isCritical = issue.priority === 'critical' && issue.status !== 'resolved';

            // Marker colors based on status
            let fillColor = '#f59e0b'; // amber (submitted / review)
            if (issue.status === 'assigned' || issue.status === 'in_progress') {
              fillColor = '#3b82f6'; // blue
            } else if (issue.status === 'resolved') {
              fillColor = '#10b981'; // green
            } else if (issue.status === 'rejected') {
              fillColor = '#64748b'; // slate
            }

            return (
              <g
                key={issue.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectIssue?.(issue);
                }}
                onMouseEnter={() => setHoveredIssue(issue)}
                onMouseLeave={() => setHoveredIssue(null)}
              >
                {/* Critical hazard pulse ring */}
                {isCritical && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="4.5"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="0.5"
                    opacity="0.9"
                  >
                    <animate attributeName="r" from="2" to="6" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="1" to="0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Selection outer indicator */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="3.8"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="0.8"
                    strokeDasharray="0.8,0.8"
                  />
                )}

                {/* Core Pin Dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 2.3 : 1.7}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth="0.4"
                  filter={isSelected ? 'url(#pinGlow)' : undefined}
                />

                {/* Micro Inner White Dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="0.5"
                  fill="#ffffff"
                />
              </g>
            );
          })}

          {/* Interactive Picker Pin (When citizen picks location) */}
          {pickerPos && (
            <g className="pointer-events-none">
              <circle
                cx={pickerPos.x}
                cy={pickerPos.y}
                r="4.8"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="0.7"
              >
                <animate attributeName="r" from="2" to="6.5" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="1" to="0" dur="1.4s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={pickerPos.x}
                cy={pickerPos.y}
                r="2.4"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="0.6"
              />
              <path
                d={`M ${pickerPos.x} ${pickerPos.y - 4} L ${pickerPos.x - 2.2} ${pickerPos.y - 7.5} L ${pickerPos.x + 2.2} ${pickerPos.y - 7.5} Z`}
                fill="#2563eb"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredIssue && !pickerMode && (
        <div
          className="absolute z-30 bottom-12 left-4 right-4 sm:right-auto sm:max-w-xs bg-slate-950/95 backdrop-blur-md p-3 rounded-lg border border-slate-700 shadow-xl text-xs text-white pointer-events-none animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-mono text-blue-400 font-semibold">{hoveredIssue.id}</span>
            <span>{hoveredIssue.ward.split(' - ')[1] || hoveredIssue.ward}</span>
          </div>
          <p className="font-semibold text-slate-100 line-clamp-1">{hoveredIssue.title}</p>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
            <span className="capitalize text-amber-400 font-medium">{hoveredIssue.status.replace('_', ' ')}</span>
            <span>·</span>
            <span>{hoveredIssue.categoryLabel}</span>
            <span>·</span>
            <span className="text-slate-300 font-semibold">{hoveredIssue.upvotes} upvotes</span>
          </div>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="bg-slate-950/90 border-t border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-500">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Submitted / Review
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Dispatched / Working
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Verified Resolved
          </span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          Patna GIS Live · Amity & DPS More Corridor
        </div>
      </div>
    </div>
  );
};
