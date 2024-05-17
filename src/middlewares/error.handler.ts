import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";
import { ZodError } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  if (err instanceof ZodError) {
    const errorMessage = err.errors.map(error => error.message).join(',');
    return res.status(400).json({ error: errorMessage })
  }
  if (err.status === 403) return res.status(403).json({ error: 'You do not have access to this resource' })
  if (err.name === "NotFoundError") return res.status(404).json({ error: "item not found" })

  //prisma error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fieldName = err.meta?.target; // Add null check for err.meta
      return res.status(409).json({ error: `${fieldName} already exists` });
    }
    if (err.code === 'P2025') {
      const modelName = err.meta?.model;
      const fieldName = err.meta?.field_name;
      return res.status(404).json({ error: `${modelName} with ${fieldName} not found` });
    }
    if (err.code === 'P2003') {
      const modelName = err.meta?.model;
      const relationField = err.meta?.relation_field;
      return res.status(409).json({ error: `Foreign key error on ${modelName} with ${relationField}` });
    }
  }

  if (err.status === 401 && err.message === "without JWT") {
    return res.status(401).json({ error: 'unauthorized' })
  } else if (err.status === 401) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'wrong formatted JSON' });
  if (err.message === 'invalid credentials') return res.status(401).json({ error: 'invalid credentials' });
  return res.status(500).json({ error: 'internal server error' });
}

export default errorHandler;