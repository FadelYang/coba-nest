import { Body, Controller, Post, Request } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { Post as CPost } from '@prisma/client';
import { CreatePostDto } from "./dtos/create-post.dto";
import { ExpressRequestWithUser } from "../users/interfaces/express-request-with-user.interface";

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
}