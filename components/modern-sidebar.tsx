'use client';

import { Chat } from '@/types';
import { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Globe,
  Settings,
  User,
  Search,
  Clock,
  Star,
  Trash2,
  Edit3,
  Menu,
  X,
} from 'lucide-react';

interface ModernSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
}

interface GroupedChats {
  [key: string]: Chat[];
}

export default function ModernSidebar({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
}: ModernSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

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
        groupName = 'This Week';
      } else if (today.getTime() - date.getTime() < 30 * 24 * 60 * 60 * 1000) {
        groupName = 'This Month';
      } else {
        groupName = 'Older';
      }

      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName]?.push(chat);
      return groups;
    },
    {}
  );

  // Filter chats based on search query
  const filteredGroupedChats = Object.entries(groupedChats).reduce(
    (filtered, [groupName, groupChats]) => {
      const filteredChats = groupChats.filter(
        chat =>
          chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.messages.some(msg =>
            msg.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      if (filteredChats.length > 0) {
        filtered[groupName] = filteredChats;
      }
      return filtered;
    },
    {} as GroupedChats
  );

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="sidebar-content">
              <h1 className="text-lg font-bold gradient-text">IndieHash</h1>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="btn-primary w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span className="sidebar-content">New Chat</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-modern w-full pl-10 pr-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-2 border-b border-white/10">
        <div className="sidebar-content space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <Globe className="w-4 h-4" />
            <span>Resources</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="sidebar-content space-y-4">
          {Object.entries(filteredGroupedChats).map(
            ([groupName, groupChats]) => (
              <div key={groupName}>
                <div className="flex items-center gap-2 px-2 py-1 mb-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {groupName}
                  </h3>
                </div>
                <div className="space-y-1">
                  {groupChats.map(chat => (
                    <div
                      key={chat.id}
                      className={`group relative rounded-lg transition-all cursor-pointer ${
                        activeChat === chat.id
                          ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
                          : 'hover:bg-white/5'
                      }`}
                      onClick={() => onSelectChat(chat.id)}
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`text-sm font-medium truncate ${
                                activeChat === chat.id
                                  ? 'text-white'
                                  : 'text-gray-300'
                              }`}
                            >
                              {chat.title || 'New Chat'}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {chat.messages.length > 0
                                ? (() => {
                                    const lastMessage =
                                      chat.messages[chat.messages.length - 1];
                                    const content = lastMessage?.content;

                                    // Handle different content types
                                    if (typeof content === 'string') {
                                      return content.length > 50
                                        ? content.substring(0, 50) + '...'
                                        : content;
                                    } else if (
                                      content &&
                                      typeof content === 'object'
                                    ) {
                                      // If content is an object, try to extract text from common properties
                                      const text =
                                        content.text ||
                                        content.message ||
                                        JSON.stringify(content);
                                      return typeof text === 'string'
                                        ? text.length > 50
                                          ? text.substring(0, 50) + '...'
                                          : text
                                        : 'Message content';
                                    } else {
                                      return 'Message content';
                                    }
                                  })()
                                : 'No messages yet'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 rounded hover:bg-white/10 transition-colors">
                              <Edit3 className="w-3 h-3 text-gray-400" />
                            </button>
                            <button className="p-1 rounded hover:bg-white/10 transition-colors">
                              <Trash2 className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(chat.updatedAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {chat.messages.length} messages
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="sidebar-content">
          <div className="flex items-center gap-3 p-3 rounded-lg glass-dark">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">User</p>
              <p className="text-xs text-gray-400 truncate">user@example.com</p>
            </div>
            <button className="p-1 rounded hover:bg-white/10 transition-colors">
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-dark"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          sidebar glass-dark border-r border-white/10 transition-all duration-300 ease-in-out
          ${mobileOpen ? 'mobile-open' : ''}
        `}
      >
        <div className="sidebar-content">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
