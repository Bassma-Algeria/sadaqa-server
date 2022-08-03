import { expect } from 'chai';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';

import { EndPoints } from './base/Endpoints';
import { cleanupDB, startNestTestingApp } from './base/SetupNestE2E';

describe('Association Create An Account Admin Validate It And It Publish a Family in Need And Another User Found It', () => {
    let app: INestApplication;

    before(async () => {
        app = await startNestTestingApp();
    });

    beforeEach(async () => {
        await cleanupDB();
    });

    after(async () => {
        await app.close();
    });

    it('should pass with no problem', async () => {
        const { accessToken } = await registerRandomAssociation();
        const { associationId } = await getAssociationWithToken(accessToken);

        await activateAssociationAccount(associationId);

        const { postId } = await publishFamilyInNeedPostByAssociationWithToken(accessToken);
        const { list } = await getFamiliesInNeed();
        const { familyInNeedPost } = await getFamilyInNeedPost(postId);

        expect(list).to.have.lengthOf(1);
        expect(list[0]).to.deep.equal(familyInNeedPost);
        expect(list[0]).to.have.property('publisherId', associationId);
    });

    const registerRandomAssociation = async () => {
        const {
            body: { accessToken },
        } = await request(app.getHttpServer())
            .post(EndPoints.REGISTER_ASSOCIATION)
            .field(anAssociationRegistrationBody() as any)
            .attach('associationDocs', Buffer.alloc(10), 'doc.jpg');

        return { accessToken };
    };

    const getAssociationWithToken = async (accessToken: string) => {
        const {
            body: { associationId },
        } = await request(app.getHttpServer())
            .get(EndPoints.GET_AUTHENTICATED_ASSOCIATION)
            .set('Authorisation', accessToken);

        return { associationId };
    };

    const activateAssociationAccount = async (id: string) => {
        await request(app.getHttpServer())
            .put(EndPoints.ACTIVATE_ASSOCIATION(id))
            .set('Authorisation', process.env.ADMIN_PASSWORD!);
    };

    const publishFamilyInNeedPostByAssociationWithToken = async (token: string) => {
        const {
            body: { postId },
        } = await request(app.getHttpServer())
            .post(EndPoints.NEW_FAMILY_IN_NEED)
            .field(aNewFamilyInNeedCreationBody() as any)
            .set('Authorisation', token);

        return { postId };
    };

    const getFamiliesInNeed = async () => {
        const {
            body: { list },
        } = await request(app.getHttpServer()).get(EndPoints.GET_FAMILIES_IN_NEED);

        return { list };
    };

    const getFamilyInNeedPost = async (id: string) => {
        const { body: familyInNeedPost } = await request(app.getHttpServer()).get(
            EndPoints.GET_FAMILY_IN_NEED(id),
        );

        return { familyInNeedPost };
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
            associationDocs: [] as any[],
        };
    };

    const aNewFamilyInNeedCreationBody = () => ({
        title: faker.lorem.words(2),
        description: faker.lorem.words(10),
        wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
        ccp: faker.finance.creditCardNumber('##########'),
        ccpKey: faker.datatype.number({ min: 10, max: 99 }),
        baridiMobNumber: faker.finance.creditCardNumber('00799999############'),
    });
});
