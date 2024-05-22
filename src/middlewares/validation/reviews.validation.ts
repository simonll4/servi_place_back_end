import { z } from "zod";

const content_schema = z.string().min(4, { "message": "Content must be at least 4 characters long" });
const rating_schema = z.number().int().min(1).max(5, { "message": "Rating must be between 1 and 5" });
const idJob_schema = z.number().int().refine(() => true, {
  message: "idJob must be an integer",
});

const reviewBody = z.object({
  content: content_schema,
  rating: rating_schema,
  idJob: idJob_schema
})

export const reviewSchema = z.object({
  body: reviewBody
});