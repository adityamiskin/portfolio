import { type ElementType, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const DURATION_MS = 800;
const TICK_MS = 40;

export function TextScramble({
  children: text,
  as: Component = "p",
  className,
}: {
  children: string;
  as?: ElementType;
  className?: string;
}) {
  const [scrambled, setScrambled] = useState<string | null>(null);

  useEffect(() => {
    const steps = DURATION_MS / TICK_MS;
    let step = 0;
    const interval = setInterval(() => {
      const revealed = (step / steps) * text.length;
      setScrambled(
        [...text]
          .map((ch, i) =>
            ch === " " || i < revealed ? ch : CHARS[Math.floor(Math.random() * CHARS.length)],
          )
          .join(""),
      );
      if (++step > steps) {
        clearInterval(interval);
        setScrambled(null);
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [text]);

  // The real text always holds the layout (and stays readable to screen readers); random
  // glyphs have different widths, and letting them reflow made the hero wrap/unwrap on mobile.
  return (
    <Component className={cn("relative inline-block", className)}>
      <span className={scrambled === null ? undefined : "text-transparent"}>{text}</span>
      {scrambled === null ? null : (
        <span aria-hidden className="absolute inset-0 overflow-hidden whitespace-nowrap">
          {scrambled}
        </span>
      )}
    </Component>
  );
}
