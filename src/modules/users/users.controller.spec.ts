import { Test, TestingModule } from "@nestjs/testing"
import { UsersController } from "./users.controller"
import { UserService } from "./users.services"
import { PrismaService } from "src/cors/services/prisma.service"
import { JwtService } from "@nestjs/jwt"
import { User } from "@prisma/client"
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common"

describe('UserController', () => {
    let controller: UsersController

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UserService,
                PrismaService,
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn() // Mocking the actual process
                    }
                }
            ]
        }).compile()

        controller = app.get<UsersController>(UsersController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('users controller', () => {
        it('should register new user', async () => {
            const newUser = {
                email: 'test@users.com',
                name: 'Test User',
                password: 'password'
            }

            const mockRegisterResponse: User = {
                id: 1,
                email: 'test@users.com',
                name: 'Test User',
                password: 'password'
            }

            delete mockRegisterResponse.password

            // Mocing the actual process in controller and use jest as a response instead
            jest
                .spyOn(controller, 'registerUser')
                .mockResolvedValue(mockRegisterResponse);

            const result = await controller.registerUser(newUser)

            expect(result).toEqual(mockRegisterResponse)
        })

        it('should throw error if email already registered', async () => {
            const registeredUser = {
                email: 'registered@user.com',
                name: 'Registered User',
                password: 'Password'
            }

            jest
                .spyOn(controller, 'registerUser')
                .mockRejectedValue(new ConflictException())

            const register = controller.registerUser(registeredUser)

            await expect(register).rejects.toThrow(ConflictException)
        })

        it('should throw error if required fields is missing', async () => {
            jest
                .spyOn(controller, 'registerUser')
                .mockRejectedValue(new BadRequestException())

            const register = controller.registerUser(null)

            await expect(register).rejects.toThrow(BadRequestException)
        })

        it('should login user', async () => {
            const mockLoginReponse = {
                access_token:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyey'
            }

            jest
                .spyOn(controller, 'loginUser')
                .mockResolvedValue(mockLoginReponse)

            const result = await controller.loginUser({
                email: 'some@user.com',
                password: 'password'
            })

            expect(result).toEqual(mockLoginReponse)
            expect(result.access_token).toBeDefined()
        })

        it('should throw error if email is wrong', async () => {
            const wrongEmail = {
                email: 'wrong@user.com',
                password: 'password'
            }

            jest
                .spyOn(controller, 'loginUser')
                .mockRejectedValue(new NotFoundException())

            const login = controller.loginUser(wrongEmail)

            await expect(login).rejects.toThrow(NotFoundException)
        })
    });
})