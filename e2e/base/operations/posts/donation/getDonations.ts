import request from 'supertest';

import { EndPoints } from '../../../Endpoints';

const getDonations = async (server: any) => {
    const {
        body: { list },
    } = await request(server).get(EndPoints.GET_DONATIONS);

    return { list };
};

export { getDonations };