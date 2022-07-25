import { faker } from '@faker-js/faker';

import { AddToFavouritePostsUseCaseRequest } from '../../../../../main/core/usecases/FavouritePosts/AddToFavouritePostsUseCase/AddToFavouritePostsUseCaseRequest';

const anAddToFavouriteRequest = (
  request?: Partial<AddToFavouritePostsUseCaseRequest>,
): AddToFavouritePostsUseCaseRequest => {
  return {
    userId: faker.datatype.uuid(),
    postId: faker.datatype.uuid(),
    postType: 'donation',
    ...request,
  };
};

export { anAddToFavouriteRequest };
