import { serialize } from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    res.setHeader(
      'Set-Cookie',
      serialize('degen-pigeon-auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1,
        path: '/',
      })
    );
    return res.status(200).json({ ok: true, message: 'Logged out successfully' });
  }
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
