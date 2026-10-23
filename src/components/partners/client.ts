export async function api<T = Record<string, unknown>>(
  path: string,
  data?: unknown,
): Promise<T> {
  const res = await fetch(path, {
    method: data === undefined ? "GET" : "POST",
    headers:
      data === undefined ? undefined : { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
    cache: "no-store",
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "Não foi possível concluir.");
  return result as T;
}
export const errorText = (e: unknown) =>
  e instanceof Error ? e.message : "Não foi possível concluir.";
export async function copy(text: string) {
  await navigator.clipboard.writeText(text);
}
export function brPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length <= 11 ? `55${digits}` : digits;
}
