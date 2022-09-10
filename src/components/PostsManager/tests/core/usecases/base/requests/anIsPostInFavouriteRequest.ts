import { IsPostInFavouritesUseCaseRequest } from '../../../../../main/core/usecases/IsPostInFavouritesUseCase/IsPostInFavouritesUseCaseRequest';
import { faker } from '@faker-js/faker';

const anIsPostInFavouriteRequest = (
    request: Partial<IsPostInFavouritesUseCaseRequest>,
): IsPostInFavouritesUseCaseRequest => {
    return {
        userId: faker.datatype.uuid(),
        postId: faker.datatype.uuid(),
        postType: 'donation',
        ...request,
    };
};

export { anIsPostInFavouriteRequest };