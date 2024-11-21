import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConnectWalletProvider from '../providers/ConnectWalletProvider';
import { PolkadotExtensionContextProvider } from '@/context/polkadotExtensionContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ConnectWalletProvider {...pageProps}>
        <PolkadotExtensionContextProvider>
          <Component {...pageProps} />
        </PolkadotExtensionContextProvider>
      </ConnectWalletProvider>
      {/* <ToastContainer theme='dark' /> */}
    </AuthProvider>
  );
}
