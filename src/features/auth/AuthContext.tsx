import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export type UserRole =
  | 'warehouse_keeper'
  | 'admin_compliance'
  | 'warehouse_manager'
  | 'security_team'
  | 'accounts_team'
  | 'customs_bond_officer';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  badge_number: string;
  department: string;
}

export type AuthMode = 'supabase' | 'demo' | 'signed_out';

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  warehouse_keeper: {
    id: 'usr_keeper_01',
    email: 'keeper@gorodlogistics.com',
    full_name: 'Rajesh Nair',
    role: 'warehouse_keeper',
    badge_number: 'GL-WK-001',
    department: 'Warehouse Governance & Compliance',
  },
  admin_compliance: {
    id: 'usr_admin_01',
    email: 'compliance@gorodlogistics.com',
    full_name: 'Anjali Menon',
    role: 'admin_compliance',
    badge_number: 'GL-ADM-002',
    department: 'Customs Documentation & ICEGATE Desk',
  },
  warehouse_manager: {
    id: 'usr_ops_01',
    email: 'operations@gorodlogistics.com',
    full_name: 'Vikram Pillai',
    role: 'warehouse_manager',
    badge_number: 'GL-OPS-003',
    department: 'Material Handling & Inventory Operations',
  },
  security_team: {
    id: 'usr_sec_01',
    email: 'security@gorodlogistics.com',
    full_name: 'Suresh Kumar',
    role: 'security_team',
    badge_number: 'GL-SEC-004',
    department: 'Main Gate & Physical Registers',
  },
  accounts_team: {
    id: 'usr_acc_01',
    email: 'accounts@gorodlogistics.com',
    full_name: 'Pooja Varma',
    role: 'accounts_team',
    badge_number: 'GL-ACC-005',
    department: 'Billing & Financial Clearance (NDC)',
  },
  customs_bond_officer: {
    id: 'usr_cbo_01',
    email: 'bond.officer@customs.gov.in',
    full_name: 'Superintendent K. Sharma',
    role: 'customs_bond_officer',
    badge_number: 'CUS-TRV-BOND-18',
    department: 'Jurisdictional Customs Authority',
  },
};

const DEMO_STORAGE_KEY = 'gorod_cbw_demo_user';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  badge_number: string | null;
  department: string | null;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  authMode: AuthMode;
  isSupabaseConfigured: boolean;
  /** Kept for backwards compatibility with existing UI. */
  isSupabaseConnected: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  enterDemoMode: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readDemoUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function findPresetByEmail(email: string): UserProfile | undefined {
  const normalised = email.trim().toLowerCase();
  return Object.values(PRESET_USERS).find(
    (user) => user.email.toLowerCase() === normalised
  );
}

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    role: row.role,
    badge_number: row.badge_number || 'GL-STAFF',
    department: row.department || 'Customs Documentation & ICEGATE Desk',
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('signed_out');

  const hydrateProfile = useCallback(async (authUser: User) => {
    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, badge_number, department')
      .eq('id', authUser.id)
      .maybeSingle<ProfileRow>();

    if (data) {
      setCurrentUser(mapProfile(data));
      return;
    }

    if (profileError) {
      console.warn('Could not load profile:', profileError.message);
    }

    // The auth user exists but the profile row is missing. Fall back to the
    // matching preset persona, keeping the real auth id so FK writes still work.
    const preset = findPresetByEmail(authUser.email || '');
    const meta = authUser.user_metadata as Record<string, unknown> | undefined;
    setCurrentUser(
      preset
        ? { ...preset, id: authUser.id, email: authUser.email || preset.email }
        : {
            id: authUser.id,
            email: authUser.email || '',
            full_name:
              (typeof meta?.full_name === 'string' && meta.full_name) ||
              authUser.email ||
              'Warehouse Staff',
            role: 'admin_compliance',
            badge_number: 'GL-STAFF',
            department: 'Customs Documentation & ICEGATE Desk',
          }
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      if (!isSupabaseConfigured) {
        const demo = readDemoUser();
        if (!cancelled) {
          setCurrentUser(demo);
          setAuthMode(demo ? 'demo' : 'signed_out');
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (data.session) {
        setSession(data.session);
        setAuthMode('supabase');
        await hydrateProfile(data.session.user);
        if (!cancelled) setLoading(false);
        return;
      }

      const demo = readDemoUser();
      if (!cancelled) {
        setCurrentUser(demo);
        setAuthMode(demo ? 'demo' : 'signed_out');
        setLoading(false);
      }
    };

    void boot();

    if (!isSupabaseConfigured) {
      return () => {
        cancelled = true;
      };
    }

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession) {
          setAuthMode('supabase');
          void hydrateProfile(nextSession.user);
        }
      }
    );

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [hydrateProfile]);

  const login = useCallback(
    async (email: string, password: string, role: UserRole = 'warehouse_keeper') => {
      setError(null);

      if (!isSupabaseConfigured) {
        const matched = findPresetByEmail(email) || PRESET_USERS[role];
        setCurrentUser(matched);
        setAuthMode('demo');
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(matched));
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        const message =
          signInError.message === 'Invalid login credentials'
            ? 'Invalid email or password. Demo accounts use password Gorod@2026 (run supabase_live_setup.sql first).'
            : signInError.message;
        setError(message);
        throw new Error(message);
      }

      localStorage.removeItem(DEMO_STORAGE_KEY);
      setAuthMode('supabase');
      if (data.user) {
        await hydrateProfile(data.user);
      }
    },
    [hydrateProfile]
  );

  const enterDemoMode = useCallback((role: UserRole) => {
    const user = PRESET_USERS[role];
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
    setAuthMode('demo');
    setError(null);
  }, []);

  const switchRole = useCallback(
    (role: UserRole) => {
      setCurrentUser((previous) => {
        const preset = PRESET_USERS[role];

        // In a real Supabase session the auth id/email are fixed — only the
        // displayed statutory persona changes. This is a UI demo control; the
        // database session still belongs to the signed-in account.
        if (authMode === 'supabase' && previous) {
          return { ...preset, id: previous.id, email: previous.email };
        }

        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(preset));
        return preset;
      });
    },
    [authMode]
  );

  const logout = useCallback(async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Offline sign-out still clears the local session below.
      }
    }
    setCurrentUser(null);
    setSession(null);
    setAuthMode('signed_out');
    setError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setSession(data.session);
      await hydrateProfile(data.session.user);
    }
  }, [hydrateProfile]);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        session,
        loading,
        error,
        authMode,
        isSupabaseConfigured,
        isSupabaseConnected: isSupabaseConfigured,
        isAuthenticated: authMode === 'supabase' && Boolean(session),
        login,
        enterDemoMode,
        switchRole,
        logout,
        refreshProfile,
        clearError,
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
