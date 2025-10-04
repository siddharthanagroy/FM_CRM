import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'fm_manager' | 'user';
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  // Mock user - replace with actual Supabase auth later
  const [user, setUser] = useState<User | null>({
    id: '1',
    email: 'admin@example.com',
    role: 'admin',
    name: 'Admin User'
  });
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // TODO: Implement actual Supabase authentication
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      // Mock sign in
      setUser({
        id: '1',
        email: email,
        role: 'admin',
        name: 'Admin User'
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual Supabase sign out
      // await supabase.auth.signOut();
      
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};