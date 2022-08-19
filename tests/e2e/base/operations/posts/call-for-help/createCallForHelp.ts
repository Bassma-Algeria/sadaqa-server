import request from 'supertest';
import { EndPoints } from '../../../Endpoints';
import { faker } from '@faker-js/faker';

const createCallForHelpPost = async (app: any, token: string, body?: any) => {
    const callForHelpInfo = { ...aNewCallForHelpCreationBody(), ...body };

    const {
        body: { postId },
    } = await request(app)
        .post(EndPoints.NEW_CALL_FOR_HELP)
        .field(callForHelpInfo)
        .set('Authorization', token);

    return { postId, callForHelpInfo };
};

const aNewCallForHelpCreationBody = () => ({
    title: faker.lorem.words(2),
    description: faker.lorem.words(10),
    wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
    ccp: faker.finance.creditCardNumber('##########'),
    ccpKey: faker.datatype.number({ min: 10, max: 99 }),
    baridiMobNumber: faker.finance.creditCardNumber('00799999############'),
});

export { createCallForHelpPost };
