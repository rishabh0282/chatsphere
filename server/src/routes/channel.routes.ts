import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  listChannels,
  createChannel,
  getChannel,
  updateChannel,
  deleteChannel,
  addMember,
  removeMember
} from '../controllers/channel.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', listChannels);
router.post('/', createChannel);
router.get('/:id', getChannel);
router.put('/:id', updateChannel);
router.delete('/:id', deleteChannel);
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);

export default router;

