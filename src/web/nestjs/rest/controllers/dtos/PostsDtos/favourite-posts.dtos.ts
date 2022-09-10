import { ApiProperty } from '@nestjs/swagger';

import { PostType } from '../../../../../../components/PostsManager/main/core/domain/PostType';

class CreateFavouritePostDto {
    @ApiProperty()
    readonly postId!: string;

    @ApiProperty({ enum: PostType.POST_TYPES })
    readonly postType!: string;
}

export { CreateFavouritePostDto };
