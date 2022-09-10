import { faker } from '@faker-js/faker';

import { CreateNewDonationPostNotificationUseCaseRequest } from '../../../../../main/core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewDonationPostNotificationUseCase/CreateNewDonationPostNotificationUseCaseRequest';

const aCreateNewDonationPostNotificationRequest = (
    request?: Partial<CreateNewDonationPostNotificationUseCaseRequest>,
): CreateNewDonationPostNotificationUseCaseRequest => {
    return {
        postId: faker.datatype.uuid(),
        publisherId: faker.datatype.uuid(),
        wilayaNumber: faker.datatype.number(),
        title: faker.lorem.words(4),
        ...request,
    };
};

export { aCreateNewDonationPostNotificationRequest };