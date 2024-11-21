// Types
export type SubstrateWalletInfo = {
  extensionName: string;
  title: string;
  installUrl: {
    firefox?: string;
    default: string;
    android?: string;
    ios?: string;
  };
  icon: string;
  image?: string;
};

// Predefined wallets
export const SUBSTRATE_WALLETS: SubstrateWalletInfo[] = [
  {
    extensionName: 'polkadot-js',
    title: 'Polkadot{.js}',
    installUrl: {
      firefox:
        'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/',
      default:
        'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd',
    },
    icon: '/images/wallet/polkadot.svg',
  },
  {
    extensionName: 'subwallet-js',
    title: 'SubWallet',
    installUrl: {
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/subwallet/',
      default:
        'https://chrome.google.com/webstore/detail/subwallet/onhogfjeacnfoofkfgppdlbmlmnplgbn',
    },
    icon: '/images/wallet/subwallet.svg',
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
    icon: '/images/wallet/talisman.svg',
  },
];
