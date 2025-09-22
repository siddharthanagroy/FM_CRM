import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'fm_manager' | 'technician' | 'hk_team' | 'end_user';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo purposes
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@facility.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
  },
  {
    id: '2',
    email: 'manager@facility.com',
    password: 'manager123',
    name: 'FM Manager',
    role: 'fm_manager',
  },
  {
    id: '3',
    email: 'tech@facility.com',
    password: 'tech123',
    name: 'John Technician',
    role: 'technician',
    department: 'Electromechanical',
  },
  {
    id: '4',
    email: 'hk@facility.com',
    password: 'hk123',
    name: 'Sarah Housekeeping',
    role: 'hk_team',
    department: 'Housekeeping',
  },
  {
    id: '5',
    email: 'user@facility.com',
    password: 'user123',
    name: 'End User',
    role: 'end_user',
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('fm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('fm_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fm_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};