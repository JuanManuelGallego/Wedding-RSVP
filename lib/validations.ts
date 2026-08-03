import { z } from 'zod';

export const guestInsertSchema = z.object({
  display_name: z.string().trim().min(1, 'Name is required'),
  party_size: z.number().int().min(1).max(20).default(1),
  whatsapp: z.string().nullable().optional(),
});

export const guestUpdateSchema = z.object({
  display_name: z.string().trim().min(1).optional(),
  party_size: z.number().int().min(1).max(20).optional(),
  whatsapp: z.string().nullable().optional(),
  invite_sent: z.boolean().optional(),
  lang: z.enum(['es', 'fr']).optional(),
});

export const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export const langSchema = z.object({
  locale: z.enum(['es', 'fr']),
});

export const csvImportSchema = z.object({
  csv: z.string().min(1, 'No CSV content received'),
});

export type GuestInsertInput = z.infer<typeof guestInsertSchema>;
export type GuestUpdateInput = z.infer<typeof guestUpdateSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LangInput = z.infer<typeof langSchema>;
export type CsvImportInput = z.infer<typeof csvImportSchema>;
