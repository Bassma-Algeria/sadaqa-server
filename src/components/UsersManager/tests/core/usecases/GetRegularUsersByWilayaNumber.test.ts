import { expect } from 'chai';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anAssociationRegistrationRequest } from './base/requests/anAssociationRegistrationRequest';

describe('Get Associations By Wilaya numbers', () => {
    const usersManager = aUsersManagerFacade();

    it('given a get association by wilaya request, when no associations found in that wilaya, then return an emtpy list', async () => {
        const SOME_NUMBER = 39;

        const list = await usersManager.getAssociationsInWilaya({ wilayaNumber: SOME_NUMBER });

        expect(list).to.have.lengthOf(0);
    });

    it('given a get association by wilaya request, when there is an association in that wilaya but it is disabled, then return en empty list', async () => {
        const association = anAssociationRegistrationRequest();
        await usersManager.registerAssociation(association);

        const list = await usersManager.getAssociationsInWilaya({
            wilayaNumber: association.wilayaNumber,
        });

        expect(list).to.have.lengthOf(0);
    });

    it('given a get association by wilaya request, when there is an enabled association in that wilaya, then return it', async () => {
        const association = anAssociationRegistrationRequest();
        const { accountId } = await usersManager.registerAssociation(association);

        await usersManager.enableAssociationAccount({ accountId });

        const list = await usersManager.getAssociationsInWilaya({
            wilayaNumber: association.wilayaNumber,
        });

        expect(list).to.have.lengthOf(1);
    });

    it('given a get association by wilaya request, when there more than one enabled association in that wilaya, then return all of them', async () => {
        const firstAssociation = anAssociationRegistrationRequest();
        const secondAssociation = anAssociationRegistrationRequest({
            wilayaNumber: firstAssociation.wilayaNumber,
        });
        const { accountId: account1 } = await usersManager.registerAssociation(firstAssociation);
        const { accountId: account2 } = await usersManager.registerAssociation(secondAssociation);

        await usersManager.enableAssociationAccount({ accountId: account1 });
        await usersManager.enableAssociationAccount({ accountId: account2 });

        const list = await usersManager.getAssociationsInWilaya({
            wilayaNumber: firstAssociation.wilayaNumber,
        });

        expect(list).to.have.lengthOf(2);
    });
});