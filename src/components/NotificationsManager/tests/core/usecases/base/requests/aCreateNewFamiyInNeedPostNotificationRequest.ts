import { faker } from '@faker-js/faker';

import { CreateNewFamilyInNeedPostNotificationUseCaseRequest } from '../../../../../main/core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewFamilyInNeedPostNotificationUseCase/CreateNewFamilyInNeedPostNotificationUseCaseRequest';

const aCreateNewFamilyInNeedPostNotificationRequest = (
    request?: Partial<CreateNewFamilyInNeedPostNotificationUseCaseRequest>,
): CreateNewFamilyInNeedPostNotificationUseCaseRequest => {
    return {
        postId: faker.datatype.uuid(),
        publisherId: faker.datatype.uuid(),
        wilayaNumber: faker.datatype.number(),
        ...request,
    };
};

export { aCreateNewFamilyInNeedPostNotificationRequest };