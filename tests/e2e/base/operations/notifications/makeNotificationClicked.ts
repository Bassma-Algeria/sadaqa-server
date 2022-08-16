import request from 'supertest';

import { EndPoints } from '../../Endpoints';

const makeNotificationClicked = async (server: any, token: string, id: string) => {
    const { body } = await request(server)
        .put(EndPoints.MAKE_NOTIFICATION_CLICKED(id))
        .set('Authorisation', token);

    return body;
};

export { makeNotificationClicked };
