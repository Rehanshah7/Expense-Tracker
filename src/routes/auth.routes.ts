import { Router } from 'express';
import { register, login, googleAuth } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { apiSuccess } from '../utils/apiResponse';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);

// Example of a protected route
router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json(apiSuccess('User retrieved successfully', req.user));
});

export default router;
