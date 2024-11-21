import React from 'react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import ConnectEvmWallet from '../connect/ConnectEvmWallet';
import ConnectSubstrateWallet from '../connect/ConnectSubstrateWallet';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ModalWallet({ isOpen, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-[99999]'>
      <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
        <DialogPanel className='fixed top-20 right-10 max-w-lg space-y-4 border border-gray-600 bg-bg-dark p-12 pt-8 rounded-2xl text-text-dark lg:min-w-[25rem]'>
          <DialogTitle className='font-bold text-center text-xl'>
            Connect wallet
          </DialogTitle>
          <div className='text-gray-400 text-center'>
            <h3 className='mb-2'>Polkadot Wallets</h3>
            <ConnectSubstrateWallet />
            <h3 className='mb-2 mt-8'>EVM Wallets</h3>
            <ConnectEvmWallet />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ModalWallet;
