import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 50; // 3MB
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export const ZFormFileInputSchema = z
  .instanceof(File)
  .refine((file) => {
    return file.size <= MAX_UPLOAD_SIZE;
  }, "File size must be less than 3MB")
  .refine((file) => {
    return ACCEPTED_FILE_TYPES.includes(file.type);
  }, "File must be an image type");
