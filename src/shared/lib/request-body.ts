// Đọc thân yêu cầu có giới hạn kích thước cho Route Handler: từ chối sớm theo Content-Length, đo lại sau khi đọc, phân biệt quá lớn (413) với JSON hỏng (400)
export type BodyResult<T> = { ok: true; value: T } | { ok: false; status: 400 | 413 };

export async function readTextBody(request: Request, maxBytes: number): Promise<BodyResult<string>> {
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, status: 413 };
  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) return { ok: false, status: 413 };
  return { ok: true, value: text };
}

export async function readJsonBody(request: Request, maxBytes = 8 * 1024): Promise<BodyResult<unknown>> {
  const body = await readTextBody(request, maxBytes);
  if (!body.ok) return body;
  try {
    return { ok: true, value: JSON.parse(body.value) as unknown };
  } catch {
    return { ok: false, status: 400 };
  }
}
