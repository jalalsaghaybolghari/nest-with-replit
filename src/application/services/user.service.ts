import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import { handleAsync } from 'src/utils/helper';
import { LoginInput, LoginResult, LogoutInput, RegisterInput } from '../interfaces/user.interface';
import { UnauthorizedError, ValidationError } from 'src/domain/errors/custom-errors';
import { AuthService } from './auth.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}
  async login(loginInput: LoginInput): Promise<LoginResult> {
    return handleAsync(async () => {
      const user = await this.usersRepository.findOne({email: loginInput.email});

      if (!user || (await this.authService.verifyPassword(user.passwordHash, loginInput.password)) == false)
        throw new ValidationError(`Invalid username or password`);

      const accessToken = this.authService.createAccessToken(user.id);
      const refreshToken = this.authService.createRefreshToken(user.id);

      const ip = this.request.ip || this.request.connection.remoteAddress;
      const userAgent = this.request.get('user-agent');
      await this.authService.saveRefreshToken(user.id, refreshToken, ip, userAgent);  // Save refresh token to DB

      return {
        accessToken,
        refreshToken,
        userId: user.id,
        email: user.email,
      };
    });
  }

  async logout(data: LogoutInput): Promise<void>{
    return handleAsync(async () => {
      await this.authService.removeRefreshToken(data.refreshToken, data.userId); // Remove refresh token from DB
      await this.authService.blockAccessToken(data.accessToken); // Block access token
      return;
    });
  }

  async register(registerInput: RegisterInput): Promise<void> {
    return handleAsync(async () => {
      await this.validateRegistrationInput(registerInput);

      const userHashedPassword = await this.authService.generateHashedPassword(registerInput.password)

      this.usersRepository.createOne({
        email: registerInput.email,
        passwordHash: userHashedPassword,
      });
    });
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    return handleAsync(async () => {
      if (!token) throw new UnauthorizedError(`Invalid refreshToken`);

      const newToken = this.authService.verifyRefreshToken(token);

      return newToken;
    });
  }

    async resetPassword(resetPassword: string): Promise<void> {
    return handleAsync(async () => {

      if (!this.refreshToken) throw new UnauthorizedError(`Invalid refreshToken`);


      
    })  }

  private async validateRegistrationInput(registerInput: RegisterInput) : Promise<boolean> {
    return handleAsync(async () => {
      if (!registerInput.email || !registerInput.password) throw new ValidationError(`Invalid username or password`);
      const existingUser = await this.usersRepository.findWhere({email: registerInput.email});

      if (existingUser.length != 0) throw new ValidationError(`User already exists`);
      return true;
    });
  }
}
