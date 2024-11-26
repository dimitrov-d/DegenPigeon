import jwt from 'jsonwebtoken';
import { LogLevel, Storage } from '@apillon/sdk';

if (!process.env.APILLON_API_KEY || !process.env.APILLON_API_SECRET) {
  throw new Error('Apillon SDK credentials are not properly set');
}

if (!process.env.APILLON_BUCKET_UUID) {
  throw new Error('Apillon SDK bucket UUID is not properly set');
}

const storage = new Storage({
  key: process.env.APILLON_API_KEY,
  secret: process.env.APILLON_API_SECRET,
  logLevel: LogLevel.VERBOSE,
});

const bucket = storage.bucket(process.env.APILLON_BUCKET_UUID);

export default async function handler(req, res) {
  // Check if the user is authenticated
  const jwtToken = req.cookies['degen-pigeon-auth'];
  if (!jwtToken) {
    return res.status(401).json({ error: 'Unauthorized: User is not authenticated.' });
  }
  const user = jwt.verify(jwtToken, process.env.NEXT_IRON_PASSWORD);

  if (req.method === 'POST') {
    const { fileName, contentType, content, walletAddress } = req.body;

    const directoryPath = user.address || walletAddress;

    if (!fileName || !content || !directoryPath) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const bufferContent = Buffer.from(content, 'base64');
      const response = await bucket.uploadFiles(
        [
          {
            fileName: fileName,
            contentType: contentType,
            content: bufferContent,
          },
        ],
        { wrapWithDirectory: true, directoryPath, awaitCid: true }
      );
      const responseData = response[0];

      if (!responseData.fileName || !responseData.CID || !responseData.fileUuid) {
        return res.status(500).json({ error: 'Failed to upload files' });
      }

      const ipfsLink = await storage.generateIpfsLink(responseData.CID);

      if (!ipfsLink) {
        return res.status(500).json({ error: 'Failed to generate IPFS link' });
      }

      res.status(200).json({ ipfs_url: ipfsLink });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};
