import { Module, forwardRef } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Newsletter, NewsletterSchema } from './entities/newsletter.entity';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [NewsletterController],
  providers: [NewsletterService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Newsletter.name,
        schema: NewsletterSchema,
      },
    ]),
    EmailModule,
    forwardRef(() => UserModule),
  ],
  exports: [NewsletterService],
})
export class NewsletterModule {}
