"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { fetchCatalogos } from "@/lib/api/catalogos";
import type { CatalogosListParams } from "@/types/catalogo";

const CATALOGOS_QUERY_KEY = ["catalogos"];

/**
 * Fetches catalogos list with React Query. Uses Clerk token for API client.
 */
export function useCatalogos(params?: CatalogosListParams) {
  const { getToken } = useAuth();
  const client = useMemo(
    () => createApiClient(getToken ? () => getToken({ template: "default" }) : undefined),
    [getToken]
  );

  return useQuery({
    queryKey: [...CATALOGOS_QUERY_KEY, params?.sector, params?.page, params?.limit],
    queryFn: () => fetchCatalogos(client, params),
  });
}

export { CATALOGOS_QUERY_KEY };
