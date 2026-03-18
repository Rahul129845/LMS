import crypto from 'crypto';
import db from '../../config/db';
import { createUser, findUserByEmail, findUserById } from './user.model';
import { hashPassword, comparePassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { createError } from '../../middleware/errorHandler';
import { RegisterInput, LoginInput } from './auth.validator';

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function storeRefreshToken(userId: number, token: string): Promise<void> {
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await db('refresh_tokens').insert({ user_id: userId, token_hash: tokenHash, expires_at: expiresAt });
}

export async function registerUser(input: RegisterInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw createError('Email already registered', 409);
  }

  const password_hash = await hashPassword(input.password);
  const user = await createUser({ email: input.email, password_hash, name: input.name });

  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const refreshToken = signRefreshToken({ id: user.id, email: user.email });
  await storeRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name } };
}

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw createError('Invalid email or password', 401);
  }

  const valid = await comparePassword(input.password, user.password_hash);
  if (!valid) {
    throw createError('Invalid email or password', 401);
  }

  const accessToken = signAccessToken({ id: user.id, email: user.email });
  const refreshToken = signRefreshToken({ id: user.id, email: user.email });
  await storeRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name } };
}

export async function refreshAccessToken(rawRefreshToken: string) {
  const payload = verifyRefreshToken(rawRefreshToken);
  if (!payload) {
    throw createError('Invalid refresh token', 401);
  }

  const tokenHash = hashToken(rawRefreshToken);
  const stored = await db('refresh_tokens')
    .where({ user_id: payload.id, token_hash: tokenHash })
    .whereNull('revoked_at')
    .where('expires_at', '>', new Date())
    .first();

  if (!stored) {
    throw createError('Refresh token revoked or expired', 401);
  }

  const user = await findUserById(payload.id);
  if (!user) {
    throw createError('User not found', 401);
  }

  const accessToken = signAccessToken({ id: user.id, email: user.email });
  return { accessToken };
}

export async function logoutUser(rawRefreshToken: string): Promise<void> {
  const payload = verifyRefreshToken(rawRefreshToken);
  if (!payload) return;

  const tokenHash = hashToken(rawRefreshToken);
  await db('refresh_tokens')
    .where({ user_id: payload.id, token_hash: tokenHash })
    .update({ revoked_at: new Date() });
}
