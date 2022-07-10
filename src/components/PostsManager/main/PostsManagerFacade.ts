import { CreateDonationPostUseCase } from './core/usecases/CreateDonationPostPostUseCase/CreateDonationPostUseCase';
import { CreateDonationPostUseCaseRequest } from './core/usecases/CreateDonationPostPostUseCase/CreateDonationPostUseCaseRequest';

import { UsersService } from './core/domain/services/UsersService';
import { MediaService } from './core/domain/services/MediaService';
import { WilayasService } from './core/domain/services/WilayasService';
import { PostIdGenerator } from './core/domain/services/PostIdGenerator';

import { DateTimeService } from './core/domain/services/DateTimeService';
import { DonationPostRepository } from './core/domain/services/DonationPostRepository';

import { GetDonationPostUseCase } from './core/usecases/GetDonationPostUseCase/GetDonationPostUseCase';
import { GetDonationPostUseCaseRequest } from './core/usecases/GetDonationPostUseCase/GetDonationPostUseCaseRequest';
import { PostsEventBus } from './core/domain/services/PostsEventBus';

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
}

export { PostsManagerFacade };
