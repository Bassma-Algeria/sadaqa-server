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
    Put,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';

import {
    EditAssociationInfoDto,
    EditCredentialsDto,
    EditRegularUserInfoDto,
    LoginDto,
    RegisterAssociationDto,
    RegisterUserDto,
} from './dtos/users.dtos';

import { UsersService } from '../services/users.service';

import {
    MultiLanguagesValidationException,
    SupportedLanguages,
} from '../../../components/UsersManager/main/core/domain/exceptions/MultiLanguagesValidationException';
import { NotFoundException } from '../../../components/UsersManager/main/core/domain/exceptions/NotFoundException';
import { ValidationException } from '../../../components/UsersManager/main/core/domain/exceptions/ValidationException';
import { InvalidTokenException } from '../../../components/AuthenticationManager/main/core/domain/exception/InvalidTokenException';
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
            UsersController.handleError(e, language);
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
            UsersController.handleError(e, language);
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
            UsersController.handleError(e);
        }
    }

    @Get('regular-user/:accountId')
    @ApiOkResponse({ description: 'user found' })
    @ApiNotFoundResponse({ description: 'user not found' })
    @ApiInternalServerErrorResponse({ description: 'internal server error' })
    async getRegularUserById(@Param('accountId') accountId: string) {
        try {
            return await this.usersService.getRegularUserById({ accountId });
        } catch (e) {
            UsersController.handleError(e);
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
            UsersController.handleError(e, language);
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
            UsersController.handleError(e);
        }
    }

    @Get('associations/:accountId')
    @ApiOkResponse({ description: 'association found' })
    @ApiNotFoundResponse({ description: 'association not found' })
    @ApiInternalServerErrorResponse({ description: 'internal server error' })
    async getAssociationById(@Param('accountId') accountId: string) {
        try {
            return await this.usersService.getAssociationById({ accountId });
        } catch (e) {
            UsersController.handleError(e);
        }
    }

    @Put('associations/info')
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiOkResponse({ description: 'association info edited' })
    @ApiNotFoundResponse({ description: 'association not found' })
    @ApiBadRequestResponse({ description: 'error in the body form data' })
    @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
    @ApiInternalServerErrorResponse({ description: 'internal server error' })
    async editAssociationInfo(
        @Body() body: EditAssociationInfoDto,
        @Headers('Authorisation') accessToken: string,
    ) {
        try {
            return await this.usersService.editAssociationInfo(accessToken, body);
        } catch (e) {
            UsersController.handleError(e);
        }
    }

    @Put('associations/credentials')
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiOkResponse({ description: 'association credentials edited' })
    @ApiNotFoundResponse({ description: 'association not found' })
    @ApiBadRequestResponse({ description: 'error in the body form data' })
    @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
    @ApiInternalServerErrorResponse({ description: 'internal server error' })
    async editAssociationCredentials(
        @Body() body: EditCredentialsDto,
        @Headers('Authorisation') accessToken: string,
    ) {
        try {
            return await this.usersService.editAssociationCredentials(accessToken, body);
        } catch (e) {
            UsersController.handleError(e);
        }
    }

    @Put('regular-user/info')
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiOkResponse({ description: 'regular user info edited' })
    @ApiNotFoundResponse({ description: 'regular user not found' })
    @ApiBadRequestResponse({ description: 'error in the body form data' })
    @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
    @ApiInternalServerErrorResponse({ description: 'internal server error' })
    async editRegularUserInfo(
        @Body() body: EditRegularUserInfoDto,
        @Headers('Authorisation') accessToken: string,
    ) {
        try {
            return await this.usersService.editRegularUserInfo(accessToken, body);
        } catch (e) {
            UsersController.handleError(e);
        }
    }

    @Put('regular-user/credentials')
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiOkResponse({ description: 'regular user credentials edited' })
    @ApiNotFoundResponse({ description: 'regular user not found' })
    @ApiBadRequestResponse({ description: 'error in the body form data' })
    @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
    @ApiInternalServerErrorResponse({ description: 'internal server error' })
    async editRegularUserCredentials(
        @Body() body: EditCredentialsDto,
        @Headers('Authorisation') accessToken: string,
    ) {
        try {
            return await this.usersService.editRegularUserCredentials(accessToken, body);
        } catch (e) {
            UsersController.handleError(e);
        }
    }

    private static handleError(e: unknown, lang?: SupportedLanguages): never {
        if (e instanceof InvalidAccessTokenException || e instanceof InvalidTokenException)
            throw new HttpException({ error: 'Not Authorized' }, HttpStatus.UNAUTHORIZED);
        if (e instanceof MultiLanguagesValidationException)
            throw new HttpException({ error: e.error[lang!] }, HttpStatus.BAD_REQUEST);
        if (e instanceof ValidationException)
            throw new HttpException({ error: e.message }, HttpStatus.BAD_REQUEST);
        if (e instanceof NotFoundException)
            throw new HttpException({ error: e.message }, HttpStatus.NOT_FOUND);

        throw new HttpException({ error: 'Server Error' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export { UsersController };
