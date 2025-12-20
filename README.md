# ⚖️ Nyaya AI - Constitutional Procurement Review System

<div align="center">

![Nyaya AI Banner](https://img.shields.io/badge/AI-Constitutional_Review-blue?style=for-the-badge&logo=scale)
![Python](https://img.shields.io/badge/Python-3.10+-green?style=flat-square&logo=python)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-purple?style=flat-square)

**AI-powered system for reviewing Indian government procurement decisions against constitutional principles and GFR 2017 rules**

[Demo](#demo) • [Architecture](#architecture) • [Setup](#quick-start) • [How It Works](#how-it-works)

</div>

---

## 🎯 Problem Statement

Government procurement in India is a ₹6+ Lakh Crore annual process, but:

- **Lack of transparency** in vendor selection
- **MSME preferences ignored** despite legal mandates (GFR Rule 161)
- **No real-time compliance checks** before contract award
- **Corruption & favoritism** thrive in opacity

**Nyaya AI** applies Constitutional AI principles to ensure every procurement decision is:

- ✅ **Transparent** (Article 19 - Right to Information)
- ✅ **Equitable** (Article 14 - Equality Before Law)
- ✅ **Legal** (GFR 2017 Rules Compliant)
- ✅ **Accountable** (Clear decision audit trail)
- ✅ **Socially Just** (Labor & Environmental Standards)

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       NYAYA AI SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     WebSocket     ┌──────────────────────┐   │
│  │   Frontend   │ ◄───────────────► │   FastAPI Backend    │   │
│  │  (Next.js)   │                   │                      │   │
│  │              │                   │  ┌────────────────┐  │   │
│  │ • Case Input │                   │  │ 5 AI Agents:   │  │   │
│  │ • Live View  │                   │  │ • Transparency │  │   │
│  │ • Verdict    │                   │  │ • Equity       │  │   │
│  │ • Chat       │                   │  │ • Legality     │  │   │
│  └──────────────┘                   │  │ • Accountability│  │   │
│                                     │  │ • Social Justice│  │   │
│                                     │  └────────────────┘  │   │
│                                     │          │           │   │
│                                     │          ▼           │   │
│                                     │  ┌────────────────┐  │   │
│                                     │  │ Chief Justice  │  │   │
│                                     │  │ (Final Verdict)│  │   │
│                                     │  └────────────────┘  │   │
│                                     │          │           │   │
│                                     └──────────┼───────────┘   │
│                                                │               │
│                                                ▼               │
│                                     ┌──────────────────────┐   │
│                                     │   Ollama (Local LLM) │   │
│                                     │   llama3.2:3b        │   │
│                                     └──────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- [Ollama](https://ollama.com/) installed

### 1. Clone & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/constitutional-ai.git
cd constitutional-ai

# Run automated setup (Linux/Mac)
chmod +x setup.sh
./setup.sh
```

### 2. Manual Setup (Windows)

```powershell
# Install Ollama and pull model
ollama pull llama3.2:3b

# Backend setup
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Frontend setup (new terminal)
cd frontend
npm install
```

### 3. Run the Application

```powershell
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start Backend
cd backend
uvicorn main:app --reload

# Terminal 3: Start Frontend
cd frontend
npm run dev
```

Visit **http://localhost:3000** to access the application.

---

## 🎬 Demo Flow

### Step 1: Load a Case

Choose from pre-loaded sample cases or upload your own tender data:

- **Case A (Violation)**: ₹50L contract with MSME preference ignored
- **Case B (Compliant)**: ₹15L AMC with proper procedures

### Step 2: Constitutional Review

Watch 5 AI agents analyze the case in real-time:

1. 👁️ **Transparency Agent** - Checks documentation & process clarity
2. ⚖️ **Equity Agent** - Verifies MSME preferences & fair treatment
3. 🛡️ **Legality Agent** - Validates GFR 2017 compliance
4. 🏛️ **Accountability Agent** - Traces approval chain
5. 🌱 **Social Justice Agent** - Reviews labor & environmental standards

### Step 3: Verdict

The **Chief Justice Agent** synthesizes all opinions into:

- **APPROVE** (Score 80-100): Proceed with procurement
- **CONDITIONAL** (Score 60-79): Fix issues within 7 days
- **REJECT** (Score 0-59): Cancel and restart

### Step 4: Cross-Examine

Ask follow-up questions to the Constitutional Bench about their decision!

---

## 📁 Project Structure

```
constitutional-ai/
├── backend/
│   ├── agents/
│   │   └── prompts.py        # AI agent prompts
│   ├── models/
│   │   └── schemas.py        # Pydantic data models
│   ├── rag/
│   │   └── knowledge_base.py # GFR 2017 rules
│   ├── utils/
│   │   └── llm_client.py     # Ollama integration
│   ├── main.py               # FastAPI server
│   ├── config.py             # Configuration
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   └── page.tsx          # Main application
│   ├── components/
│   │   ├── AgentCard.tsx     # Agent visualization
│   │   ├── CaseInputForm.tsx # Case input
│   │   ├── LiveDebate.tsx    # Real-time analysis view
│   │   ├── CrossExamine.tsx  # Q&A with bench
│   │   └── ...
│   └── package.json
│
└── setup.sh                  # Automated setup script
```

---

## 🔧 API Endpoints

| Endpoint                 | Method    | Description                        |
| ------------------------ | --------- | ---------------------------------- |
| `/`                      | GET       | Health check                       |
| `/health`                | GET       | LLM connection status              |
| `/analyze`               | POST      | Full constitutional analysis       |
| `/ws/analyze`            | WebSocket | Real-time streaming analysis       |
| `/parse_tender`          | POST      | AI-powered tender text parsing     |
| `/ask_bench`             | POST      | Chat with the Constitutional Bench |
| `/sample-case-violation` | GET       | Get sample violation case          |
| `/sample-case-compliant` | GET       | Get sample compliant case          |

---

## ⚖️ Constitutional Principles Applied

### GFR 2017 Rules

- **Rule 144**: Efficiency, economy, transparency
- **Rule 149**: Open Tender for ≥₹25 Lakh
- **Rule 150**: Limited Tender for <₹25 Lakh
- **Rule 161**: MSME preference (L1+15% matching)
- **Rule 166**: Single source restrictions

### Constitutional Articles

- **Article 14**: Right to Equality
- **Article 19(1)(a)**: Right to Information
- **Article 21**: Right to Life & Dignity
- **Article 39(b)**: Resources for common good
- **Article 48A**: Environmental protection

---

## 🛠️ Tech Stack

| Component | Technology                        |
| --------- | --------------------------------- |
| Frontend  | Next.js 15, React 19, TailwindCSS |
| Backend   | Python 3.10+, FastAPI, Pydantic   |
| LLM       | Ollama with llama3.2:3b           |
| Real-time | WebSockets                        |
| Charts    | Recharts                          |

---

## 🔮 Future Roadmap

- [ ] PDF/Document upload for automatic tender parsing
- [ ] Integration with GeM (Government e-Marketplace) API
- [ ] Historical case database & pattern detection
- [ ] Multi-language support (Hindi, Regional)
- [ ] Mobile app for field officers

---

## 👥 Team

Built for **Google Hackathon 2024**

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

<div align="center">

**"न्याय सबके लिए" - Justice for All**

Made with ❤️ for transparent governance

</div>
