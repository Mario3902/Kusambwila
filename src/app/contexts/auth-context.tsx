import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Check localStorage for existing user
    const storedUser = localStorage.getItem('kusambwila_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, userType?: UserType) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: 'João Silva',
      firstName: 'João',
      lastName: 'Silva',
      email,
      phone: '+244 923 456 789',
      userType: userType || 'tenant',
    };
    
    setUser(mockUser);
    localStorage.setItem('kusambwila_user', JSON.stringify(mockUser));
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    userType: UserType
  ) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      phone,
      userType,
    };
    
    setUser(newUser);
    localStorage.setItem('kusambwila_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kusambwila_user');
  };

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