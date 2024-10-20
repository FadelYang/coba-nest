import { Module } from "@nestjs/common";
import { UsersController } from "src/controllers/users.controller";
import { UserService } from "src/core/services/users/users.services";

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [UserService]
})
export class UsersModule { }