import React, { ChangeEvent, useRef } from 'react';
import { ICONS, MAX_FILE_SIZE_MB, ALLOWED_TYPES } from '../constants';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic Validation
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB`);
        return;
      }
      
      if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
        alert('Please upload a PDF or DOCX file.');
        return;
      }

      onFileSelect(file);
    }
  };

  const handleDivClick = () => {
    if (!isLoading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        onClick={handleDivClick}
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer
          ${isLoading ? 'border-slate-300 bg-slate-50 opacity-75 cursor-wait' : 'border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400'}
        `}
      >
        <input 
          type="file" 
          ref={inputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.doc,text/plain"
          className="hidden" 
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isLoading ? 'bg-slate-200' : 'bg-blue-100 text-blue-600'}`}>
            {isLoading ? (
               <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            ) : (
              <ICONS.Upload />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-700">
              {isLoading ? "Analyzing Resume..." : "Upload your Resume"}
            </h3>
            <p className="text-sm text-slate-500">
              {isLoading ? "This may take 10-20 seconds." : "PDF or DOCX (Max 5MB)"}
            </p>
          </div>

          {!isLoading && (
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
              Select File
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400">
          We process files securely. No data is stored after the session.
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
