import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Main from '@/components/Main';
import Badge from '@/components/Badge';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className={`h-full w-full ${inter.className}`}>
      <div className='flex flex-col justify-between gap-20 min-h-screen'>
        <Navbar />

        <div className='pt-20 px-4'>
          <Main />
        </div>
        <div>
          <div className='flex flex-col gap-1 items-center mb-2'>
            <Badge text='build with' icon='/images/apillon.svg' />
            <Badge text='secured by' icon='/images/polkadot.svg' />
          </div>
          <Footer />
        </div>
      </div>
    </main>
  );
}
