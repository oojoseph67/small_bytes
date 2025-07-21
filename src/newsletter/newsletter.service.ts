import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Newsletter } from './entities/newsletter.entity';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    @InjectModel(Newsletter.name)
    private readonly newsletterModel: Model<Newsletter>,

    private readonly emailService: EmailService,
  ) {}

  async create(createNewsletterDto: CreateNewsletterDto): Promise<Newsletter> {
    try {
      const newsletter = await this.newsletterModel.create({
        ...createNewsletterDto,
      });

      this.logger.debug(`Newsletter created`);
      this.logger.debug(`Sending welcome email`);

      await this.emailService.sendWelcomeEmail({
        to: createNewsletterDto.email,
        firstName: createNewsletterDto.firstName,
      });

      return newsletter;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Error newsletter`);

      throw new HttpException(
        `Error creating user newsletter`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
