import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(error);

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      message: error.message,
      error: error.message,
    });
  }

  const message = error.message || 'Erro interno do servidor';
  const isBadRequest =
    error.name === 'MulterError' ||
    /arquivo.*inválido|invalid.*file|Only \.log and \.txt|datas? inválidas|Parâmetros inválidos|Data inválida|A data inicial deve ser anterior|No file uploaded/i.test(message);

  return res.status(isBadRequest ? 400 : 500).json({
    message: isBadRequest ? 'Requisição inválida' : 'Erro interno do servidor',
    error: message,
  });
}
