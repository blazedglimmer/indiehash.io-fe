import { Chat } from '@/types';
import Image from 'next/image';
import { Plus, Globe } from 'lucide-react';
import { useRef, useState } from 'react';

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

interface GroupedChats {
  [key: string]: Chat[];
}

export default function Sidebar({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
}: SidebarProps) {
  const [hovered, setHovered] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Group chats by date
  const groupedChats: GroupedChats = chats.reduce(
    (groups: GroupedChats, chat) => {
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
    },
    {}
  );

  return (
    <div
      className="relative h-screen"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={sidebarRef}
    >
      {/* Icon Pane (always visible) */}
      <div className="flex flex-col items-center bg-gray-900 border-r border-gray-700 h-full w-16 py-4 z-20">
        <div className="mb-6">
          <Image
            src="/images/cat-only-dark.png"
            alt="IndieChat Logo"
            width={36}
            height={36}
          />
        </div>
        <button
          onClick={onNewChat}
          className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors text-gray-400 mb-4"
        >
          <Plus className="w-6 h-6" />
        </button>
        <button className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors text-gray-400 mb-4">
          <Globe className="w-6 h-6" />
        </button>
        <div className="flex-1" />
        <div className="mb-4">
          <Image
            src="/images/cat-only-dark.png"
            alt="IndieChat Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </div>
      {/* Details Pane (appears on hover) */}
      {hovered && (
        <div className="absolute left-16 top-0 h-full w-48 bg-gray-900 border-r border-gray-700 shadow-xl z-30 flex flex-col py-4 transition-all duration-200">
          <div className="flex items-center mb-6 px-4">
            <span className="text-lg font-bold text-white">IndieChat</span>
          </div>
          <div className="flex flex-col gap-2 mb-4 px-4">
            <button className="flex items-center gap-3 text-white py-2">
              <Plus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
            <button className="flex items-center gap-3 text-white py-2">
              <Globe className="w-5 h-5" />
              <span>Resources</span>
            </button>
          </div>
          {/* Chat history list */}
          <div className="flex-1 overflow-y-auto px-2">
            {Object.entries(groupedChats).map(([groupName, groupChats]) => (
              <div key={groupName} className="mb-2">
                <h3 className="px-2 py-1 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                  {groupName}
                </h3>
                {groupChats.map(chat => (
                  <div
                    key={chat.id}
                    className={`px-2 py-1 rounded cursor-pointer text-sm truncate mb-1 transition-colors ${
                      activeChat === chat.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    {chat.title || 'New Chat'}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="px-4 pb-4 mt-2">
            <div className="flex items-center gap-3">
              <Image
                src="/images/cat-only-dark.png"
                alt="IndieChat Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-white">User</p>
                <p className="text-xs text-gray-400">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
