import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anAssociationRegistrationRequest } from './base/requests/anAssociationRegistrationRequest';

import { ExceptionMessages } from '../../../main/core/domain/exceptions/ExceptionMessages';
import { NotFoundException } from '../../../main/core/domain/exceptions/NotFoundException';

describe('Get Association By Id', () => {
    const usersManager = aUsersManagerFacade();

    it('should register the association, and get it by id', async () => {
        const association = anAssociationRegistrationRequest();

        const { accountId } = await usersManager.registerAssociation(association);

        const associationFounded = await usersManager.getAssociationById({ accountId });

        expect(associationFounded.accountId).to.equal(accountId);
        expect(associationFounded.wilayaNumber).to.equal(association.wilayaNumber);
    });


    it('should throw a not found exception when no association found with the provided id', async () => {
        const NOT_EXISTING_ID = faker.datatype.uuid();

        await expect(usersManager.getAssociationById({ accountId: NOT_EXISTING_ID }))
            .to.eventually.be.rejectedWith(ExceptionMessages.ACCOUNT_NOT_FOUND)
            .and.to.be.an.instanceOf(NotFoundException);
    });
});
