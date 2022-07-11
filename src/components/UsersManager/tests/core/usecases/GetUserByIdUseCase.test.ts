import { expect } from 'chai';
import { UserNotFoundException } from '../../../main/core/domain/exceptions/UserNotFoundException';
import { UsersManagerFacade } from '../../../main/UsersManagerFacade';
import { aUserRegistrationRequest } from './base/aUserRegistrationRequest';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';

describe('GetUserByIdUseCase', () => {
  let usersManager: UsersManagerFacade;

  beforeEach(() => {
    usersManager = aUsersManagerFacade();
  });

  it('should get a user by his id after registration', async () => {
    const registrationInfo = aUserRegistrationRequest();

    const { userId } = await usersManager.register(registrationInfo);
    const { firstName, lastName, wilayaNumber } = await usersManager.getUserById({ userId });

    expect(firstName).to.equal(registrationInfo.firstName.toLowerCase());
    expect(lastName).to.equal(registrationInfo.lastName.toLowerCase());
    expect(wilayaNumber).to.equal(registrationInfo.wilayaNumber);
  });

  it('should throw a not found exception when no user found with the provided id', async () => {
    const ID_NOT_EXIST = 'some random id';

    await expect(usersManager.getUserById({ userId: ID_NOT_EXIST })).to.eventually.be.rejectedWith(
      UserNotFoundException,
    );
  });
});
