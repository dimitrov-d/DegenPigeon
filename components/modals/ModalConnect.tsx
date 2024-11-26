import React, { useEffect } from 'react';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import ConnectButton from '../connect/ConnectButton';
import Btn from '../Btn';
import { useAuth } from '@/context/AuthContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ModalConnect({ isOpen, onClose }: ModalProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated]);

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-[99999]'>
      <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
        <DialogPanel className='relative max-w-[45rem] w-full space-y-4 border border-brown-dark bg-bg-light p-12'>
          <DialogTitle className='text-text-dark text-2xl mb-4 font-bold'>Not connected</DialogTitle>
          <Description className='text-gray-400'>
            <p className='mb-6'>Before proceeding, connect your wallet.</p>
            <div className='flex gap-8'>
              <ConnectButton className='min-w-0 w-1/2' center={true} />
              <Btn
                className='button-outlined !text-brown-light hover:!text-text-dark w-1/2'
                loading={false}
                disabled={false}
                onClick={onClose}
              >
                Cancel
              </Btn>
            </div>
          </Description>
          <div className='absolute top-0 right-0 !mt-0 translate-x-1/2 -translate-y-1/2'>
            <button onClick={onClose} className='w-12 h-12 flex justify-center items-center rounded-full bg-bg-black'>
              <img src='/images/close.svg' alt='' width={18} height={18} className='' />
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ModalConnect;
