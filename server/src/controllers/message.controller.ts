import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { uploadBuffer } from '../services/s3.service';
import { v4 as uuid } from 'uuid';

export const listMessages = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit = 50, before } = req.query;
  const messages = await prisma.message.findMany({
    where: before ? { channelId: id, id: { lt: before as string } } : { channelId: id },
    orderBy: { createdAt: 'desc' },
    take: Number(limit),
    include: { reactions: true, sender: true }
  });
  res.json(messages);
};

export const getMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await prisma.message.findUnique({ where: { id }, include: { reactions: true } });
  if (!message) return res.status(404).json({ message: 'Not found' });
  res.json(message);
};

export const editMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const message = await prisma.message.update({ where: { id }, data: { content } });
  res.json(message);
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.message.delete({ where: { id } });
  res.status(204).send();
};

export const addReaction = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId as string;
  const { emoji } = req.body;
  const reaction = await prisma.reaction.create({ data: { emoji, messageId: id, userId } });
  res.status(201).json(reaction);
};

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const key = `${uuid()}-${req.file.originalname}`;
  const url = await uploadBuffer(key, req.file.buffer, req.file.mimetype);
  res.status(201).json({ url });
};

