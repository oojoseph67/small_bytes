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
import { AccessTokenPayload } from 'src/auth/type/auth.type';

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
  @Permissions([{ resource: Resource.ADMIN, actions: [Action.READ] }])
  async allCertificate() {
    return this.academyService.getAllCertificate();
  }

  @Get('certificate/:id')
  @Permissions([{ resource: Resource.ADMIN, actions: [Action.READ] }])
  async singleCertificate(@Param('id') id: string) {
    return this.academyService.getCertificateById(id);
  }

  @Post('create-certificate')
  @Permissions([{ resource: Resource.ADMIN, actions: [Action.CREATE] }])
  async createCertificate(@Body() createCertificateDto: CreateCertificateDto) {
    return this.academyService.createCertificate(createCertificateDto);
  }

  @Patch('update-certificate/:id')
  @Permissions([{ resource: Resource.ADMIN, actions: [Action.UPDATE] }])
  async updateCertificate(
    @Body() updateCertificateDto: UpdateCertificateDto,
    @Param('id') id: string,
  ) {
    return this.academyService.updateCertificate({ id, updateCertificateDto });
  }

  @Delete('certificate/:id')
  @Permissions([{ resource: Resource.ADMIN, actions: [Action.DELETE] }])
  async deleteCertificate(@Param('id') id: string) {
    console.log('id');
    return this.academyService.deleteCertificate(id);
  }

  /**
   * COURSE SERVICE
   */
  @Get('course')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.READ] }])
  async allCourse() {
    return this.academyService.getAllCourse();
  }

  @Get('course/:id')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.READ] }])
  async singleCourse(@Param('id') id: string) {
    return this.academyService.getCourseById(id);
  }

  @Post('course')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.CREATE] }])
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.academyService.createCourse(createCourseDto);
  }

  @Post('course/complete')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.CREATE] }])
  async createCompleteCourse(
    @Body() createCourseCompleteDto: CreateCourseCompleteDto,
  ) {
    return this.academyService.createCompleteCourse(createCourseCompleteDto);
  }

  @Patch('course/:id')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.UPDATE] }])
  async updateCourse(
    @Body() updateCourseDto: UpdateCourseDto,
    @Param('id') id: string,
  ) {
    return this.academyService.updateCourse({ id, updateCourseDto });
  }

  @Post('set-course-certificate')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.UPDATE] }])
  async setCourseCertificate(
    @Body() setCourseCertificateDto: SetCourseCertificateDto,
  ) {
    return this.academyService.setCourseCertificate({
      certificateId: setCourseCertificateDto.certificateId,
      courseId: setCourseCertificateDto.courseId,
    });
  }

  @Post('add-lesson-to-course')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.UPDATE] }])
  async addLessonToCourse(@Body() setLessonToCourseDto: SetLessonToCourseDto) {
    return this.academyService.addLessonToCourse({
      lessonId: setLessonToCourseDto.lessonId,
      courseId: setLessonToCourseDto.courseId,
    });
  }

  @Post('remove-lesson-from-course')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.UPDATE] }])
  async removeLessonFromCourse(
    @Body() setLessonToCourseDto: SetLessonToCourseDto,
  ) {
    return this.academyService.removeLessonFromCourse({
      lessonId: setLessonToCourseDto.lessonId,
      courseId: setLessonToCourseDto.courseId,
    });
  }

  @Delete('course/:id')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.DELETE] }])
  async deleteCourse(@Param('id') id: string) {
    return this.academyService.deleteCourse(id);
  }

  /**
   * LESSON SERVICE
   */
  @Get('lesson')
  @Permissions([{ resource: Resource.LESSON, actions: [Action.READ] }])
  async getAllLesson() {
    return this.academyService.getAllLessons();
  }

  @Get('lesson/:id')
  @Permissions([{ resource: Resource.LESSON, actions: [Action.READ] }])
  async getSingleLesson(@Param('id') id: string) {
    return this.academyService.getLessonById(id);
  }

  @Post('lesson')
  @Permissions([{ resource: Resource.LESSON, actions: [Action.CREATE] }])
  async createLesson(@Body() createLessonDto: CreateLessonDto) {
    return this.academyService.createLesson(createLessonDto);
  }

  @Patch('lesson/:id')
  @Permissions([{ resource: Resource.LESSON, actions: [Action.UPDATE] }])
  async updateLesson(
    @Body() updateLessonDto: UpdateLessonDto,
    @Param('id') id: string,
  ) {
    return this.academyService.updateLesson({ id, updateLessonDto });
  }

  @Post('add-quiz-to-lesson')
  @Permissions([{ resource: Resource.LESSON, actions: [Action.UPDATE] }])
  async addQuizToLesson(@Body() quizToLessonDto: QuizToLessonDto) {
    return this.academyService.addQuizToLesson(quizToLessonDto);
  }

  @Post('remove-quiz-from-lesson')
  @Permissions([{ resource: Resource.LESSON, actions: [Action.UPDATE] }])
  async removeQuizFromLesson(@Body() quizToLessonDto: QuizToLessonDto) {
    return this.academyService.removeQuizFromLesson(quizToLessonDto);
  }

  @Delete('quiz/:id')
  @Permissions([{ resource: Resource.LESSON, actions: [Action.DELETE] }])
  async deleteQuiz(@Param('id') id: string) {
    return this.academyService.deleteQuiz(id);
  }

  /**
   * QUIZ SERVICE
   */
  @Get('quiz/:id')
  @Permissions([{ resource: Resource.QUIZ, actions: [Action.READ] }])
  async getSingleQuiz(@Param('id') id: string) {
    return this.academyService.getQuizById(id);
  }

  @Post('quiz')
  @Permissions([{ resource: Resource.QUIZ, actions: [Action.CREATE] }])
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    return this.academyService.createQuiz(createQuizDto);
  }

  @Patch('quiz/:id')
  @Permissions([{ resource: Resource.QUIZ, actions: [Action.UPDATE] }])
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
    const userId = req.user.userId as AccessTokenPayload['userId'];
    return this.quizAttemptService.submitQuiz(userId, submitQuizDto);
  }

  @Get('quiz/user/attempts')
  @Permissions([{ resource: Resource.QUIZ, actions: [Action.READ] }])
  async getUserQuizAttempts(
    @Request() req,
    @Query() query: GetQuizAttemptsDto,
  ) {
    const userId = req.user.userId as AccessTokenPayload['userId'];
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
    const userId = req.user.userId as AccessTokenPayload['userId'];
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
    const userId = req.user.userId as AccessTokenPayload['userId'];
    return this.userProgressService.getAllCoursesProgress(userId);
  }

  @Get('progress/stats')
  @Permissions([{ resource: Resource.COURSE, actions: [Action.READ] }])
  async getUserStats(@Request() req) {
    const userId = req.user.userId as AccessTokenPayload['userId'];
    return this.userProgressService.getUserStats(userId);
  }

  /**
   * XP HISTORY SERVICE
   */

  @Get('xp/history')
  @Permissions([{ resource: Resource.XP, actions: [Action.READ] }])
  async getXPHistory(@Request() req, @Query() query: GetXPHistoryDto) {
    const userId = req.user.userId as AccessTokenPayload['userId'];
    return this.xpHistoryService.getUserXPHistory(
      userId,
      query.limit,
      query.offset,
    );
  }

  @Get('xp/stats')
  @Permissions([{ resource: Resource.XP, actions: [Action.READ] }])
  async getXPStats(@Request() req) {
    const userId = req.user.userId as AccessTokenPayload['userId'];
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
    const userId = req.user.userId as AccessTokenPayload['userId'];
    return this.xpHistoryService.getActivityTypeStats(userId);
  }

  @Get('xp/recent-activity')
  @Permissions([{ resource: Resource.XP, actions: [Action.READ] }])
  async getRecentActivity(@Request() req, @Query('limit') limit?: number) {
    const userId = req.user.userId as AccessTokenPayload['userId'];
    return this.xpHistoryService.getRecentActivity(userId, limit);
  }

  /**
   * CERTIFICATE SERVICE (User earned certificates)
   */

  @Get('certificates/earned')
  @Permissions([{ resource: Resource.CERTIFICATE, actions: [Action.READ] }])
  async getUserCertificates(@Request() req) {
    const userId = req.user.userId as AccessTokenPayload['userId'];
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
    const userId = req.user.userId as AccessTokenPayload['userId'];
    return this.userCertificateService.getCertificateStats(userId);
  }

  @Get('certificates/recent')
  @Permissions([{ resource: Resource.CERTIFICATE, actions: [Action.READ] }])
  async getRecentCertificates(@Query('limit') limit?: number) {
    return this.userCertificateService.getRecentCertificates(limit);
  }
}

/**
 * ACADEMY FLOW OVERVIEW:
 *
 * ADMIN FLOW:
 * 1. Certificate Management: Create/update/delete certificates that users can earn
 * 2. Course Creation: Create courses with complete structure (certificate, lessons, quizzes) in one go
 * 3. Course Editing: Modify course details, add/remove lessons, set course certificates
 * 4. Lesson Management: Create/update lessons and link quizzes to them
 * 5. Quiz Management: Create/update quizzes with questions and answers
 *
 * USER FLOW:
 * 1. Course Enrollment: Users can view and enroll in available courses
 * 2. Lesson Progression: Users progress through lessons sequentially
 * 3. Quiz Taking: Users take quizzes for each lesson to test knowledge
 * 4. Progress Tracking: System tracks completion status, scores, and XP earned
 * 5. Certificate Earning: Users receive certificates upon course completion
 *
 * DETAILED ROUTE BREAKDOWN:
 *
 * CERTIFICATE MANAGEMENT (Admin Only):
 * - GET /certificate - List all certificate templates
 * - GET /certificate/:id - Get specific certificate template details
 * - POST /create-certificate - Create new certificate template
 * - PATCH /update-certificate/:id - Update certificate template
 * - DELETE /certificate/:id - Delete certificate template
 *
 * COURSE MANAGEMENT:
 * - GET /course - List all available courses (readable by users)
 * - GET /course/:id - Get specific course details with lessons
 * - POST /course - Create basic course structure (admin only)
 * - POST /course/complete - Create complete course with lessons, quizzes, and certificate (admin only)
 * - PATCH /course/:id - Update course details (admin only)
 * - POST /set-course-certificate - Link certificate to course (admin only)
 * - POST /add-lesson-to-course - Add lesson to existing course (admin only)
 * - POST /remove-lesson-from-course - Remove lesson from course (admin only)
 * - DELETE /course/:id - Delete course (admin only)
 *
 * LESSON MANAGEMENT:
 * - GET /lesson - List all lessons (readable by users)
 * - GET /lesson/:id - Get specific lesson details (readable by users)
 * - POST /lesson - Create new lesson (admin only)
 * - PATCH /lesson/:id - Update lesson content (admin only)
 * - POST /add-quiz-to-lesson - Link quiz to lesson (admin only)
 * - POST /remove-quiz-from-lesson - Unlink quiz from lesson (admin only)
 * - DELETE /quiz/:id - Delete quiz (admin only)
 *
 * QUIZ MANAGEMENT:
 * - GET /quiz/:id - Get quiz details and questions (readable by users)
 * - POST /quiz - Create new quiz with questions (admin only)
 * - PATCH /quiz/:id - Update quiz content (admin only)
 * - POST /submit-quiz - Submit quiz attempt and get results (users)
 * - GET /quiz-attempts - Get user's quiz attempt history
 * - GET /quiz-attempt/:id - Get specific quiz attempt details
 *
 * PROGRESS TRACKING:
 * - GET /progress - Get user's overall progress across all courses
 * - GET /progress/:courseId - Get user's progress for specific course
 * - GET /progress/all-courses - Get progress summary for all enrolled courses
 * - GET /stats - Get user's learning statistics and achievements
 *
 * XP SYSTEM:
 * - GET /xp/history - Get user's XP earning history with pagination
 * - GET /xp/stats - Get user's total XP and level statistics
 * - GET /xp/leaderboard - Get global XP leaderboard
 * - GET /xp/activity-stats - Get XP breakdown by activity type
 * - GET /xp/recent-activity - Get recent XP earning activities
 *
 * USER CERTIFICATES:
 * - GET /certificates/earned - Get user's earned certificates
 * - GET /certificates/:id - Get specific earned certificate details
 * - GET /certificates/:id/pdf - Generate PDF version of certificate
 * - GET /certificates/verify/:certificateNumber - Verify certificate authenticity
 * - GET /certificates/stats - Get user's certificate statistics
 * - GET /certificates/recent - Get recently issued certificates
 *
 * USAGE PATTERNS:
 * - Admin creates complete course: POST /course/complete
 * - User enrolls and progresses: GET /course, GET /lesson, POST /submit-quiz
 * - Track progress: GET /progress, GET /xp/stats
 * - Earn certificate: Automatic upon course completion
 * - Verify achievements: GET /certificates/earned, GET /xp/leaderboard
 *
 * NB: Each lesson has a single quiz, and users must complete all lessons to earn the course certificate
 */
