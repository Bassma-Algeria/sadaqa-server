import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';

import { handlePostsException } from './base/handlePostsException';

import { CreateFavouritePostDto } from '../dtos/PostsDtos/favourite-posts.dtos';

import { PostType } from '../../../../components/PostsManager/main/core/domain/PostType';

import { FavouritePostsService } from '../../services/PostsServices/favourite-posts.service';

@ApiTags('posts')
@Controller('/api/posts/favourite')
class FavouritePostsController {
    constructor(private readonly favouritePostsService: FavouritePostsService) {}

    @Get('/')
    @ApiOperation({ description: 'get all favourite posts of auth user' })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'post added to favourite successfully' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getAll(@Headers('Authorization') accessToken: string) {
        try {
            return await this.favouritePostsService.getAll(accessToken);
        } catch (e) {
            handlePostsException(e);
        }
    }

    @Post('/')
    @ApiOperation({ description: 'add a post to favourites' })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiCreatedResponse({ description: 'post added to favourite successfully' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiBadRequestResponse({ description: 'error in the post type' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async add(@Body() body: CreateFavouritePostDto, @Headers('Authorization') accessToken: string) {
        try {
            return await this.favouritePostsService.add(accessToken, body);
        } catch (e) {
            handlePostsException(e);
        }
    }

    @Delete('/:postType/:postId')
    @ApiOperation({ description: 'delete a post from favourites' })
    @ApiParam({ name: 'postId', description: 'the post id' })
    @ApiParam({ name: 'postType', description: 'the post type', enum: PostType.POST_TYPES })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'post deleted from favourite successfully' })
    @ApiNotFoundResponse({ description: 'target post not found' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async delete(
        @Param('postId') postId: string,
        @Param('postType') postType: string,
        @Headers('Authorization') accessToken: string,
    ) {
        try {
            return await this.favouritePostsService.delete(accessToken, { postId, postType });
        } catch (e) {
            handlePostsException(e);
        }
    }

    @Get('/isFavourite/:postType/:postId')
    @ApiOperation({ description: 'check if a post in favourites' })
    @ApiParam({ name: 'postId', description: 'the post id' })
    @ApiParam({ name: 'postType', description: 'the post type', enum: PostType.POST_TYPES })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'post deleted from favourite successfully' })
    @ApiBadRequestResponse({ description: 'error in the post type' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async isFavourite(
        @Param('postId') postId: string,
        @Param('postType') postType: string,
        @Headers('Authorization') accessToken: string,
    ) {
        try {
            return await this.favouritePostsService.isFavourite(accessToken, { postId, postType });
        } catch (e) {
            handlePostsException(e);
        }
    }
}

export { FavouritePostsController };
