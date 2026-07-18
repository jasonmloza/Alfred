import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check, Terminal } from 'lucide-react';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group relative my-3 overflow-hidden rounded-lg border border-border/20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/20 bg-muted/30 px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <Terminal className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground/60 transition-all duration-200 hover:bg-muted/50 hover:text-foreground active:scale-95"
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-accent" />
              <span className="text-accent">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <pre className="overflow-x-auto bg-background/50 p-4 text-sm leading-relaxed">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Partial<Components> = useMemo(
    () => ({
      code({ className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        const code = String(children).replace(/\n$/, '');

        // Only render inline code if there's no language match and no newlines
        if (!match && !code.includes('\n')) {
          return (
            <code
              className="rounded bg-muted/40 px-1.5 py-0.5 text-[0.875em] font-mono text-accent"
              {...props}
            >
              {children}
            </code>
          );
        }

        return <CodeBlock language={match?.[1] || 'text'} code={code} />;
      },
      pre({ children }) {
        // Handled by code component above
        return <>{children}</>;
      },
      // Style other markdown elements
      p({ children }) {
        return <p className="mb-3 leading-relaxed last:mb-0">{children}</p>;
      },
      ul({ children }) {
        return <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>;
      },
      ol({ children }) {
        return <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>;
      },
      li({ children }) {
        return <li className="leading-relaxed">{children}</li>;
      },
      h1({ children }) {
        return <h1 className="mb-3 mt-5 text-xl font-bold text-foreground first:mt-0">{children}</h1>;
      },
      h2({ children }) {
        return <h2 className="mb-2 mt-4 text-lg font-semibold text-foreground first:mt-0">{children}</h2>;
      },
      h3({ children }) {
        return <h3 className="mb-2 mt-3 text-base font-semibold text-foreground first:mt-0">{children}</h3>;
      },
      blockquote({ children }) {
        return (
          <blockquote className="my-3 border-l-2 border-accent/40 pl-4 italic text-muted-foreground">
            {children}
          </blockquote>
        );
      },
      a({ href, children }) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent/80"
          >
            {children}
          </a>
        );
      },
      hr() {
        return <hr className="my-4 border-border/20" />;
      },
      table({ children }) {
        return (
          <div className="my-3 overflow-x-auto rounded-lg border border-border/20">
            <table className="min-w-full divide-y divide-border/20 text-sm">
              {children}
            </table>
          </div>
        );
      },
      th({ children }) {
        return <th className="bg-muted/20 px-3 py-2 text-left font-semibold text-foreground">{children}</th>;
      },
      td({ children }) {
        return <td className="border-t border-border/10 px-3 py-2 text-muted-foreground">{children}</td>;
      },
    }),
    [],
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}