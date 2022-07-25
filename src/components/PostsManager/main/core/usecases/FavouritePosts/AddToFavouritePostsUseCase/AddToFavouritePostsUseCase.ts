import { UseCase } from '../../UseCase';
import { AddToFavouritePostsUseCaseRequest } from './AddToFavouritePostsUseCaseRequest';

import { PostId } from '../../../domain/PostId';
import { UserId } from '../../../domain/UserId';
import { PostType } from '../../../domain/PostType';

import { UsersService } from '../../../domain/services/UsersService';
import { DonationPostRepository } from '../../../domain/services/DonationPostRepository';
import { CallForHelpPostRepository } from '../../../domain/services/CallForHelpPostRepository';
import { FamilyInNeedPostRepository } from '../../../domain/services/FamilyInNeedPostRepository';
import { DonationRequestPostRepository } from '../../../domain/services/DonationRequestPostRepository';

import { ExceptionsMessages } from '../../../domain/exceptions/ExceptionsMessages';
import { ValidationException } from '../../../domain/exceptions/ValidationException';
import { FavouritePostRepository } from '../../../domain/services/FavouritePostRepository';
import { FavouritePostBuilder } from '../../../domain/FavouritePostBuilder';
import { FavouritePost } from '../../../domain/FavouritePost';

class AddToFavouritePostsUseCase implements UseCase<AddToFavouritePostsUseCaseRequest, void> {
  constructor(
    private readonly usersService: UsersService,
    private readonly donationPostRepository: DonationPostRepository,
    private readonly donationRequestPostRepository: DonationRequestPostRepository,
    private readonly familyInNeedPostRepository: FamilyInNeedPostRepository,
    private readonly callForHelpPostRepository: CallForHelpPostRepository,
    private readonly favouritePostRepository: FavouritePostRepository,
  ) {}

  async handle(request: AddToFavouritePostsUseCaseRequest): Promise<void> {
    const { userId, postId, postType } = this.getFrom(request);

    await this.checkIfUserExistAndThrowIfNot(userId);
    await this.checkIfPostExistAndThrowIfNot(postId, postType);

    const favouritePost = FavouritePostBuilder.aBuilder()
      .withUserId(userId)
      .withPostId(postId)
      .withPostType(postType)
      .build();

    await this.saveFavouritePost(favouritePost);
  }

  private getFrom(request: AddToFavouritePostsUseCaseRequest) {
    return {
      userId: new UserId(request.userId),
      postId: new PostId(request.postId),
      postType: new PostType(request.postType),
    };
  }

  private async checkIfUserExistAndThrowIfNot(id: UserId) {
    const isExist = await this.usersService.isExist(id);

    if (!isExist) throw new ValidationException(ExceptionsMessages.USER_NOT_EXIST);
  }

  private async checkIfPostExistAndThrowIfNot(id: PostId, type: PostType) {
    let isExist = false;

    switch (type.value()) {
      case 'donation':
        isExist = !!(await this.donationPostRepository.findById(id));
        break;

      case 'family-in-need':
        isExist = !!(await this.familyInNeedPostRepository.findById(id));
        break;

      case 'call-for-help':
        isExist = !!(await this.callForHelpPostRepository.findById(id));
        break;

      case 'donation-request':
        isExist = !!(await this.donationRequestPostRepository.findById(id));
        break;
    }

    if (!isExist) throw new ValidationException(ExceptionsMessages.POST_NOT_EXIST);
  }

  private async saveFavouritePost(post: FavouritePost) {
    await this.favouritePostRepository.save(post);
  }
}

export { AddToFavouritePostsUseCase };