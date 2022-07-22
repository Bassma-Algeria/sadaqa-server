import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anAssociationRegistrationRequest } from './base/anAssociationRegistrationRequest';

import { UserNotFoundException } from '../../../main/core/domain/exceptions/UserNotFoundException';

describe('ActivateAssociationAccountUseCase', () => {
  const usersManager = aUsersManagerFacade();

  it('should activate the association account', async () => {
    const { associationId } = await usersManager.registerAssociation(
      anAssociationRegistrationRequest(),
    );

    await usersManager.activateAssociationAccount({ associationId });
    const { active } = await usersManager.getAssociationById({ associationId });

    expect(active).to.equal(true);
  });

  it('should throw when the account does not exist', async () => {
    const NONE_EXISTING_ACCOUNT = faker.datatype.uuid();

    await expect(
      usersManager.activateAssociationAccount({ associationId: NONE_EXISTING_ACCOUNT }),
    ).to.eventually.be.rejectedWith(UserNotFoundException);
  });
});
