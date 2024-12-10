import React from 'react';

export default function Documentation() {
  return (
    <main className='flex justify-center gap-6 mt-8 pt-20 px-4'>
      <div className='max-w-[45rem] w-full bg-bg-dark rounded-2xl p-8 lg:p-10 xl:px-[110px] text-center z-10'>
        <img
          src='/images/pigeon.png'
          alt='Degen pigeon'
          width={128}
          height={128}
          className='w-[128px] mx-auto translate-y-3 transition-all duration-200 '
        />
        <h1 className='text-2xl font-bold my-4 text-text-dark'>DegenPigeon</h1>
        <h2 className='text-lg font-bold my-4 text-text-dark'>What is it all about?</h2>

        <h4 className='text-sm font-bold mt-8 mb-2 text-text-dark'>What is web3?</h4>
        <p>
          DegenPigeon is a Web3 dapp. <br />
          Web3 is the next-gen internet where you <b>own your data</b>, enjoy &nbsp;
          <b>enhanced privacy</b>, and thrive in a <b>decentralized ecosystem</b>. It’s all about freedom, control, and,
          of course, <b>unstoppability</b>.
        </p>

        <h4 className='text-sm font-bold mt-8 mb-2 text-text-dark'>What is decentralized storage?</h4>
        <p>
          DegenPigeon leverages the IPFS network (InterPlanetary File System) to store your uploaded files across random
          nodes worldwide. This ensures unstoppability, redundancy, and global availability. Unlike traditional systems,
          we do not store your files on a central server and have no direct control over the files you share.
        </p>

        <h4 className='text-sm font-bold mt-8 mb-2 text-text-dark'>What about the email for sharing?</h4>
        <p>
          The email address is only used once—just to send your file. The backend code processes it, and then poof! It’s
          gone. No emails, no database snooping.
        </p>

        <h4 className='text-sm font-bold mt-8 mb-2 text-text-dark'>How does DegenPigeon work?</h4>
        <p>
          Forget account sign-ups and invasive data grabs. Simply:
          <ol>
            <li>1. Connect your wallet.</li>
            <li>2. Share files via decentralized storage.</li>
            <li>3. Stay private, secure, and unstoppable.</li>
          </ol>
        </p>

        <hr className='h-0 border-t border-border mt-4 mb-2 w-full' />

        <ul className='my-4'>
          <li>
            <a
              className='hover:underline'
              href='https://wiki.apillon.io/web3-services/2-web3-storage.html#storage-bucket'
              target='_blank'
            >
              Learn more about Web3
            </a>
          </li>
          <li>
            <a
              className='hover:underline'
              href='https://blog.apillon.io/faq-apillon-web3-storage-c99a9b0e8b12'
              target='_blank'
            >
              Learn more about IPFS Storage
            </a>
          </li>
          <li>
            <a className='hover:underline' href='https://github.com/dimitrov-d/DegenPigeon' target='_blank'>
              Review DegenPigeon's code
            </a>
          </li>
        </ul>
        <h3 className='font-bold'>
          Don’t take our word for it, try it out. Welcome to Web3. <br />
          Squawk!
        </h3>
      </div>
    </main>
  );
}
