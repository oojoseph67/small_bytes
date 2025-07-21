import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { PostNewsletterDto } from './dto/post-newsletter.dto';
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

  async postNewsletter(postNewsletterDto: PostNewsletterDto) {
    try {
      this.logger.debug(`Sending mass emails`);
      const emails = await this.getEmails();

      for (const email of emails) {
        const { email: userEmail } = email;
        this.logger.debug(`Sending email for: ${userEmail}`);

        await this.emailService.sendNewsletter({
          content: postNewsletterDto.markdown,
          newsletterSubject: postNewsletterDto.subject,
          to: userEmail,
        });
      }
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

  private async getEmails(): Promise<Newsletter[]> {
    try {
      return await this.newsletterModel.find().exec();
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

// const newsletterTemplate = emailTemplatesProvider.sendNewsletterEmail({
//   subject: "This Week in Tech - Issue #42",
//   content: `
// # This Week in Tech Newsletter

// Welcome to another exciting week in the world of technology! Here's what's been happening.

// ## �� Major Updates

// ### JavaScript ES2024 Features
// The latest ECMAScript proposal includes some **amazing new features**:

// * **Array grouping**: Group array elements by a key
// * **Temporal API**: Better date/time handling
// * **Pipeline operator**: Functional programming made easier

// ### React 19 Release Candidate
// React team just announced the RC for version 19 with:

// 1. **Concurrent features** by default
// 2. **Improved server components**
// 3. **Better performance** across the board

// ## 💻 Code Snippet of the Week

// Here's a cool example using the new array grouping:

// \`\`\`javascript
// const users = [
//   { name: 'Alice', age: 25, city: 'NYC' },
//   { name: 'Bob', age: 30, city: 'SF' },
//   { name: 'Charlie', age: 25, city: 'NYC' }
// ];

// const grouped = users.groupBy(user => user.city);
// console.log(grouped);
// // Output: { NYC: [...], SF: [...] }
// \`\`\`

// ## 🔗 Useful Links

// * [React 19 RC Announcement](https://react.dev/blog/2024/react-19-rc)
// * [ES2024 Proposal](https://github.com/tc39/proposals)
// * [TypeScript 5.5 Release Notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/)

// ## 💡 Pro Tip

// > Always keep your dependencies updated and test thoroughly before deploying to production. A small change in a dependency can sometimes break your entire application!

// ---

// ## 📊 Community Highlights

// This week we had **1,234 new subscribers** join our community! Welcome everyone! ��

// ### What's Coming Next

// * Deep dive into **Web Components**
// * **Performance optimization** techniques
// * **Security best practices** for web apps

// ---

// Thanks for reading! If you found this useful, please share with your fellow developers.

// Happy coding! 👨‍💻👩‍��
//   `,
//   unsubscribeLink: "https://smallbytes.com/unsubscribe?token=abc123&email=user@example.com"
// });
