"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { deleteArea } from "@/lib/api/areas";
import { AREAS_QUERY_KEY } from "@/hooks/useAreas";

const AREA_QUERY_KEY_PREFIX = ["area"] as const;

/**
 * Deletes an area and invalidates areas list and single area. Admin or manager only.
 */
export function useDeleteArea() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const getTokenRef = useMemo(() => getToken ?? undefined, [getToken]);

  return useMutation({
    mutationFn: async (id: string) => {
      const client = createApiClient(
        getTokenRef ? () => getTokenRef({ template: "default" }) : undefined
      );
      await deleteArea(client, id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: AREAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...AREA_QUERY_KEY_PREFIX, id] });
    },
  });
}
