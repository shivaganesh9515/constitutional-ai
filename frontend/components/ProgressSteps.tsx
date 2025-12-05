'use client'

import { CheckCircle, Circle, Loader2 } from 'lucide-react'

interface ProgressStepsProps {
  steps: {
    id: string
    label: string
    status: 'pending' | 'analyzing' | 'completed'
  }[]
}

export default function ProgressSteps({ steps }: ProgressStepsProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
        
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center bg-white px-2">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
              ${step.status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' : 
                step.status === 'analyzing' ? 'bg-blue-100 border-blue-500 text-blue-600 scale-110' : 
                'bg-gray-50 border-gray-300 text-gray-300'}
            `}>
              {step.status === 'completed' ? (
                <CheckCircle className="w-6 h-6" />
              ) : step.status === 'analyzing' ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </div>
            <span className={`mt-2 text-xs font-medium ${
              step.status === 'analyzing' ? 'text-blue-600' : 
              step.status === 'completed' ? 'text-green-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
