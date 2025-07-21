import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { Permissions } from 'src/roles/decorator/permissions.decorator';
import { Resource } from 'src/roles/enums/resource.enum';
import { Action } from 'src/roles/enums/action.enum';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { PostNewsletterDto } from './dto/post-newsletter.dto';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post()
  @Permissions([{ resource: Resource.NEWSLETTER, actions: [Action.CREATE] }])
  create(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.create(createNewsletterDto);
  }

  @Post('/post-newsletter')
  @Permissions([{ resource: Resource.NEWSLETTER, actions: [Action.CREATE] }])
  postNewsletter(@Body() postNewsletterDto: PostNewsletterDto) {
    return this.newsletterService.postNewsletter(postNewsletterDto);
  }

  @Get('/active-subscribers')
  @Permissions([{ resource: Resource.ADMIN, actions: [Action.READ] }])
  activeSubscribers() {
    return this.newsletterService.getAllActiveSubscribers();
  }

  @Get('/unsubscribes')
  @Permissions([{ resource: Resource.ADMIN, actions: [Action.READ] }])
  unsubscribes() {
    return this.newsletterService.getAllUnSubscribedEmails();
  }

  @Post('unsubscribe')
  // @Permissions([{ resource: Resource.NEWSLETTER, actions: [Action.UPDATE] }])
  unsubscribe(@Query('email') email: string, @Query('reason') reason?: string) {
    return this.newsletterService.unsubscribe(email, reason);
  }
}
