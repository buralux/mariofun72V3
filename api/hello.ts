import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    message: 'Hello from MarioFun72 V3 API!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}