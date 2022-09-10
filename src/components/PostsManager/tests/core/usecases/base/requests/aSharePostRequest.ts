import { faker } from '@faker-js/faker';

import { SharePostUseCaseRequest } from '../../../../../main/core/usecases/SharePostUseCase/SharePostUseCaseRequest';

const aSharePostRequest = (request: Partial<SharePostUseCaseRequest>): SharePostUseCaseRequest => {
    return {
        postId: faker.datatype.uuid(),
        userId: faker.datatype.uuid(),
        ...request,
    };
};

export { aSharePostRequest };
