import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz } from '../entities/quiz.entity';
import { Model } from 'mongoose';
import { CreateQuizDto, UpdateQuizDto } from '../dto/quiz.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name)
    private readonly quizModel: Model<Quiz>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    try {
      return await this.quizModel.create({
        ...createQuizDto,
      });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error creating quiz',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuiz({
    quizId,
    updateQuizDto,
  }: {
    quizId: string;
    updateQuizDto: UpdateQuizDto;
  }): Promise<Quiz> {
    try {
      const updatedQuiz = await this.quizModel.findByIdAndUpdate(
        quizId,
        { $set: updateQuizDto },
        { new: true, runValidators: true },
      );

      if (!updatedQuiz) {
        throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
      }

      return updatedQuiz;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error finding quiz',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findQuizById(id): Promise<Quiz> {
    try {
      return await this.quizModel.findById(id);
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error finding quiz',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
