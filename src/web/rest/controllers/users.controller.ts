import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Body, Controller, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';

import {
  MultiLanguagesException,
  SupportedLanguages,
} from '../../../components/UsersManager/main/core/domain/exceptions/MultiLanguagesException';

import { UsersService } from '../services/users.service';
import { LoginDto, RegisterUserDto } from './dtos/users.dtos';

@ApiTags('users')
@Controller('/api/users')
class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
  @ApiCreatedResponse({ description: 'Login Successful' })
  @ApiBadRequestResponse({ description: 'Wrong Credentials' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async login(@Body() body: LoginDto, @Headers('Accept-Language') language: SupportedLanguages) {
    try {
      return await this.usersService.login(body);
    } catch (e) {
      this.handleError(e, language);
    }
  }

  @Post('register')
  @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
  @ApiCreatedResponse({ description: 'Registration Successful' })
  @ApiBadRequestResponse({ description: 'Invalid Inputs' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async register(
    @Body() signupBody: RegisterUserDto,
    @Headers('Accept-Language') language: SupportedLanguages,
  ) {
    try {
      return await this.usersService.register(signupBody);
    } catch (e) {
      this.handleError(e, language);
    }
  }

  private handleError(e: unknown, lang: SupportedLanguages): never {
    if (e instanceof MultiLanguagesException)
      throw new HttpException({ error: e.errorMessage[lang] }, HttpStatus.BAD_REQUEST);

    throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export { UsersController };
