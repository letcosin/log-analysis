"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(error, _req, res, _next) {
    console.error(error);
    const isValidationError = error.message.includes('Formato de log inválido') || error.message.includes('Apenas arquivos .log e .txt são permitidos');
    return res.status(isValidationError ? 400 : 500).json({
        message: isValidationError ? 'Arquivo de importação inválido' : 'Erro interno do servidor',
        error: error.message,
    });
}
