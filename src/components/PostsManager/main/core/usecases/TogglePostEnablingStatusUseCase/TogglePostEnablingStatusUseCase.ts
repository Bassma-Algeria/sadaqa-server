import { UseCase } from '../UseCase';
import { TogglePostEnablingStatusUseCaseRequest } from './TogglePostEnablingStatusUseCaseRequest';
import { TogglePostEnablingStatusUseCaseResponse } from './TogglePostEnablingStatusUseCaseResponse';

import { Post } from '../../domain/Post';
import { PostId } from '../../domain/PostId';
import { UserId } from '../../domain/UserId';

import { PostRepository } from '../../domain/services/PostRepository/base/PostRepository';
import { PostEventPublisher } from '../../domain/services/PostEventPublisher/base/PostEventPublisher';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../domain/exceptions/ExceptionsMessages';
import { AuthorizationException } from '../../domain/exceptions/AuthorizationException';

class TogglePostEnablingStatusUseCase
    implements
        UseCase<TogglePostEnablingStatusUseCaseRequest, TogglePostEnablingStatusUseCaseResponse>
{
    constructor(
        private readonly postRepository: PostRepository<Post>,
        private readonly postEventPublisher: PostEventPublisher<Post>,
    ) {}

    async handle(
        request: TogglePostEnablingStatusUseCaseRequest,
    ): Promise<TogglePostEnablingStatusUseCaseResponse> {
        const { postId, userId } = this.getFrom(request);

        const post = await this.findPostByIdThrowIfNotFound(postId);

        if (!post.publisherId.equals(userId))
            throw new AuthorizationException(ExceptionsMessages.NOT_AUTHORIZED_TO_EDIT);

        const updatedPost = post.toggleEnablingStatus();

        await this.update(updatedPost);

        this.publishEnablingStatusToggleEvent(updatedPost);

        return { status: updatedPost.status };
    }

    private getFrom(request: TogglePostEnablingStatusUseCaseRequest) {
        return { userId: new UserId(request.userId), postId: new PostId(request.postId) };
    }

    private async findPostByIdThrowIfNotFound(id: PostId) {
        const post = await this.postRepository.findById(id);
        if (!post) throw new NotFoundException(ExceptionsMessages.POST_NOT_FOUND);

        return post;
    }

    private async update(post: Post) {
        await this.postRepository.update(post);
    }

    private publishEnablingStatusToggleEvent(post: Post) {
        this.postEventPublisher.publishEnablingStatusToggled(post);
    }
}

export { TogglePostEnablingStatusUseCase };
