import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Obtenir tous les coachs
export const getCoaches = async (req, res) => {
    console.log("get coach")
    try {
        const { data, error } = await supabase
            .from('coaches')
            .select('id, name, email, photo_url, diplomes, experience, specialites, description, formation, parcours, price, phone_number');

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCoachById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('coaches')
            .select('id, name, email, photo_url, diplomes, experience, specialites, description, formation, parcours, price, phone_number')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ message: 'Coach non trouvé' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createCoach = async (req, res) => {
    try {
        const { name, email, photo_url, diplomes, experience, specialites, description, formation, parcours, price, phone_number, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data, error } = await supabase
            .from('coaches')
            .insert({ name, email, photo_url, diplomes, experience, specialites, description, formation, parcours, price, phone_number, password: hashedPassword });

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCoach = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, photo_url, diplomes, experience, specialites, description, password } = req.body;
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const { data, error } = await supabase
            .from('coaches')
            .update({ name, email, photo_url, diplomes, experience, specialites, description, password: hashedPassword })
            .eq('id', id)
            .select('name, email, photo_url, diplomes, experience, specialites, description')
            .single()


        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un coach
export const deleteCoach = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('coaches')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: 'Coach supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Connexion d'un coach
export const loginCoach = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data, error } = await supabase
            .from('coaches')
            .select('id, name, email, password')
            .eq('email', email)
            .single();

        if (error) throw error;
        if (!data) {
            return res.status(404).json({ message: 'Coach non trouvé' });
        }

        const isValidPassword = await comparePassword(password, data.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }
        const token = jwt.sign({ id: data.id, email: data.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user: { id: data.id, email: data.email, name: data.name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour comparer les mots de passe
const comparePassword = async (password, hashedPassword) => {
    try {
        const isValid = await bcrypt.compare(password, hashedPassword);
        return isValid;
    } catch (error) {
        throw error;
    }
};