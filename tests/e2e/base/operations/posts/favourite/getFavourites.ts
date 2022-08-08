import request from 'supertest';
import { EndPoints } from '../../../Endpoints';

const getFavourites = async (server: any, token: string) => {
    const { body } = await request(server)
        .get(EndPoints.GET_FAVOURITES)
        .set('Authorisation', token);

    return body;
};

export { getFavourites };