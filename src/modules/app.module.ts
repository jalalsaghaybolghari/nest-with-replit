import { Module } from '@nestjs/common';
import { AppController } from '../presentation/controllers/app.controller';
import { AppService } from '../application/services/app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user.module';
import { AuthModule } from './auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/infrastructure/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/default-db'),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
