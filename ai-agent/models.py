from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# --- Endpoint 1: /formulate_first_question ---

class FirstQuestionRequest(BaseModel):
    criterion_text: str

class FirstQuestionResponse(BaseModel):
    ai_question: str

# --- Endpoint 2: /process_turn ---

class ProcessTurnRequest(BaseModel):
    history: List[Dict[str, Any]]
    user_answer: str
    current_criterion: Dict[str, Any]
    next_linear_criterion: Dict[str, Any]
    next_jump_criterion: Optional[Dict[str, Any]]

class ProcessTurnResponse(BaseModel):
    evaluation: Dict[str, Any]
    ai_reaction: str
    chosen_next_criterion_id: str
    next_question: str