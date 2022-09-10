import request from 'supertest';

import { EndPoints } from '../../../Endpoints';

const getCallForHelpById = async (app: any, id: string) => {
    const { body: callForHelpPost } = await request(app).get(EndPoints.GET_CALL_FOR_HELP(id));

    return { callForHelpPost };
};

export { getCallForHelpById };