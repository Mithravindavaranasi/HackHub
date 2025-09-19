import React from 'react';
import { FileText, BarChart3, DollarSign, Calendar } from 'lucide-react';
import { UsageStats, Report } from '../types';

interface UsageDashboardProps {
  usageStats: UsageStats;
  reports: Report[];
}

export const UsageDashboard: React.FC<UsageDashboardProps> = ({ usageStats, reports }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Usage & Billing Dashboard</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <FileText className="mx-auto h-8 w-8 text-blue-600 mb-3" />
            <p className="text-2xl font-bold text-blue-600">{usageStats.documentsAnalyzed}</p>
            <p className="text-sm text-blue-600 font-medium">Documents Analyzed</p>
            <p className="text-xs text-gray-500 mt-1">$2.50 per document</p>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <BarChart3 className="mx-auto h-8 w-8 text-green-600 mb-3" />
            <p className="text-2xl font-bold text-green-600">{usageStats.reportsGenerated}</p>
            <p className="text-sm text-green-600 font-medium">Reports Generated</p>
            <p className="text-xs text-gray-500 mt-1">$5.00 per report</p>
          </div>
          
          <div className="text-center p-6 bg-indigo-50 rounded-lg">
            <DollarSign className="mx-auto h-8 w-8 text-indigo-600 mb-3" />
            <p className="text-2xl font-bold text-indigo-600">${usageStats.currentMonthBilling.toFixed(2)}</p>
            <p className="text-sm text-indigo-600 font-medium">This Month</p>
            <p className="text-xs text-gray-500 mt-1">Current billing cycle</p>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <Calendar className="mx-auto h-8 w-8 text-purple-600 mb-3" />
            <p className="text-2xl font-bold text-purple-600">${usageStats.totalBilling.toFixed(2)}</p>
            <p className="text-sm text-purple-600 font-medium">Total Billing</p>
            <p className="text-xs text-gray-500 mt-1">All time usage</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Billing Breakdown</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Document Analysis ({usageStats.documentsAnalyzed} docs)</span>
              <span className="font-medium">${(usageStats.documentsAnalyzed * 2.50).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Report Generation ({usageStats.reportsGenerated} reports)</span>
              <span className="font-medium">${(usageStats.reportsGenerated * 5.00).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-t-2 border-blue-200">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-blue-600">${usageStats.totalBilling.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {usageStats.lastAnalysis && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              Last analysis completed on {usageStats.lastAnalysis.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};