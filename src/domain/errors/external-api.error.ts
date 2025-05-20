import { BaseError } from './base.error';

export class ExternalApiError extends BaseError {
  constructor(message = 'External API request failed', statusCode = 502) {
    super(message, statusCode);
  }
}
