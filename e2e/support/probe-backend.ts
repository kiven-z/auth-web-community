const PROBE_TIMEOUT_MS = 8_000;

/**
 * 探测网关是否可达：登录接口返回 4xx 亦视为服务存活。
 */
export async function probeBackend(apiBaseUrl: string): Promise<boolean> {
  const url = `${apiBaseUrl.replace(/\/$/, '')}/api/auth/login/username`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    return response.status < 500;
  } catch {
    return false;
  }
}
