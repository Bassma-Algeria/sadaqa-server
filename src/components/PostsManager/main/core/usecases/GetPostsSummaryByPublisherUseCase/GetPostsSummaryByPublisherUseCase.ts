import { UseCase } from '../UseCase';
import { GetPostsSummaryByPublisherUseCaseRequest } from './GetPostsSummaryByPublisherUseCaseRequest';
import { GetPostsSummaryByPublisherUseCaseResponse } from './GetPostsSummaryByPublisherUseCaseResponse';

import { Post } from '../../domain/Post';
import { UserId } from '../../domain/UserId';
import { PostStatus } from '../../domain/PostStatus';

import { UsersService } from '../../domain/services/UsersService';
import { PostRepository } from '../../domain/services/PostRepository/base/PostRepository';

import { PostDtoMapper } from '../_common_/dtos/base/PostDtoMapper';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';

class GetPostsSummaryByPublisherUseCase
    implements
        UseCase<
            GetPostsSummaryByPublisherUseCaseRequest,
            GetPostsSummaryByPublisherUseCaseResponse
        >
{
    constructor(
        private readonly usersService: UsersService,
        private readonly dtoMapper: PostDtoMapper<Post>,
        private readonly postRepository: PostRepository<Post>,
    ) {}

    async handle(
        request: GetPostsSummaryByPublisherUseCaseRequest,
    ): Promise<GetPostsSummaryByPublisherUseCaseResponse> {
        const publisherId = new UserId(request.publisherId);

        await this.checkIfUserExistsThrowIfNot(publisherId);

        const ENABLED = await this.postRepository.count({
            publisherId,
            status: PostStatus.ENABLED,
        });
        const DISABLED = await this.postRepository.count({
            publisherId,
            status: PostStatus.DISABLED,
        });
        const BLOCKED = await this.postRepository.count({
            publisherId,
            status: PostStatus.BLOCKED,
        });

        return { total: ENABLED + DISABLED + BLOCKED, ENABLED, DISABLED, BLOCKED };
    }

    private async checkIfUserExistsThrowIfNot(id: UserId) {
        const isExist = await this.usersService.isExist(id);
        if (!isExist) throw new NotFoundException(ExceptionMessages.USER_NOT_FOUND);
    }
}

export { GetPostsSummaryByPublisherUseCase };
