import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { BaseError } from '../../domain/errors/base.error';
  
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal Server Error';
  
      if (exception instanceof BaseError) {
        status = exception.statusCode;
        message = exception.message;
      } else if (exception instanceof HttpException) {
        status = exception.getStatus();
        message = (exception.getResponse() as any)?.message || exception.message;
      }
  
      response.status(status).json({
        success: false,
        statusCode: status,
        message,
      });
    }
  }
  