import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Section = ({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section id={id} className={cn("relative py-20 sm:py-28 scroll-mt-20", className)}>
    <div className="container">
      <div className="max-w-2xl mb-12 sm:mb-16">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs font-mono text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
          {title}
        </h2>
        {subtitle && <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">{subtitle}</p>}
      </div>
      {children}
    </div>
  </section>
);
