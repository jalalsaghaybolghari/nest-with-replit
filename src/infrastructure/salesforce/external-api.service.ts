import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiUrl } from '../config/api-url';
import { HttpRequestHandler } from '../shared/http-request-handler';

@Injectable()
export class ExternalApiService {
  constructor(private httpRequestHandler: HttpRequestHandler) {}

}
