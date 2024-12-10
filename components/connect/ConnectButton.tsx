import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { useEnsName } from 'wagmi';
import truncateEthAddress from 'truncate-eth-address';
import ModalWallet from '../modals/ModalWallet';
import { truncateWallet } from '@/lib/SubstrateWallet';

type Props = {
  [x: string]: any;
  center: boolean;
};

const ConnectButton = ({ center, ...attrs }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { isAuthenticated, walletAddress, logOut, verifyWallet } = useAuth();

  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { data: signature, signMessage } = useSignMessage();
  const { data: ensName } = useEnsName({ address: address });
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
      if (address && signature) {
        await verifyWallet({ address, username: address, message, signature });
        setShowModal(false);
      }
    })();
  }, [signature]);

  return (
    <>
      {isAuthenticated && (walletAddress || address) ? (
        <button
          className={`button-primary h-12 min-w-80 ${attrs.className}`}
          onClick={async () => await disconnectWallet()}
        >
          Disconnect ({address ? truncateEthAddress(address || '') : truncateWallet(walletAddress || '')})
        </button>
      ) : (
        <button className={`button-primary h-12 min-w-80 ${attrs.className}`} onClick={() => setShowModal(true)}>
          Login with wallet
        </button>
      )}
      {!isAuthenticated && <ModalWallet isOpen={showModal} center={center} onClose={() => setShowModal(false)} />}
    </>
  );
};

export default ConnectButton;
