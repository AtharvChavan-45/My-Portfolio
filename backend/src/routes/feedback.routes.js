import { Router } from 'express';
import { submitFeedback, getAllFeedback, sendReply } from '../controllers/feedback.controller.js';
import { loginAdmin } from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.post('/feedback', submitFeedback);
router.post('/admin/login', loginAdmin);

// Protected Admin routes
router.get('/admin/feedback', verifyAdmin, getAllFeedback);
router.post('/admin/feedback/:id/reply', verifyAdmin, sendReply);

export default router;
