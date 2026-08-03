import { withAuth } from '@/lib/api/withAuth';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { guestUpdateSchema } from '@/lib/validations';
import { jsonError, jsonSuccess } from '@/lib/api/responses';
import type { GuestUpdate, Locale } from '@/lib/types';

export const runtime = 'nodejs';

export const PATCH = withAuth(async (request: Request, context) => {
  const { id } = await context!.params;
  if (!id) return jsonError('Missing guest ID', 400);

  const body = await request.json().catch(() => null);
  if (!body) return jsonError('Invalid JSON', 400);

  const parsed = guestUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0].message, 400);
  }

  const { display_name, party_size, whatsapp, invite_sent, lang } = parsed.data;

  const supabaseAdmin = createAdminClient();

  const updates: GuestUpdate = {};
  if (display_name != null) updates.display_name = display_name;
  if (party_size != null) updates.party_size = party_size;
  if (whatsapp != null) updates.whatsapp = whatsapp ? String(whatsapp).trim() || null : null;
  if (typeof invite_sent === 'boolean') updates.invite_sent = invite_sent;
  if (lang != null) updates.lang = lang as Locale;

  const { data, error } = await supabaseAdmin
    .from('guests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return jsonError(error.message, 500);
  }

  return jsonSuccess({ guest: data });
});
