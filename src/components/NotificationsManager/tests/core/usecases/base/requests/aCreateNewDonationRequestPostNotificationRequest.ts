import { faker } from '@faker-js/faker';
import { CreateNewDonationRequestPostNotificationUseCaseRequest } from '../../../../../main/core/usecases/CreateNotificationUseCases/CreatePostNotificationsUseCases/CreateNewDonationRequestPostNotificationUseCase/CreateNewDonationRequestPostNotificationUseCaseRequest';

const aCreateNewDonationRequestPostNotificationRequest = (
    request?: Partial<CreateNewDonationRequestPostNotificationUseCaseRequest>,
): CreateNewDonationRequestPostNotificationUseCaseRequest => {
    return {
        postId: faker.datatype.uuid(),
        publisherId: faker.datatype.uuid(),
        wilayaNumber: faker.datatype.number(),
        title: faker.lorem.words(4),
        ...request,
    };
};

export { aCreateNewDonationRequestPostNotificationRequest };