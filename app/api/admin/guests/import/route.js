import { NextResponse } from 'next/server';
import { isAuthed } from '../../../../../lib/adminAuth';
import { createAdminClient } from '../../../../../lib/supabaseAdmin';
import { makeSlug } from '../../../../../lib/slug';

export const runtime = 'nodejs';

// Minimal CSV line parser — handles quoted fields with embedded commas,
// which covers what a spreadsheet export (Google Sheets, Excel) produces.
function parseCsv(text) {
  const rows = [];
  let row = [];
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

export async function POST(request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const { csv } = await request.json();
  if (!csv || !csv.trim()) {
    return NextResponse.json({ error: 'No CSV content received' }, { status: 400 });
  }

  const rows = parseCsv(csv);
  if (rows.length === 0) {
    return NextResponse.json({ error: 'CSV appears to be empty' }, { status: 400 });
  }

  // Skip a header row like "name,party_size" if present.
  const first = rows[0].map((c) => c.trim().toLowerCase());
  const hasHeader = first[0] === 'name' || first[0] === 'guest' || first[0] === 'display_name';
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const toInsert = [];
  const skipped = [];

  for (const r of dataRows) {
    const name = (r[0] || '').trim();
    const partyRaw = (r[1] || '').trim();
    const partySize = partyRaw ? parseInt(partyRaw, 10) : 1;

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
      slug: makeSlug(name),
    });
  }

  if (toInsert.length === 0) {
    return NextResponse.json(
      { error: 'No valid rows found', skipped },
      { status: 400 }
    );
  }

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.from('guests').insert(toInsert).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ created: data.length, skipped, guests: data });
}
