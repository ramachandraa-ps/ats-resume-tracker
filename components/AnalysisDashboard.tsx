import React from 'react';
import { AnalysisResult, ImprovementTip } from '../types';
import ScoreGauge from './ScoreGauge';
import { ICONS } from '../constants';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
  fileName: string;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onReset, fileName }) => {
  
  const getBadgeColor = (type: string) => {
    switch(type) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'important': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <ICONS.FileText />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Resume Analysis</h2>
            <p className="text-sm text-slate-500">{fileName}</p>
          </div>
        </div>
        <button 
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Analyze Another
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Score & Formatting */}
        <div className="space-y-8 lg:col-span-1">
          {/* Score Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Overall ATS Score</h3>
            <ScoreGauge score={result.overallScore} />
            <div className="bg-slate-50 p-4 rounded-xl mt-4">
              <p className="text-sm text-slate-600 text-center italic">"{result.summary}"</p>
            </div>
          </div>

           {/* Formatting Card */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-lg font-bold text-slate-800">Formatting</h3>
              <span className={`px-2 py-1 rounded text-xs font-bold ${result.formatting.score > 70 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {result.formatting.score}/100
              </span>
            </div>
            {result.formatting.issues.length === 0 ? (
               <div className="flex items-center space-x-2 text-green-600 text-sm">
                 <ICONS.CheckCircle />
                 <span>Excellent formatting detected.</span>
               </div>
            ) : (
              <ul className="space-y-3">
                {result.formatting.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-sm text-slate-600">
                    <div className="mt-0.5"><ICONS.AlertTriangle /></div>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Middle & Right Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Action Plan / Improvements */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Top Improvement Priorities</h3>
             <div className="space-y-4">
               {result.improvements.map((imp: ImprovementTip, idx) => (
                 <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${imp.type === 'critical' ? 'bg-red-500' : imp.type === 'important' ? 'bg-amber-500' : 'bg-blue-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                         <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getBadgeColor(imp.type)}`}>
                           {imp.type}
                         </span>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{imp.text}</p>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sections Analysis */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Section Analysis</h3>
               <div className="space-y-4">
                 {result.sections.map((section, idx) => (
                   <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{section.name}</span>
                      {section.status === 'present' && <ICONS.CheckCircle />}
                      {section.status === 'incomplete' && <ICONS.AlertTriangle />}
                      {section.status === 'missing' && <ICONS.XCircle />}
                   </div>
                 ))}
               </div>
            </div>

            {/* Keywords Analysis */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Keywords</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Detected Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.found.length > 0 ? result.keywords.found.map((k, i) => (
                      <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">{k}</span>
                    )) : <span className="text-xs text-slate-400">None detected</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Missing / Recommended</p>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.missing.length > 0 ? result.keywords.missing.map((k, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">{k}</span>
                    )) : <span className="text-xs text-slate-400">No suggestions</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
