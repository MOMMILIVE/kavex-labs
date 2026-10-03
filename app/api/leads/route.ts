import { parseCatalogLead, catalogWhatsAppLink } from '@/lib/catalog';
import { saveCatalogLead } from '@/lib/lead-store';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'no-store' };

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Request unavailable.' }, { status: 403, headers });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Invalid request.' }, { status: 415, headers });
  const body = await request.text();
  if (body.length > 4096) return Response.json({ error: 'Invalid request.' }, { status: 413, headers });
  let value: unknown;
  try { value = JSON.parse(body); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400, headers }); }
  const lead = parseCatalogLead(value);
  const requestId = request.headers.get('idempotency-key') ?? '';
  if (!lead || !/^[a-f0-9-]{36}$/i.test(requestId)) return Response.json({ error: 'Enter your name, phone number and diamond shape.' }, { status: 400, headers });
  try {
    await saveCatalogLead(lead, requestId);
    return Response.json({ ok: true, whatsappUrl: catalogWhatsAppLink(lead) }, { status: 201, headers });
  } catch {
    return Response.json({ error: 'Your request could not be saved. Please try again.' }, { status: 503, headers });
  }
}
