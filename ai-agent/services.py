import google.generativeai as genai
from config import settings
from prompts import SYSTEM_PROMPT_ADAPTIVE, SYSTEM_PROMPT_FIRST_QUESTION 
import json
from typing import List, Dict, Any, Optional

# Configure the Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('models/gemini-pro-latest')

async def process_ai_turn(
    history: List[Dict[str, Any]], 
    user_answer: str, 
    current_criterion: Dict[str, Any],
    next_linear_criterion: Dict[str, Any],
    next_jump_criterion: Optional[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Handles the entire AI turn: Evaluate, React, Adapt, and Formulate.
    (L-code dyal had l-function kaybqa NAFS-SO)
    """
    
    prompt_history = []
    for turn in history:
        prompt_history.append(f"Q ({turn.get('criterion_id', 'N/A')}): ...")
        prompt_history.append(f"A: {turn.get('user_answer', 'N/A')}")
        if 'evaluation' in turn:
             prompt_history.append(f"EVAL: (Score: {turn['evaluation'].get('score', 0)})")

    current_options_str = "\n".join([f"- Score {opt['score']}: {opt['text']}" for opt in current_criterion.get("options", [])])
    
    # --- Logic: Get previous scores for this palier ---
    current_palier_scores = []
    current_id = current_criterion.get("id", "")
    if current_id.endswith("C2"):
        if history:
            current_palier_scores.append(history[-1].get("evaluation", {}).get("score", 0))
    elif current_id.endswith("C3"):
        if len(history) >= 2:
            current_palier_scores.append(history[-2].get("evaluation", {}).get("score", 0))
            current_palier_scores.append(history[-1].get("evaluation", {}).get("score", 0))

    prompt = f"""
    ---
    **Conversation History (Summary):**
    {"\n".join(prompt_history)}
    ---
    **User's Latest Answer (to evaluate):**
    "{user_answer}"
    ---
    **Current Criterion (to score the answer):**
    - ID: {current_id}
    - Options:
    {current_options_str}
    ---
    **Adaptive Flow Info:**
    - Current Palier Scores (so far): {current_palier_scores}
    - Next Linear Criterion: {next_linear_criterion.get("id", "N/A")}
    - Next Jump Criterion (if you skip): {next_jump_criterion.get("id", "FINISHED") if next_jump_criterion else "FINISHED"}
    ---
    
    Now, perform all your tasks (Evaluate, React, Adapt, Formulate) and return the JSON object.
    (Remember the SKIP RULE: if ID ends in P1-C3 and total score <= 2, choose 'Next Jump Criterion').
    """
    
    try:
        response = await model.generate_content_async(
            [SYSTEM_PROMPT_ADAPTIVE, prompt],
            generation_config={"response_mime_type": "application/json"}
        )
        result = json.loads(response.text)
        
        if 'chosen_next_criterion_id' not in result:
             result['chosen_next_criterion_id'] = next_linear_criterion.get("id", "N/A")
             
        return result
    except Exception as e:
        print(f"Error in Gemini Service (Adaptive): {e}")
        return {
            "evaluation": {"score": 0, "justification": f"Error processing AI turn: {e}"},
            "ai_reaction": "Désolé, j'ai eu un petit problème. On continue.",
            "chosen_next_criterion_id": next_linear_criterion.get("id", "N/A"),
            "next_question": f"Parlez-moi un peu de: {next_linear_criterion.get('criterion_text', 'la suite')}"
        }

async def formulate_first_question(criterion_text: str) -> str:
    """
    A special function just to get the *very first* question of the diagnostic.
    (L-code dyal had l-function kaybqa NAFS-SO)
    """
    prompt = f"First criterion: '{criterion_text}'\n\nYour friendly welcome question:"
    
    try:
        response = await model.generate_content_async(
            [SYSTEM_PROMPT_FIRST_QUESTION, prompt],
            generation_config={"response_mime_type": "text/plain"}
        )
        return response.text.strip()
    except Exception as e:
        print(f"Error formulating first question: {e}")
        return f"Bonjour! On va commencer. Parlez-moi de: {criterion_text}"