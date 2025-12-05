import React from 'react';
import AgentCard from './AgentCard';

interface LiveDebateProps {
  agentStatus: {
    transparency: 'idle' | 'analyzing' | 'completed';
    equity: 'idle' | 'analyzing' | 'completed';
    legality: 'idle' | 'analyzing' | 'completed';
    accountability: 'idle' | 'analyzing' | 'completed';
  };
  agentMessages: {
    transparency: string;
    equity: string;
    legality: string;
    accountability: string;
  };
  results?: any;
}

const LiveDebate: React.FC<LiveDebateProps> = ({ agentStatus, agentMessages, results }) => {
  return (
    <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-200 min-h-[400px] flex items-center justify-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full max-w-5xl">
        <AgentCard
          name="transparency"
          status={agentStatus.transparency}
          message={agentMessages.transparency}
          result={results?.agent_opinions?.transparency}
        />
        <AgentCard
          name="equity"
          status={agentStatus.equity}
          message={agentMessages.equity}
          result={results?.agent_opinions?.equity}
        />
        <AgentCard
          name="legality"
          status={agentStatus.legality}
          message={agentMessages.legality}
          result={results?.agent_opinions?.legality}
        />
        <AgentCard
          name="accountability"
          status={agentStatus.accountability}
          message={agentMessages.accountability}
          result={results?.agent_opinions?.accountability}
        />
      </div>
    </div>
  );
};

export default LiveDebate;
