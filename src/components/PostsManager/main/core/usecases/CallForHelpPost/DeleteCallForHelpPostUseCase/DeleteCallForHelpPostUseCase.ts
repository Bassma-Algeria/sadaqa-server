import { UseCase } from '../../UseCase';
import { DeleteCallForHelpPostUseCaseRequest } from './DeleteCallForHelpPostUseCaseRequest';

import { UserId } from '../../../domain/UserId';
import { PostId } from '../../../domain/PostId';

import { CallForHelpPostRepository } from '../../../domain/services/CallForHelpPostRepository';

import { ExceptionsMessages } from '../../../domain/exceptions/ExceptionsMessages';
import { PostNotFoundException } from '../../../domain/exceptions/PostNotFoundException';
import { NotAuthorizedException } from '../../../domain/exceptions/NotAuthorizedException';

class DeleteCallForHelpPostUseCase implements UseCase<DeleteCallForHelpPostUseCaseRequest, void> {
  constructor(private readonly callForHelpPostRepository: CallForHelpPostRepository) {}

  async handle(request: DeleteCallForHelpPostUseCaseRequest): Promise<void> {
    const { userId, postId } = this.getFrom(request);

    const post = await this.findPostByIdThrowIfNotFound(postId);

    if (!post.publisherId.equals(userId))
      throw new NotAuthorizedException(ExceptionsMessages.NOT_AUTHORIZED_TO_DELETE);

    await this.delete(postId);
  }

  private async findPostByIdThrowIfNotFound(postId: PostId) {
    const post = await this.callForHelpPostRepository.findById(postId);
    if (!post) throw new PostNotFoundException();

    return post;
  }

  private getFrom(request: DeleteCallForHelpPostUseCaseRequest) {
    return { userId: new UserId(request.userId), postId: new PostId(request.postId) };
  }

  private async delete(postId: PostId) {
    await this.callForHelpPostRepository.delete(postId);
  }
}

export { DeleteCallForHelpPostUseCase };