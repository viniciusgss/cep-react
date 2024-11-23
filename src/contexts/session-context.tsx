"use client";
import { createContext, ReactNode, useContext, useState } from "react";

const SessionContext = createContext<null | any>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(null);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
