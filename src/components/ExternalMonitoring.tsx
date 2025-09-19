import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { ExternalSource, Conflict } from '../types';

export const ExternalMonitoring: React.FC = () => {
  const [sources, setSources] = useState<ExternalSource[]>([
    {
      id: '1',
      name: 'College Policy Page',
      url: 'https://college.edu/policies',
      lastChecked: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      hasUpdates: true,
      conflicts: [
        {
          id: 'ext-1',
          type: 'contradiction',
          severity: 'high',
          documents: ['College Policy Page', 'Student Handbook'],
          description: 'New policy contradicts existing attendance requirements',
          suggestions: [
            'Review updated attendance policy',
            'Update student handbook to match',
            'Notify affected students'
          ],
          conflictingText: [
            {
              document: 'College Policy Page',
              text: 'minimum 80% attendance required',
              context: 'Updated policy effective immediately'
            },
            {
              document: 'Student Handbook',
              text: 'minimum 75% attendance required',
              context: 'Current handbook version'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'HR Policy Portal',
      url: 'https://company.com/hr-policies',
      lastChecked: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      hasUpdates: false,
    }
  ]);

  const [monitoring, setMonitoring] = useState(false);

  const checkForUpdates = async (sourceId: string) => {
    setMonitoring(true);
    
    // Simulate checking for updates
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, lastChecked: new Date(), hasUpdates: Math.random() > 0.5 }
        : source
    ));
    
    setMonitoring(false);
  };

  const addSource = () => {
    const newSource: ExternalSource = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New External Source',
      url: 'https://example.com/policies',
      lastChecked: new Date(),
      hasUpdates: false,
    };
    setSources(prev => [...prev, newSource]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">External Document Monitoring</h3>
            <p className="text-sm text-gray-600 mt-1">
              Monitor external policy pages and documents for updates that may conflict with your documents
            </p>
          </div>
          <button
            onClick={addSource}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Source
          </button>
        </div>

        <div className="space-y-4">
          {sources.map((source) => (
            <div key={source.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">{source.name}</h4>
                    <p className="text-sm text-gray-500">{source.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {source.hasUpdates ? (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Updates Found</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Up to Date</span>
                    </div>
                  )}
                  <button
                    onClick={() => checkForUpdates(source.id)}
                    disabled={monitoring}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-4 w-4 ${monitoring ? 'animate-spin' : ''}`} />
                  </button>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Last checked: {source.lastChecked.toLocaleString()}</span>
              </div>

              {source.hasUpdates && source.conflicts && source.conflicts.length > 0 && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h5 className="font-medium text-amber-800 mb-2">Conflicts Detected:</h5>
                  {source.conflicts.map((conflict, index) => (
                    <div key={index} className="text-sm text-amber-700">
                      <p className="font-medium">{conflict.description}</p>
                      <p className="mt-1">Severity: <span className="capitalize font-medium">{conflict.severity}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Monitoring Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Automatic daily checks for external document updates</li>
            <li>• Real-time conflict detection when changes are found</li>
            <li>• Email notifications for critical conflicts (High priority)</li>
            <li>• Integration with your existing document analysis pipeline</li>
          </ul>
        </div>
      </div>
    </div>
  );
};