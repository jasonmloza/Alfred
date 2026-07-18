import { motion } from 'framer-motion';
import { User, Bot, AlertCircle, Loader2, FileText, Image, File, Music, Code } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { cn, formatFileSize } from '../lib/utils';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  index: number;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('audio/')) return Music;
  if (mimeType.startsWith('text/')) return FileText;
  if (mimeType.includes('javascript') || mimeType.includes('python') || mimeType.includes('typescript')) return Code;
  return File;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';
  const isSending = message.status === 'sending';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.3), ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'flex w-full gap-3 px-4 py-3',
        isUser ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'flex max-w-[85%] gap-3 md:max-w-[75%]',
          isUser && 'flex-row-reverse',
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            'mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl',
            isUser
              ? 'bg-accent/10 text-accent'
              : 'bg-primary/20 text-primary',
          )}
          aria-hidden="true"
        >
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>

        {/* Message content */}
        <div className={cn('min-w-0', isUser && 'flex flex-col items-end')}>
          {/* Role label + timestamp */}
          <div className={cn('mb-1 flex items-center gap-2', isUser ? 'flex-row-reverse' : '')}>
            <p className="text-[11px] font-medium text-muted-foreground/40">
              {isUser ? 'You' : 'Alfred'}
            </p>
            {message.timestamp && (
              <span className="text-[10px] text-muted-foreground/25">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {/* Bubble */}
          <div
            className={cn(
              'rounded-2xl px-4 py-3 text-sm leading-relaxed',
              isUser
                ? 'bg-accent/10 text-foreground'
                : 'glass-card',
              isError && 'border border-destructive/30 bg-destructive/5',
            )}
          >
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {message.attachments.map((att) => {
                  const FileIcon = getFileIcon(att.type);
                  return (
                    <span
                      key={att.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-muted/30 px-2.5 py-1.5 text-[11px] text-muted-foreground/80"
                    >
                      <FileIcon className="h-3.5 w-3.5" />
                      {att.name}
                      <span className="text-muted-foreground/40">({formatFileSize(att.size)})</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Content */}
            {isSending && !message.content ? (
              <div className="flex items-center gap-2.5 py-2">
                <div className="relative">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  <div className="absolute inset-0 h-4 w-4 animate-pulse rounded-full bg-accent/10" />
                </div>
                <span className="text-muted-foreground/50 text-sm">Thinking...</span>
              </div>
            ) : isError ? (
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-destructive">Failed to get response</p>
                  <p className="mt-1 text-xs text-muted-foreground/60 leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}