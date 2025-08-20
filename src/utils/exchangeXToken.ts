interface ExChangeXTokenProps {
  code: string;
}

interface ExChangeXTokenResponse {
  accessToken: string;
}

export default async function exChangeXToken({ code }: ExChangeXTokenProps): Promise<ExChangeXTokenResponse> {
  const res = await fetch('/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => undefined);
    throw new Error(err?.details || 'Failed to exchange token');
  }
  const data = await res.json();
  console.log(res, 'dsa====================================================================');
  // Persist token in httpOnly cookie on server (outside NextAuth namespace)
  await fetch('/api/twitter/set-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token: data.access_token }),
  });
  return { accessToken: data.access_token };
}
