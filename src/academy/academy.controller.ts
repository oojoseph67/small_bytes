import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AcademyService } from './services/academy.service';
import { QuizAttemptService } from './services/quiz-attempt.service';
import { UserProgressService } from './services/user-progress.service';
import { XPHistoryService } from './services/xp-history.service';
import { UserCertificateService } from './services/user-certificate.service';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from './dto/certificate.dto';
import {
  CreateCourseDto,
  CreateCourseCompleteDto,
  SetCourseCertificateDto,
  SetLessonToCourseDto,
  UpdateCourseDto,
} from './dto/course.dto';
import {
  CreateLessonDto,
  QuizToLessonDto,
  UpdateLessonDto,
} from './dto/lesson.dto';
import { CreateQuizDto, UpdateQuizDto } from './dto/quiz.dto';
import { SubmitQuizDto, GetQuizAttemptsDto } from './dto/quiz-attempt.dto';
import { GetUserProgressDto } from './dto/user-progress.dto';
import { GetXPHistoryDto } from './dto/xp-history.dto';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Permissions } from 'src/roles/decorator/permissions.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('academy')
export class AcademyController {
  constructor(
    private readonly academyService: AcademyService,
    private readonly quizAttemptService: QuizAttemptService,
    private readonly userProgressService: UserProgressService,
    private readonly xpHistoryService: XPHistoryService,
    private readonly userCertificateService: UserCertificateService,
  ) {}

  /**
   * CERTIFICATE SERVICE
   */
  @Get('certificate')
  async allCertificate() {
    return this.academyService.getAllCertificate();
  }

  @Get('certificate/:id')
  async singleCertificate(@Param('id') id: string) {
    return this.academyService.getCertificateById(id);
  }

  @Post('create-certificate')
  async createCertificate(@Body() createCertificateDto: CreateCertificateDto) {
    return this.academyService.createCertificate(createCertificateDto);
  }

  @Patch('update-certificate/:id')
  async updateCertificate(
    @Body() updateCertificateDto: UpdateCertificateDto,
    @Param('id') id: string,
  ) {
    return this.academyService.updateCertificate({ id, updateCertificateDto });
  }

  @Delete('certificate/:id')
  async deleteCertificate(@Param('id') id: string) {
    console.log('id');
    return this.academyService.deleteCertificate(id);
  }

  /**
   * COURSE SERVICE
   */
  @Get('course')
  async allCourse() {
    return this.academyService.getAllCourse();
  }

  @Get('course/:id')
  async singleCourse(@Param('id') id: string) {
    return this.academyService.getCourseById(id);
  }

  @Post('course')
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.academyService.createCourse(createCourseDto);
  }

  @Post('course/complete')
  async createCompleteCourse(
    @Body() createCourseCompleteDto: CreateCourseCompleteDto,
  ) {
    return this.academyService.createCompleteCourse(createCourseCompleteDto);
  }

  @Patch('course/:id')
  async updateCourse(
    @Body() updateCourseDto: UpdateCourseDto,
    @Param('id') id: string,
  ) {
    return this.academyService.updateCourse({ id, updateCourseDto });
  }

  @Post('set-course-certificate')
  async setCourseCertificate(
    @Body() setCourseCertificateDto: SetCourseCertificateDto,
  ) {
    return this.academyService.setCourseCertificate({
      certificateId: setCourseCertificateDto.certificateId,
      courseId: setCourseCertificateDto.courseId,
    });
  }

  @Post('add-lesson-to-course')
  async addLessonToCourse(@Body() setLessonToCourseDto: SetLessonToCourseDto) {
    return this.academyService.addLessonToCourse({
      lessonId: setLessonToCourseDto.lessonId,
      courseId: setLessonToCourseDto.courseId,
    });
  }

  @Post('remove-lesson-from-course')
  async removeLessonFromCourse(
    @Body() setLessonToCourseDto: SetLessonToCourseDto,
  ) {
    return this.academyService.removeLessonFromCourse({
      lessonId: setLessonToCourseDto.lessonId,
      courseId: setLessonToCourseDto.courseId,
    });
  }

  @Delete('course/:id')
  async deleteCourse(@Param('id') id: string) {
    return this.academyService.deleteCourse(id);
  }

  /**
   * LESSON SERVICE
   */
  @Get('lesson')
  async getAllLesson() {
    return this.academyService.getAllLessons();
  }

  @Get('lesson/:id')
  async getSingleLesson(@Param('id') id: string) {
    return this.academyService.getLessonById(id);
  }

  @Post('lesson')
  async createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.academyService.createLesson(createLessonDto);
  }

  @Patch('lesson/:id')
  async updateLesson(
    @Body() updateLessonDto: UpdateLessonDto,
    @Param('id') id: string,
  ) {
    return this.academyService.updateLesson({ id, updateLessonDto });
  }

  @Post('add-quiz-to-lesson')
  async addQuizToLesson(@Body() quizToLessonDto: QuizToLessonDto) {
    return this.academyService.addQuizToLesson(quizToLessonDto);
  }

  @Post('remove-quiz-from-lesson')
  async removeQuizFromLesson(@Body() quizToLessonDto: QuizToLessonDto) {
    return this.academyService.removeQuizFromLesson(quizToLessonDto);
  }

  @Delete('quiz/:id')
  async deleteQuiz(@Param('id') id: string) {
    return this.academyService.deleteQuiz(id);
  }

  /**
   * QUIZ SERVICE
   */
  @Get('quiz/:id')
  async getSingleQuiz(@Param('id') id: string) {
    return this.academyService.getQuizById(id);
  }

  @Post('quiz')
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return this.academyService.createQuiz(createQuizDto);
  }

  @Patch('quiz/:id')
  async updateQuiz(
    @Body() updateQuizDto: UpdateQuizDto,
    @Param('id') id: string,
  ) {
    return this.academyService.updateQuiz({ id, updateQuizDto });
  }

  /**
   * QUIZ ATTEMPT SERVICE
   */

  @Post('quiz/submit')
  @Permissions([{ resource: Resource.QUIZ, actions: [Action.POST] }])
  async submitQuiz(@Request() req, @Body() submitQuizDto: SubmitQuizDto) {
    const userId = req.user.id;
    return this.quizAttemptService.submitQuiz(userId, submitQuizDto);
  }

  @Get('quiz/attempts')
  @Permissions([{ resource: Resource.QUIZ, actions: [Action.READ] }])
  async getUserQuizAttempts(
    @Request() req,
    @Query() query: GetQuizAttemptsDto,
  ) {
    const userId = req.user.id;
    return this.quizAttemptService.getUserQuizAttempts(
      userId,
      query.courseId,
      query.lessonId,
    );
  }

  @Get('quiz/attempt/:id')
  @Permissions([{ resource: Resource.QUIZ, actions: [Action.READ] }])
  async getQuizAttemptById(@Param('id') id: string) {
    return this.quizAttemptService.getQuizAttemptById(id);
  }

  /**
   * USER PROGRESS SERVICE
   */
  @Permissions([{ resource: Resource.COURSE, actions: [Action.READ] }])
  @Get('progress')
  async getUserProgress(@Request() req, @Query() query: GetUserProgressDto) {
    const userId = req.user.id;
    return this.userProgressService.getUserProgress(userId, query);
  }

  @Get('progress/course/:courseId')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.READ] }])
  async getCourseProgress(@Request() req, @Param('courseId') courseId: string) {
    const userId = req.user.id;
    return this.userProgressService.getCourseProgress(userId, courseId);
  }

  @Get('progress/courses')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.READ] }])
  async getAllCoursesProgress(@Request() req) {
    const userId = req.user.id;
    return this.userProgressService.getAllCoursesProgress(userId);
  }

  @Get('progress/stats')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.READ] }])
  async getUserStats(@Request() req) {
    const userId = req.user.id;
    return this.userProgressService.getUserStats(userId);
  }

  /**
   * XP HISTORY SERVICE
   */

  @Get('xp/history')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.READ] }])
  async getXPHistory(@Request() req, @Query() query: GetXPHistoryDto) {
    const userId = req.user.id;
    return this.xpHistoryService.getUserXPHistory(
      userId,
      query.limit,
      query.offset,
    );
  }

  @Get('xp/stats')
  @Permissions([{ resource: Resource.XP, actions: [Action.READ] }])
  async getXPStats(@Request() req) {
    const userId = req.user.id;
    return this.xpHistoryService.getUserXPStats(userId);
  }

  @Get('xp/leaderboard')
  @Permissions([{ resource: Resource.XP, actions: [Action.READ] }])
  async getXPLeaderboard(@Query('limit') limit?: number) {
    return this.xpHistoryService.getXPLeaderboard(limit);
  }

  @Get('xp/activity-stats')
  @Permissions([{ resource: Resource.XP, actions: [Action.READ] }])
  async getActivityTypeStats(@Request() req) {
    const userId = req.user.id;
    return this.xpHistoryService.getActivityTypeStats(userId);
  }

  @Get('xp/recent-activity')
  @Permissions([{ resource: Resource.XP, actions: [Action.READ] }])
  async getRecentActivity(@Request() req, @Query('limit') limit?: number) {
    const userId = req.user.id;
    return this.xpHistoryService.getRecentActivity(userId, limit);
  }

  /**
   * CERTIFICATE SERVICE (User earned certificates)
   */

  @Get('certificates/earned')
  @Permissions([{ resource: Resource.CERTIFICATE, actions: [Action.READ] }])
  async getUserCertificates(@Request() req) {
    const userId = req.user.id;
    return this.userCertificateService.getUserCertificates(userId);
  }

  @Get('certificates/:id')
  @Permissions([{ resource: Resource.CERTIFICATE, actions: [Action.READ] }])
  async getCertificateById(@Param('id') id: string) {
    return this.userCertificateService.getCertificateById(id);
  }

  @Get('certificates/:id/pdf')
  @Permissions([{ resource: Resource.CERTIFICATE, actions: [Action.READ] }])
  async generateCertificatePDF(@Param('id') id: string) {
    return this.userCertificateService.generateCertificatePDF(id);
  }

  @Get('certificates/verify/:certificateNumber')
  @Permissions([{ resource: Resource.CERTIFICATE, actions: [Action.READ] }])
  async verifyCertificate(
    @Param('certificateNumber') certificateNumber: string,
  ) {
    return this.userCertificateService.verifyCertificate(certificateNumber);
  }

  @Get('certificates/stats')
  @Permissions([{ resource: Resource.CERTIFICATE, actions: [Action.READ] }])
  async getCertificateStats(@Request() req) {
    const userId = req.user.id;
    return this.userCertificateService.getCertificateStats(userId);
  }

  @Get('certificates/recent')
  @Permissions([{ resource: Resource.CERTIFICATE, actions: [Action.READ] }])
  async getRecentCertificates(@Query('limit') limit?: number) {
    return this.userCertificateService.getRecentCertificates(limit);
  }
}

/**
 * FLOW: - create certificate, create course, create course lesson, create quiz and link everything together
 *
 * NB: each lesson has a single quiz
 *
 */
