import { Module } from '@nestjs/common';
import { AcademyService } from './services/academy.service';
import { AcademyController } from './academy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './entities/lesson.entity';
import { Certificate, CertificateSchema } from './entities/certificate.entity';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { Course, CourseSchema } from './entities/course.entity';

@Module({
  controllers: [AcademyController],
  providers: [AcademyService],
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
