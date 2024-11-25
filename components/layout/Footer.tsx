import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const Footer = () => {
  const { setIsDocumentation } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='w-full border-t border-border px-4 pt-8 pb-6'>
      <div className=' max-w-[45rem] w-full h-full flex flex-row items-center justify-between mx-auto'>
        <div className='text-black text-xs'>
          <strong>degenpigeon.com © 2024</strong>
        </div>
        <div className='text-[10px]'>
          <span className='cursor-pointer' onClick={() => setIsDocumentation(true)}>
            How does it work? Decentralization
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
