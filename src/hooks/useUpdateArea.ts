"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { updateArea } from "@/lib/api/areas";
import type { UpdateAreaPayload } from "@/types/area";
import { AREAS_QUERY_KEY } from "@/hooks/useAreas";

const AREA_QUERY_KEY_PREFIX = ["area"] as const;

/**
 * Updates an area and invalidates areas list and single area. Admin or manager only.
 */
export function useUpdateArea() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const client = useMemo(
    () => createApiClient(getToken ? () => getToken({ template: "default" }) : undefined),
    [getToken]
  );

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAreaPayload }) =>
      updateArea(client, id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: AREAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...AREA_QUERY_KEY_PREFIX, id] });
    },
  });
}
