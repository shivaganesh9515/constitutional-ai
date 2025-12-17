'use client'

import { useState } from 'react'
import { Sparkles, FileText, ArrowRight, Loader2 } from 'lucide-react'

interface SmartCaseInputProps {
  onParsed: (data: any) => void
}

export default function SmartCaseInput({ onParsed }: SmartCaseInputProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleParse = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:8000/parse_tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!res.ok) throw new Error('Failed to parse text')

      const data = await res.json()
      onParsed(data)
    } catch (e) {
      setError('Could not extract structured data. Please try again or fill manually.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Smart Fill: Paste Tender Document
        </label>
        <p className="text-xs text-slate-500 mb-3">
          Paste the raw text from any tender notice, email, or PDF. Nyaya AI will automatically extract the details.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste tender text here... e.g., 'Notice Inviting Tender No. 123/2024 for supply of...'"
          className="w-full h-32 p-3 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
        />

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleParse}
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Extracting Data...' : 'Auto-Fill Form'}
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-500">Or enter manually</span>
        </div>
      </div>
    </div>
  )
}
