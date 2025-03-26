import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { jwtMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.post("/login", login)
router.post("/logout", logout)
router.post('/signup', signup)
router.post('/update-profile', jwtMiddleware, updateProfile);
router.get("/check",jwtMiddleware, checkAuth)



export default router;