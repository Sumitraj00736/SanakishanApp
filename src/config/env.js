const devFallbackApi = "http://localhost:4000/api";
const configuredApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!configuredApiBaseUrl && !__DEV__) {
  throw new Error("EXPO_PUBLIC_API_BASE_URL is required for production builds");
}

export const API_BASE_URL = configuredApiBaseUrl || devFallbackApi;

export const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, "");
