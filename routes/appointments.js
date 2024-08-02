import express from 'express';
import {
    getUserAppointments,
    getCoachAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    confirmAppointment
} from '../controllers/appointmentController.js';
import { protect, coach } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getUserAppointments)
    .post(createAppointment);

router.route('/:id')
    .put(protect, updateAppointment)
    .delete(protect, cancelAppointment);

router.route('/:coachId')
    .get(protect, getCoachAppointments);

router.route('/confirm/:id')
    .put(protect, confirmAppointment);

export default router;