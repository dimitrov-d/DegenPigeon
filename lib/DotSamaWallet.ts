import { useState, useEffect, useCallback } from 'react';
import type {
  InjectedAccount,
  InjectedExtension,
  InjectedMetadata,
  InjectedProvider,
  InjectedWindow,
  Unsubcall,
} from '@polkadot/extension-inject/types';
import type { Signer } from '@polkadot/types/types';

const DAPP_NAME = 'Apillon SubWallet Connect';

type SubscriptionFn = (
  accounts: WalletAccount[] | undefined
) => void | Promise<void>;
type WalletDeviceType = 'desktop' | 'mobile';

interface WalletAccount {
  address: string;
  source: string;
  name?: string;
  wallet: Wallet;
  signer: Signer;
}

interface WalletInfo {
  type: WalletDeviceType;
  extensionName: string;
  title: string;
  installUrl: Record<string, string>;
  icon?: string;
  image?: string;
}

interface WalletMethods {
  enable: () => Promise<unknown>;

  subscribeAccounts: (callback: SubscriptionFn) => Promise<Unsubcall | null>;

  getAccounts: () => Promise<WalletAccount[] | null>;
}

interface WalletContextInterface {
  wallet?: Wallet;
  accounts: WalletAccount[];
  setWallet: (wallet: Wallet | undefined) => void;
}

interface OpenSelectWalletInterface {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}
interface WalletAccount {
  address: string;
  source: string;
  name?: string;
  wallet: Wallet;
  signer: Signer;
}

interface WalletInfo {
  type: WalletDeviceType;
  extensionName: string;
  title: string;
  installUrl: Record<string, string>;
  icon?: string;
  image?: string;
}

interface Wallet extends WalletInfo, WalletMethods {
  installed: boolean | undefined;

  extension: InjectedExtension | undefined;

  signer: Signer | undefined;

  metadata: InjectedMetadata | undefined;

  provider: InjectedProvider | undefined;
}

export class DotSamaWallet {
  type: WalletDeviceType;
  extensionName: string;
  title: string;
  installUrl: Record<string, string>;
  icon: string;
  image: string;

  private _extension: InjectedExtension | undefined;
  private _signer: Signer | undefined;
  private _metadata: InjectedMetadata | undefined;
  private _provider: InjectedProvider | undefined;

  constructor({
    type,
    extensionName,
    installUrl,
    icon,
    image,
    title,
  }: WalletInfo) {
    this.type = type;
    this.extensionName = extensionName;
    this.title = title;
    this.installUrl = installUrl;
    this.icon = icon || '';
    this.image = image || '';
  }

  get extension() {
    return this._extension;
  }

  get signer() {
    return this._signer;
  }

  get metadata() {
    return this._metadata;
  }

  get provider() {
    return this._provider;
  }

  get installed() {
    const injectedWindow = window as Window & InjectedWindow;
    const injectedExtension =
      injectedWindow?.injectedWeb3?.[this.extensionName];
    const novaWalletExtension = injectedWindow?.walletExtension?.isNovaWallet;

    return !!injectedExtension || !!novaWalletExtension;
  }

  get rawExtension() {
    const injectedWindow = window as Window & InjectedWindow;
    return injectedWindow?.injectedWeb3?.[this.extensionName];
  }

  enable = async () => {
    if (!this.installed) return;

    try {
      const injectedExtension = this.rawExtension;
      if (typeof injectedExtension.enable !== 'function') return;

      const rawExtension = await injectedExtension.enable(DAPP_NAME);
      if (!rawExtension) return;

      const extension: InjectedExtension = {
        ...rawExtension,
        name: this.extensionName,
        version: injectedExtension?.version || '',
      };

      this._extension = extension;
      this._signer = extension?.signer as Signer;
      this._metadata = extension?.metadata;
      this._provider = extension?.provider;
    } catch (err) {
      console.error(err);
    }
  };

  private generateWalletAccount = (account: InjectedAccount): WalletAccount => {
    return {
      ...account,
      source: this._extension?.name as string,
      wallet: this,
      signer: this._extension?.signer,
    } as WalletAccount;
  };

  subscribeAccounts = async (callback: SubscriptionFn) => {
    if (!this._extension) await this.enable();

    if (!this._extension) {
      callback(undefined);
      return null;
    }

    return this._extension.accounts.subscribe((accounts: InjectedAccount[]) => {
      const accountsWithWallet = accounts.map(this.generateWalletAccount);
      callback(accountsWithWallet);
    });
  };

  getAccounts = async () => {
    if (!this._extension) await this.enable();
    if (!this._extension) return null;

    const accounts = await this._extension.accounts.get();
    return accounts.map(this.generateWalletAccount);
  };
}

// React Hook for Wallet

export const useDotSamaWallet = (walletInfo: WalletInfo) => {
  const [wallet, setWallet] = useState<DotSamaWallet | null>(null);
  const [accounts, setAccounts] = useState<WalletAccount[] | null>(null);

  useEffect(() => {
    const newWallet = new DotSamaWallet(walletInfo);
    setWallet(newWallet);
  }, [walletInfo]);

  const enableWallet = useCallback(async () => {
    if (!wallet) return;
    await wallet.enable();
  }, [wallet]);

  const fetchAccounts = useCallback(async () => {
    if (!wallet) return;
    const fetchedAccounts = await wallet.getAccounts();
    setAccounts(fetchedAccounts);
  }, [wallet]);

  const subscribeToAccounts = useCallback(
    (callback: SubscriptionFn) => {
      if (!wallet) return;
      wallet.subscribeAccounts(callback);
    },
    [wallet]
  );

  return {
    wallet,
    accounts,
    enableWallet,
    fetchAccounts,
    subscribeToAccounts,
  };
};
