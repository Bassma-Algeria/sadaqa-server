import request from 'supertest';
import { EndPoints } from '../../Endpoints';

const getNotifications = async (server: any, accessToken: string) => {
    const { body } = await request(server)
        .get(EndPoints.GET_NOTIFICATIONS)
        .set('Authorisation', accessToken);

    return body;
};

export { getNotifications };