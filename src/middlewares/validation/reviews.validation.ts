import { z } from "zod";

const MAX_CONTENT_LENGTH = 500;
const MIN_CONTENT_LENGTH = 4;
const MAX_RATING = 5;
const MIN_RATING = 1;

const content_schema = z.string().min(MIN_CONTENT_LENGTH, { "message": `Content must be at least ${MIN_CONTENT_LENGTH} characters long` })
  .max(MAX_CONTENT_LENGTH, { "message": `Content must be at most ${MAX_CONTENT_LENGTH} characters long` });

const rating_schema = z.number().int().min(MIN_RATING)
  .max(MAX_RATING, { "message": `Rating must be between ${MIN_RATING} and ${MAX_RATING}` });

const job_id_schema = z.number().int().positive();

const reviewBody = z.object({
  content: content_schema,
  rating: rating_schema,
  jobId: job_id_schema
})

export const reviewSchema = z.object({
  body: reviewBody
});