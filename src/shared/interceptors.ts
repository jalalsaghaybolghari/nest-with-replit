import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
// import { LogsService } from '../application/services/logs.service';
// import { LogsDto } from '../application/interfaces/logs.interface';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  // constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): any {
    // const req = context.switchToHttp().getRequest();
    // const { method, url } = req;
    // const timestamp = Date.now().valueOf();

    // const ignoreEndpoints = ['/logs'];

    // const logData = {
    //   timestamp,
    //   endpointUrl: url,
    //   method,
    // } as { [key: string]: any };

    // return next.handle().pipe(
    //   map((data) => {
    //     // add log data to db
    //     if (!ignoreEndpoints.some((v) => url.includes(v))) {
    //       logData.responseStatus = HttpStatus.OK;
    //       logData.endTimestamp = Date.now().valueOf();
    //       logData.executionTime = logData.endTimestamp - logData.timestamp;

    //       this.logsService.addLog(logData as LogsDto);
    //     }

    //     return data;
    //   }),
    //   catchError((err) => {
    //     // add log data to db
    //     logData.error = err;
    //     logData.responseStatus = err?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    //     logData.endTimestamp = Date.now().valueOf();
    //     logData.executionTime = logData.endTimestamp - logData.timestamp;

    //     this.logsService.addLog(logData as LogsDto);

    //     return throwError(() => err);
    //   }),
    // );
  }
}
