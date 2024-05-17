import { z } from "zod";

import { Role } from "@prisma/client";

//schemas
const email_schema = z.string().email({ "message": "Invalid email format" });
const password_schema = z.string().min(8, { "message": "Password must be at least 8 characters long" });
const role_schema = z.enum([Role.CUSTOMER, Role.SPECIALIST]);
const names_schema = z.string().min(4, { "message": "Name must be at least 4 characters long" });
const last_name_schema = z.string().min(4, { "message": "Last name must be at least 4 characters long" });
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