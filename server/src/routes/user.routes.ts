import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { getUser, updateUser, searchUsers } from '../controllers/user.controller';

const router = Router();

router.use(authMiddleware);

router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.get('/users/search', searchUsers);

export default router;

