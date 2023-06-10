import { NextApiRequest, NextApiResponse } from 'next';

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
export function restrictHandlerMethods(handler: Handler, methods: string[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method;
    if (method && !methods.includes(method)) {
      res.status(405).json({
        statusCode: 405,
        message: `Method ${method} is not allowed. Allowed methods: ${methods.join(
          ', '
        )}`,
      });
      return;
    }
    await handler(req, res);
  };
}
