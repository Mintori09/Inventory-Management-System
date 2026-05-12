"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

async function initMsw() {
  if (typeof window !== "undefined" && (process.env.NEXT_PUBLIC_API_MOCK === "true" || process.env.NODE_ENV === "development")) {
    const { worker } = await import("@/mocks/browser");
    await worker.start({ onUnhandledRequest: "bypass" });
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
        },
      })
  );

  useEffect(() => {
    initMsw();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
