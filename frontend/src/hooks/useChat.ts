import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../lib/api';
import type { Message, Attachment } from '../types';

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

interface UseChatOptions {
  onSendMessage: (message: Message) => void;
  onUpdateMessage: (messageId: string, updates: Partial<Message>) => void;
  conversationId: string | null;
}

export function useChat({ onSendMessage, onUpdateMessage, conversationId }: UseChatOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string, attachments?: Attachment[]) => {
      if (!conversationId) return;
      if (!content.trim() && (!attachments || attachments.length === 0)) return;

      setError(null);

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
        attachments,
        status: 'sent',
      };

      onSendMessage(userMessage);

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        status: 'sending',
      };

      onSendMessage(assistantMessage);
      setIsStreaming(true);

      const payload = {
        message: userMessage.content,
        attachments: attachments?.map((a) => ({
          name: a.name,
          type: a.type,
          content: a.content ?? '',
          size: a.size,
        })),
        conversation_id: conversationId,
      };

      try {
        abortRef.current = new AbortController();
        const data = await sendChatMessage(payload, abortRef.current.signal);

        onUpdateMessage(assistantMessage.id, {
          content: data.response,
          status: 'sent',
        });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          onUpdateMessage(assistantMessage.id, {
            status: 'sent',
          });
        } else {
          const message = err instanceof Error ? err.message : 'An error occurred';
          setError(message);
          onUpdateMessage(assistantMessage.id, {
            content: message,
            status: 'error',
          });
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [conversationId, onSendMessage, onUpdateMessage],
  );

  const cancelStream = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    isStreaming,
    error,
    sendMessage,
    cancelStream,
  };
}