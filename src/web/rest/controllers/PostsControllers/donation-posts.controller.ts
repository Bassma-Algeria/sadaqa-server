import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    Param,
    Post,
    Put,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';

import { FilesInterceptor } from '@nestjs/platform-express';
// eslint-disable-next-line node/no-extraneous-import
import { Express } from 'express';
import { handlePostsException } from './base/handlePostsException';

import { CreateDonationDto, UpdateDonationDto } from '../dtos/PostsDtos/donation-posts.dtos';

import { SupportedLanguages } from '../../../../components/PostsManager/main/core/domain/exceptions/MultiLanguagesValidationException';

import { DonationPostsService } from '../../services/PostsServices/donation-posts.service';
import { DonationCategory } from '../../../../components/PostsManager/main/core/domain/DonationCategory';

@ApiTags('posts')
@Controller('/api/posts/donation')
class DonationPostsController {
    constructor(private readonly postsService: DonationPostsService) {}

    @Get('/')
    @ApiOperation({ description: 'get donation posts list' })
    @ApiQuery({
        required: false,
        name: 'category',
        description: 'donation category, default: all',
        enum: DonationCategory.SUPPORTED_CATEGORIES,
    })
    @ApiQuery({ name: 'page', description: 'number of page, default: 1', required: false })
    @ApiQuery({ name: 'wilayaNumber', description: 'posts wilaya, default: all', required: false })
    @ApiOkResponse({ description: 'posts found' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getList(
        @Query('page') page: number,
        @Query('category') category: string,
        @Query('wilayaNumber') wilayaNumber: number,
    ) {
        try {
            return await this.postsService.getList({
                category,
                page: Number(page),
                wilayaNumber: Number(wilayaNumber),
            });
        } catch (e) {
            handlePostsException(e);
        }
    }

    @Get('/search')
    @ApiOperation({ description: 'search for donation posts' })
    @ApiQuery({ name: 'q', description: 'search keyword', required: true })
    @ApiQuery({ name: 'page', description: 'number of page, default: 1', required: false })
    @ApiQuery({ name: 'wilayaNumber', description: 'posts wilaya, default: all', required: false })
    @ApiOkResponse({ description: 'posts found' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async search(
        @Query('q') keyword: string,
        @Query('page') page: number,
        @Query('wilayaNumber') wilayaNumber: number,
    ) {
        try {
            return await this.postsService.search({
                keyword,
                page: Number(page),
                wilayaNumber: Number(wilayaNumber),
            });
        } catch (e) {
            console.log(e);
            handlePostsException(e);
        }
    }

    @Get('/:postId')
    @ApiOperation({ description: 'get donation post by id' })
    @ApiOkResponse({ description: 'post found' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getById(@Param('postId') postId: string) {
        try {
            return await this.postsService.getById({ postId });
        } catch (e) {
            handlePostsException(e);
        }
    }

    @Post('/')
    @ApiBearerAuth()
    @ApiOperation({ description: 'create donation post' })
    @ApiConsumes('multipart/form-data')
    @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiCreatedResponse({ description: 'post created successfully' })
    @ApiBadRequestResponse({ description: 'error in the form body data' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    @UseInterceptors(FilesInterceptor('pictures'))
    async create(
        @Body() body: CreateDonationDto,
        @UploadedFiles() pictures: Array<Express.Multer.File>,
        @Headers('Authorization') accessToken: string,
        @Headers('Accept-Language') language: SupportedLanguages,
    ) {
        try {
            return await this.postsService.create(accessToken, {
                ...body,
                wilayaNumber: Number(body.wilayaNumber),
                pictures: pictures.map(pic => ({ buffer: pic.buffer, filename: pic.originalname })),
            });
        } catch (e) {
            handlePostsException(e, language);
        }
    }

    @Put('/:postId')
    @ApiBearerAuth()
    @ApiOperation({ description: 'update donation post' })
    @ApiConsumes('multipart/form-data')
    @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiCreatedResponse({ description: 'post updated successfully' })
    @ApiBadRequestResponse({ description: 'error in the form body data' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiForbiddenResponse({ description: 'not the owner of the post' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    @UseInterceptors(FilesInterceptor('newPictures'))
    async update(
        @Body() body: UpdateDonationDto,
        @Param('postId') postId: string,
        @UploadedFiles() newPics: Array<Express.Multer.File>,
        @Headers('Authorization') accessToken: string,
        @Headers('Accept-Language') language: SupportedLanguages,
    ) {
        try {
            return await this.postsService.update(accessToken, {
                ...body,
                postId,
                wilayaNumber: Number(body.wilayaNumber),
                pictures: {
                    old: body.oldPictures,
                    new: newPics.map(pic => ({ buffer: pic.buffer, filename: pic.originalname })),
                },
            });
        } catch (e) {
            handlePostsException(e, language);
        }
    }

    @Put('/:postId/toggle-enabling')
    @ApiBearerAuth()
    @ApiOperation({
        description: 'toggle donation post enabling status between ENABLED & DISABLED',
    })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiCreatedResponse({ description: 'post status updated successfully' })
    @ApiForbiddenResponse({ description: 'the user is not the owner of the post' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async toggleEnabling(
        @Param('postId') postId: string,
        @Headers('Authorization') accessToken: string,
    ) {
        try {
            return await this.postsService.toggleEnablingStatus(accessToken, { postId });
        } catch (e) {
            handlePostsException(e);
        }
    }

    @Post('/:postId/share')
    @ApiBearerAuth()
    @ApiOperation({ description: 'add a share to the post' })
    @ApiHeader({ name: 'Authorization', description: 'the access token', required: false })
    @ApiCreatedResponse({ description: 'post shared successfully' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async share(@Param('postId') postId: string, @Headers('Authorization') accessToken?: string) {
        try {
            return await this.postsService.share(accessToken, { postId });
        } catch (e) {
            handlePostsException(e);
        }
    }

    @Delete('/:postId')
    @ApiBearerAuth()
    @ApiOperation({ description: 'delete donation post' })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'post deleted successfully' })
    @ApiForbiddenResponse({ description: 'the user is not the owner of the post' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async delete(@Param('postId') postId: string, @Headers('Authorization') accessToken: string) {
        try {
            return await this.postsService.delete(accessToken, { postId });
        } catch (e) {
            handlePostsException(e);
        }
    }
}

export { DonationPostsController };
