import React, { useState } from 'react';
import FileUpload from './FileUpload';
import AnalysisDashboard from './AnalysisDashboard';
import { analyzeResume } from '../services/geminiService';
import { AnalysisResult, AnalysisState } from '../types';

const Home: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [status, setStatus] = useState<AnalysisState>(AnalysisState.IDLE);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    );
};

export default Home;
