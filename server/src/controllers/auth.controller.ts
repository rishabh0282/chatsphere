import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { signAccessToken, signRefreshToken } from '../utils/jwt.utils';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Validate username
    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    const existing = await prisma.user.findFirst({ 
      where: { OR: [{ email }, { username }] } 
    });
    
    if (existing) {
      const field = existing.email === email ? 'email' : 'username';
      return res.status(409).json({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ 
      data: { email: email.trim().toLowerCase(), username: username.trim(), password: hashed } 
    });
    const token = signAccessToken({ userId: user.id });
    const refresh = signRefreshToken({ userId: user.id });
    return res.status(201).json({ user: { id: user.id, email: user.email, username: user.username }, token, refresh });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email or username already exists' });
    }
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signAccessToken({ userId: user.id });
    const refresh = signRefreshToken({ userId: user.id });
    return res.json({ user: { id: user.id, email: user.email, username: user.username }, token, refresh });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

export const me = async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ id: user.id, email: user.email, username: user.username, status: user.status });
};

