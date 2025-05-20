import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/application/services/auth.service';
import { AuthRepository } from 'src/infrastructure/database/repositories/auth.repository';
import { BlacklistedTokenSchema } from 'src/infrastructure/database/schemas/black-listed-token.schema';
import { RefreshTokenSchema } from 'src/infrastructure/database/schemas/refresh-token.schema';
import { DatabaseModel } from 'src/shared/constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseModel.RefreshToken,
        schema: RefreshTokenSchema,
      },
      {
        name: DatabaseModel.BlacklistedToken,
        schema: BlacklistedTokenSchema,
      },
    ]),
  ],
  providers: [AuthService, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}
