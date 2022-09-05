import request from 'supertest';
import { Server } from 'https';

import { EndPoints } from '../../Endpoints';

const activateAssociationAccount = async (app: Server, id: string) => {
    await request(app)
        .put(EndPoints.ACTIVATE_ASSOCIATION(id))
        .set('Authorization', process.env.ADMIN_PASSWORD!);
};

export { activateAssociationAccount };
