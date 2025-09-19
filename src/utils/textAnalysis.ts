// Text analysis utilities for finding contradictions in documents

export interface TextSegment {
  text: string;
  context: string;
  position: number;
}

export interface ContradictionMatch {
  document1: string;
  document2: string;
  text1: string;
  text2: string;
  context1: string;
  context2: string;
  type: 'contradiction' | 'overlap' | 'inconsistency';
  severity: 'high' | 'medium' | 'low';
  confidence: number;
}

// Keywords that often indicate conflicting information
const CONFLICT_INDICATORS = {
  time: ['deadline', 'due', 'submit', 'before', 'after', 'until', 'by', 'pm', 'am', 'midnight', 'noon'],
  dates: ['date', 'day', 'week', 'month', 'year', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  numbers: ['percent', '%', 'minimum', 'maximum', 'at least', 'no more than', 'exactly', 'approximately'],
  requirements: ['must', 'required', 'mandatory', 'optional', 'should', 'shall', 'need', 'necessary'],
  policies: ['policy', 'rule', 'regulation', 'guideline', 'procedure', 'process', 'standard'],
  penalties: ['penalty', 'fine', 'deduction', 'reduction', 'consequence', 'punishment'],
  attendance: ['attendance', 'present', 'absent', 'participate', 'attend'],
  notice: ['notice', 'notification', 'inform', 'alert', 'warning', 'advance'],
  grades: ['grade', 'score', 'mark', 'point', 'percentage', 'gpa', 'evaluation']
};

// Extract sentences containing potential conflict indicators
export function extractRelevantSentences(text: string, documentName: string): TextSegment[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const relevantSentences: TextSegment[] = [];

  sentences.forEach((sentence, index) => {
    const lowerSentence = sentence.toLowerCase();
    
    // Check if sentence contains conflict indicators
    const hasIndicators = Object.values(CONFLICT_INDICATORS).some(indicators =>
      indicators.some(indicator => lowerSentence.includes(indicator))
    );

    if (hasIndicators) {
      relevantSentences.push({
        text: sentence.trim(),
        context: `Sentence ${index + 1} in ${documentName}`,
        position: index
      });
    }
  });

  return relevantSentences;
}

// Find numerical contradictions (percentages, times, etc.)
export function findNumericalContradictions(segments1: TextSegment[], segments2: TextSegment[], doc1: string, doc2: string): ContradictionMatch[] {
  const contradictions: ContradictionMatch[] = [];

  segments1.forEach(seg1 => {
    segments2.forEach(seg2 => {
      // Extract numbers and percentages
      const numbers1 = extractNumbers(seg1.text);
      const numbers2 = extractNumbers(seg2.text);

      if (numbers1.length > 0 && numbers2.length > 0) {
        // Check for similar context but different numbers
        const similarity = calculateContextSimilarity(seg1.text, seg2.text);
        
        if (similarity > 0.3) { // Similar context
          numbers1.forEach(num1 => {
            numbers2.forEach(num2 => {
              if (Math.abs(num1.value - num2.value) > 0.1) { // Different values
                contradictions.push({
                  document1: doc1,
                  document2: doc2,
                  text1: seg1.text,
                  text2: seg2.text,
                  context1: seg1.context,
                  context2: seg2.context,
                  type: 'contradiction',
                  severity: Math.abs(num1.value - num2.value) > 20 ? 'high' : 'medium',
                  confidence: similarity
                });
              }
            });
          });
        }
      }
    });
  });

  return contradictions;
}

// Find time-related contradictions
export function findTimeContradictions(segments1: TextSegment[], segments2: TextSegment[], doc1: string, doc2: string): ContradictionMatch[] {
  const contradictions: ContradictionMatch[] = [];

  segments1.forEach(seg1 => {
    segments2.forEach(seg2 => {
      const times1 = extractTimes(seg1.text);
      const times2 = extractTimes(seg2.text);

      if (times1.length > 0 && times2.length > 0) {
        const similarity = calculateContextSimilarity(seg1.text, seg2.text);
        
        if (similarity > 0.2) {
          times1.forEach(time1 => {
            times2.forEach(time2 => {
              if (time1 !== time2) {
                contradictions.push({
                  document1: doc1,
                  document2: doc2,
                  text1: seg1.text,
                  text2: seg2.text,
                  context1: seg1.context,
                  context2: seg2.context,
                  type: 'contradiction',
                  severity: 'high',
                  confidence: similarity
                });
              }
            });
          });
        }
      }
    });
  });

  return contradictions;
}

// Find policy contradictions using keyword matching
export function findPolicyContradictions(segments1: TextSegment[], segments2: TextSegment[], doc1: string, doc2: string): ContradictionMatch[] {
  const contradictions: ContradictionMatch[] = [];

  segments1.forEach(seg1 => {
    segments2.forEach(seg2 => {
      // Look for opposing keywords
      const hasOpposingTerms = checkOpposingTerms(seg1.text, seg2.text);
      const similarity = calculateContextSimilarity(seg1.text, seg2.text);

      if (hasOpposingTerms && similarity > 0.2) {
        contradictions.push({
          document1: doc1,
          document2: doc2,
          text1: seg1.text,
          text2: seg2.text,
          context1: seg1.context,
          context2: seg2.context,
          type: 'contradiction',
          severity: 'medium',
          confidence: similarity
        });
      }
    });
  });

  return contradictions;
}

// Helper functions
function extractNumbers(text: string): { value: number; unit: string }[] {
  const numbers: { value: number; unit: string }[] = [];
  
  // Match percentages
  const percentMatches = text.match(/(\d+(?:\.\d+)?)\s*%/g);
  if (percentMatches) {
    percentMatches.forEach(match => {
      const value = parseFloat(match.replace('%', ''));
      numbers.push({ value, unit: '%' });
    });
  }

  // Match other numbers with common units
  const numberMatches = text.match(/(\d+(?:\.\d+)?)\s*(days?|weeks?|months?|hours?|minutes?)/gi);
  if (numberMatches) {
    numberMatches.forEach(match => {
      const parts = match.match(/(\d+(?:\.\d+)?)\s*(.+)/);
      if (parts) {
        numbers.push({ value: parseFloat(parts[1]), unit: parts[2] });
      }
    });
  }

  return numbers;
}

function extractTimes(text: string): string[] {
  const times: string[] = [];
  
  // Match time patterns like "10:00 PM", "midnight", "noon"
  const timePatterns = [
    /\d{1,2}:\d{2}\s*(AM|PM|am|pm)/g,
    /\d{1,2}\s*(AM|PM|am|pm)/g,
    /midnight/gi,
    /noon/gi
  ];

  timePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      times.push(...matches);
    }
  });

  return times;
}

function calculateContextSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const commonWords = words1.filter(word => 
    words2.includes(word) && word.length > 3
  );
  
  return commonWords.length / Math.max(words1.length, words2.length);
}

function checkOpposingTerms(text1: string, text2: string): boolean {
  const opposingPairs = [
    ['required', 'optional'],
    ['mandatory', 'voluntary'],
    ['must', 'may'],
    ['shall', 'should'],
    ['minimum', 'maximum'],
    ['before', 'after'],
    ['early', 'late'],
    ['allowed', 'prohibited'],
    ['permitted', 'forbidden']
  ];

  return opposingPairs.some(([term1, term2]) => {
    const hasFirst = text1.toLowerCase().includes(term1) && text2.toLowerCase().includes(term2);
    const hasSecond = text1.toLowerCase().includes(term2) && text2.toLowerCase().includes(term1);
    return hasFirst || hasSecond;
  });
}

// Main analysis function
export function analyzeDocumentsForContradictions(documents: { name: string; content: string }[]): ContradictionMatch[] {
  if (documents.length < 2) return [];

  const allContradictions: ContradictionMatch[] = [];

  // Compare each pair of documents
  for (let i = 0; i < documents.length; i++) {
    for (let j = i + 1; j < documents.length; j++) {
      const doc1 = documents[i];
      const doc2 = documents[j];

      const segments1 = extractRelevantSentences(doc1.content, doc1.name);
      const segments2 = extractRelevantSentences(doc2.content, doc2.name);

      // Find different types of contradictions
      const numericalContradictions = findNumericalContradictions(segments1, segments2, doc1.name, doc2.name);
      const timeContradictions = findTimeContradictions(segments1, segments2, doc1.name, doc2.name);
      const policyContradictions = findPolicyContradictions(segments1, segments2, doc1.name, doc2.name);

      allContradictions.push(...numericalContradictions, ...timeContradictions, ...policyContradictions);
    }
  }

  // Remove duplicates and sort by confidence
  const uniqueContradictions = allContradictions
    .filter((contradiction, index, array) => 
      array.findIndex(c => 
        c.text1 === contradiction.text1 && c.text2 === contradiction.text2
      ) === index
    )
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10); // Limit to top 10 most confident matches

  return uniqueContradictions;
}