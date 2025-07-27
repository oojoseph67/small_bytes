import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BlogPoll, BlogPollDocument } from '../entities/blog-poll.entity';
import {
  BlogPollAttempt,
  BlogPollAttemptDocument,
} from '../entities/blog-poll-attempt.entity';
import { BlogPost, BlogPostDocument } from '../entities/blog.entity';
import { User, UserDocument } from 'src/user/entities/user.entity';
import {
  CreateBlogPollDto,
  UpdateBlogPollDto,
  SubmitBlogPollDto,
} from '../dto';
import { XPHistoryService } from 'src/academy/services/xp-history.service';
import { XPActivityType } from 'src/academy/entities/xp-history.entity';
import { UserService } from 'src/user/user.service';
import { BlogNotificationService } from './blog-notification.service';

@Injectable()
export class BlogPollService {
  private readonly logger = new Logger(BlogPollService.name);

  constructor(
    @InjectModel(BlogPoll.name)
    private readonly blogPollModel: Model<BlogPollDocument>,

    @InjectModel(BlogPollAttempt.name)
    private readonly blogPollAttemptModel: Model<BlogPollAttemptDocument>,

    @InjectModel(BlogPost.name)
    private readonly blogPostModel: Model<BlogPostDocument>,

    private readonly userService: UserService,

    private readonly xpHistoryService: XPHistoryService,

    private readonly blogNotificationService: BlogNotificationService,
  ) {}

  async createBlogPoll(
    createBlogPollDto: CreateBlogPollDto,
  ): Promise<BlogPollDocument> {
    this.logger.debug('Creating blog poll');

    try {
      const { blogId, options, correctIndex } = createBlogPollDto;

      const blog = await this.blogPostModel.findById(blogId);
      if (!blog) {
        throw new HttpException('Blog post not found', HttpStatus.NOT_FOUND);
      }

      if (correctIndex >= options.length) {
        throw new HttpException(
          'Correct index must be less than the number of options',
          HttpStatus.BAD_REQUEST,
        );
      }

      const blogPoll = await this.blogPollModel.create({
        ...createBlogPollDto,
        blogId: new Types.ObjectId(blogId),
      });

      this.logger.log('Blog poll created successfully');
      return await this.getBlogPollById({ pollId: blogPoll.id });
    } catch (error: any) {
      this.logger.error('Error creating blog poll', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error creating blog poll: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async submitBlogPoll({
    userId,
    submitBlogPollDto,
  }: {
    userId: string;
    submitBlogPollDto: SubmitBlogPollDto;
  }) {
    this.logger.debug('Submitting blog poll answer');

    try {
      const { pollId, selectedAnswer } = submitBlogPollDto;

      const poll = await this.blogPollModel.findById(pollId);
      if (!poll) {
        throw new HttpException('Blog poll not found', HttpStatus.NOT_FOUND);
      }

      const user = await this.userService.findUserById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const existingAttempt = await this.blogPollAttemptModel.findOne({
        userId: new Types.ObjectId(userId),
        pollId: new Types.ObjectId(pollId),
      });

      if (existingAttempt) {
        throw new HttpException(
          'You have already answered this poll',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (selectedAnswer >= poll.options.length) {
        throw new HttpException(
          'Selected answer is invalid',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isCorrect = selectedAnswer === poll.correctIndex;

      const xpEarned = isCorrect
        ? poll.xpReward
        : Math.floor(poll.xpReward * 0.3); // 30% XP for wrong answers

      // create poll attempt
      const pollAttempt = new this.blogPollAttemptModel({
        userId: new Types.ObjectId(userId),
        pollId: new Types.ObjectId(pollId),
        blogId: poll.blogId,
        selectedAnswer,
        isCorrect,
        xpEarned,
        description: isCorrect
          ? `Correctly answered blog poll: "${poll.question}"`
          : `Answered blog poll: "${poll.question}"`,
      });

      await pollAttempt.save();

      // update user XP
      await this.xpHistoryService.addXP(
        userId,
        xpEarned,
        XPActivityType.BLOG_POLL_ANSWERED,
        pollAttempt.description,
        pollId,
        'blog_poll',
      );

      /**
       * Notify user about poll submission
       */
      await this.blogNotificationService.notifyUserPollSubmission({
        userEmail: user.email,
        userName: user.firstName,
        passed: isCorrect,
        xpEarned,
      });

      this.logger.log(
        `Blog poll submitted successfully. XP earned: ${xpEarned}`,
      );

      return {
        id: pollAttempt._id.toString(),
        isCorrect,
        xpEarned,
        correctAnswer: poll.correctIndex,
        explanation: poll.explanation,
        message: isCorrect
          ? `Correct! You earned ${xpEarned} XP.`
          : `Incorrect. You earned ${xpEarned} XP for participating.`,
      };
    } catch (error: any) {
      this.logger.error('Error submitting blog poll', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error submitting blog poll: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBlogPollById({
    pollId,
  }: {
    pollId: string;
  }): Promise<BlogPollDocument> {
    this.logger.debug('Getting blog poll by ID');

    try {
      const poll = await this.blogPollModel
        .findById(pollId)
        .populate('blogId', 'title slug');

      //   if (!poll) {
      //     throw new HttpException('Blog poll not found', HttpStatus.NOT_FOUND);
      //   }

      return poll;
    } catch (error: any) {
      this.logger.error('Error fetching blog poll', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error fetching blog poll: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBlogPollsByBlogId({
    blogId,
  }: {
    blogId: string;
  }): Promise<BlogPollDocument[]> {
    this.logger.debug('Getting blog polls by blog ID');

    try {
      return await this.blogPollModel
        .find({
          blogId: new Types.ObjectId(blogId),
          isActive: true,
        })
        .populate('blogId', 'title slug');
    } catch (error: any) {
      this.logger.error('Error fetching blog polls', error.message);

      throw new HttpException(
        `Error fetching blog polls: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllBlogPolls(): Promise<BlogPollDocument[]> {
    this.logger.debug('Getting all blog polls');

    try {
      return await this.blogPollModel
        .find()
        .populate('blogId', 'title slug')
        .sort({ createdAt: -1 });
    } catch (error: any) {
      this.logger.error('Error fetching all blog polls', error.message);

      throw new HttpException(
        `Error fetching blog polls: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBlogPoll({
    pollId,
    updateBlogPollDto,
  }: {
    pollId: string;
    updateBlogPollDto: UpdateBlogPollDto;
  }): Promise<BlogPollDocument> {
    this.logger.debug('Updating blog poll');

    try {
      const poll = await this.getBlogPollById({ pollId });

      if (!poll) {
        throw new HttpException('Blog poll not found', HttpStatus.NOT_FOUND);
      }

      // Validate correct index if options are being updated
      if (
        updateBlogPollDto.options &&
        updateBlogPollDto.correctIndex !== undefined
      ) {
        if (
          updateBlogPollDto.correctIndex >= updateBlogPollDto.options.length
        ) {
          throw new HttpException(
            'Correct index must be less than the number of options',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const updatedPoll = await this.blogPollModel
        .findByIdAndUpdate(pollId, updateBlogPollDto, {
          new: true,
          runValidators: true,
        })
        .populate('blogId', 'title slug');

      this.logger.log('Blog poll updated successfully');
      return updatedPoll;
    } catch (error: any) {
      this.logger.error('Error updating blog poll', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error updating blog poll: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteBlogPoll({ pollId }: { pollId: string }): Promise<string> {
    this.logger.debug('Deleting blog poll');

    try {
      const poll = await this.blogPollModel.findByIdAndDelete(pollId);

      if (!poll) {
        throw new HttpException('Blog poll not found', HttpStatus.NOT_FOUND);
      }

      // Also delete all attempts for this poll
      await this.blogPollAttemptModel.deleteMany({
        pollId: new Types.ObjectId(pollId),
      });

      this.logger.log('Blog poll deleted successfully');
      return 'Blog poll deleted successfully';
    } catch (error: any) {
      this.logger.error('Error deleting blog poll', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error deleting blog poll: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserPollAttempts(
    userId: string,
    blogId?: string,
  ): Promise<BlogPollAttemptDocument[]> {
    this.logger.debug('Getting user poll attempts');

    try {
      const filter: any = { userId: new Types.ObjectId(userId) };

      if (blogId) {
        filter.blogId = new Types.ObjectId(blogId);
      }

      return await this.blogPollAttemptModel
        .find(filter)
        .populate('pollId', 'question options')
        .populate('blogId', 'title slug')
        .sort({ createdAt: -1 });
    } catch (error: any) {
      this.logger.error('Error fetching user poll attempts', error.message);

      throw new HttpException(
        `Error fetching user poll attempts: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPollStatistics({ pollId }: { pollId: string }) {
    this.logger.debug('Getting poll statistics');

    try {
      const poll = await this.getBlogPollById({ pollId });

      const attempts = await this.blogPollAttemptModel.find({
        pollId: new Types.ObjectId(pollId),
      });

      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter(
        (attempt) => attempt.isCorrect,
      ).length;
      const incorrectAttempts = totalAttempts - correctAttempts;

      const optionCounts = new Array(poll.options.length).fill(0);
      attempts.forEach((attempt) => {
        if (attempt.selectedAnswer < optionCounts.length) {
          optionCounts[attempt.selectedAnswer]++;
        }
      });

      return {
        pollId,
        question: poll.question,
        options: poll.options,
        totalAttempts,
        correctAttempts,
        incorrectAttempts,
        accuracy:
          totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0,
        optionCounts,
        correctAnswer: poll.correctIndex,
      };
    } catch (error: any) {
      this.logger.error('Error fetching poll statistics', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error fetching poll statistics: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
