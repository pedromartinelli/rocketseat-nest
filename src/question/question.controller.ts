import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { z } from 'zod';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { UserPayload } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

@Controller('questions')
@UseGuards(AuthGuard('jwt'))
export class QuestionController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  // @UsePipes(new ZodValidationPipe(createQuestionSchema))
  async create(
    @CurrentUser() user: UserPayload,
    @Body() question: CreateQuestionSchema,
  ) {
    const { title, content } = question;

    const createdQuestion = await this.prismaService.question.create({
      data: {
        title: title,
        content: content,
        slug: 'dasd',
        authorId: user.sub,
      },
    });

    return createdQuestion;
  }
}
