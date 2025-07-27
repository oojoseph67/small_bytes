import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  QuizAttempt,
  QuizAttemptDocument,
} from '../entities/quiz-attempt.entity';
import { Quiz, QuizDocument } from '../entities/quiz.entity';
import { User, UserDocument } from 'src/user/entities/user.entity';
import {
  UserProgress,
  UserProgressDocument,
} from '../entities/user-progress.entity';
import {
  XPHistory,
  XPHistoryDocument,
  XPActivityType,
} from '../entities/xp-history.entity';
import { SubmitQuizDto, QuizAttemptResponseDto } from '../dto/quiz-attempt.dto';
import { NotificationService } from './academy-notification.service';
import { Course, CourseDocument } from '../entities/course.entity';
import { Lesson, LessonDocument } from '../entities/lesson.entity';

@Injectable()
export class QuizAttemptService {
  private readonly logger = new Logger(QuizAttemptService.name);

  constructor(
    @InjectModel(QuizAttempt.name)
    private quizAttemptModel: Model<QuizAttemptDocument>,

    @InjectModel(Quiz.name)
    private quizModel: Model<QuizDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(UserProgress.name)
    private userProgressModel: Model<UserProgressDocument>,

    @InjectModel(XPHistory.name)
    private xpHistoryModel: Model<XPHistoryDocument>,

    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,

    @InjectModel(Lesson.name)
    private lessonModel: Model<LessonDocument>,

    private notificationService: NotificationService,
  ) {}

  async submitQuiz(userId: string, submitQuizDto: SubmitQuizDto) {
    //   ): Promise<QuizAttemptResponseDto> {
    const { quizId, lessonId, courseId, answers } = submitQuizDto;

    // Validate quiz exists
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new HttpException(`Quiz not found`, HttpStatus.NOT_FOUND);
    }

    // Validate user exists
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    }

    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      throw new HttpException(
        `Invalid answers format. Expected an array of ${quiz.questions.length} answers but got ${answers.length}.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const quizTaken = await this.quizAttemptModel.findOne({
      userId: new Types.ObjectId(userId),
      quizId: new Types.ObjectId(quizId),
      lessonId: new Types.ObjectId(lessonId),
      courseId: new Types.ObjectId(courseId),
    });

    if (quizTaken) {
      throw new HttpException(
        `You have taken this quiz`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Calculate score
    const { score, correctAnswers, totalQuestions, passed } =
      this.calculateQuizScore(quiz, answers);

    // Calculate XP based on performance
    const xpEarned = this.calculateQuizXP(score, totalQuestions, passed);

    // Create quiz attempt
    const quizAttempt = new this.quizAttemptModel({
      userId: new Types.ObjectId(userId),
      quizId: new Types.ObjectId(quizId),
      lessonId: new Types.ObjectId(lessonId),
      courseId: new Types.ObjectId(courseId),
      answers: answers.map((answer, index) => ({
        questionIndex: answer.questionIndex,
        selectedAnswer: answer.selectedAnswer,
        isCorrect:
          answer.selectedAnswer ===
          quiz.questions[answer.questionIndex].correctIndex,
      })),
      score,
      totalQuestions,
      correctAnswers,
      passed,
      xpEarned,
    });

    await quizAttempt.save();

    // Update user progress
    await this.updateUserProgress(
      userId,
      lessonId,
      courseId,
      score,
      xpEarned,
      passed,
    );

    // Update user XP
    await this.updateUserXP(
      userId,
      xpEarned,
      XPActivityType.QUIZ_COMPLETION,
      `Quiz completed with ${score}% score`,
      quizId,
      'quiz',
    );

    // 📧 EMAIL NOTIFICATIONS: Send notifications to admins and user about quiz completion
    // Admin notification includes quiz results, user details, and course/lesson information
    // User notification includes their personal results and encouragement to continue learning
    try {
      const user = await this.userModel
        .findById(userId)
        .select('firstName lastName email');
      const course = await this.courseModel.findById(courseId).select('title');
      const lesson = await this.lessonModel.findById(lessonId).select('title');

      if (user && course && lesson) {
        // Send notification to admins
        await this.notificationService.sendQuizCompletionNotification({
          userName: `${user.firstName} ${user.lastName}`,
          courseName: course.title,
          lessonName: lesson.title,
          quizName: `Quiz ${quiz._id}`,
          score,
          totalQuestions,
          passed,
        });

        // Send notification to the user
        await this.notificationService.sendUserQuizCompletionNotification({
          userEmail: user.email,
          userName: `${user.firstName} ${user.lastName}`,
          courseName: course.title,
          lessonName: lesson.title,
          quizName: `Quiz ${quiz._id}`,
          score,
          totalQuestions,
          passed,
          xpEarned,
        });
      }
    } catch (error) {
      // Log error but don't fail the quiz submission
      this.logger.error('Error sending quiz completion notifications:', error);
    }

    return {
      id: quizAttempt._id.toString(),
      score,
      totalQuestions,
      correctAnswers,
      xpEarned,
      passed: passed,
      message: passed
        ? `Congratulations! You passed with ${score}% and earned ${xpEarned} XP!`
        : `You scored ${score}%. You need 70% to pass. Keep trying!`,
    };
  }

  private calculateQuizScore(quiz: QuizDocument, answers: any[]) {
    const totalQuestions = quiz.questions.length;
    let correctAnswers = 0;

    answers.forEach((answer) => {
      const question = quiz.questions[answer.questionIndex];
      if (question && answer.selectedAnswer === question.correctIndex) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 70; // 70% passing threshold

    return { score, correctAnswers, totalQuestions, passed };
  }

  private calculateQuizXP(
    score: number,
    totalQuestions: number,
    passed: boolean,
  ): number {
    if (!passed) {
      return 5; // Small XP for attempting
    }

    // Base XP for passing
    let xp = 50;

    // Bonus XP for high scores
    if (score >= 90) {
      xp += 30; // Perfect score bonus
    } else if (score >= 80) {
      xp += 20; // High score bonus
    }

    // Bonus XP for longer quizzes
    if (totalQuestions >= 10) {
      xp += 10;
    }

    return xp;
  }

  private async updateUserProgress(
    userId: string,
    lessonId: string,
    courseId: string,
    score: number,
    xpEarned: number,
    passed: boolean,
  ) {
    let userProgress = await this.userProgressModel.findOne({
      userId: new Types.ObjectId(userId),
      lessonId: new Types.ObjectId(lessonId),
      courseId: new Types.ObjectId(courseId),
    });

    if (!userProgress) {
      userProgress = new this.userProgressModel({
        userId: new Types.ObjectId(userId),
        lessonId: new Types.ObjectId(lessonId),
        courseId: new Types.ObjectId(courseId),
        isCompleted: false,
        score: 0,
        xpEarned: 0,
        attempts: 0,
      });
    }

    userProgress.attempts += 1;
    userProgress.xpEarned += xpEarned;

    if (passed) {
      userProgress.isCompleted = true;
      userProgress.score = Math.max(userProgress.score, score);
      userProgress.completedAt = new Date();
    }

    await userProgress.save();
  }

  private async updateUserXP(
    userId: string,
    xpChange: number,
    activityType: XPActivityType,
    description: string,
    relatedEntityId?: string,
    relatedEntityType?: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const previousXP = user.xp;
    const newXP = previousXP + xpChange;

    // Update user XP
    await this.userModel.findByIdAndUpdate(userId, { xp: newXP });

    // Record XP history
    const xpHistory = new this.xpHistoryModel({
      userId: new Types.ObjectId(userId),
      xpChange,
      previousXP,
      newXP,
      activityType,
      description,
      relatedEntityId: relatedEntityId
        ? new Types.ObjectId(relatedEntityId)
        : undefined,
      relatedEntityType,
    });

    await xpHistory.save();
  }

  async getUserQuizAttempts(
    userId: string,
    courseId?: string,
    lessonId?: string,
  ) {
    const filter: any = { userId: new Types.ObjectId(userId) };

    if (courseId) {
      filter.courseId = new Types.ObjectId(courseId);
    }

    if (lessonId) {
      filter.lessonId = new Types.ObjectId(lessonId);
    }

    return this.quizAttemptModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate('quizId', 'questions')
      .populate('courseId', 'title')
      .populate('lessonId', 'title');
  }

  async getQuizAttemptById(attemptId: string) {
    const attempt = await this.quizAttemptModel
      .findById(attemptId)
      .populate('quizId', 'questions')
      .populate('courseId', 'title')
      .populate('lessonId', 'title')
      .populate('userId', 'firstName lastName email');

    if (!attempt) {
      throw new NotFoundException('Quiz attempt not found');
    }

    return attempt;
  }
}
