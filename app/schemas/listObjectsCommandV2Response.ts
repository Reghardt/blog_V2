import { z } from "zod";

export const ZListObjectsCommandV2Response = z.object({
  CommonPrefixes: z.object({ Prefix: z.string() }).array().optional(),
  Contents: z
    .object({
      Key: z.string(),
      Size: z.number(),
    })
    .array()
    .optional(),
});
