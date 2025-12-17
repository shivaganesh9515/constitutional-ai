from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import time
import random

from models.schemas import ProcurementCase, AnalysisResult, ParseTenderRequest, ChatRequest, ChatResponse
from agents.prompts import (
    MASTER_SYSTEM_PROMPT,
    TRANSPARENCY_AGENT_PROMPT,
    EQUITY_AGENT_PROMPT,
    LEGALITY_AGENT_PROMPT,
    ACCOUNTABILITY_AGENT_PROMPT,
    SOCIAL_JUSTICE_AGENT_PROMPT,
    CHIEF_JUSTICE_PROMPT,
    TENDER_PARSER_PROMPT,
    BENCH_CHAT_PROMPT
)
from rag.knowledge_base import get_relevant_rules
from utils.llm_client import call_ollama, parse_json_response

app = FastAPI(title="Nyaya AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_case(case: ProcurementCase) -> str:
    """Format case for LLM analysis"""
    bids = "\n".join([
        f"- {b.vendor_name}: ₹{b.bid_amount:,.0f} ({'MSME' if b.is_msme else 'Non-MSME'})"
        for b in case.bids
    ])
    
    return f"""
TENDER: {case.tender_id}
TITLE: {case.title}
DEPARTMENT: {case.department}
VALUE: ₹{case.estimated_value:,.0f}
METHOD: {case.procurement_method.value}
PUBLICATION: {case.publication_date}
BID OPENING: {case.bid_opening_date}

BIDS RECEIVED:
{bids}

SELECTED: {case.selected_vendor}
REASON: {case.selection_reason}

DOCUMENTS: {', '.join(case.documents_available)}
"""

async def run_agent(case: ProcurementCase, agent_prompt: str, context: str) -> dict:
    """Run a single agent analysis"""
    case_text = format_case(case)
    
    prompt = f"""
{MASTER_SYSTEM_PROMPT}

{agent_prompt}

LEGAL CONTEXT:
{context}

CASE TO ANALYZE:
{case_text}

Analyze and respond in JSON only.
"""
    
    response = await call_ollama(prompt)
    return parse_json_response(response)

@app.get("/")
def root():
    return {"name": "Nyaya AI", "status": "running"}

@app.get("/health")
async def health():
    try:
        import httpx
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get("http://localhost:11434/api/tags")
            return {"status": "healthy", "llm": "connected"}
    except:
        return {"status": "unhealthy", "llm": "disconnected"}

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_case(case: ProcurementCase):
    """Full constitutional analysis (REST)"""
    
    # Get relevant legal context
    context = get_relevant_rules(case.estimated_value, case.procurement_method.value)
    
    # Run all agents in parallel
    transparency, equity, legality, accountability, social_justice = await asyncio.gather(
        run_agent(case, TRANSPARENCY_AGENT_PROMPT, context),
        run_agent(case, EQUITY_AGENT_PROMPT, context),
        run_agent(case, LEGALITY_AGENT_PROMPT, context),
        run_agent(case, ACCOUNTABILITY_AGENT_PROMPT, context),
        run_agent(case, SOCIAL_JUSTICE_AGENT_PROMPT, context)
    )
    
    # Chief Justice verdict
    verdict_prompt = f"""
{CHIEF_JUSTICE_PROMPT}

{format_case(case)}

AGENT OPINIONS:
Transparency: {json.dumps(transparency)}
Equity: {json.dumps(equity)}
Legality: {json.dumps(legality)}
Accountability: {json.dumps(accountability)}
Social Justice: {json.dumps(social_justice)}

Synthesize final verdict in JSON.
"""
    
    verdict_response = await call_ollama(verdict_prompt)
    verdict = parse_json_response(verdict_response)
    
    return {
        "case_id": case.tender_id,
        "agent_opinions": {
            "transparency": transparency,
            "equity": equity,
            "legality": legality,
            "accountability": accountability,
            "social_justice": social_justice
        },
        "verdict": verdict
    }

@app.websocket("/ws/analyze")
async def websocket_analyze(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        case_dict = json.loads(data)
        case = ProcurementCase(**case_dict)
        
        await websocket.send_json({"status": "info", "message": "Case received. Initializing Constitutional Bench..."})
        await asyncio.sleep(1)

        # Get Context
        await websocket.send_json({"status": "info", "message": "Retrieving GFR 2017 Rules & Constitutional Articles..."})
        context = get_relevant_rules(case.estimated_value, case.procurement_method.value)
        await asyncio.sleep(1)

        # Run Agents Sequentially for dramatic effect (or parallel with updates)
        # Parallel is better for speed, but sequential is better for "progress" demo
        # Let's do parallel but report start/finish
        
        await websocket.send_json({"status": "info", "message": "Summoning 4 AI Agents..."})
        
        # Define wrapper to report progress
        async def run_agent_with_progress(name, prompt):
            await websocket.send_json({"status": "progress", "agent": name, "state": "analyzing"})

            # Simulated "Thinking" steps for better UX
            thinking_steps = {
                "transparency": [
                    "Scanning tender document...",
                    "Verifying publication date...",
                    "Checking for missing evaluation reports..."
                ],
                "equity": [
                    "Analyzing MSME status...",
                    "Calculating price bands...",
                    "Checking for bid rigging patterns..."
                ],
                "legality": [
                    "Cross-referencing GFR Rule 144...",
                    "Validating contract clauses...",
                    "Checking procurement method thresholds..."
                ],
                "accountability": [
                    "Tracing approval chain...",
                    "Verifying signatory authority...",
                    "Checking audit trail..."
                ],
                "social_justice": [
                    "Checking Minimum Wages Act compliance...",
                    "Reviewing environmental impact...",
                    "Verifying SC/ST sub-quota..."
                ]
            }

            # Send initial thought
            steps = thinking_steps.get(name, ["Analyzing..."])
            for step in steps:
                await websocket.send_json({"status": "thought", "agent": name, "message": step})
                await asyncio.sleep(random.uniform(0.5, 1.0)) # Simulate work

            result = await run_agent(case, prompt, context)
            await websocket.send_json({"status": "progress", "agent": name, "state": "completed", "result": result})
            return result

        # Run agents
        results = await asyncio.gather(
            run_agent_with_progress("transparency", TRANSPARENCY_AGENT_PROMPT),
            run_agent_with_progress("equity", EQUITY_AGENT_PROMPT),
            run_agent_with_progress("legality", LEGALITY_AGENT_PROMPT),
            run_agent_with_progress("accountability", ACCOUNTABILITY_AGENT_PROMPT),
            run_agent_with_progress("social_justice", SOCIAL_JUSTICE_AGENT_PROMPT)
        )
        
        transparency, equity, legality, accountability, social_justice = results

        # Chief Justice
        await websocket.send_json({"status": "info", "message": "Chief Justice is deliberating on the verdict..."})
        
        verdict_prompt = f"""
{CHIEF_JUSTICE_PROMPT}

{format_case(case)}

AGENT OPINIONS:
Transparency: {json.dumps(transparency)}
Equity: {json.dumps(equity)}
Legality: {json.dumps(legality)}
Accountability: {json.dumps(accountability)}
Social Justice: {json.dumps(social_justice)}

Synthesize final verdict in JSON.
"""
        verdict_response = await call_ollama(verdict_prompt)
        verdict = parse_json_response(verdict_response)
        
        final_result = {
            "case_id": case.tender_id,
            "agent_opinions": {
                "transparency": transparency,
                "equity": equity,
                "legality": legality,
                "accountability": accountability,
                "social_justice": social_justice
            },
            "verdict": verdict
        }
        
        await websocket.send_json({"status": "complete", "result": final_result})
        
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        await websocket.send_json({"status": "error", "message": str(e)})

@app.get("/sample-case-violation")
def sample_case_violation():
    """Return sample case with violations (REJECT)"""
    return {
        "tender_id": "TENDER-2024-001",
        "title": "Supply of Computer Equipment for Government Schools",
        "department": "Department of Education",
        "estimated_value": 5000000,
        "procurement_method": "limited_tender",
        "publication_date": "2024-01-15",
        "bid_opening_date": "2024-01-25",
        "bids": [
            {"vendor_name": "ABC Technologies", "bid_amount": 4800000, "is_msme": False, "technical_score": 85},
            {"vendor_name": "XYZ Computers", "bid_amount": 5100000, "is_msme": True, "technical_score": 82}
        ],
        "selected_vendor": "ABC Technologies",
        "selection_reason": "Lowest bid",
        "documents_available": ["Tender Notice"]
    }

@app.get("/sample-case-compliant")
def sample_case_compliant():
    """Return compliant sample case (APPROVE)"""
    return {
        "tender_id": "TENDER-2024-002",
        "title": "Annual Maintenance Contract for Office Equipment",
        "department": "Ministry of Finance",
        "estimated_value": 1500000,
        "procurement_method": "limited_tender",
        "publication_date": "2024-02-01",
        "bid_opening_date": "2024-02-20",
        "bids": [
            {"vendor_name": "ServicePro Systems", "bid_amount": 1400000, "is_msme": True, "technical_score": 88},
            {"vendor_name": "TechCare Solutions", "bid_amount": 1550000, "is_msme": False, "technical_score": 90}
        ],
        "selected_vendor": "ServicePro Systems",
        "selection_reason": "L1 Bidder and MSME",
        "documents_available": ["Tender Notice", "Technical Evaluation Report", "Financial Bid Summary", "Committee Approval"]
    }

@app.post("/parse_tender", response_model=ProcurementCase)
async def parse_tender(request: ParseTenderRequest):
    """Parse raw tender text into structured JSON"""
    prompt = f"""
{TENDER_PARSER_PROMPT}

RAW TENDER TEXT:
{request.text}
"""
    response = await call_ollama(prompt)
    parsed = parse_json_response(response)

    # Basic validation/cleanup if needed
    if "error" in parsed:
        raise HTTPException(status_code=400, detail="Failed to parse tender text")

    return parsed

@app.post("/ask_bench", response_model=ChatResponse)
async def ask_bench(request: ChatRequest):
    """Chat with the Constitutional Bench about a specific verdict"""

    context = f"""
CASE ID: {request.case_data.tender_id}
TITLE: {request.case_data.title}
VERDICT: {request.verdict_data.verdict.verdict}
SCORE: {request.verdict_data.verdict.constitutional_score}

AGENT OPINIONS:
{json.dumps(request.verdict_data.agent_opinions, indent=2)}

CITIZEN SUMMARY:
{request.verdict_data.verdict.citizen_summary}
"""

    prompt = f"""
{BENCH_CHAT_PROMPT}

CASE CONTEXT:
{context}

USER QUESTION:
{request.question}
"""

    answer = await call_ollama(prompt)
    return {"answer": answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
