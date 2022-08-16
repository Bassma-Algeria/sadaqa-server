import request from 'supertest';

import { EndPoints } from '../../Endpoints';

const getTotalUnreadNotifications = async (server: any, token: string) => {
    const { body } = await request(server)
        .get(EndPoints.GET_TOTAL_UNREAD_NOTIFICATION)
        .set('Authorisation', token);

    return body;
};

export { getTotalUnreadNotifications };
