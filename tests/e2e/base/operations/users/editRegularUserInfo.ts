import request from 'supertest';
import { EndPoints } from '../../Endpoints';

const editRegularUserInfo = async (server: any, info: any, token: string) => {
    await request(server)
        .put(EndPoints.EDIT_REGULAR_USER_INFO)
        .send(info)
        .set('Authorisation', token);
};

export { editRegularUserInfo };