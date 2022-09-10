import request from 'supertest';
import { Server } from 'https';
import { faker } from '@faker-js/faker';

import { EndPoints } from '../../Endpoints';

const registerRegularUser = async (app: Server) => {
    const userInfo = aUserRegistrationBody();
    const {
        body: { accessToken },
    } = await request(app).post(EndPoints.REGISTER_REGULAR_USER).send(userInfo);

    return { accessToken, userInfo };
};

const aUserRegistrationBody = () => {
    const password = faker.internet.password(10);

    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
        phoneNumber: faker.phone.number('06 ## ## ## ##'),
        email: faker.internet.email(),
        password,
        confirmPassword: password,
    };
};

export { registerRegularUser };