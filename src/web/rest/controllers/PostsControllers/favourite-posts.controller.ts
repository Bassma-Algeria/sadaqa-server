import {
    ApiCreatedResponse,
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';

import { FavouritePostDto } from '../dtos/posts.dtos';
import { PostsController } from './base/posts.controller';

import { PostType } from '../../../../components/PostsManager/main/core/domain/PostType';

import { FavouritePostsService } from '../../services/PostsServices/favourite-posts.service';

@ApiTags('posts')
@Controller('/api/posts')
class FavouritePostsController {
    constructor(private readonly favouritePostsService: FavouritePostsService) {}

    @Post('favourite')
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiCreatedResponse({ description: 'post added to favourite successfully' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async add(@Body() body: FavouritePostDto, @Headers('Authorisation') accessToken: string) {
        try {
            return await this.favouritePostsService.add(accessToken, body);
        } catch (e) {
            PostsController.handleException(e);
        }
    }

    @Delete('favourite/:postType/:postId')
    @ApiParam({ name: 'postId', description: 'the post id' })
    @ApiParam({ name: 'postType', description: 'the post type', enum: PostType.POST_TYPES })
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiOkResponse({ description: 'post deleted from favourite successfully' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async delete(
        @Param('postId') postId: string,
        @Param('postType') postType: string,
        @Headers('Authorisation') accessToken: string,
    ) {
        try {
            return await this.favouritePostsService.delete(accessToken, { postId, postType });
        } catch (e) {
            PostsController.handleException(e);
        }
    }

    @Get('favourite')
    @ApiHeader({ name: 'Authorisation', description: 'the access token' })
    @ApiOkResponse({ description: 'post added to favourite successfully' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getAll(@Headers('Authorisation') accessToken: string) {
        try {
            return await this.favouritePostsService.getAll(accessToken);
        } catch (e) {
            PostsController.handleException(e);
        }
    }
}

export { FavouritePostsController };