import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./cors/services/prisma.service"; 

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService]
})
export class CoreModule {}