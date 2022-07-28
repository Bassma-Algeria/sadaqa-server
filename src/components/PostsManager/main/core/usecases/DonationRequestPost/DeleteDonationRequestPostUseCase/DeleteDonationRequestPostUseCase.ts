import { UseCase } from '../../UseCase';
import { DeleteDonationRequestPostUseCaseRequest } from './DeleteDonationRequestPostUseCaseRequest';

import { UserId } from '../../../domain/UserId';
import { PostId } from '../../../domain/PostId';

import { DonationRequestPostRepository } from '../../../domain/services/DonationRequestPostRepository';

import { ExceptionsMessages } from '../../../domain/exceptions/ExceptionsMessages';
import { PostNotFoundException } from '../../../domain/exceptions/PostNotFoundException';
import { NotAuthorizedException } from '../../../domain/exceptions/NotAuthorizedException';

class DeleteDonationRequestPostUseCase
  implements UseCase<DeleteDonationRequestPostUseCaseRequest, void>
{
  constructor(private readonly donationRequestPostRepository: DonationRequestPostRepository) {}

  async handle(request: DeleteDonationRequestPostUseCaseRequest): Promise<void> {
    const { userId, postId } = this.getFrom(request);

    const post = await this.findPostByIdThrowIfNotFound(postId);

    if (!post.publisherId.equals(userId))
      throw new NotAuthorizedException(ExceptionsMessages.NOT_AUTHORIZED_TO_DELETE);

    await this.delete(postId);
  }

  private async findPostByIdThrowIfNotFound(postId: PostId) {
    const post = await this.donationRequestPostRepository.findById(postId);
    if (!post) throw new PostNotFoundException();

    return post;
  }

  private getFrom(request: DeleteDonationRequestPostUseCaseRequest) {
    return { userId: new UserId(request.userId), postId: new PostId(request.postId) };
  }

  private async delete(postId: PostId) {
    await this.donationRequestPostRepository.delete(postId);
  }
}

export { DeleteDonationRequestPostUseCase };