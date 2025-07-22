'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Chat } from '../../../../types';
import { getAllChats } from '@/utils/storage';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

function extractYouTubeId(content: string): string | null {
  const ytRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\S+)/gi;
  const ytMatch = ytRegex.exec(content);
  if (!ytMatch) return null;
  const url = ytMatch[0];
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)?)([\w-]{11})/
  );
  return match ? match[1] : null;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB');
}

export default function ChatDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    // Decode the id param in case it's URL-encoded
    const decodedId = decodeURIComponent(id as string);
    // Find the message by timestamp in all chats
    const chats: Chat[] = getAllChats();
    for (const chat of chats) {
      const found = chat.messages.find(m => m.timestamp === decodedId);
      if (found) {
        setMessage(found);
        break;
      }
    }
  }, [id]);

  if (!message) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 text-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Response Not Found</h1>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gradient-to-r from-primary to-primary-light text-gray-900 font-semibold hover:from-primary-dark hover:to-primary transition"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const ytId = extractYouTubeId(message.content);

  // Mock user info for demo
  const user = {
    name: 'John Developer',
    address: '0x1234...5678',
    avatar: null, // or a URL
    status: 'Approved',
    date: formatDate(message.timestamp),
  };

  // Extract title and description (for demo, use first line as title, rest as description)
  const [title, ...descLines] = message.content
    .replace(/https?:\/\/(www\.)?(youtube\.com|youtu\.be)\S*/gi, '')
    .trim()
    .split('\n');
  const description = descLines.join('\n').trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-xl font-bold text-violet-700">
                {user.name[0]}
              </div>
            )}
            <div>
              <div className="font-semibold text-gray-900">{user.name}</div>
              <div className="text-xs text-gray-400">{user.address}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4" /> {user.status}
            </span>
            <span className="text-xs text-gray-400">{user.date}</span>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-tight tracking-tight">
          {title}
        </h2>
        <div className="text-gray-700 mb-6 whitespace-pre-line text-base md:text-lg leading-relaxed">
          {description}
        </div>
        {ytId && (
          <div className="w-full rounded-2xl overflow-hidden shadow border border-gray-200 bg-black mb-2">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-[350px] md:h-[450px]"
            />
          </div>
        )}
        <button
          onClick={() => router.back()}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-light text-gray-900 font-semibold shadow hover:from-primary-dark hover:to-primary transition animate-fade-in-up"
        >
          <ArrowLeft className="w-5 h-5" /> Back to chat
        </button>
      </div>
      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </div>
  );
}
