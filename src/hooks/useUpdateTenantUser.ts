"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { updateTenantUser } from "@/lib/api/admin-users";
import type { UpdateTenantUserBody } from "@/types/admin-users";
import { TENANT_USERS_QUERY_KEY } from "@/hooks/useTenantUsers";

/**
 * Updates role and/or sector_access of a tenant user. Admin only.
 */
export function useUpdateTenantUser() {
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
      clerkUserId,
      payload,
    }: {
      clerkUserId: string;
      payload: UpdateTenantUserBody;
    }) => updateTenantUser(client, clerkUserId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TENANT_USERS_QUERY_KEY });
    },
  });
}
