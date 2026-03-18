import { SignOptions } from 'jsonwebtoken';
import { env } from './env';

export const jwtConfig = {
  access: {
    secret: env.JWT_ACCESS_SECRET,
    options: { expiresIn: '15m' } as SignOptions,
  },
  refresh: {
    secret: env.JWT_REFRESH_SECRET,
    options: { expiresIn: '30d' } as SignOptions,
  },
};

export const cookieConfig = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: (env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  domain: env.NODE_ENV === 'production' ? env.COOKIE_DOMAIN : undefined,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  path: '/',
};
