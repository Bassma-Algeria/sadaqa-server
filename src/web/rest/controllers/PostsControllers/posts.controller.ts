import {
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';

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
}

export { PostsController };
