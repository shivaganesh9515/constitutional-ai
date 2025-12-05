import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Finding {
  issue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  rule_violated: string;
}

interface AgentOpinion {
  agent: string;
  findings: Finding[];
}

interface RiskHeatmapProps {
  opinions: {
    transparency: AgentOpinion;
    equity: AgentOpinion;
    legality: AgentOpinion;
    accountability: AgentOpinion;
  };
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ opinions }) => {
  const allFindings = [
    ...(opinions.transparency?.findings || []),
    ...(opinions.equity?.findings || []),
    ...(opinions.legality?.findings || []),
    ...(opinions.accountability?.findings || []),
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 border-red-600 text-white';
      case 'high': return 'bg-orange-500 border-orange-600 text-white';
      case 'medium': return 'bg-yellow-400 border-yellow-500 text-slate-900';
      case 'low': return 'bg-blue-200 border-blue-300 text-slate-800';
      default: return 'bg-slate-100 border-slate-200 text-slate-500';
    }
  };

  const criticalCount = allFindings.filter(f => f.severity === 'critical').length;
  const highCount = allFindings.filter(f => f.severity === 'high').length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Risk Heatmap
        </h4>
        <div className="text-xs text-right">
           <div className="font-bold text-red-600">{criticalCount} Critical</div>
           <div className="font-bold text-orange-500">{highCount} High Risk</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {allFindings.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-slate-400 flex flex-col items-center">
            <CheckCircle className="w-8 h-8 mb-2 text-green-400" />
            No risks detected.
          </div>
        ) : (
          allFindings.map((finding, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs shadow-sm ${getSeverityColor(finding.severity)}`}
            >
              <div className="font-bold mb-1 uppercase tracking-wider opacity-80 text-[10px]">
                {finding.rule_violated}
              </div>
              <p className="line-clamp-3 leading-tight font-medium">
                {finding.issue}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RiskHeatmap;
