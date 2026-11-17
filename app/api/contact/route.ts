// Contact form endpoint. Forwards the message as JSON to CONTACT_WEBHOOK_URL
// (any JSON webhook: Formspree, Make/Zapier, Slack/Discord bridge, etc).
// TODO(client): set CONTACT_WEBHOOK_URL in the deploy env. Without it the form errors honestly instead of dropping messages.

const FIELDS = ["name", "email", "phone", "guests", "date", "time", "message"] as const;
const MAX = 2000;

export async function POST(request: Request) {
  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (!hook) return Response.json({ error: "Contact form is not connected yet." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Bad request." }, { status: 400 });

  // Keep only known fields, as trimmed, length-capped strings.
  const data = Object.fromEntries(FIELDS.map((k) => [k, String(body[k] ?? "").trim().slice(0, MAX)]));
  if (!data.name || !data.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return Response.json({ error: "Name, a valid email and a message are required." }, { status: 400 });
  }

  const res = await fetch(hook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...data, sentAt: new Date().toISOString() }),
  }).catch(() => null);
  if (!res?.ok) return Response.json({ error: "Could not deliver the message." }, { status: 502 });

  return Response.json({ ok: true });
}
