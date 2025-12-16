import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-indigo-600 text-white rounded-tr-sm' 
            : 'bg-slate-700 text-slate-100 rounded-tl-sm'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.text || (message.image ? "Изображение создано." : "...")}
        </div>
        
        {/* Timestamp */}
        <div className={`text-[10px] mt-1 opacity-60 ${isUser ? 'text-indigo-200' : 'text-slate-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};