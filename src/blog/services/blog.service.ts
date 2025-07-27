import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from '../dto';
import { InjectModel } from '@nestjs/mongoose';
import { BlogPollDocument, BlogPost, BlogPostDocument } from '../entities';
import { Model, Types } from 'mongoose';
import { BlogMediaService } from './blog-media.service';
import { MulterFile } from 'src/cloudinary/types';
import { BlogPollService } from './blog-poll.service';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    @InjectModel(BlogPost.name)
    private readonly blogPostModel: Model<BlogPostDocument>,

    private readonly blogMediaService: BlogMediaService,

    private readonly blogPollService: BlogPollService,
  ) {}

  async create({
    createBlogDto,
    files,
  }: {
    createBlogDto: CreateBlogDto;
    files: {
      blogImage: MulterFile;
    };
  }): Promise<BlogPostDocument> {
    this.logger.debug('creating blog post');

    try {
      const { categories, tags } = createBlogDto;

      if (!files) {
        throw new HttpException(
          `Please upload an image`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!categories || !tags) {
        throw new HttpException(
          'Provide both categories and tags field',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!Array.isArray(tags) || !Array.isArray(categories)) {
        throw new HttpException(
          'Tags and Categories are not array',
          HttpStatus.BAD_REQUEST,
        );
      }

      const blogMedia = await this.blogMediaService.uploadBlogMedia(
        files.blogImage,
      );

      if (!blogMedia) {
        throw new HttpException(
          `Failed to upload image`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const blogPost = await this.blogPostModel.create({
        ...createBlogDto,
        featuredImage: new Types.ObjectId(blogMedia._id.toString()),
      });

      this.logger.log('blog post created');

      const resultBlogPost = await this.getSingleBlogPost(blogPost.id);

      return resultBlogPost.blogPost;
    } catch (error: any) {
      this.logger.error('error creating blog post', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error creating blog: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async publishBlogPost(blogPostId: string): Promise<BlogPostDocument> {
    this.logger.debug('publishing blog post');
    try {
      const resultBlogPost = await this.getSingleBlogPost(blogPostId);
      const blogPost = resultBlogPost.blogPost;

      if (!blogPost) {
        throw new HttpException(
          `Blogpost doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }

      blogPost.isPublished = true;

      await blogPost.save();

      return blogPost;
    } catch (error: any) {
      this.logger.error('error publishing blog post', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error publishing blog post: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSingleBlogPost(
    blogPostId: string,
  ): Promise<{ blogPost: BlogPostDocument; blogPoll: BlogPollDocument[] }> {
    this.logger.debug('getting single blog post');

    try {
      const blogPost = await this.blogPostModel
        .findById(blogPostId)
        .populate('featuredImage');

      const blogPoll = await this.blogPollService.getBlogPollsByBlogId({
        blogId: blogPost._id.toString(),
      });

      return {
        blogPoll,
        blogPost,
      };
    } catch (error: any) {
      this.logger.error('error fetching single blog post', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error fetching single blog post: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPublishedBlogPost(): Promise<{
    blogPost: BlogPostDocument[];
    blogPoll: BlogPollDocument[];
  }> {
    this.logger.debug('getting all published blog post');

    try {
      const blogPost = await this.blogPostModel
        .find({ isPublished: true })
        .populate('featuredImage');

      // Get all blog polls for all published posts
      const blogPollPromises = blogPost.map((post) =>
        this.blogPollService.getBlogPollsByBlogId({
          blogId: post._id.toString(),
        }),
      );
      const blogPollResults = await Promise.all(blogPollPromises);
      const blogPoll = blogPollResults.flat();

      return {
        blogPost,
        blogPoll,
      };
    } catch (error: any) {
      this.logger.error('error fetching published blog posts', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error fetching published blog posts: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUnPublishedBlogPost(): Promise<{
    blogPost: BlogPostDocument[];
    blogPoll: BlogPollDocument[];
  }> {
    this.logger.debug('getting all unpublished blog post');

    try {
      const blogPost = await this.blogPostModel
        .find({ isPublished: false })
        .populate('featuredImage');

      const blogPollPromises = blogPost.map((post) =>
        this.blogPollService.getBlogPollsByBlogId({
          blogId: post._id.toString(),
        }),
      );
      const blogPollResults = await Promise.all(blogPollPromises);
      const blogPoll = blogPollResults.flat();

      return {
        blogPost,
        blogPoll,
      };
    } catch (error: any) {
      this.logger.error('error fetching unpublished blog posts', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error fetching unpublished blog posts: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update({
    blogPostId,
    updateBlogDto,
    files,
  }: {
    blogPostId: string;
    updateBlogDto: UpdateBlogDto;
    files?: {
      blogImage?: MulterFile;
    };
  }): Promise<BlogPostDocument> {
    this.logger.debug('updating blog post');

    try {
      const resultBlogPost = await this.getSingleBlogPost(blogPostId);
      const blogPost = resultBlogPost.blogPost;

      if (!blogPost) {
        throw new HttpException(`Blog post not found`, HttpStatus.NOT_FOUND);
      }

      const updateData: any = { ...updateBlogDto };

      if (files?.blogImage) {
        const blogMedia = await this.blogMediaService.uploadBlogMedia(
          files.blogImage,
        );

        if (!blogMedia) {
          throw new HttpException(
            `Failed to upload image`,
            HttpStatus.BAD_REQUEST,
          );
        }

        updateData.featuredImage = new Types.ObjectId(blogMedia._id.toString());
      }

      // Update the blog post
      const updatedBlogPost = await this.blogPostModel
        .findByIdAndUpdate(blogPostId, updateData, {
          new: true,
          runValidators: true,
        })
        .populate('featuredImage');

      if (!updatedBlogPost) {
        throw new HttpException(
          `Failed to update blog post`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log('blog post updated successfully');

      return updatedBlogPost;
    } catch (error: any) {
      this.logger.error('error updating blog post', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error updating blog post: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(blogPostId: string) {
    this.logger.debug('deleting blog post');

    try {
      const blogPost = await this.blogPostModel.findByIdAndDelete(blogPostId);

      if (!blogPost) {
        throw new HttpException(`Blog post not found`, HttpStatus.NOT_FOUND);
      }

      return 'Blog post deleted successfully';
    } catch (error: any) {
      this.logger.error('error deleting blog post', error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Error deleting blog post: ${error.message || 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
