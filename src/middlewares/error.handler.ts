/* eslint-disable no-case-declarations */
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
    switch (err.code) {
      case 'P2001':
        return res.status(500).json({ error: 'Raw error from the database engine.' });
      case 'P2002':
        const uniqueField = err.meta?.target;
        return res.status(409).json({ error: `Unique constraint failed on ${uniqueField}` });
      case 'P2003':
        const modelName = err.meta?.modelName;
        const fieldName = err.meta?.field_name; 
        return res.status(409).json({ error: `Foreign key error on ${modelName} with ${fieldName}` });
      case 'P2004':
        return res.status(409).json({ error: 'Constraint failed.' });
      case 'P2005':
        return res.status(400).json({ error: 'Value out of range.' });
      default:
        return res.status(500).json({ error: 'An unknown error occurred.' });
      case 'P2006':
        return res.status(400).json({ error: 'Missing the required argument.' });
      case 'P2007':
        return res.status(400).json({ error: 'Invalid connection string.' });
      case 'P2010':
        return res.status(400).json({ error: 'Column not found.' });
      case 'P2011':
        return res.status(400).json({ error: 'Relation not found.' });
      case 'P2013':
        const value = err.meta?.value;
        return res.status(400).json({ error: `The provided value '${value}' for the column is too long for the column's type.` });
      case 'P2014':
        return res.status(404).json({ error: 'A related record could not be found.' });
      case 'P2016':
        return res.status(400).json({ error: 'Query interpretation error.' });
      case 'P2019':
        return res.status(400).json({ error: 'Input error.' });
      case 'P2020':
        return res.status(400).json({ error: 'Value out of range error.' });
      case 'P2021':
        return res.status(404).json({ error: 'Table not found.' });
      case 'P2022':
        return res.status(404).json({ error: 'Database not found.' });
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

      // if (err.code === 'P2002') {
      //   const fieldName = err.meta?.target; // Add null check for err.meta
      //   return res.status(409).json({ error: `${fieldName} already exists` });
      // }
      // if (err.code === 'P2025') {
      //   const modelName = err.meta?.model;
      //   const fieldName = err.meta?.field_name;
      //   return res.status(404).json({ error: `${modelName} with ${fieldName} not found` });
      // }
      // if (err.code === 'P2003') {
      //   const modelName = err.meta?.model;
      //   const relationField = err.meta?.relation_field;
      //   return res.status(409).json({ error: `Foreign key error on ${modelName} with ${relationField}` });
      // }