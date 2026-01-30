import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import { analyzeResume } from './services/geminiService';
import { AnalysisResult, AnalysisState } from './types';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [status, setStatus] = useState<AnalysisState>(AnalysisState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'APP' | 'LOGIN' | 'SIGNUP'>('APP');

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus(AnalysisState.ANALYZING);
    setErrorMessage(null);

    try {
      const result = await analyzeResume(selectedFile);
      setAnalysisResult(result);
      setStatus(AnalysisState.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(AnalysisState.ERROR);
      setErrorMessage(error.message || "Failed to analyze resume. Please try again.");
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysisResult(null);
    setStatus(AnalysisState.IDLE);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setCurrentView('APP')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ATS <span className="text-blue-600">Checker</span></h1>
          </div>
          <nav className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
              <a href="#" className="hover:text-blue-600 transition-colors">ATS Guide</a>
            </div>
            <div className="flex items-center space-x-3 ml-4 border-l border-slate-200 pl-6">
              {(currentView === 'LOGIN' || currentView === 'APP' || currentView === 'SIGNUP') && currentView !== 'LOGIN' && (
                <button
                  onClick={() => setCurrentView('LOGIN')}
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
                >
                  Log in
                </button>
              )}
              {currentView !== 'SIGNUP' && (
                <button
                  onClick={() => setCurrentView('SIGNUP')}
                  className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                >
                  Sign Up
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {currentView === 'LOGIN' && (
            <Login
              onNavigate={setCurrentView}
              onLoginSuccess={() => setCurrentView('APP')}
            />
          )}

          {currentView === 'SIGNUP' && (
            <Signup
              onNavigate={setCurrentView}
              onSignupSuccess={() => setCurrentView('APP')}
            />
          )}

          {currentView === 'APP' && (
            <>
              {status === AnalysisState.IDLE && (
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100">
                      Free Student Tool
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                      Will your resume pass the <span className="text-blue-600">Robot?</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      Upload your resume to see your ATS Score. Get instant, explainable feedback on formatting, keywords, and structure to help you land the interview.
                    </p>
                  </div>
                  <FileUpload onFileSelect={handleFileSelect} isLoading={false} />
                </div>
              )}

              {status === AnalysisState.ANALYZING && (
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                  <FileUpload onFileSelect={() => { }} isLoading={true} />
                </div>
              )}

              {status === AnalysisState.ERROR && (
                <div className="max-w-lg mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
                  <div className="text-red-500 mb-4 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-red-800 mb-2">Analysis Failed</h3>
                  <p className="text-red-600 mb-6">{errorMessage}</p>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {status === AnalysisState.SUCCESS && analysisResult && file && (
                <AnalysisDashboard
                  result={analysisResult}
                  onReset={handleReset}
                  fileName={file.name}
                />
              )}
            </>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            This tool is for educational purposes only. ATS algorithms vary by company.
            <br />
            Powered by Google Gemini. No personal data is stored.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
