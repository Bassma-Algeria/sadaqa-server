import { UseCase } from '../../UseCase';
import { DeleteFamilyInNeedPostUseCaseRequest } from './DeleteFamilyInNeedPostUseCaseRequest';

import { UserId } from '../../../domain/UserId';
import { PostId } from '../../../domain/PostId';

import { FamilyInNeedPostRepository } from '../../../domain/services/FamilyInNeedPostRepository';

import { ExceptionsMessages } from '../../../domain/exceptions/ExceptionsMessages';
import { PostNotFoundException } from '../../../domain/exceptions/PostNotFoundException';
import { NotAuthorizedException } from '../../../domain/exceptions/NotAuthorizedException';

class DeleteFamilyInNeedPostUseCase implements UseCase<DeleteFamilyInNeedPostUseCaseRequest, void> {
  constructor(private readonly familyInNeedPostRepository: FamilyInNeedPostRepository) {}

  async handle(request: DeleteFamilyInNeedPostUseCaseRequest): Promise<void> {
    const { userId, postId } = this.getFrom(request);

    const post = await this.findPostByIdThrowIfNotFound(postId);

    if (!post.publisherId.equals(userId))
      throw new NotAuthorizedException(ExceptionsMessages.NOT_AUTHORIZED_TO_DELETE);

    await this.delete(postId);
  }

  private async findPostByIdThrowIfNotFound(postId: PostId) {
    const post = await this.familyInNeedPostRepository.findById(postId);
    if (!post) throw new PostNotFoundException();

    return post;
  }

  private getFrom(request: DeleteFamilyInNeedPostUseCaseRequest) {
    return { userId: new UserId(request.userId), postId: new PostId(request.postId) };
  }

  private async delete(postId: PostId) {
    await this.familyInNeedPostRepository.delete(postId);
  }
}

export { DeleteFamilyInNeedPostUseCase };