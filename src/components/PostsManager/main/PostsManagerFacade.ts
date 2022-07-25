import { GetDonationPostUseCase } from './core/usecases/DonationPost/GetDonationPostUseCase/GetDonationPostUseCase';
import { GetDonationsPostsUseCase } from './core/usecases/DonationPost/GetDonationsPostsUseCase/GetDonationsPostsUseCase';
import { CreateDonationPostUseCase } from './core/usecases/DonationPost/CreateDonationPostUseCase/CreateDonationPostUseCase';
import { GetCallForHelpPostUseCase } from './core/usecases/CallForHelpPost/GetCallForHelpPostUseCase/GetCallForHelpPostUseCase';
import { GetCallForHelpPostsUseCase } from './core/usecases/CallForHelpPost/GetCallForHelpPostsUseCase/GetCallForHelpPostsUseCase';
import { GetFamilyInNeedPostUseCase } from './core/usecases/FamilyInNeedPost/GetFamilyInNeedPostUseCase/GetFamilyInNeedPostUseCase';
import { CreateCallForHelpPostUseCase } from './core/usecases/CallForHelpPost/CreateCallForHelpPostUseCase/CreateCallForHelpPostUseCase';
import { CreateFamilyInNeedPostUseCase } from './core/usecases/FamilyInNeedPost/CreateFamilyInNeedPostUseCase/CreateFamilyInNeedPostUseCase';
import { GetDonationRequestPostUseCase } from './core/usecases/DonationRequestPost/GetDonationRequestPostUseCase/GetDonationRequestPostUseCase';
import { GetDonationRequestsPostsUseCase } from './core/usecases/DonationRequestPost/GetDonationRequestsPostsUseCase/GetDonationRequestsPostsUseCase';
import { CreateDonationRequestPostUseCase } from './core/usecases/DonationRequestPost/CreateDonationRequestPostUseCase/CreateDonationRequestPostUseCase';

import { GetDonationPostUseCaseRequest } from './core/usecases/DonationPost/GetDonationPostUseCase/GetDonationPostUseCaseRequest';
import { GetDonationsPostsUseCaseRequest } from './core/usecases/DonationPost/GetDonationsPostsUseCase/GetDonationsPostsUseCaseRequest';
import { CreateDonationPostUseCaseRequest } from './core/usecases/DonationPost/CreateDonationPostUseCase/CreateDonationPostUseCaseRequest';
import { GetFamiliesInNeedPostsUseCase } from './core/usecases/FamilyInNeedPost/GetFamiliesInNeedPostsUseCase/GetFamiliesInNeedPostsUseCase';
import { GetCallForHelpPostUseCaseRequest } from './core/usecases/CallForHelpPost/GetCallForHelpPostUseCase/GetCallForHelpPostUseCaseRequest';
import { GetCallForHelpPostsUseCaseRequest } from './core/usecases/CallForHelpPost/GetCallForHelpPostsUseCase/GetCallForHelpPostsUseCaseRequest';
import { GetFamilyInNeedPostUseCaseRequest } from './core/usecases/FamilyInNeedPost/GetFamilyInNeedPostUseCase/GetFamilyInNeedPostUseCaseRequest';
import { CreateCallForHelpPostUseCaseRequest } from './core/usecases/CallForHelpPost/CreateCallForHelpPostUseCase/CreateCallForHelpPostUseCaseRequest';
import { GetFamiliesInNeedPostsUseCaseRequest } from './core/usecases/FamilyInNeedPost/GetFamiliesInNeedPostsUseCase/GetFamiliesInNeedPostsUseCaseRequest';
import { CreateFamilyInNeedPostUseCaseRequest } from './core/usecases/FamilyInNeedPost/CreateFamilyInNeedPostUseCase/CreateFamilyInNeedPostUseCaseRequest';
import { GetDonationRequestPostUseCaseRequest } from './core/usecases/DonationRequestPost/GetDonationRequestPostUseCase/GetDonationRequestPostUseCaseRequest';
import { GetDonationRequestsPostsUseCaseRequest } from './core/usecases/DonationRequestPost/GetDonationRequestsPostsUseCase/GetDonationRequestsPostsUseCaseRequest';
import { CreateDonationRequestPostUseCaseRequest } from './core/usecases/DonationRequestPost/CreateDonationRequestPostUseCase/CreateDonationRequestPostUseCaseRequest';

import { UsersService } from './core/domain/services/UsersService';
import { PostsEventPublisher } from './core/domain/services/PostsEventPublisher';
import { WilayasService } from './core/domain/services/WilayasService';
import { PostIdGenerator } from './core/domain/services/PostIdGenerator';
import { PicturesUploader } from './core/domain/services/PicturesUploader';
import { DonationPostRepository } from './core/domain/services/DonationPostRepository';
import { CallForHelpPostRepository } from './core/domain/services/CallForHelpPostRepository';
import { FamilyInNeedPostRepository } from './core/domain/services/FamilyInNeedPostRepository';
import { DonationRequestPostRepository } from './core/domain/services/DonationRequestPostRepository';

class PostsManagerFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly wilayasService: WilayasService,
    private readonly picturesUploader: PicturesUploader,
    private readonly postIdGenerator: PostIdGenerator,
    private readonly donationPostRepository: DonationPostRepository,
    private readonly postsEventBus: PostsEventPublisher,
    private readonly familyInNeedPostRepository: FamilyInNeedPostRepository,
    private readonly donationRequestPostRepository: DonationRequestPostRepository,
    private readonly callForHelpPostRepository: CallForHelpPostRepository,
  ) {}

  createDonationPost(request: CreateDonationPostUseCaseRequest) {
    return new CreateDonationPostUseCase(
      this.usersService,
      this.wilayasService,
      this.picturesUploader,
      this.postIdGenerator,
      this.donationPostRepository,
      this.postsEventBus,
    ).handle(request);
  }

  getDonationPost(request: GetDonationPostUseCaseRequest) {
    return new GetDonationPostUseCase(this.donationPostRepository).handle(request);
  }

  getDonationsPosts(request: GetDonationsPostsUseCaseRequest) {
    return new GetDonationsPostsUseCase(this.donationPostRepository).handle(request);
  }

  createDonationRequestPost(request: CreateDonationRequestPostUseCaseRequest) {
    return new CreateDonationRequestPostUseCase(
      this.usersService,
      this.wilayasService,
      this.picturesUploader,
      this.postIdGenerator,
      this.donationRequestPostRepository,
      this.postsEventBus,
    ).handle(request);
  }

  getDonationRequestPost(request: GetDonationRequestPostUseCaseRequest) {
    return new GetDonationRequestPostUseCase(this.donationRequestPostRepository).handle(request);
  }

  getDonationRequestPosts(request?: GetDonationRequestsPostsUseCaseRequest) {
    return new GetDonationRequestsPostsUseCase(this.donationRequestPostRepository).handle(request);
  }

  createFamilyInNeedPost(request: CreateFamilyInNeedPostUseCaseRequest) {
    return new CreateFamilyInNeedPostUseCase(
      this.wilayasService,
      this.usersService,
      this.picturesUploader,
      this.postIdGenerator,
      this.familyInNeedPostRepository,
      this.postsEventBus,
    ).handle(request);
  }

  getFamilyInNeedPost(request: GetFamilyInNeedPostUseCaseRequest) {
    return new GetFamilyInNeedPostUseCase(this.familyInNeedPostRepository).handle(request);
  }

  getFamilyInNeedPosts(request?: GetFamiliesInNeedPostsUseCaseRequest) {
    return new GetFamiliesInNeedPostsUseCase(this.familyInNeedPostRepository).handle(request);
  }

  createCallForHelpPost(request: CreateCallForHelpPostUseCaseRequest) {
    return new CreateCallForHelpPostUseCase(
      this.wilayasService,
      this.usersService,
      this.picturesUploader,
      this.postIdGenerator,
      this.callForHelpPostRepository,
      this.postsEventBus,
    ).handle(request);
  }

  getCallForHelpPost(request: GetCallForHelpPostUseCaseRequest) {
    return new GetCallForHelpPostUseCase(this.callForHelpPostRepository).handle(request);
  }

  getCallForHelpPosts(request?: GetCallForHelpPostsUseCaseRequest) {
    return new GetCallForHelpPostsUseCase(this.callForHelpPostRepository).handle(request);
  }
}

export { PostsManagerFacade };
