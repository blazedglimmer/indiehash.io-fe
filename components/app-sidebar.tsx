'use client';
import { Chat } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';

import {
  Search,
  Settings,
  Plus,
  Globe,
  User,
  Clock,
  Star,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useState } from 'react';

interface GroupedChats {
  [key: string]: Chat[];
}

export function AppSidebar({
  chats,
  activeChatId,
  setActiveChatId,
  handleNewChat,
}: {
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  handleNewChat: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup className="h-full flex flex-col mobile-scroll">
          {/* Header */}
          <SidebarGroupLabel className="p-4 md:p-6 border-b border-white/10 mt-6 md:mt-4">
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="btn-primary w-full py-2 md:py-3 px-3 md:px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium mobile-touch"
            >
              <Plus className="w-4 h-4" />
              <span className="sidebar-content">New Chat</span>
            </button>
          </SidebarGroupLabel>

          {/* Search */}
          <div className="p-3 md:p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-modern w-full pl-10 pr-4 py-2 text-sm mobile-input"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="px-3 md:px-4 py-2 border-b border-white/10">
            <div className="sidebar-content space-y-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-sm md:text-base">Resources</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                <Star className="w-4 h-4" />
                <span className="text-sm md:text-base">Favorites</span>
              </button>
            </div>
          </div>

          {/* Chat History */}
          <SidebarGroupContent className="flex-1 overflow-y-auto p-3 md:p-4 mobile-scroll">
            <SidebarMenu className="sidebar-content space-y-4">
              {Object.entries(filteredGroupedChats).map(
                ([groupName, groupChats]) => (
                  <div key={groupName}>
                    <div className="flex items-center gap-2 px-2 py-1 mb-2">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mobile-text">
                        {groupName}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {groupChats.map(chat => (
                        <div
                          key={chat.id}
                          className={`group relative rounded-lg transition-all cursor-pointer ${
                            activeChatId === chat.id
                              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
                              : 'hover:bg-white/5'
                          }`}
                          onClick={() => setActiveChatId(chat.id)}
                        >
                          <div className="p-2 md:p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`text-xs md:text-sm font-medium truncate ${
                                    activeChatId === chat.id
                                      ? 'text-white'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  {chat.title || 'New Chat'}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 truncate mobile-text">
                                  {chat.messages.length > 0
                                    ? (() => {
                                        const lastMessage =
                                          chat.messages[
                                            chat.messages.length - 1
                                          ];
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
                              <div className="flex items-center gap-1 opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <button className="p-1 rounded hover:bg-white/10 transition-colors">
                                  <Edit3 className="w-3 h-3 text-gray-400" />
                                </button>
                                <button className="p-1 rounded hover:bg-white/10 transition-colors">
                                  <Trash2 className="w-3 h-3 text-gray-400" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-1 md:mt-2">
                              <span className="text-xs text-gray-500 mobile-text">
                                {new Date(chat.updatedAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-gray-500 mobile-text">
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
            </SidebarMenu>
          </SidebarGroupContent>

          {/* Footer */}
          <div className="p-3 md:p-4 border-t border-white/10">
            <div className="sidebar-content">
              <div className="flex items-center gap-3 p-3 rounded-lg glass-dark">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-white truncate">
                    User
                  </p>
                  <p className="text-xs text-gray-400 truncate mobile-text">
                    user@example.com
                  </p>
                </div>
                <button className="p-1 rounded hover:bg-white/10 transition-colors">
                  <Settings className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </SidebarGroup>
        {/* <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
    </Sidebar>
  );
}
