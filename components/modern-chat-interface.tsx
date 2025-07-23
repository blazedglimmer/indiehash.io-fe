'use client';

import { useState, useEffect, useRef } from 'react';
import { Chat, Message } from '@/types';
import { updateChat } from '@/utils/storage';
import { queryEnhanced, getMockResponse, EnhancedQueryData } from '@/utils/api';
import {
  Send,
  Sparkles,
  Brain,
  Zap,
  Globe,
  BookOpen,
  Code,
  Lightbulb,
  TrendingUp,
  Clock,
  Tag,
  Copy,
  Check,
} from 'lucide-react';

interface ModernChatInterfaceProps {
  chat: Chat | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

const predefinedPrompts = [
  {
    icon: Code,
    text: 'Best resources to learn Rust programming?',
    category: 'Programming',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Brain,
    text: 'How to get started with machine learning?',
    category: 'AI/ML',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Globe,
    text: 'Modern web development frameworks?',
    category: 'Web Dev',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BookOpen,
    text: 'Best practices for system design?',
    category: 'Architecture',
    gradient: 'from-green-500 to-emerald-500',
  },
];

const sourceCategories = [
  { label: 'IndieHash AI', icon: Sparkles, active: true },
  { label: 'Resources', icon: BookOpen, active: false },
  { label: 'Trending', icon: TrendingUp, active: false },
  { label: 'Community', icon: Globe, active: false },
];

export default function ModernChatInterface({
  chat,
  setChats,
}: ModernChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chat]);

  const handleSendMessage = async (messageText: string) => {
    if (!chat || !messageText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    const updatedChat: Chat = {
      ...chat,
      messages: [...chat.messages, userMessage],
      title:
        chat.title ||
        messageText.substring(0, 50) + (messageText.length > 50 ? '...' : ''),
    };

    updateChat(updatedChat);
    setChats(prevChats =>
      prevChats.map(c => (c.id === chat.id ? updatedChat : c))
    );

    setLoading(true);
    setMessage('');

    try {
      // Try to use real API, fallback to mock
      let response;
      try {
        response = await queryEnhanced({ question: messageText, limit: 3 });
      } catch (error) {
        console.warn('API call failed, using mock response:', error);
        response = getMockResponse(messageText);
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: JSON.stringify(response.data),
        timestamp: new Date().toISOString(),
      };

      const finalChat: Chat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMessage],
      };

      updateChat(finalChat);
      setChats(prevChats =>
        prevChats.map(c => (c.id === chat.id ? finalChat : c))
      );
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error state
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !loading) {
      handleSendMessage(message);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const renderAssistantMessage = (content: string) => {
    try {
      const data: EnhancedQueryData = JSON.parse(content);

      return (
        <div className="w-full max-w-4xl mx-auto">
          <div className="card-modern p-8 mb-6">
            {/* Source Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {sourceCategories.map((source, idx) => (
                <button
                  key={source.label}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === idx
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'glass text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <source.icon className="w-4 h-4" />
                  {source.label}
                </button>
              ))}
            </div>

            {/* Summary Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Summary</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">{data.summary}</p>
            </div>

            {/* Similar Results */}
            {data.similar_results && data.similar_results.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Related Results
                  </h3>
                </div>
                <div className="grid gap-4">
                  {data.similar_results.map((result, idx) => (
                    <div key={result.id} className="glass-dark p-4 rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                            {idx + 1}
                          </div>
                          <span className="text-sm text-gray-400">
                            {result.relevance_percent.toFixed(1)}% match
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {result.processing_time_ms}ms
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-200 mb-3">{result.text}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {result.metadata.tags.map(tag => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(result.text, result.id)
                          }
                          className="p-1 rounded hover:bg-white/10 transition-colors"
                        >
                          {copiedId === result.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enriched Content */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">
                  Detailed Guide
                </h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {data.enriched_content}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
              <span>Request ID: {data.request_id}</span>
              <span>{data.total_results} results processed</span>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="card-modern p-6">
          <p className="text-gray-300">{content}</p>
        </div>
      );
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-400 mb-2">
            No chat selected
          </h2>
          <p className="text-gray-500">
            Select a chat or create a new one to get started
          </p>
        </div>
      </div>
    );
  }

  const lastUserMessage = [...chat.messages]
    .reverse()
    .find(m => m.role === 'user');
  const lastAssistantMessage = [...chat.messages]
    .reverse()
    .find(m => m.role === 'assistant');

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {chat.messages.length === 0 ? (
          /* Welcome Screen */
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center mb-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6 float pulse-glow">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-4">
                Welcome to IndieHash AI
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Your intelligent assistant for discovering resources, learning
                new skills, and exploring ideas. Ask me anything!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
              {predefinedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptSelect(prompt.text)}
                  disabled={loading}
                  className="group card-modern p-6 text-left hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${prompt.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <prompt.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">
                        {prompt.category}
                      </div>
                      <div className="text-white font-medium group-hover:text-indigo-300 transition-colors">
                        {prompt.text}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="p-6 space-y-8">
            {lastUserMessage && (
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  {lastUserMessage.content}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
              </div>
            )}

            {lastAssistantMessage &&
              renderAssistantMessage(lastAssistantMessage.content)}

            {loading && (
              <div className="w-full max-w-4xl mx-auto">
                <div className="card-modern p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <span className="text-white font-medium">
                      AI is thinking<span className="loading-dots"></span>
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 shimmer rounded-lg"></div>
                    <div className="h-4 shimmer rounded-lg w-3/4"></div>
                    <div className="h-4 shimmer rounded-lg w-1/2"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-gray-900/50 backdrop-blur-xl p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
              className="input-modern w-full py-4 px-6 pr-14 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </form>
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Powered by IndieHash AI • Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
