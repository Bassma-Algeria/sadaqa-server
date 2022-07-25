import { anything, instance, mock, when } from 'ts-mockito';

import { UsersService } from '../../../../main/core/domain/services/UsersService';
import { WilayasService } from '../../../../main/core/domain/services/WilayasService';

import { FakePicturesUploader } from '../../../../main/infra/fake/FakePicturesUploader';

import { PostsEventPublisherImpl } from '../../../../main/infra/real/PostsEventPublisherImpl';
import { UuidPostIdGenerator } from '../../../../main/infra/real/UuidPostIdGenerator';
import { PostgresDonationPostRepository } from '../../../../main/infra/real/PostgresDonationPostRepository';
import { PostgresFamilyInNeedPostRepository } from '../../../../main/infra/real/PostgresFamilyInNeedPostRepository';
import { PostgresDonationRequestPostRepository } from '../../../../main/infra/real/PostgresDonationRequestRepository';

import { EventBus } from '../../../../../_shared_/event-bus/EventBus';

import { PostsManagerFacade } from '../../../../main/PostsManagerFacade';
import { PostgresCallForHelpPostRepository } from '../../../../main/infra/real/PostgresCallForHelpPostRepository';
import { PostgresFavouritePostRepository } from '../../../../main/infra/real/PostgresFavouritePostRepository';

interface Dependencies {
  usersService: UsersService;
  wilayasService: WilayasService;
}

const aPostsManagerFacade = (dependencies?: Partial<Dependencies>) => {
  const mockUsersService = mock<UsersService>();
  const mockWilayasService = mock<WilayasService>();

  when(mockUsersService.isExist(anything())).thenResolve(true);
  when(mockUsersService.isActiveAssociation(anything())).thenResolve(true);

  when(mockWilayasService.isExist(anything())).thenResolve(true);

  return new PostsManagerFacade(
    dependencies?.usersService || instance(mockUsersService),
    dependencies?.wilayasService || instance(mockWilayasService),
    new FakePicturesUploader(),
    new UuidPostIdGenerator(),
    new PostgresDonationPostRepository(),
    new PostsEventPublisherImpl(EventBus.getInstance()),
    new PostgresFamilyInNeedPostRepository(),
    new PostgresDonationRequestPostRepository(),
    new PostgresCallForHelpPostRepository(),
    new PostgresFavouritePostRepository(),
  );
};

export { aPostsManagerFacade };
