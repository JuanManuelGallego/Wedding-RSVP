import { NextResponse } from 'next/server';
import { isAuthed } from '../../../../../lib/adminAuth';
import { createAdminClient } from '../../../../../lib/supabaseAdmin';
import { LOCALES } from '../../../../../lib/i18n';
import type { GuestUpdate, Locale } from '../../../../../lib/types';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthed()) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const { display_name, party_size, whatsapp, invite_sent, lang } =
    (await request.json()) as GuestUpdate & { lang?: string };

  if (display_name != null && !display_name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  if (lang != null && !LOCALES.includes(lang as Locale)) {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  const updates: GuestUpdate = {};
  if (display_name != null) updates.display_name = display_name.trim();
  if (party_size != null) updates.party_size = Number(party_size) || 1;
  if (whatsapp != null) updates.whatsapp = String(whatsapp).trim() || null;
  if (typeof invite_sent === 'boolean') updates.invite_sent = invite_sent;
  if (lang != null) updates.lang = lang as Locale;

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
