import { z } from "zod";

export const ZArticle = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string(),
  content: z.string(),
});

export type TArticle = z.infer<typeof ZArticle>;
