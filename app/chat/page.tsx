'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/chat-interface';
import Sidebar from '@/components/side-bar';
import { createNewChat, getAllChats } from '@/utils/storage';
import { Chat } from '@/types';

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    // Load chats from localStorage on initial render
    const loadedChats = getAllChats();
    setChats(loadedChats);

    // If there are chats, set the active chat to the most recent one
    if (loadedChats.length > 0) {
      setActiveChatId(loadedChats[0].id);
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
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        chats={chats}
        activeChat={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
      />
      <ChatInterface chat={activeChat} setChats={setChats} />
    </div>
  );
}
