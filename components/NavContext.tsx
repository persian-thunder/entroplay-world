"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const Ctx = createContext<{
  pendingHref: string | null;
  setPendingHref: (href: string | null) => void;
}>({ pendingHref: null, setPendingHref: () => {} });

export function NavContextProvider({ children }: { children: ReactNode }) {
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  return <Ctx.Provider value={{ pendingHref, setPendingHref }}>{children}</Ctx.Provider>;
}

export function useNavContext() {
  return useContext(Ctx);
}
