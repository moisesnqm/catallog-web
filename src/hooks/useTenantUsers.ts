"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { createApiClient } from "@/lib/api/client";
import { fetchTenantUsers } from "@/lib/api/admin-users";

const TENANT_USERS_QUERY_KEY = ["admin", "users"] as const;

/**
 * Fetches tenant users list (GET /admin/users). Admin only.
 */
export function useTenantUsers() {
  const { getToken } = useAuth();
  const client = useMemo(
    () =>
      createApiClient(
        getToken ? () => getToken({ template: "default" }) : undefined
      ),
    [getToken]
  );

  return useQuery({
    queryKey: TENANT_USERS_QUERY_KEY,
    queryFn: () => fetchTenantUsers(client),
  });
}

export { TENANT_USERS_QUERY_KEY };
