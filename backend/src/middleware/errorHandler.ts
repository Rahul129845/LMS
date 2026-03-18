import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  errors?: unknown;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}`, err.stack);

  res.status(statusCode).json({
    error: message,
    ...(err.errors ? { details: err.errors } : {}),
  });
}

export function createError(message: string, statusCode: number, errors?: unknown): AppError {
  const err = new Error(message) as AppError;
  err.statusCode = statusCode;
  err.errors = errors;
  return err;
}
