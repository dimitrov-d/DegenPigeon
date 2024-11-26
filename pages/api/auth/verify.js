import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { Identity } from '@apillon/sdk';

export const maxDuration = 60;

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, address, message, signature } = req.body;

    const jwtToken = req.cookies['degen-pigeon-auth'];
    if (jwtToken) {
      const user = jwt.verify(jwtToken, process.env.NEXT_IRON_PASSWORD);
      if (user && user.username === username && user.address === address) {
        return res.json({ ok: true, message: 'Already logged in' });
      }
    }

    const identity = new Identity();

    if (address.startsWith('0x')) {
      const validatedSignature = identity.validateEvmWalletSignature({
        walletAddress: address,
        message,
        signature,
      });
      console.debug(address, validatedSignature);
      if (!validatedSignature.isValid) throw new Error('Invalid signature.');
    } else {
      const validatedSignature = identity.validatePolkadotWalletSignature({
        walletAddress: address,
        message,
        signature,
      });
      console.debug(address, validatedSignature);
      if (!validatedSignature.isValid) throw new Error('Invalid signature.');
    }

    // Replace with real user validation logic
    const token = jwt.sign({ username, address }, process.env.NEXT_IRON_PASSWORD, { expiresIn: '1h' });

    res.setHeader(
      'Set-Cookie',
      serialize('degen-pigeon-auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        path: '/',
      })
    );

    return res.json({ ok: true });
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
