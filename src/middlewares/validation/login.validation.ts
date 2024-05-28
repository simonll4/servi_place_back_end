import { z } from 'zod';

const MAX_EMAIL_LENGTH = 60;
const MAX_PASSWORD_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 8;

const email_schema = z.string().email({ "message": "Invalid email format" })
    .max(MAX_EMAIL_LENGTH, { "message": `Email must be at most ${MAX_EMAIL_LENGTH} characters long` });

const password_schema = z.string().min(MIN_PASSWORD_LENGTH, { "message": `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` })
    .max(MAX_PASSWORD_LENGTH, { "message": `Password must be at most ${MAX_PASSWORD_LENGTH} characters long` });

const authLoginBody = z.object({
    email: email_schema,
    password: password_schema
});

export const authLoginSchema = z.object({
    body: authLoginBody
});