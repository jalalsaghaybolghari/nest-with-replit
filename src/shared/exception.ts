import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errResponse = exception.getResponse() as { [key: string]: any };

    response.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: {
        statusCode: status || HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          errResponse?.errors?.[0] ||
          errResponse?.error_description ||
          errResponse?.message ||
          exception?.message ||
          'Internal server error.',
      },
    });
  }
}
