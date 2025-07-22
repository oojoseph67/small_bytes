import { Injectable } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { QuizService } from './quiz.service';
import { CertificateService } from './certificate.service';
import { CourseService } from './course.service';
import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from '../dto/certificate.dto';

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

  async findAllCertificate() {
    return this.certificateService.getAllCertificate();
  }

  async findCertificateById(id: string) {
    return this.certificateService.findCertificateById(id);
  }

  /**
   * COURSE SERVICE
   */
}
