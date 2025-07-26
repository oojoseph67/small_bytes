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
import { BlogService } from './services/blog.service';
import { CreateBlogDto, UpdateBlogDto } from './dto';
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
