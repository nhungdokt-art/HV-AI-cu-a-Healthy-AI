import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Role, Message } from '../types';
import { User, Bot, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm 
          ${isUser ? 'bg-indigo-600 text-white' : 'bg-primary-600 text-white'}`}>
          {isUser ? <User size={18} /> : <Bot size={20} />}
        </div>

        {/* Message Bubble */}
        <div
          className={`relative px-4 py-3 md:px-6 md:py-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm
            ${isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-slate-200'
            }
            ${message.isError ? 'border-red-300 bg-red-50 text-red-800' : ''}
          `}
        >
          {message.isError ? (
             <div className="flex items-center gap-2">
               <AlertCircle size={16} />
               <span>{message.text}</span>
             </div>
          ) : (
            <div className={`markdown-content ${isUser ? 'prose-invert' : 'prose-slate'}`}>
              <ReactMarkdown
                components={{
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-lg font-bold my-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-base font-bold my-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-sm font-bold my-1" {...props} />,
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                  a: ({node, ...props}) => <a className="underline hover:opacity-80" target="_blank" rel="noopener noreferrer" {...props} />,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
