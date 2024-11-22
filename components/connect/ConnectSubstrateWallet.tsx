import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getWallets, truncateWallet } from '@/lib/SubstrateWallet';
import { DotsamaWallet } from '@/lib/DotSamaWallet';
import { WalletAccount } from '@/lib/types/wallet';
import Btn from '../Btn';
import { createSiweMessage } from 'viem/siwe';

export default function ConnectSubstrateWallet() {
  const { getNonce, logOut, verifyWallet, setIsAuthenticated, setWalletAddress } = useAuth();

  const [isLoading, setIsLoading] = useState('');
  const [activeWallet, setActiveWallet] = useState<DotsamaWallet | undefined>();
  const [walletAccounts, setWalletAccounts] = useState<WalletAccount[]>([]);

  const message = 'Sign in to DegenPigeon App';
  const wallets = getWallets();

  // we can use web3FromSource which will return an InjectedExtension type

  const selectWallet = async (wallet: DotsamaWallet) => {
    setActiveWallet(wallet);
    await wallet.enable();
    setWalletAccounts((await wallet.getAccounts()) || []);
  };

  const handleLogin = async (account: WalletAccount) => {
    await logOut();
    try {
      setIsLoading(account.address);
      const signature = await getMessageSignature(account.address, message, account.signer);
      await verifyWallet({ message, signature });

      const nonce = await getNonce();
      const sive = await createSiweMessage({
        domain: window.location.host,
        // @ts-ignore
        address: account.address,
        statement: message,
        uri: window.location.origin,
        version: '1',
        chainId: 0,
        nonce,
      });
      console.debug(sive);
      setWalletAddress(account.address);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading('');
    }
  };

  async function getMessageSignature(address: string, msg: string, signer: any) {
    if (signer?.signRaw) {
      try {
        const signResult = await signer.signRaw({
          address,
          data: msg,
          type: 'bytes',
        });

        return signResult.signature;
      } catch (e) {
        console.error('Error signing the message:', e);
      }
    }
    return '';
  }

  return (
    <>
      <div className='flex flex-col gap-2'>
        {wallets.map((wallet, key) => (
          <div key={key}>
            {wallet.installed ? (
              <Btn
                disabled={!wallet.installed}
                loading={false}
                className={`button-outlined w-full ${wallet.installed ? 'cursor-pointer' : ''}`}
                onClick={() => selectWallet(wallet)}
              >
                {walletTemplate(wallet)}
              </Btn>
            ) : (
              <div className='button-outlined disabled'>{walletTemplate(wallet)}</div>
            )}

            {activeWallet && wallet.extensionName === activeWallet.extensionName && (
              <div className='overflow-auto md:overflow-hidden'>
                {walletAccounts.length ? (
                  <table className='text-left w-full'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {walletAccounts.map((account, accountKey) => (
                        <tr key={accountKey} className={account.type === 'ethereum' ? 'hidden' : ''}>
                          <td className='whitespace-nowrap'>{account.name}</td>
                          <td className=''>{truncateWallet(account.address)}</td>
                          <td className='text-right'>
                            <Btn
                              className='button-primary'
                              disabled={false}
                              loading={isLoading === account.address}
                              onClick={() => handleLogin(account)}
                            >
                              {'Connect'}
                            </Btn>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className='p-4 text-center'>
                    <h5>Create an Account</h5>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export const walletTemplate = (wallet: DotsamaWallet) => {
  return (
    <span className='flex items-center text-xs'>
      {wallet.image ? (
        <img src={wallet.image} alt={wallet.extensionName} className='mr-2 w-5 h-5' width={20} height={20} />
      ) : (
        <span className='inline-block w-5 h-5 mr-2' />
      )}
      <span className='flex-1'>{wallet.title}</span>
      <span className='wallet-install'>
        {!wallet.installed ? (
          <a
            href={wallet.installUrl.default}
            className='inline-block relative z-10 cursor-pointer pointer-events-auto'
            target='_blank'
          >
            Install
          </a>
        ) : (
          <span className='inline-block w-5'></span>
        )}
      </span>
    </span>
  );
};
