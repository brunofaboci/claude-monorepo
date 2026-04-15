import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostQueryDto } from './dto/post-query.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Query() query: PostQueryDto, @Req() req: any) {
    return this.postsService.findAll(query, req.user?.id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.postsService.findOne(id, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePostDto, @Req() req: any) {
    return this.postsService.create(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/likes')
  @HttpCode(HttpStatus.CREATED)
  like(@Param('id') id: string, @Req() req: any) {
    return this.postsService.like(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/likes')
  @HttpCode(HttpStatus.NO_CONTENT)
  unlike(@Param('id') id: string, @Req() req: any) {
    return this.postsService.unlike(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Req() req: any,
  ) {
    return this.postsService.addComment(id, req.user.id, dto);
  }
}
