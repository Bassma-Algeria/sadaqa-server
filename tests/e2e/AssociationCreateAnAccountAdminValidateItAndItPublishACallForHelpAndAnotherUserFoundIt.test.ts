import { expect } from 'chai';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';

import { EndPoints } from './base/Endpoints';
import { cleanupDB, startNestTestingApp } from './base/SetupNestE2E';

describe('Association Create An Account Admin Validate It And It Publish a Call For Help And Another User Found It', () => {
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

    const { postId } = await publishCallForHelpPostByAssociationWithToken(accessToken);
    const { callsForHelp } = await getCallsForHelp();
    const { callForHelpPost } = await getCallForHelpById(postId);

    expect(callsForHelp).to.have.lengthOf(1);
    expect(callsForHelp[0]).to.deep.equal(callForHelpPost);
    expect(callsForHelp[0]).to.have.property('publisherId', associationId);
  });

  const registerRandomAssociation = async () => {
    const {
      body: { accessToken },
    } = await request(app.getHttpServer())
      .post(EndPoints.REGISTER_ASSOCIATION)
      .field(anAssociationRegistrationBody())
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

  const publishCallForHelpPostByAssociationWithToken = async (token: string) => {
    const {
      body: { postId },
    } = await request(app.getHttpServer())
      .post(EndPoints.NEW_CALL_FOR_HELP)
      .field(aNewCallForHelpCreationBody())
      .set('Authorisation', token);

    return { postId };
  };

  const getCallsForHelp = async () => {
    const {
      body: { callsForHelp },
    } = await request(app.getHttpServer()).get(EndPoints.GET_CALLS_FOR_HELP);

    return { callsForHelp };
  };

  const getCallForHelpById = async (id: string) => {
    const { body: callForHelpPost } = await request(app.getHttpServer()).get(
      EndPoints.GET_CALL_FOR_HELP(id),
    );

    return { callForHelpPost };
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

  const aNewCallForHelpCreationBody = () => ({
    title: faker.lorem.words(2),
    description: faker.lorem.words(10),
    wilayaNumber: faker.datatype.number({ min: 1, max: 58 }),
    ccp: faker.finance.creditCardNumber('##########'),
    ccpKey: faker.datatype.number({ min: 10, max: 99 }),
    baridiMobNumber: faker.finance.creditCardNumber('00799999############'),
  });
});
