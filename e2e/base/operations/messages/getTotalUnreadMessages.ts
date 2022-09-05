import request from 'supertest';

import { EndPoints } from '../../Endpoints';

const getTotalUnreadMessages = async (server: any, token: string) => {
    const { body } = await request(server)
        .get(EndPoints.GET_TOTAL_UNREAD_MESSAGES)
        .set('Authorization', token);

    return body;
};

export { getTotalUnreadMessages };
