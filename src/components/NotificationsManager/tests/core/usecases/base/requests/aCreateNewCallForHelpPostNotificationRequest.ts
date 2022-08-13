import { faker } from '@faker-js/faker';

import { CreateNewCallForHelpPostNotificationUseCaseRequest } from '../../../../../main/core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewCallForHelpPostNotificationUseCase/CreateNewCallForHelpPostNotificationUseCaseRequest';

const aCreateNewCallForHelpPostNotificationRequest = (
    request?: Partial<CreateNewCallForHelpPostNotificationUseCaseRequest>,
): CreateNewCallForHelpPostNotificationUseCaseRequest => {
    return {
        postId: faker.datatype.uuid(),
        publisherId: faker.datatype.uuid(),
        wilayaNumber: faker.datatype.number(),
        ...request,
    };
};

export { aCreateNewCallForHelpPostNotificationRequest }; 