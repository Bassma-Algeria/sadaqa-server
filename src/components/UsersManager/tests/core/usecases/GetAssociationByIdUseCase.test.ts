import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anAssociationRegistrationRequest } from './base/anAssociationRegistrationRequest';

import { UserNotFoundException } from '../../../main/core/domain/exceptions/UserNotFoundException';

describe('Get Association By Id', () => {
  const usersManager = aUsersManagerFacade();

  it('should register the association, and get it by id', async () => {
    const association = anAssociationRegistrationRequest();

    const { associationId } = await usersManager.registerAssociation(association);

    const associationFounded = await usersManager.getAssociationById({ associationId });

    expect(associationFounded.associationId).to.equal(associationId);
    expect(associationFounded.wilayaNumber).to.equal(association.wilayaNumber);
  });

  it('the association should be inactive when first created', async () => {
    const { associationId } = await usersManager.registerAssociation(
      anAssociationRegistrationRequest(),
    );

    const { active } = await usersManager.getAssociationById({ associationId });

    expect(active).to.equal(false);
  });

  it('should throw a not found exception when no association found with the provided id', async () => {
    const NOT_EXISTING_ID = faker.datatype.uuid();

    await expect(
      usersManager.getAssociationById({ associationId: NOT_EXISTING_ID }),
    ).to.eventually.be.rejectedWith(UserNotFoundException);
  });
});