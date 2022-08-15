import { CreateTextMessageNotificationUseCaseRequest } from '../../../../../main/core/usecases/CreateNotificationUseCases/CreateMessageNotificationUseCases/CreateTextMessageNotificationUseCase/CreateTextMessageNotificationUseCaseRequest';
import { faker } from '@faker-js/faker';

const aCreateTextMessageNotificationRequest = (
    request?: CreateTextMessageNotificationUseCaseRequest,
): CreateTextMessageNotificationUseCaseRequest => {
    return {
        messageId: faker.datatype.uuid(),
        senderId: faker.datatype.uuid(),
        receiverId: faker.datatype.uuid(),
        content: faker.lorem.words(4),
        ...request,
    };
};

export { aCreateTextMessageNotificationRequest };
