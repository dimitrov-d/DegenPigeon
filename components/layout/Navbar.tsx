import React, { useState } from 'react';
import ConnectButton from '../connect/ConnectButton';
import { useAuth } from '@/context/AuthContext';
import TransfersModal from '../modals/TransfersModal';
import { useAccount, useDisconnect } from 'wagmi';
import { useEnsName } from 'wagmi';
import truncateEthAddress from 'truncate-eth-address';

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({
    address: address,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='w-full h-[65px] fixed top-0 backdrop-blur-md z-50 px-4'>
      <div className='w-full h-full flex flex-row items-center justify-between mx-auto'>
        <div></div>

        <div className='relative'>
          {isAuthenticated ? '1' : '0'}_{isConnected ? '1' : '0'} -{address}
          {isAuthenticated && isConnected && address ? (
            <button
              className='button-primary h-12 min-w-80'
              onClick={async () => await disconnect()}
            >
              Disconnect ({ensName ?? truncateEthAddress(address || '')})
            </button>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
      {isModalOpen && (
        <div>
          <TransfersModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
