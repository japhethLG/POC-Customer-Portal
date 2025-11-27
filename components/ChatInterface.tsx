import React, { useState, useEffect, useRef } from 'react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { createBookingChatSession, sendMessageStream } from '../services/gemini';
import { Booking, Message } from '../types';

interface ChatInterfaceProps {
  booking: Booking;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ booking }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'sys-1',
      text: 'October 25, 2023',
      sender: 'system',
      timestamp: new Date('2023-10-25T00:00:00')
    },
    {
      id: 'tech-1',
      text: "Hi there! This is John, your technician. I'm on my way and expect to arrive in about 15 minutes.",
      sender: 'technician',
      timestamp: new Date('2023-10-25T13:45:00')
    },
    {
      id: 'usr-1',
      text: "Great, thanks for the update! See you soon.",
      sender: 'user',
      timestamp: new Date('2023-10-25T13:46:00')
    },
    {
      id: 'sys-2',
      text: "Job status updated to In Progress",
      sender: 'system',
      timestamp: new Date('2023-10-25T13:50:00')
    },
    {
      id: 'ai-intro',
      text: "Hello! I'm the automated support assistant. How can I help you with this booking today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session
  useEffect(() => {
    chatSessionRef.current = createBookingChatSession(booking);
  }, [booking]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending || !chatSessionRef.current) return;

    const userText = inputValue;
    setInputValue('');
    setIsSending(true);

    // Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      // Create a placeholder for AI response
      const aiMsgId = (Date.now() + 1).toString();
      setMessages(prev => [
        ...prev,
        {
          id: aiMsgId,
          text: '',
          sender: 'ai',
          timestamp: new Date(),
          isTyping: true
        }
      ]);

      const stream = await sendMessageStream(chatSessionRef.current, userText);
      
      let fullText = '';
      
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMsgId 
                ? { ...msg, text: fullText, isTyping: false } 
                : msg
            )
          );
        }
      }
      
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "I'm having trouble connecting to the support system right now. Please try again later.",
          sender: 'system',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-background-dark/80 rounded-xl shadow-sm h-[80vh] flex flex-col border border-border-light dark:border-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-border-light dark:border-gray-800">
        <h3 className="text-lg font-bold text-[#111818] dark:text-white">Communication Hub</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFA] dark:bg-[#102222]">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 justify-center">
                 {msg.text.includes('updated') ? (
                    <>
                       <hr className="flex-grow border-gray-200 dark:border-gray-700" />
                       <span>{msg.text}</span>
                       <hr className="flex-grow border-gray-200 dark:border-gray-700" />
                    </>
                 ) : (
                    <div className="text-center text-xs text-gray-400">{msg.text}</div>
                 )}
              </div>
            );
          }

          const isUser = msg.sender === 'user';
          const isTech = msg.sender === 'technician';

          return (
            <div key={msg.id} className={`flex gap-3 ${isUser ? 'justify-end' : ''}`}>
              {!isUser && (
                <div 
                  className="shrink-0 bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 border border-gray-200 dark:border-gray-700" 
                  style={{ backgroundImage: isTech ? `url("${booking.technician.avatar}")` : 'none' }}
                >
                    {!isTech && (
                        <div className="w-full h-full flex items-center justify-center bg-teal-accent rounded-full text-white">
                            <span className="material-symbols-outlined text-sm">smart_toy</span>
                        </div>
                    )}
                </div>
              )}
              
              <div>
                <div 
                  className={`p-3 rounded-lg max-w-md shadow-sm ${
                    isUser 
                      ? 'bg-teal-accent text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 text-text-dark dark:text-text-light rounded-tl-none border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  {msg.isTyping && (
                      <span className="inline-flex mt-1 space-x-1 animate-pulse">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                      </span>
                  )}
                </div>
                <p className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}>
                  {isUser ? 'You' : (isTech ? booking.technician.name : 'Support Assistant')} - {formatTime(msg.timestamp)}
                </p>
              </div>

              {isUser && (
                <div 
                  className="shrink-0 bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" 
                  style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuALHJUV4s8yt5PjxCOAF5DCW5DRLajOpSViQ2k68hMtLgarXcbXdSwEN-dmSTMArzLtmzn5WzGoMMJOKVrv8Cl1mfK3z-iK10VCKgTDwj7YcP7slA2Yh7185Z2p2YcqvyIqniOoatG6s3A3ep6dN4fYMeBsPw8j1kmQrKMGrGXn2jrq9CEX-MiGkiWzxKcUIpZQwn79BiU1DTCHhiIMlIHgjrV-pf-295JoMI0xMDG92wEWsce0uV6imWnAQXjZswyuHqpvCJT6Fw")` }}
                ></div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border-light dark:border-gray-800 mt-auto bg-white dark:bg-background-dark/80 rounded-b-xl">
        <div className="flex items-center gap-4">
          <input
            className="flex-1 bg-neutral-secondary dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-teal-accent text-sm dark:text-white h-10 px-4 placeholder:text-gray-400"
            placeholder="Type your message here..."
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isSending}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isSending || !inputValue.trim()}
            className={`flex items-center justify-center size-10 rounded-lg text-white shrink-0 transition-all ${
                isSending || !inputValue.trim() ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-teal-accent hover:bg-teal-accent/90 shadow-md hover:shadow-lg'
            }`}
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;