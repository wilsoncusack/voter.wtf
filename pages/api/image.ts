import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.query.url as string;
  const response = await axios.get(url, { responseType: 'arraybuffer' });

  // Check if the response is a valid image type
  if (response.headers['content-type'].startsWith('image/')) {
    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(Buffer.from(response.data, 'binary'));
  } else {
    res.status(400).json({ error: 'Invalid image URL' });
  }
}
