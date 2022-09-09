import {
    ApiBearerAuth,
    ApiHeader,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Controller, Get, Headers, Param } from '@nestjs/common';

import { handlePostsException } from './base/handlePostsException';

import { PostsService } from '../../services/PostsServices/posts.service';

@ApiTags('posts')
@Controller('/api/posts')
class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('/publisher/:publisherId')
    @ApiOperation({ description: 'get all posts published by given user' })
    @ApiParam({ name: 'publisherId', description: 'the id of the target publisher' })
    @ApiOkResponse({ description: 'posts found' })
    @ApiNotFoundResponse({ description: 'publisher not exist' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getByPublisherId(@Param('publisherId') publisherId: string) {
        try {
            return await this.postsService.getPostsByPublisher(publisherId);
        } catch (e) {
            handlePostsException(e);
        }
    }

    @Get('/me/summary')
    @ApiBearerAuth()
    @ApiOperation({ description: 'get posts summary of the auth user' })
    @ApiHeader({ name: 'Authorization', description: 'the access token' })
    @ApiOkResponse({ description: 'posts summary found' })
    @ApiNotFoundResponse({ description: 'publisher not exist' })
    @ApiUnauthorizedResponse({ description: 'the access token provided not valid' })
    @ApiInternalServerErrorResponse({ description: 'server error' })
    async getBySummaryOfAuthUser(@Headers('Authorization') accessToken: string) {
        try {
            return await this.postsService.getPostsSummaryOfAuthUser(accessToken);
        } catch (e) {
            handlePostsException(e);
        }
    }
}

export { PostsController };
