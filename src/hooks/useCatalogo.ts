"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { fetchCatalogo } from "@/lib/api/catalogos";

const CATALOGO_QUERY_KEY_PREFIX = ["catalogo"];

/**
 * Fetches a single catalog by ID with React Query. Uses Clerk token for API client.
 * Disabled when id is null or empty.
 */
export function useCatalogo(id: string | null) {
  const { getToken } = useAuth();
  const client = useMemo(
    () => createApiClient(getToken ? () => getToken({ template: "default" }) : undefined),
    [getToken]
  );

  return useQuery({
    queryKey: [...CATALOGO_QUERY_KEY_PREFIX, id ?? ""],
    queryFn: () => fetchCatalogo(client, id!),
    enabled: Boolean(id?.trim()),
  });
}
