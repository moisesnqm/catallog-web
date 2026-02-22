import axios, { type AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type GetToken = () => Promise<string | null>;

/**
 * Creates an Axios instance for the backend API. Attaches Clerk token on each request.
 * Pass getToken from useAuth() when calling from the client.
 */
export function createApiClient(getToken?: GetToken): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30_000,
  });

  client.interceptors.request.use(async (config) => {
    if (getToken) {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  return client;
}
