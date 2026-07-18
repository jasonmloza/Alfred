import { useState, useCallback } from 'react';
import type { Conversation, Message } from '../types';

const STORAGE_KEY = 'alfred-conversations';

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function loadFromStorage(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Conversation[];
  } catch {
    return [];
  }
}

function saveToStorage(conversations: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(() => loadFromStorage());
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null;

  const createConversation = useCallback((title?: string) => {
    const id = generateId();
    const now = Date.now();
    const conv: Conversation = {
      id,
      title: title ?? 'New conversation',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    setConversations((prev) => {
      const next = [conv, ...prev];
      saveToStorage(next);
      return next;
    });
    setActiveId(id);
    return id;
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveToStorage(next);
      return next;
    });
    setActiveId((current) => (current === id ? null : current));
  }, []);

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) => {
      const next = prev.map((c) =>
        c.id === id ? { ...c, title, updatedAt: Date.now() } : c,
      );
      saveToStorage(next);
      return next;
    });
  }, []);

  const addMessage = useCallback((convId: string, message: Message) => {
    setConversations((prev) => {
      const next = prev.map((c) => {
        if (c.id !== convId) return c;
        const messages = [...c.messages, message];
        const title = c.title === 'New conversation' && message.role === 'user'
          ? message.content.slice(0, 60) + (message.content.length > 60 ? '…' : '')
          : c.title;
        return { ...c, messages, title, updatedAt: Date.now() };
      });
      saveToStorage(next);
      return next;
    });
  }, []);

  const updateMessage = useCallback((convId: string, messageId: string, updates: Partial<Message>) => {
    setConversations((prev) => {
      const next = prev.map((c) => {
        if (c.id !== convId) return c;
        return {
          ...c,
          messages: c.messages.map((m) =>
            m.id === messageId ? { ...m, ...updates } : m,
          ),
          updatedAt: Date.now(),
        };
      });
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearConversations = useCallback(() => {
    setConversations([]);
    setActiveId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    conversations,
    activeConversation,
    activeId,
    setActiveId,
    createConversation,
    deleteConversation,
    renameConversation,
    addMessage,
    updateMessage,
    clearConversations,
  };
}