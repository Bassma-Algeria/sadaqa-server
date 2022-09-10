import request from 'supertest';

import { EndPoints } from '../../Endpoints';

const getRegularUserByToken = async (server: any, token: string) => {
    const { body: info } = await request(server)
        .get(EndPoints.GET_REGULAR_USER_BY_TOKEN)
        .set('Authorization', token);

    return { info };
};

export { getRegularUserByToken };
