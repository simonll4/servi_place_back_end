import { Request } from "express";
import { AnyZodObject, z } from "zod";

//schemas
const emailSchema = z.string().email({ "message": "Invalid email format" });
const passwordSchema = z.string().min(8, { "message": "Password must be at least 8 characters long" });

const authRegisterBody = z.object({
    email: emailSchema,
    password: passwordSchema,
})

export const authRegisterSchema = z.object({
    body: authRegisterBody
});

const authLoginBody = z.object({
    email: emailSchema,
    password: passwordSchema
});

export const authLoginSchema = z.object({
    body: authLoginBody
});

export async function zParse<T extends AnyZodObject>(schema: T, req: Request): Promise<z.infer<T>> {
    return schema.parseAsync(req)
}