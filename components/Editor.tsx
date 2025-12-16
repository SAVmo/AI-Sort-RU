import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { ChatMessage } from './ChatMessage';
import { ChatMessage as ChatMessageType } from '../types';
import { generateImageContent } from '../services/geminiService';

interface EditorProps {
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Привет! Я помогу создать дизайн вашего сайта. Опишите, что вы хотите увидеть (например: "Лендинг для кофейни в темных тонах").',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Add user message
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);

    try {
      // Pass the current image (if any) to the service for context/editing
      const response = await generateImageContent(userText, currentImage || undefined);

      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || (response.image ? "Готово! Вот результат." : "Хм, я не смог ничего сгенерировать."),
        image: response.image,
        timestamp: Date.now()
      };

      if (response.image) {
        setCurrentImage(response.image);
      }

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Произошла ошибка при генерации. Пожалуйста, попробуйте еще раз.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `generated-design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-slate-900 overflow-hidden">
      
      {/* Left Panel: Chat (35%) */}
      <div className="w-full md:w-[400px] flex flex-col border-r border-slate-800 bg-slate-900 h-[50vh] md:h-full">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm z-10">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Назад"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <span className="font-semibold text-slate-200">Редактор</span>
          <div className="w-9 h-9"></div> {/* Spacer for alignment */}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Опишите изменения..."
              className="w-full bg-slate-800 text-white placeholder-slate-500 border border-slate-700 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 top-2 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z"/>
                  <path d="M22 2 11 13"/>
                </svg>
              )}
            </button>
          </form>
          <div className="text-xs text-slate-500 mt-2 text-center">
            Используется Gemini 2.5 Flash Image
          </div>
        </div>
      </div>

      {/* Right Panel: Preview (65%) */}
      <div className="flex-1 bg-slate-950 flex flex-col h-[50vh] md:h-full relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
        
        {/* Toolbar */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
            {currentImage && (
                <Button variant="secondary" onClick={downloadImage} className="shadow-lg backdrop-blur-md bg-slate-800/80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                    Скачать
                </Button>
            )}
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
            {currentImage ? (
                <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-700 max-h-full max-w-full group">
                    <img 
                        src={currentImage} 
                        alt="Generated Result" 
                        className="max-h-[calc(100vh-64px)] w-auto object-contain bg-white"
                    />
                    {isLoading && (
                         <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
                             <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                                <span className="text-white font-medium">Обновление...</span>
                             </div>
                         </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-2xl p-12 w-full max-w-md bg-slate-900/50 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                            <circle cx="9" cy="9" r="2"/>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-400 mb-2">Здесь появится ваш дизайн</h3>
                    <p className="text-center text-sm text-slate-500">
                        Отправьте сообщение в чат, чтобы сгенерировать первое изображение сайта.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};