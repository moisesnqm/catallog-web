"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { createApiClient } from "@/lib/api/client";
import { fetchCurrentUserProfile } from "@/lib/api/me";

const ME_QUERY_KEY = ["me", "profile"];

/**
 * Fetches the current user profile (role, tenantId) from the backend.
 * Used for RBAC: role comes from the database, not from Clerk publicMetadata.
 * Client is created inside the queryFn so the request always uses the current token.
 */
export function useCurrentUserProfile() {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      const tokenFn = getToken ? () => getToken({ template: "default" }) : undefined;
      const client = createApiClient(tokenFn);
      return fetchCurrentUserProfile(client);
    },
    staleTime: 5 * 60 * 1000,
  });
}
