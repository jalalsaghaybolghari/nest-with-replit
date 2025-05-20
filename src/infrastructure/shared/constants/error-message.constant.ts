import { HttpStatus } from "@nestjs/common";

export const ERROR_MESSAGE = {
    [HttpStatus.BAD_REQUEST]: 'Invalid request data, please try again.',
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'Failed to response, please try again.',
    [HttpStatus.UNAUTHORIZED]:
      'Session is expired or you are unauthorized, please try refresh your browser.',
    [HttpStatus.FORBIDDEN]: 'User is unauthenticated, please login again.',
  };