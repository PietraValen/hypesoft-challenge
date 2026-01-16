export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const KEYCLOAK_CONFIG = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "hypesoft",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "hypesoft-frontend",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const STOCK_THRESHOLD = 10;
