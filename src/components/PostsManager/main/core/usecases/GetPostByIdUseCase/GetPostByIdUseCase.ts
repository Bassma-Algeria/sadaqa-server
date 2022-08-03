import { UseCase } from '../UseCase';
import { GetPostByIdUseCaseRequest } from './GetPostByIdUseCaseRequest';
import { GetPostByIdUseCaseResponse } from './GetPostByIdUseCaseResponse';

import { Post } from '../../domain/Post';
import { PostId } from '../../domain/PostId';

import { PostRepository } from '../../domain/services/PostRepository/base/PostRepository';

import { PostDtoMapper } from '../_common_/dtos/base/PostDtoMapper';

import { NotFoundException } from '../../domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../domain/exceptions/ExceptionsMessages';

class GetPostByIdUseCase implements UseCase<GetPostByIdUseCaseRequest, GetPostByIdUseCaseResponse> {
    constructor(
        private readonly dtoMapper: PostDtoMapper<Post>,
        private readonly postRepository: PostRepository<Post>,
    ) {}

    async handle(request: GetPostByIdUseCaseRequest): Promise<GetPostByIdUseCaseResponse> {
        const post = await this.postRepository.findById(new PostId(request.postId));

        if (!post) throw new NotFoundException(ExceptionsMessages.POST_NOT_FOUND);

        return this.dtoMapper.toDto(post);
    }
}

export { GetPostByIdUseCase };
