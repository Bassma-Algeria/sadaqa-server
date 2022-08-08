import request from 'supertest';
import { EndPoints } from '../../../Endpoints';

const addToFavourite = async (server: any, postType: string, postId: string, token: string) => {
    await request(server)
        .post(EndPoints.ADD_TO_FAVOURITE)
        .send({ postType, postId })
        .set('Authorisation', token);
};

export { addToFavourite };