import { Router } from 'express';
const router = Router();
import { getUserHistory, createHistoryEntry, getSessionHistory, saveFinalDecision, deleteSessionHistory, updateHistoryEntry } from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', getUserHistory);
router.post('/', createHistoryEntry);
router.get('/session/:user_id', getSessionHistory);
router.post('/final-decision', saveFinalDecision);
router.delete('/session/:session_id', deleteSessionHistory);
router.put('/', updateHistoryEntry);

export default router;