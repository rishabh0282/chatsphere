import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ id: user.id, email: user.email, username: user.username, status: user.status });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, avatar, status } = req.body;
  const user = await prisma.user.update({ where: { id }, data: { username, avatar, status } });
  res.json({ id: user.id, email: user.email, username: user.username, status: user.status });
};

export const searchUsers = async (req: Request, res: Response) => {
  const q = (req.query.q as string) || '';
  const users = await prisma.user.findMany({
    where: { username: { contains: q, mode: 'insensitive' } },
    take: 20
  });
  res.json(users.map((u) => ({ id: u.id, username: u.username, email: u.email })));
};

