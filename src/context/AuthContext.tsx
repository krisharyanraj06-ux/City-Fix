import React, { createContext, useContext, useState, useEffect } from 'react';
import { CitizenUser, WardName } from '../types/civic';

interface AuthContextType {
  currentUser: CitizenUser | null;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup' | 'prompt';
  pendingAction: (() => void) | null;
  openAuthModal: (mode?: 'signin' | 'signup' | 'prompt', onComplete?: () => void) => void;
  closeAuthModal: () => void;
  signin: (email: string, pass?: string) => Promise<boolean>;
  signup: (userData: { name: string; email: string; phone?: string; ward?: WardName }) => Promise<boolean>;
  signout: () => void;
  quickDemoLogin: (email: string) => void;
  recordIssueReported: (issueId: string) => void;
}

const STORAGE_KEY = 'cityfix_active_citizen_v1';
const USERS_STORAGE_KEY = 'cityfix_registered_users_v1';

const INITIAL_DEMO_USERS: CitizenUser[] = [
  {
    id: 'user-aditya-amity',
    name: 'Aditya Kumar',
    email: 'aditya.k@amitypatna.edu',
    phone: '+91 98350 44120',
    ward: 'Ward 1 - DPS More & Amity Campus',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-09-20T10:00:00Z',
    reportedIssueIds: ['CF-2026-1042'],
  },
  {
    id: 'user-sinha-dps',
    name: 'Dr. S. N. Sinha',
    email: 'sn.sinha@dpsparents.org',
    phone: '+91 94310 11982',
    ward: 'Ward 1 - DPS More & Amity Campus',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-09-22T08:30:00Z',
    reportedIssueIds: ['CF-2026-1039'],
  },
  {
    id: 'user-priya-amity',
    name: 'Prof. Priya Sharma',
    email: 'priya.s@amitypatna.edu',
    phone: '+91 98352 77190',
    ward: 'Ward 2 - Bailey Road & Rupaspur',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-09-24T12:00:00Z',
    reportedIssueIds: [],
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CitizenUser | null>(() => {
    try {
      // Clean up previous test default if present
      localStorage.removeItem('cityfix_citizen_user');
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed reading user from storage', e);
    }
    // Default to unauthenticated guest so clicking "Report an Issue" shows Sign In and Sign Up options
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'prompt'>('prompt');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const getSavedUsers = (): CitizenUser[] => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEMO_USERS;
  };

  const saveUsers = (users: CitizenUser[]) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup' | 'prompt' = 'prompt', onComplete?: () => void) => {
    setAuthModalMode(mode);
    setPendingAction(() => onComplete || null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const signin = async (email: string): Promise<boolean> => {
    const users = getSavedUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (existing) {
      setCurrentUser(existing);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setIsAuthModalOpen(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      return true;
    } else {
      // Auto register for seamless access
      const name = email.split('@')[0].replace(/[._-]/g, ' ');
      const newUser: CitizenUser = {
        id: `user-${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email.trim().toLowerCase(),
        ward: 'Ward 1 - DPS More & Amity Campus',
        createdAt: new Date().toISOString(),
        reportedIssueIds: [],
      };
      const updated = [...users, newUser];
      saveUsers(updated);
      setCurrentUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setIsAuthModalOpen(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      return true;
    }
  };

  const signup = async (userData: { name: string; email: string; phone?: string; ward?: WardName }): Promise<boolean> => {
    const users = getSavedUsers();
    const newUser: CitizenUser = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone?.trim(),
      ward: userData.ward || 'Ward 1 - DPS More & Amity Campus',
      createdAt: new Date().toISOString(),
      reportedIssueIds: [],
    };

    const updated = [...users.filter(u => u.email.toLowerCase() !== newUser.email), newUser];
    saveUsers(updated);
    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setIsAuthModalOpen(false);

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    return true;
  };

  const signout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const quickDemoLogin = (email: string) => {
    signin(email);
  };

  const recordIssueReported = (issueId: string) => {
    if (!currentUser) return;
    const updated: CitizenUser = {
      ...currentUser,
      reportedIssueIds: Array.from(new Set([...currentUser.reportedIssueIds, issueId])),
    };
    setCurrentUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    const users = getSavedUsers();
    saveUsers(users.map(u => u.id === updated.id ? updated : u));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthModalOpen,
        authModalMode,
        pendingAction,
        openAuthModal,
        closeAuthModal,
        signin,
        signup,
        signout,
        quickDemoLogin,
        recordIssueReported,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
