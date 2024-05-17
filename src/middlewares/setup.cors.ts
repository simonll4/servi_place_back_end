import cors from "cors";

export const setupCors = cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  exposedHeaders: ['Authorization'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true, // si necesitas soportar cookies
  preflightContinue: true,
});