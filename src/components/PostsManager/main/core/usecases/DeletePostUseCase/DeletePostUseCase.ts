import { UseCase } from '../UseCase';
import { DeletePostUseCaseRequest } from './DeletePostUseCaseRequest';

import { Post } from '../../domain/Post';
import { UserId } from '../../domain/UserId';
import { PostId } from '../../domain/PostId';

import { PostRepository } from '../../domain/services/PostRepository/base/PostRepository';
import { PostEventPublisher } from '../../domain/services/PostEventPublisher/base/PostEventPublisher';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';
import { AuthorizationException } from '../../domain/exceptions/AuthorizationException';

class DeletePostUseCase implements UseCase<DeletePostUseCaseRequest, void> {
    constructor(
        private readonly postRepository: PostRepository<Post>,
        private readonly postEventPublisher: PostEventPublisher<Post>,
    ) {}

    async handle(request: DeletePostUseCaseRequest): Promise<void> {
        const { userId, postId } = this.getFrom(request);

        const post = await this.findPostByIdThrowIfNotFound(postId);

        if (!post.publisherId.equals(userId))
            throw new AuthorizationException(ExceptionMessages.NOT_AUTHORIZED_TO_DELETE);

        await this.delete(post);

        this.publishPostDeletedEvent(post);
    }

    private async findPostByIdThrowIfNotFound(postId: PostId) {
        const post = await this.postRepository.findById(postId);
        if (!post) throw new NotFoundException(ExceptionMessages.POST_NOT_FOUND);

        return post;
    }

    private getFrom(request: DeletePostUseCaseRequest) {
        return { userId: new UserId(request.userId), postId: new PostId(request.postId) };
    }

    private async delete(post: Post) {
        await this.postRepository.delete(post);
    }

    private publishPostDeletedEvent(post: Post) {
        this.postEventPublisher.publishPostDeleted(post);
    }
}

export { DeletePostUseCase };
