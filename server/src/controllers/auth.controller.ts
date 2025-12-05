import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { signAccessToken, signRefreshToken } from '../utils/jwt.utils';

export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) return res.status(400).json({ message: 'Missing fields' });

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) return res.status(409).json({ message: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, username, password: hashed } });
  const token = signAccessToken({ userId: user.id });
  const refresh = signRefreshToken({ userId: user.id });
  return res.status(201).json({ user: { id: user.id, email, username }, token, refresh });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signAccessToken({ userId: user.id });
  const refresh = signRefreshToken({ userId: user.id });
  return res.json({ user: { id: user.id, email: user.email, username: user.username }, token, refresh });
};

export const me = async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ id: user.id, email: user.email, username: user.username, status: user.status });
};

