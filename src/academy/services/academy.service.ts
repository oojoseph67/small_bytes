import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { QuizService } from './quiz.service';
import { CertificateService } from './certificate.service';
import { CourseService } from './course.service';
import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from '../dto/certificate.dto';
import { CreateCourseDto, UpdateCourseDto } from '../dto/course.dto';
import {
  CreateLessonDto,
  QuizToLessonDto,
  UpdateLessonDto,
} from '../dto/lesson.dto';
import { CreateQuizDto, UpdateQuizDto } from '../dto/quiz.dto';

@Injectable()
export class AcademyService {
  constructor(
    private readonly lessonService: LessonService,
    private readonly quizService: QuizService,
    private readonly certificateService: CertificateService,
    private readonly courseService: CourseService,
  ) {}

  /**
   * CERTIFICATE SERVICE
   */

  async createCertificate(createCertificateDto: CreateCertificateDto) {
    return this.certificateService.createCertificate(createCertificateDto);
  }

  async updateCertificate({
    id,
    updateCertificateDto,
  }: {
    id: string;
    updateCertificateDto: UpdateCertificateDto;
  }) {
    return this.certificateService.updateCertificate({
      id,
      updateCertificateDto,
    });
  }

  async getAllCertificate() {
    return await this.certificateService.getAllCertificate();
  }

  async getCertificateById(id: string) {
    const certificate = await this.certificateService.findCertificateById(id);

    if (!certificate) {
      throw new HttpException(`Certificate not found`, HttpStatus.NOT_FOUND);
    }

    return certificate;
  }

  async deleteCertificate(id: string) {
    return await this.certificateService.deleteCertificate(id);
  }

  /**
   * COURSE SERVICE
   */

  async createCourse(createCourseDto: CreateCourseDto) {
    return await this.courseService.createCourse(createCourseDto);
  }

  async getAllCourse() {
    return await this.courseService.findAllCourses();
  }

  async getCourseById(id: string) {
    const course = await this.courseService.findCourseById(id);

    if (!course) {
      throw new HttpException(`Course not found`, HttpStatus.NOT_FOUND);
    }

    return course;
  }

  async updateCourse({
    id,
    updateCourseDto,
  }: {
    id: string;
    updateCourseDto: UpdateCourseDto;
  }) {
    return await this.courseService.updateCourse({ id, updateCourseDto });
  }

  async setCourseCertificate({
    certificateId,
    courseId,
  }: {
    certificateId: string;
    courseId: string;
  }) {
    return await this.courseService.setCourseCertificate({
      certificateId,
      courseId,
    });
  }

  async addLessonToCourse({
    courseId,
    lessonId,
  }: {
    courseId: string;
    lessonId: string;
  }) {
    return await this.courseService.addLessonToCourse({ courseId, lessonId });
  }

  async removeLessonFromCourse({
    courseId,
    lessonId,
  }: {
    courseId: string;
    lessonId: string;
  }) {
    return await this.courseService.removeLessonFromCourse({
      courseId,
      lessonId,
    });
  }

  async deleteCourse(id: string) {
    return await this.courseService.deleteCourse(id);
  }

  /**
   * LESSON SERVICE
   */

  async createLesson(createLessonDto: CreateLessonDto) {
    return await this.lessonService.createLesson(createLessonDto);
  }

  async getAllLessons() {
    return await this.lessonService.findAllLesson();
  }

  async getLessonById(id: string) {
    const lesson = await this.lessonService.findLessonById(id);

    if (!lesson) {
      throw new HttpException(`Lesson not found`, HttpStatus.NOT_FOUND);
    }

    return lesson;
  }

  async updateLesson({
    id,
    updateLessonDto,
  }: {
    id: string;
    updateLessonDto: UpdateLessonDto;
  }) {
    return await this.lessonService.updateLesson({
      lessonId: id,
      updateLessonDto,
    });
  }

  async addQuizToLesson(quizToLessonDto: QuizToLessonDto) {
    return await this.lessonService.addQuizToLesson({
      lessonId: quizToLessonDto.lessonId,
      quizId: quizToLessonDto.quizId,
    });
  }

  async removeQuizFromLesson(quizToLessonDto: QuizToLessonDto) {
    return await this.lessonService.removeQuizFromLesson({
      lessonId: quizToLessonDto.lessonId,
      quizId: quizToLessonDto.quizId,
    });
  }

  async deleteQuiz(id: string) {
    return await this.lessonService.deleteLesson(id);
  }

  /**
   * QUIZ SERVICE
   */

  async createQuiz(createQuizDto: CreateQuizDto) {
    return await this.quizService.createQuiz(createQuizDto);
  }

  async updateQuiz({
    updateQuizDto,
    id,
  }: {
    id: string;
    updateQuizDto: UpdateQuizDto;
  }) {
    return await this.quizService.updateQuiz({ quizId: id, updateQuizDto });
  }

  async getQuizById(id: string) {
    const quiz = await this.quizService.findQuizById(id);

    if (!quiz) {
      throw new HttpException('Quiz not found', HttpStatus.NOT_FOUND);
    }

    return quiz;
  }
}
