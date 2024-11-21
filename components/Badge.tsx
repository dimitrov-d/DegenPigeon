import React from 'react';
import Image from 'next/image';

interface BadgeProps {
  text: string;
  icon: string;
  width?: number;
  height?: number;
}
const Badge: React.FC<BadgeProps> = ({
  text,
  icon,
  width = 71,
  height = 12,
}) => {
  return (
    <div className='h-[21px] min-w-28 bg-black p-1 inline-flex items-center gap-2 w-auto'>
      <span className='text-[11px] text-white'>{text}</span>
      <Image
        src={icon}
        alt='Degen pigeon logo'
        width={width || 71}
        height={height || 12}
        className=' mx-auto'
      />
    </div>
  );
};

export default Badge;
