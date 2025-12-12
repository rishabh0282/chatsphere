import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createMessage,
  listMessages,
  getMessage,
  editMessage,
  deleteMessage,
  addReaction,
  uploadFile
} from '../controllers/message.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/channels/:id/messages', createMessage);
router.get('/channels/:id/messages', listMessages);
router.get('/messages/:id', getMessage);
router.put('/messages/:id', editMessage);
router.delete('/messages/:id', deleteMessage);
router.post('/messages/:id/reactions', addReaction);
router.post('/upload', upload.single('file'), uploadFile);

export default router;

