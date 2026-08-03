import { withAuth } from '@/lib/api/withAuth';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { makeSlug } from '@/lib/slug';
import { csvImportSchema } from '@/lib/validations';
import { jsonError, jsonSuccess } from '@/lib/api/responses';
import type { GuestInsert } from '@/lib/types';

export const runtime = 'nodejs';

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && next === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ''));
}

export const POST = withAuth(async (request: Request) => {
  const body = await request.json().catch(() => null);
  if (!body) return jsonError('Invalid JSON', 400);

  const parsed = csvImportSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0].message, 400);
  }

  const rows = parseCsv(parsed.data.csv);
  if (rows.length === 0) {
    return jsonError('CSV appears to be empty', 400);
  }

  // Skip a header row like "name,party_size" if present.
  const first = rows[0].map((c) => c.trim().toLowerCase());
  const hasHeader = first[0] === 'name' || first[0] === 'guest' || first[0] === 'display_name';
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const toInsert: GuestInsert[] = [];
  const skipped: Array<{ row: string[]; reason: string }> = [];

  for (const r of dataRows) {
    const name = (r[0] || '').trim();
    const partyRaw = (r[1] || '').trim();
    const partySize = partyRaw ? parseInt(partyRaw, 10) : 1;
    const whatsapp = (r[2] || '').trim() || null;
    const lang = (r[3] || '').trim().toLowerCase() === 'fr' ? 'fr' : 'es';

    if (!name) {
      skipped.push({ row: r, reason: 'Missing name' });
      continue;
    }
    if (partyRaw && (Number.isNaN(partySize) || partySize < 1)) {
      skipped.push({ row: r, reason: 'Invalid party size' });
      continue;
    }

    toInsert.push({
      display_name: name,
      party_size: partySize || 1,
      whatsapp,
      slug: makeSlug(name),
      lang,
    });
  }

  if (toInsert.length === 0) {
    return jsonError('No valid rows found', 400);
  }

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.from('guests').insert(toInsert).select();

  if (error) {
    return jsonError(error.message, 500);
  }

  return jsonSuccess({ created: data.length, skipped, guests: data });
});
