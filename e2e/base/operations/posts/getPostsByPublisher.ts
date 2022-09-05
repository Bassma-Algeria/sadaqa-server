import request from 'supertest';

import { EndPoints } from '../../Endpoints';

const getPostsByPublisher = async (server: any, id: string) => {
    const { body } = await request(server).get(EndPoints.GET_POSTS_BY_PUBLISHER_ID(id));

    return body;
};

export { getPostsByPublisher };
