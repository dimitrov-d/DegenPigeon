import type {
  InjectedAccount,
  InjectedExtension,
  InjectedMetadata,
  InjectedProvider,
  InjectedWindow,
} from '@polkadot/extension-inject/types';
import type { Signer } from '@polkadot/types/types';
import { SubscriptionFn, WalletAccount, WalletInfo } from './types/wallet';

const DAPP_NAME = 'DegenPigeon Wallet Connect';

export class DotsamaWallet {
  extensionName: string;
  title: string;
  installUrl: Record<string, string>;
  image: string;

  private _extension: InjectedExtension | undefined;
  private _signer: Signer | undefined;
  private _metadata: InjectedMetadata | undefined;
  private _provider: InjectedProvider | undefined;

  constructor({ extensionName, installUrl, image, title }: WalletInfo) {
    this.extensionName = extensionName;
    this.title = title;
    this.installUrl = installUrl;
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
    const injectedExtension = injectedWindow?.injectedWeb3?.[this.extensionName];

    return !!injectedExtension;
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
    };
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
