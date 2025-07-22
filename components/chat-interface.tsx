import { useState, useEffect, useRef } from 'react';
import ChatInput from '@/components/chat-input';
import { updateChat } from '@/utils/storage';
import { Chat, Message } from '@/types';
import {
  MessageCircle,
  Youtube,
  Globe,
  ListVideo,
  ListChecks,
} from 'lucide-react';

const mockSources = [
  { label: 'IndieHash', icon: MessageCircle },
  { label: 'Videos', icon: ListVideo },
  { label: 'Sources', icon: Globe },
  { label: 'Tasks', icon: ListChecks },
];

const mockPills = [
  {
    label: 'The Rust Programming...',
    type: 'youtube',
    desc: 'Best youtube playlists for learning Rust',
  },
  {
    label: 'youtube',
    type: 'youtube',
    desc: 'Learn Rust Programming - Complete Course - YouTube',
  },
  {
    label: 'youtube',
    type: 'youtube',
    desc: 'Learn Rust In One Epic Playlist - YouTube',
  },
  {
    label: 'reddit.com',
    type: 'reddit',
    desc: 'Youtube channels for Rust content? - Reddit',
  },
];

function SourceTabs({ sources, active, setActive }: any) {
  return (
    <div className="flex gap-2 mb-4">
      {sources.map((src: any, idx: number) => (
        <button
          key={src.label}
          onClick={() => setActive(idx)}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === idx
              ? 'bg-gray-800 text-primary'
              : 'bg-gray-900 text-gray-400 hover:text-primary'
          }`}
        >
          <src.icon className="w-4 h-4" /> {src.label}
        </button>
      ))}
    </div>
  );
}

function SourcePills({ pills }: any) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {pills.map((pill: any, idx: number) => (
        <div
          key={idx}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 text-xs font-medium"
        >
          {pill.type === 'youtube' && (
            <Youtube className="w-4 h-4 text-red-500" />
          )}
          {pill.type === 'reddit' && (
            <Globe className="w-4 h-4 text-orange-400" />
          )}
          <span className="truncate max-w-[120px]">{pill.desc}</span>
        </div>
      ))}
    </div>
  );
}

function MarkdownResponse({ content }: { content: string }) {
  // Simple markdown-like rendering for bold, links, and bullets
  const lines = content.split('\n');
  return (
    <div className="prose prose-invert max-w-none text-gray-100">
      {lines.map((line, idx) => {
        if (line.startsWith('- ')) {
          // Bullet
          const match = line.match(/\*\*(.*?)\*\*/);
          const bold = match ? match[1] : null;
          const rest = line.replace(/- \*\*(.*?)\*\*/, '').trim();
          const linkMatch = line.match(/\[Watch here\]\((.*?)\)/);
          return (
            <li key={idx} className="mb-2">
              {bold && <span className="font-semibold text-white">{bold}</span>}{' '}
              <span>{rest.replace(/\[Watch here\]\(.*?\)/, '')}</span>
              {linkMatch && (
                <a
                  href={linkMatch[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-primary underline hover:text-primary-light"
                >
                  Watch here
                </a>
              )}
            </li>
          );
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={idx} className="font-bold text-lg mt-6 mb-2 text-white">
              {line.replace(/\*\*/g, '')}
            </div>
          );
        }
        if (line.trim() === '') return null;
        return <div key={idx}>{line}</div>;
      })}
    </div>
  );
}

export default function ChatInterface({
  chat,
  setChats,
}: {
  chat: Chat | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [inputEnabled, setInputEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined prompts for onboarding
  const predefinedPrompts = [
    'What can you do?',
    'Show me trending topics.',
    'Help me get started with IndieChat.',
    'Suggest some interesting AI use cases.',
    'How do I use resources?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  useEffect(() => {
    // Enable input if there are messages
    if (chat && chat.messages.length > 0) setInputEnabled(true);
  }, [chat]);

  const handleSendMessage = async (message: string) => {
    if (!chat || !message.trim()) return;
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    const updatedChat: Chat = {
      ...chat,
      messages: [...chat.messages, userMessage],
    };
    if (!chat.title && chat.messages.length === 0) {
      updatedChat.title =
        message.substring(0, 30) + (message.length > 30 ? '...' : '');
    }
    updateChat(updatedChat);
    setChats(prevChats =>
      prevChats.map(c => (c.id === chat.id ? updatedChat : c))
    );
    setLoading(true);
    setTimeout(() => {
      const aiResponse: Message = {
        role: 'assistant',
        content: `Here is a curated YouTube playlist collection to effectively learn Rust programming, covering beginner to intermediate levels, with some advanced resources included:\n\n**Beginner to Intermediate Rust Learning Playlists**\n\n- **Rust Crash Course (6 hours) + 19 Practice Exercises by Zero To Mastery**  \n  This comprehensive beginner-friendly crash course covers Rust fundamentals from scratch, including data types, control flow, ownership, borrowing, and more, with practical exercises to reinforce learning.  \n  [Watch here](https://www.youtube.com/watch?v=zF34dRivLOw)\n\n- **Rust Tutorial for Beginners - Full Course by Harkirat Singh**  \n  A 4-hour detailed beginner course focusing on Rust basics, memory management, ownership, borrowing, structs, enums, pattern matching, error handling, Cargo, and project ideas. Comes with slides and timestamps.  \n  [Watch here](https://www.youtube.com/watch?v=ygL_xcavzQ4)\n\n- **Learn Rust Programming - Complete Course by Zubairfan**  \n  A thorough 13+ hour course covering core Rust concepts, ownership, borrowing, lifetimes, traits, generics, collections, error handling, and more, with code examples and exercises.  \n  [Watch here](https://www.youtube.com/watch?v=Ej_02ICOIgs)\n\n- **Learn Rust In One Epic Playlist (Rust Book walkthrough)**  \n  A playlist that follows the official Rust Book chapter by chapter, ideal for those who want a structured approach aligned with the authoritative Rust documentation.  \n  [Watch here](https://www.youtube.com/playlist?list=PLzMcBGfZo4-lB8MZfHPLTEHO9zJDDLpYj)`,
        timestamp: new Date().toISOString(),
      };
      const finalChat: Chat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiResponse],
      };
      updateChat(finalChat);
      setChats(prevChats =>
        prevChats.map(c => (c.id === chat.id ? finalChat : c))
      );
      setLoading(false);
    }, 2000);
  };

  // Handle prompt selection
  const handlePromptSelect = (prompt: string) => {
    setInputEnabled(true);
    handleSendMessage(prompt);
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select a chat or create a new one</p>
      </div>
    );
  }

  // Find the latest user and assistant messages
  const lastUserIdx = [...(chat.messages || [])]
    .reverse()
    .findIndex(m => m.role === 'user');
  const lastAssistantIdx = [...(chat.messages || [])]
    .reverse()
    .findIndex(m => m.role === 'assistant');
  const userMessage =
    lastUserIdx !== -1
      ? chat.messages[chat.messages.length - 1 - lastUserIdx]
      : null;
  const assistantMessage =
    lastAssistantIdx !== -1
      ? chat.messages[chat.messages.length - 1 - lastAssistantIdx]
      : null;

  return (
    <div className="flex-1 flex flex-col items-center justify-between min-h-screen bg-gray-950">
      <div className="flex-1 flex flex-col items-center justify-center w-full pt-12">
        {/* Show prompts if no messages */}
        {chat.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-light rounded-full mb-4 flex items-center justify-center text-gray-900">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Hi, I'm IndieChat.</h2>
            <p className="text-gray-400 mb-4">
              Choose a prompt to get started:
            </p>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {predefinedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  className="py-2 px-4 rounded bg-gray-800 text-white hover:bg-primary transition-colors text-left"
                  onClick={() => handlePromptSelect(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {userMessage && (
              <div className="w-full flex justify-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white text-center max-w-2xl">
                  {userMessage.content}
                </h1>
              </div>
            )}
            {assistantMessage && (
              <div className="w-full flex justify-center">
                <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8 mb-8 max-w-2xl w-full">
                  <SourceTabs
                    sources={mockSources}
                    active={activeTab}
                    setActive={setActiveTab}
                  />
                  <SourcePills pills={mockPills} />
                  <MarkdownResponse content={assistantMessage.content} />
                </div>
              </div>
            )}
            {loading && (
              <div className="w-full flex justify-center">
                <div className="max-w-2xl w-full">
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
      <div className="w-full flex justify-center border-t border-gray-700 p-4 bg-gray-950">
        <div className="w-full max-w-2xl">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={loading || !inputEnabled}
          />
        </div>
      </div>
    </div>
  );
}
