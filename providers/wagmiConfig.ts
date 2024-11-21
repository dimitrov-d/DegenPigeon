import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'DegenPigeon',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  wallets: [
    {
      groupName: 'EVM Wallets',
      wallets: [metaMaskWallet, walletConnectWallet, coinbaseWallet],
    },
  ],
  ssr: true,
});

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: 'EVM wallets',
//       wallets: [metaMaskWallet, coinbaseWallet, walletConnectWallet],
//     },
//   ],
//   {
//     projectId,
//     appName,
//   }
// );

// const config = createConfig({
//   connectors,
//   chains: [mainnet, polygon, optimism, arbitrum, base],
//   transports: {
//     [arbitrum.id]: http(),
//     [base.id]: http(),
//     [mainnet.id]: http(),
//     [optimism.id]: http(),
//     [polygon.id]: http(),
//   },
//   multiInjectedProviderDiscovery: false,
//   ssr: true,
// });

export default config;
