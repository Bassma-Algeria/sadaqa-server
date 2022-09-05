import request from 'supertest';

import { EndPoints } from '../../../Endpoints';

const getDonationRequests = async (server: any) => {
    const {
        body: { list },
    } = await request(server).get(EndPoints.GET_DONATION_REQUESTS);

    return { list };
};

export { getDonationRequests };