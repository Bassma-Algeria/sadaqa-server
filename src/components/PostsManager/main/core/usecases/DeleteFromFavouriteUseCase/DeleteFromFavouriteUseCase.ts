import { UseCase } from '../UseCase';
import { DeleteFromFavouriteUseCaseRequest } from './DeleteFromFavouriteUseCaseRequest';

import { UserId } from '../../domain/UserId';
import { PostId } from '../../domain/PostId';
import { PostType } from '../../domain/PostType';
import { FavouritePost } from '../../domain/FavouritePost';
import { FavouritePostBuilder } from '../../domain/FavouritePostBuilder';

import { FavouritePostRepository } from '../../domain/services/PostRepository/FavouritePostRepository';

import { ExceptionsMessages } from '../../domain/exceptions/ExceptionsMessages';
import { ValidationException } from '../../domain/exceptions/ValidationException';
import { FavouritePostEventPublisher } from '../../domain/services/PostEventPublisher/FavouritePostEventPublisher';

class DeleteFromFavouriteUseCase implements UseCase<DeleteFromFavouriteUseCaseRequest, void> {
    constructor(
        private readonly favouritePostRepository: FavouritePostRepository,
        private readonly favouritePostEventPublisher: FavouritePostEventPublisher,
    ) {}

    async handle(request: DeleteFromFavouriteUseCaseRequest): Promise<void> {
        const { userId, postId, postType } = this.getFrom(request);

        const post = FavouritePostBuilder.aBuilder()
            .withPostId(postId)
            .withPostType(postType)
            .withUserId(userId)
            .build();

        await this.checkIfFavouritePostExistAndThrowIfNot(post);

        await this.delete(post);

        this.publishPostDeletedFromFavourite(post);
    }

    private getFrom(request: DeleteFromFavouriteUseCaseRequest) {
        return {
            userId: new UserId(request.userId),
            postId: new PostId(request.postId),
            postType: new PostType(request.postType),
        };
    }

    private async checkIfFavouritePostExistAndThrowIfNot(favouritePost: FavouritePost) {
        const posts = await this.favouritePostRepository.findByUserId(favouritePost.userId);

        const found = posts.find(post => {
            return (
                post.postId.value() === favouritePost.postId.value() &&
                post.postType.value() === favouritePost.postType.value()
            );
        });

        if (!found) throw new ValidationException(ExceptionsMessages.FAVOURITE_POST_NOT_EXIST);
    }

    private async delete(post: FavouritePost) {
        await this.favouritePostRepository.delete(post);
    }

    private publishPostDeletedFromFavourite(post: FavouritePost) {
        this.favouritePostEventPublisher.publishPostDeletedFromFavourite(post);
    }
}

export { DeleteFromFavouriteUseCase };
