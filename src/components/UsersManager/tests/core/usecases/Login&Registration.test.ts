import 'chai-as-promised';
import { expect } from 'chai';

import { aUserRegistrationRequest } from './base/aUserRegistrationRequest';
import { aUsersManagerFacade } from './base/aUsersManagerFacade';

import { UsersManagerFacade } from '../../../main/UsersManagerFacade';

import { WrongCredentialsException } from '../../../main/core/domain/exceptions/WrongCredentialsException';

describe('Login & Registration', () => {
  let usersManager: UsersManagerFacade;

  beforeEach(() => {
    usersManager = aUsersManagerFacade();
  });

  it('should be able to create a normal account, and login with the same credentials', async () => {
    const user = aUserRegistrationRequest();

    const { userId: idFromSignup } = await usersManager.register(user);
    const { userId: idFromLogin } = await usersManager.login({
      email: user.email,
      password: user.password,
    });

    expect(idFromLogin).to.equal(idFromSignup);
  });

  it('should not be able to login with wrong credentials', async () => {
    const user = aUserRegistrationRequest();
    const anotherUser = aUserRegistrationRequest();

    await usersManager.register(user);

    await expect(
      usersManager.login({ email: user.email, password: anotherUser.password }),
    ).to.be.rejectedWith(WrongCredentialsException);
  });

  it('should be able to login with the email uppercased and have some white spaces in left and right', async () => {
    const user = aUserRegistrationRequest();

    const { userId } = await usersManager.register(user);

    await expect(
      usersManager.login({ email: `  ${user.email.toUpperCase()}`, password: user.password }),
    ).to.eventually.deep.equal({ userId });
  });

  it('should be able to login with the password have some white spaces in left and right', async () => {
    const user = aUserRegistrationRequest();

    const { userId } = await usersManager.register(user);

    await expect(
      usersManager.login({ email: user.email, password: ` ${user.password}  ` }),
    ).to.eventually.deep.equal({ userId });
  });
});
