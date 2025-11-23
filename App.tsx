import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { v4 as uuidv4 } from 'uuid';
import { Message, Role } from './types';
import { createChatSession, sendMessageStream } from './services/geminiService';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { DisclaimerModal } from './components/DisclaimerModal';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: Role.MODEL,
      text: "Xin chào! Mình là HV AI 👋. \n\nMình có thể giúp gì cho sức khỏe của bạn hôm nay? Bạn có thể hỏi mình về dinh dưỡng, bài tập, hoặc các triệu chứng thông thường.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    try {
      chatSessionRef.current = createChatSession();
    } catch (error) {
      console.error("Failed to initialize chat session", error);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!chatSessionRef.current) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: Role.USER,
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Create a placeholder for the AI response
    const botMessageId = uuidv4();
    const botMessagePlaceholder: Message = {
      id: botMessageId,
      role: Role.MODEL,
      text: '', // Start empty
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessagePlaceholder]);

    try {
      const stream = await sendMessageStream(chatSessionRef.current, text);
      
      let fullText = '';
      
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: fullText } 
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Error receiving message:", error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, text: "Xin lỗi, đã có lỗi xảy ra khi kết nối. Vui lòng thử lại sau.", isError: true } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <DisclaimerModal />
      
      <main className="flex-1 overflow-y-auto bg-slate-50 relative scroll-smooth">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 min-h-full flex flex-col justify-end">
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center text-slate-400 py-20">
                <Loader2 size={40} className="animate-spin mb-4 text-primary-300" />
                <p>Đang khởi tạo HV AI...</p>
             </div>
          )}
          
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </>
  );
};

export default App;
