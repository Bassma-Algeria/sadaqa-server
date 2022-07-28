import { UseCase } from '../../UseCase';
import { ToggleDonationPostEnablingStatusUseCaseRequest } from './ToggleDonationPostEnablingStatusUseCaseRequest';
import { ToggleDonationPostEnablingStatusUseCaseResponse } from './ToggleDonationPostEnablingStatusUseCaseResponse';

import { UserId } from '../../../domain/UserId';
import { PostId } from '../../../domain/PostId';
import { DonationPost } from '../../../domain/DonationPost';

import { DonationPostRepository } from '../../../domain/services/DonationPostRepository';

import { NotFoundException } from '../../../domain/exceptions/NotFoundException';
import { ExceptionsMessages } from '../../../domain/exceptions/ExceptionsMessages';
import { NotAuthorizedException } from '../../../domain/exceptions/NotAuthorizedException';

import { DonationPostDtoMapper } from '../../_common_/dtos/DonationPostDtoMapper';

class ToggleDonationPostEnablingStatusUseCase
  implements
    UseCase<
      ToggleDonationPostEnablingStatusUseCaseRequest,
      ToggleDonationPostEnablingStatusUseCaseResponse
    >
{
  constructor(private readonly donationPostRepository: DonationPostRepository) {}

  async handle(
    request: ToggleDonationPostEnablingStatusUseCaseRequest,
  ): Promise<ToggleDonationPostEnablingStatusUseCaseResponse> {
    const { postId, userId } = this.getFrom(request);

    const post = await this.findPostByIdThrowIfNotFound(postId);

    if (!post.publisherId.equals(userId))
      throw new NotAuthorizedException(ExceptionsMessages.NOT_AUTHORIZED_TO_EDIT);

    const updatedPost = post.toggleEnableStatus();

    await this.update(updatedPost);

    return DonationPostDtoMapper.toDto(updatedPost);
  }

  private getFrom(request: ToggleDonationPostEnablingStatusUseCaseRequest) {
    return { userId: new UserId(request.userId), postId: new PostId(request.postId) };
  }

  private async findPostByIdThrowIfNotFound(id: PostId) {
    const post = await this.donationPostRepository.findById(id);
    if (!post) throw new NotFoundException(ExceptionsMessages.POST_NOT_FOUND);

    return post;
  }

  private async update(post: DonationPost) {
    await this.donationPostRepository.update(post);
  }
}

export { ToggleDonationPostEnablingStatusUseCase };
