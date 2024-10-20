import { ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { User } from '@prisma/client'
import { PrismaService } from "../prisma.service"
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto"
import { compare, hash } from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import { LoginUserDto } from "src/modules/users/dtos/login-user.dto"
import { LoginResponse, UserPayload } from "src/modules/users/interfaces/users-login-interface"

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    // async registerUser
    async registerUser(createUserDto: CreateUserDto): Promise<User> {
        try {
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
    async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponse> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email: loginUserDto.email }
            });

            if (!user) {
                throw new NotFoundException('User not found')
            }

            if (!(await compare(loginUserDto.password, user.password))) {
                throw new UnauthorizedException('Invalid credentials')
            }

            const payload: UserPayload = {
                sub: user.id,
                email: user.email,
                name: user.name
            }

            return {
                access_token: await this.jwtService.signAsync(payload)
            }
        } catch (error) {
            
        }
    }

    // async updateUser

    // async deleteUser
}