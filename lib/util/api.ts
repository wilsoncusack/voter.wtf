import { NextApiRequest, NextApiResponse } from 'next';

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
export async function restrictHandlerMethods(
  handler: Handler,
  methods: string[]
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    if (!methods.includes(method)) {
      res.status(400).json({
        statusCode: 400,
        message: 'Only GET requests are allowed',
      });
      return;
    }
    await handler(req, res);
  };
}
