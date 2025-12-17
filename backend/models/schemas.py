from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class ProcurementMethod(str, Enum):
    OPEN_TENDER = "open_tender"
    LIMITED_TENDER = "limited_tender"
    SINGLE_SOURCE = "single_source"

class VendorBid(BaseModel):
    vendor_name: str
    bid_amount: float
    is_msme: bool
    technical_score: Optional[float] = None

class ProcurementCase(BaseModel):
    tender_id: str
    title: str
    department: str
    estimated_value: float
    procurement_method: ProcurementMethod
    publication_date: str
    bid_opening_date: str
    bids: List[VendorBid]
    selected_vendor: str
    selection_reason: str
    documents_available: List[str]

class AgentOpinion(BaseModel):
    agent: str
    principle: str
    stance: str  # approve, conditional, reject
    score: int  # 0-100
    findings: List[dict]
    recommendation: str
    citizen_explanation: str

class CourtVerdict(BaseModel):
    verdict: str  # APPROVE, CONDITIONAL, REJECT
    constitutional_score: float
    score_breakdown: dict
    critical_issues: List[str]
    mandatory_actions: List[str]
    citizen_summary: str

class AnalysisResult(BaseModel):
    case_id: str
    agent_opinions: dict
    verdict: CourtVerdict

class ParseTenderRequest(BaseModel):
    text: str

class ChatRequest(BaseModel):
    case_data: ProcurementCase
    verdict_data: AnalysisResult
    question: str

class ChatResponse(BaseModel):
    answer: str
