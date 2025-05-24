import { format } from 'date-fns';
import { Message } from '@/types';
import Link from 'next/link';

interface ChatMessageProps {
  message: Message;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)?)([\w-]{11})/);
  return match ? match[1] : null;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  // Find YouTube link in the message content
  const ytRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\S+)/gi;
  const ytMatch = !isUser ? ytRegex.exec(message.content) : null;
  const ytId = ytMatch ? extractYouTubeId(ytMatch[0]) : null;

  if (!isUser && ytId) {
    // Show YouTube card
    return (
      <div className="flex mb-4 justify-start">
        <div className="max-w-3/4 order-1">
          <div className="flex items-center mb-1">
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary-light rounded-full mr-2 flex items-center justify-center text-xs text-gray-900">
              AI
            </div>
            <span className="text-xs text-gray-400">
              {message.timestamp && format(new Date(message.timestamp), 'h:mm a')}
            </span>
          </div>
          <div className="rounded-lg bg-gray-800 overflow-hidden shadow-lg">
            <div className="aspect-w-16 aspect-h-9 w-full">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-60 md:h-72"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-100 mb-2">
                {message.content.replace(ytRegex, '').trim() || 'YouTube video response'}
              </p>
              <Link
                href={`/chat/details/${encodeURIComponent(message.timestamp)}`}
                className="inline-block mt-2 px-4 py-2 rounded bg-gradient-to-r from-primary to-primary-light text-gray-900 font-semibold hover:from-primary-dark hover:to-primary transition"
              >
                Detailed response
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3/4 ${isUser ? 'order-2' : 'order-1'}`}>
        <div className="flex items-center mb-1">
          {!isUser && (
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary-light rounded-full mr-2 flex items-center justify-center text-xs text-gray-900">
              AI
            </div>
          )}
          <span className="text-xs text-gray-400">
            {message.timestamp && format(new Date(message.timestamp), 'h:mm a')}
          </span>
          {isUser && (
            <div className="w-6 h-6 bg-gray-600 rounded-full ml-2 flex items-center justify-center text-xs">
              You
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${isUser ? 'bg-gradient-to-r from-primary to-primary-light text-gray-900' : 'bg-gray-800'}`}>
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    </div>
  );
}