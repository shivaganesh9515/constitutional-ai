'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Gavel, User, Loader2 } from 'lucide-react'

interface CrossExamineProps {
  caseData: any
  results: any
}

interface Message {
  role: 'user' | 'bench'
  content: string
}

export default function CrossExamine({ caseData, results }: CrossExamineProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/ask_bench', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_data: caseData,
          verdict_data: results,
          question: userMsg
        })
      })

      if (!res.ok) throw new Error('Failed to reach the bench')

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'bench', content: data.answer }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bench', content: "The Constitutional Bench is currently in recess. Please try again later." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <Gavel className="w-5 h-5 text-amber-400" />
          Cross-Examine the Bench
        </h3>
        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
          Constitutional Session
        </span>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            <Gavel className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">
              The verdict has been delivered.<br/>
              You may now question the reasoning of the Bench.
            </p>
            <p className="text-xs mt-2 italic">
              Example: "Why was the MSME violation considered critical?"
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-blue-100' : 'bg-slate-900'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-blue-600" /> : <Gavel className="w-5 h-5 text-amber-400" />}
            </div>

            <div className={`p-3 rounded-2xl text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[85%]">
             <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
               <Gavel className="w-5 h-5 text-amber-400" />
             </div>
             <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
               <Loader2 className="w-4 h-4 animate-spin" />
               The Bench is deliberating...
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about the verdict..."
            className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-slate-900 text-white p-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
