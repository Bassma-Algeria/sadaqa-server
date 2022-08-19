import request from 'supertest';

import { EndPoints } from '../../Endpoints';

const makeNotificationRead = async (server: any, token: string, id: string) => {
    const { body } = await request(server)
        .put(EndPoints.MAKE_NOTIFICATION_READ(id))
        .set('Authorization', token);

    return body;
};

export { makeNotificationRead };
