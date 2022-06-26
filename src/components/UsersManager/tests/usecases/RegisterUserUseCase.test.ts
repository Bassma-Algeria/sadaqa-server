import { expect } from 'chai';
import { spy } from 'sinon';

import { getUserRegistrationInfo } from '../base/data/user';

import { UsersManagerFacade } from '../../main/UsersManagerFacade';

import { FakeUserIdGenerator } from '../../main/infra/fake/FakeUserIdGenerator';
import { InMemoryUsersRepository } from '../../main/infra/fake/InMemoryUsersRepository';

import { ShortNameException } from '../../main/core/domain/exceptions/ShortNameException';
import { InvalidEmailException } from '../../main/core/domain/exceptions/InvalidEmailException';
import { ShortPasswordException } from '../../main/core/domain/exceptions/ShortPasswordException';
import { InvalidPhoneNumberException } from '../../main/core/domain/exceptions/InvalidPhoneNumberException';
import { ConfirmPasswordMissMatchException } from '../../main/core/usecases/RegisterUserUseCase/exeptions/ConfirmPasswordMissMatchException';
import { Email } from '../../main/core/domain/Email';
import { Password } from '../../main/core/domain/Password';
import { FakePasswordEncryptor } from '../../main/infra/fake/FakePasswordEncryptor';
import { EmailAlreadyUsedException } from '../../main/core/usecases/RegisterUserUseCase/exeptions/EmailAlreadyUsedException';
import { PhoneNumberAlreadyUsedException } from '../../main/core/usecases/RegisterUserUseCase/exeptions/PhoneNumberAlreadyUsedException';

describe('Register user Use case', () => {
  const usersRepository = new InMemoryUsersRepository();
  const userIdGenerator = new FakeUserIdGenerator();
  const passwordEncryptor = new FakePasswordEncryptor();

  const usersManager = new UsersManagerFacade(usersRepository, userIdGenerator, passwordEncryptor);

  it('email should be valid', async () => {
    const user = getUserRegistrationInfo({ email: 'invalid email!' });

    await expect(usersManager.register(user)).to.eventually.be.rejectedWith(InvalidEmailException);
  });

  it('password should be more than 6 characters', async () => {
    const user = getUserRegistrationInfo({ password: 'short' });

    await expect(usersManager.register(user)).to.eventually.be.rejectedWith(ShortPasswordException);
  });

  it('first name and last name should have more than 3 characters', async () => {
    const user = getUserRegistrationInfo({ firstName: 'sh', lastName: 'sdf' });

    await expect(usersManager.register(user)).to.eventually.be.rejectedWith(ShortNameException);
  });

  it.skip('wilaya number should be valid', async () => {
    const user = getUserRegistrationInfo({ wilayaNumber: 100 });

    // await expect(usersManager.register(user)).to.eventually.be.rejectedWith(
    //   InvalidWilayaNumberException,
    // );
  });

  it('phone number should be valid', async () => {
    const user = getUserRegistrationInfo({ phoneNumber: '05 182 1' });
    const anotherUser = getUserRegistrationInfo({ phoneNumber: '03 99 83 12 38' });

    await expect(usersManager.register(user)).to.eventually.be.rejectedWith(
      InvalidPhoneNumberException,
    );
    await expect(usersManager.register(anotherUser)).to.eventually.be.rejectedWith(
      InvalidPhoneNumberException,
    );
  });

  it('confirm password should equal the password', async () => {
    const user = getUserRegistrationInfo({ confirmPassword: 'some other password' });

    await expect(usersManager.register(user)).to.eventually.be.rejectedWith(
      ConfirmPasswordMissMatchException,
    );
  });

  it('should hash the password before saving it', async () => {
    const encryptMethod = spy(passwordEncryptor, 'encrypt');
    const user = getUserRegistrationInfo();

    await usersManager.register(user);

    const savedUser = await usersRepository.findByEmail(new Email(user.email));

    expect(savedUser?.password.equals(new Password(user.password))).to.equal(false);
    expect(encryptMethod.calledOnce).to.equal(true);
  });

  it('should not have two users with the same email', async () => {
    const user = getUserRegistrationInfo();
    const anotherUser = getUserRegistrationInfo({ email: user.email });

    await usersManager.register(user);
    await expect(usersManager.register(anotherUser)).to.eventually.be.rejectedWith(
      EmailAlreadyUsedException,
    );
  });

  it('should not have two users with the same phone number', async () => {
    const user = getUserRegistrationInfo();
    const anotherUser = getUserRegistrationInfo({ phoneNumber: user.phoneNumber });

    await usersManager.register(user);
    await expect(usersManager.register(anotherUser)).to.eventually.be.rejectedWith(
      PhoneNumberAlreadyUsedException,
    );
  });
});
