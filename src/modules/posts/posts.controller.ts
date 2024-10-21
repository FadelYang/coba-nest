import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { Post as CPost } from '@prisma/client';
import { CreatePostDto } from "./dtos/create-post.dto";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";
import { Public } from "src/common/decorators/public.decorator";
import { IsMineGuard } from "src/common/is-mine.guard";
import { UpdatePostDto } from "./dtos/update-post.dto";

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @Request() req: ExpressRequestWithUser
    ): Promise <CPost> {
        createPostDto.authorId = req.user.sub
        return this.postsService.createPost(createPostDto)
    }

    @Public()
    @Get()
    getAllPosts(): Promise<CPost[]> {
        return this.postsService.getAllPosts()
    }

    @Public()
    @Get(':id')
    getPostById(@Param('id', ParseIntPipe) id: number): Promise<CPost> {
      return this.postsService.getPostById(id);
    }

    @Patch(':id')
    @UseGuards(IsMineGuard)
    async updatePost(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdatePostDto: UpdatePostDto
    ): Promise<CPost> {
        return this.postsService.updatePost(+id, UpdatePostDto)
    }

    @Delete(':id')
    @UseGuards(IsMineGuard)
    async deletePost(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return this.postsService.deletePost(+id)
    }
}