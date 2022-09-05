import request from 'supertest';

import { EndPoints } from '../../Endpoints';

const getPostsSummary = async (server: any, token: string) => {
    const { body } = await request(server)
        .get(EndPoints.GET_POSTS_SUMMARY)
        .set('Authorization', token);

    return body;
};

export { getPostsSummary };
