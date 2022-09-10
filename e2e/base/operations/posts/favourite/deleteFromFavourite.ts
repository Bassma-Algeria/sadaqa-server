import request from 'supertest';

import { EndPoints } from '../../../Endpoints';

const deleteFromFavourite = async (
    server: any,
    postType: string,
    postId: string,
    token: string,
) => {
    await request(server)
        .delete(EndPoints.DELETE_FROM_FAVOURITE(postType, postId))
        .set('Authorization', token);
};

export { deleteFromFavourite };
