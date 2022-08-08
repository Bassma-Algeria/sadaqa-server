import request from 'supertest';
import { EndPoints } from '../../../Endpoints';

const getDonationRequestById = async (server: any, id: string) => {
    const { body } = await request(server).get(EndPoints.GET_DONATION_REQUEST(id));

    return { post: body };
};

export { getDonationRequestById };