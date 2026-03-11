"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { updateCatalogo } from "@/lib/api/catalogos";
import type { UpdateCatalogoPayload } from "@/types/catalogo";
import { CATALOGOS_QUERY_KEY } from "@/hooks/useCatalogos";

const CATALOGO_QUERY_KEY_PREFIX = ["catalogo"] as const;

/**
 * Updates catalog metadata and invalidates list and single-catalog queries.
 * Use for admin, manager, superadmin only; backend returns 403 for other roles.
 */
export function useUpdateCatalogo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const client = useMemo(
    () =>
      createApiClient(
        getToken ? () => getToken({ template: "default" }) : undefined
      ),
    [getToken]
  );

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCatalogoPayload;
    }) => updateCatalogo(client, id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CATALOGOS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: [...CATALOGO_QUERY_KEY_PREFIX, id],
      });
    },
  });
}
