import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { CreateUserDto } from "src/modules/users/dtos/create-user.dto";
import { LoginUserDto } from "src/modules/users/dtos/login-user.dto";
import { UpdateUserDto } from "src/modules/users/dtos/update-user.dto";

@Controller('users')
export class UsersController {
    @Post('register')
    registerUser(@Body() CreateUserDto: CreateUserDto): string {
        console.log(CreateUserDto)
        return 'Post User!'
    }

    @Post('login')
    loginUser(@Body() LoginUserDto: LoginUserDto): string {
        console.log(LoginUserDto)
        return 'Login User!'
    }

    @Get('me')
    me(): string {
        return 'Get my Profile!'
    }

    @Patch()
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateUserDto: UpdateUserDto
    ): string {
        console.log(UpdateUserDto);
        return `Update User ${id}`
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number): string {
        return `Delete User ${id}`
    }
}