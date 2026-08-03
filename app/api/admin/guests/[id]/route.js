import { NextResponse } from 'next/server';
import { isAuthed } from '../../../../../lib/adminAuth';
import { createAdminClient } from '../../../../../lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function PATCH(request, { params }) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const { display_name, party_size, whatsapp } = await request.json();

  if (display_name != null && !display_name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  const updates = {};
  if (display_name != null) updates.display_name = display_name.trim();
  if (party_size != null) updates.party_size = Number(party_size) || 1;
  if (whatsapp != null) updates.whatsapp = String(whatsapp).trim() || null;

  const { data, error } = await supabaseAdmin
    .from('guests')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ guest: data });
}
