import { faker } from '@faker-js/faker';

import { DeleteFromFavouriteUseCaseRequest } from '../../../../../main/core/usecases/DeleteFromFavouriteUseCase/DeleteFromFavouriteUseCaseRequest';

const aDeleteFavouritePostRequest = (
    request?: Partial<DeleteFromFavouriteUseCaseRequest>,
): DeleteFromFavouriteUseCaseRequest => {
    return {
        userId: faker.datatype.uuid(),
        postId: faker.datatype.uuid(),
        postType: 'donation',
        ...request,
    };
};

export { aDeleteFavouritePostRequest };
