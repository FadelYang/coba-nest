import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserService } from "src/core/services/users/users.services";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";
import { LoginUserDto } from "src/modules/users/dtos/login-user.dto";
import { UpdateUserDto } from "src/modules/users/dtos/update-user.dto";
import { ExpressRequestWithUser } from "src/modules/users/interfaces/express-request-with-user.interface";
import { LoginResponse, UserPayload } from "src/modules/users/interfaces/users-login-interface";

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    async registerUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.registerUser(createUserDto)
    }

    @Post('login')
    loginUser(@Body() LoginUserDto: LoginUserDto): Promise<LoginResponse> {
        return this.userService.loginUser(LoginUserDto)
    }

    @Get('me')
    me(@Request() req: ExpressRequestWithUser): UserPayload {
        return req.user
    }

    @Patch(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateUserDto: UpdateUserDto
    ): Promise<User> {
        return this.userService.UpdateUser(+id, UpdateUserDto)
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return this.userService.deleteUser(+id)
    }
}