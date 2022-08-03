import { PostDto } from './PostDto';
import { Post } from '../../../../domain/Post';

abstract class PostDtoMapper<P extends Post> {
    toDto(post: P): PostDto {
        return {
            postId: post.postId.value(),
            title: post.title.value(),
            description: post.description.value(),
            publisherId: post.publisherId.value(),
            wilayaNumber: post.wilayaNumber.value(),
            pictures: post.pictures.map(pic => pic.url()),
            status: post.status,
            createdAt: post.createdAt,
        };
    }
}

export { PostDtoMapper };
