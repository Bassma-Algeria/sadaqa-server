import { faker } from '@faker-js/faker';

import { DeleteFavouritePostUseCaseRequest } from '../../../../../main/core/usecases/FavouritePosts/DeleteFavouritePostUseCase/DeleteFavouritePostUseCaseRequest';

const aDeleteFavouritePostRequest = (
  request?: Partial<DeleteFavouritePostUseCaseRequest>,
): DeleteFavouritePostUseCaseRequest => {
  return {
    userId: faker.datatype.uuid(),
    postId: faker.datatype.uuid(),
    postType: 'donation',
    ...request,
  };
};

export { aDeleteFavouritePostRequest };
