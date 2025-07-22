import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { NewsletterModule } from 'src/newsletter/newsletter.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),

    RolesModule,

    forwardRef(() => NewsletterModule),

    EmailModule,
  ],
  exports: [UserService],
})
export class UserModule {}
