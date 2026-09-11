import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Paperclip, Mic, Trash2, Copy, ThumbsUp, ThumbsDown, RotateCw, MoreHorizontal, Sparkles, FileText, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { AssistantMessage, ChatSession } from '@/types';
import { assistantService } from '@/services';
import { QUICK_PROMPTS, AI_NOT_CONNECTED } from '@/data/constants';
import { useLanguage } from '@/hooks/use-language';
import { useSettings } from '@/hooks/use-settings';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { LoadingState } from '@/components/shared/state-components';
import { DemoBadge, DisclaimerBanner } from '@/components/shared/trust-badges';
import { CitationPanel } from '@/components/shared/source-citation';
import { toast } from '@/hooks/use-toast';

// ============================================================
// AI Assistant — chat interface
// ============================================================

const SESSION_ID = 'default-session';

function createSession(language: string): ChatSession {
  return {
    id: SESSION_ID,
    title: 'BIS AI Assistant Conversation',
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    language,
  };
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function AssistantPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { settings } = useSettings();
  const [session, setSession] = useState<ChatSession>(() => createSession(language));
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages]);

  const updateMessage = useCallback((id: string, updates: Partial<AssistantMessage>) => {
    setSession((prev) => ({
      ...prev,
      messages: prev.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  }, []);

  const handleSend = useCallback(async (text?: string) => {
    const queryText = (text || input).trim();
    if (!queryText || isSending) return;

    const userMessage: AssistantMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toISOString(),
      status: 'complete',
    };

    const loadingMessage: AssistantMessage = {
      id: `msg-${Date.now()}-loading`,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      status: 'loading',
    };

    setSession((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage, loadingMessage],
      updatedAt: new Date().toISOString(),
    }));
    setInput('');
    setIsSending(true);

    const result = await assistantService.sendMessage(queryText, language);

    if (result.error || !result.data) {
      updateMessage(loadingMessage.id, {
        content: 'Sorry, there was an error processing your request.',
        status: 'error',
      });
    } else {
      updateMessage(loadingMessage.id, result.data);
    }
    setIsSending(false);
  }, [input, isSending, language, updateMessage]);

  const handleRegenerate = useCallback(async (messageId: string) => {
    setIsSending(true);
    const result = await assistantService.regenerateResponse(messageId, language);
    if (result.data) {
      updateMessage(messageId, result.data);
    }
    setIsSending(false);
  }, [language, updateMessage]);

  const handleClear = useCallback(() => {
    setSession(createSession(language));
    setInput('');
    toast({ title: 'Conversation cleared' });
  }, [language]);

  const handleCopy = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied to clipboard' });
  }, []);

  const handleFeedback = useCallback((id: string, helpful: boolean) => {
    updateMessage(id, { helpful });
    toast({ title: helpful ? 'Marked as helpful' : 'Marked as not helpful' });
  }, [updateMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = session.messages.length > 0;
  const showSources = settings.showSources;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-foreground">BIS AI Assistant</h1>
              <DemoBadge label="Demo Mode" />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Ask questions about Indian Standards and BIS services.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={!hasMessages || isSending}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <Sparkles className="h-8 w-8" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Ask the BIS Assistant
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                {AI_NOT_CONNECTED}. Try one of the prompts below to see how the interface works.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-xl">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleSend(prompt.text)}
                    className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {session.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              showSources={showSources}
              onCopy={() => handleCopy(message.content)}
              onRegenerate={() => handleRegenerate(message.id)}
              onFeedback={(helpful) => handleFeedback(message.id, helpful)}
              compact={settings.compactChat}
            />
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat composer */}
      <div className="border-t border-border bg-card px-4 lg:px-8 py-4">
        <div className="max-w-3xl mx-auto">
          {/* Quick prompts row */}
          {hasMessages && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {QUICK_PROMPTS.slice(0, 3).map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => setInput(prompt.text)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 rounded-xl border border-input bg-background p-2 focus-within:ring-2 focus-within:ring-ring">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Attach file" disabled>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about a product, standard, certification, testing or BIS service…"
              className="min-h-[40px] max-h-32 resize-none border-0 focus-visible:ring-0 text-sm"
              rows={1}
              aria-label="Chat input"
            />
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Voice input (placeholder)" disabled>
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => handleSend()}
              disabled={!input.trim() || isSending}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            Demo responses for UI demonstration. AI service will be connected in Phase 2.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Individual chat message
// ============================================================

function ChatMessage({
  message,
  showSources,
  onCopy,
  onRegenerate,
  onFeedback,
  compact,
}: {
  message: AssistantMessage;
  showSources: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
  onFeedback: (helpful: boolean) => void;
  compact: boolean;
}) {
  const isUser = message.role === 'user';
  const isLoading = message.status === 'loading';

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-[80%]">
          <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 text-sm">
            {message.content}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 text-right">{formatTimestamp(message.timestamp)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex gap-3 animate-slide-up', compact ? 'py-2' : 'py-1')}>
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
      </div>

      {/* Message body */}
      <div className="flex-1 min-w-0 space-y-3">
        {isLoading ? (
          <LoadingState message="Generating response…" className="py-6" />
        ) : (
          <>
            {/* Demo badge */}
            {message.isDemo && (
              <DemoBadge label="Demo response" />
            )}

            {/* Answer text */}
            <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3 text-sm leading-relaxed">
              {message.content}
            </div>

            {/* Structured sections */}
            {message.sections && message.sections.length > 0 && (
              <div className="space-y-2.5">
                {message.sections.map((section) => (
                  <div key={section.id} className="rounded-lg border border-border bg-card px-4 py-3">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                      {section.label}
                    </p>
                    <ul className="space-y-1.5">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5 shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {section.type === 'standard' && section.items.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => {/* Navigate to standard details in Phase 2 */}}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        View Standard Details
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Sources / Citations */}
            {showSources && message.sources && message.sources.length > 0 && (
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                  <FileText className="h-3.5 w-3.5" />
                  Sources used ({message.sources.length})
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <CitationPanel sources={message.sources} />
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* No source available notice */}
            {showSources && (!message.sources || message.sources.length === 0) && message.status === 'demo' && (
              <div className="rounded-lg border border-dashed px-4 py-2.5 text-center">
                <p className="text-xs text-muted-foreground">No verified source is available for this response.</p>
              </div>
            )}

            {/* Action bar */}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[10px] text-muted-foreground mr-2">{formatTimestamp(message.timestamp)}</span>
              <ActionButton onClick={onCopy} label="Copy" icon={Copy} />
              <ActionButton
                onClick={() => onFeedback(true)}
                label="Helpful"
                icon={ThumbsUp}
                active={message.helpful === true}
              />
              <ActionButton
                onClick={() => onFeedback(false)}
                label="Not helpful"
                icon={ThumbsDown}
                active={message.helpful === false}
              />
              <ActionButton onClick={onRegenerate} label="Regenerate" icon={RotateCw} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground" aria-label="More actions">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={onCopy}>Copy text</DropdownMenuItem>
                  <DropdownMenuItem onClick={onRegenerate}>Regenerate response</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ActionButton({ onClick, label, icon: Icon, active }: { onClick: () => void; label: string; icon: typeof Copy; active?: boolean }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'h-7 px-2 text-xs text-muted-foreground hover:text-foreground',
        active && 'text-success',
      )}
      onClick={onClick}
      aria-label={label}
    >
      <Icon className="h-3.5 w-3.5" />
    </Button>
  );
}
