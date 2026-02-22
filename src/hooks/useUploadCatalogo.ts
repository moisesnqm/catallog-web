"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { uploadCatalogo } from "@/lib/api/catalogos";
import type { CatalogoUploadPayload } from "@/types/catalogo";
import { CATALOGOS_QUERY_KEY } from "./useCatalogos";

/**
 * Mutation to upload a catalog. Invalidates catalogos list on success.
 */
export function useUploadCatalogo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const client = useMemo(
    () => createApiClient(getToken ? () => getToken({ template: "default" }) : undefined),
    [getToken]
  );

  return useMutation({
    mutationFn: (payload: CatalogoUploadPayload) => uploadCatalogo(client, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATALOGOS_QUERY_KEY });
    },
  });
}
