import { Body, Controller, Get, Post } from '@nestjs/common';

import { UsersManagerFacade } from '../../../components/UsersManager/main/UsersManagerFacade';

@Controller('api/users')
class UsersController {
  constructor(private readonly usersManager: UsersManagerFacade) {}
}

export { UsersController };
