import request from 'supertest';

import { EndPoints } from '../../../Endpoints';

const getCallForHelps = async (app: any) => {
    const {
        body: { list },
    } = await request(app).get(EndPoints.GET_CALLS_FOR_HELP);

    return { list };
};

export { getCallForHelps };