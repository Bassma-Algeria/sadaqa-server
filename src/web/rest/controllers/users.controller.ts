import { Body, Controller, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  MultiLanguagesException,
  SupportedLanguages,
} from '../../../components/UsersManager/main/core/domain/exceptions/MultiLanguagesException';

import { LoginUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/LoginUseCase/LoginUseCaseRequest';
import { RegisterUserUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/RegisterUserUseCase/RegisterUserUseCaseRequest';

import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('/api/users')
class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(
    @Body() body: LoginUseCaseRequest,
    @Headers('Accept-Language') language: SupportedLanguages,
  ) {
    try {
      return await this.usersService.login(body);
    } catch (e) {
      this.handleError(e, language);
    }
  }

  @Post('register')
  async register(
    @Body() signupBody: RegisterUserUseCaseRequest,
    @Headers('Accept-Language') language: SupportedLanguages,
  ) {
    try {
      return await this.usersService.register(signupBody);
    } catch (e) {
      this.handleError(e, language);
    }
  }

  private handleError(e: unknown, lang: SupportedLanguages): never {
    if (e instanceof MultiLanguagesException) {
      throw new HttpException({ error: e.errorMessage[lang] }, HttpStatus.BAD_REQUEST);
    } else if (e instanceof Error) {
      throw new HttpException({ error: e.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export { UsersController };
