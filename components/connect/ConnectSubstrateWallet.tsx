import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getWallets, truncateWallet } from '@/lib/SubstrateWallet';
import { WalletAccount } from '@/lib/types/wallet';
import { DotsamaWallet } from '@/lib/DotsamaWallet';
import Btn from '../Btn';

export default function ConnectSubstrateWallet() {
  const { verifyWallet } = useAuth();

  const [isLoading, setIsLoading] = useState('');
  const [activeWallet, setActiveWallet] = useState<DotsamaWallet | undefined>();
  const [walletAccounts, setWalletAccounts] = useState<WalletAccount[]>([]);

  const message = 'Sign in to DegenPigeon App';
  const wallets = getWallets();

  const selectWallet = async (wallet: DotsamaWallet) => {
    setActiveWallet(wallet);
    await wallet.enable();
    setWalletAccounts((await wallet.getAccounts()) || []);
  };

  const handleLogin = async (account: WalletAccount) => {
    try {
      setIsLoading(account.address);
      const signature = await getMessageSignature(account.address, message, account.signer);

      await verifyWallet({ address: account.address, username: account.name || account.address, message, signature });
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
    <div className='flex items-center justify-center gap-2 text-xs'>
      {wallet.image ? (
        <img src={wallet.image} alt={wallet.extensionName} className='mr-2 w-5 h-5' width={20} height={20} />
      ) : (
        <span className='inline-block w-5 h-5 mr-2' />
      )}
      <span>{wallet.title}</span>
      <span className='wallet-install'>
        {!wallet.installed ? (
          <a
            href={wallet.installUrl.default}
            className='inline-block relative z-10 cursor-pointer pointer-events-auto text-[10px]'
            target='_blank'
          >
            Install
          </a>
        ) : (
          <span className='inline-block w-5'></span>
        )}
      </span>
    </div>
  );
};
