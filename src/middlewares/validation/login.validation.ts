import { z } from 'zod';

const email_schema = z.string().email({ "message": "Invalid email format" });
const password_schema = z.string().min(8, { "message": "Password must be at least 8 characters long" });

const authLoginBody = z.object({
    email: email_schema,
    password: password_schema
});

export const authLoginSchema = z.object({
    body: authLoginBody
});