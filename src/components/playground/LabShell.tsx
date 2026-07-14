import { ReactNode, useState } from "react";
import { RotateCcw, Info, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabMeta } from "@/data/playgroundLabs";

type Props = {
  meta: LabMeta;
  children: ReactNode;
  onReset?: () => void;
  defaultOpen?: boolean;
  className?: string;
};

export const LabShell = ({ meta, children, onReset, defaultOpen = true, className }: Props) => {
  const [open, setOpen] = useState(defaultOpen);
  const [showLearn, setShowLearn] = useState(false);

  return (
    <article
      className={cn(
        "lab-card group relative rounded-2xl glass p-4 sm:p-5 flex flex-col gap-4",
        className
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {meta.category}
            </span>
            {meta.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted/40"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mt-2 font-display text-lg sm:text-xl font-semibold tracking-tight">
            {meta.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{meta.oneLiner}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            aria-label="What you'll learn"
            onClick={() => setShowLearn((s) => !s)}
            className={cn(
              "p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
              showLearn && "text-primary bg-primary/10"
            )}
          >
            <Info className="w-4 h-4" />
          </button>
          {onReset && (
            <button
              type="button"
              aria-label="Reset lab"
              onClick={onReset}
              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            aria-label={open ? "Collapse" : "Expand"}
            onClick={() => setOpen((o) => !o)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <ChevronDown
              className={cn("w-4 h-4 transition-transform", !open && "-rotate-90")}
            />
          </button>
        </div>
      </header>

      {showLearn && (
        <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc marker:text-primary/70">
          {meta.learn.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}

      {open && <div className="lab-body">{children}</div>}
    </article>
  );
};
