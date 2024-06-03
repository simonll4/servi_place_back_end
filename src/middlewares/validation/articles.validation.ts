import { z } from 'zod';

const MAX_TITLE_LENGTH = 50;
const MIN_TITLE_LENGTH = 4;
const MAX_PARAGRAPH_LENGTH = 500;
const MIN_PARAGRAPH_LENGTH = 4;

const title_schema = z.string().min(MIN_TITLE_LENGTH, { message: `Title must be at least ${MIN_TITLE_LENGTH} characters long` })
  .max(MAX_TITLE_LENGTH, { message: `Title must be at most ${MAX_TITLE_LENGTH} characters long` });

const paragraph_schema = z.string().min(MIN_PARAGRAPH_LENGTH, { message: `Paragraph must be at least ${MIN_PARAGRAPH_LENGTH} characters long` })
  .max(MAX_PARAGRAPH_LENGTH, { message: `Paragraph must be at most ${MAX_PARAGRAPH_LENGTH} characters long` });

const image_schema = z.string().url({ message: 'Invalid url format' });

const categoryId_schema = z.number().int();


const articleBody = z.object({
  title: title_schema,
  paragraph: paragraph_schema,
  image: image_schema,
  categoryId: categoryId_schema
});

export const articleSchema = z.object({
  body: articleBody
});