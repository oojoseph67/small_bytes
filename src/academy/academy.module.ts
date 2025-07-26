import { Module, forwardRef } from '@nestjs/common';
import { AcademyService } from './services/academy.service';
import { AcademyController } from './academy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './entities/lesson.entity';
import { Certificate, CertificateSchema } from './entities/certificate.entity';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { Course, CourseSchema } from './entities/course.entity';
import {
  UserProgress,
  UserProgressSchema,
} from './entities/user-progress.entity';
import { QuizAttempt, QuizAttemptSchema } from './entities/quiz-attempt.entity';
import { XPHistory, XPHistorySchema } from './entities/xp-history.entity';
import {
  UserCertificate,
  UserCertificateSchema,
} from './entities/user-certificate.entity';
import { User, UserSchema } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { LessonService } from './services/lesson.service';
import { QuizService } from './services/quiz.service';
import { CertificateService } from './services/certificate.service';
import { CourseService } from './services/course.service';
import { QuizAttemptService } from './services/quiz-attempt.service';
import { UserProgressService } from './services/user-progress.service';
import { XPHistoryService } from './services/xp-history.service';
import { UserCertificateService } from './services/user-certificate.service';

@Module({
  controllers: [AcademyController],
  providers: [
    AcademyService,
    LessonService,
    QuizService,
    CertificateService,
    CourseService,
    QuizAttemptService,
    UserProgressService,
    XPHistoryService,
    UserCertificateService,
  ],
  imports: [
    forwardRef(() => UserModule),
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
      {
        name: UserProgress.name,
        schema: UserProgressSchema,
      },
      {
        name: QuizAttempt.name,
        schema: QuizAttemptSchema,
      },
      {
        name: XPHistory.name,
        schema: XPHistorySchema,
      },
      {
        name: UserCertificate.name,
        schema: UserCertificateSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [XPHistoryService],
})
export class AcademyModule {}
