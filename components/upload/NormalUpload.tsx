import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { ClipLoader } from 'react-spinners';
import UploadSuccessModal from '../modals/UploadSuccessModal';
import helpers from '@/utils/helpers';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { FileUploader } from 'react-drag-drop-files';

const NormalUpload: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const { address: connectedWalletAddress } = useAccount();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadedFileLink, setUploadedFileLink] = useState('');
  const { openConnectModal } = useConnectModal();

  const handleChange = (file: File) => {
    setFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated && openConnectModal) {
      openConnectModal();
      return;
    }

    if (!file) {
      alert('Please select a file to upload.');
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
        }),
      });

      if (!response.ok) {
        throw new Error('An error occurred.');
      }

      const data = await response.json();
      // @ts-ignore
      if (!data.ipfs_url) {
        throw new Error('File upload failed.');
      }
      // Reset form
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploadedFileLink(data.ipfs_url);
      setShowModal(true);
    } catch (error) {
      console.error('Error during upload process:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=''>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='space-y-1'>
          <FileUploader handleChange={handleChange} name='file'>
            <div className='relative w-full p-4 pb-8 text-center text-grey dashed-border'>
              <Image
                src='/images/cloud-add.svg'
                alt='Degen pigeon upload'
                width={39}
                height={39}
                className='mx-auto mb-4 text-text-light'
              />
              {file ? (
                <strong className='text-[13px]'>{file.name}</strong>
              ) : (
                <span className='text-[13px] font-normal'>
                  Drag & drop a file to upload.
                </span>
              )}
            </div>
          </FileUploader>
        </div>
        <div className='flex justify-between items-center pt-2'>
          <button
            type='submit'
            className='button-primary w-full'
            disabled={loading}
          >
            {loading ? <ClipLoader color='white' size={20} /> : 'Upload'}
          </button>
        </div>
      </form>
      <UploadSuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        fileLink={uploadedFileLink}
      />
    </div>
  );
};

export default NormalUpload;
