import type { Request, Response, NextFunction } from 'express';
import sanitize from 'mongo-sanitize';
import xssFilters from 'xss-filters';

const sanitizeObject = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'string') {
      return xssFilters.inHTMLData(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  return sanitized;
};

export const xssSanitizer = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) {
    try {
        const sanitizedQuery = sanitizeObject(req.query);
        for(const key in req.query) {
            delete (req.query as any)[key];
        }
        Object.assign(req.query, sanitizedQuery);
    } catch (e) {}
  }
  if (req.params) {
      try {
        const sanitizedParams = sanitizeObject(req.params);
        for(const key in req.params) {
            delete (req.params as any)[key];
        }
        Object.assign(req.params, sanitizedParams);
      } catch (e) {}
  }
  next();
};

export const mongoSanitizer = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
};
