import React from 'react';
import AgentCard from './AgentCard';

interface LiveDebateProps {
  agentStatus: {
    transparency: 'idle' | 'analyzing' | 'completed';
    equity: 'idle' | 'analyzing' | 'completed';
    legality: 'idle' | 'analyzing' | 'completed';
    accountability: 'idle' | 'analyzing' | 'completed';
    social_justice: 'idle' | 'analyzing' | 'completed';
  };
  agentMessages: {
    transparency: string;
    equity: string;
    legality: string;
    accountability: string;
    social_justice: string;
  };
  results?: any;
}

const LiveDebate: React.FC<LiveDebateProps> = ({ agentStatus, agentMessages, results }) => {
  return (
    <div className="bg-slate-50/50 p-8 rounded-2xl border border-slate-200 min-h-[400px] flex items-center justify-center">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full max-w-6xl">
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
        <AgentCard
          name="social_justice"
          status={agentStatus.social_justice}
          message={agentMessages.social_justice}
          result={results?.agent_opinions?.social_justice}
        />
      </div>
    </div>
  );
};

export default LiveDebate;
