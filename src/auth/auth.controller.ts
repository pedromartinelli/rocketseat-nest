import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const authBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthBodySchema = z.infer<typeof authBodySchema>;

@Controller('/sessions')
export class AuthController {
  constructor(
    private readonly jwt: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authBodySchema))
  async create(@Body() body: AuthBodySchema) {
    const { email, password } = body;

    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const isPasswordValid = await compareSync(password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciais inválidas');

    const accessToken = this.jwt.sign({
      sub: user.id,
    });

    return { access_token: accessToken };
  }
}
