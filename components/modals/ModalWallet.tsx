import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import ConnectEvmWallet from '../connect/ConnectEvmWallet';
import ConnectSubstrateWallet from '../connect/ConnectSubstrateWallet';

interface ModalProps {
  isOpen: boolean;
  center: boolean;
  onClose: () => void;
}

function ModalWallet({ isOpen, center, onClose }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-[99999]'>
      <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
        <DialogPanel
          className={`fixed  max-w-lg space-y-4 border border-gray-600 bg-bg-light p-12 pt-8  text-text-dark lg:min-w-[28rem] ${
            center ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'top-20 right-10'
          }`}
        >
          <DialogTitle className='font-bold text-center text-2xl'>Choose wallet</DialogTitle>
          <div className='text-gray-400 text-center'>
            <h4 className='text-sm font-bold mb-2'>Polkadot Wallets</h4>
            <ConnectSubstrateWallet />
            <h4 className='text-sm font-bold mb-2 mt-8'>EVM Wallets</h4>
            <ConnectEvmWallet />
          </div>
          {center && (
            <div className='absolute top-0 right-0 !mt-0 translate-x-1/2 -translate-y-1/2'>
              <button onClick={onClose} className='w-12 h-12 flex justify-center items-center rounded-full bg-bg-black'>
                <img src='/images/close.svg' alt='' width={18} height={18} className='' />
              </button>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ModalWallet;
