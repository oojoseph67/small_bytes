import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserProgress,
  UserProgressDocument,
} from '../entities/user-progress.entity';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { Course, CourseDocument } from '../entities/course.entity';
import { Lesson, LessonDocument } from '../entities/lesson.entity';
import {
  UserCertificate,
  UserCertificateDocument,
} from '../entities/user-certificate.entity';
import {
  XPHistory,
  XPHistoryDocument,
  XPActivityType,
} from '../entities/xp-history.entity';
import {
  GetUserProgressDto,
  UserProgressResponseDto,
  CourseProgressDto,
} from '../dto/user-progress.dto';

@Injectable()
export class UserProgressService {
  constructor(
    @InjectModel(UserProgress.name)
    private userProgressModel: Model<UserProgressDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,

    @InjectModel(Lesson.name)
    private lessonModel: Model<LessonDocument>,

    @InjectModel(UserCertificate.name)
    private userCertificateModel: Model<UserCertificateDocument>,

    @InjectModel(XPHistory.name)
    private xpHistoryModel: Model<XPHistoryDocument>,
  ) {}

  async getUserProgress(userId: string, filters?: GetUserProgressDto) {
    const filter: any = { userId: new Types.ObjectId(userId) };

    if (filters?.courseId) {
      filter.courseId = new Types.ObjectId(filters.courseId);
    }

    if (filters?.lessonId) {
      filter.lessonId = new Types.ObjectId(filters.lessonId);
    }

    const progress = await this.userProgressModel
      .find(filter)
      .populate('courseId', 'title description category')
      .populate('lessonId', 'title description')
      .sort({ updatedAt: -1 });

    return progress.map((p) => ({
      id: p._id.toString(),
      userId: p.userId.toString(),
      courseId: p.courseId.toString(),
      lessonId: p.lessonId.toString(),
      isCompleted: p.isCompleted,
      score: p.score,
      xpEarned: p.xpEarned,
      attempts: p.attempts,
      completedAt: p.completedAt?.toISOString(),
    }));
  }

  async getCourseProgress(
    userId: string,
    courseId: string,
  ): Promise<CourseProgressDto> {
    // Get course details
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Get all lessons in the course
    const lessons = await this.lessonModel.find({
      _id: { $in: course.lessons || [] },
    });

    // Get user progress for all lessons in this course
    const userProgress = await this.userProgressModel.find({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });

    const totalLessons = lessons.length;
    const completedLessons = userProgress.filter((p) => p.isCompleted).length;
    const totalXP = userProgress.reduce((sum, p) => sum + p.xpEarned, 0);

    const completedProgress = userProgress.filter((p) => p.isCompleted);
    const averageScore =
      completedProgress.length > 0
        ? completedProgress.reduce((sum, p) => sum + p.score, 0) /
          completedProgress.length
        : 0;

    const isCompleted = completedLessons === totalLessons && totalLessons > 0;

    // Check if certificate should be awarded
    if (isCompleted && !(await this.hasUserCertificate(userId, courseId))) {
      await this.awardCertificate(userId, courseId, averageScore);
    }

    return {
      courseId,
      totalLessons,
      completedLessons,
      totalXP,
      averageScore: Math.round(averageScore),
      isCompleted,
    };
  }

  async getAllCoursesProgress(userId: string) {
    const courses = await this.courseModel.find();
    const progressPromises = courses.map((course) =>
      this.getCourseProgress(userId, course._id.toString()),
    );

    return Promise.all(progressPromises);
  }

  async getUserStats(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const totalProgress = await this.userProgressModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isCompleted: true,
    });

    const totalXP = await this.xpHistoryModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$xpChange' } } },
    ]);

    const certificatesEarned = await this.userCertificateModel.countDocuments({
      userId: new Types.ObjectId(userId),
    });

    const coursesCompleted = await this.userProgressModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId), isCompleted: true } },
      { $group: { _id: '$courseId' } },
      { $count: 'total' },
    ]);

    return {
      userId,
      currentXP: user.xp,
      totalXP: totalXP[0]?.total || 0,
      totalActivities: totalProgress,
      certificatesEarned,
      coursesCompleted: coursesCompleted[0]?.total || 0,
    };
  }

  private async hasUserCertificate(
    userId: string,
    courseId: string,
  ): Promise<boolean> {
    const certificate = await this.userCertificateModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });
    return !!certificate;
  }

  private async awardCertificate(
    userId: string,
    courseId: string,
    finalScore: number,
  ) {
    const course = await this.courseModel
      .findById(courseId)
      .populate('certificate');
    if (!course || !course.certificate) {
      return; // No certificate configured for this course
    }

    const certificateNumber = this.generateCertificateNumber();
    const xpEarned = this.calculateCertificateXP(finalScore);

    const userCertificate = new this.userCertificateModel({
      userId: new Types.ObjectId(userId),
      certificateId: course.certificate,
      courseId: new Types.ObjectId(courseId),
      certificateNumber,
      xpEarned,
      finalScore,
    });

    await userCertificate.save();

    // Award XP for certificate
    await this.updateUserXP(
      userId,
      xpEarned,
      XPActivityType.CERTIFICATE_EARNED,
      `Certificate earned for ${course.title}`,
      course.certificate.toString(),
      'certificate',
    );

    // Award XP for course completion
    const courseCompletionXP = 100;
    await this.updateUserXP(
      userId,
      courseCompletionXP,
      XPActivityType.COURSE_COMPLETION,
      `Course completed: ${course.title}`,
      courseId,
      'course',
    );
  }

  private generateCertificateNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CERT-${timestamp}-${random}`.toUpperCase();
  }

  private calculateCertificateXP(finalScore: number): number {
    // Base XP for earning a certificate
    let xp = 200;

    // Bonus XP for high scores
    if (finalScore >= 90) {
      xp += 100; // Perfect score bonus
    } else if (finalScore >= 80) {
      xp += 50; // High score bonus
    }

    return xp;
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
}
