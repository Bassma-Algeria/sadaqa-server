import 'chai-as-promised';
import { expect } from 'chai';

import { getUserRegistrationInfo } from '../base/data/user';

import { UsersManagerFacade } from '../../main/UsersManagerFacade';

import { WrongCredentialsException } from '../../main/core/domain/exceptions/WrongCredentialsException';

import { FakeUserIdGenerator } from '../../main/infra/fake/FakeUserIdGenerator';
import { FakePasswordEncryptor } from '../../main/infra/fake/FakePasswordEncryptor';
import { InMemoryUsersRepository } from '../../main/infra/fake/InMemoryUsersRepository';

describe('Login & Registration', () => {
  const usersManager = new UsersManagerFacade(
    new InMemoryUsersRepository(),
    new FakeUserIdGenerator(),
    new FakePasswordEncryptor(),
  );

  it('should be able to create a normal account, and login with the same credentials', async () => {
    const user = getUserRegistrationInfo();

    const { userId: idFromSignup } = await usersManager.register(user);
    const { userId: idFromLogin } = await usersManager.login({
      email: user.email,
      password: user.password,
    });

    expect(idFromLogin).to.equal(idFromSignup);
  });

  it('should not be able to login with wrong credentials', async () => {
    const user = getUserRegistrationInfo();
    const anotherUser = getUserRegistrationInfo();

    await usersManager.register(user);

    await expect(
      usersManager.login({ email: user.email, password: anotherUser.password }),
    ).to.be.rejectedWith(WrongCredentialsException);
  });

  it('each user should have a unique id', async () => {
    const user = getUserRegistrationInfo();
    const anotherUser = getUserRegistrationInfo();

    const { userId: firstId } = await usersManager.register(user);
    const { userId: secondId } = await usersManager.register(anotherUser);

    expect(firstId).to.not.equal(secondId);
  });
});
