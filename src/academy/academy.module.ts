import { Module } from '@nestjs/common';
import { AcademyService } from './services/academy.service';
import { AcademyController } from './academy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './entities/lesson.entity';
import { Certificate, CertificateSchema } from './entities/certificate.entity';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { Course, CourseSchema } from './entities/course.entity';
import { LessonService } from './services/lesson.service';
import { QuizService } from './services/quiz.service';
import { CertificateService } from './services/certificate.service';
import { CourseService } from './services/course.service';

@Module({
  controllers: [AcademyController],
  providers: [
    AcademyService,
    LessonService,
    QuizService,
    CertificateService,
    CourseService,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Lesson.name,
        schema: LessonSchema,
      },
      {
        name: Certificate.name,
        schema: CertificateSchema,
      },
      {
        name: Quiz.name,
        schema: QuizSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
  ],
})
export class AcademyModule {}
