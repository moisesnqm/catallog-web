"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * Client-side providers: Clerk (auth) and React Query.
 * When Clerk key is missing (e.g. build without env), only QueryClient is used so build succeeds.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  const content = (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  if (!clerkPubKey) {
    return content;
  }

  return <ClerkProvider publishableKey={clerkPubKey}>{content}</ClerkProvider>;
}
