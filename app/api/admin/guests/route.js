import { NextResponse } from 'next/server';
import { isAuthed } from '../../../../lib/adminAuth';
import { createAdminClient } from '../../../../lib/supabaseAdmin';
import { makeSlug } from '../../../../lib/slug';

export const runtime = 'nodejs';

export async function POST(request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const { display_name, party_size } = await request.json();

  if (!display_name || !display_name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();
  const slug = makeSlug(display_name);

  const { data, error } = await supabaseAdmin
    .from('guests')
    .insert({
      display_name: display_name.trim(),
      party_size: Number(party_size) || 1,
      slug,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ guest: data });
}
