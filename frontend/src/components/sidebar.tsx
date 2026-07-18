import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Trash2,
  Plus,
  PanelLeftClose,
  History,
  Sparkles,
  Search,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type { Conversation } from '../types';
import { cn, formatTime, truncate } from '../lib/utils';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = searchQuery.trim()
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : conversations;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onToggle}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          'fixed left-0 top-0 z-40 h-full overflow-hidden border-r border-border/30',
          'flex flex-col',
          'bg-background',
        )}
        role="navigation"
        aria-label="Conversation history"
      >
        <div className="flex-shrink-0 p-3" style={{ minWidth: 280 }}>
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-accent/20 blur-sm" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground">
                Alfred
              </span>
            </div>
            <button
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/50 transition-all duration-200 hover:bg-muted/50 hover:text-foreground active:scale-95"
              aria-label="Close sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          {/* New chat button */}
          <button
            onClick={onNew}
            className="group flex w-full items-center gap-2 rounded-lg border border-border/30 px-3 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 active:scale-[0.98]"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
              <Plus className="h-3.5 w-3.5" />
            </div>
            <span>New conversation</span>
          </button>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full rounded-lg border border-border/20 bg-muted/30 py-1.5 pl-8 pr-8 text-xs text-foreground placeholder-muted-foreground/40 outline-none transition-all duration-200 focus:border-accent/30 focus:bg-muted/50"
              aria-label="Search conversations"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-border/20" />
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin" style={{ minWidth: 280 }}>
          {filtered.length === 0 ? (
            <div className="mt-12 flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/30">
                <History className="h-5 w-5 text-muted-foreground/30" />
              </div>
              <p className="text-xs font-medium text-muted-foreground/50">
                {searchQuery ? 'No matching conversations' : 'No conversations yet'}
              </p>
              <p className="text-[11px] text-muted-foreground/30 max-w-[180px]">
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start a new chat to begin'}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5" role="list" aria-label="Conversations">
              {filtered.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.015, duration: 0.2 }}
                  onClick={() => onSelect(conv.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(conv.id);
                    }
                  }}
                  className={cn(
                    'group relative flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all duration-200',
                    'hover:bg-muted/30',
                    activeId === conv.id
                      ? 'bg-accent/8 text-foreground'
                      : 'text-muted-foreground',
                  )}
                  role="button"
                  tabIndex={0}
                  aria-current={activeId === conv.id ? 'page' : undefined}
                >
                  <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-40" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">
                      {truncate(conv.title, 40)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground/40">
                      {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''} · {formatTime(conv.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className={cn(
                      'mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground/30 opacity-0 transition-all duration-200',
                      'hover:bg-destructive/10 hover:text-destructive',
                      'group-hover:opacity-100 focus-visible:opacity-100',
                    )}
                    aria-label={`Delete conversation: ${conv.title}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}