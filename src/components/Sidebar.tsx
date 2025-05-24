import { format } from 'date-fns';
import { Chat } from '@/types';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

interface GroupedChats {
  [key: string]: Chat[];
}

export default function Sidebar({ chats, activeChat, onSelectChat, onNewChat }: SidebarProps) {
  const { data: session } = useSession();

  // Group chats by date
  const groupedChats: GroupedChats = chats.reduce((groups: GroupedChats, chat) => {
    const date = new Date(chat.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupName: string;
    if (date.toDateString() === today.toDateString()) {
      groupName = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupName = 'Yesterday';
    } else if (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      groupName = '7 Days';
    } else if (today.getTime() - date.getTime() < 30 * 24 * 60 * 60 * 1000) {
      groupName = '30 Days';
    } else {
      groupName = 'Older';
    }
    
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(chat);
    return groups;
  }, {});

  return (
    <div className="w-64 flex flex-col border-r border-gray-700 bg-gray-900">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-gray-300">indiechat</h1>
      </div>
      <div className="px-4 py-4">
        <button 
          onClick={onNewChat}
          className="flex items-center justify-center w-full py-2 px-4 bg-gradient-to-r from-primary to-primary-light rounded-md hover:from-primary-dark hover:to-primary transition-colors text-gray-900 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedChats).map(([groupName, groupChats]) => (
          <div key={groupName} className="mb-4">
            <h3 className="px-4 py-2 text-sm text-gray-500">{groupName}</h3>
            {groupChats.map(chat => (
              <div 
                key={chat.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-800 ${activeChat === chat.id ? 'bg-gray-800' : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <p className="truncate text-sm">{chat.title || 'New Chat'}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700">
        {session?.user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center text-gray-900 font-medium">
                  {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                </div>
              )}
              <div className="ml-2">
                <p className="text-sm font-medium">{session.user.name || 'User'}</p>
                <p className="text-xs text-gray-400">{session.user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-400 hover:text-white"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center text-gray-900 font-medium">
              <span>?</span>
            </div>
            <span className="ml-2">Not signed in</span>
          </div>
        )}
      </div>
    </div>
  );
}