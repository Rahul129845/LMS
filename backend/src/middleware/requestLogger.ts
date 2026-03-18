import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, url } = req;
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  next();
  const duration = Date.now() - start;
  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${duration}ms`);
}
