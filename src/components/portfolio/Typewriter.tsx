import { useEffect, useState } from "react";

export const Typewriter = ({ phrases, speed = 70, pause = 1400 }: { phrases: string[]; speed?: number; pause?: number }) => {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = phrases[i % phrases.length];
    const done = !del && text === current;
    const empty = del && text === "";
    if (done) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (empty) {
      setDel(false);
      setI((v) => v + 1);
      return;
    }
    const t = setTimeout(() => {
      setText(del ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [text, del, i, phrases, speed, pause]);

  return (
    <span className="gradient-text font-display">
      {text}
      <span className="inline-block w-[2px] h-[0.9em] bg-primary align-middle ml-1 animate-blink" />
    </span>
  );
};
