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
import { ToggleDonationRequestPostEnablingStatusUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationRequestPost/ToggleDonationRequestPostEnablingStatusUseCase/ToggleDonationRequestPostEnablingStatusUseCaseRequest';
import { ToggleCallForHelpPostEnablingStatusUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/CallForHelpPost/ToggleCallForHelpPostEnablingStatusUseCase/ToggleCallForHelpPostEnablingStatusUseCaseRequest';
import { ToggleFamilyInNeedPostEnablingStatusUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/FamilyInNeedPost/ToggleFamilyInNeedPostEnablingStatusUseCase/ToggleFamilyInNeedPostEnablingStatusUseCaseRequest';
import { ToggleDonationPostEnablingStatusUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationPost/ToggleDonationPostEnablingStatusUseCase/ToggleDonationPostEnablingStatusUseCaseRequest';
import { DeleteDonationPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationPost/DeleteDonationPostUseCase/DeleteDonationPostUseCaseRequest';
import { DeleteFamilyInNeedPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/FamilyInNeedPost/DeleteFamilyInNeedPostUseCase/DeleteFamilyInNeedPostUseCaseRequest';
import { DeleteCallForHelpPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/CallForHelpPost/DeleteCallForHelpPostUseCase/DeleteCallForHelpPostUseCaseRequest';
import { DeleteDonationRequestPostUseCaseRequest } from '../../../components/PostsManager/main/core/usecases/DonationRequestPost/DeleteDonationRequestPostUseCase/DeleteDonationRequestPostUseCaseRequest';

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

  async toggleDonationEnablingStatus(
    accessToken: string,
    body: Omit<ToggleDonationPostEnablingStatusUseCaseRequest, 'userId'>,
  ) {
    const { userId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.toggleDonationPostEnablingStatus({ ...body, userId });
  }

  async deleteDonation(
    accessToken: string,
    body: Omit<DeleteDonationPostUseCaseRequest, 'userId'>,
  ) {
    const { userId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.deleteDonationPost({ ...body, userId });
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

  async toggleFamilyInNeedEnablingStatus(
    accessToken: string,
    body: Omit<ToggleFamilyInNeedPostEnablingStatusUseCaseRequest, 'userId'>,
  ) {
    const { userId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.toggleFamilyInNeedPostEnablingStatus({ ...body, userId });
  }

  async deleteFamilyInNeed(
    accessToken: string,
    body: Omit<DeleteFamilyInNeedPostUseCaseRequest, 'userId'>,
  ) {
    const { userId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.deleteFamilyInNeedPost({ ...body, userId });
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

  async toggleCallForHelpEnablingStatus(
    accessToken: string,
    body: Omit<ToggleCallForHelpPostEnablingStatusUseCaseRequest, 'userId'>,
  ) {
    const { userId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.toggleCallForHelpPostEnablingStatus({ ...body, userId });
  }

  async deleteCallForHelp(
    accessToken: string,
    body: Omit<DeleteCallForHelpPostUseCaseRequest, 'userId'>,
  ) {
    const { userId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.deleteCallForHelpPost({ ...body, userId });
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

  async toggleDonationRequestEnablingStatus(
    accessToken: string,
    body: Omit<ToggleDonationRequestPostEnablingStatusUseCaseRequest, 'userId'>,
  ) {
    const { userId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.toggleDonationRequestPostEnablingStatus({ ...body, userId });
  }

  async deleteDonationRequest(
    accessToken: string,
    body: Omit<DeleteDonationRequestPostUseCaseRequest, 'userId'>,
  ) {
    const { userId } = await this.authenticationManager.decodeAccessToken({
      accessToken,
    });

    return this.postsManager.deleteDonationRequestPost({ ...body, userId });
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