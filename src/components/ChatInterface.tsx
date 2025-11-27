'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Booking, Message } from '@/types';
import { apiClient } from '@/lib/api';

interface ChatInterfaceProps {
  booking: Booking;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ booking }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages when component mounts
  useEffect(() => {
    fetchMessages();
  }, [booking.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getMessages(booking.id);
      
      if (response.success) {
        const transformed = response.data.map((msg: any) => ({
          id: msg.id,
          text: msg.message,
          sender: msg.senderType === 'customer' ? 'user' : 'system',
          timestamp: new Date(msg.createdAt)
        }));
        setMessages(transformed);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const userText = inputValue;
    setInputValue('');
    setIsSending(true);

    // Optimistically add user message
    const tempMsg: Message = {
      id: 'temp-' + Date.now(),
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const response = await apiClient.sendMessage(booking.id, userText);
      
      if (response.success) {
        // Replace temp message with real one
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMsg.id 
              ? {
                  id: response.data.id,
                  text: response.data.message,
                  sender: 'user',
                  timestamp: new Date(response.data.createdAt)
                }
              : msg
          )
        );
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMsg.id));
      
      // Show error message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Failed to send message. Please try again.",
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
        <h3 className="text-lg font-bold text-[#111818] dark:text-white">Messages</h3>
        <p className="text-xs text-gray-500 mt-1">Chat about this booking</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFA] dark:bg-[#102222]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-accent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400 text-sm">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg) => {
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
                <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                  <span className="material-symbols-outlined text-sm">support_agent</span>
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
                </div>
                <p className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : ''}`}>
                  {isUser ? 'You' : 'System'} - {formatTime(msg.timestamp)}
                </p>
              </div>

              {isUser && (
                <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-teal-accent rounded-full text-white">
                  <span className="material-symbols-outlined text-sm">person</span>
                </div>
              )}
            </div>
          );
        }))}
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

