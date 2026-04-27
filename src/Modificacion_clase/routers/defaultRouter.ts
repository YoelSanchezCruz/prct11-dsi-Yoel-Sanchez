import express from 'express';

export const defaultRouter = express.Router();

// Router por defecto por el que salta el programa si la ruta no coincide con ninguna de las otras
defaultRouter.all('/{*splat}', (_, res) => {
  res.status(501).send();
});