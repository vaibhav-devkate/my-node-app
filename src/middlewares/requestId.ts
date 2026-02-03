import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestContext } from '../utils/requestContext';

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.header('x-request-id') || randomUUID()) as string;
  res.setHeader('x-request-id', requestId);

  RequestContext.run({ requestId }, () => {
    next();
  });
};
