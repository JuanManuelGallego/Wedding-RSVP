import { withAuth } from '@/lib/api/withAuth';
import { createAdminClient } from '@/lib/supabaseAdmin';
import { makeSlug } from '@/lib/slug';
import { guestInsertSchema } from '@/lib/validations';
import { jsonError, jsonSuccess } from '@/lib/api/responses';

export const runtime = 'nodejs';

export const POST = withAuth(async (request: Request) => {
  const body = await request.json().catch(() => null);
  if (!body) return jsonError('Invalid JSON', 400);

  const parsed = guestInsertSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0].message, 400);
  }

  const { display_name, party_size, whatsapp } = parsed.data;
  const supabaseAdmin = createAdminClient();
  const slug = makeSlug(display_name);

  const { data, error } = await supabaseAdmin
    .from('guests')
    .insert({
      display_name,
      party_size,
      whatsapp: whatsapp ? String(whatsapp).trim() || null : null,
      slug,
    })
    .select()
    .single();

  if (error) {
    return jsonError(error.message, 500);
  }

  return jsonSuccess({ guest: data });
});
