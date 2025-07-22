import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AcademyService } from './services/academy.service';
import {
  CreateCertificateDto,
  UpdateCertificateDto,
} from './dto/certificate.dto';
import {
  CreateCourseDto,
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

@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

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
}

/**
 * FLOW: - create certificate, create course, create course lesson, create quiz and link everything together
 *
 * NB: each lesson has a single quiz
 *
 */
