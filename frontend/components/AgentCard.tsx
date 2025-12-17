import React from 'react';
import { Eye, Scale, Shield, Building2, BrainCircuit, CheckCircle, AlertTriangle, Leaf } from 'lucide-react';

interface AgentCardProps {
  name: string;
  status: 'idle' | 'analyzing' | 'completed';
  message?: string;
  result?: any;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, status, message, result }) => {
  const getIcon = () => {
    switch (name) {
      case 'transparency': return <Eye className="w-6 h-6" />;
      case 'equity': return <Scale className="w-6 h-6" />;
      case 'legality': return <Shield className="w-6 h-6" />;
      case 'accountability': return <Building2 className="w-6 h-6" />;
      case 'social_justice': return <Leaf className="w-6 h-6" />;
      default: return <BrainCircuit className="w-6 h-6" />;
    }
  };

  // Define static styles map to avoid dynamic Tailwind class purge
  const AGENT_STYLES: Record<string, { analyzing: string, completed: string, icon: string }> = {
    transparency: {
      analyzing: 'border-blue-400 ring-blue-100',
      completed: 'border-blue-600 bg-blue-50',
      icon: 'text-blue-600'
    },
    equity: {
      analyzing: 'border-purple-400 ring-purple-100',
      completed: 'border-purple-600 bg-purple-50',
      icon: 'text-purple-600'
    },
    legality: {
      analyzing: 'border-red-400 ring-red-100',
      completed: 'border-red-600 bg-red-50',
      icon: 'text-red-600'
    },
    accountability: {
      analyzing: 'border-orange-400 ring-orange-100',
      completed: 'border-orange-600 bg-orange-50',
      icon: 'text-orange-600'
    },
    social_justice: {
      analyzing: 'border-emerald-400 ring-emerald-100',
      completed: 'border-emerald-600 bg-emerald-50',
      icon: 'text-emerald-600'
    },
    default: {
      analyzing: 'border-slate-400 ring-slate-100',
      completed: 'border-slate-600 bg-slate-50',
      icon: 'text-slate-600'
    }
  };

  const styles = AGENT_STYLES[name] || AGENT_STYLES.default;

  return (
    <div className={`relative transition-all duration-500 transform ${status === 'analyzing' ? 'scale-105' : ''}`}>
      {/* Speech Bubble / Thought */}
      {(status === 'analyzing' || (status === 'completed' && result)) && (
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 z-10
          ${status === 'analyzing' ? 'animate-pulse' : 'animate-bounce'}
        `}>
          <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200 text-xs font-medium text-slate-700 text-center relative">
            {status === 'analyzing' ? (
              <span className="italic">"{message || 'Analyzing...'}"</span>
            ) : (
              <div className="flex flex-col gap-1">
                 <span className={`font-bold uppercase ${
                   result.stance === 'approve' ? 'text-green-600' :
                   result.stance === 'reject' ? 'text-red-600' : 'text-amber-600'
                 }`}>
                   {result.stance}
                 </span>
                 <span className="line-clamp-2">"{result.citizen_explanation}"</span>
              </div>
            )}
            {/* Triangle for bubble */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0
              border-l-8 border-l-transparent
              border-r-8 border-r-transparent
              border-t-8 border-t-white">
            </div>
          </div>
        </div>
      )}

      {/* Agent Avatar */}
      <div className={`
        w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg border-4
        ${status === 'analyzing' ? `ring-4 ${styles.analyzing}` : `border-slate-200`}
        ${status === 'completed' ? styles.completed : 'bg-white'}
        transition-all duration-300
      `}>
        <div className={styles.icon}>
          {getIcon()}
        </div>

        {/* Status Badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
           {status === 'analyzing' && (
             <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
               Thinking
             </span>
           )}
           {status === 'completed' && (
             <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
               <CheckCircle className="w-3 h-3" />
               Ready
             </span>
           )}
        </div>
      </div>

      <div className="text-center mt-3">
        <h4 className="font-bold capitalize text-slate-700">{name} Agent</h4>
      </div>
    </div>
  );
};

export default AgentCard;
