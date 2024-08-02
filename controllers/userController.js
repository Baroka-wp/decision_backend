import { supabase } from '../config/supabase.js';

// Get all users
const getUsers = async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('*');
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user by ID
const getUserByPhone = async (req, res) => {
    try {
        const { data, error } = await supabase.from('users')
            .select('*')
            .eq('phone_number', req.params.phone_number)
            .single();
        // if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fonction pour nettoyer le numéro de téléphone
const cleanPhoneNumber = (phoneNumber) => {
    return phoneNumber.replace(/\s+/g, '')
};

// Create new user
const createUser = async (req, res) => {
    try {
        const { name, phone_number } = req.body;
        const cleanedPhoneNumber = cleanPhoneNumber(phone_number);
        const { data, error } = await supabase.from('users')
            .insert({ name, phone_number: cleanedPhoneNumber })
            .select('id, name, phone_number')
            .single();

        if (error) throw error;
        res.status(201).json({ user: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { data, error } = await supabase.from('users')
            .update(req.body)
            .eq('id', req.params.id);
        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { data, error } = await supabase.from('users')
            .delete()
            .eq('id', req.params.id);
        if (error) throw error;
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getUsers,
    getUserByPhone,
    createUser,
    updateUser,
    deleteUser
};