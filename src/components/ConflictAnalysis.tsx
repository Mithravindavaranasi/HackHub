import React from 'react';
import { AlertTriangle, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { Conflict } from '../types';

interface ConflictAnalysisProps {
  conflicts: Conflict[];
  loading: boolean;
  onGenerateReport: (conflicts: Conflict[]) => void;
}

const severityConfig = {
  high: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  medium: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  low: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
};

const typeLabels = {
  contradiction: 'Contradiction',
  overlap: 'Overlap',
  inconsistency: 'Inconsistency',
};

export const ConflictAnalysis: React.FC<ConflictAnalysisProps> = ({
  conflicts,
  loading,
  onGenerateReport,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Analyzing documents for conflicts...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
      </div>
    );
  }

  if (conflicts.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <p className="text-lg font-medium text-gray-700">No conflicts detected</p>
        <p className="text-sm text-gray-500 mt-2">Your documents appear to be consistent</p>
      </div>
    );
  }

  const highPriority = conflicts.filter(c => c.severity === 'high').length;
  const mediumPriority = conflicts.filter(c => c.severity === 'medium').length;
  const lowPriority = conflicts.filter(c => c.severity === 'low').length;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
          <button
            onClick={() => onGenerateReport(conflicts)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Generate Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{conflicts.length}</p>
            <p className="text-sm text-gray-600">Total Conflicts</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{highPriority}</p>
            <p className="text-sm text-red-600">High Priority</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-2xl font-bold text-amber-600">{mediumPriority}</p>
            <p className="text-sm text-amber-600">Medium Priority</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{lowPriority}</p>
            <p className="text-sm text-blue-600">Low Priority</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {conflicts.map((conflict) => {
          const config = severityConfig[conflict.severity];
          const Icon = config.icon;

          return (
            <div key={conflict.id} className={`border ${config.border} ${config.bg} rounded-lg p-6`}>
              <div className="flex items-start gap-4">
                <Icon className={`h-6 w-6 ${config.color} flex-shrink-0 mt-1`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium ${config.color} ${config.bg} rounded-full`}>
                      {typeLabels[conflict.type]}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium ${config.color} ${config.bg} rounded-full capitalize`}>
                      {conflict.severity} Priority
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-medium text-gray-900 mb-3">{conflict.description}</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Conflicting Text:</h5>
                      <div className="space-y-2">
                        {conflict.conflictingText.map((text, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded p-3">
                            <p className="font-medium text-gray-800">{text.document}</p>
                            <p className="text-gray-600 mt-1">"{text.text}"</p>
                            <p className="text-sm text-gray-500 mt-1">Context: {text.context}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Suggested Resolutions:
                      </h5>
                      <ul className="space-y-1">
                        {conflict.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-1.5">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};