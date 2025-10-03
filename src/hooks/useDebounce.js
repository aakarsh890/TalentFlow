// hooks/useDebounce.js
import { useState, useEffect } from "react";

/**
 * Debounce a changing value
 * @param {any} value - value to debounce
 * @param {number} delay - milliseconds
 */
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
