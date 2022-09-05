import request from 'supertest';

import { EndPoints } from '../../Endpoints';

const login = async (server: any, credentials: { email: string; password: string }) => {
    const { body } = await request(server).post(EndPoints.LOGIN).send(credentials);

    return body;
};

export { login };
