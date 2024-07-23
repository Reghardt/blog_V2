import { z } from "zod";

export const ZEditor = z.object({
  id: z.number(),
  created_at: z.string().date(),
  email: z.string(),
  username: z.string(),
  hashed_password: z.string(),
  salt: z.string(),
});

export type TEditor = z.infer<typeof ZEditor>;
