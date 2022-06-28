import { Module } from '@nestjs/common';
import { UsersManagerConfiguration } from '../../components/UsersManager/main/UsersManagerConfiguration';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
