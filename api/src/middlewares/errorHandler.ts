import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(error);

  const isValidationError = error.message.includes('Formato de log inválido') || error.message.includes('Apenas arquivos .log e .txt são permitidos');

  return res.status(isValidationError ? 400 : 500).json({
    message: isValidationError ? 'Arquivo de importação inválido' : 'Erro interno do servidor',
    error: error.message,
  });
}
