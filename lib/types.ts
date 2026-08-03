export type Locale = 'es' | 'fr';

export enum VideoPhase {
  Envelope = 'envelope',
  Playing = 'playing',
  Ended = 'ended',
  Done = 'done',
}

export enum SubmitStatus {
  Idle = 'idle',
  Submitting = 'submitting',
  Error = 'error',
}

export enum FormStatus {
  Idle = 'idle',
  Submitting = 'submitting',
  Uploading = 'uploading',
  Error = 'error',
}

export type Guest = {
  id: string;
  created_at: string;
  slug: string;
  display_name: string;
  party_size: number;
  whatsapp: string | null;
  invite_sent: boolean;
  lang: Locale;
  attending: boolean | null;
  responded_at: string | null;
  viewed_at: string | null;
};

export type GuestInsert = {
  display_name: string;
  party_size: number;
  whatsapp: string | null;
  slug: string;
  lang: Locale;
};

export type GuestUpdate = {
  display_name?: string;
  party_size?: number;
  whatsapp?: string | null;
  invite_sent?: boolean;
  lang?: Locale;
  attending?: boolean | null;
  responded_at?: string | null;
  viewed_at?: string | null;
};

export type Database = {
  public: {
    Tables: {
      guests: {
        Row: Guest;
        Insert: GuestInsert;
        Update: GuestUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
