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

  async sendForgotPasswordEmail({ token, to }: { token: string; to: string }) {
    const link = `${this.frontendUrl}/reset-password?token=${token}`;

    const { html, subject } =
      this.emailTemplatesProvider.sendForgotPasswordEmail({ link });
    await this.sendEmail({ html, subject, to: [to] });
  }

  async sendWelcomeEmail({ to, firstName }: { to: string; firstName: string }) {
    const { html, subject } = this.emailTemplatesProvider.sendWelcomeEmail({
      name: firstName,
    });

    await this.sendEmail({ html, subject, to: [to] });
  }

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
      unsubscribeLink: link
    });

    await this.sendEmail({ html, subject, to: [to] });
  }

  private async sendEmail({ html, subject, to }: SendEmail) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: `Auth Skeleton <${this.resendFromEmail}>`,
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
