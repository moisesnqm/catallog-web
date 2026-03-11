"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { fetchAreas } from "@/lib/api/areas";
import type { AreasListParams } from "@/types/area";

const AREAS_QUERY_KEY = ["areas"] as const;

/**
 * Fetches areas list with React Query. Uses Clerk token for API client.
 */
export function useAreas(params?: AreasListParams) {
  const { getToken } = useAuth();
  const client = useMemo(
    () => createApiClient(getToken ? () => getToken({ template: "default" }) : undefined),
    [getToken]
  );

  return useQuery({
    queryKey: [...AREAS_QUERY_KEY, params?.sortBy, params?.sortOrder],
    queryFn: () => fetchAreas(client, params),
  });
}

export { AREAS_QUERY_KEY };
