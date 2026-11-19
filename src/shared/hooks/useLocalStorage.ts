// State đồng bộ với localStorage, chỉ đọc sau khi mount để HTML server và client khớp nhau; không ghi lại giá trị vừa đọc hay giá trị mặc định, chỉ ghi khi người dùng thật sự đổi
import { useEffect, useRef, useState } from 'react';

const STORAGE_PREFIX = 'vuichoi:';

function readStorage<T>(key: string): T | undefined {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? undefined : (JSON.parse(stored) as T);
  } catch {
    try {
      window.localStorage.removeItem(key);
    } catch {
      return undefined;
    }
    return undefined;
  }
}

function writeStorage(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Không lưu được "${key}"`, error);
  }
}

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const storageKey = STORAGE_PREFIX + key;
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const skipWrite = useRef(true);

  useEffect(() => {
    const stored = readStorage<T>(storageKey);
    if (stored !== undefined) setValue(stored);
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    if (skipWrite.current) {
      skipWrite.current = false;
      return;
    }
    writeStorage(storageKey, value);
  }, [hydrated, storageKey, value]);

  return [value, setValue, hydrated] as const;
}
