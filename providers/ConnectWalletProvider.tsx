import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  darkTheme,
  RainbowKitAuthenticationProvider,
  createAuthenticationAdapter,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { createSiweMessage } from 'viem/siwe';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import config from '@/providers/wagmiConfig';
import type { AppProps } from 'next/app';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const queryClient = new QueryClient();

export type VerifyArgs = {
  message: string;
  signature: string;
};

const ConnectWalletProvider = ({
  children,
  pageProps,
}: {
  children: React.ReactNode;
  pageProps: AppProps['pageProps'];
}) => {
  const { fetchAuthStatus } = useAuth();

  useEffect(() => {
    fetchAuthStatus();

    window.addEventListener('focus', fetchAuthStatus);
    return () => window.removeEventListener('focus', fetchAuthStatus);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default ConnectWalletProvider;
