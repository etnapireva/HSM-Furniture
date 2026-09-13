export function setTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem("auth-token", accessToken);
  if (refreshToken) localStorage.setItem("refresh-token", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("auth-token");
  localStorage.removeItem("refresh-token");
}

export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem("auth-token");
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["auth-token"] = token;

  return fetch(url, {
    ...options,
    headers,
  });
}
