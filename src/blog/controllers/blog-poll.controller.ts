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

/**
 * BLOG POLL FLOW OVERVIEW:
 *
 * ADMIN FLOW:
 * 1. Poll Creation: Create interactive polls for blog posts with multiple choice questions
 * 2. Poll Management: Update poll questions, options, correct answers, and XP rewards
 * 3. Poll Deletion: Remove polls and their associated attempts
 * 4. Statistics Access: View detailed poll statistics and user performance metrics
 *
 * USER FLOW:
 * 1. Poll Participation: Answer polls associated with blog posts
 * 2. XP Earning: Earn XP based on correct/incorrect answers (100% for correct, 30% for incorrect)
 * 3. Progress Tracking: View personal poll attempt history and performance
 * 4. Learning Feedback: Receive immediate feedback with explanations and correct answers
 *
 * DETAILED ROUTE BREAKDOWN:
 *
 * POLL MANAGEMENT (Admin Only):
 * - POST /blog-polls - Create new blog poll with question, options, correct answer, and XP reward
 * - PATCH /blog-polls/:pollId - Update poll content, options, or XP rewards
 * - DELETE /blog-polls/:pollId - Delete poll and all associated attempts
 * - GET /blog-polls/:pollId/statistics - View detailed poll statistics (Admin only)
 *
 * POLL PARTICIPATION (Authenticated Users):
 * - POST /blog-polls/submit - Submit poll answer and earn XP
 * - GET /blog-polls/user/attempts - View personal poll attempt history
 * - GET /blog-polls/user/attempts/:blogId - View attempts for specific blog
 *
 * PUBLIC ACCESS:
 * - GET /blog-polls - List all available polls
 * - GET /blog-polls/:pollId - Get specific poll details
 * - GET /blog-polls/blog/:blogId - Get all polls for a specific blog post
 *
 * XP SYSTEM INTEGRATION:
 * - Correct answers: Full XP reward (default 10 XP)
 * - Incorrect answers: 30% of XP reward (3 XP by default)
 * - XP automatically added to user's total and tracked in XP history
 * - Email notifications sent for poll submissions
 *
 * DATA VALIDATION:
 * - Polls must have 2-6 options
 * - Correct index must be within option range
 * - Users can only answer each poll once
 * - XP rewards must be positive integers
 *
 * USAGE PATTERNS:
 * - Admin creates poll: POST /blog-polls
 * - User answers poll: POST /blog-polls/submit
 * - Track performance: GET /blog-polls/user/attempts
 * - View statistics: GET /blog-polls/:pollId/statistics (Admin)
 * - Manage polls: PATCH/DELETE /blog-polls/:pollId (Admin)
 *
 * NB: Polls are tied to specific blog posts and enhance user engagement through gamification
 */
