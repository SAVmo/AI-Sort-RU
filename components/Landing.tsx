import React from 'react';
import { Button } from './Button';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="z-10 text-center max-w-2xl px-6">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          AI Web <span className="text-indigo-400">Visualizer</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
          Создавайте и редактируйте дизайн веб-сайтов с помощью диалога. 
          Просто опишите, что вы хотите увидеть, или попросите изменить детали.
          <br/>
          <span className="text-sm text-slate-500 mt-2 block">(Powered by Gemini 2.5 Flash Image)</span>
        </p>

        <Button 
          onClick={onStart} 
          className="mx-auto text-lg px-8 py-4 shadow-indigo-500/50"
        >
          Начать
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </Button>
      </div>
    </div>
  );
};