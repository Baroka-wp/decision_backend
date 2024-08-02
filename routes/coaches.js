import express from 'express';
import { getCoaches, getCoachById, createCoach, updateCoach, deleteCoach, loginCoach } from '../controllers/coachController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getCoaches)
    .post(protect, createCoach);

router.route('/login')
    .post(loginCoach);

router.route('/:id')
    .get(protect, getCoachById)
    .put(updateCoach)
    .delete(protect, deleteCoach);

export default router;