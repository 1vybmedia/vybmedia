import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  WEB_ORIGIN: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  CLERK_JWT_ISSUER: z.string().optional(),
  AUDIO_WORKER_URL: z.string().url().optional()
});

export const env = envSchema.parse(process.env);
