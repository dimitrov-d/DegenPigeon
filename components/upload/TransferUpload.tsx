import React, { useState, useRef } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useAuth } from '@/context/AuthContext';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import SuccessModal from '../modals/SuccessModal';
import helpers from '@/utils/helpers';

import { useAccount } from 'wagmi';
import ModalConnect from '../modals/ModalConnect';

const TransferUploadCard: React.FC = () => {
  const { isAuthenticated, walletAddress } = useAuth();
  const { address: ethAddress } = useAccount();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalConnect, setShowModalConnect] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleChange = (file: File) => {
    setFile(file);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated && !showModalConnect) {
      setShowModalConnect(true);
      return;
    }

    if (!file || !recipientEmail) {
      toast.error('Please select a file and enter a recipient email.');
      return;
    }

    setLoading(true);
    const buffer = (await helpers.getFileBuffer(file)) as Buffer;
    const base64Content = buffer.toString('base64');
    try {
      const response = await fetch('/api/apillon/upload-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          content: base64Content,
          walletAddress: ethAddress || walletAddress,
        }),
      });

      const data = await response.json();
      // @ts-ignore
      if (!data.ipfs_url) {
        throw new Error('File upload failed.');
      }

      await helpers.sendEmail({
        to: recipientEmail,
        from: 'info@apillon.io',
        fromName: 'FileFusion',
        subject: 'Someone sent you a file via FileFusion',
        text: `File link: ${data.ipfs_url}`,
        link: data.ipfs_url,
      });

      toast.success('File uploaded and email sent successfully!');

      // Reset form
      setRecipientEmail('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowModal(true);
    } catch (error) {
      console.error('Error during upload process:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='space-y-1'>
          <FileUploader handleChange={handleChange} name='file'>
            <div className='relative block w-full p-4 pb-8 text-center text-grey dashed-border'>
              <img
                src='/images/cloud-add.svg'
                alt='Degen pigeon upload'
                width={39}
                height={39}
                className='mx-auto mb-4 text-text-light'
              />
              {file ? (
                <strong className='text-[13px]'>{file.name}</strong>
              ) : (
                <span className='text-[13px] font-normal'>Drag & drop a file to upload.</span>
              )}
            </div>
          </FileUploader>
          <div className='text-center pt-6 mb-8'>
            <input
              type='file'
              className='absolute invisible -z-10'
              onChange={handleFileChange}
              ref={fileInputRef}
              id='btnFile'
            />
            <label htmlFor='btnFile' className='button-primary !rounded-full'>
              Browse file
            </label>
          </div>
        </div>

        <div className='space-y-1'>
          <label>Enter the mail</label>
          <input
            type='email'
            className='w-full'
            placeholder="Enter recipient's email address."
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </div>

        <button type='submit' className={`button-primary w-full`} disabled={loading}>
          {loading ? <ClipLoader color='white' size={20} /> : 'Transfer'}
        </button>
      </form>
      <SuccessModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <ModalConnect isOpen={showModalConnect} onClose={() => setShowModalConnect(false)} />
    </>
  );
};

export default TransferUploadCard;
