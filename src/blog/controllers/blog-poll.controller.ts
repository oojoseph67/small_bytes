import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { BlogPollService } from '../services/blog-poll.service';
import {
  CreateBlogPollDto,
  UpdateBlogPollDto,
  SubmitBlogPollDto,
} from '../dto';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Permissions } from 'src/roles/decorator/permissions.decorator';
import { Action } from 'src/roles/enums/action.enum';
import { Resource } from 'src/roles/enums/resource.enum';
import { AccessTokenPayload } from 'src/auth/type/auth.type';

@Controller('blog-polls')
export class BlogPollController {
  constructor(private readonly blogPollService: BlogPollService) {}
  
  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.CREATE] }])
  @HttpCode(HttpStatus.CREATED)
  async createBlogPoll(@Body() createBlogPollDto: CreateBlogPollDto) {
    return await this.blogPollService.createBlogPoll(createBlogPollDto);
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.POST] }])
  async submitBlogPoll(
    @Request() req: any,
    @Body() submitBlogPollDto: SubmitBlogPollDto,
  ) {
    const userId = req.user.userId as AccessTokenPayload['userId'];
    return await this.blogPollService.submitBlogPoll({
      userId,
      submitBlogPollDto,
    });
  }

  @Get()
  async getAllBlogPolls() {
    return await this.blogPollService.getAllBlogPolls();
  }

  @Get(':pollId')
  async getBlogPollById(@Param('pollId') pollId: string) {
    return await this.blogPollService.getBlogPollById({ pollId });
  }

  @Get('blog/:blogId')
  async getBlogPollsByBlogId(@Param('blogId') blogId: string) {
    return await this.blogPollService.getBlogPollsByBlogId({ blogId });
  }

  @Get(':pollId/statistics')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.ADMIN, actions: [Action.READ] }])
  async getPollStatistics(@Param('pollId') pollId: string) {
    return await this.blogPollService.getPollStatistics({ pollId });
  }

  @Get('user/attempts')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.READ] }])
  async getUserPollAttempts(@Request() req: any) {
    const userId = req.user.userId as AccessTokenPayload['userId'];
    return await this.blogPollService.getUserPollAttempts(userId);
  }

  @Get('user/attempts/:blogId')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.READ] }])
  async getUserPollAttemptsByBlog(
    @Request() req: any,
    @Param('blogId') blogId: string,
  ) {
    const userId = req.user.userId as AccessTokenPayload['userId'];
    return await this.blogPollService.getUserPollAttempts(userId, blogId);
  }

  @Patch(':pollId')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.UPDATE] }])
  async updateBlogPoll(
    @Param('pollId') pollId: string,
    @Body() updateBlogPollDto: UpdateBlogPollDto,
  ) {
    return await this.blogPollService.updateBlogPoll({
      pollId,
      updateBlogPollDto,
    });
  }

  @Delete(':pollId')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.DELETE] }])
  @HttpCode(HttpStatus.OK)
  async deleteBlogPoll(@Param('pollId') pollId: string) {
    return await this.blogPollService.deleteBlogPoll({ pollId });
  }
}
