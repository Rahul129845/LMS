import db from '../../config/db';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return db<User>('users').where({ email }).first();
}

export async function findUserById(id: number): Promise<User | undefined> {
  return db<User>('users').where({ id }).first();
}

export async function createUser(data: {
  email: string;
  password_hash: string;
  name: string;
}): Promise<User> {
  const [id] = await db<User>('users').insert(data);
  const user = await findUserById(id);
  if (!user) throw new Error('Failed to create user');
  return user;
}
