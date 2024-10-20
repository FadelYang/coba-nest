import { ConflictException, HttpException, Injectable } from "@nestjs/common"
import { User } from '@prisma/client'
import { PrismaService } from "../prisma.service"
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto"
import { hash } from "bcrypt"

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    // async registerUser

    // async loginUser

    // async updateUser

    // async deleteUser
}