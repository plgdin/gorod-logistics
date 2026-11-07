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

export type AuthMode = 'supabase' | 'signed_out';

const VALID_ROLES: ReadonlySet<UserRole> = new Set([
  'warehouse_keeper',
  'admin_compliance',
  'warehouse_manager',
  'security_team',
  'accounts_team',
  'customs_bond_officer',
]);

function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && VALID_ROLES.has(value as UserRole);
}

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    role: row.role,
    badge_number: row.badge_number || '—',
    department: row.department || 'Unassigned',
  };
}

function profileFromMetadata(authUser: User): UserProfile | null {
  const meta = (authUser.user_metadata ?? {}) as Record<string, unknown>;
  if (!isUserRole(meta.role)) return null;

  return {
    id: authUser.id,
    email: authUser.email || '',
    full_name:
      (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
      authUser.email ||
      'Warehouse Staff',
    role: meta.role,
    badge_number:
      (typeof meta.badge_number === 'string' && meta.badge_number.trim()) || '—',
    department:
      (typeof meta.department === 'string' && meta.department.trim()) || 'Unassigned',
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

    if (data && isUserRole(data.role)) {
      setCurrentUser(mapProfile(data));
      return;
    }

    if (profileError) {
      console.warn('Could not load profile:', profileError.message);
    }

    // The auth user exists but no usable profile row was found. Use the
    // validated role from user metadata; never invent a statutory role.
    const fallback = profileFromMetadata(authUser);
    if (fallback) {
      setCurrentUser(fallback);
      return;
    }

    setCurrentUser(null);
    setError(
      'Your staff profile is not configured with a statutory role. Ask the warehouse keeper to provision your profile before signing in.'
    );
  }, []);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      if (!isSupabaseConfigured) {
        if (!cancelled) {
          setLoading(false);
          setAuthMode('signed_out');
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (data.session) {
        setSession(data.session);
        setAuthMode('supabase');
        await hydrateProfile(data.session.user);
      } else {
        setSession(null);
        setCurrentUser(null);
        setAuthMode('signed_out');
      }

      if (!cancelled) setLoading(false);
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
          return;
        }

        setCurrentUser(null);
        setAuthMode('signed_out');
      }
    );

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [hydrateProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);

      if (!isSupabaseConfigured) {
        throw new Error('Authentication is not configured. Contact the system administrator.');
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        const message =
          signInError.message === 'Invalid login credentials'
            ? 'Invalid email or password.'
            : signInError.message;
        setError(message);
        throw new Error(message);
      }

      setAuthMode('supabase');
      if (data.user) {
        await hydrateProfile(data.user);
      }
    },
    [hydrateProfile]
  );

  const logout = useCallback(async () => {
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
