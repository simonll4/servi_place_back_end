import { z } from 'zod';

const MAX_NAME_LENGTH = 50;
const MIN_NAME_LENGTH = 4;
const MAX_DESCRIPTION_LENGTH = 125;
const MIN_DESCRIPTION_LENGTH = 4;

const name_schema = z.string().min(MIN_NAME_LENGTH, { message: `Name must be at least ${MIN_NAME_LENGTH} characters long` })
  .max(MAX_NAME_LENGTH, { message: `Name must be at most ${MAX_NAME_LENGTH} characters long` });

const description_schema = z.string().min(MIN_DESCRIPTION_LENGTH, { message: `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters long` })
  .max(MAX_DESCRIPTION_LENGTH, { message: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters long` });


const jobBody = z.object({
  name: name_schema,
  description: description_schema,

});

export const jobSchema = z.object({
  body: jobBody
});

