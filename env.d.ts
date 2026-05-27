// C:\Dev\gymlab-front\env.d.ts
interface ImportMetaEnv {
  readonly NG_APP_API_URL: string;
  readonly NG_APP_SUPABASE_URL: string;
  readonly NG_APP_SUPABASE_ANON_KEY: string; // Exemplo de adição futura
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}