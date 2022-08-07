import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anAssociationRegistrationRequest } from './base/requests/anAssociationRegistrationRequest';

import { NotFoundException } from '../../../main/core/domain/exceptions/NotFoundException';
import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';

describe('Activate Association Account', () => {
    const usersManager = aUsersManagerFacade();

    it('should enable the association account', async () => {
        const { accountId } = await usersManager.registerAssociation(
            anAssociationRegistrationRequest(),
        );

        await usersManager.enableAssociationAccount({ accountId });
        const { status } = await usersManager.getAssociationById({ accountId });

        expect(status).to.equal('ENABLED');
    });

    it('should throw when the account does not exist', async () => {
        const NONE_EXISTING_ACCOUNT = faker.datatype.uuid();

        await expect(usersManager.enableAssociationAccount({ accountId: NONE_EXISTING_ACCOUNT }))
            .to.eventually.be.rejectedWith(ExceptionMessages.ACCOUNT_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });
});
