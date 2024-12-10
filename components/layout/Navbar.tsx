import React from 'react';
import ConnectButton from '../connect/ConnectButton';

const Navbar = () => {
  return (
    <div className='w-full h-[65px] fixed top-0 z-50 px-4'>
      <div className='w-full h-full flex flex-row items-center justify-between mx-auto'>
        <div></div>

        <div className='relative'>
          <ConnectButton center={false} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
