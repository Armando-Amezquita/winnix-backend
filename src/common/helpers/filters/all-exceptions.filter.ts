import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorResponseDto } from '../dto/response.dto';

// Captura TODAS las excepciones no manejadas explícitamente
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // Determina el código de estado y el mensaje
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; // 500 para errores no HTTP

    // Construye el cuerpo de la respuesta de error
    let responseBody: ErrorResponseDto;

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      // El response puede ser un string o un objeto { statusCode, message, error }
      const errorMessage =
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as any).message || exception.message;
      const errorName =
        typeof errorResponse === 'string'
          ? exception.constructor.name // e.g., 'BadRequestException'
          : (errorResponse as any).error || exception.constructor.name;

      responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(request),
        error: errorName,
        message: errorMessage,
      };
    } else {
      // Errores inesperados (no HttpException)
      // ¡Loguea el error completo para depuración!
      this.logger.error(
        `Unhandled Exception: ${
          (exception as any)?.message || 'Unknown error'
        }`,
        (exception as any)?.stack, // Incluye el stack trace
        exception, // Loguea el objeto de excepción completo
      );

      responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(request),
        error: 'Internal Server Error',
        message: 'An unexpected internal server error occurred.',
      };
    }

    // Envía la respuesta de error estandarizada
    // Usamos httpAdapter.reply en lugar de response.status().json() para compatibilidad
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
