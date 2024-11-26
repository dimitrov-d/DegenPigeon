import jwt from 'jsonwebtoken';
import { LogLevel, Storage } from '@apillon/sdk';

export default async function handler(req, res) {
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

  // Check if the user is authenticated
  const jwtToken = req.cookies['degen-pigeon-auth'];
  if (!jwtToken) {
    return res.status(401).json({ error: 'Unauthorized: User is not authenticated.' });
  }
  const user = jwt.verify(jwtToken, process.env.NEXT_IRON_PASSWORD);

  if (req.method === 'GET') {
    const { walletAddress } = req.body;
    const directoryPath = user.address || walletAddress;

    if (!directoryPath) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const allBucketFilesAndDirectories = await bucket.listObjects({
        limit: 10000,
      });
      const directoryUuid = allBucketFilesAndDirectories.items.find(
        (item) => item.type === 1 && item.name === directoryPath
      )?.uuid;

      if (!directoryUuid) {
        return res.status(404).json({ error: 'Directory not found' });
      }

      const data = await bucket.listObjects({ directoryUuid, limit: 1000 });

      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
