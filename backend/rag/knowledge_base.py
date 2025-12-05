"""Simple RAG Knowledge Base with GFR 2017 Rules"""

GFR_RULES = {
    "rule_149": {
        "title": "Open Competitive Bidding",
        "content": "Open tender inquiry is mandatory for procurement of goods and services where estimated value is ₹25 lakh and above. Tender notice must be published on Central Public Procurement Portal. Minimum 21 days for bid submission.",
        "threshold": 2500000,
        "min_days": 21
    },
    "rule_150": {
        "title": "Limited Tender Inquiry",
        "content": "Limited tender inquiry may be adopted when estimated value is less than ₹25 lakh. Should not be used to avoid open competition.",
        "threshold": 2500000,
        "min_days": 14
    },
    "rule_161": {
        "title": "MSME Preference",
        "content": "Micro and Small Enterprises shall be given preference. If MSME quotes within L1+15%, they shall be given opportunity to match L1 price. 25% procurement should be from MSMEs.",
        "preference_band": 0.15
    },
    "rule_166": {
        "title": "Single Source Procurement",
        "content": "Single source procurement only in genuine emergency or when only one source exists. Written justification and competent authority approval mandatory.",
        "requires_approval": True
    }
}

CONSTITUTIONAL_ARTICLES = {
    "article_14": {
        "title": "Right to Equality",
        "content": "State shall not deny equality before law. All vendors must be treated equally.",
        "relevance": "equity"
    },
    "article_19": {
        "title": "Right to Information",
        "content": "Citizens have right to know how public money is spent. Procurement decisions must be transparent.",
        "relevance": "transparency"
    }
}

def get_relevant_rules(estimated_value: float, procurement_method: str) -> str:
    """Get relevant GFR rules based on case details"""
    
    context_parts = []
    
    # Check value threshold
    if estimated_value >= 2500000:
        context_parts.append(f"GFR RULE 149: {GFR_RULES['rule_149']['content']}")
    else:
        context_parts.append(f"GFR RULE 150: {GFR_RULES['rule_150']['content']}")
    
    # Always include MSME
    context_parts.append(f"GFR RULE 161: {GFR_RULES['rule_161']['content']}")
    
    # Single source
    if procurement_method == "single_source":
        context_parts.append(f"GFR RULE 166: {GFR_RULES['rule_166']['content']}")
    
    # Constitutional
    context_parts.append(f"ARTICLE 14: {CONSTITUTIONAL_ARTICLES['article_14']['content']}")
    context_parts.append(f"ARTICLE 19: {CONSTITUTIONAL_ARTICLES['article_19']['content']}")
    
    return "\n\n".join(context_parts)
