import { z } from 'zod';


const title_schema = z.string().min(4, { message: 'Title must be at least 4 characters long' });
const paragraph_schema = z.string().min(4, { message: 'Paragraph must be at least 4 characters long' });
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