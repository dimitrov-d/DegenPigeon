import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Main from '@/components/Main';
import Badge from '@/components/Badge';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import Documentation from '@/components/Documentation';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { isDocumentation, setIsDocumentation } = useAuth();
  return (
    <div className={`h-full w-full ${inter.className}`}>
      <div className='flex flex-col justify-between gap-20 min-h-screen'>
        <Navbar />

        {isDocumentation && (
          <div
            className='fixed left-0 top-0 right-0 h-full min-h-screen w-screen'
            onClick={() => setIsDocumentation(false)}
          ></div>
        )}
        {isDocumentation ? <Documentation /> : <Main />}

        <div className='w-full'>
          <div className='flex flex-col gap-1 items-center mb-2'>
            <Badge text='build with' icon='/images/apillon.svg' />
            <Badge text='secured by' icon='/images/polkadot.svg' />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
