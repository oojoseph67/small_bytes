import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BlogNotificationService {
  private readonly logger = new Logger(BlogNotificationService.name);

  constructor(private readonly emailService: EmailService) {}

  async notifyUserPollSubmission({
    userEmail,
    userName,
    passed,
    xpEarned,
  }: {
    userEmail: string;
    userName: string;
    passed: boolean;
    xpEarned: number;
  }): Promise<void> {
    try {
      await this.emailService.sendUserBlogPollCompletionNotification({
        to: userEmail,
        userName,
        passed,
        xpEarned,
      });

      this.logger.log(
        `User blog pool completion notification sent to ${userEmail}`,
      );
    } catch (error) {
      this.logger.error(
        'Error sending user blog pool completion notification:',
        error,
      );
    }
  }
}
