import { useState, useEffect, useRef } from 'react';
import ChatInput from './chatInput';
import ChatMessage from './ChatMessage';
import { updateChat } from '@/utils/storage';
import { Chat, Message } from '@/types';

interface ChatInterfaceProps {
  chat: Chat | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

export default function ChatInterface({ chat, setChats }: ChatInterfaceProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);
  
  const handleSendMessage = async (message: string) => {
    if (!chat || !message.trim()) return;
    
    // Update chat with user message
    const userMessage: Message = {
      role: 'user',
      content: message, 
      timestamp: new Date().toISOString()
    };
    
    const updatedChat: Chat = {
      ...chat,
      messages: [...chat.messages, userMessage]
    };
    
    // Set title from first message if not set
    if (!chat.title && chat.messages.length === 0) {
      updatedChat.title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
    }
    
    // Update in localStorage and state
    updateChat(updatedChat);
    setChats(prevChats => 
      prevChats.map(c => c.id === chat.id ? updatedChat : c)
    );
    
    // Show loading state
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: `Here's a great video: https://www.youtube.com/watch?v=dQw4w9WgXcQ\nCheck it out!`,
        timestamp: new Date().toISOString()
      };
      
      const finalChat: Chat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiResponse]
      };
      
      // Update in localStorage and state
      updateChat(finalChat);
      setChats(prevChats => 
        prevChats.map(c => c.id === chat.id ? finalChat : c)
      );
      
      setLoading(false);
    }, 2000); // Increased delay to 2 seconds to better show the skeleton
  };
  
  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a chat or create a new one</p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {chat.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-light rounded-full mb-4 flex items-center justify-center text-gray-900">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Hi, I'm IndieChat.</h2>
            <p className="text-gray-400">How can I help you today?</p>
          </div>
        ) : (
          <>
            {chat.messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {loading && (
              <div className="flex mb-4 justify-start">
                <div className="max-w-3/4">
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary-light rounded-full mr-2 flex items-center justify-center text-xs text-gray-900">
                      AI
                    </div>
                    <span className="text-xs text-gray-400">Thinking...</span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
                      <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-700 p-4">
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
}