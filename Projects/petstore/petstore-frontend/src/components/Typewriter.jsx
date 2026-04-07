import { useState, useEffect } from "react";

/**
 * Typewriter — renders text one character at a time with a blinking cursor.
 * Props:
 *   text   — the string to type out
 *   speed  — ms per character (default 45)
 *   delay  — ms to wait before starting (default 0)
 */
export default function Typewriter({ text = "", speed = 45, delay = 0 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;

    const chars = [...text]; // spread handles emoji as single units
    let i = 0;

    const startTyping = () => {
      const timer = setInterval(() => {
        i++;
        setDisplayed(chars.slice(0, i).join(""));
        if (i >= chars.length) {
          clearInterval(timer);
          setDone(true);
        }
      }, speed);
      return timer;
    };

    let typingTimer;
    if (delay > 0) {
      const delayTimer = setTimeout(() => {
        typingTimer = startTyping();
      }, delay);
      return () => {
        clearTimeout(delayTimer);
        clearInterval(typingTimer);
      };
    } else {
      typingTimer = startTyping();
      return () => clearInterval(typingTimer);
    }
  }, [text, speed, delay]);

  return (
    <span>
      <style>{`@keyframes tw-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
      {displayed}
      {!done && (
        <span style={{ animation: "tw-blink 0.75s step-end infinite", marginLeft: "1px" }}>
          |
        </span>
      )}
    </span>
  );
}
