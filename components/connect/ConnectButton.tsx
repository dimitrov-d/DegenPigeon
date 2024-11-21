import React, { useEffect, useState } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAuth } from '@/context/AuthContext';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { useEnsName } from 'wagmi';
import truncateEthAddress from 'truncate-eth-address';
import ModalWallet from '../modals/ModalWallet';
import { createSiweMessage } from 'viem/siwe';
import { chainConfig } from 'viem/zksync';
import { mainnet } from 'viem/chains';
import { recoverMessageAddress } from 'viem';

const ConnectButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, logOut, verifyWallet } = useAuth();

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
      if (signature) {
        const verified = await verifyWallet({ message, signature });

        if (verified) {
          const nonce = await getNonce();
          const sive = await createSiweMessage({
            domain: window.location.host,
            // @ts-ignore
            address: address,
            statement: message,
            uri: window.location.origin,
            version: '1',
            chainId: chainId || mainnet.id,
            nonce,
          });
          console.debug(sive);
        }
      }
    })();
  }, [signature]);

  const getNonce = async () => {
    const response = await fetch('/api/auth/nonce');
    return await response.text();
  };

  return (
    <>
      {isAuthenticated || (isConnected && address) ? (
        <button
          className='button-primary h-12 min-w-80'
          onClick={async () => await disconnectWallet()}
        >
          Disconnect ({ensName ?? truncateEthAddress(address || '')})
        </button>
      ) : (
        <button
          style={{ width: '160px' }}
          onClick={() => setShowModal(true)}
          className='button-primary h-12 min-w-80'
        >
          Connect Wallet
        </button>
      )}

      <ModalWallet isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default ConnectButton;
