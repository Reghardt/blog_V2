import { z } from "zod";

export const zArticle = z.object({
  id: z.number(),
  created_at: z.string(),
  title: z.string(),
  content: z.string(),
});
