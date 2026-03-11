"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { unlinkTenantUser } from "@/lib/api/admin-users";
import { TENANT_USERS_QUERY_KEY } from "@/hooks/useTenantUsers";

/**
 * Unlinks a user from the current tenant. Admin only.
 */
export function useUnlinkTenantUser() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const getTokenRef = useMemo(() => getToken ?? undefined, [getToken]);

  return useMutation({
    mutationFn: async (clerkUserId: string) => {
      const client = createApiClient(
        getTokenRef ? () => getTokenRef({ template: "default" }) : undefined
      );
      await unlinkTenantUser(client, clerkUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_USERS_QUERY_KEY });
    },
  });
}
