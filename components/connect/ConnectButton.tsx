import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { useEnsName } from 'wagmi';
import truncateEthAddress from 'truncate-eth-address';
import ModalWallet from '../modals/ModalWallet';
import { createSiweMessage } from 'viem/siwe';
import { mainnet } from 'viem/chains';
import { truncateWallet } from '@/lib/SubstrateWallet';

const ConnectButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, walletAddress, getNonce, logOut, verifyWallet, setIsAuthenticated } = useAuth();

  const { disconnect } = useDisconnect();
  const { address, isConnected, chainId } = useAccount();
  const { data: signature, signMessage } = useSignMessage();
  const { data: ensName } = useEnsName({
    address: address,
  });
  const message = 'Sign in to DegenPigeon App';

  const disconnectWallet = async () => {
    await disconnect();
    await logOut();
  };

  useEffect(() => {
    const onConnected = async () => {
      await signMessage({ message });
    };

    if (isConnected) {
      onConnected();
    }
  }, [isConnected]);

  useEffect(() => {
    (async () => {
      if (signature && (await verifyWallet({ message, signature }))) {
        const nonce = await getNonce();

        await createSiweMessage({
          domain: window.location.host,
          // @ts-ignore
          address: address,
          statement: message,
          uri: window.location.origin,
          version: '1',
          chainId: chainId || mainnet.id,
          nonce,
        });
      }
    })();
  }, [signature]);

  return (
    <>
      {isAuthenticated && (walletAddress || address) ? (
        <button className='button-primary h-12 min-w-80' onClick={async () => await disconnectWallet()}>
          Disconnect ({address ? truncateEthAddress(address || '') : truncateWallet(walletAddress || '')})
        </button>
      ) : (
        <button className='button-primary h-12 min-w-80' onClick={() => setShowModal(true)}>
          Connect Wallet
        </button>
      )}
      {!isAuthenticated && <ModalWallet isOpen={showModal} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default ConnectButton;
