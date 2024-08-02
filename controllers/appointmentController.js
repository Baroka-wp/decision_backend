import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Obtenir tous les rendez-vous d'un utilisateur
export const getUserAppointments = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*, coaches(name, email)')
            .eq('user_id', req.user.id)
            .order('date_time', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtenir tous les rendez-vous d'un coach
export const getCoachAppointments = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*, users(name, phone_number)')
            .eq('coach_id', req.params.coachId)
            .order('created_at', { ascending: true });
        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer un nouveau rendez-vous
export const createAppointment = async (req, res) => {

    try {
        const { user_id, coach_id, date_time } = req.body;
        console.log({ user_id, coach_id, date_time })
        const { data, error } = await supabase
            .from('appointments')
            .insert({
                user_id,
                coach_id,
                date_time,
                status: 'pending'
            });

        if (error) throw error;
        res.status(201).json("Appointment created successfull");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un rendez-vous
export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { date_time, notes, status } = req.body;
        const { data, error } = await supabase
            .from('appointments')
            .update({ date_time, notes, status })
            .eq('id', id)
            .eq('user_id', req.user.id);

        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({ message: 'Rendez-vous non trouvé ou non autorisé' });
        }
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Annuler un rendez-vous
export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .eq('user_id', req.user.id);

        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({ message: 'Rendez-vous non trouvé ou non autorisé' });
        }
        res.status(200).json({ message: 'Rendez-vous annulé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Confirmer un rendez-vous (pour les coachs)
export const confirmAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const date_time = new Date().toISOString();
        const { data, error } = await supabase
            .from('appointments')
            .update({ status: 'confirmed', date_time })
            .eq('id', id)
            .eq('coach_id', req.user.id);

        if (error) throw error;

        res.status(200).json({ message: 'Rendez-vous confirmé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};