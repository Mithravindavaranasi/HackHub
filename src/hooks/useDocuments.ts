import { useState, useCallback } from 'react';
import { Document, Conflict, Report, UsageStats } from '../types';

const COST_PER_DOCUMENT = 2.50;
const COST_PER_REPORT = 5.00;

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    documentsAnalyzed: 0,
    reportsGenerated: 0,
    totalBilling: 0,
    currentMonthBilling: 0,
    lastAnalysis: null,
  });

  const addDocument = useCallback((file: File): Promise<Document> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const document: Document = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          content: reader.result as string,
          uploadedAt: new Date(),
          type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'txt',
          size: file.size,
        };
        
        setDocuments(prev => [...prev, document]);
        setUsageStats(prev => ({
          ...prev,
          documentsAnalyzed: prev.documentsAnalyzed + 1,
          totalBilling: prev.totalBilling + COST_PER_DOCUMENT,
          currentMonthBilling: prev.currentMonthBilling + COST_PER_DOCUMENT,
        }));
        
        resolve(document);
      };
      reader.readAsText(file);
    });
  }, []);

  const analyzeDocuments = useCallback(async () => {
    if (documents.length < 2) return;
    
    setLoading(true);
    
    // Simulate AI analysis with realistic conflicts
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockConflicts: Conflict[] = [
      {
        id: '1',
        type: 'contradiction',
        severity: 'high',
        documents: [documents[0]?.name, documents[1]?.name].filter(Boolean),
        description: 'Conflicting deadlines found between documents',
        suggestions: [
          'Standardize submission deadlines across all documents',
          'Create a master schedule document',
          'Add clarification notes for different contexts'
        ],
        conflictingText: [
          {
            document: documents[0]?.name || '',
            text: 'submit before 10 PM',
            context: 'Project submission guidelines'
          },
          {
            document: documents[1]?.name || '',
            text: 'deadline is midnight',
            context: 'General rules document'
          }
        ]
      },
      {
        id: '2',
        type: 'inconsistency',
        severity: 'medium',
        documents: [documents[0]?.name].filter(Boolean),
        description: 'Attendance requirement percentages vary',
        suggestions: [
          'Unify attendance requirements',
          'Specify context for different percentages',
          'Review with academic committee'
        ],
        conflictingText: [
          {
            document: documents[0]?.name || '',
            text: 'minimum 75% attendance',
            context: 'Course requirements section'
          },
          {
            document: documents[0]?.name || '',
            text: 'at least 65% attendance',
            context: 'Exception policies section'
          }
        ]
      }
    ];

    setConflicts(mockConflicts);
    setLoading(false);
    
    return mockConflicts;
  }, [documents]);

  const generateReport = useCallback(async (conflictsToReport: Conflict[]) => {
    const report: Report = {
      id: Math.random().toString(36).substr(2, 9),
      generatedAt: new Date(),
      documents: documents.map(d => d.name),
      conflicts: conflictsToReport,
      totalConflicts: conflictsToReport.length,
      highSeverity: conflictsToReport.filter(c => c.severity === 'high').length,
      mediumSeverity: conflictsToReport.filter(c => c.severity === 'medium').length,
      lowSeverity: conflictsToReport.filter(c => c.severity === 'low').length,
      status: 'completed'
    };

    setReports(prev => [...prev, report]);
    setUsageStats(prev => ({
      ...prev,
      reportsGenerated: prev.reportsGenerated + 1,
      totalBilling: prev.totalBilling + COST_PER_REPORT,
      currentMonthBilling: prev.currentMonthBilling + COST_PER_REPORT,
      lastAnalysis: new Date(),
    }));

    return report;
  }, [documents]);

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setDocuments([]);
    setConflicts([]);
  }, []);

  return {
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
  };
};