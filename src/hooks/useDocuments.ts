import { useState, useCallback } from 'react';
import { Document, Conflict, Report, UsageStats } from '../types';
import { analyzeDocumentsForContradictions } from '../utils/textAnalysis';

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
    
    // Real document analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Analyze the actual document content
    const documentData = documents.map(doc => ({
      name: doc.name,
      content: doc.content
    }));
    
    const contradictionMatches = analyzeDocumentsForContradictions(documentData);
    
    // Convert analysis results to Conflict format
    const detectedConflicts: Conflict[] = contradictionMatches.map((match, index) => ({
      id: (index + 1).toString(),
      type: match.type,
      severity: match.severity,
      documents: [match.document1, match.document2],
      description: generateConflictDescription(match),
      suggestions: generateSuggestions(match),
      conflictingText: [
        {
          document: match.document1,
          text: match.text1,
          context: match.context1
        },
        {
          document: match.document2,
          text: match.text2,
          context: match.context2
        }
      ]
    }));

    setConflicts(detectedConflicts);
    setLoading(false);
    
    return detectedConflicts;
  }, [documents]);

  const generateConflictDescription = (match: any) => {
    if (match.text1.includes('%') && match.text2.includes('%')) {
      return 'Conflicting percentage requirements found between documents';
    }
    if (match.text1.match(/\d{1,2}:\d{2}/) && match.text2.match(/\d{1,2}:\d{2}/)) {
      return 'Different time specifications found in similar contexts';
    }
    if (match.text1.includes('required') || match.text2.includes('required')) {
      return 'Contradictory requirement statements detected';
    }
    return 'Potential contradiction detected between document statements';
  };

  const generateSuggestions = (match: any) => {
    const suggestions = [
      'Review both documents for consistency',
      'Establish which document takes precedence',
      'Update conflicting information to match',
      'Add clarification notes to resolve ambiguity'
    ];
    
    if (match.text1.includes('%') && match.text2.includes('%')) {
      suggestions.push('Standardize percentage requirements across all documents');
    }
    if (match.text1.match(/\d{1,2}:\d{2}/) && match.text2.match(/\d{1,2}:\d{2}/)) {
      suggestions.push('Synchronize time specifications in all related documents');
    }
    
    return suggestions;
  };

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