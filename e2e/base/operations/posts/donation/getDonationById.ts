import request from 'supertest';

import { EndPoints } from '../../../Endpoints';

const getDonationById = async (server: any, id: string) => {
    const { body } = await request(server).get(EndPoints.GET_DONATION(id));

    return { post: body };
};

export { getDonationById };