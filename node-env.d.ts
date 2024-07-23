// environment.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    readonly TURSO_DATABASE_URL?: string;
    readonly TURSO_AUTH_TOKEN?: string;
    readonly AWS_ACCESS_KEY_ID?: string;
    readonly AWS_SECRET_ACCESS_KEY?: string;
    readonly AWS_S3_BUCKET_NAME?: string;
    readonly AWS_S3_ENDPOINT?: string;
    readonly ADMIN_SESSION_SECRET?: string;
  }
}
