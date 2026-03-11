"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { linkUser } from "@/lib/api/admin-users";
import type { LinkUserBody } from "@/types/admin-users";
import { TENANT_USERS_QUERY_KEY } from "@/hooks/useTenantUsers";

/**
 * Links a user to the current tenant by email. Admin only.
 */
export function useLinkUser() {
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
    mutationFn: (payload: LinkUserBody) => linkUser(client, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_USERS_QUERY_KEY });
    },
  });
}
