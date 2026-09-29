import React, { useState } from 'react';
import { IssueCategory, CivicDepartment, WardName, IssuePriority, CivicIssue } from '../types/civic';
import { CATEGORY_INFO } from '../utils/formatters';
import { CivicMap } from './CivicMap';
import { useAuth } from '../context/AuthContext';
import {
  X,
  MapPin,
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Shield,
  Navigation,
  Hammer,
  Lightbulb,
  Droplets,
  Trash2,
  Building2,
  TrafficCone,
  HelpCircle,
  LucideIcon
} from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issueData: Partial<CivicIssue>) => Promise<CivicIssue>;
  onTrackCreatedIssue?: (issueId: string) => void;
}

const CATEGORIES: { key: IssueCategory; label: string; department: CivicDepartment; icon: LucideIcon }[] = [
  { key: 'pothole', label: 'Pothole & Roads', department: 'Public Works & Roads', icon: Hammer },
  { key: 'streetlight', label: 'Streetlights & Power', department: 'Electricity & Lighting', icon: Lightbulb },
  { key: 'water_leakage', label: 'Water Leak & Pipes', department: 'Water Supply & Sewerage', icon: Droplets },
  { key: 'garbage', label: 'Garbage & Sanitation', department: 'Sanitation & Waste Management', icon: Trash2 },
  { key: 'infrastructure', label: 'Public Infrastructure', department: 'Public Works & Roads', icon: Building2 },
  { key: 'traffic_signal', label: 'Traffic & Signals', department: 'Traffic & Transportation', icon: TrafficCone },
];

const SAMPLE_PHOTOS = [
  {
    name: 'Pothole',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    category: 'pothole' as IssueCategory,
  },
  {
    name: 'Broken Light',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    category: 'streetlight' as IssueCategory,
  },
  {
    name: 'Water Leak',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
    category: 'water_leakage' as IssueCategory,
  },
  {
    name: 'Overflowing Bin',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    category: 'garbage' as IssueCategory,
  },
];

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onTrackCreatedIssue,
}) => {
  const { currentUser, recordIssueReported, openAuthModal } = useAuth();

  // Form states
  const [category, setCategory] = useState<IssueCategory>('pothole');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ward, setWard] = useState<WardName>(currentUser?.ward || 'Ward 1 - DPS More & Amity Campus');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 25.6125,
    lng: 85.0565,
  });
  const [photoUrl, setPhotoUrl] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [reporterName, setReporterName] = useState(currentUser?.name || '');
  const [reporterPhone, setReporterPhone] = useState(currentUser?.phone || '');
  const [reporterEmail, setReporterEmail] = useState(currentUser?.email || '');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Sync when user changes or opens
  React.useEffect(() => {
    if (currentUser) {
      if (!reporterName) setReporterName(currentUser.name);
      if (!reporterEmail) setReporterEmail(currentUser.email);
      if (currentUser.phone && !reporterPhone) setReporterPhone(currentUser.phone);
      if (currentUser.ward) setWard(currentUser.ward);
    }
  }, [currentUser, isOpen]);

  // UI state
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdIssue, setCreatedIssue] = useState<CivicIssue | null>(null);
  const [copiedTicketId, setCopiedTicketId] = useState(false);

  if (!isOpen) return null;

  const currentCategoryInfo = CATEGORIES.find(c => c.key === category) || CATEGORIES[0];

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lng = Number(pos.coords.longitude.toFixed(4));
          setCoordinates({ lat, lng });
          setAddress(`Near ${lat.toFixed(3)}°N, ${Math.abs(lng).toFixed(3)}°W (GPS Acquired)`);
        },
        () => {
          // fallback
          setCoordinates({ lat: 25.6125, lng: 85.0565 });
          setAddress('Near Amity University Patna Campus, Bailey Road');
        }
      );
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a brief title describing the problem.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please specify the location or street address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const newComplaint = await onSubmit({
        title: title.trim(),
        description: description.trim() || title.trim(),
        category,
        categoryLabel: CATEGORY_INFO[category].label,
        department: currentCategoryInfo.department,
        ward,
        location: {
          address: address.trim(),
          landmark: landmark.trim() || undefined,
          lat: coordinates.lat,
          lng: coordinates.lng,
        },
        photoUrl: photoUrl.trim() || undefined,
        priority,
        reporter: {
          name: isAnonymous ? 'Anonymous Citizen' : (reporterName.trim() || 'Citizen'),
          phone: isAnonymous ? undefined : reporterPhone.trim() || undefined,
          email: isAnonymous ? undefined : reporterEmail.trim() || undefined,
          isAnonymous,
        },
        userId: currentUser?.id,
      });

      if (newComplaint?.id) {
        recordIssueReported(newComplaint.id);
      }
      setCreatedIssue(newComplaint);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit complaint. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketCode = () => {
    if (!createdIssue) return;
    navigator.clipboard.writeText(createdIssue.id);
    setCopiedTicketId(true);
    setTimeout(() => setCopiedTicketId(false), 2000);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAddress('');
    setLandmark('');
    setPhotoUrl('');
    setCreatedIssue(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Report a Civic Issue
            </h2>
            <p className="text-xs text-slate-500">
              Directly dispatched to municipal engineering & maintenance teams
            </p>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {createdIssue ? (
            /* Success Screen */
            <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Complaint Successfully Lodged
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Your ticket has been officially registered in the Municipal Governance System and routed to{' '}
                  <span className="font-semibold text-slate-800">{createdIssue.department}</span>.
                </p>
              </div>

              {/* Ticket ID Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Public Tracking Number
                  </span>
                  <span className="text-xl font-mono font-black text-blue-600">
                    {createdIssue.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={copyTicketCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
                >
                  {copiedTicketId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedTicketId ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* SLA Guarantee Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 max-w-md mx-auto text-left flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Citizen Charter SLA: </span>
                  An inspector will conduct preliminary safety triage within 24 hours. You can track real-time progress anytime.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    onTrackCreatedIssue?.(createdIssue.id);
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-colors"
                >
                  Track This Complaint Now
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Complaint Submission Form */
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Citizen Account Status Banner with Sign In / Sign Up */}
              <div className="rounded-2xl p-3.5 border text-xs transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50 to-indigo-50/60 border-blue-200">
                {currentUser ? (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{currentUser.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-semibold">
                            Verified Citizen
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          {currentUser.email} {currentUser.ward ? `· ${currentUser.ward.split(' - ')[0]}` : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openAuthModal('signin')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
                      >
                        Switch / Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => openAuthModal('signup')}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                      >
                        Sign Up New
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Unverified Resident</span>
                        <span className="text-[11px] text-slate-500 block">
                          Sign In or Sign Up to receive SMS tracking milestones and save to your profile.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => openAuthModal('signin')}
                        className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 hover:border-blue-300 text-blue-700 font-bold text-xs transition-colors shadow-2xs"
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => openAuthModal('signup')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs"
                      >
                        Sign Up / Register
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1. Issue Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setCategory(cat.key)}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className={`text-xs font-bold block ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                            {cat.label}
                          </span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">
                            {cat.department}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Incident Summary & Details
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken road surface near Amity University Gate / DPS More"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-medium"
                />
                <textarea
                  rows={3}
                  placeholder="Provide any additional context: size, hazard risk, nearby landmarks or duration..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              {/* Location & Map Pin */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    3. Exact Location & Ward (Patna)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>GPS Auto-locate</span>
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(!showMapPicker)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{showMapPicker ? 'Hide Map' : 'Drop Pin on Map'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Street Address (e.g. Bailey Road Service Lane)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Landmark (e.g. Near Amity Gate 1 / DPS More Chowk)"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value as WardName)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Ward 1 - DPS More & Amity Campus">Ward 1 - DPS More & Amity Campus</option>
                    <option value="Ward 2 - Bailey Road & Rupaspur">Ward 2 - Bailey Road & Rupaspur</option>
                    <option value="Ward 3 - Saguna More Hub">Ward 3 - Saguna More Hub</option>
                    <option value="Ward 4 - Gola Road Sector">Ward 4 - Gola Road Sector</option>
                    <option value="Ward 5 - Khagaul Canal Link">Ward 5 - Khagaul Canal Link</option>
                    <option value="Ward 6 - Danapur Cantonment Zone">Ward 6 - Danapur Cantonment Zone</option>
                  </select>
                </div>

                {/* Embedded Interactive Pin Dropper */}
                {showMapPicker && (
                  <div className="h-60 rounded-xl overflow-hidden border border-slate-300 mt-2">
                    <CivicMap
                      issues={[]}
                      pickerMode={true}
                      selectedCoordinates={coordinates}
                      onPickCoordinates={(coords) => {
                        setCoordinates({ lat: coords.lat, lng: coords.lng });
                        setWard(coords.ward);
                        setAddress(coords.suggestedAddress);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Photo Evidence & Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  4. Photo Evidence (Recommended)
                </label>
                
                {/* Photo Input / URL */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Enter image URL or select a sample below"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {photoUrl && (
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Instant 1-Click Sample Photos */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 block mb-1">
                    Quick test samples (1-click to attach):
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {SAMPLE_PHOTOS.map((sample) => (
                      <button
                        key={sample.name}
                        type="button"
                        onClick={() => {
                          setPhotoUrl(sample.url);
                          setCategory(sample.category);
                        }}
                        className={`p-1.5 rounded-lg border text-left text-[11px] flex flex-col items-center gap-1 transition-all ${
                          photoUrl === sample.url
                            ? 'border-blue-600 bg-blue-50 font-bold text-blue-900 ring-1 ring-blue-500'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="w-full h-12 object-cover rounded"
                        />
                        <span className="truncate w-full text-center">{sample.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {photoUrl && (
                  <div className="relative h-28 rounded-xl overflow-hidden border border-slate-200 mt-2 bg-slate-50">
                    <img
                      src={photoUrl}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded">
                      Attached Evidence Photo
                    </div>
                  </div>
                )}
              </div>

              {/* Priority & Urgency */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  5. Urgency / Hazard Severity
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['low', 'medium', 'high', 'critical'] as IssuePriority[]).map((p) => {
                    const isSelected = priority === p;
                    const labels = {
                      low: 'Routine',
                      medium: 'Standard',
                      high: 'High',
                      critical: 'Critical Hazard',
                    };
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                          isSelected
                            ? p === 'critical'
                              ? 'bg-red-50 border-red-500 text-red-800 ring-2 ring-red-400'
                              : 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-400'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {labels[p]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reporter Information / Anonymous Option */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    6. Citizen Contact Information
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Submit Anonymously</span>
                  </label>
                </div>

                {!isAnonymous ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (for SMS update)"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic">
                    Your complaint will be logged without personal identification. Keep your generated ticket number to follow up.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Registering Ticket...' : 'Submit Civic Complaint'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
