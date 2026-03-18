import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from './auth.validator';
import { registerUser, loginUser, refreshAccessToken, logoutUser } from './auth.service';
import { cookieConfig } from '../../config/security';
import { createError } from '../../middleware/errorHandler';

const REFRESH_COOKIE = 'refreshToken';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(createError('Validation failed', 400, parsed.error.flatten().fieldErrors));
    }

    const result = await registerUser(parsed.data);
    res.cookie(REFRESH_COOKIE, result.refreshToken, cookieConfig);
    res.status(201).json({ accessToken: result.accessToken, user: result.user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(createError('Validation failed', 400, parsed.error.flatten().fieldErrors));
    }

    const result = await loginUser(parsed.data);
    res.cookie(REFRESH_COOKIE, result.refreshToken, cookieConfig);
    res.json({ accessToken: result.accessToken, user: result.user });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawToken = req.cookies[REFRESH_COOKIE];
    if (!rawToken) {
      return next(createError('No refresh token', 401));
    }

    const result = await refreshAccessToken(rawToken);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawToken = req.cookies[REFRESH_COOKIE];
    if (rawToken) {
      await logoutUser(rawToken);
    }
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}
