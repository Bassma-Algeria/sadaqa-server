import request from 'supertest';

import { EndPoints } from '../../Endpoints';

const getAssociationByToken = async (server: any, token: string) => {
    const { body: info } = await request(server)
        .get(EndPoints.GET_ASSOCIATION_BY_TOKEN)
        .set('Authorisation', token);

    return { info };
};

export { getAssociationByToken };