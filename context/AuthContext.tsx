import React, { createContext, useContext, useState, ReactNode } from 'react';

export enum ActionMode {
  TRANSFER = 'Transfer Mode',
  STORAGE = 'Storage Mode',
  HISTORY = 'History',
}
interface AuthContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  actionMode: string;
  setActionMode: (actionMode: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [actionMode, setActionMode] = useState<string>(ActionMode.TRANSFER);

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        isAuthenticated,
        setIsAuthenticated,
        actionMode,
        setActionMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
