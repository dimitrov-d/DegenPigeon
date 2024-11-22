import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';

export enum ActionMode {
  TRANSFER = 'Transfer Mode',
  STORAGE = 'Storage Mode',
  HISTORY = 'History',
}
export type VerifyArgs = {
  message: string;
  signature: string;
};
interface AuthContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  authStatus: AuthenticationStatus;
  setAuthStatus: (authStatus: AuthenticationStatus) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  actionMode: string;
  setActionMode: (actionMode: string) => void;
  verifyWallet: (args: VerifyArgs) => Promise<boolean>;
  fetchAuthStatus: () => void;
  logOut: () => void;
  getNonce: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [actionMode, setActionMode] = useState<string>(ActionMode.TRANSFER);
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>('loading');

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
      setAuthStatus(json.address ? 'authenticated' : 'unauthenticated');
      setIsAuthenticated(!!json.address);
    } catch (_error) {
      setAuthStatus('unauthenticated');
      setIsAuthenticated(false);
    } finally {
      fetchingStatusRef.current = false;
    }
  };

  const verifyWallet = async ({ message, signature }: VerifyArgs) => {
    verifyingRef.current = true;

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });
      const res = await response.json();

      const authenticated = Boolean(response.ok);

      if (authenticated) {
        setIsAuthenticated(authenticated);
        setAuthStatus(authenticated ? 'authenticated' : 'unauthenticated');
      } else if (res.message === 'Invalid nonce.') {
        logOut();
      }

      return authenticated;
    } catch (error: any) {
      console.debug(error);
      console.debug(error?.message);
      if (error?.message === 'Invalid nonce.') {
        logOut();
      }
      return false;
    } finally {
      verifyingRef.current = false;
    }
  };

  const logOut = async () => {
    setAuthStatus('unauthenticated');
    setIsAuthenticated(false);
    await fetch('/api/auth/logout');
  };

  const getNonce = async () => {
    const response = await fetch('/api/auth/nonce');
    return await response.text();
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        walletAddress,
        setWalletAddress,
        authStatus,
        setAuthStatus,
        isAuthenticated,
        setIsAuthenticated,
        actionMode,
        setActionMode,
        fetchAuthStatus,
        verifyWallet,
        logOut,
        getNonce,
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
