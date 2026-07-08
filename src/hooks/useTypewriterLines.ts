"use client";

import { useEffect, useRef, useState } from "react";

export interface TypewriterState {
  readonly displayLines: readonly string[];
  readonly activeLineIndex: number;
  readonly showCursor: boolean;
}

const CHAR_MS = 32;
const LINE_PAUSE_MS = 380;
const LOOP_PAUSE_MS = 1600;

/**
 * Sequential character typing with loop.
 * Single timeout chain (no continuous rAF). Reduced motion → full static lines.
 */
export function useTypewriterLines(
  lines: readonly string[],
  reducedMotion: boolean
): TypewriterState {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "linePause" | "loopPause">(
    "typing"
  );
  const linesRef = useRef(lines);
  linesRef.current = lines;
  const linesKey = lines.join("\0");

  useEffect(() => {
    setLineIndex(0);
    setCharIndex(0);
    setPhase("typing");
  }, [linesKey]);

  useEffect(() => {
    if (reducedMotion || linesRef.current.length === 0) return;

    let delay = LOOP_PAUSE_MS;
    if (phase === "typing") delay = CHAR_MS;
    else if (phase === "linePause") delay = LINE_PAUSE_MS;

    const id = window.setTimeout(() => {
      const list = linesRef.current;

      if (phase === "typing") {
        const current = list[lineIndex] ?? "";
        if (charIndex < current.length) {
          setCharIndex((c) => c + 1);
        } else if (lineIndex < list.length - 1) {
          setPhase("linePause");
        } else {
          setPhase("loopPause");
        }
        return;
      }

      if (phase === "linePause") {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
        setPhase("typing");
        return;
      }

      setLineIndex(0);
      setCharIndex(0);
      setPhase("typing");
    }, delay);

    return () => clearTimeout(id);
  }, [charIndex, lineIndex, phase, reducedMotion, linesKey]);

  if (reducedMotion || lines.length === 0) {
    return {
      displayLines: lines,
      activeLineIndex: -1,
      showCursor: false,
    };
  }

  const displayLines = lines.slice(0, lineIndex + 1).map((line, i) => {
    if (i < lineIndex) return line;
    return line.slice(0, charIndex);
  });

  const showCursor = phase !== "loopPause";

  return {
    displayLines,
    activeLineIndex: showCursor ? lineIndex : -1,
    showCursor,
  };
}
