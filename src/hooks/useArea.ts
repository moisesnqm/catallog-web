"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { fetchArea } from "@/lib/api/areas";

const AREA_QUERY_KEY_PREFIX = ["area"] as const;

/**
 * Fetches a single area by ID with React Query. Uses Clerk token for API client.
 * Disabled when id is null or empty.
 */
export function useArea(id: string | null) {
  const { getToken } = useAuth();
  const client = useMemo(
    () => createApiClient(getToken ? () => getToken({ template: "default" }) : undefined),
    [getToken]
  );

  return useQuery({
    queryKey: [...AREA_QUERY_KEY_PREFIX, id ?? ""],
    queryFn: () => fetchArea(client, id!),
    enabled: Boolean(id?.trim()),
  });
}
