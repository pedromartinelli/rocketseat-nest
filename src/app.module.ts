import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { createAccountController } from './controllers/create-account.controller';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { QuestionModule } from './question/question.module';
import { QuestionController } from './question/question.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    QuestionModule,
  ],
  controllers: [createAccountController, AuthController, QuestionController],
  providers: [PrismaService],
})
export class AppModule {}
