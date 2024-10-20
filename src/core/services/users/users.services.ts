import { ConflictException, HttpException, Injectable } from "@nestjs/common"
import { User } from '@prisma/client'
import { PrismaService } from "../prisma.service"
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto"
import { hash } from "bcrypt"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    // async registerUser
    async registerUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            // Create new user using prisma client
            const newUser = await this.prisma.user.create({
                data: {
                    email: createUserDto.email,
                    password: await hash(createUserDto.password, 10),
                    name: createUserDto.name
                }
            })

            // Delete password from response
            delete newUser.password

            return newUser
        } catch (error) {
            // Check if email already registered
            if (error.code === 'P2002') {
                throw new ConflictException('Email already registered')
            }

            throw new HttpException(error, 500)
        }
    }

    // async loginUser

    // async updateUser

    // async deleteUser
}