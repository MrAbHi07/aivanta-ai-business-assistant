import { Fragment } from "react";

/** Minimal inline formatter for **bold**, _italic_ and bullet lines. */
function inline(text: string, keyBase: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyBase}-${i}`} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("_") && part.endsWith("_")) {
      return (
        <em key={`${keyBase}-${i}`} className="text-muted-foreground text-[0.9em]">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={`${keyBase}-${i}`}>{part}</Fragment>;
  });
}

export function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />;
        if (line.trimStart().startsWith("•")) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-primary select-none">•</span>
              <span>{inline(line.replace(/^\s*•\s*/, ""), String(i))}</span>
            </div>
          );
        }
        return <p key={i}>{inline(line, String(i))}</p>;
      })}
    </div>
  );
}
