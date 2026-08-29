"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

// Lower number = higher priority
const PRIORITY = { "install-ios": 1, "install-android": 2, push: 3 };

const PromptContext = createContext(null);

export function PromptProvider({ children }) {
  const [slots, setSlots] = useState({});

  const register = useCallback((id, wants) => {
    setSlots((prev) => (prev[id] === wants ? prev : { ...prev, [id]: wants }));
  }, []);

  const activeSlot =
    Object.entries(slots)
      .filter(([, wants]) => wants)
      .sort((a, b) => (PRIORITY[a[0]] ?? 99) - (PRIORITY[b[0]] ?? 99))[0]?.[0] ?? null;

  return (
    <PromptContext.Provider value={{ register, activeSlot }}>
      {children}
    </PromptContext.Provider>
  );
}

export function usePromptSlot(id, wantsToShow) {
  const ctx = useContext(PromptContext);

  useEffect(() => {
    ctx?.register(id, wantsToShow);
  }, [wantsToShow]); // eslint-disable-line react-hooks/exhaustive-deps

  return ctx ? ctx.activeSlot === id : wantsToShow;
}
