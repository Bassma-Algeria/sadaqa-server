import request from 'supertest';
import { faker } from '@faker-js/faker';

import { EndPoints } from '../../Endpoints';

const sendTextMessage = async (server: any, accessToken: string, body?: any) => {
    const message = aMessageBody(body);

    await request(server)
        .post(EndPoints.SEND_TEXT_MESSAGE)
        .send(message)
        .set('Authorisation', accessToken);

    return { message };
};

const aMessageBody = (values?: any) => ({
    receiverId: faker.datatype.uuid(),
    message: faker.lorem.words(10),
    ...values,
});

export { sendTextMessage };
