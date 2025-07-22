import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../entities/course.entity';
import { CreateCourseDto, UpdateCourseDto } from '../dto/course.dto';
import { CertificateService } from './certificate.service';
import { LessonService } from './lesson.service';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,

    private readonly certificateService: CertificateService,

    private readonly lessonService: LessonService,
  ) {}

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      return await this.courseModel.create({
        ...createCourseDto,
      });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error creating course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findCourseById(id: string): Promise<Course> {
    try {
      const course = await this.courseModel
        .findById(id)
        .populate({
          path: 'lessons',
          model: 'Lesson',
          populate: {
            path: 'quizId',
            model: 'Quiz'
          }
        })
        .populate('certificate');

      //   if (!course) {
      //     throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      //   }

      return course;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error finding course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllCourses(): Promise<Course[]> {
    try {
      return await this.courseModel
        .find()
        .populate({
          path: 'lessons',
          model: 'Lesson',
          populate: {
            path: 'quizId',
            model: 'Quiz'
          }
        })
        .populate('certificate')
        .exec();
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error finding courses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      const result = await this.courseModel.findByIdAndDelete(id);

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

  async addLessonToCourse({
    courseId,
    lessonId,
  }: {
    courseId: string;
    lessonId: string;
  }): Promise<Course> {
    try {
      const lesson = await this.lessonService.findLessonById(lessonId);

      if (!lesson) {
        throw new HttpException(
          `Lesson with id: ${lessonId} was not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        courseId,
        { $addToSet: { lessons: lessonId } },
        { new: true, runValidators: true },
      );

      if (!updatedCourse) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      // Return populated course
      return await this.findCourseById(updatedCourse.id);
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

  async removeLessonFromCourse({
    courseId,
    lessonId,
  }: {
    courseId: string;
    lessonId: string;
  }): Promise<Course> {
    try {
      const lesson = await this.lessonService.findLessonById(lessonId);

      if (!lesson) {
        throw new HttpException(
          `Lesson with id: ${lessonId} was not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        courseId,
        { $pull: { lessons: lessonId } },
        { new: true, runValidators: true },
      );

      if (!updatedCourse) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      // Return populated course
      return await this.findCourseById(updatedCourse.id);
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

  async setCourseCertificate({
    certificateId,
    courseId,
  }: {
    courseId: string;
    certificateId: string;
  }): Promise<Course> {
    try {
      const certificate =
        await this.certificateService.findCertificateById(certificateId);

      if (!certificate) {
        throw new HttpException('Certificate not found', HttpStatus.NOT_FOUND);
      }

      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        courseId,
        { certificate: certificateId },
        { new: true, runValidators: true },
      );

      if (!updatedCourse) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      // Return populated course
      return await this.findCourseById(updatedCourse.id);
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error setting course certificate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCourse({
    id,
    updateCourseDto,
  }: {
    id: string;
    updateCourseDto: UpdateCourseDto;
  }): Promise<Course> {
    try {
      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        id,
        { $set: updateCourseDto },
        { new: true, runValidators: true },
      );

      if (!updatedCourse) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      // Return populated course
      return await this.findCourseById(updatedCourse.id);
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error updating course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
