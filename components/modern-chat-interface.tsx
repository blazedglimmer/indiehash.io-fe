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
  TrendingUp,
  Clock,
  Tag,
  Copy,
  Check,
  Star,
  Database,
  Activity,
  RefreshCw,
  ExternalLink,
  ThumbsUp,
  Share2,
  Bookmark,
  Eye,
  Video,
  AlertTriangle,
  MessageSquare,
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
        content: response.data,
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

  // Extract YouTube video ID from URL
  //   const extractYouTubeId = (url: string): string | null => {
  //     const regex =
  //       /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  //     const match = url.match(regex);
  //     return match ? match[1] || null : null;
  //   };

  //   // Extract URLs from text
  //   const extractUrls = (text: string): string[] => {
  //     const urlRegex = /(https?:\/\/[^\s]+)/g;
  //     return text.match(urlRegex) || [];
  //   };

  //   // Parse markdown-like content
  //   const parseContent = (content: string) => {
  //     const lines = content.split('\n');
  //     const sections: any[] = [];
  //     let currentSection: any = null;

  //     lines.forEach((line, index) => {
  //       const trimmedLine = line.trim();

  //       if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
  //         // Section header
  //         if (currentSection) {
  //           sections.push(currentSection);
  //         }
  //         currentSection = {
  //           type: 'section',
  //           title: trimmedLine.replace(/\*\*/g, ''),
  //           content: [],
  //           urls: [],
  //           videos: [],
  //         };
  //       } else if (trimmedLine.startsWith('- ')) {
  //         // List item
  //         if (currentSection) {
  //           const urls = extractUrls(trimmedLine);
  //           const videoUrls = urls.filter(
  //             url => url.includes('youtube.com') || url.includes('youtu.be')
  //           );

  //           currentSection.content.push({
  //             type: 'list-item',
  //             text: trimmedLine.substring(2),
  //             urls: urls,
  //             videos: videoUrls,
  //           });

  //           currentSection.urls.push(...urls);
  //           currentSection.videos.push(...videoUrls);
  //         }
  //       } else if (trimmedLine && currentSection) {
  //         // Regular paragraph
  //         const urls = extractUrls(trimmedLine);
  //         const videoUrls = urls.filter(
  //           url => url.includes('youtube.com') || url.includes('youtu.be')
  //         );

  //         currentSection.content.push({
  //           type: 'paragraph',
  //           text: trimmedLine,
  //           urls: urls,
  //           videos: videoUrls,
  //         });

  //         currentSection.urls.push(...urls);
  //         currentSection.videos.push(...videoUrls);
  //       }
  //     });

  //     if (currentSection) {
  //       sections.push(currentSection);
  //     }

  //     return sections;
  //   };

  //   // Extract video metadata from URL
  //   const getVideoMetadata = (url: string, title?: string) => {
  //     const videoId = extractYouTubeId(url);
  //     if (!videoId) return null;

  //     return {
  //       id: videoId,
  //       url: url,
  //       title: title || 'YouTube Video',
  //       thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  //       embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
  //     };
  //   };

  //   // Render YouTube video embed
  //   const renderYouTubeEmbed = (
  //     videoId: string,
  //     title?: string,
  //     index?: number
  //   ) => (
  //     <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black group mb-6">
  //       <iframe
  //         src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
  //         title={title || 'YouTube video'}
  //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //         allowFullScreen
  //         className="w-full h-full"
  //       />
  //       {index !== undefined && (
  //         <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
  //           {index + 1}
  //         </div>
  //       )}
  //       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
  //         <button className="p-2 rounded-lg bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 transition-colors">
  //           <Bookmark className="w-4 h-4" />
  //         </button>
  //         <button className="p-2 rounded-lg bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 transition-colors">
  //           <ExternalLink className="w-4 h-4" />
  //         </button>
  //       </div>
  //     </div>
  //   );

  // Render video card with metadata
  //   const renderVideoCard = (video: any, index: number) => (
  //     <div key={index} className="card-modern p-6 mb-6">
  //       <div className="flex items-start gap-4 mb-4">
  //         <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold">
  //           {index + 1}
  //         </div>
  //         <div className="flex-1">
  //           <h4 className="text-lg font-semibold text-white mb-2">
  //             {video.title || `Featured Video #${index + 1}`}
  //           </h4>
  //           <p className="text-gray-400 text-sm mb-4">
  //             {video.description ||
  //               'Curated content to help you learn and explore'}
  //           </p>
  //         </div>
  //         <div className="flex items-center gap-2">
  //           <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
  //             <Bookmark className="w-4 h-4 text-gray-400" />
  //           </button>
  //           <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
  //             <Share2 className="w-4 h-4 text-gray-400" />
  //           </button>
  //         </div>
  //       </div>
  //       {renderYouTubeEmbed(video.id, video.title, index)}
  //     </div>
  //   );

  const renderAssistantMessage = (content: string | any) => {
    try {
      // If content is already an object, use it directly
      const data: EnhancedQueryData =
        typeof content === 'string' ? JSON.parse(content) : content;

      // Extract video information from similar_results
      const extractVideoInfo = (result: any) => {
        const metadata = result.all_payload?.metadata;
        if (metadata?.content_type === 'youtube_video' && metadata?.video) {
          return {
            id: metadata.video.video_id,
            title: metadata.video.title,
            description: metadata.video.description,
            thumbnail: metadata.video.thumbnail_url,
            channel: metadata.video.channel_title,
            views: metadata.video.view_count,
            likes: metadata.video.like_count,
            comments: metadata.video.comment_count,
            duration: metadata.video.duration,
            publishedAt: metadata.video.published_at,
            tags: metadata.video.tags || [],
            embedUrl: `https://www.youtube.com/embed/${metadata.video.video_id}?rel=0&modestbranding=1`,
          };
        }
        return null;
      };

      // Extract videos from similar results
      const videos =
        data.similar_results?.map(extractVideoInfo).filter(Boolean) || [];

      // Create a beautiful summary if not provided
      const summary =
        data.summary ||
        `Here are some curated ${
          videos.length > 0 ? 'video' : ''
        } resources to help you with "${
          data.question
        }". Our AI has found the most relevant content from trusted creators.`;

      return (
        <div className="w-full max-w-4xl mx-auto">
          {/* Main Content Card */}
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
            {summary && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    AI Summary
                  </h3>
                </div>
                <div className="glass-dark p-6 rounded-2xl">
                  <p className="text-gray-200 leading-relaxed text-lg">
                    {summary}
                  </p>
                </div>
              </div>
            )}

            {/* Featured Videos Section */}
            {videos.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                    <Video className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Featured Video Picks
                  </h3>
                </div>

                <div className="space-y-6">
                  {videos.slice(0, 3).map((video, idx) => (
                    <div key={idx} className="card-modern p-6 mb-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">
                            {video?.title}
                          </h4>
                          <p className="text-gray-400 text-sm mb-2">
                            By {video?.channel} •{' '}
                            {video?.views?.toLocaleString()} views
                          </p>
                          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                            {video?.description?.substring(0, 200)}...
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {video?.tags
                              ?.slice(0, 4)
                              .map((tag: string, tagIdx: number) => (
                                <span
                                  key={tagIdx}
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
                            <Bookmark className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-2 rounded-lg glass hover:bg-white/10 transition-colors">
                            <Share2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      {/* YouTube Embed */}
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black group">
                        <iframe
                          src={video?.embedUrl}
                          title={video?.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button className="p-2 rounded-lg bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Video Stats */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {video?.views?.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {video?.likes?.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {video?.comments?.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(video?.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Results */}
            {data.similar_results && data.similar_results.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <Globe className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Related Results
                  </h3>
                </div>
                <div className="grid gap-4">
                  {data.similar_results.slice(0, 5).map((result, idx) => (
                    <div key={result.id} className="glass-dark p-6 rounded-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                            {idx + 1}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-green-400">
                              {result.relevance_percent.toFixed(1)}% match
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-500" />
                              <span className="text-xs text-gray-500">
                                {result.processing_time_ms}ms
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(result.text, result.id)
                          }
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          {copiedId === result.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>

                      <p className="text-gray-200 mb-4 leading-relaxed line-clamp-4">
                        {result.text}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {result.all_payload?.metadata?.video?.tags
                            ?.slice(0, 3)
                            .map((tag: string) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            )) || []}
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.all_payload?.metadata?.content_type ||
                            'content'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer with metadata */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Response Metadata</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-dark p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">
                    {data.total_results || 0}
                  </div>
                  <div className="text-xs text-gray-400">Results</div>
                </div>
                <div className="glass-dark p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">
                    {videos.length}
                  </div>
                  <div className="text-xs text-gray-400">Videos</div>
                </div>
                <div className="glass-dark p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">
                    {data.similar_results?.length || 0}
                  </div>
                  <div className="text-xs text-gray-400">Sources</div>
                </div>
                <div className="glass-dark p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-white">
                    {data.similar_results?.[0]?.processing_time_ms.toFixed(0) ||
                      0}
                    ms
                  </div>
                  <div className="text-xs text-gray-400">Response Time</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-xs text-gray-500">
                  Request ID: {data.request_id}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors">
              <ThumbsUp className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Helpful</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors">
              <Share2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Share</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors">
              <Bookmark className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Save</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">Regenerate</span>
            </button>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error parsing assistant message:', error);
      // Fallback to display raw content if JSON parsing fails
      return (
        <div className="w-full max-w-4xl mx-auto">
          <div className="card-modern p-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Response</h3>
            </div>
            <div className="glass-dark p-6 rounded-2xl">
              <pre className="text-gray-200 whitespace-pre-wrap text-sm leading-relaxed overflow-x-auto">
                {typeof content === 'string'
                  ? content
                  : JSON.stringify(content, null, 2)}
              </pre>
            </div>
          </div>
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
