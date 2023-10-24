import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email({ message: 'Email incorreto' }),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('/accounts')
export class createAccountController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async createAccount(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const userAlreadyExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlreadyExist) {
      throw new ConflictException('Usuário com mesmo e-mail já cadastrado.');
    }

    const hashedPassword = await hash(password, 8);

    await this.prismaService.user.create({
      data: { name, email, password: hashedPassword },
    });
  }
}
