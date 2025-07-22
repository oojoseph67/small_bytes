import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from '../entities/lesson.entity';
import { Model } from 'mongoose';
import { CreateLessonDto, UpdateLessonDto } from '../dto/lesson.dto';
import { QuizService } from './quiz.service';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,

    private readonly quizService: QuizService,
  ) {}

  async createLesson(createLessonDto: CreateLessonDto): Promise<Lesson> {
    try {
      return await this.lessonModel.create({
        ...createLessonDto,
      });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error creating lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllLesson() {
    try {
      return await this.lessonModel.find().populate('quizId').exec();
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error finding lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findLessonById(id: string): Promise<Lesson> {
    try {
      return await this.lessonModel.findById(id).populate('quizId');
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error finding lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateLesson({
    lessonId,
    updateLessonDto,
  }: {
    lessonId: string;
    updateLessonDto: UpdateLessonDto;
  }): Promise<Lesson> {
    try {
      const updatedLesson = await this.lessonModel.findByIdAndUpdate(
        lessonId,
        { $set: updateLessonDto },
        { new: true, runValidators: true },
      );

      if (!updatedLesson) {
        throw new HttpException('Lesson not found', HttpStatus.NOT_FOUND);
      }

      // Return populated lesson
      return await this.findLessonById(updatedLesson.id);
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error finding lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addQuizToLesson({
    lessonId,
    quizId,
  }: {
    lessonId: string;
    quizId: string;
  }): Promise<Lesson> {
    try {
      const quiz = await this.quizService.findQuizById(quizId);

      if (!quiz) {
        throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
      }

      const updatedLesson = await this.lessonModel.findByIdAndUpdate(
        lessonId,
        { $addToSet: { quizId: quizId } },
        { new: true, runValidators: true },
      );

      if (!updatedLesson) {
        throw new HttpException('Lesson not found', HttpStatus.NOT_FOUND);
      }

      // Return populated lesson
      return await this.findLessonById(updatedLesson.id);
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error adding lesson to lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeQuizFromLesson({
    lessonId,
    quizId,
  }: {
    lessonId: string;
    quizId: string;
  }): Promise<Lesson> {
    try {
      const quiz = await this.quizService.findQuizById(quizId);

      if (!quiz) {
        throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
      }

      const updatedLesson = await this.lessonModel.findByIdAndUpdate(
        lessonId,
        { $pull: { quizId: quizId } },
        { new: true, runValidators: true },
      );

      if (!updatedLesson) {
        throw new HttpException('Lesson not found', HttpStatus.NOT_FOUND);
      }

      // Return populated lesson
      return await this.findLessonById(updatedLesson.id);
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error removing lesson from lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteLesson(id: string): Promise<void> {
    try {
      const result = await this.lessonModel.findByIdAndDelete(id);

      if (!result) {
        throw new HttpException('Lesson not found', HttpStatus.NOT_FOUND);
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error deleting lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
