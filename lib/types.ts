export type Locale = 'es' | 'fr';

export enum VideoPhase {
  Poster = 'poster',
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

export interface Guest {
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
}

export interface GuestInsert {
  display_name: string;
  party_size: number;
  whatsapp: string | null;
  slug: string;
}

export interface GuestUpdate {
  display_name?: string;
  party_size?: number;
  whatsapp?: string | null;
  invite_sent?: boolean;
  lang?: Locale;
}

export interface Database {
  public: {
    Tables: {
      guests: {
        Row: Guest;
        Insert: GuestInsert;
        Update: GuestUpdate;
      };
    };
  };
}
