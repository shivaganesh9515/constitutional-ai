'use client'

import { useState, useEffect, useRef } from 'react'
import { Scale, AlertTriangle, CheckCircle, Loader2, Eye, Users, Shield, Building2, FileText, Gavel } from 'lucide-react'
import ConstitutionalScore from '@/components/ConstitutionalScore'
import ProgressSteps from '@/components/ProgressSteps'

export default function Home() {
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [progressMessage, setProgressMessage] = useState("")
  const [agentStatus, setAgentStatus] = useState<any>({
    transparency: 'pending',
    equity: 'pending',
    legality: 'pending',
    accountability: 'pending'
  })
  
  const wsRef = useRef<WebSocket | null>(null)

  const fetchSampleCase = async (type: 'violation' | 'compliant') => {
    try {
      const endpoint = type === 'violation' ? 'sample-case-violation' : 'sample-case-compliant'
      const res = await fetch(`http://localhost:8000/${endpoint}`)
      const data = await res.json()
      setSelectedCase(data)
      setResults(null)
      setAgentStatus({
        transparency: 'pending',
        equity: 'pending',
        legality: 'pending',
        accountability: 'pending'
      })
    } catch (e) {
      console.error("Failed to fetch sample case", e)
    }
  }

  const startAnalysis = () => {
    if (!selectedCase) return
    setAnalyzing(true)
    setResults(null)
    setProgressMessage("Initializing connection...")
    
    // Reset statuses
    setAgentStatus({
      transparency: 'pending',
      equity: 'pending',
      legality: 'pending',
      accountability: 'pending'
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
      } else if (data.status === 'complete') {
        setResults(data.result)
        setAnalyzing(false)
        ws.close()
      } else if (data.status === 'error') {
        console.error("WS Error:", data.message)
        setAnalyzing(false)
        ws.close()
      }
    }

    ws.onclose = () => {
      console.log("WS Disconnected")
    }
  }

  const steps = [
    { id: 'transparency', label: 'Transparency', status: agentStatus.transparency },
    { id: 'equity', label: 'Equity', status: agentStatus.equity },
    { id: 'legality', label: 'Legality', status: agentStatus.legality },
    { id: 'accountability', label: 'Accountability', status: agentStatus.accountability },
  ]

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
        
        {!selectedCase ? (
          <div className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">Select a Case to Review</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                  <div className="mb-8">
                    <ProgressSteps steps={steps} />
                  </div>
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-slate-800">{progressMessage}</h3>
                    <p className="text-slate-500 mt-2">Consulting GFR 2017 and Constitution of India...</p>
                  </div>
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

                  {/* Score & Breakdown */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-1">
                      <ConstitutionalScore score={results.verdict.constitutional_score} />
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
                      <h4 className="font-bold text-slate-800 mb-4">Critical Issues Found</h4>
                      {results.verdict.critical_issues?.length > 0 ? (
                        <ul className="space-y-2">
                          {results.verdict.critical_issues.map((issue: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded">
                          <CheckCircle className="w-5 h-5" />
                          No critical issues found. Procurement is compliant.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Agent Opinions */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(results.agent_opinions).map(([key, agent]: [string, any]) => (
                      <div key={key} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                          <div className="flex items-center gap-2">
                            {key === 'transparency' && <Eye className="w-4 h-4 text-blue-500" />}
                            {key === 'equity' && <Scale className="w-4 h-4 text-purple-500" />}
                            {key === 'legality' && <Shield className="w-4 h-4 text-red-500" />}
                            {key === 'accountability' && <Building2 className="w-4 h-4 text-orange-500" />}
                            <h4 className="font-bold capitalize text-slate-700">{key} Agent</h4>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            agent.stance === 'approve' ? 'bg-green-100 text-green-700' :
                            agent.stance === 'reject' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {agent.stance?.toUpperCase() || 'UNKNOWN'}
                          </span>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-slate-600 mb-3 italic">"{agent.citizen_explanation}"</p>
                          
                          {agent.findings?.length > 0 && (
                            <div className="space-y-2">
                              {agent.findings.slice(0, 2).map((finding: any, i: number) => (
                                <div key={i} className="text-xs bg-slate-50 p-2 rounded border border-slate-100">
                                  <span className="font-semibold text-slate-700">{finding.rule_violated}:</span> {finding.issue}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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
