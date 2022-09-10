import request from 'supertest';
import { faker } from '@faker-js/faker';

import { EndPoints } from '../../../Endpoints';

const createFamilyInNeedPost = async (app: any, token: string, body?: any) => {
    const familyInNeedInfo = { ...aNewFamilyInNeedCreationBody(), ...body };

    const {
        body: { postId },
    } = await request(app)
        .post(EndPoints.NEW_FAMILY_IN_NEED)
        .field(familyInNeedInfo)
        .set('Authorization', token);

    return { postId, familyInNeedInfo };
};

const aNewFamilyInNeedCreationBody = () => ({
    title: faker.lorem.words(2),
    description: faker.lorem.words(10),
    wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
    ccp: faker.finance.creditCardNumber('##########'),
    ccpKey: faker.datatype.number({ min: 10, max: 99 }),
    baridiMobNumber: faker.finance.creditCardNumber('00799999############'),
});

export { createFamilyInNeedPost };
