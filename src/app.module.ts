import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core.module';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [CoreModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
