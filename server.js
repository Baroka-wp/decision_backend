import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/users.js';
import coachRoutes from './routes/coaches.js';
import historyRoutes from './routes/history.js';
import appointmentRoutes from './routes/appointments.js';

dotenv.config();

const app = express();
// Configuration CORS
const corsOptions = {
    origin: ['https://decision-io.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));