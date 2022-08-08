import request from 'supertest';
import { faker } from '@faker-js/faker';

import { EndPoints } from '../../../Endpoints';

const createFamilyInNeedPost = async (app: any, token: string) => {
    const {
        body: { postId },
    } = await request(app)
        .post(EndPoints.NEW_FAMILY_IN_NEED)
        .field(aNewFamilyInNeedCreationBody() as any)
        .set('Authorisation', token);

    return { postId };
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