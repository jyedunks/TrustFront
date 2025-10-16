import { BASE_URL } from "../constants";

export async function api(path, options = {}) {
  const token = localStorage.getItem("access_token");
  const headers = { ...(options.headers || {}) };

  if (token) headers.Authorization = `Bearer ${token}`;
  headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
    return;
  }
  return res;
}