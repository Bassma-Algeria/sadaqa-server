import { expect } from 'chai';
import { anything, instance, mock, when } from 'ts-mockito';

import { UserId } from '../../main/core/domain/UserId';
import { UsersServiceImpl } from '../../main/infra/real/UsersServiceImpl';

import { UsersManagerFacade } from '../../../UsersManager/main/UsersManagerFacade';

describe('UsersServiceImpl', () => {
    const EXISTING_USER_ID = 'some exsiting user id';
    const NON_EXISTING_USER_ID = 'some none exsiting user id';

    const usersManagerMock = mock<UsersManagerFacade>();
    const usersService = new UsersServiceImpl(instance(usersManagerMock));

    it('should return true when the user found', async () => {
        when(usersManagerMock.getRegularUserById(anything())).thenResolve();
        when(usersManagerMock.getAssociationById(anything())).thenReject();

        await expect(usersService.isExist(new UserId(EXISTING_USER_ID))).to.eventually.equal(true);
    });

    it('should return true when the association found', async () => {
        when(usersManagerMock.getRegularUserById(anything())).thenReject();
        when(usersManagerMock.getAssociationById(anything())).thenResolve();

        await expect(usersService.isExist(new UserId(EXISTING_USER_ID))).to.eventually.equal(true);
    });

    it('should return false when no user or association found', async () => {
        when(usersManagerMock.getRegularUserById(anything())).thenReject();
        when(usersManagerMock.getAssociationById(anything())).thenReject();

        await expect(usersService.isExist(new UserId(NON_EXISTING_USER_ID))).to.eventually.equal(
            false,
        );
    });

    it('should return false when the association is not found', async () => {
        when(usersManagerMock.getAssociationById(anything())).thenReject();

        await expect(
            usersService.isActiveAssociation(new UserId(NON_EXISTING_USER_ID)),
        ).to.eventually.equal(false);
    });

    it('should return false when the association is found but the account is not validated yet (not active)', async () => {
        when(usersManagerMock.getAssociationById(anything())).thenResolve({
            status: 'DISABLED',
        } as any);

        await expect(
            usersService.isActiveAssociation(new UserId(NON_EXISTING_USER_ID)),
        ).to.eventually.equal(false);
    });

    it('should return true when the association is found and the account is validated', async () => {
        when(usersManagerMock.getAssociationById(anything())).thenResolve({
            status: 'ENABLED',
        } as any);

        await expect(
            usersService.isActiveAssociation(new UserId(NON_EXISTING_USER_ID)),
        ).to.eventually.equal(true);
    });
});
