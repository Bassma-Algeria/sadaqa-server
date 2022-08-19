import {
    ApiBadRequestResponse,
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
// eslint-disable-next-line node/no-extraneous-import
import { Express } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { handlePostsException } from './base/handlePostsException';

import { SupportedLanguages } from '../../../../components/PostsManager/main/core/domain/exceptions/MultiLanguagesValidationException';

import {
    CreateCallForHelpDto,
    UpdateCallForHelpDto,
} from '../dtos/PostsDtos/call-for-help-posts.dtos';
import { CallForHelpPostsService } from '../../services/PostsServices/call-for-help-posts.service';

@ApiTags('posts')
@Controller('/api/posts/call-for-help')
class CallForHelpPostsController {
    constructor(private readonly postsService: CallForHelpPostsService) {}

    @Get('/')
    @ApiOperation({ description: 'get call for help posts list' })
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
            handlePostsException(e);
        }
    }

    @Get('/search')
    @ApiOperation({ description: 'search for call for help posts' })
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
            handlePostsException(e);
        }
    }

    @Get('/:postId')
    @ApiOperation({ description: 'get call for help post by id' })
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
    @ApiOperation({ description: 'create call for help post' })
    @ApiConsumes('multipart/form-data')
    @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiCreatedResponse({ description: 'post created successfully' })
    @ApiBadRequestResponse({ description: 'error in the form body data' })
    @ApiForbiddenResponse({ description: 'a regular user try to add a call for help' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    @UseInterceptors(FilesInterceptor('pictures'))
    async create(
        @Body() body: CreateCallForHelpDto,
        @UploadedFiles() pictures: Array<Express.Multer.File>,
        @Headers('Authorization') accessToken: string,
        @Headers('Accept-Language') language: SupportedLanguages,
    ) {
        try {
            return await this.postsService.create(accessToken, {
                ...body,
                wilayaNumber: Number(body.wilayaNumber),
                pictures: pictures.map(pic => pic.buffer),
            });
        } catch (e) {
            handlePostsException(e, language);
        }
    }

    @Put('/:postId')
    @ApiOperation({ description: 'update call for help post' })
    @ApiConsumes('multipart/form-data')
    @ApiHeader({ name: 'Accept-Language', enum: ['ar', 'en'] })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiCreatedResponse({ description: 'post updated successfully' })
    @ApiBadRequestResponse({ description: 'error in the form body data' })
    @ApiForbiddenResponse({ description: 'not the owner of the post' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    @UseInterceptors(FilesInterceptor('newPictures'))
    async update(
        @Body() body: UpdateCallForHelpDto,
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
                    new: newPics.map(pic => pic.buffer),
                },
            });
        } catch (e) {
            handlePostsException(e, language);
        }
    }

    @Put('/:postId/toggle-enabling')
    @ApiOperation({
        description: 'toggle call for help post enabling status between DISABLED & ENABLED',
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

    @Delete('/:postId')
    @ApiOperation({ description: 'delete call for help post' })
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

export { CallForHelpPostsController };
