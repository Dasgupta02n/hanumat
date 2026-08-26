"use client";

import { createContext, useContext, type ReactNode } from "react";
import { deities, type DeityId, type DeityConfig } from "@/lib/deities";

const DeityContext = createContext<DeityConfig>(deities.hanuman);

export function DeityProvider({
  deity,
  children,
}: {
  deity: DeityId;
  children: ReactNode;
}) {
  return (
    <DeityContext.Provider value={deities[deity]}>
      {children}
    </DeityContext.Provider>
  );
}

export function useDeity(): DeityConfig {
  return useContext(DeityContext);
}
