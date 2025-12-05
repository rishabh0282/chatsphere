import { Router } from 'express';
import authRoutes from './auth.routes';
import channelRoutes from './channel.routes';
import messageRoutes from './message.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/channels', channelRoutes);
router.use('/api', messageRoutes);
router.use('/api', userRoutes);

export default router;

