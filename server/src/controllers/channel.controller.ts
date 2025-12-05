import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const listChannels = async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  const channels = await prisma.channel.findMany({
    where: { members: { some: { userId } } },
    include: { members: true }
  });
  res.json(channels);
};

export const createChannel = async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;
  const { name, description, type } = req.body;
  const channel = await prisma.channel.create({
    data: {
      name,
      description,
      type,
      createdBy: userId,
      members: { create: { userId, role: 'ADMIN' } }
    }
  });
  res.status(201).json(channel);
};

export const getChannel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const channel = await prisma.channel.findUnique({ where: { id }, include: { members: true } });
  if (!channel) return res.status(404).json({ message: 'Not found' });
  res.json(channel);
};

export const updateChannel = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, type } = req.body;
  const channel = await prisma.channel.update({ where: { id }, data: { name, description, type } });
  res.json(channel);
};

export const deleteChannel = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.channel.delete({ where: { id } });
  res.status(204).send();
};

export const addMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, role } = req.body;
  const member = await prisma.channelMember.create({ data: { channelId: id, userId, role } });
  res.status(201).json(member);
};

export const removeMember = async (req: Request, res: Response) => {
  const { id, userId } = req.params as { id: string; userId: string };
  await prisma.channelMember.deleteMany({ where: { channelId: id, userId } });
  res.status(204).send();
};

