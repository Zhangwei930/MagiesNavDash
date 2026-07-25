export function useApi() {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const base = (config.public.apiBase as string) || ''

  async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {})
    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json')
    }
    if (auth.token) {
      headers.set('Authorization', `Bearer ${auth.token}`)
    }

    const res = await fetch(`${base}${path}`, {
      ...options,
      headers
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.message || `请求失败 (${res.status})`)
    }
    return data as T
  }

  return { api, base }
}
