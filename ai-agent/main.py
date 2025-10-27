from fastapi import FastAPI, HTTPException
from models import ( 
    FirstQuestionRequest, FirstQuestionResponse,
    ProcessTurnRequest, ProcessTurnResponse
)
from services import (
    formulate_first_question, process_ai_turn
)

app = FastAPI(
    title="DigiAssistant AI Agent (Stateless)",
    description="A pure AI service that generates questions and evaluations for the diagnostic.",
    version="2.0.0"
)

# --- Endpoint 1: ---
@app.post("/api/v1/formulate_first_question", response_model=FirstQuestionResponse)
async def handle_first_question(request: FirstQuestionRequest):
    """
    Generates the initial welcoming question for the diagnostic.
    Called only once by the backend (Node.js) at the start of a new conversation.
    """
    try:
        ai_question = await formulate_first_question(request.criterion_text)
        return FirstQuestionResponse(ai_question=ai_question)
    except Exception as e:
        print(f"Error in /formulate_first_question: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Endpoint 2: ---
@app.post("/api/v1/process_turn", response_model=ProcessTurnResponse)
async def handle_process_turn(request: ProcessTurnRequest):
    """
    The main "brain" function.
    Receives the state from the backend (Node.js) and returns the AI's full response.
    """
    try:
        ai_response = await process_ai_turn(
            history=request.history,
            user_answer=request.user_answer,
            current_criterion=request.current_criterion,
            next_linear_criterion=request.next_linear_criterion,
            next_jump_criterion=request.next_jump_criterion
        )
        return ProcessTurnResponse(**ai_response)
    except Exception as e:
        print(f"Error in /process_turn: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"Welcome": "DigiAssistant AI Agent is running!"}