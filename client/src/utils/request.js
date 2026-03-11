import api from "../api/client.js";

export async function authedRequest(getToken, config) {
  const token = await getToken();
  const headers = { ...(config.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  return api({ ...config, headers });
}
