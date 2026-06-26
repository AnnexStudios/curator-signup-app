/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_CURATOR_ADMIN_PASSWORD: string;
  readonly VITE_CURATOR_INVITE_FUNCTION_URL: string;
  readonly VITE_CURATOR_CONFIRM_FUNCTION_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
