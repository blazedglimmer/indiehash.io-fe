'use client';

import { useState, useEffect, useRef } from 'react';
import { Chat, Message } from '@/types';
import { updateChat } from '@/utils/storage';
import {
  queryEnhanced,
  getMockResponse,
  EnhancedQueryData,
  getLandingPageData,
  getMockLandingPageData,
  LandingPageData,
} from '@/utils/api';
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
  Star,
  Database,
  Activity,
} from 'lucide-react';

interface ModernChatInterfaceProps {
  chat: Chat | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

// Icon mapping for categories
const categoryIcons: { [key: string]: any } = {
  Programming: Code,
  Travel: Globe,
  Lifestyle: Sparkles,
  Business: TrendingUp,
  'AI/ML': Brain,
  'Web Dev': Globe,
  Architecture: BookOpen,
};

// Gradient mapping for categories
const categoryGradients: { [key: string]: string } = {
  Programming: 'from-orange-500 to-red-500',
  Travel: 'from-blue-500 to-cyan-500',
  Lifestyle: 'from-purple-500 to-pink-500',
  Business: 'from-green-500 to-emerald-500',
  'AI/ML': 'from-indigo-500 to-purple-500',
  'Web Dev': 'from-teal-500 to-blue-500',
  Architecture: 'from-amber-500 to-orange-500',
};

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
  const [landingData, setLandingData] = useState<LandingPageData | null>(null);
  const [loadingLandingData, setLoadingLandingData] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load landing page data on component mount
  useEffect(() => {
    const loadLandingData = async () => {
      try {
        setLoadingLandingData(true);
        let response;
        try {
          response = await getLandingPageData();
        } catch (error) {
          console.warn('API call failed, using mock data:', error);
          response = getMockLandingPageData();
        }
        setLandingData(response.data);
        // Set first category as default
        if (response.data.quick_start_questions.length > 0) {
          setSelectedCategory(
            response.data.quick_start_questions[0]?.category || ''
          );
        }
      } catch (error) {
        console.error('Error loading landing data:', error);
        // Fallback to mock data
        const mockData = getMockLandingPageData();
        setLandingData(mockData.data);
        if (mockData.data.quick_start_questions.length > 0) {
          setSelectedCategory(
            mockData.data.quick_start_questions[0]?.category || ''
          );
        }
      } finally {
        setLoadingLandingData(false);
      }
    };

    loadLandingData();
  }, []);

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

  // Get current category questions
  const getCurrentCategoryQuestions = () => {
    if (!landingData || !selectedCategory) return [];
    const category = landingData.quick_start_questions.find(
      q => q.category === selectedCategory
    );
    return category?.questions || [];
  };

  // Get predefined prompts from API data
  const getPredefinedPrompts = () => {
    if (!landingData) return [];

    const currentQuestions = getCurrentCategoryQuestions();
    const IconComponent = categoryIcons[selectedCategory] || Code;
    const gradient =
      categoryGradients[selectedCategory] || 'from-gray-500 to-gray-600';

    return currentQuestions.slice(0, 4).map(question => ({
      icon: IconComponent,
      text: question,
      category: selectedCategory,
      gradient,
    }));
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
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6 float pulse-glow">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                {landingData?.product_info.name || 'IndieHash AI'}
              </h1>
              <p className="text-lg text-indigo-300 mb-4">
                {landingData?.product_info.tagline ||
                  'RAG engine on top of a curated database.'}
              </p>
              <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
                {landingData?.product_info.description ||
                  'Your intelligent assistant for discovering resources, learning new skills, and exploring ideas.'}
              </p>
            </div>

            {loadingLandingData ? (
              /* Loading State */
              <div className="w-full max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="card-modern p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl shimmer"></div>
                        <div className="flex-1">
                          <div className="h-4 shimmer rounded mb-2 w-20"></div>
                          <div className="h-6 shimmer rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-6xl">
                {/* Category Tabs */}
                {landingData && (
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {landingData.quick_start_questions.map(category => (
                      <button
                        key={category.category}
                        onClick={() => setSelectedCategory(category.category)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === category.category
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                            : 'glass text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        {category.category}
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick Start Questions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {getPredefinedPrompts().map((prompt, idx) => (
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
                        <div className="flex-1">
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

                {/* System Stats */}
                {landingData?.system_info && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card-modern p-4 text-center">
                      <Database className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {landingData.system_info.total_documents.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">Documents</div>
                    </div>
                    <div className="card-modern p-4 text-center">
                      <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {landingData.system_info.indexed_vectors.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">Vectors</div>
                    </div>
                    <div className="card-modern p-4 text-center">
                      <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {landingData.system_info.knowledge_domains}
                      </div>
                      <div className="text-xs text-gray-400">Domains</div>
                    </div>
                    <div className="card-modern p-4 text-center">
                      <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">
                        {landingData.system_info.response_time}
                      </div>
                      <div className="text-xs text-gray-400">Avg Response</div>
                    </div>
                  </div>
                )}

                {/* Features */}
                {landingData?.product_info.features && (
                  <div className="card-modern p-6 mb-8">
                    <h3 className="text-xl font-semibold text-white mb-4 text-center">
                      Key Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {landingData.product_info.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 rounded-lg glass-dark"
                        >
                          <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Usage Tips */}
                {landingData?.usage_tips && (
                  <div className="card-modern p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 text-center">
                      💡 Usage Tips
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {landingData.usage_tips.map((tip, idx) => (
                        <div key={idx} className="glass-dark p-4 rounded-lg">
                          <h4 className="font-semibold text-indigo-300 mb-2">
                            {tip.title}
                          </h4>
                          <p className="text-gray-400 text-sm mb-2">
                            {tip.description}
                          </p>
                          <div className="text-xs text-gray-500 font-mono bg-gray-800 p-2 rounded">
                            {tip.example}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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
              Powered by {landingData?.product_info.name || 'IndieHash'} AI •
              Press Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
