import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const { method } = req;
  switch (method) {
    case 'GET':
      const jwtToken = req.cookies['degen-pigeon-auth'];
      if (jwtToken) {
        const user = jwt.verify(jwtToken, process.env.NEXT_IRON_PASSWORD);
        if (user && user.address) {
          return res.json({ ok: true, address: user.address });
        }
      }
      return res.json({ ok: false });
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
