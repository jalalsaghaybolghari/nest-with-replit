import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { UserService } from 'src/application/services/user.service';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModel } from 'src/shared/constants';
import { UserSchema } from 'src/infrastructure/database/schemas/user.schema';
import { UserController } from 'src/presentation/controllers/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DatabaseModel.User,
        schema: UserSchema,
      },
    ]),
    AuthModule,
  ],
  providers: [UserService, UsersRepository],
  controllers: [UserController],
})
export class UserModule {}
