import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, RefreshCw, SendHorizonal, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichText } from "@/components/rich-text";
import { cn } from "@/lib/utils";
import { INSTITUTE, type Lead } from "@/lib/demo-data";
import {
  generateReply,
  initialState,
  WELCOME,
  WELCOME_QUICK,
  type ChatMessage,
  type ChatState,
} from "@/lib/chat-engine";
import { addLead } from "@/lib/leads-store";

let seq = 0;
const nextId = () => `m${++seq}`;

function welcomeMessage(): ChatMessage {
  return {
    id: "m0",
    role: "assistant",
    content: WELCOME,
    quickReplies: WELCOME_QUICK,
    createdAt: Date.now(),
  };
}

export function AssistantChat({
  className,
  onLead,
  compact = false,
}: {
  className?: string;
  onLead?: (lead: Lead) => void;
  compact?: boolean;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage()]);
  const [state, setState] = useState<ChatState>(initialState);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || thinking) return;
      setInput("");
      setMessages((m) => [
        ...m,
        { id: nextId(), role: "user", content: text, createdAt: Date.now() },
      ]);
      setThinking(true);
      try {
        const turn = await generateReply(text, state);
        setState(turn.state);
        setMessages((m) => [
          ...m,
          {
            id: nextId(),
            role: "assistant",
            content: turn.reply,
            createdAt: Date.now(),
            ...(turn.quickReplies ? { quickReplies: turn.quickReplies } : {}),
          },
        ]);
        if (turn.lead) {
          addLead(turn.lead);
          onLead?.(turn.lead);
          toast.success(`Lead ${turn.lead.id} captured`, {
            description: `${turn.lead.name} · ${turn.lead.quality} (${turn.lead.score}/100)`,
          });
        }
      } finally {
        setThinking(false);
      }
    },
    [onLead, state, thinking],
  );

  const reset = () => {
    setMessages([welcomeMessage()]);
    setState(initialState);
    setInput("");
  };

  const last = messages[messages.length - 1];
  const quick = !thinking && last?.role === "assistant" ? (last.quickReplies ?? []) : [];

  return (
    <div
      className={cn(
        "glass-panel shadow-card flex flex-col overflow-hidden rounded-2xl",
        compact ? "h-[460px]" : "h-[620px] max-h-[78vh]",
        className,
      )}
    >
      <div className="border-border/70 bg-surface-2/60 flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-brand text-primary-foreground flex size-9 items-center justify-center rounded-full">
            <Bot className="size-4.5" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{INSTITUTE.name} · Admission Assistant</p>
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span className="bg-success size-1.5 rounded-full" aria-hidden />
              Online · replies instantly
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={reset} aria-label="Restart conversation">
          <RefreshCw className="size-3.5" />
          <span className="hidden sm:inline">Restart</span>
        </Button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex gap-2.5", m.role === "user" ? "justify-end" : "justify-start")}
          >
            {m.role === "assistant" ? (
              <span className="bg-secondary text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                <Bot className="size-3.5" aria-hidden />
              </span>
            ) : null}
            <div
              className={cn(
                "max-w-[82%] rounded-2xl px-4 py-2.5",
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-surface-2 text-foreground border-border/70 rounded-bl-sm border",
              )}
            >
              <RichText text={m.content} />
            </div>
            {m.role === "user" ? (
              <span className="bg-secondary text-muted-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                <User className="size-3.5" aria-hidden />
              </span>
            ) : null}
          </div>
        ))}

        {thinking ? (
          <div className="flex items-center gap-2.5">
            <span className="bg-secondary text-primary flex size-7 items-center justify-center rounded-full">
              <Bot className="size-3.5" aria-hidden />
            </span>
            <div className="bg-surface-2 border-border/70 flex items-center gap-1 rounded-2xl rounded-bl-sm border px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="bg-muted-foreground size-1.5 animate-bounce rounded-full"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
              <span className="sr-only">Assistant is typing</span>
            </div>
          </div>
        ) : null}
      </div>

      {quick.length ? (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => void send(q)}
              className="border-border bg-surface hover:border-primary/60 hover:text-primary cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="border-border/70 bg-surface-2/40 flex items-center gap-2 border-t px-3 py-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          Message the admission assistant
        </label>
        <Input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about fees, batches, scholarships…"
          autoComplete="off"
          className="bg-background/60 h-10"
        />
        <Button type="submit" variant="brand" size="icon" disabled={!input.trim() || thinking}>
          <SendHorizonal className="size-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
