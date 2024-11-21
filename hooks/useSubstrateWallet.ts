import { useState, useEffect } from 'react';

// Types
interface WalletInfo {
  extensionName: string;
  title: string;
  installUrl: {
    firefox?: string;
    default: string;
    android?: string;
    ios?: string;
  };
  image: string;
}

// Predefined wallets
const PREDEFINED_WALLETS: WalletInfo[] = [
  {
    extensionName: 'polkadot-js',
    title: 'Polkadot{.js}',
    installUrl: {
      firefox:
        'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
      default:
        'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
    },
    image: '/images/wallet/polkadot.svg',
  },
  {
    extensionName: 'subwallet-js',
    title: 'SubWallet',
    installUrl: {
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/subwallet/',
      default:
        'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    },
    image: '/images/wallet/subwallet.svg',
  },
  {
    extensionName: 'talisman',
    title: 'Talisman',
    installUrl: {
      firefox:
        'https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/',
      default:
        'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
    },
    image: '/images/wallet/talisman.svg',
  },
];

// Wallet list
let walletList: Wallet[] = [];

declare global {
  interface Wallet extends WalletInfo {
    installed?: boolean;
  }
}
/**
 * Add a new wallet to the list
 */
export function addWallet(data: WalletInfo): void {
  const wallet: Wallet = { ...data, installed: false };
  walletList.push(wallet);
}

/**
 * Get all wallets
 */
export function getWallets(): Wallet[] {
  return walletList;
}

/**
 * Get a wallet by its source (extensionName)
 */
export function getWalletBySource(
  source: string | unknown
): Wallet | undefined {
  return getWallets().find((wallet) => wallet.extensionName === source);
}

/**
 * Preload predefined wallets
 */
PREDEFINED_WALLETS.forEach((walletInfo) => addWallet(walletInfo));

// React hook to access wallet list
export const useWallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    setWallets(getWallets());
  }, []);

  return wallets;
};
