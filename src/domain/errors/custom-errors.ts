import { BaseError } from './base.error';

export class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends BaseError {
  constructor(message = 'Invalid data') {
    super(message, 400);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

