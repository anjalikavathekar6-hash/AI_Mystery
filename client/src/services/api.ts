const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
export async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${base}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Session-Token': token } : {}), ...options.headers } });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error?.message || 'Something went wrong. Please try again.');
  return body.data as T;
}
