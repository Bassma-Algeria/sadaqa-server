import { GetDonationPostUseCase } from './core/usecases/GetDonationPostUseCase/GetDonationPostUseCase';
import { GetDonationsPostsUseCase } from './core/usecases/GetDonationsPostsUseCase/GetDonationsPostsUseCase';
import { CreateDonationPostUseCase } from './core/usecases/CreateDonationPostUseCase/CreateDonationPostUseCase';

import { GetDonationPostUseCaseRequest } from './core/usecases/GetDonationPostUseCase/GetDonationPostUseCaseRequest';
import { GetDonationsPostsUseCaseRequest } from './core/usecases/GetDonationsPostsUseCase/GetDonationsPostsUseCaseRequest';
import { CreateDonationPostUseCaseRequest } from './core/usecases/CreateDonationPostUseCase/CreateDonationPostUseCaseRequest';

import { UsersService } from './core/domain/services/UsersService';
import { MediaService } from './core/domain/services/MediaService';
import { PostsEventBus } from './core/domain/services/PostsEventBus';
import { WilayasService } from './core/domain/services/WilayasService';
import { PostIdGenerator } from './core/domain/services/PostIdGenerator';
import { DateTimeService } from './core/domain/services/DateTimeService';
import { DonationPostRepository } from './core/domain/services/DonationPostRepository';

class PostsManagerFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly wilayasService: WilayasService,
    private readonly mediaService: MediaService,
    private readonly postIdGenerator: PostIdGenerator,
    private readonly donationPostRepository: DonationPostRepository,
    private readonly dateTimeService: DateTimeService,
    private readonly postsEventBus: PostsEventBus,
  ) {}

  createDonationPost(request: CreateDonationPostUseCaseRequest) {
    return new CreateDonationPostUseCase(
      this.usersService,
      this.wilayasService,
      this.mediaService,
      this.postIdGenerator,
      this.donationPostRepository,
      this.dateTimeService,
      this.postsEventBus,
    ).handle(request);
  }

  getDonationPost(request: GetDonationPostUseCaseRequest) {
    return new GetDonationPostUseCase(this.donationPostRepository).handle(request);
  }

  getDonationsPosts(request: GetDonationsPostsUseCaseRequest) {
    return new GetDonationsPostsUseCase(this.donationPostRepository, this.wilayasService).handle(
      request,
    );
  }
}

export { PostsManagerFacade };
