import { UseCase } from '../../UseCase';
import { ToggleFamilyInNeedPostEnablingStatusUseCaseRequest } from './ToggleFamilyInNeedPostEnablingStatusUseCaseRequest';
import { ToggleFamilyInNeedPostEnablingStatusUseCaseResponse } from './ToggleFamilyInNeedPostEnablingStatusUseCaseResponse';

import { UserId } from '../../../domain/UserId';
import { PostId } from '../../../domain/PostId';
import { FamilyInNeedPost } from '../../../domain/FamilyInNeedPost';

import { FamilyInNeedPostRepository } from '../../../domain/services/FamilyInNeedPostRepository';

import { NotFoundException } from '../../../domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../../domain/exceptions/ExceptionsMessages';
import { NotAuthorizedException } from '../../../domain/exceptions/NotAuthorizedException';

import { FamilyInNeedPostDtoMapper } from '../../_common_/dtos/FamilyInNeedPostDtoMapper';

class ToggleFamilyInNeedPostEnablingStatusUseCase
  implements
    UseCase<
      ToggleFamilyInNeedPostEnablingStatusUseCaseRequest,
      ToggleFamilyInNeedPostEnablingStatusUseCaseResponse
    >
{
  constructor(private readonly familyInNeedPostRepository: FamilyInNeedPostRepository) {}

  async handle(
    request: ToggleFamilyInNeedPostEnablingStatusUseCaseRequest,
  ): Promise<ToggleFamilyInNeedPostEnablingStatusUseCaseResponse> {
    const { postId, userId } = this.getFrom(request);

    const post = await this.findPostByIdThrowIfNotFound(postId);

    if (!post.publisherId.equals(userId))
      throw new NotAuthorizedException(ExceptionsMessages.NOT_AUTHORIZED_TO_EDIT);

    const updatedPost = post.toggleEnableStatus();

    await this.update(updatedPost);

    return FamilyInNeedPostDtoMapper.toDto(updatedPost);
  }

  private getFrom(request: ToggleFamilyInNeedPostEnablingStatusUseCaseRequest) {
    return { userId: new UserId(request.userId), postId: new PostId(request.postId) };
  }

  private async findPostByIdThrowIfNotFound(id: PostId) {
    const post = await this.familyInNeedPostRepository.findById(id);
    if (!post) throw new NotFoundException(ExceptionsMessages.POST_NOT_FOUND);

    return post;
  }

  private async update(post: FamilyInNeedPost) {
    await this.familyInNeedPostRepository.update(post);
  }
}

export { ToggleFamilyInNeedPostEnablingStatusUseCase };
