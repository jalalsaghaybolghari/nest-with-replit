import { BaseError } from './base.error';

export class DatabaseError extends BaseError {
  constructor(message = 'Database error') {
    super(message, 500);
  }
}