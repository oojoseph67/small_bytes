import { PartialType } from '@nestjs/swagger';
import { CreateBlogPollDto } from './create-blog-poll.dto';

export class UpdateBlogPollDto extends PartialType(CreateBlogPollDto) {}
