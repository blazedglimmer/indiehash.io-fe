'use client';

import { useState, useEffect } from 'react';
import WorkspaceInterface from '@/components/workspace-interface';
// import Sidebar from '@/components/sidebar';
import { createNewChat, getAllChats } from '@/utils/storage';
import { Chat } from '@/types';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { WorkspaceHeader } from '@/components/workspace-header';

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    // Load chats from localStorage on initial render
    const loadedChats = getAllChats();
    setChats(loadedChats);

    // If there are chats, set the active chat to the most recent one
    if (loadedChats.length > 0) {
      setActiveChatId(loadedChats[0]?.id ?? null);
    } else {
      // If no chats exist, create a new one
      handleNewChat();
    }
  }, []);

  const handleNewChat = () => {
    const newChat = createNewChat();
    if (newChat) {
      setChats(prevChats => [newChat, ...prevChats]);
      setActiveChatId(newChat.id);
    }
  };

  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/20 text-white overflow-hidden flex flex-1">
      {/* <Sidebar
        chats={chats}
        activeChat={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
      /> */}

      <SidebarProvider>
        <AppSidebar
          chats={chats}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          handleNewChat={handleNewChat}
        />
        <SidebarInset>
          <WorkspaceHeader />
          <WorkspaceInterface chat={activeChat} setChats={setChats} />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
