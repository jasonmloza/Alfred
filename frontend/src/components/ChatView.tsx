import { useRef, useEffect } from 'react';
import { PanelLeft, Trash2, MessageSquare, Sparkles } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { Conversation, Message } from '../types';

interface ChatViewProps {
  conversation: Conversation | null;
  isStreaming: boolean;
  onSend: (content: string, attachments?: any[]) => void;
  onCancel: () => void;
  onToggleSidebar: () => void;
  onDeleteConversation: (id: string) => void;
  messages: Message[];
}

export function ChatView({
  conversation,
  isStreaming,
  onSend,
  onCancel,
  onToggleSidebar,
  onDeleteConversation,
  messages,
}: ChatViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(messages.length);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const msgCount = messages.length;
    // Only scroll if a new message was added (not on initial render)
    if (msgCount !== prevMessageCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      prevMessageCountRef.current = msgCount;
    }
  }, [messages.length]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border/20 bg-background/60 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            {/* Mobile menu toggle */}
            <button
              onClick={onToggleSidebar}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/50 transition-all duration-200 hover:bg-muted/30 hover:text-foreground active:scale-95 md:hidden"
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              {conversation ? (
                <>
                  <h1 className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-[400px]">
                    {conversation.title}
                  </h1>
                  <span className="hidden text-[11px] text-muted-foreground/35 sm:inline">
                    · {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <h1 className="text-sm font-semibold text-foreground">Alfred</h1>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {conversation && (
              <button
                onClick={() => onDeleteConversation(conversation.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/30 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive active:scale-95"
                aria-label="Delete conversation"
                title="Delete conversation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="mx-auto max-w-3xl py-4">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/20">
                  <MessageSquare className="h-6 w-6 text-muted-foreground/20" />
                </div>
                <p className="text-sm font-medium text-muted-foreground/40">
                  No messages yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground/30">
                  Type a message or attach a file to start
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <ChatMessage key={msg.id} message={msg} index={index} />
              ))
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <ChatInput
        onSend={onSend}
        isStreaming={isStreaming}
        onCancel={onCancel}
        disabled={!conversation}
      />
    </div>
  );
}