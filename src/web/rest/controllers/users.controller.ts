import {
    ApiBadRequestResponse,
    ApiBearerAuth,
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
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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
import { TokenException } from '../../../components/AuthenticationManager/main/core/domain/exception/TokenException';
import { ValidationException } from '../../../components/UsersManager/main/core/domain/exceptions/ValidationException';

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
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'user found' })
    @ApiNotFoundResponse({ description: 'user not found' })
    @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getAuthenticatedRegularUser(@Headers('Authorization') accessToken: string) {
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
                associationDocs: docs.map(doc => ({
                    buffer: doc.buffer,
                    filename: doc.originalname,
                })),
            });
        } catch (e) {
            UsersController.handleError(e, language);
        }
    }

    @Get('/associations/me')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'association found' })
    @ApiNotFoundResponse({ description: 'association not found' })
    @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getAuthenticatedAssociation(@Headers('Authorization') accessToken: string) {
        try {
            return await this.usersService.getAuthenticatedAssociation(accessToken);
        } catch (e: unknown) {
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
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
    @ApiOkResponse({ description: 'association info edited' })
    @ApiNotFoundResponse({ description: 'association not found' })
    @ApiBadRequestResponse({ description: 'error in the body form data' })
    @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
    @ApiInternalServerErrorResponse({ description: 'internal server error' })
    @UseInterceptors(FileInterceptor('profilePicture'))
    async editAssociationInfo(
        @Body() body: EditAssociationInfoDto,
        @UploadedFile() profilePicture: Express.Multer.File,
        @Headers('Authorization') accessToken: string,
        @Headers('Accept-Language') language: SupportedLanguages,
    ) {
        try {
            return await this.usersService.editAssociationInfo(accessToken, {
                ...body,
                wilayaNumber: Number(body.wilayaNumber),
                profilePicture: profilePicture
                    ? { buffer: profilePicture.buffer, filename: profilePicture.originalname }
                    : body.profilePicture || null,
            });
        } catch (e) {
            UsersController.handleError(e, language);
        }
    }

    @Put('associations/credentials')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'association credentials edited' })
    @ApiNotFoundResponse({ description: 'association not found' })
    @ApiBadRequestResponse({ description: 'error in the body form data' })
    @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
    @ApiInternalServerErrorResponse({ description: 'internal server error' })
    async editAssociationCredentials(
        @Body() body: EditCredentialsDto,
        @Headers('Authorization') accessToken: string,
        @Headers('Accept-Language') language: SupportedLanguages,
    ) {
        try {
            return await this.usersService.editAssociationCredentials(accessToken, body);
        } catch (e) {
            UsersController.handleError(e, language);
        }
    }

    @Put('regular-user/info')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
    @ApiOkResponse({ description: 'regular user info edited' })
    @ApiNotFoundResponse({ description: 'regular user not found' })
    @ApiBadRequestResponse({ description: 'error in the body form data' })
    @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
    @ApiInternalServerErrorResponse({ description: 'internal server error' })
    @UseInterceptors(FileInterceptor('profilePicture'))
    async editRegularUserInfo(
        @Body() body: EditRegularUserInfoDto,
        @UploadedFile() profilePicture: Express.Multer.File,
        @Headers('Authorization') accessToken: string,
        @Headers('Accept-Language') language: SupportedLanguages,
    ) {
        try {
            return await this.usersService.editRegularUserInfo(accessToken, {
                ...body,
                wilayaNumber: Number(body.wilayaNumber),
                profilePicture: profilePicture
                    ? { buffer: profilePicture.buffer, filename: profilePicture.originalname }
                    : body.profilePicture || null,
            });
        } catch (e) {
            UsersController.handleError(e, language);
        }
    }

    @Put('regular-user/credentials')
    @ApiBearerAuth()
    @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'regular user credentials edited' })
    @ApiNotFoundResponse({ description: 'regular user not found' })
    @ApiBadRequestResponse({ description: 'error in the body form data' })
    @ApiUnauthorizedResponse({ description: 'the access token is not valid' })
    @ApiInternalServerErrorResponse({ description: 'internal server error' })
    async editRegularUserCredentials(
        @Body() body: EditCredentialsDto,
        @Headers('Authorization') accessToken: string,
        @Headers('Accept-Language') language: SupportedLanguages,
    ) {
        try {
            return await this.usersService.editRegularUserCredentials(accessToken, body);
        } catch (e) {
            UsersController.handleError(e, language);
        }
    }

    private static handleError(e: unknown, lang?: SupportedLanguages): never {
        if (e instanceof TokenException)
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
