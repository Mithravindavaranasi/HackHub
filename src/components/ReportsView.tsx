import React from 'react';
import { FileText, Download, Calendar, AlertTriangle } from 'lucide-react';
import { Report } from '../types';

interface ReportsViewProps {
  reports: Report[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ reports }) => {
  const downloadReport = (report: Report) => {
    const reportContent = `
# Document Conflict Analysis Report
Generated on: ${report.generatedAt.toLocaleString()}

## Summary
- Documents Analyzed: ${report.documents.join(', ')}
- Total Conflicts: ${report.totalConflicts}
- High Priority: ${report.highSeverity}
- Medium Priority: ${report.mediumSeverity}
- Low Priority: ${report.lowSeverity}

## Detailed Conflicts
${report.conflicts.map((conflict, index) => `
### Conflict ${index + 1}: ${conflict.description}
- Type: ${conflict.type}
- Severity: ${conflict.severity}
- Affected Documents: ${conflict.documents.join(', ')}

#### Conflicting Text:
${conflict.conflictingText.map(text => `
- **${text.document}**: "${text.text}"
  Context: ${text.context}
`).join('')}

#### Suggestions:
${conflict.suggestions.map(suggestion => `- ${suggestion}`).join('\n')}
`).join('')}
    `;

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conflict-report-${report.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">No reports generated yet</p>
        <p className="text-sm text-gray-500 mt-2">Analyze some documents to generate your first report</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Generated Reports</h3>
        
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Report #{report.id.slice(-6).toUpperCase()}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {report.generatedAt.toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => downloadReport(report)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-semibold text-gray-900">{report.totalConflicts}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <p className="text-lg font-semibold text-red-600">{report.highSeverity}</p>
                  <p className="text-xs text-red-600">High</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-lg font-semibold text-amber-600">{report.mediumSeverity}</p>
                  <p className="text-xs text-amber-600">Medium</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-lg font-semibold text-blue-600">{report.lowSeverity}</p>
                  <p className="text-xs text-blue-600">Low</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Documents Analyzed:</p>
                <div className="flex flex-wrap gap-2">
                  {report.documents.map((doc, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              {report.highSeverity > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-medium text-red-800">
                      {report.highSeverity} high-priority conflict{report.highSeverity > 1 ? 's' : ''} require immediate attention
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};