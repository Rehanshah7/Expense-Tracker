import { Router } from 'express';
import {
    getNotifications,
    markAsRead
} from './notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protect all notification routes
router.use(authMiddleware);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

export default router;
