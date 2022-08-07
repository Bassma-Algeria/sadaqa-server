import { DonationRequestPostsService } from '../../services/PostsServices/donation-request-posts.service';
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
import {
    ApiBadRequestResponse,
    ApiConsumes,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiQuery,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
// eslint-disable-next-line node/no-extraneous-import
import { Express } from 'express';

import {
    CreateDonationRequestDto,
    UpdateDonationRequestDto,
} from '../dtos/PostsDtos/donation-request-posts.dtos';
import { PostsController } from './base/posts.controller';

import { SupportedLanguages } from '../../../../components/PostsManager/main/core/domain/exceptions/MultiLanguagesValidationException';

@ApiTags('posts')
@Controller('/api/posts')
class DonationRequestPostsController {
    constructor(private readonly postsService: DonationRequestPostsService) {}

    @Post('donation-request')
    @ApiConsumes('multipart/form-data')
    @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiCreatedResponse({ description: 'post created successfully' })
    @ApiBadRequestResponse({ description: 'error in the form body data' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    @UseInterceptors(FilesInterceptor('pictures'))
    async create(
        @Body() body: CreateDonationRequestDto,
        @UploadedFiles() pictures: Array<Express.Multer.File>,
        @Headers('Authorisation') accessToken: string,
        @Headers('Accept-Language') language: SupportedLanguages,
    ) {
        try {
            return await this.postsService.create(accessToken, {
                ...body,
                wilayaNumber: Number(body.wilayaNumber),
                pictures: pictures.map(pic => pic.buffer),
            });
        } catch (e) {
            PostsController.handleException(e, language);
        }
    }

    @Put('donation-request/:postId')
    @ApiConsumes('multipart/form-data')
    @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiCreatedResponse({ description: 'post updated successfully' })
    @ApiBadRequestResponse({ description: 'error in the form body data' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiForbiddenResponse({ description: 'not the owner of the post' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    @UseInterceptors(FilesInterceptor('newPictures'))
    async update(
        @Body() body: UpdateDonationRequestDto,
        @Param('postId') postId: string,
        @UploadedFiles() newPics: Array<Express.Multer.File>,
        @Headers('Authorisation') accessToken: string,
        @Headers('Accept-Language') language: SupportedLanguages,
    ) {
        try {
            return await this.postsService.update(accessToken, {
                ...body,
                postId,
                wilayaNumber: Number(body.wilayaNumber),
                pictures: {
                    old: body.oldPictures,
                    new: newPics.map(pic => pic.buffer),
                },
            });
        } catch (e) {
            PostsController.handleException(e, language);
        }
    }

    @Put('donation-request/:postId/toggle-enabling')
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiCreatedResponse({ description: 'post status updated successfully' })
    @ApiForbiddenResponse({ description: 'the user is not the owner of the post' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async toggleEnabling(
        @Param('postId') postId: string,
        @Headers('Authorisation') accessToken: string,
    ) {
        try {
            return await this.postsService.toggleEnablingStatus(accessToken, { postId });
        } catch (e) {
            PostsController.handleException(e);
        }
    }

    @Delete('donation-request/:postId')
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiOkResponse({ description: 'post deleted successfully' })
    @ApiForbiddenResponse({ description: 'the user is not the owner of the post' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async delete(@Param('postId') postId: string, @Headers('Authorisation') accessToken: string) {
        try {
            return await this.postsService.delete(accessToken, { postId });
        } catch (e) {
            PostsController.handleException(e);
        }
    }

    @Get('donation-request/search')
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
            PostsController.handleException(e);
        }
    }

    @Get('donation-request/:postId')
    @ApiOkResponse({ description: 'post found' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getById(@Param('postId') postId: string) {
        try {
            return await this.postsService.getById({ postId });
        } catch (e) {
            PostsController.handleException(e);
        }
    }

    @Get('donation-request')
    @ApiQuery({ name: 'page', description: 'number of page, default: 1', required: false })
    @ApiQuery({ name: 'wilayaNumber', description: 'posts wilaya, default: all', required: false })
    @ApiOkResponse({ description: 'posts found' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getList(@Query('page') page: number, @Query('wilayaNumber') wilayaNumber: number) {
        try {
            return await this.postsService.getList({
                page: Number(page),
                wilayaNumber: Number(wilayaNumber),
            });
        } catch (e) {
            PostsController.handleException(e);
        }
    }
}

export { DonationRequestPostsController };