import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface AuthContextType {
  currentUser: UserProfile | null;
  currentRole: UserRole | null;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isSupabaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('gorod_cbw_active_user');
    return saved ? JSON.parse(saved) : PRESET_USERS.warehouse_keeper;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gorod_cbw_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gorod_cbw_active_user');
    }
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    setCurrentUser(PRESET_USERS[role]);
  };

  const login = async (email: string, role: UserRole = 'warehouse_keeper') => {
    // If real Supabase auth is desired later
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('profiles').select('*').eq('email', email).single();
      if (data) {
        setCurrentUser(data as UserProfile);
        return;
      }
    }
    // Preset fallback
    const matched = Object.values(PRESET_USERS).find((u) => u.email === email) || PRESET_USERS[role];
    setCurrentUser(matched);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        switchRole,
        login,
        logout,
        isSupabaseConnected: isSupabaseConfigured,
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
