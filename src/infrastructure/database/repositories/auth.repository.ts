import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatabaseModel } from '../../../shared/constants';
import { RefreshTokenDocument } from '../schemas/refresh-token.schema';
import { BlacklistedTokenDocument } from '../schemas/black-listed-token.schema';
import { handleAsync } from 'src/utils/helper';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectModel(DatabaseModel.RefreshToken)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(DatabaseModel.BlacklistedToken)
    private readonly blacklistedTokenModel: Model<BlacklistedTokenDocument>,
  ) {}

  async blockAccessToken(token: string): Promise<void> {
    return handleAsync(async () => {
      await this.blacklistedTokenModel.create({
        token,
      });
    });
  }

  async isBlocked(token: string): Promise<boolean> {
    return handleAsync(async () => {
      const blockedToken = await this.blacklistedTokenModel.findOne({ token: token });
      if (blockedToken == null) {
        return false;
      } else return true;
    });
  }

  async createRefreshToken(data: Partial<RefreshTokenDocument>): Promise<RefreshTokenDocument> {
    return handleAsync(async () => {
      return await this.refreshTokenModel.create(data);
    });
  }

  async findRefreshTokens(userId?: string): Promise<RefreshTokenDocument[]> {
    return handleAsync(async () => {
      return await this.refreshTokenModel.find({ userId });
    });
  }

  async removeRefreshTokenById(refreshTokenId: string): Promise<void> {
    return handleAsync(async () => {
      await this.refreshTokenModel.deleteOne({ _id: refreshTokenId });
    });
  }
}
