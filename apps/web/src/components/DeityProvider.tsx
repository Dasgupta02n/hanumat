"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { deities, type DeityId, type DeityConfig } from "@/lib/deities";
import { saveLastMandir } from "@/lib/last-mandir";

const DeityContext = createContext<DeityConfig>(deities.hanuman);

export function DeityProvider({
  deity,
  children,
}: {
  deity: DeityId;
  children: ReactNode;
}) {
  useEffect(() => {
    saveLastMandir(deity);
  }, [deity]);

  return (
    <DeityContext.Provider value={deities[deity]}>
      {children}
    </DeityContext.Provider>
  );
}

export function useDeity(): DeityConfig {
  return useContext(DeityContext);
}
