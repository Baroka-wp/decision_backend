import { supabase } from '../config/supabase.js';

// Obtenir l'historique d'un utilisateur
const getUserHistory = async (req, res) => {
    const { user_id } = req.params;
    try {
        const { data, error } = await supabase.from('history')
            .select('*')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer une nouvelle entrée dans l'historique (question/réponse)
const createHistoryEntry = async (req, res) => {
    console.log("create history")
    try {
        const { user_id, session_data } = req.body;
        const { data, error } = await supabase.from('history')
            .insert({
                user_id,
                session_data
            })
            .select('*')
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une entrée existante dans l'historique
const updateHistoryEntry = async (req, res) => {
    console.log("update history")
    try {
        const { user_id, session_data } = req.body;
        const { data, error } = await supabase.from('history')
            .update({ session_data })
            .eq("user_id", user_id)
            .select('*')
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtenir l'historique d'une session spécifique
const getSessionHistory = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { data, error } = await supabase.from('history')
            .select('*')
            .eq('user_id', user_id);

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Enregistrer la décision finale de l'IA
const saveFinalDecision = async (req, res) => {
    try {
        const { user_id, decision } = req.body;
        const { data, error } = await supabase.from('history')
            .update({ decision })
            .match({ user_id })
            .is('decision', null);

        if (error) throw error;
        res.status(200).json({ message: 'Décision finale enregistrée avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer l'historique d'une session
const deleteSessionHistory = async (req, res) => {
    try {
        const { session_id } = req.params;
        const { error } = await supabase.from('history')
            .delete()
            .match({ user_id: req.user.id, session_id });

        if (error) throw error;
        res.status(200).json({ message: 'Historique de session supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    getUserHistory,
    createHistoryEntry,
    getSessionHistory,
    saveFinalDecision,
    deleteSessionHistory,
    updateHistoryEntry
};