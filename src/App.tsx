import React, { useState } from 'react';
import { FileSearch, Upload, BarChart3, FileText, Globe, Menu, X } from 'lucide-react';
import { useDocuments } from './hooks/useDocuments';
import { DocumentUpload } from './components/DocumentUpload';
import { ConflictAnalysis } from './components/ConflictAnalysis';
import { UsageDashboard } from './components/UsageDashboard';
import { ReportsView } from './components/ReportsView';
import { ExternalMonitoring } from './components/ExternalMonitoring';

type TabType = 'upload' | 'analysis' | 'reports' | 'usage' | 'monitoring';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const {
    documents,
    conflicts,
    reports,
    loading,
    usageStats,
    addDocument,
    removeDocument,
    analyzeDocuments,
    generateReport,
    clearAll,
  } = useDocuments();

  const tabs = [
    { id: 'upload' as TabType, label: 'Upload Documents', icon: Upload },
    { id: 'analysis' as TabType, label: 'Analysis', icon: FileSearch },
    { id: 'reports' as TabType, label: 'Reports', icon: FileText },
    { id: 'usage' as TabType, label: 'Usage & Billing', icon: BarChart3 },
    { id: 'monitoring' as TabType, label: 'External Monitoring', icon: Globe },
  ];

  const handleAnalyze = async () => {
    const detectedConflicts = await analyzeDocuments();
    if (detectedConflicts && detectedConflicts.length > 0) {
      setActiveTab('analysis');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <FileSearch className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Smart Doc Checker Agent</h1>
                <p className="text-sm text-gray-500">AI-Powered Document Conflict Detection</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Total Usage: <span className="font-semibold text-blue-600">${usageStats.totalBilling.toFixed(2)}</span>
              </div>
              {documents.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation */}
          <div className={`lg:w-64 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <nav className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                      {tab.id === 'analysis' && conflicts.length > 0 && (
                        <span className="ml-auto bg-red-100 text-red-600 px-2 py-0.5 text-xs rounded-full">
                          {conflicts.length}
                        </span>
                      )}
                      {tab.id === 'reports' && reports.length > 0 && (
                        <span className="ml-auto bg-green-100 text-green-600 px-2 py-0.5 text-xs rounded-full">
                          {reports.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {documents.length >= 2 && activeTab === 'upload' && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Documents'}
                  </button>
                </div>
              )}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'upload' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Upload Documents</h2>
                  <p className="text-gray-600 mt-2">
                    Upload 2-3 documents to analyze for conflicts and contradictions. Supported formats: TXT, PDF, DOCX.
                  </p>
                </div>
                <DocumentUpload
                  documents={documents}
                  onAddDocument={addDocument}
                  onRemoveDocument={removeDocument}
                />
                {documents.length < 2 && documents.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      Upload at least 2 documents to enable conflict analysis.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Conflict Analysis</h2>
                  <p className="text-gray-600 mt-2">
                    AI-powered analysis results showing detected conflicts and suggested resolutions.
                  </p>
                </div>
                <ConflictAnalysis
                  conflicts={conflicts}
                  loading={loading}
                  onGenerateReport={generateReport}
                />
              </div>
            )}

            {activeTab === 'reports' && (
              <ReportsView reports={reports} />
            )}

            {activeTab === 'usage' && (
              <UsageDashboard usageStats={usageStats} reports={reports} />
            )}

            {activeTab === 'monitoring' && (
              <ExternalMonitoring />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-500">
              © 2025 Smart Doc Checker Agent. Powered by AI for accurate conflict detection.
            </div>
            <div className="text-sm text-gray-500 mt-2 md:mt-0">
              Billing: ${usageStats.currentMonthBilling.toFixed(2)} this month • 
              {usageStats.documentsAnalyzed} docs analyzed • 
              {usageStats.reportsGenerated} reports generated
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;