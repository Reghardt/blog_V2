import { z } from "zod";

export const ZArticle = z.object({
  id: z.number(),
  created_at: z.string().date(),
  title: z.string(),
  content: z.string(),
  published: z.number().min(0).max(1),
  views: z.number().min(0),
});

export type TArticle = z.infer<typeof ZArticle>;
