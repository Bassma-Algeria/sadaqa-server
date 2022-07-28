import { UseCase } from '../../UseCase';
import { ToggleDonationRequestPostEnablingStatusUseCaseRequest } from './ToggleDonationRequestPostEnablingStatusUseCaseRequest';
import { ToggleDonationRequestPostEnablingStatusUseCaseResponse } from './ToggleDonationRequestPostEnablingStatusUseCaseResponse';

import { UserId } from '../../../domain/UserId';
import { PostId } from '../../../domain/PostId';
import { DonationRequestPost } from '../../../domain/DonationRequestPost';

import { DonationRequestPostRepository } from '../../../domain/services/DonationRequestPostRepository';

import { NotFoundException } from '../../../domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../../domain/exceptions/ExceptionsMessages';
import { NotAuthorizedException } from '../../../domain/exceptions/NotAuthorizedException';

import { DonationRequestPostDtoMapper } from '../../_common_/dtos/DonationRequestPostDtoMapper';

class ToggleDonationRequestPostEnablingStatusUseCase
  implements
    UseCase<
      ToggleDonationRequestPostEnablingStatusUseCaseRequest,
      ToggleDonationRequestPostEnablingStatusUseCaseResponse
    >
{
  constructor(private readonly donationRequestPostRepository: DonationRequestPostRepository) {}

  async handle(
    request: ToggleDonationRequestPostEnablingStatusUseCaseRequest,
  ): Promise<ToggleDonationRequestPostEnablingStatusUseCaseResponse> {
    const { postId, userId } = this.getFrom(request);

    const post = await this.findPostByIdThrowIfNotFound(postId);

    if (!post.publisherId.equals(userId))
      throw new NotAuthorizedException(ExceptionsMessages.NOT_AUTHORIZED_TO_EDIT);

    const updatedPost = post.toggleEnableStatus();

    await this.update(updatedPost);

    return DonationRequestPostDtoMapper.toDto(updatedPost);
  }

  private getFrom(request: ToggleDonationRequestPostEnablingStatusUseCaseRequest) {
    return { userId: new UserId(request.userId), postId: new PostId(request.postId) };
  }

  private async findPostByIdThrowIfNotFound(id: PostId) {
    const post = await this.donationRequestPostRepository.findById(id);
    if (!post) throw new NotFoundException(ExceptionsMessages.POST_NOT_FOUND);

    return post;
  }

  private async update(post: DonationRequestPost) {
    await this.donationRequestPostRepository.update(post);
  }
}

export { ToggleDonationRequestPostEnablingStatusUseCase };
