// hooks/useLocalStorage.js
import { useState, useEffect } from "react";

/**
 * useLocalStorage
 * @param {string} key - localStorage key
 * @param {any} initialValue
 */
export default function useLocalStorage(key, initialValue) {
  const readValue = () => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (err) {
      console.warn(`Error setting localStorage key "${key}":`, err);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
