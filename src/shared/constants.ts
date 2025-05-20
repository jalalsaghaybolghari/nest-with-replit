import { HttpStatus } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

export const DatabaseModel = {
  User: 'users',
  RefreshToken: 'refresh_tokens',
  BlacklistedToken: 'blacklisted_tokens',
};

export const ERROR_MESSAGE = {
  [HttpStatus.BAD_REQUEST]: 'Invalid request data, please try again.',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Failed to response, please try again.',
  [HttpStatus.UNAUTHORIZED]: 'Session is expired or you are unauthorized, please try refresh your browser.',
  [HttpStatus.FORBIDDEN]: 'User is unauthenticated, please login again.',
};

export const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 3, // Limit each IP to 3 login attempts per windowMs
  message: {
    message: 'Too many login attempts from this IP. Please try again after 2 minutes.',
  },
  handler: (req) => {
    console.log(`Too many login attempts. Please try again later.: ${req.ip}`);
  },
});



