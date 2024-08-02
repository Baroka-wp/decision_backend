import { Router } from 'express';
const router = Router();
import { getUsers, getUserByPhone, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getUsers).post(createUser);
router.route('/:phone_number').get(getUserByPhone).put(protect, updateUser).delete(protect, admin, deleteUser);

export default router;