import { anything, instance, mock, when } from 'ts-mockito';

import { PicturesUploader } from '../../../../main/core/domain/services/PicturesUploader';
import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';
import { PostIdGenerator } from '../../../../main/core/domain/services/PostIdGenerator';
import { DonationPostRepository } from '../../../../main/core/domain/services/DonationPostRepository';

import { FakePicturesUploader } from '../../../../main/infra/fake/FakePicturesUploader';
import { FakePostIdGenerator } from '../../../../main/infra/fake/FakePostIdGenerator';
import { InMemoryDonationPostRepository } from '../../../../main/infra/fake/InMemoryDonationPostRespository';

import { PostsManagerFacade } from '../../../../main/PostsManagerFacade';
import { FakeDateTimeService } from '../../../../main/infra/fake/FakeDateTimeService';
import { DateTimeService } from '../../../../main/core/domain/services/DateTimeService';
import { PostsEventBus } from '../../../../main/core/domain/services/PostsEventBus';
import { FakePostsEventBus } from '../../../../main/infra/fake/FakePostsEventBus';

interface Dependencies {
  usersService: UsersService;
  wilayasService: WilayasService;
  picturesUploader: PicturesUploader;
  postIdGenerator: PostIdGenerator;
  donationPostRepository: DonationPostRepository;
  dateTimeService: DateTimeService;
  postsEventBus: PostsEventBus;
}

const aPostsManagerFacade = (dependencies?: Partial<Dependencies>) => {
  const mockUsersService = mock<UsersService>();
  const mockWilayasService = mock<WilayasService>();

  when(mockUsersService.isExist(anything())).thenResolve(true);
  when(mockWilayasService.isExist(anything())).thenResolve(true);

  return new PostsManagerFacade(
    dependencies?.usersService || instance(mockUsersService),
    dependencies?.wilayasService || instance(mockWilayasService),
    dependencies?.picturesUploader || new FakePicturesUploader(),
    dependencies?.postIdGenerator || new FakePostIdGenerator(),
    dependencies?.donationPostRepository || new InMemoryDonationPostRepository(),
    dependencies?.dateTimeService || new FakeDateTimeService(),
    dependencies?.postsEventBus || new FakePostsEventBus(),
  );
};

export { aPostsManagerFacade };
