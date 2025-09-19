import React, { useCallback } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Document } from '../types';

interface DocumentUploadProps {
  documents: Document[];
  onAddDocument: (file: File) => Promise<Document>;
  onRemoveDocument: (id: string) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documents,
  onAddDocument,
  onRemoveDocument,
}) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        onAddDocument(file);
      }
    });
  }, [onAddDocument]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => onAddDocument(file));
  }, [onAddDocument]);

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-blue-50/50"
      >
        <Upload className="mx-auto h-12 w-12 text-blue-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop documents here or click to upload
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Support for TXT, PDF, and DOCX files (up to 3 documents)
        </p>
        <input
          type="file"
          multiple
          accept=".txt,.pdf,.docx"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Select Files
        </label>
      </div>

      {documents.length >= 3 && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            Maximum of 3 documents can be analyzed at once for optimal performance.
          </p>
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Uploaded Documents</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {(doc.size / 1024).toFixed(1)} KB • Uploaded {doc.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveDocument(doc.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};