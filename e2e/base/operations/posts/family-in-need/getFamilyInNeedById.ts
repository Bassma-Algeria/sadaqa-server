import request from 'supertest';
import { EndPoints } from '../../../Endpoints';

const getFamilyInNeedById = async (app: any, id: string) => {
    const { body: familyInNeedPost } = await request(app).get(EndPoints.GET_FAMILY_IN_NEED(id));

    return { familyInNeedPost };
};

export { getFamilyInNeedById };