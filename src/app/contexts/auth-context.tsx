import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

export type UserType = 'tenant' | 'landlord' | 'admin';

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: UserType;
  avatar?: string;
  biNumber?: string;
  biDocument?: string;
  propertyDocument?: string;
  verificationScore?: number;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType?: UserType) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    userType: UserType
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const profile = await api.auth.getProfile();
        setUser({
          ...profile,
          name: `${profile.firstName} ${profile.lastName}`,
        });
      } catch (err) {
        localStorage.removeItem('kusambwila_token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string, userType?: UserType) => {
    const { user: userData, token } = await api.auth.login({ email, password, userType });
    localStorage.setItem('kusambwila_token', token);
    setUser({
      ...userData,
      name: `${userData.firstName} ${userData.lastName}`,
    });
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    userType: UserType
  ) => {
    const { user: userData, token } = await api.auth.register({ 
      firstName, lastName, email, password, phone, userType 
    });
    localStorage.setItem('kusambwila_token', token);
    setUser({
      ...userData,
      name: `${userData.firstName} ${userData.lastName}`,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kusambwila_token');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}