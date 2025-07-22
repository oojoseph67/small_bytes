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
}
