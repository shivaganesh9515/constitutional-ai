'use client'

import { useState, useEffect, useRef } from 'react'
import { Scale, AlertTriangle, CheckCircle, Loader2, Eye, Users, Shield, Building2, FileText, Gavel, PlusCircle } from 'lucide-react'
import ConstitutionalScore from '@/components/ConstitutionalScore'
import LiveDebate from '@/components/LiveDebate'
import RiskHeatmap from '@/components/RiskHeatmap'
import CaseInputForm from '@/components/CaseInputForm'
import CrossExamine from '@/components/CrossExamine'

export default function Home() {
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [progressMessage, setProgressMessage] = useState("")
  const [inputMode, setInputMode] = useState(false)

  // State for Live Debate
  const [agentStatus, setAgentStatus] = useState<any>({
    transparency: 'idle',
    equity: 'idle',
    legality: 'idle',
    accountability: 'idle',
    social_justice: 'idle'
  })

  const [agentMessages, setAgentMessages] = useState<any>({
    transparency: '',
    equity: '',
    legality: '',
    accountability: '',
    social_justice: ''
  })
  
  const wsRef = useRef<WebSocket | null>(null)

  const fetchSampleCase = async (type: 'violation' | 'compliant' | 'emergency') => {
    try {
      const endpoints: Record<string, string> = {
        violation: 'sample-case-violation',
        compliant: 'sample-case-compliant',
        emergency: 'sample-case-emergency'
      }
      const res = await fetch(`http://localhost:8000/${endpoints[type]}`)
      const data = await res.json()
      setSelectedCase(data)
      setResults(null)
      setAgentStatus({
        transparency: 'idle',
        equity: 'idle',
        legality: 'idle',
        accountability: 'idle',
        social_justice: 'idle'
      })
    } catch (e) {
      console.error("Failed to fetch sample case", e)
    }
  }

  const startAnalysis = () => {
    if (!selectedCase) return
    setAnalyzing(true)
    setResults(null)
    setProgressMessage("Initializing Constitutional Bench...")
    
    // Reset statuses
    setAgentStatus({
      transparency: 'idle',
      equity: 'idle',
      legality: 'idle',
      accountability: 'idle',
      social_justice: 'idle'
    })
    setAgentMessages({
      transparency: '',
      equity: '',
      legality: '',
      accountability: '',
      social_justice: ''
    })

    const ws = new WebSocket('ws://localhost:8000/ws/analyze')
    wsRef.current = ws

    ws.onopen = () => {
      ws.send(JSON.stringify(selectedCase))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.status === 'info') {
        setProgressMessage(data.message)
      } else if (data.status === 'progress') {
        setAgentStatus((prev: any) => ({
          ...prev,
          [data.agent]: data.state
        }))
        if (data.state === 'analyzing') {
          setProgressMessage(`${data.agent.charAt(0).toUpperCase() + data.agent.slice(1)} Agent is analyzing...`)
        }
      } else if (data.status === 'thought') {
        // Update the "thought bubble" for the agent
        setAgentMessages((prev: any) => ({
          ...prev,
          [data.agent]: data.message
        }))
      } else if (data.status === 'complete') {
        setResults(data.result)
        setAnalyzing(false)
        ws.close()
      } else if (data.status === 'error') {
        
        setAnalyzing(false)
        ws.close()
      }
    }

    ws.onclose = () => {
      console.log("WS Disconnected")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <Scale className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">NYAYA AI</h1>
            <p className="text-xs text-slate-400">Constitutional Procurement Review System</p>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        
        {inputMode ? (
          <CaseInputForm
            onSubmit={(data) => {
              setSelectedCase(data)
              setInputMode(false)
            }}
            onCancel={() => setInputMode(false)}
          />
        ) : !selectedCase ? (
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Select a Case to Review</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <button
                onClick={() => fetchSampleCase('violation')}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md hover:shadow-xl transition-all border-l-4 border-red-500 text-left"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <AlertTriangle className="w-24 h-24 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Case A: The "Urgent" Purchase</h3>
                <p className="text-slate-600 mb-4">₹50 Lakh computer supply contract awarded via Limited Tender.</p>
                <span className="inline-flex items-center text-red-600 font-medium group-hover:translate-x-1 transition">
                  Load Case <FileText className="w-4 h-4 ml-2" />
                </span>
              </button>

              <button
                onClick={() => fetchSampleCase('compliant')}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md hover:shadow-xl transition-all border-l-4 border-green-500 text-left"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <CheckCircle className="w-24 h-24 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Case B: The Fair Tender</h3>
                <p className="text-slate-600 mb-4">₹15 Lakh AMC contract with MSME preference applied.</p>
                <span className="inline-flex items-center text-green-600 font-medium group-hover:translate-x-1 transition">
                  Load Case <FileText className="w-4 h-4 ml-2" />
                </span>
              </button>

              <button
                onClick={() => fetchSampleCase('emergency')}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md hover:shadow-xl transition-all border-l-4 border-amber-500 text-left"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <Shield className="w-24 h-24 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Case C: Emergency Procurement</h3>
                <p className="text-slate-600 mb-4">₹85 Lakh medical equipment via Single Source.</p>
                <span className="inline-flex items-center text-amber-600 font-medium group-hover:translate-x-1 transition">
                  Load Case <FileText className="w-4 h-4 ml-2" />
                </span>
              </button>

              <button
                onClick={() => setInputMode(true)}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md hover:shadow-xl transition-all border-l-4 border-blue-500 text-left"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <PlusCircle className="w-24 h-24 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Custom Case</h3>
                <p className="text-slate-600 mb-4">Enter tender details manually or paste JSON for analysis.</p>
                <span className="inline-flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition">
                  Create Case <PlusCircle className="w-4 h-4 ml-2" />
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Case Details */}
            <div className="lg:col-span-1 space-y-6">
              <button 
                onClick={() => { setSelectedCase(null); setResults(null); }}
                className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                ← Back to Selection
              </button>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Case Details
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase">Tender ID</label>
                    <div className="font-mono text-slate-700">{selectedCase.tender_id}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase">Title</label>
                    <div className="text-slate-900 font-medium">{selectedCase.title}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase">Value</label>
                    <div className="text-slate-900">₹{selectedCase.estimated_value.toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase">Method</label>
                    <div className="inline-block px-2 py-1 bg-slate-100 rounded text-slate-700 text-xs font-medium">
                      {selectedCase.procurement_method}
                    </div>
                  </div>
                </div>

                {!analyzing && !results && (
                  <button
                    onClick={startAnalysis}
                    className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                  >
                    <Gavel className="w-5 h-5" />
                    Start Constitutional Review
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Analysis */}
            <div className="lg:col-span-2">
              {analyzing && !results && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-800 text-center animate-pulse">{progressMessage}</h3>
                  <LiveDebate
                    agentStatus={agentStatus}
                    agentMessages={agentMessages}
                  />
                </div>
              )}

              {results && (
                <div className="space-y-6">
                  {/* Verdict Banner */}
                  <div className={`rounded-xl p-6 text-white shadow-lg ${
                    results.verdict.verdict === 'APPROVE' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
                    results.verdict.verdict === 'REJECT' ? 'bg-gradient-to-r from-red-600 to-rose-600' :
                    'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-bold mb-1">{results.verdict.verdict}</h2>
                        <p className="opacity-90 text-lg">Constitutional Bench Verdict</p>
                      </div>
                      <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                        <div className="text-3xl font-bold">{results.verdict.constitutional_score}</div>
                        <div className="text-xs uppercase tracking-wider opacity-80">Score</div>
                      </div>
                    </div>
                    <div className="mt-6 bg-black/10 p-4 rounded-lg">
                      <p className="font-medium">🏛️ Citizen Summary</p>
                      <p className="opacity-90 mt-1">{results.verdict.citizen_summary}</p>
                    </div>
                  </div>

                  {/* Heatmap & Score */}
                  <div className="grid md:grid-cols-2 gap-6 h-auto">
                     <ConstitutionalScore score={results.verdict.constitutional_score} />
                     <RiskHeatmap opinions={results.agent_opinions} />
                  </div>

                  {/* Cross Examination */}
                  <CrossExamine caseData={selectedCase} results={results} />

                  {/* Final Agent Grid (Live Debate Style but static) */}
                  <div className="mt-8">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" /> Agent Opinions
                    </h4>
                    <LiveDebate
                      agentStatus={{
                        transparency: 'completed',
                        equity: 'completed',
                        legality: 'completed',
                        accountability: 'completed',
                        social_justice: 'completed'
                      }}
                      agentMessages={{
                        transparency: '', equity: '', legality: '', accountability: '', social_justice: ''
                      }}
                      results={results}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
