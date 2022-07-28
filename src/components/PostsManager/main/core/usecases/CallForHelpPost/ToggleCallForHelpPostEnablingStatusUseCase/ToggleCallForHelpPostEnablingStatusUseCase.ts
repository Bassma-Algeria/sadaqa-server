import { UseCase } from '../../UseCase';
import { ToggleCallForHelpPostEnablingStatusUseCaseRequest } from './ToggleCallForHelpPostEnablingStatusUseCaseRequest';
import { ToggleCallForHelpPostEnablingStatusUseCaseResponse } from './ToggleCallForHelpPostEnablingStatusUseCaseResponse';

import { UserId } from '../../../domain/UserId';
import { PostId } from '../../../domain/PostId';
import { CallForHelpPost } from '../../../domain/CallForHelpPost';

import { CallForHelpPostRepository } from '../../../domain/services/CallForHelpPostRepository';

import { NotFoundException } from '../../../domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../../domain/exceptions/ExceptionsMessages';
import { NotAuthorizedException } from '../../../domain/exceptions/NotAuthorizedException';

import { CallForHelpPostDtoMapper } from '../../_common_/dtos/CallForHelpPostDtoMapper';

class ToggleCallForHelpPostEnablingStatusUseCase
  implements
    UseCase<
      ToggleCallForHelpPostEnablingStatusUseCaseRequest,
      ToggleCallForHelpPostEnablingStatusUseCaseResponse
    >
{
  constructor(private readonly callForHelpPostRepository: CallForHelpPostRepository) {}

  async handle(
    request: ToggleCallForHelpPostEnablingStatusUseCaseRequest,
  ): Promise<ToggleCallForHelpPostEnablingStatusUseCaseResponse> {
    const { postId, userId } = this.getFrom(request);

    const post = await this.findPostByIdThrowIfNotFound(postId);

    if (!post.publisherId.equals(userId))
      throw new NotAuthorizedException(ExceptionsMessages.NOT_AUTHORIZED_TO_EDIT);

    const updatedPost = post.toggleEnableStatus();

    await this.update(updatedPost);

    return CallForHelpPostDtoMapper.toDto(updatedPost);
  }

  private getFrom(request: ToggleCallForHelpPostEnablingStatusUseCaseRequest) {
    return { userId: new UserId(request.userId), postId: new PostId(request.postId) };
  }

  private async findPostByIdThrowIfNotFound(id: PostId) {
    const post = await this.callForHelpPostRepository.findById(id);
    if (!post) throw new NotFoundException(ExceptionsMessages.POST_NOT_FOUND);

    return post;
  }

  private async update(post: CallForHelpPost) {
    await this.callForHelpPostRepository.update(post);
  }
}

export { ToggleCallForHelpPostEnablingStatusUseCase };
