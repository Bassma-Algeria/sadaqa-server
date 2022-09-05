import request from 'supertest';
import { Server } from 'https';
import { faker } from '@faker-js/faker';

import { EndPoints } from '../../Endpoints';

const registerAssociation = async (app: Server) => {
    const associationInfo = anAssociationRegistrationBody();

    const {
        body: { accessToken },
    } = await request(app)
        .post(EndPoints.REGISTER_ASSOCIATION)
        .field(associationInfo)
        .attach('associationDocs', Buffer.alloc(10), 'doc.jpg');

    return { accessToken, associationInfo };
};

const anAssociationRegistrationBody = () => {
    const password = faker.internet.password();

    return {
        associationName: faker.internet.userName(),
        wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
        phoneNumber: faker.phone.number('06 ## ## ## ##'),
        email: faker.internet.email(),
        password,
        confirmPassword: password,
    };
};

export { registerAssociation, anAssociationRegistrationBody };
