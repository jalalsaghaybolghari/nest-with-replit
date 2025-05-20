import { Injectable } from '@nestjs/common';
import { handleAsync } from 'src/utils/helper';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedError } from 'src/domain/errors/custom-errors';
import { AuthRepository } from 'src/infrastructure/database/repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  readonly saltRounds = 10;


  createRefreshToken(userId: string): string {
    return jwt.sign({ userId: userId }, process.env.JWT_REFRESH, { expiresIn: `${process.env.REFRESH_TOKEN_VALIDITY_DAYS}d` });
  }

  async removeRefreshToken(refreshToken: string, userId: string): Promise<void> {
    return handleAsync(async () => {
      const allTokens = await this.authRepository.findRefreshTokens(userId);
      for (const tokenDoc of allTokens) {
        const isMatch = await bcrypt.compare(refreshToken, tokenDoc.tokenHash);
        if (isMatch) {
          await this.authRepository.removeRefreshTokenById(tokenDoc._id as string);
        }
      }
    });
  }
  async blockAccessToken(token: string): Promise<void> {
    return handleAsync(async () => {
      await this.authRepository.blockAccessToken(token);
    });
  }

  async isBlockedToken(token: string): Promise<boolean> {
    return handleAsync(async () => {
      return await this.authRepository.isBlocked(token);
    });
  }

  createAccessToken(userId: string): string {
    return jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: `${process.env.TOKEN_VALIDITY_MINS}m` });
  }

  async verifyPassword(storedHashFromDB: string, loginPassword: string): Promise<boolean> {
    return handleAsync(async () => {
      return await bcrypt.compare(loginPassword, storedHashFromDB);
    });
  }

  async generateHashedPassword(password: string): Promise<string> {
    return handleAsync(async () => {
      return await this.hashPassword(password);
    });
  }

  async saveRefreshToken(userId: string, refreshToken: string, ip?: string, userAgent?: string): Promise<void> {
    return handleAsync(async () => {
      const tokenHash = await this.hashPassword(refreshToken);
      const refreshTokenValidityDays = Number(process.env.REFRESH_TOKEN_VALIDITY_DAYS) || 0;
      const expiresAt = new Date(Date.now() + refreshTokenValidityDays * 1000);
      await this.authRepository.createRefreshToken({
        userId,
        tokenHash,
        expiresAt,
        ip: ip || '127.0.0.1',
        userAgent: userAgent || 'unknown',
      });
    });
  }

  verifyRefreshToken(refreshToken: string): { accessToken: string } {
    return jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, user) => {
      if (err) throw new UnauthorizedError(`Invalid refreshToken`);

      const accessToken = this.createAccessToken(user.userId);
      return {
        accessToken,
      };
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return handleAsync(async () => {
      return await bcrypt.hash(password, this.saltRounds);
    });
  }
}
