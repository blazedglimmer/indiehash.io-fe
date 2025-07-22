import { format } from 'date-fns';
import { Message } from '@/types';
import {
  MessageCircle,
  Youtube,
  Globe,
  ListVideo,
  ListChecks,
} from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
}

const mockSources = [
  { label: 'Perplexity', icon: MessageCircle },
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

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [activeTab, setActiveTab] = useState(0);

  if (!isUser) {
    // Perplexity-style card for assistant
    return (
      <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-8 mb-8">
        <SourceTabs
          sources={mockSources}
          active={activeTab}
          setActive={setActiveTab}
        />
        <SourcePills pills={mockPills} />
        <MarkdownResponse content={message.content} />
      </div>
    );
  }

  // User message as before
  return (
    <div className={`flex mb-4 justify-end`}>
      <div className={`max-w-3/4 order-2`}>
        <div className="flex items-center mb-1">
          <span className="text-xs text-gray-400">
            {message.timestamp && format(new Date(message.timestamp), 'h:mm a')}
          </span>
          <div className="w-6 h-6 bg-gray-600 rounded-full ml-2 flex items-center justify-center text-xs">
            You
          </div>
        </div>
        <div
          className={`p-3 rounded-lg bg-gradient-to-r from-primary to-primary-light text-gray-900`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
