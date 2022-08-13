import { UseCase } from '../UseCase';
import { IsPostInFavouritesUseCaseRequest } from './IsPostInFavouritesUseCaseRequest';
import { IsPostInFavouritesUseCaseResponse } from './IsPostInFavouritesUseCaseResponse';

import { UserId } from '../../domain/UserId';
import { PostId } from '../../domain/PostId';
import { PostType } from '../../domain/PostType';

import { FavouritePostRepository } from '../../domain/services/PostRepository/FavouritePostRepository';

class IsPostInFavouritesUseCase
    implements UseCase<IsPostInFavouritesUseCaseRequest, IsPostInFavouritesUseCaseResponse>
{
    constructor(private readonly favouritePostRepository: FavouritePostRepository) {}

    async handle(
        request: IsPostInFavouritesUseCaseRequest,
    ): Promise<IsPostInFavouritesUseCaseResponse> {
        const userId = new UserId(request.userId);
        const postId = new PostId(request.postId);
        const postType = new PostType(request.postType);

        const favouritePosts = await this.favouritePostRepository.findByUserId(userId);

        const found = favouritePosts.find(post => {
            return post.postType.equals(postType) && post.postId.equals(postId);
        });

        return { isFavourite: !!found };
    }
}

export { IsPostInFavouritesUseCase };