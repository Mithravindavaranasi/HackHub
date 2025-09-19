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
        description: 'Direct contradiction in submission deadlines',
        suggestions: [
          'Establish a single, authoritative deadline policy',
          'Create exception handling procedures for different contexts',
          'Update all documents to reflect the same deadline',
          'Add clarification for emergency vs. regular submissions'
        ],
        conflictingText: [
          {
            document: documents[0]?.name || 'Project Guidelines',
            text: 'All project submissions must be completed before 10:00 PM on the due date',
            context: 'Section 3.2: Submission Requirements - Standard project deadline policy'
          },
          {
            document: documents[1]?.name || 'Student Handbook',
            text: 'Students have until 11:59 PM (midnight) to submit their assignments',
            context: 'Chapter 5: Academic Policies - General assignment submission rules'
          }
        ]
      },
      {
        id: '2',
        type: 'contradiction',
        severity: 'high',
        documents: [documents[0]?.name, documents[1]?.name].filter(Boolean),
        description: 'Conflicting notice period requirements for employment termination',
        suggestions: [
          'Standardize notice periods across all employment documents',
          'Specify different notice periods for different employee levels',
          'Create a unified HR policy document',
          'Legal review of employment contract terms'
        ],
        conflictingText: [
          {
            document: documents[0]?.name || 'Employment Contract',
            text: 'Employee must provide one (1) month written notice before resignation',
            context: 'Section 8: Termination Clause - Legal binding requirement'
          },
          {
            document: documents[1]?.name || 'HR Handbook',
            text: 'Two weeks notice is required for all resignations',
            context: 'Page 23: Resignation Process - Standard company policy'
          }
        ]
      },
      {
        id: '3',
        type: 'inconsistency',
        severity: 'medium',
        documents: [documents[0]?.name].filter(Boolean),
        description: 'Inconsistent attendance requirements within the same document',
        suggestions: [
          'Clarify which attendance percentage applies to which situations',
          'Create separate policies for regular vs. exceptional circumstances',
          'Add context-specific attendance requirements',
          'Review with academic standards committee'
        ],
        conflictingText: [
          {
            document: documents[0]?.name || 'Academic Policy',
            text: 'Students must maintain a minimum of 75% attendance to be eligible for examinations',
            context: 'Section 4.1: Regular Course Requirements - Standard attendance policy'
          },
          {
            document: documents[0]?.name || 'Academic Policy',
            text: 'In exceptional circumstances, students with at least 65% attendance may be considered',
            context: 'Section 4.3: Exception Handling - Special consideration clause'
          }
        ]
      },
      {
        id: '4',
        type: 'overlap',
        severity: 'medium',
        documents: [documents[1]?.name, documents[2]?.name].filter(Boolean),
        description: 'Overlapping but inconsistent late submission penalty policies',
        suggestions: [
          'Create a unified penalty structure',
          'Specify which penalty applies in different contexts',
          'Establish clear escalation procedures',
          'Add grace period definitions'
        ],
        conflictingText: [
          {
            document: documents[1]?.name || 'Course Syllabus',
            text: 'Late submissions will incur a 10% penalty per day',
            context: 'Assessment Policy: Daily penalty for late work'
          },
          {
            document: documents[2]?.name || 'Department Rules',
            text: 'Late assignments receive a flat 25% deduction regardless of delay duration',
            context: 'Academic Standards: Uniform late penalty across all courses'
          }
        ]
      },
      {
        id: '5',
        type: 'contradiction',
        severity: 'low',
        documents: [documents[0]?.name, documents[1]?.name].filter(Boolean),
        description: 'Minor discrepancy in office hours scheduling',
        suggestions: [
          'Synchronize office hour schedules across all documents',
          'Create a master schedule reference',
          'Add contact information for schedule updates',
          'Implement automatic schedule synchronization'
        ],
        conflictingText: [
          {
            document: documents[0]?.name || 'Faculty Handbook',
            text: 'Office hours: Monday-Wednesday 2:00-4:00 PM',
            context: 'Faculty Schedule: Regular consultation hours'
          },
          {
            document: documents[1]?.name || 'Student Guide',
            text: 'Professor available: Monday-Wednesday 2:00-3:30 PM',
            context: 'Contact Information: Student consultation times'
          }
        ]
      },
      {
        id: '6',
        type: 'inconsistency',
        severity: 'high',
        documents: [documents[1]?.name, documents[2]?.name].filter(Boolean),
        description: 'Critical inconsistency in grading scale definitions',
        suggestions: [
          'Establish institution-wide grading standards',
          'Create authoritative grading scale document',
          'Train faculty on consistent grading practices',
          'Implement grade standardization review process'
        ],
        conflictingText: [
          {
            document: documents[1]?.name || 'Course Catalog',
            text: 'A grade: 90-100%, B grade: 80-89%, C grade: 70-79%',
            context: 'Grading System: Standard percentage-based grading scale'
          },
          {
            document: documents[2]?.name || 'Assessment Guidelines',
            text: 'A grade: 85-100%, B grade: 75-84%, C grade: 65-74%',
            context: 'Evaluation Criteria: Alternative grading scale for assessments'
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