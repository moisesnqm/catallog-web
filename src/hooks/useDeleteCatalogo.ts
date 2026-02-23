"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { deleteCatalogo } from "@/lib/api/catalogos";
import { CATALOGOS_QUERY_KEY } from "@/hooks/useCatalogos";

const CATALOGO_QUERY_KEY_PREFIX = ["catalogo"] as const;

/**
 * Deletes a catalog and invalidates list and single-catalog queries.
 * Use for admin/manager only; backend returns 403 for other roles.
 */
export function useDeleteCatalogo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const getTokenRef = useMemo(() => getToken ?? undefined, [getToken]);

  return useMutation({
    mutationFn: async (id: string) => {
      const client = createApiClient(
        getTokenRef ? () => getTokenRef({ template: "default" }) : undefined
      );
      await deleteCatalogo(client, id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CATALOGOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...CATALOGO_QUERY_KEY_PREFIX, id] });
    },
  });
}
