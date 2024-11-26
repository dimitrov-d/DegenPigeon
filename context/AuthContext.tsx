import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

export enum ActionMode {
  TRANSFER = 'Transfer Mode',
  STORAGE = 'Storage Mode',
  HISTORY = 'History',
}
export type VerifyArgs = {
  address: string;
  username: string;
  message: string;
  signature: string;
};
interface AuthContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isDocumentation: boolean;
  setIsDocumentation: (isDocumentation: boolean) => void;
  actionMode: string;
  setActionMode: (actionMode: string) => void;
  verifyWallet: (args: VerifyArgs) => Promise<boolean>;
  fetchAuthStatus: () => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDocumentation, setIsDocumentation] = useState<boolean>(false);
  const [actionMode, setActionMode] = useState<string>(ActionMode.TRANSFER);

  const fetchingStatusRef = useRef(false);
  const verifyingRef = useRef(false);

  const fetchAuthStatus = async () => {
    if (fetchingStatusRef.current || verifyingRef.current) {
      return;
    }
    fetchingStatusRef.current = true;
    try {
      const response = await fetch('/api/auth/me');
      const json = await response.json();
      setIsAuthenticated(!!json.address);
      setWalletAddress(json.address);
    } catch (_error) {
      setIsAuthenticated(false);
      setWalletAddress('');
    } finally {
      fetchingStatusRef.current = false;
    }
  };

  const verifyWallet = async ({ address, username, message, signature }: VerifyArgs) => {
    verifyingRef.current = true;

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, username, message, signature }),
      });

      const authenticated = Boolean(response.ok);
      if (authenticated) {
        setIsAuthenticated(authenticated);
        setWalletAddress(address);
      } else {
        logOut();
      }

      return authenticated;
    } catch (error: any) {
      logOut();
      return false;
    } finally {
      verifyingRef.current = false;
    }
  };

  const logOut = async () => {
    setIsAuthenticated(false);
    setWalletAddress('');
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        walletAddress,
        setWalletAddress,
        isAuthenticated,
        setIsAuthenticated,
        isDocumentation,
        setIsDocumentation,
        actionMode,
        setActionMode,
        fetchAuthStatus,
        verifyWallet,
        logOut,
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
