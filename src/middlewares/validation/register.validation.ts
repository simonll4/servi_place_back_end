import { z } from "zod";

import { Role } from "@prisma/client";


const MAX_EMAIL_LENGTH = 60;
const MAX_PASSWORD_LENGTH = 30;
const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 12;
const MIN_NAME_LENGTH = 4;
const MAX_LAS_NAME_LENGTH = 18;
const MIN_LAST_NAME_LENGTH = 2;

//schemas
const email_schema = z.string().email({ "message": "Invalid email format" })
    .max(MAX_EMAIL_LENGTH, { "message": `Email must be at most ${MAX_EMAIL_LENGTH} characters long` });

const password_schema = z.string().min(MIN_PASSWORD_LENGTH, { "message": `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` })
    .max(MAX_PASSWORD_LENGTH, { "message": `Password must be at most ${MAX_PASSWORD_LENGTH} characters long` });

const role_schema = z.enum([Role.CUSTOMER, Role.SPECIALIST]);

const names_schema = z.string().min(MIN_NAME_LENGTH, { "message": `Name must be at least ${MIN_NAME_LENGTH} characters long` })
    .max(MAX_NAME_LENGTH, { "message": `Name must be at most ${MAX_NAME_LENGTH} characters long` });

const last_name_schema = z.string().min(MIN_LAST_NAME_LENGTH, { "message": `Last name must be at least ${MIN_LAST_NAME_LENGTH} characters long` })
    .max(MAX_LAS_NAME_LENGTH, { "message": `Last name must be at most ${MAX_LAS_NAME_LENGTH} characters long` });

const profile_picture_schema = z.string().refine(value => value === "" || new URL(value), { "message": "Invalid url format" }).optional();

const category_schema = z.array(z.string()).optional()

const authRegisterBody = z.object({
    email: email_schema,
    password: password_schema,
    role: role_schema,
    name: names_schema,
    lastName: last_name_schema,
    profilePhoto: profile_picture_schema,
    categories: category_schema
})

export const authRegisterSchema = z.object({
    body: authRegisterBody
});