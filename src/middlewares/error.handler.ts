/* eslint-disable no-case-declarations */
import { Prisma } from "@prisma/client";
import { ErrorRequestHandler } from "express";
import { ZodError, ZodIssue } from 'zod';

// Función auxiliar para crear mensajes de error más específicos para Zod
const createZodErrorMessage = (errors: ZodIssue[]): string => {
  return errors.map(error => {
    const path = error.path.join('.');
    switch (error.code) {
      case 'invalid_type':
        return `Error de tipo: El campo '${path}' esperaba un tipo '${error.expected}', pero recibió un tipo '${error.received}'.`;
      case 'invalid_literal':
        return `Error de valor literal: El campo '${path}' debe ser exactamente '${error.expected}'.`;
      case 'custom':
        return `Error personalizado en el campo '${path}': ${error.message}`;
      case 'invalid_union':
        return `Error de unión: El campo '${path}' no coincide con ninguno de los tipos permitidos.`;
      case 'invalid_enum_value':
        return `Error de valor enum: El campo '${path}' debe ser uno de los siguientes: ${error.options.join(', ')}.`;
      case 'too_small':
        if (error.minimum !== undefined) {
          if (error.type === 'string') {
            return `Error de longitud: El campo '${path}' es demasiado corto. Mínimo: ${error.minimum} caracteres.`;
          } else if (error.type === 'number') {
            return `Error de valor: El campo '${path}' es demasiado pequeño. Mínimo: ${error.minimum}.`;
          }
        }
        return `Error de tamaño: El campo '${path}' es demasiado pequeño.`;
      case 'too_big':
        if (error.maximum !== undefined) {
          if (error.type === 'string') {
            return `Error de longitud: El campo '${path}' es demasiado largo. Máximo: ${error.maximum} caracteres.`;
          } else if (error.type === 'number') {
            return `Error de valor: El campo '${path}' es demasiado grande. Máximo: ${error.maximum}.`;
          }
        }
        return `Error de tamaño: El campo '${path}' es demasiado grande.`;
      case 'invalid_date':
        return `Error de fecha: El campo '${path}' no es una fecha válida.`;
      case 'invalid_string':
        return `Error de cadena: El campo '${path}' no es una cadena válida.`;
      default:
        return `Error en el campo '${path}': ${error.message}`;
    }
  }).join(', ');
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {

  // // //zod error
  // if (err instanceof ZodError) {
  //   const errorMessage = err.errors.map(error => error.message).join(',');
  //   return res.status(400).json({ error: errorMessage })
  // }

  // Manejo de errores de Zod
  if (err instanceof ZodError) {
    const errorMessage = createZodErrorMessage(err.errors);
    return res.status(400).json({ error: errorMessage });
  }


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

  if (err.status === 403) return res.status(403).json({ error: 'You do not have access to this resource' })
  if (err.name === "NotFoundError") return res.status(404).json({ error: "item not found" })
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

