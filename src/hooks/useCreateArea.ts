"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { createArea } from "@/lib/api/areas";
import type { CreateAreaPayload } from "@/types/area";
import { AREAS_QUERY_KEY } from "@/hooks/useAreas";

/**
 * Creates an area and invalidates areas list. Admin or manager only.
 */
export function useCreateArea() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const client = useMemo(
    () => createApiClient(getToken ? () => getToken({ template: "default" }) : undefined),
    [getToken]
  );

  return useMutation({
    mutationFn: (payload: CreateAreaPayload) => createArea(client, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AREAS_QUERY_KEY });
    },
  });
}
