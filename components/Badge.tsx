import React from 'react';
interface BadgeProps {
  text: string;
  icon: string;
}
const Badge = ({ text, icon }: BadgeProps) => {
  return (
    <div className='h-[21px] min-w-28 bg-black p-1 inline-flex items-center gap-2 w-auto'>
      <span className='text-[11px] text-white'>{text}</span>
      <img
        className='mx-auto'
        src={icon}
        alt='Degen pigeon logo'
        loading='lazy'
        width={71}
        height={12}
      />
    </div>
  );
};

export default Badge;
