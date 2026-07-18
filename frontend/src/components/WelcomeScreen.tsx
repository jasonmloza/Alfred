import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Code, FileText, Brain, MessageSquare, Zap, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

interface WelcomeScreenProps {
  onNewChat: () => void;
}

const suggestions = [
  {
    icon: Code,
    title: 'Write code',
    description: 'Generate, debug, or refactor in any language',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    icon: FileText,
    title: 'Summarize & analyze',
    description: 'Condense articles, docs, or uploads',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  {
    icon: Brain,
    title: 'Explain concepts',
    description: 'Break down complex topics simply',
    gradient: 'from-purple-500/20 to-purple-500/5',
  },
  {
    icon: MessageSquare,
    title: 'Draft content',
    description: 'Write emails, posts, or documentation',
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
];

const features = [
  { icon: Zap, label: 'Fast responses', description: 'Powered by Ollama' },
  { icon: Shield, label: 'Local-first', description: 'Your data stays private' },
];

export function WelcomeScreen({ onNewChat }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-center text-center"
      >
        {/* Logo with glow */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-accent/10 blur-2xl" />
          </div>
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-2 text-3xl font-bold tracking-tight gradient-text"
        >
          Welcome to Alfred
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-2 max-w-md text-sm text-muted-foreground/60 leading-relaxed"
        >
          Your local-first AI assistant. Fast, private, and powered by Ollama.
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mb-8 flex items-center gap-3"
        >
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-1.5 rounded-full bg-muted/20 px-3 py-1 text-[11px] font-medium text-muted-foreground/60"
            >
              <f.icon className="h-3 w-3" />
              {f.label}
            </div>
          ))}
        </motion.div>

        {/* Suggestions grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-8 grid grid-cols-2 gap-2.5"
        >
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
              onClick={onNewChat}
              className="group flex flex-col items-start gap-2 rounded-xl border border-border/20 bg-muted/10 p-3.5 text-left transition-all duration-200 hover:border-accent/25 hover:bg-accent/3 active:scale-[0.98]"
            >
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br transition-colors',
                suggestion.gradient,
                'group-hover:from-accent/20 group-hover:to-accent/5',
              )}>
                <suggestion.icon className="h-4 w-4 text-foreground/70" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{suggestion.title}</p>
                <p className="text-xs text-muted-foreground/50 mt-0.5">{suggestion.description}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* New chat CTA */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          onClick={onNewChat}
          className="group relative flex items-center gap-2 rounded-full border border-border/30 bg-muted/20 px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-accent/30 hover:bg-accent/5 active:scale-[0.97]"
        >
          <span>Start a conversation</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </motion.button>
      </motion.div>
    </div>
  );
}