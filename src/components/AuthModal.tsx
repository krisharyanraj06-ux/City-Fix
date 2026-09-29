import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WardName } from '../types/civic';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  FileText
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    authModalMode, 
    closeAuthModal, 
    signin, 
    signup, 
    quickDemoLogin 
  } = useAuth();

  const [mode, setMode] = useState<'prompt' | 'signin' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState<WardName>('Ward 1 - DPS More & Amity Campus');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync mode with prop
  React.useEffect(() => {
    setMode(authModalMode);
    setError(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        if (!email.trim() || !password.trim()) {
          setError('Please provide your email and password');
          setIsSubmitting(false);
          return;
        }
        await signin(email, password);
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError('Please fill in your name, email, and password');
          setIsSubmitting(false);
          return;
        }
        await signup({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          ward,
        });
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Gradient */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 relative">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-md shrink-0 flex items-center justify-center">
              <img
                src="/cityfix-logo.jpg"
                alt="CityFix"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-sky-300" />
                <span>Citizen Verification</span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
                {mode === 'prompt' 
                  ? 'Sign In or Sign Up to Report an Issue'
                  : mode === 'signin' 
                  ? 'Citizen Sign In' 
                  : 'Create Citizen Account'}
              </h3>
            </div>
          </div>

          <p className="text-xs text-blue-100 mt-2 leading-relaxed">
            Civic identification ensures official municipal work orders are dispatched accurately, protects against spam, and sends you SMS status updates.
          </p>

          {/* Tab Selector (Always visible when in form mode, or toggleable) */}
          <div className="flex rounded-xl bg-blue-950/40 p-1 mt-4 border border-blue-400/20 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-white text-blue-900 shadow-sm font-bold'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-white text-blue-900 shadow-sm font-bold'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up / Register</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {mode === 'prompt' ? (
          <div className="p-6 space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-slate-800">
                Please select how you would like to proceed:
              </span>
              <p className="text-[11px] text-slate-500">
                You will be taken directly to the issue submission form once verified.
              </p>
            </div>

            {/* Option 1: Sign In */}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-600 bg-white hover:bg-blue-50/50 transition-all flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <LogIn className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    Sign In to Existing Account
                  </h4>
                  <p className="text-xs text-slate-500">
                    I already have a CityFix account. Log in with email & password.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
            </button>

            {/* Option 2: Sign Up */}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 transition-all flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Sign Up / Register New Account
                  </h4>
                  <p className="text-xs text-slate-500">
                    New resident? Register your name and ward in 30 seconds.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
            </button>

            {/* Quick Demo Login Option */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
                Or Fast 1-Click Resident Demo Sign-In
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => quickDemoLogin('aditya.k@amitypatna.edu')}
                  className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="truncate">
                    <span className="font-bold text-slate-800 block truncate">Aditya Kumar</span>
                    <span className="text-[10px] text-slate-500 block truncate">Amity Student Council</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
                </button>

                <button
                  type="button"
                  onClick={() => quickDemoLogin('sn.sinha@dpsparents.org')}
                  className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="truncate">
                    <span className="font-bold text-slate-800 block truncate">Dr. S. N. Sinha</span>
                    <span className="text-[10px] text-slate-500 block truncate">DPS Parents · DPS More</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditya Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="citizen@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Mobile Number (For Resolution SMS Alerts)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      placeholder="+91 98350 XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Primary Ward / Locality
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={ward}
                      onChange={(e) => setWard(e.target.value as WardName)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                    >
                      <option value="Ward 1 - DPS More & Amity Campus">Ward 1 - DPS More & Amity Campus</option>
                      <option value="Ward 2 - Bailey Road & Rupaspur">Ward 2 - Bailey Road & Rupaspur</option>
                      <option value="Ward 3 - Saguna More Hub">Ward 3 - Saguna More Hub</option>
                      <option value="Ward 4 - Gola Road Sector">Ward 4 - Gola Road Sector</option>
                      <option value="Ward 5 - Khagaul Canal Link">Ward 5 - Khagaul Canal Link</option>
                      <option value="Ward 6 - Danapur Cantonment Zone">Ward 6 - Danapur Cantonment Zone</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Verifying credentials...</span>
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In & Continue to Report</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Account & Continue to Report</span>
                </>
              )}
            </button>

            {/* Switch between Sign In and Sign Up */}
            <div className="text-center pt-2">
              {mode === 'signin' ? (
                <p className="text-xs text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setError(null); }}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Sign Up / Register Here
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setError(null); }}
                    className="font-bold text-blue-600 hover:underline"
                  >
                    Sign In Here
                  </button>
                </p>
              )}
            </div>

            {/* Quick Demo Login Option */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 text-center">
                Quick 1-Click Resident Demo Sign-In
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => quickDemoLogin('aditya.k@amitypatna.edu')}
                  className="w-full text-left px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">Aditya Kumar</span>
                    <span className="text-[10px] text-slate-500 block">Amity University Student Council</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
