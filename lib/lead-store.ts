import { createClient } from '@libsql/client';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { CatalogLead } from './catalog';

/** Local SQLite for development. Hosted libSQL for persistent serverless storage. */
export async function saveCatalogLead(lead: CatalogLead, requestId: string) {
  let url = process.env.LEADS_DATABASE_URL;
  if (!url) {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') throw new Error('LEADS_DATABASE_URL is required in production');
    await mkdir('data', { recursive: true });
    url = pathToFileURL(resolve('data/leads.db')).href;
  }
  if (process.env.VERCEL && url.startsWith('file:')) throw new Error('A hosted database is required on Vercel');
  const db = createClient({ url, authToken: process.env.LEADS_DATABASE_AUTH_TOKEN });
  try {
    await db.execute(`CREATE TABLE IF NOT EXISTS catalog_leads (
      request_id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL,
      shape TEXT NOT NULL, source TEXT NOT NULL, created_at TEXT NOT NULL
    )`);
    const result = await db.execute({
      sql: `INSERT INTO catalog_leads (request_id, name, phone, shape, source, created_at)
        VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(request_id) DO NOTHING`,
      args: [requestId, lead.name, lead.phone, lead.shape, 'catalog-2026', new Date().toISOString()],
    });
    if (result.rowsAffected === 0) {
      const existing = await db.execute({ sql: 'SELECT name, phone, shape FROM catalog_leads WHERE request_id = ?', args: [requestId] });
      const row = existing.rows[0];
      if (!row || row.name !== lead.name || row.phone !== lead.phone || row.shape !== lead.shape) throw new Error('Request conflict');
    }
  } finally { db.close(); }
}
