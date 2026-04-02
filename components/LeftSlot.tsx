"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const Ctx = createContext<{ content: ReactNode; setContent: (n: ReactNode) => void }>({
  content: null,
  setContent: () => {},
});

export function LeftSlotProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null);
  return <Ctx.Provider value={{ content, setContent }}>{children}</Ctx.Provider>;
}

export function LeftSlotContent() {
  const { content } = useContext(Ctx);
  return <>{content}</>;
}

// Drop this in a page to inject content below the Nav in the left column
export function SetLeftSlot({ children }: { children: ReactNode }) {
  const { setContent } = useContext(Ctx);
  useEffect(() => {
    setContent(children);
    return () => setContent(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
