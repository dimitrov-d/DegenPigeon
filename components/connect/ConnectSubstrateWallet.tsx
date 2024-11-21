import { useState } from 'react';
import SubstrateWallet from './SubstrateWallet';
import { usePolkadotExtensionWithContext } from '@/context/polkadotExtensionContext';
import { getWallets } from '@/hooks/useSubstrateWallet';
import Btn from '../Btn';

export default function ConnectSubstrateWallet() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWallet, setActiveWallet] = useState<Wallet | undefined>();

  const wallets = getWallets();

  const { accounts, actingAccount, injector } =
    usePolkadotExtensionWithContext();
  // we can use web3FromSource which will return an InjectedExtension type
  // console.log(accounts);
  // console.log(actingAccount);
  // console.log(injector);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      let signature = '';
      const message = {
        statement:
          'Sign in with polkadot extension to the example tokengated example dApp',
        uri: window.location.origin,
        version: '1',
      };

      const signRaw = injector?.signer?.signRaw;

      if (!!signRaw && !!actingAccount) {
        // after making sure that signRaw is defined
        // we can use it to sign our message
        const data = await signRaw({
          address: actingAccount.address,
          data: JSON.stringify(message),
          type: 'bytes',
        });

        signature = data.signature;
      }

      setIsLoading(false);
    } catch (error) {
      setError('Cancelled Signature');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* <ul>
        {wallets.map((wallet) => (
          <li key={wallet.extensionName}>
            <img src={wallet.icon} alt={wallet.title} />
            <h3>{wallet.title}</h3>
            <p>
              Install:{' '}
              <a
                href={wallet.installUrl.default}
                target='_blank'
                rel='noopener noreferrer'
              >
                Browser Extension
              </a>
            </p>
          </li>
        ))}
      </ul> */}

      <div className='flex flex-col gap-2'>
        {wallets.map((wallet, key) => (
          <div key={key}>
            <Btn
              disabled={!wallet.installed}
              loading={false}
              className={`button-outlined w-full ${
                wallet.installed ? 'cursor-pointer' : ''
              }`}
              onClick={() => setActiveWallet(wallet)}
            >
              <span className='flex items-center text-xs'>
                {wallet.image ? (
                  <img
                    src={wallet.image}
                    alt={wallet.extensionName}
                    className='mr-2 w-5 h-5'
                    width={20}
                    height={20}
                  />
                ) : (
                  <span className='inline-block w-5 h-5 mr-2' />
                )}
                <span className='flex-1'>{wallet.title}</span>
                <span className='wallet-install'>
                  {!wallet.installed && (
                    <a
                      href={wallet.installUrl.default}
                      className='inline-block relative z-10 cursor-pointer pointer-events-auto'
                      target='_blank'
                    >
                      Install
                    </a>
                  )}
                </span>
              </span>
            </Btn>
            {activeWallet && wallet.extensionName === activeWallet.name && (
              <div className='overflow-auto md:overflow-hidden'>
                {activeWallet.accounts?.length ? (
                  <table className='text-left'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {activeWallet.accounts.map((account, accountKey) => (
                        <tr
                          key={accountKey}
                          className={
                            account.type === 'ethereum' ? 'hidden' : ''
                          }
                        >
                          <td className='whitespace-nowrap'>{account.name}</td>
                          <td>{account.address}</td>
                          <td>
                            {/* {authStore.jwt &&
                                authStore.user.wallet === account.address &&
                                disconnect ? (
                                  <Btn
                                    type='error'
                                    loading={
                                      loading &&
                                      authStore.wallet.address ===
                                        account.address
                                    }
                                    onClick={() => onRemove(account)}
                                  >
                                    Disconnect
                                  </Btn>
                                ) : ( */}
                            {/* <Btn
                              type='secondary'
                              loading={
                                loading &&
                                authStore.wallet.address === account.address
                              }
                              onClick={() => connectAccount(account)}
                            >
                              {'Connect'}
                            </Btn> */}
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
