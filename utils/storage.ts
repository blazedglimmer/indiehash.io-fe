import { v4 as uuidv4 } from 'uuid';
import { Chat } from '@/types';

// Helper to check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Get all chats from localStorage
export const getAllChats = (): Chat[] => {
  if (!isLocalStorageAvailable()) return [];

  try {
    const chatIds = JSON.parse(
      localStorage.getItem('chatIds') || '[]'
    ) as string[];
    return chatIds
      .map(id => {
        const chatData = localStorage.getItem(`chat_${id}`);
        return chatData ? (JSON.parse(chatData) as Chat) : null;
      })
      .filter((chat): chat is Chat => chat !== null)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  } catch (error) {
    console.error('Error getting chats from localStorage:', error);
    return [];
  }
};

// Create a new chat
export const createNewChat = (): Chat | null => {
  if (!isLocalStorageAvailable()) return null;

  try {
    const id = uuidv4();
    const newChat: Chat = {
      id,
      title: '',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(`chat_${id}`, JSON.stringify(newChat));

    // Update chat IDs list
    const chatIds = JSON.parse(
      localStorage.getItem('chatIds') || '[]'
    ) as string[];
    chatIds.unshift(id);
    localStorage.setItem('chatIds', JSON.stringify(chatIds));

    return newChat;
  } catch (error) {
    console.error('Error creating new chat:', error);
    return null;
  }
};

// Update existing chat
export const updateChat = (chat: Chat): boolean => {
  if (!isLocalStorageAvailable() || !chat || !chat.id) return false;

  try {
    const updatedChat: Chat = {
      ...chat,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`chat_${chat.id}`, JSON.stringify(updatedChat));
    return true;
  } catch (error) {
    console.error('Error updating chat:', error);
    return false;
  }
};

// Delete a chat
export const deleteChat = (chatId: string): boolean => {
  if (!isLocalStorageAvailable() || !chatId) return false;

  try {
    // Remove chat data
    localStorage.removeItem(`chat_${chatId}`);

    // Update chat IDs list
    const chatIds = JSON.parse(
      localStorage.getItem('chatIds') || '[]'
    ) as string[];
    const updatedIds = chatIds.filter(id => id !== chatId);
    localStorage.setItem('chatIds', JSON.stringify(updatedIds));

    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    return false;
  }
};
