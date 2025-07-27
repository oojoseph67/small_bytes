import { Inject, Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { SendEmail } from './type/email.type';
import resendConfig from 'src/config/resend.config';
import { ConfigType } from '@nestjs/config';
import { EmailTemplatesProvider } from './providers/email-templates.provider';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly resendFromEmail: string;
  private readonly frontendUrl = 'http://app.com';

  constructor(
    @Inject(resendConfig.KEY)
    private resendConfiguration: ConfigType<typeof resendConfig>,

    private emailTemplatesProvider: EmailTemplatesProvider,
  ) {
    this.resend = new Resend(this.resendConfiguration.resendApiKey);
    this.resendFromEmail = this.resendConfiguration.resendFromEmail;
  }

  /**
   * Send forgot password email to users
   */
  async sendForgotPasswordEmail({ token, to }: { token: string; to: string }) {
    const link = `${this.frontendUrl}/reset-password?token=${token}`;

    const { html, subject } =
      this.emailTemplatesProvider.sendForgotPasswordEmail({ link });
    await this.sendEmail({ html, subject, to: [to] });
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail({ to, firstName }: { to: string; firstName: string }) {
    const { html, subject } = this.emailTemplatesProvider.sendWelcomeEmail({
      name: firstName,
    });

    await this.sendEmail({ html, subject, to: [to] });
  }

  /**
   * Send newsletter to users
   */
  async sendNewsletter({
    newsletterSubject,
    content,
    to,
  }: {
    newsletterSubject: string;
    content: string;
    to: string;
  }) {
    const link = `${this.frontendUrl}/unsubscribe/?email=${to}`;

    const { html, subject } = this.emailTemplatesProvider.sendNewsletterEmail({
      content,
      subject: newsletterSubject,
      unsubscribeLink: link,
    });

    await this.sendEmail({ html, subject, to: [to] });
  }

  /**
   * Send notification to admin when a user completes a quiz
   */
  async sendQuizCompletionNotification({
    to,
    adminName,
    userName,
    courseName,
    lessonName,
    quizName,
    score,
    totalQuestions,
    passed,
  }: {
    to: string;
    adminName: string;
    userName: string;
    courseName: string;
    lessonName: string;
    quizName: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
  }) {
    const { html, subject } =
      this.emailTemplatesProvider.sendQuizCompletionNotification({
        adminName,
        userName,
        courseName,
        lessonName,
        quizName,
        score,
        totalQuestions,
        passed,
      });

    await this.sendEmail({ html, subject, to: [to] });
  }

  /**
   * Send notification to all admins when a new course is created
   */
  async sendCourseCreationNotification({
    to,
    adminName,
    courseName,
    courseDescription,
    courseCreator,
  }: {
    to: string;
    adminName: string;
    courseName: string;
    courseDescription: string;
    courseCreator: string;
  }) {
    const { html, subject } =
      this.emailTemplatesProvider.sendCourseCreationNotification({
        adminName,
        courseName,
        courseDescription,
        courseCreator,
      });

    await this.sendEmail({ html, subject, to: [to] });
  }

  /**
   * Send quiz completion notification to the user who took the quiz
   */
  async sendUserQuizCompletionNotification({
    to,
    userName,
    courseName,
    lessonName,
    quizName,
    score,
    totalQuestions,
    passed,
    xpEarned,
  }: {
    to: string;
    userName: string;
    courseName: string;
    lessonName: string;
    quizName: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
    xpEarned: number;
  }) {
    const { html, subject } =
      this.emailTemplatesProvider.sendUserQuizCompletionNotification({
        userName,
        courseName,
        lessonName,
        quizName,
        score,
        totalQuestions,
        passed,
        xpEarned,
      });

    await this.sendEmail({ html, subject, to: [to] });
  }

  /**
   * Send blog pool completion notification to the user who took it
   */
  async sendUserBlogPollCompletionNotification({
    to,
    userName,
    passed,
    xpEarned,
  }) {
    const { html, subject } =
      this.emailTemplatesProvider.sendUserBlogPollCompletionNotification({
        userName,
        passed,
        xpEarned,
      });
    await this.sendEmail({ html, subject, to: [to] });
  }

  private async sendEmail({ html, subject, to }: SendEmail) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `Small Bytes <${this.resendFromEmail}>`,
        to: to,
        subject: subject,
        html: html,
      });

      if (error) {
        console.log({ error });
        this.logger.error(`Error sending mail: ${error}`);
      }

      this.logger.log('send email', { data });
    } catch (error: any) {
      this.logger.error(`TryCatch: Error sending mail: ${error}`);
    }
  }
}
