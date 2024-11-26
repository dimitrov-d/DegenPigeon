import type { InjectedWindow } from '@polkadot/extension-inject/types';
import { DotSamaWallet } from './DotSamaWallet';
import { WalletInfo } from './types/wallet';

// Predefined wallets
const PREDEFINED_WALLETS: WalletInfo[] = [
  {
    extensionName: 'polkadot-js',
    title: 'Polkadot{.js}',
    installUrl: {
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
      default: 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
    },
    image: '/images/wallet/polkadot.svg',
  },
  {
    extensionName: 'subwallet-js',
    title: 'SubWallet',
    installUrl: {
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/subwallet/',
      default: 'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    },
    image: '/images/wallet/subwallet.svg',
  },
  {
    extensionName: 'talisman',
    title: 'Talisman',
    installUrl: {
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/',
      default: 'https://chrome.google.com/webstore/detail/talisman-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
    },
    image: '/images/wallet/talisman.svg',
  },
];

/**
 * Get all wallets
 */
export function getWallets(): DotSamaWallet[] {
  return PREDEFINED_WALLETS.map((wallet) => new DotSamaWallet(wallet));
}

export function truncateWallet(source: string, partLength: number = 4): string {
  return source.length > 9
    ? source.slice(0, partLength) + '…' + source.slice(source.length - partLength, source.length)
    : source;
}
