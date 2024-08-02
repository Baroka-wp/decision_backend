import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.is_admin) {
        next();
    } else {
        res.status(401).json({ error: 'Not authorized as an admin' });
    }
};

export const coach = (req, res, next) => {
    if (req.user && req.user.is_coach) {
        next();
    } else {
        res.status(401).json({ error: 'Non autorisé. Accès réservé aux coachs.' });
    }
};
