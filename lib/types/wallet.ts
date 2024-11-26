import {
  InjectedExtension,
  InjectedMetadata,
  InjectedProvider,
  InjectedAccount,
  Unsubcall,
} from '@polkadot/extension-inject/types';
import { Signer } from '@polkadot/api/types';
import { DotSamaWallet } from '../DotSamaWallet';

export type SubscriptionFn = (accounts: WalletAccount[] | undefined) => void | Promise<void>;

export interface WalletAccount extends InjectedAccount {
  source?: string;
  wallet: DotSamaWallet;
  signer?: Signer;
}

export type WalletInfo = {
  extensionName: string;
  title: string;
  installUrl: {
    firefox?: string;
    default: string;
    android?: string;
    ios?: string;
  };
  image: string;
  installed?: boolean;
};

export interface WalletMethods {
  enable: () => Promise<unknown>;

  subscribeAccounts: (callback: SubscriptionFn) => Promise<Unsubcall | null>;

  getAccounts: () => Promise<WalletAccount[] | null>;
}

export interface WalletContextInterface {
  wallet?: Wallet;
  accounts: WalletAccount[];
  setWallet: (wallet: Wallet | undefined) => void;
}

export interface Wallet extends WalletInfo, WalletMethods {
  installed: boolean | undefined;

  extension: InjectedExtension | undefined;

  signer: Signer | undefined;

  metadata: InjectedMetadata | undefined;

  provider: InjectedProvider | undefined;
}
