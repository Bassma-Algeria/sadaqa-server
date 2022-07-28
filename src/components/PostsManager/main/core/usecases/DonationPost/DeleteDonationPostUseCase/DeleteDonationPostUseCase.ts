import { UseCase } from '../../UseCase';
import { DeleteDonationPostUseCaseRequest } from './DeleteDonationPostUseCaseRequest';

import { UserId } from '../../../domain/UserId';
import { PostId } from '../../../domain/PostId';

import { DonationPostRepository } from '../../../domain/services/DonationPostRepository';

import { ExceptionsMessages } from '../../../domain/exceptions/ExceptionsMessages';
import { PostNotFoundException } from '../../../domain/exceptions/PostNotFoundException';
import { NotAuthorizedException } from '../../../domain/exceptions/NotAuthorizedException';

class DeleteDonationPostUseCase implements UseCase<DeleteDonationPostUseCaseRequest, void> {
  constructor(private readonly donationPostRepository: DonationPostRepository) {}

  async handle(request: DeleteDonationPostUseCaseRequest): Promise<void> {
    const { userId, postId } = this.getFrom(request);

    const post = await this.findPostByIdThrowIfNotFound(postId);

    if (!post.publisherId.equals(userId))
      throw new NotAuthorizedException(ExceptionsMessages.NOT_AUTHORIZED_TO_DELETE);

    await this.delete(postId);
  }

  private async findPostByIdThrowIfNotFound(postId: PostId) {
    const post = await this.donationPostRepository.findById(postId);
    if (!post) throw new PostNotFoundException();

    return post;
  }

  private getFrom(request: DeleteDonationPostUseCaseRequest) {
    return { userId: new UserId(request.userId), postId: new PostId(request.postId) };
  }

  private async delete(postId: PostId) {
    await this.donationPostRepository.delete(postId);
  }
}

export { DeleteDonationPostUseCase };