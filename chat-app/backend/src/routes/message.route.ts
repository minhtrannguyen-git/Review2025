import express from 'express'
import { jwtMiddleware } from '../middlewares/auth.middleware.js';
import { getMessages, getUserForSidebar, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/users', jwtMiddleware, getUserForSidebar );
router.get('/:id', jwtMiddleware, getMessages);
router.post('/send/:id', jwtMiddleware, sendMessage)
export default router;