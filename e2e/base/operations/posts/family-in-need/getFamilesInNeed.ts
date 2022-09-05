import request from 'supertest';

import { EndPoints } from '../../../Endpoints';

const getFamiliesInNeed = async (app: any) => {
    const {
        body: { list },
    } = await request(app).get(EndPoints.GET_FAMILIES_IN_NEED);

    return { list };
};

export { getFamiliesInNeed };
