import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createClient } from '@libsql/client';
import { POST } from '../app/api/leads/route';

const valid = { name: 'Catalog Test', phone: '+47 000 00 000', shape: 'Emerald' };
function request(body: unknown, key = randomUUID(), origin = 'http://localhost:4311') {
  return new Request('http://localhost:4311/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, 'Idempotency-Key': key }, body: JSON.stringify(body) });
}

test('catalog storage validates, persists, deduplicates and fails closed', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'kavex-catalog-'));
  const previous = process.env.LEADS_DATABASE_URL;
  process.env.LEADS_DATABASE_URL = pathToFileURL(join(dir, 'leads.db')).href;
  const db = createClient({ url: process.env.LEADS_DATABASE_URL });
  try {
    assert.equal((await POST(request(valid, undefined, 'https://other.test'))).status, 403);
    for (const body of [null, { ...valid, shape: 'Princess' }, { ...valid, phone: 'not a number' }, { ...valid, name: '' }]) {
      assert.equal((await POST(request(body))).status, 400);
    }
    const key = randomUUID();
    const response = await POST(request(valid, key));
    assert.equal(response.status, 201);
    const result = await response.json();
    const url = new URL(result.whatsappUrl);
    assert.equal(url.origin, 'https://wa.me');
    assert.match(url.searchParams.get('text')!, /Diamond shape: Emerald/);
    assert.equal((await POST(request(valid, key))).status, 201);
    assert.equal((await POST(request({ ...valid, shape: 'Pear' }, key))).status, 503);
    const stored = await db.execute('SELECT * FROM catalog_leads');
    assert.equal(stored.rows.length, 1);
    assert.equal(stored.rows[0].phone, '+4700000000');
    assert.equal(stored.rows[0].shape, 'Emerald');
    process.env.LEADS_DATABASE_URL = 'file:/does-not-exist/catalog.db';
    const failure = await POST(request(valid));
    assert.equal(failure.status, 503);
    assert.equal((await failure.json()).whatsappUrl, undefined);
  } finally {
    db.close();
    if (previous === undefined) delete process.env.LEADS_DATABASE_URL;
    else process.env.LEADS_DATABASE_URL = previous;
    await rm(dir, { recursive: true, force: true });
  }
});
