import { faker } from '@faker-js/faker';

import { SendTextMessageUseCaseRequest } from '../../../../../main/core/usecases/SendMessageUseCases/SendTextMessageUseCase/SendTextMessageUseCaseRequest';

const aSendTextMessageRequest = (
    request?: Partial<SendTextMessageUseCaseRequest>,
): SendTextMessageUseCaseRequest => {
    return {
        message: faker.lorem.text(),
        receiverId: faker.datatype.uuid(),
        senderId: faker.datatype.uuid(),
        ...request,
    };
};

export { aSendTextMessageRequest };