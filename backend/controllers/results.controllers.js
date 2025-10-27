import { Conversation } from '../models/Conversation.js';
import { calculateDiagnosticResults } from '../services/scoringService.js';

export const getResults = async (req, res) => {
    const { conversation_id } = req.params;

    try {
        const conversation = await Conversation.findOne({ conversation_id });
        if (!conversation || !conversation.history || conversation.history.length === 0) {
            return res.status(404).json({ detail: "Conversation not found or has no history." });
        }

        const scores_map = conversation.history.reduce((acc, entry) => {
            if (entry.evaluation) acc[entry.criterion_id] = entry.evaluation;
            return acc;
        }, {});

        console.log(`[Node.js Results] Calculating report for ${conversation_id} with ${Object.keys(scores_map).length} scores.`);

        const finalReport = calculateDiagnosticResults(scores_map);

        return res.json({
            conversation_id,
            ...finalReport
        });

    } catch (error) {
        console.error(`[Node.js Results] Error for ${conversation_id}:`, error.message);
        res.status(500).json({ detail: 'Internal Server Error in Node.js results' });
    }
};