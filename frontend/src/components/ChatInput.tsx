import { useState, useRef, useCallback, useEffect } from 'react';
import { Paperclip, X, StopCircle, ArrowUp } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatFileSize } from '../lib/utils';
import type { Attachment } from '../types';

interface ChatInputProps {
  onSend: (content: string, attachments?: Attachment[]) => void;
  isStreaming: boolean;
  onCancel: () => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = [
  '.txt', '.md', '.py', '.js', '.ts', '.jsx', '.tsx',
  '.json', '.csv', '.yaml', '.yml', '.pdf', '.doc', '.docx',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
  '.mp3', '.wav', '.ogg', '.m4a',
  '.zip', '.tar', '.gz',
];

export function ChatInput({ onSend, isStreaming, onCancel, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    let hasError = false;

    acceptedFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        hasError = true;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setAttachments((prev) => [
          ...prev,
          {
            id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            name: file.name,
            type: file.type,
            size: file.size,
            content: content.split(',')[1],
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (hasError) {
      // Could add toast notification
      console.warn('Some files exceeded the 10MB limit');
    }
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    maxSize: MAX_FILE_SIZE,
  });

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed && attachments.length === 0) return;
    onSend(trimmed, attachments.length > 0 ? attachments : undefined);
    setInput('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const canSend = input.trim().length > 0 || attachments.length > 0;

  return (
    <div className="border-t border-border/20 bg-gradient-to-t from-background via-background/95 to-transparent">
      <div
        {...getRootProps()}
        className="relative mx-auto max-w-3xl px-4 pb-4 pt-3"
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={(e) => {
            if (e.target.files) {
              onDrop(Array.from(e.target.files));
              e.target.value = '';
            }
          }}
          className="hidden"
          aria-label="Select files to attach"
        />

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-accent/50 bg-accent/5 backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                  <Paperclip className="h-5 w-5 text-accent" />
                </div>
                <p className="text-sm font-medium text-accent">Drop files to attach</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attachments preview */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-2 flex flex-wrap gap-2 overflow-hidden"
            >
              {attachments.map((att) => (
                <motion.div
                  key={att.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="group flex items-center gap-1.5 rounded-lg border border-border/20 bg-muted/20 px-2.5 py-1.5 text-xs"
                >
                  <span className="max-w-[120px] truncate text-muted-foreground">
                    {att.name}
                  </span>
                  <span className="text-muted-foreground/40">
                    {formatFileSize(att.size)}
                  </span>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground/30 transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remove ${att.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input bar */}
        <div
          className={cn(
            'flex items-end gap-2 rounded-xl border bg-muted/20 px-3 py-2 transition-all duration-200',
            'focus-within:border-accent/30 focus-within:bg-muted/30 focus-within:shadow-[0_0_0_1px_rgba(52,211,153,0.1)]',
            isDragActive && 'border-accent/50',
            isStreaming && 'border-accent/20',
          )}
        >
          {/* File upload button */}
          <button
            onClick={handleFileSelect}
            disabled={disabled}
            className={cn(
              'mb-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 active:scale-95',
              'text-muted-foreground/40 hover:bg-muted/40 hover:text-foreground',
              'disabled:opacity-20 disabled:cursor-not-allowed',
            )}
            aria-label="Attach file"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? 'Waiting for response...' : 'Message Alfred...'}
            rows={1}
            disabled={disabled}
            className={cn(
              'min-h-[24px] flex-1 resize-none bg-transparent text-sm text-foreground outline-none',
              'placeholder:text-muted-foreground/30',
              'disabled:opacity-30 disabled:cursor-not-allowed',
            )}
            aria-label="Message input"
          />

          {/* Send / Cancel button */}
          <div className="flex flex-shrink-0 items-center gap-1">
            {isStreaming ? (
              <button
                onClick={onCancel}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition-all duration-200 hover:bg-destructive/20 active:scale-95"
                aria-label="Stop generating"
                title="Stop"
              >
                <StopCircle className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSend}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 active:scale-95',
                  canSend
                    ? 'bg-accent text-white hover:bg-accent/90 hover:shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                    : 'text-muted-foreground/20',
                )}
                aria-label="Send message"
                title="Send message"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}