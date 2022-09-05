import { PostDto } from './PostDto';
import { Post } from '../../../../domain/Post';

abstract class PostDtoMapper<P extends Post> {
    toDto(post: P): PostDto {
        return post.state;
    }
}

export { PostDtoMapper };
