import request from 'supertest';

import { EndPoints } from '../../../Endpoints';

const toggleFamilyInNeedEnablingStatusFamilyInNeed = async (
    server: any,
    token: string,
    postId: string,
) => {
    await request(server)
        .put(EndPoints.TOGGLE_FAMILY_IN_NEED_ENABLING(postId))
        .set('Authorization', token);
};

export { toggleFamilyInNeedEnablingStatusFamilyInNeed };
