import React from 'react';
import { useConnect } from 'wagmi';

function ConnectEvmWallet() {
  const { connect, connectors } = useConnect();

  const evmWallets = [
    {
      name: 'MetaMask',
      image: '/images/wallet/metaMask.svg',
      connector: connectors.find((c) => c.id === 'metaMask'),
    },
    {
      name: 'Coinbase Wallet',
      image: '/images/wallet/coinbaseWallet.svg',
      connector: connectors.find((c) => c.id === 'coinbaseWalletSDK'),
    },
    {
      name: 'WalletConnect',
      image: '/images/wallet/walletConnect.svg',
      connector: connectors.find((c) => c.id === 'walletConnect'),
    },
  ];

  const handleConnect = async (connector) => {
    await connect({ connector });
  };

  return (
    <div className='flex flex-col gap-2 text-xs'>
      {evmWallets.map((wallet) =>
        wallet?.connector ? (
          <button
            className='button-outlined whitespace-nowrap flex items-center gap-2'
            onClick={() => handleConnect(wallet.connector)}
            key={wallet.connector.uid}
          >
            <img
              src={wallet.image}
              alt={wallet.name}
              className='mr-2 w-5 h-5'
              width={20}
              height={20}
            />
            <span className='block'>{wallet.name}</span>
          </button>
        ) : (
          <span></span>
        )
      )}
    </div>
  );
}

export default ConnectEvmWallet;
