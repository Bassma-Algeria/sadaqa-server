import request from 'supertest';
import { EndPoints } from '../../Endpoints';

const editAssociationInfo = async (server: any, info: any, token: string) => {
    await request(server)
        .put(EndPoints.EDIT_ASSOCIATION_INFO)
        .send(info)
        .set('Authorization', token);
};

export { editAssociationInfo };
