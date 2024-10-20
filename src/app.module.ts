import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core.module';
import { UsersController } from './controllers/users.controller';
import { UsersModule } from './modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'super_secret_key',
      signOptions: { expiresIn: '12h' }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
