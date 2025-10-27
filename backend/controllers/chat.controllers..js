import axios from 'axios';
import { Conversation } from '../models/Conversation.js';
import { createRequire } from 'module';
import dotenv from 'dotenv';

dotenv.config();

const require = createRequire(import.meta.url);
const diagnosticGrid = require('../data/diagnostic_grid.json');

const AI_AGENT_URL = process.env.AI_AGENT_URL;
const ALL_CRITERIA_IDS = Object.keys(diagnosticGrid);

// --- Helper Functions ---
function getCriterionById(criterionId) {
  const data = diagnosticGrid[criterionId];
  if (data) return { ...data, id: criterionId };
  return null;
}

function getNextJumpIndex(currentIndex) {
  const nextDimensionIndex = (Math.floor(currentIndex / 12) + 1) * 12;
  return (nextDimensionIndex < ALL_CRITERIA_IDS.length) ? nextDimensionIndex : null;
}

// --- Main Chat Handler ---
export const handleChat = async (req, res) => {
  const { conversation_id, user_answer } = req.body;
  if (!conversation_id) {
    return res.status(400).json({ detail: "conversation_id is required." });
  }

  try {
    let conversation = await Conversation.findOne({ conversation_id });

    // --- Case 1: New Conversation ---
    if (!conversation) {
      console.log(`[Node.js Mongoose] New conversation: ${conversation_id}`);
      const firstCriterion = getCriterionById(ALL_CRITERIA_IDS[0]);

      const aiResponse = await axios.post(`${AI_AGENT_URL}/api/v1/formulate_first_question`, {
        criterion_text: firstCriterion.criterion_text
      });
      const { ai_question } = aiResponse.data;

      conversation = new Conversation({ conversation_id, current_index: 0, history: [] });
      await conversation.save();

      return res.json({
        conversation_id,
        ai_question,
        current_criterion_id: firstCriterion.id
      });
    }

    // --- Case 2: Existing Conversation ---
    console.log(`[Node.js Mongoose] Existing conversation: ${conversation_id}`);
    const currentIndex = conversation.current_index;
    const history = conversation.history || [];
    const currentCriterion = getCriterionById(ALL_CRITERIA_IDS[currentIndex]);

    const nextLinearIndex = currentIndex + 1;
    let nextLinearCriterion = (nextLinearIndex < ALL_CRITERIA_IDS.length) ? getCriterionById(ALL_CRITERIA_IDS[nextLinearIndex]) : null;

    const nextJumpIndex = getNextJumpIndex(currentIndex);
    let nextJumpCriterion = nextJumpIndex ? getCriterionById(ALL_CRITERIA_IDS[nextJumpIndex]) : null;

    if (!nextLinearCriterion) {
      conversation.status = 'finished';
      await conversation.save();
      return res.json({
        conversation_id,
        ai_question: "Merci bzaf! Salina l-diagnostic. Db ghadi nqado lik l-report...",
        current_criterion_id: "FINISHED"
      });
    }

    const aiResponse = await axios.post(`${AI_AGENT_URL}/api/v1/process_turn`, {
      history, user_answer, current_criterion: currentCriterion,
      next_linear_criterion: nextLinearCriterion,
      next_jump_criterion: nextJumpCriterion
    });

    const aiData = aiResponse.data;
    const newIndex = ALL_CRITERIA_IDS.indexOf(aiData.chosen_next_criterion_id);
    if (newIndex === -1) throw new Error("AI returned an invalid next criterion ID.");

    const historyEntry = {
      criterion_id: currentCriterion.id,
      user_answer: user_answer,
      evaluation: aiData.evaluation,
      ai_reaction: aiData.ai_reaction,
      ai_question: aiData.next_question
    };

    conversation.history.push(historyEntry);
    conversation.current_index = newIndex;
    await conversation.save();

    const fullAiResponse = `${aiData.ai_reaction} ${aiData.next_question}`;
    return res.json({
      conversation_id,
      ai_question: fullAiResponse,
      current_criterion_id: aiData.chosen_next_criterion_id
    });

  } catch (error) {
    console.error('[Node.js Mongoose] Error in handleChat:', error.response ? error.response.data : error.message);
    res.status(500).json({ detail: 'Internal Server Error in Node.js backend' });
  }
};