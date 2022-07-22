import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

import {
  MultiLanguagesException,
  SupportedLanguages,
} from '../../../components/UsersManager/main/core/domain/exceptions/MultiLanguagesException';
import { UserNotFoundException } from '../../../components/UsersManager/main/core/domain/exceptions/UserNotFoundException';

import { LoginDto, RegisterAssociationDto, RegisterUserDto } from './dtos/users.dtos';

import { UsersService } from '../services/users.service';
import { InvalidAccessTokenException } from '../../../components/AuthenticationManager/main/core/domain/exception/InvalidAccessTokenException';

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

  @Post('regular-user/register')
  @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
  @ApiCreatedResponse({ description: 'Registration Successful' })
  @ApiBadRequestResponse({ description: 'Invalid Inputs' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async register(
    @Body() signupBody: RegisterUserDto,
    @Headers('Accept-Language') language: SupportedLanguages,
  ) {
    try {
      return await this.usersService.registerRegularUser(signupBody);
    } catch (e) {
      this.handleError(e, language);
    }
  }

  @Get('regular-user/me')
  @ApiHeader({ name: 'Authorisation', description: 'the access token' })
  @ApiOkResponse({ description: 'user found' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
  @ApiInternalServerErrorResponse({ description: 'server error' })
  async getAuthenticatedRegularUser(@Headers('Authorisation') accessToken: string) {
    try {
      return await this.usersService.getAuthenticatedRegularUser(accessToken);
    } catch (e) {
      if (e instanceof InvalidAccessTokenException)
        throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);
      if (e instanceof UserNotFoundException)
        throw new HttpException({ error: 'not found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('regular-user/:regularUserId')
  @ApiOkResponse({ description: 'user found' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiInternalServerErrorResponse({ description: 'internal server error' })
  async getRegularUserById(@Param('regularUserId') id: string) {
    try {
      return await this.usersService.getRegularUserById({ regularUserId: id });
    } catch (e) {
      if (e instanceof UserNotFoundException)
        throw new HttpException({ error: 'no user found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('associations/register')
  @ApiConsumes('multipart/form-data')
  @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
  @ApiCreatedResponse({ description: 'association registered successfully' })
  @ApiBadRequestResponse({ description: 'error in the body form data' })
  @ApiInternalServerErrorResponse({ description: 'internal server error' })
  @UseInterceptors(FilesInterceptor('associationDocs'))
  async registerAssociation(
    @Headers('Accept-Language') language: SupportedLanguages,
    @UploadedFiles() docs: Array<Express.Multer.File>,
    @Body() body: RegisterAssociationDto,
  ) {
    try {
      return await this.usersService.registerAssociation({
        ...body,
        wilayaNumber: Number(body.wilayaNumber),
        associationDocs: docs.map(doc => doc.buffer),
      });
    } catch (e) {
      this.handleError(e, language);
    }
  }

  @Get('/associations/me')
  @ApiHeader({ name: 'Authorisation', description: 'the access token' })
  @ApiOkResponse({ description: 'association found' })
  @ApiNotFoundResponse({ description: 'association not found' })
  @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
  @ApiInternalServerErrorResponse({ description: 'server error' })
  async getAuthenticatedAssociation(@Headers('Authorisation') accessToken: string) {
    try {
      return await this.usersService.getAuthenticatedAssociation(accessToken);
    } catch (e) {
      if (e instanceof InvalidAccessTokenException)
        throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);
      if (e instanceof UserNotFoundException)
        throw new HttpException({ error: 'not found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('associations/:associationId')
  @ApiOkResponse({ description: 'association found' })
  @ApiNotFoundResponse({ description: 'association not found' })
  @ApiInternalServerErrorResponse({ description: 'internal server error' })
  async getAssociationById(@Param('associationId') id: string) {
    try {
      return await this.usersService.getAssociationById({ associationId: id });
    } catch (e) {
      if (e instanceof UserNotFoundException)
        throw new HttpException({ error: 'no association found' }, HttpStatus.NOT_FOUND);

      throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private handleError(e: unknown, lang: SupportedLanguages): never {
    if (e instanceof MultiLanguagesException)
      throw new HttpException({ error: e.errorMessage[lang] }, HttpStatus.BAD_REQUEST);

    throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export { UsersController };
