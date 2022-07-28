import { GetDonationPostUseCase } from './core/usecases/DonationPost/GetDonationPostUseCase/GetDonationPostUseCase';
import { GetDonationsPostsUseCase } from './core/usecases/DonationPost/GetDonationsPostsUseCase/GetDonationsPostsUseCase';
import { GetFavouritePostsUseCase } from './core/usecases/FavouritePosts/GetFavouritePostsUseCase/GetFavouritePostsUseCase';
import { DeleteDonationPostUseCase } from './core/usecases/DonationPost/DeleteDonationPostUseCase/DeleteDonationPostUseCase';
import { CreateDonationPostUseCase } from './core/usecases/DonationPost/CreateDonationPostUseCase/CreateDonationPostUseCase';
import { GetCallForHelpPostUseCase } from './core/usecases/CallForHelpPost/GetCallForHelpPostUseCase/GetCallForHelpPostUseCase';
import { AddToFavouritePostsUseCase } from './core/usecases/FavouritePosts/AddToFavouritePostsUseCase/AddToFavouritePostsUseCase';
import { DeleteFavouritePostUseCase } from './core/usecases/FavouritePosts/DeleteFavouritePostUseCase/DeleteFavouritePostUseCase';
import { GetCallForHelpPostsUseCase } from './core/usecases/CallForHelpPost/GetCallForHelpPostsUseCase/GetCallForHelpPostsUseCase';
import { GetFamilyInNeedPostUseCase } from './core/usecases/FamilyInNeedPost/GetFamilyInNeedPostUseCase/GetFamilyInNeedPostUseCase';
import { CreateCallForHelpPostUseCase } from './core/usecases/CallForHelpPost/CreateCallForHelpPostUseCase/CreateCallForHelpPostUseCase';
import { DeleteCallForHelpPostUseCase } from './core/usecases/CallForHelpPost/DeleteCallForHelpPostUseCase/DeleteCallForHelpPostUseCase';
import { CreateFamilyInNeedPostUseCase } from './core/usecases/FamilyInNeedPost/CreateFamilyInNeedPostUseCase/CreateFamilyInNeedPostUseCase';
import { DeleteFamilyInNeedPostUseCase } from './core/usecases/FamilyInNeedPost/DeleteFamilyInNeedPostUseCase/DeleteFamilyInNeedPostUseCase';
import { GetFamiliesInNeedPostsUseCase } from './core/usecases/FamilyInNeedPost/GetFamiliesInNeedPostsUseCase/GetFamiliesInNeedPostsUseCase';
import { GetDonationRequestPostUseCase } from './core/usecases/DonationRequestPost/GetDonationRequestPostUseCase/GetDonationRequestPostUseCase';
import { GetDonationRequestsPostsUseCase } from './core/usecases/DonationRequestPost/GetDonationRequestsPostsUseCase/GetDonationRequestsPostsUseCase';
import { DeleteDonationRequestPostUseCase } from './core/usecases/DonationRequestPost/DeleteDonationRequestPostUseCase/DeleteDonationRequestPostUseCase';
import { CreateDonationRequestPostUseCase } from './core/usecases/DonationRequestPost/CreateDonationRequestPostUseCase/CreateDonationRequestPostUseCase';
import { ToggleDonationPostEnablingStatusUseCase } from './core/usecases/DonationPost/ToggleDonationPostEnablingStatusUseCase/ToggleDonationPostEnablingStatusUseCase';
import { ToggleCallForHelpPostEnablingStatusUseCase } from './core/usecases/CallForHelpPost/ToggleCallForHelpPostEnablingStatusUseCase/ToggleCallForHelpPostEnablingStatusUseCase';
import { ToggleFamilyInNeedPostEnablingStatusUseCase } from './core/usecases/FamilyInNeedPost/ToggleFamilyInNeedPostEnablingStatusUseCase/ToggleFamilyInNeedPostEnablingStatusUseCase';
import { ToggleDonationRequestPostEnablingStatusUseCase } from './core/usecases/DonationRequestPost/ToggleDonationRequestPostEnablingStatusUseCase/ToggleDonationRequestPostEnablingStatusUseCase';

import { GetDonationPostUseCaseRequest } from './core/usecases/DonationPost/GetDonationPostUseCase/GetDonationPostUseCaseRequest';
import { GetDonationsPostsUseCaseRequest } from './core/usecases/DonationPost/GetDonationsPostsUseCase/GetDonationsPostsUseCaseRequest';
import { GetFavouritePostsUseCaseRequest } from './core/usecases/FavouritePosts/GetFavouritePostsUseCase/GetFavouritePostsUseCaseRequest';
import { CreateDonationPostUseCaseRequest } from './core/usecases/DonationPost/CreateDonationPostUseCase/CreateDonationPostUseCaseRequest';
import { DeleteDonationPostUseCaseRequest } from './core/usecases/DonationPost/DeleteDonationPostUseCase/DeleteDonationPostUseCaseRequest';
import { GetCallForHelpPostUseCaseRequest } from './core/usecases/CallForHelpPost/GetCallForHelpPostUseCase/GetCallForHelpPostUseCaseRequest';
import { AddToFavouritePostsUseCaseRequest } from './core/usecases/FavouritePosts/AddToFavouritePostsUseCase/AddToFavouritePostsUseCaseRequest';
import { DeleteFavouritePostUseCaseRequest } from './core/usecases/FavouritePosts/DeleteFavouritePostUseCase/DeleteFavouritePostUseCaseRequest';
import { GetCallForHelpPostsUseCaseRequest } from './core/usecases/CallForHelpPost/GetCallForHelpPostsUseCase/GetCallForHelpPostsUseCaseRequest';
import { GetFamilyInNeedPostUseCaseRequest } from './core/usecases/FamilyInNeedPost/GetFamilyInNeedPostUseCase/GetFamilyInNeedPostUseCaseRequest';
import { DeleteCallForHelpPostUseCaseRequest } from './core/usecases/CallForHelpPost/DeleteCallForHelpPostUseCase/DeleteCallForHelpPostUseCaseRequest';
import { CreateCallForHelpPostUseCaseRequest } from './core/usecases/CallForHelpPost/CreateCallForHelpPostUseCase/CreateCallForHelpPostUseCaseRequest';
import { GetFamiliesInNeedPostsUseCaseRequest } from './core/usecases/FamilyInNeedPost/GetFamiliesInNeedPostsUseCase/GetFamiliesInNeedPostsUseCaseRequest';
import { CreateFamilyInNeedPostUseCaseRequest } from './core/usecases/FamilyInNeedPost/CreateFamilyInNeedPostUseCase/CreateFamilyInNeedPostUseCaseRequest';
import { DeleteFamilyInNeedPostUseCaseRequest } from './core/usecases/FamilyInNeedPost/DeleteFamilyInNeedPostUseCase/DeleteFamilyInNeedPostUseCaseRequest';
import { GetDonationRequestPostUseCaseRequest } from './core/usecases/DonationRequestPost/GetDonationRequestPostUseCase/GetDonationRequestPostUseCaseRequest';
import { GetDonationRequestsPostsUseCaseRequest } from './core/usecases/DonationRequestPost/GetDonationRequestsPostsUseCase/GetDonationRequestsPostsUseCaseRequest';
import { CreateDonationRequestPostUseCaseRequest } from './core/usecases/DonationRequestPost/CreateDonationRequestPostUseCase/CreateDonationRequestPostUseCaseRequest';
import { DeleteDonationRequestPostUseCaseRequest } from './core/usecases/DonationRequestPost/DeleteDonationRequestPostUseCase/DeleteDonationRequestPostUseCaseRequest';
import { ToggleDonationPostEnablingStatusUseCaseRequest } from './core/usecases/DonationPost/ToggleDonationPostEnablingStatusUseCase/ToggleDonationPostEnablingStatusUseCaseRequest';
import { ToggleCallForHelpPostEnablingStatusUseCaseRequest } from './core/usecases/CallForHelpPost/ToggleCallForHelpPostEnablingStatusUseCase/ToggleCallForHelpPostEnablingStatusUseCaseRequest';
import { ToggleFamilyInNeedPostEnablingStatusUseCaseRequest } from './core/usecases/FamilyInNeedPost/ToggleFamilyInNeedPostEnablingStatusUseCase/ToggleFamilyInNeedPostEnablingStatusUseCaseRequest';
import { ToggleDonationRequestPostEnablingStatusUseCaseRequest } from './core/usecases/DonationRequestPost/ToggleDonationRequestPostEnablingStatusUseCase/ToggleDonationRequestPostEnablingStatusUseCaseRequest';

import { UsersService } from './core/domain/services/UsersService';
import { WilayasService } from './core/domain/services/WilayasService';
import { PostIdGenerator } from './core/domain/services/PostIdGenerator';
import { PicturesUploader } from './core/domain/services/PicturesUploader';
import { PostsEventPublisher } from './core/domain/services/PostsEventPublisher';
import { DonationPostRepository } from './core/domain/services/DonationPostRepository';
import { FavouritePostRepository } from './core/domain/services/FavouritePostRepository';
import { CallForHelpPostRepository } from './core/domain/services/CallForHelpPostRepository';
import { FamilyInNeedPostRepository } from './core/domain/services/FamilyInNeedPostRepository';
import { DonationRequestPostRepository } from "./core/domain/services/DonationRequestPostRepository";

class PostsManagerFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly wilayasService: WilayasService,
    private readonly picturesUploader: PicturesUploader,
    private readonly postIdGenerator: PostIdGenerator,
    private readonly donationPostRepository: DonationPostRepository,
    private readonly postsEventPublisher: PostsEventPublisher,
    private readonly familyInNeedPostRepository: FamilyInNeedPostRepository,
    private readonly donationRequestPostRepository: DonationRequestPostRepository,
    private readonly callForHelpPostRepository: CallForHelpPostRepository,
    private readonly favouritePostRepository: FavouritePostRepository,
  ) {}

  createDonationPost(request: CreateDonationPostUseCaseRequest) {
    return new CreateDonationPostUseCase(
      this.usersService,
      this.wilayasService,
      this.picturesUploader,
      this.postIdGenerator,
      this.donationPostRepository,
      this.postsEventPublisher,
    ).handle(request);
  }

  getDonationPost(request: GetDonationPostUseCaseRequest) {
    return new GetDonationPostUseCase(this.donationPostRepository).handle(request);
  }

  getDonationsPosts(request: GetDonationsPostsUseCaseRequest) {
    return new GetDonationsPostsUseCase(this.donationPostRepository).handle(request);
  }

  deleteDonationPost(request: DeleteDonationPostUseCaseRequest) {
    return new DeleteDonationPostUseCase(this.donationPostRepository).handle(request);
  }

  toggleDonationPostEnablingStatus(request: ToggleDonationPostEnablingStatusUseCaseRequest) {
    return new ToggleDonationPostEnablingStatusUseCase(this.donationPostRepository).handle(request);
  }

  createDonationRequestPost(request: CreateDonationRequestPostUseCaseRequest) {
    return new CreateDonationRequestPostUseCase(
      this.usersService,
      this.wilayasService,
      this.picturesUploader,
      this.postIdGenerator,
      this.donationRequestPostRepository,
      this.postsEventPublisher,
    ).handle(request);
  }

  getDonationRequestPost(request: GetDonationRequestPostUseCaseRequest) {
    return new GetDonationRequestPostUseCase(this.donationRequestPostRepository).handle(request);
  }

  getDonationRequestPosts(request?: GetDonationRequestsPostsUseCaseRequest) {
    return new GetDonationRequestsPostsUseCase(this.donationRequestPostRepository).handle(request);
  }

  deleteDonationRequestPost(request: DeleteDonationRequestPostUseCaseRequest) {
    return new DeleteDonationRequestPostUseCase(this.donationRequestPostRepository).handle(request);
  }

  toggleDonationRequestPostEnablingStatus(
    request: ToggleDonationRequestPostEnablingStatusUseCaseRequest,
  ) {
    return new ToggleDonationRequestPostEnablingStatusUseCase(
      this.donationRequestPostRepository,
    ).handle(request);
  }

  createFamilyInNeedPost(request: CreateFamilyInNeedPostUseCaseRequest) {
    return new CreateFamilyInNeedPostUseCase(
      this.wilayasService,
      this.usersService,
      this.picturesUploader,
      this.postIdGenerator,
      this.familyInNeedPostRepository,
      this.postsEventPublisher,
    ).handle(request);
  }

  getFamilyInNeedPost(request: GetFamilyInNeedPostUseCaseRequest) {
    return new GetFamilyInNeedPostUseCase(this.familyInNeedPostRepository).handle(request);
  }

  getFamilyInNeedPosts(request?: GetFamiliesInNeedPostsUseCaseRequest) {
    return new GetFamiliesInNeedPostsUseCase(this.familyInNeedPostRepository).handle(request);
  }

  deleteFamilyInNeedPost(request: DeleteFamilyInNeedPostUseCaseRequest) {
    return new DeleteFamilyInNeedPostUseCase(this.familyInNeedPostRepository).handle(request);
  }

  toggleFamilyInNeedPostEnablingStatus(
    request: ToggleFamilyInNeedPostEnablingStatusUseCaseRequest,
  ) {
    return new ToggleFamilyInNeedPostEnablingStatusUseCase(this.familyInNeedPostRepository).handle(
      request,
    );
  }

  createCallForHelpPost(request: CreateCallForHelpPostUseCaseRequest) {
    return new CreateCallForHelpPostUseCase(
      this.wilayasService,
      this.usersService,
      this.picturesUploader,
      this.postIdGenerator,
      this.callForHelpPostRepository,
      this.postsEventPublisher,
    ).handle(request);
  }

  getCallForHelpPost(request: GetCallForHelpPostUseCaseRequest) {
    return new GetCallForHelpPostUseCase(this.callForHelpPostRepository).handle(request);
  }

  deleteCallForHelpPost(request: DeleteCallForHelpPostUseCaseRequest) {
    return new DeleteCallForHelpPostUseCase(this.callForHelpPostRepository).handle(request);
  }

  getCallForHelpPosts(request?: GetCallForHelpPostsUseCaseRequest) {
    return new GetCallForHelpPostsUseCase(this.callForHelpPostRepository).handle(request);
  }

  toggleCallForHelpPostEnablingStatus(request: ToggleCallForHelpPostEnablingStatusUseCaseRequest) {
    return new ToggleCallForHelpPostEnablingStatusUseCase(this.callForHelpPostRepository).handle(
      request,
    );
  }

  addToFavouritePosts(request: AddToFavouritePostsUseCaseRequest) {
    return new AddToFavouritePostsUseCase(
      this.usersService,
      this.donationPostRepository,
      this.donationRequestPostRepository,
      this.familyInNeedPostRepository,
      this.callForHelpPostRepository,
      this.favouritePostRepository,
    ).handle(request);
  }

  getFavouritePosts(request: GetFavouritePostsUseCaseRequest) {
    return new GetFavouritePostsUseCase(
      this.usersService,
      this.donationPostRepository,
      this.donationRequestPostRepository,
      this.familyInNeedPostRepository,
      this.callForHelpPostRepository,
      this.favouritePostRepository,
    ).handle(request);
  }

  deleteFavouritePost(request: DeleteFavouritePostUseCaseRequest) {
    return new DeleteFavouritePostUseCase(this.favouritePostRepository).handle(request);
  }
}

export { PostsManagerFacade };
