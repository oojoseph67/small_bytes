import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFiles,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto, UpdateBlogDto } from '../dto';
import { MulterFile } from 'src/cloudinary/types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Action } from 'src/roles/enums/action.enum';
import { Resource } from 'src/roles/enums/resource.enum';
import { Permissions } from 'src/roles/decorator/permissions.decorator';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.CREATE] }])
  @UseInterceptors(FileFieldsInterceptor([{ name: 'blogImage', maxCount: 1 }]))
  async createBlogPost(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFiles()
    files: {
      blogImage: MulterFile;
    },
  ) {
    return await this.blogService.create({ createBlogDto, files });
  }

  @Post('publish/:id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.UPDATE] }])
  async publicBlogPost(@Param('id') id: string) {
    return await this.blogService.publishBlogPost(id);
  }

  @Get()
  async getPublishedBlogPost() {
    return await this.blogService.getAllPublishedBlogPost();
  }

  @Get('unpublished')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.READ] }])
  async getUnPublishedBlogPost() {
    return await this.blogService.getAllUnPublishedBlogPost();
  }

  @Get(':id')
  async getSingleBlogPost(@Param('id') id: string) {
    const blogPost = await this.blogService.getSingleBlogPost(id);

    if (!blogPost) {
      if (!blogPost) {
        throw new HttpException(
          `Blogpost doesn't exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return blogPost;
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.UPDATE] }])
  @UseInterceptors(FileFieldsInterceptor([{ name: 'blogImage', maxCount: 1 }]))
  async updateBlogPost(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFiles()
    files: {
      blogImage?: MulterFile;
    },
  ) {
    return await this.blogService.update({
      updateBlogDto,
      files,
      blogPostId: id,
    });
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Permissions([{ resource: Resource.BLOG, actions: [Action.DELETE] }])
  async deleteBlogPost(@Param('id') id: string) {
    return await this.blogService.delete(id);
  }
}

/**
 * BLOG POST FLOW OVERVIEW:
 *
 * ADMIN FLOW:
 * 1. Blog Creation: Create blog posts with rich content, categories, tags, and featured images
 * 2. Content Management: Update blog content, images, categories, and tags
 * 3. Publishing Control: Publish/unpublish blog posts to control public visibility
 * 4. Content Deletion: Remove blog posts and associated media
 * 5. Draft Management: Manage unpublished blog posts and drafts
 *
 * USER FLOW:
 * 1. Content Consumption: Read published blog posts with embedded polls
 * 2. Interactive Engagement: Participate in polls associated with blog posts
 * 3. Content Discovery: Browse blog posts by categories and tags
 * 4. Learning Integration: Earn XP through poll participation on blog content
 *
 * DETAILED ROUTE BREAKDOWN:
 *
 * BLOG MANAGEMENT (Admin Only):
 * - POST /blog - Create new blog post with image upload, categories, and tags
 * - PATCH /blog/:id - Update blog post content, image, categories, or tags
 * - DELETE /blog/:id - Delete blog post and associated media
 * - POST /blog/publish/:id - Publish unpublished blog post
 * - GET /blog/unpublished - List all unpublished blog posts (Admin only)
 *
 * PUBLIC ACCESS:
 * - GET /blog - List all published blog posts
 * - GET /blog/:id - Get specific blog post with associated polls
 *
 * MEDIA HANDLING:
 * - Image upload via Cloudinary integration
 * - Automatic media management and optimization
 * - Featured image association with blog posts
 *
 * CONTENT STRUCTURE:
 * - Rich text content with markdown support
 * - Category and tag classification
 * - Featured image for visual appeal
 * - Integration with blog polls for engagement
 * - SEO-friendly slugs and metadata
 *
 * PUBLISHING WORKFLOW:
 * - Draft creation with unpublished status
 * - Admin review and content approval
 * - Manual publishing via publish endpoint
 * - Public visibility control
 *
 * USAGE PATTERNS:
 * - Admin creates draft: POST /blog
 * - Admin publishes: POST /blog/publish/:id
 * - Users read content: GET /blog, GET /blog/:id
 * - Admin manages content: PATCH/DELETE /blog/:id
 * - Admin reviews drafts: GET /blog/unpublished
 *
 * NB: Blog posts serve as the foundation for educational content and poll-based learning
 */
