import React from 'react';

export default function Documentation() {
  return (
    <main className='flex justify-center gap-6 mt-8 pt-20 px-4'>
      <div className='max-w-[45rem] w-full bg-bg-dark rounded-2xl p-8 lg:p-10 xl:px-32 text-center z-10'>
        <img
          src='/images/pigeon.png'
          alt='Degen pigeon'
          width={128}
          height={128}
          className='w-[128px] mx-auto translate-y-3 transition-all duration-200 '
        />
        <h1 className='text-2xl font-bold my-4 text-text-dark'>DegenPigeon</h1>
        <h2 className='text-lg font-bold my-4 text-text-dark'>What is it all about?</h2>

        <h4 className='text-sm font-bold mt-8 text-text-dark'>What is web3?</h4>
        <p>
          DegenPigeon is a Web3 dapp.Web3 is a new paradigm that provides users with data ownership, enhanced privacy,
          and decentralization, ensuring unstoppability.
        </p>

        <h4 className='text-sm font-bold mt-8 text-text-dark'>What is decentralized storage?</h4>
        <p>
          DegenPigeon utilizes the IPFS network (InterPlanetary File System) to distribute your uploaded files across 20
          random nodes worldwide. This ensures unstoppability, redundancy, and global availability. Unlike traditional
          systems, we do not store your files on a central server and have no direct control over the files you share.
        </p>

        <h4 className='text-sm font-bold mt-8 text-text-dark'>What about the email I enter for sharing?</h4>
        <p>
          The backend code processes and sends the email, but the email address is not stored anywhere. Rest assured, we
          do not keep emails in our database nor have access to them after the email is sent.
        </p>

        <h4 className='text-sm font-bold mt-8 text-text-dark'>How does it work?</h4>
        <p>
          Using DegenPigeon does not require account creation, ensuring your privacy remains intact. Instead, you
          connect your wallet to access and utilize the underlying decentralized storage for sharing files.
        </p>

        <hr className='h-0 border-t border-border mt-4 mb-2 w-full' />

        <ul className='my-2'>
          <li>
            <a href='https://wiki.apillon.io/web3-services/2-web3-storage.html#storage-bucket' target='_blank'>
              Learn more about Web3
            </a>
          </li>
          <li>
            <a href='https://blog.apillon.io/faq-apillon-web3-storage-c99a9b0e8b12' target='_blank'>
              Learn more about IPFS Storage
            </a>
          </li>
          <li>
            <a href='https://github.com/Apillon/FileFusion' target='_blank'>
              Review DegenPigeon code
            </a>
          </li>
        </ul>
        <h3 className='mt-2 mb-6 font-bold'>Don’t trust, verify! Welcome to Web3! Squawk!</h3>
      </div>
    </main>
  );
}
