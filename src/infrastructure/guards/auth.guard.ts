import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ERROR_MESSAGE } from '../shared/constants/error-message.constant';
import { getAccessToken } from 'src/utils/helper';
import * as jwt from 'jsonwebtoken';
import { AuthService } from 'src/application/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,  
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();

    const token = getAccessToken(req);
    if (!token) {
      throw new HttpException(ERROR_MESSAGE[HttpStatus.UNAUTHORIZED], HttpStatus.UNAUTHORIZED);
    }
    const isBlockedToken  = await this.authService.isBlockedToken(token);
    if (isBlockedToken) {
      throw new HttpException(ERROR_MESSAGE[HttpStatus.UNAUTHORIZED], HttpStatus.UNAUTHORIZED);
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // use env secret
      req.user = decoded; // attach user info to request
      return true;
    } catch (err) {
      throw new HttpException(ERROR_MESSAGE[HttpStatus.UNAUTHORIZED], HttpStatus.UNAUTHORIZED);
    }
  }
}
