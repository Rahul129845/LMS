import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/security';

export interface TokenPayload {
  id: number;
  email: string;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, jwtConfig.access.secret, jwtConfig.access.options);
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, jwtConfig.refresh.secret, jwtConfig.refresh.options);
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, jwtConfig.access.secret) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, jwtConfig.refresh.secret) as TokenPayload;
  } catch {
    return null;
  }
}
