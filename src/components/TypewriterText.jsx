import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Typewriter = ({
  text,
  delay = 0,
  speed = 100,
  className = "",
  showCursor = true,
  cursorClassName = "",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <motion.span
          className={`inline-block ${cursorClassName}`}
          animate={{ opacity: isComplete ? 0 : [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: isComplete ? 0 : Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          |
        </motion.span>
      )}
    </span>
  );
};

export default Typewriter;
