import { Injectable } from '@nestjs/common';

import { PostsManagerConfiguration } from '../../../components/PostsManager/main/PostsManagerConfiguration';
import { AuthenticationManagerConfiguration } from '../../../components/AuthenticationManager/main/AuthenticationManagerConfiguration';

import { GetDonationPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationPost/GetDonationPostUseCase/GetDonationPostUseCaseRequest';
import { GetDonationsPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationPost/GetDonationsPostsUseCase/GetDonationsPostsUseCaseRequest';
import { CreateDonationPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationPost/CreateDonationPostUseCase/CreateDonationPostUseCaseRequest';
import { CreateFamilyInNeedPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/FamilyInNeedPost/CreateFamilyInNeedPostUseCase/CreateFamilyInNeedPostUseCaseRequest';
import { GetFamilyInNeedPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/FamilyInNeedPost/GetFamilyInNeedPostUseCase/GetFamilyInNeedPostUseCaseRequest';
import { GetFamiliesInNeedPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/FamilyInNeedPost/GetFamiliesInNeedPostsUseCase/GetFamiliesInNeedPostsUseCaseRequest';
import { CreateDonationRequestPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationRequestPost/CreateDonationRequestPostUseCase/CreateDonationRequestPostUseCaseRequest';
import { GetDonationRequestPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationRequestPost/GetDonationRequestPostUseCase/GetDonationRequestPostUseCaseRequest';
import { GetDonationRequestsPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationRequestPost/GetDonationRequestsPostsUseCase/GetDonationRequestsPostsUseCaseRequest';
import { GetCallForHelpPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/CallForHelpPost/GetCallForHelpPostUseCase/GetCallForHelpPostUseCaseRequest';
import { GetCallForHelpPostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/CallForHelpPost/GetCallForHelpPostsUseCase/GetCallForHelpPostsUseCaseRequest';
import { CreateCallForHelpPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/CallForHelpPost/CreateCallForHelpPostUseCase/CreateCallForHelpPostUseCaseRequest';
import { AddToFavouritePostsUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/FavouritePosts/AddToFavouritePostsUseCase/AddToFavouritePostsUseCaseRequest';
import { DeleteFavouritePostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/FavouritePosts/DeleteFavouritePostUseCase/DeleteFavouritePostUseCaseRequest';

@Injectable()
class PostsService {
  private readonly authenticationManager =
    AuthenticationManagerConfiguration.anAuthenticationManagerFacade();

  private readonly postsManager = PostsManagerConfiguration.aPostsManagerFacade();

  getDonationById(request: GetDonationPostUseCaseRequest) {
    return this.postsManager.getDonationPost(request);
  }

  getDonations(request: GetDonationsPostsUseCaseRequest) {
    return this.postsManager.getDonationsPosts(request);
  }

  async createNewDonation(
    accessToken: string,
    body: Omit<CreateDonationPostUseCaseRequest, 'publisherId'>,
  ) {
    const { userId: publisherId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.createDonationPost({ ...body, publisherId });
  }

  getFamilyInNeedById(request: GetFamilyInNeedPostUseCaseRequest) {
    return this.postsManager.getFamilyInNeedPost(request);
  }

  getFamiliesInNeed(request: GetFamiliesInNeedPostsUseCaseRequest) {
    return this.postsManager.getFamilyInNeedPosts(request);
  }

  async createNewFamilyInNeed(
    accessToken: string,
    body: Omit<CreateFamilyInNeedPostUseCaseRequest, 'publisherId'>,
  ) {
    const { userId: publisherId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.createFamilyInNeedPost({ ...body, publisherId });
  }

  getCallForHelpById(request: GetCallForHelpPostUseCaseRequest) {
    return this.postsManager.getCallForHelpPost(request);
  }

  getCallsForHelp(request: GetCallForHelpPostsUseCaseRequest) {
    return this.postsManager.getCallForHelpPosts(request);
  }

  async createNewCallForHelp(
    accessToken: string,
    body: Omit<CreateCallForHelpPostUseCaseRequest, 'publisherId'>,
  ) {
    const { userId: publisherId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.createCallForHelpPost({ ...body, publisherId });
  }

  async createDonationRequest(
    accessToken: string,
    body: Omit<CreateDonationRequestPostUseCaseRequest, 'publisherId'>,
  ) {
    const { userId: publisherId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.createDonationRequestPost({ ...body, publisherId });
  }

  getDonationRequestById(request: GetDonationRequestPostUseCaseRequest) {
    return this.postsManager.getDonationRequestPost(request);
  }

  getDonationRequests(request: GetDonationRequestsPostsUseCaseRequest) {
    return this.postsManager.getDonationRequestPosts(request);
  }

  async addToFavourite(
    accessToken: string,
    request: Omit<AddToFavouritePostsUseCaseRequest, 'userId'>,
  ) {
    const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

    return this.postsManager.addToFavouritePosts({ ...request, userId });
  }

  async deleteFavouritePost(
    accessToken: string,
    request: Omit<DeleteFavouritePostUseCaseRequest, 'userId'>,
  ) {
    const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

    return this.postsManager.deleteFavouritePost({ ...request, userId });
  }

  async getFavouritePosts(accessToken: string) {
    const { userId } = await this.authenticationManager.decodeAccessToken({ accessToken });

    return this.postsManager.getFavouritePosts({ userId });
  }
}

export { PostsService };