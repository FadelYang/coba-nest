import { ConflictException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/cors/services/prisma.service";
import { CreatePostDto } from "./dtos/create-post.dto";
import { Post } from "@prisma/client";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto";
import { paginate, paginateOutput, PaginateOutput } from "src/common/utils/pagination.utils";

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async createPost(createPostDto: CreatePostDto): Promise<Post> {
        try {
            const newPost = await this.prisma.post.create({
                data: {
                    ...createPostDto
                }
            })

            return newPost
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Email already registered')
            }

            if (error.code === 'P2003') {
                throw new NotFoundException('Author not found')
            }

            throw new HttpException(error, 500)
        }
    }

    async getAllPosts(query?: QueryPaginationDto): Promise<PaginateOutput<Post>> {
        const [posts, total] = await Promise.all([
          await this.prisma.post.findMany({
            ...paginate(query),
          }),
          await this.prisma.post.count(),
        ]);
      
        return paginateOutput<Post>(posts, total, query);
      }

    async getPostById(id: number): Promise<Post> {
        try {
            const post = await this.prisma.post.findUniqueOrThrow({
                where: { id }
            })

            return post
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Post with id ${id} not found`)
            }

            throw new HttpException(error, 500)
        }
    }

    async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
        try {
            await this.prisma.post.findUniqueOrThrow({
                where: { id }
            })

            const updatedPost = await this.prisma.post.update({
                where: { id },
                data: {
                    ...updatePostDto
                }
            })

            return updatedPost
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Post with id ${id} not found`)
            }

            if (error.code === 'P2002') {
                throw new ConflictException('Email already registered')
            }

            throw new HttpException(Error, 500)
        }
    }

    async deletePost(id: number): Promise<string> {
        try {
            const post = await this.prisma.post.findUniqueOrThrow({
                where: { id }
            })

            await this.prisma.post.delete({
                where: { id }
            })

            return `Post with id ${post.id} deleted`
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Post with id ${id} not found`)
            }

            throw new HttpException(error, 500)
        }
    }
}