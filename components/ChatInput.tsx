import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-20 pb-safe">
      <div className="max-w-4xl mx-auto relative">
        <form 
          onSubmit={handleSubmit}
          className={`flex items-end gap-2 bg-slate-100 border border-slate-300 rounded-3xl px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-primary-400 focus-within:bg-white focus-within:border-primary-400 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi HV AI về sức khỏe của bạn..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none resize-none py-3 max-h-32 text-slate-800 placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className={`mb-1.5 p-2 rounded-full flex-shrink-0 transition-all duration-200 
              ${text.trim() && !isLoading
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="ml-0.5" />}
          </button>
        </form>
        <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">
                HV AI có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.
            </p>
        </div>
      </div>
    </div>
  );
};
