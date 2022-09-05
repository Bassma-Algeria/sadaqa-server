import { UseCase } from '../UseCase';
import { GetPostsByPublisherUseCaseRequest } from './GetPostsByPublisherUseCaseRequest';
import { GetPostsByPublisherUseCaseResponse } from './GetPostsByPublisherUseCaseResponse';

import { Post } from '../../domain/Post';
import { UserId } from '../../domain/UserId';

import { UsersService } from '../../domain/services/UsersService';
import { PostRepository } from '../../domain/services/PostRepository/base/PostRepository';

import { PostDtoMapper } from '../_common_/dtos/base/PostDtoMapper';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../domain/exceptions/ExceptionMessages';

class GetPostsByPublisherUseCase
    implements UseCase<GetPostsByPublisherUseCaseRequest, GetPostsByPublisherUseCaseResponse>
{
    constructor(
        private readonly usersService: UsersService,
        private readonly dtoMapper: PostDtoMapper<Post>,
        private readonly postRepository: PostRepository<Post>,
    ) {}

    async handle(
        request: GetPostsByPublisherUseCaseRequest,
    ): Promise<GetPostsByPublisherUseCaseResponse> {
        const publisherId = new UserId(request.publisherId);

        await this.checkIfUserExistThrowIfNot(publisherId);

        const posts = await this.postRepository.findManyByPublisherId(publisherId);

        return { list: posts.map(this.dtoMapper.toDto) };
    }

    private async checkIfUserExistThrowIfNot(id: UserId) {
        const isExist = await this.usersService.isExist(id);
        if (!isExist) throw new NotFoundException(ExceptionMessages.USER_NOT_FOUND);
    }
}

export { GetPostsByPublisherUseCase };
