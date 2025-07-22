import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from '../entities/lesson.entity';
import { Model } from 'mongoose';
import { CreateLessonDto, UpdateLessonDto } from '../dto/lesson.dto';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private readonly lessonModel: Model<Lesson>,
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

  async findLessonById(id: string): Promise<Lesson> {
    try {
      return await this.lessonModel.findById(id);
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

      return updatedLesson;
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

  async addQuizToLesson({
    lessonId,
    quizId,
  }: {
    lessonId: string;
    quizId: string;
  }): Promise<Lesson> {
    try {
      const updatedLesson = await this.lessonModel.findByIdAndUpdate(
        lessonId,
        { $addToSet: { quiz: quizId } },
        { new: true, runValidators: true },
      );

      if (!updatedLesson) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      return updatedLesson;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error adding lesson to course',
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
      const updatedLesson = await this.lessonModel.findByIdAndUpdate(
        lessonId,
        { $pull: { quiz: quizId } },
        { new: true, runValidators: true },
      );

      if (!updatedLesson) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      return updatedLesson;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error removing lesson from course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteLesson(id: string): Promise<void> {
    try {
      const result = await this.lessonModel.findByIdAndDelete(id);

      if (!result) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error deleting course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
