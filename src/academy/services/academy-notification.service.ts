import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    
    private readonly emailService: EmailService,
    private readonly rolesService: RolesService,
  ) {}

  /**
   * Get all admin users for sending notifications
   */
  private async getAdminUsers(): Promise<User[]> {
    try {
      const adminRole = await this.rolesService.getRoleByName('admin');
      
      const adminUsers = await this.userModel
        .find({ roleId: adminRole._id })
        .select('email firstName lastName')
        .exec();

      return adminUsers;
    } catch (error) {
      this.logger.error('Error fetching admin users:', error);
      return [];
    }
  }

  /**
   * Send quiz completion notification to all admins
   */
  async sendQuizCompletionNotification({
    userName,
    courseName,
    lessonName,
    quizName,
    score,
    totalQuestions,
    passed,
  }: {
    userName: string;
    courseName: string;
    lessonName: string;
    quizName: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
  }): Promise<void> {
    try {
      const adminUsers = await this.getAdminUsers();
      
      if (adminUsers.length === 0) {
        this.logger.warn('No admin users found for quiz completion notification');
        return;
      }

      // Send notification to each admin
      const notificationPromises = adminUsers.map(admin => 
        this.emailService.sendQuizCompletionNotification({
          to: admin.email,
          adminName: admin.firstName,
          userName,
          courseName,
          lessonName,
          quizName,
          score,
          totalQuestions,
          passed,
        })
      );

      await Promise.all(notificationPromises);
      
      this.logger.log(`Quiz completion notification sent to ${adminUsers.length} admin(s)`);
    } catch (error) {
      this.logger.error('Error sending quiz completion notification:', error);
    }
  }

  /**
   * Send course creation notification to all admins
   */
  async sendCourseCreationNotification({
    courseName,
    courseDescription,
    courseCreator,
  }: {
    courseName: string;
    courseDescription: string;
    courseCreator: string;
  }): Promise<void> {
    try {
      const adminUsers = await this.getAdminUsers();
      
      if (adminUsers.length === 0) {
        this.logger.warn('No admin users found for course creation notification');
        return;
      }

      // Send notification to each admin
      const notificationPromises = adminUsers.map(admin => 
        this.emailService.sendCourseCreationNotification({
          to: admin.email,
          adminName: admin.firstName,
          courseName,
          courseDescription,
          courseCreator,
        })
      );

      await Promise.all(notificationPromises);
      
      this.logger.log(`Course creation notification sent to ${adminUsers.length} admin(s)`);
    } catch (error) {
      this.logger.error('Error sending course creation notification:', error);
    }
  }

  /**
   * Send quiz completion notification to the user who took the quiz
   */
  async sendUserQuizCompletionNotification({
    userEmail,
    userName,
    courseName,
    lessonName,
    quizName,
    score,
    totalQuestions,
    passed,
    xpEarned,
  }: {
    userEmail: string;
    userName: string;
    courseName: string;
    lessonName: string;
    quizName: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
    xpEarned: number;
  }): Promise<void> {
    try {
      await this.emailService.sendUserQuizCompletionNotification({
        to: userEmail,
        userName,
        courseName,
        lessonName,
        quizName,
        score,
        totalQuestions,
        passed,
        xpEarned,
      });
      
      this.logger.log(`User quiz completion notification sent to ${userEmail}`);
    } catch (error) {
      this.logger.error('Error sending user quiz completion notification:', error);
    }
  }
} 