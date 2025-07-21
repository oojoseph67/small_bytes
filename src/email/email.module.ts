import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import resendConfig from 'src/config/resend.config';
import { EmailTemplatesProvider } from './providers/email-templates.provider';

@Module({
  imports: [ConfigModule.forFeature(resendConfig)],
  providers: [EmailService, EmailTemplatesProvider],
  exports: [EmailService]
})
export class EmailModule {}
