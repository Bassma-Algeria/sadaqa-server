import { expect } from 'chai';
import { anything, instance, mock, verify } from 'ts-mockito';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { aRegularUserRegistrationRequest } from './base/aRegularUserRegistrationRequest';
import { anAssociationRegistrationRequest } from './base/anAssociationRegistrationRequest';

import { UsersManagerFacade } from '../../../main/UsersManagerFacade';

import { UsersEventBus } from '../../../main/core/domain/services/UsersEventBus';

import { MultiLanguagesException } from '../../../main/core/domain/exceptions/MultiLanguagesException';
import { WrongCredentialsException } from '../../../main/core/domain/exceptions/WrongCredentialsException';
import { EmailAlreadyUsedException } from '../../../main/core/domain/exceptions/EmailAlreadyUsedException';

describe('Login & Registration', () => {
  const usersEventBusMock = mock<UsersEventBus>();

  let usersManager: UsersManagerFacade;

  beforeEach(() => {
    usersManager = aUsersManagerFacade({ usersEventBus: instance(usersEventBusMock) });
  });

  it('should be able to create a regular user account, and login with the same credentials', async () => {
    const user = aRegularUserRegistrationRequest();

    const { regularUserId: idFromSignup } = await usersManager.registerRegularUser(user);
    const { userId: idFromLogin } = await usersManager.login({
      email: user.email,
      password: user.password,
    });

    expect(idFromLogin).to.equal(idFromSignup);
  });

  it('should be able to create an association account, and login with the same credentials', async () => {
    const association = anAssociationRegistrationRequest();

    const { associationId: idFromRegistration } = await usersManager.registerAssociation(
      association,
    );
    const { userId: idFromLogin } = await usersManager.login({
      email: association.email,
      password: association.password,
    });

    expect(idFromRegistration).to.equal(idFromLogin);
  });

  it('should not have an association account with the same email as a user account', async () => {
    const association = anAssociationRegistrationRequest();
    await usersManager.registerAssociation(association);

    const regularUser = aRegularUserRegistrationRequest({ email: association.email });

    await expect(usersManager.registerRegularUser(regularUser))
      .to.eventually.be.rejectedWith(EmailAlreadyUsedException)
      .and.be.an.instanceOf(MultiLanguagesException);
  });

  it('should not have a user account with the same email as an association account', async () => {
    const regularUser = aRegularUserRegistrationRequest();
    await usersManager.registerRegularUser(regularUser);

    const association = anAssociationRegistrationRequest({ email: regularUser.email });

    await expect(usersManager.registerAssociation(association))
      .to.eventually.be.rejectedWith(EmailAlreadyUsedException)
      .and.be.an.instanceOf(MultiLanguagesException);
  });

  it('should not be able to login with wrong credentials', async () => {
    const user = await registerRandomUser();
    const anotherUser = await registerRandomUser();

    await expect(usersManager.login({ email: user.email, password: anotherUser.password }))
      .to.eventually.be.rejectedWith(WrongCredentialsException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('should be able to login with the email uppercased and have some white spaces in left and right', async () => {
    const { userId, email, password } = await registerRandomUser();

    await expect(
      usersManager.login({ email: `  ${email.toUpperCase()}`, password }),
    ).to.eventually.deep.equal({ userId });
  });

  it('should be able to login with the password have some white spaces in left and right', async () => {
    const { userId, email, password } = await registerRandomUser();

    await expect(
      usersManager.login({ email, password: ` ${password}  ` }),
    ).to.eventually.deep.equal({ userId });
  });

  it('should publish a user login event when login successfully', async () => {
    const { email, password } = await registerRandomUser();
    await usersManager.login({ email, password });

    verify(usersEventBusMock.publishUserLoginEvent(anything())).called();
  });

  const registerRandomUser = async () => {
    const regularUser = await registerRandomRegularUser();
    const association = await registerRandomAssociation();

    const randomNumber = Math.random();

    const userId = randomNumber > 0.5 ? regularUser.regularUserId : association.associationId;
    const email = randomNumber > 0.5 ? regularUser.email : association.email;
    const password = randomNumber > 0.5 ? regularUser.password : association.password;

    return { userId, email, password };
  };

  const registerRandomAssociation = async () => {
    const association = anAssociationRegistrationRequest();
    const { associationId } = await usersManager.registerAssociation(association);

    return { associationId, email: association.email, password: association.password };
  };

  const registerRandomRegularUser = async () => {
    const user = aRegularUserRegistrationRequest();
    const { regularUserId } = await usersManager.registerRegularUser(user);

    return { regularUserId, email: user.email, password: user.password };
  };
});
