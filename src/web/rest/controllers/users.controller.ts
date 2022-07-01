import { Body, Controller, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';

import {
  MultiLanguagesException,
  SupportedLangugaes,
} from '../../../components/UsersManager/main/core/domain/exceptions/MultiLanguagesException';
import { LoginUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/LoginUseCase/LoginUseCaseRequest';
import { RegisterUserUseCaseRequest } from '../../../components/UsersManager/main/core/usecases/RegisterUserUseCase/RegisterUserUseCaseRequest';

import { UsersService } from '../services/users.service';

@Controller('/api/users')
class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(
    @Body() body: LoginUseCaseRequest,
    @Headers('Accept-Language') language: SupportedLangugaes,
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
    @Headers('Accept-Language') language: SupportedLangugaes,
  ) {
    try {
      return await this.usersService.register(signupBody);
    } catch (e) {
      this.handleError(e, language);
    }
  }

  private handleError(e: unknown, lang: SupportedLangugaes): never {
    if (e instanceof MultiLanguagesException) {
      throw new HttpException(e.errorMessage[lang], HttpStatus.BAD_REQUEST);
    } else if (e instanceof Error) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export { UsersController };
