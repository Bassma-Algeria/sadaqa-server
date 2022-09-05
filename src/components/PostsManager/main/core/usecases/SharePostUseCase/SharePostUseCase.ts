import { UseCase } from '../UseCase';
import { SharePostUseCaseRequest } from './SharePostUseCaseRequest';

import { Post } from '../../domain/Post';
import { UserId } from '../../domain/UserId';
import { PostId } from '../../domain/PostId';

import { UsersService } from '../../domain/services/UsersService';
import { PostRepository } from '../../domain/services/PostRepository/base/PostRepository';
import { PostShareRepository } from '../../domain/services/PostRepository/PostShareRepository';
import { PostEventPublisher } from '../../domain/services/PostEventPublisher/base/PostEventPublisher';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';
import { PostShare } from '../../domain/PostShare';

class SharePostUseCase implements UseCase<SharePostUseCaseRequest, void> {
    constructor(
        private readonly usersService: UsersService,
        private readonly postRepository: PostRepository<Post>,
        private readonly postShareRepository: PostShareRepository,
        private readonly postEventPublisher: PostEventPublisher<Post>,
    ) {}

    async handle(request: SharePostUseCaseRequest): Promise<void> {
        const { postId, userId } = this.getFrom(request);

        if (userId) await this.checkIfUserExistThrowIfNot(userId);

        const post = await this.findPostThrowIfNotExist(postId);

        const postShare = new PostShare(post.getPostId(), post.getPostType(), userId, new Date());

        await this.postShareRepository.save(postShare);
        this.postEventPublisher.publishPostShared(postShare);
    }

    private getFrom(request: SharePostUseCaseRequest) {
        const postId = new PostId(request.postId);
        const userId = request.userId ? new UserId(request.userId) : null;

        return { postId, userId };
    }

    private async checkIfUserExistThrowIfNot(userId: UserId) {
        const isExist = await this.usersService.isExist(userId);
        if (!isExist) throw new NotFoundException(ExceptionMessages.USER_NOT_FOUND);
    }

    private async findPostThrowIfNotExist(id: PostId) {
        const post = await this.postRepository.findById(id);

        if (!post) throw new NotFoundException(ExceptionMessages.POST_NOT_FOUND);

        return post;
    }
}

export { SharePostUseCase };
