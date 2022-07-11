import { expect } from 'chai';
import { spy, stub } from 'sinon';

import { aUserRegistrationRequest } from './base/aUserRegistrationRequest';
import { aUsersManagerFacade } from './base/aUsersManagerFacade';

import { UsersManagerFacade } from '../../../main/UsersManagerFacade';

import { FakeWilayasService } from '../../../main/infra/fake/FakeWilayasService';
import { FakePasswordEncryptor } from '../../../main/infra/fake/FakePasswordEncryptor';
import { InMemoryUserAccountRepository } from '../../../main/infra/fake/InMemoryUserAccountRepository';

import { Email } from '../../../main/core/domain/Email';
import { Password } from '../../../main/core/domain/Password';

import { ShortNameException } from '../../../main/core/domain/exceptions/ShortNameException';
import { InvalidEmailException } from '../../../main/core/domain/exceptions/InvalidEmailException';
import { ShortPasswordException } from '../../../main/core/domain/exceptions/ShortPasswordException';
import { MultiLanguagesException } from '../../../main/core/domain/exceptions/MultiLanguagesException';
import { InvalidPhoneNumberException } from '../../../main/core/domain/exceptions/InvalidPhoneNumberException';

import { EmailAlreadyUsedException } from '../../../main/core/usecases/RegisterUserUseCase/exeptions/EmailAlreadyUsedException';
import { InvalidWilayaNumberException } from '../../../main/core/usecases/RegisterUserUseCase/exeptions/InvalidWilayaNumberException';
import { PhoneNumberAlreadyUsedException } from '../../../main/core/usecases/RegisterUserUseCase/exeptions/PhoneNumberAlreadyUsedException';
import { ConfirmPasswordMissMatchException } from '../../../main/core/usecases/RegisterUserUseCase/exeptions/ConfirmPasswordMissMatchException';

describe('Register user Use case', () => {
  const wilayasService = new FakeWilayasService();
  const passwordEncryptor = new FakePasswordEncryptor();
  const userAccountRepository = new InMemoryUserAccountRepository();

  let usersManager: UsersManagerFacade;

  beforeEach(() => {
    usersManager = aUsersManagerFacade({
      wilayasService,
      userAccountRepository,
      passwordEncryptor,
    });
  });

  it('email should be valid', async () => {
    const user = aUserRegistrationRequest({ email: 'invalid email!' });

    await expect(usersManager.register(user))
      .to.eventually.be.rejectedWith(InvalidEmailException)
      .instanceOf(MultiLanguagesException);
  });

  it('password should be more than 6 characters', async () => {
    const user = aUserRegistrationRequest({ password: 'short' });

    await expect(usersManager.register(user))
      .to.eventually.be.rejectedWith(ShortPasswordException)
      .instanceOf(MultiLanguagesException);
  });

  it('first name and last name should have more than 3 characters', async () => {
    const user = aUserRegistrationRequest({ firstName: 'sh', lastName: 'sdf' });

    await expect(usersManager.register(user))
      .to.eventually.be.rejectedWith(ShortNameException)
      .instanceOf(MultiLanguagesException);
  });

  it('wilaya number should be valid', async () => {
    const isExistMock = stub(wilayasService, 'isExist').callsFake(() => Promise.resolve(false));

    const user = aUserRegistrationRequest({ wilayaNumber: 100 });

    await expect(usersManager.register(user)).to.eventually.be.rejectedWith(
      InvalidWilayaNumberException,
    );

    isExistMock.restore();
  });

  it('phone number should be valid', async () => {
    const user = aUserRegistrationRequest({ phoneNumber: '05 182 1' });
    const anotherUser = aUserRegistrationRequest({ phoneNumber: '03 99 83 12 38' });

    await expect(usersManager.register(user)).to.eventually.be.rejectedWith(
      InvalidPhoneNumberException,
    );
    await expect(usersManager.register(anotherUser))
      .to.eventually.be.rejectedWith(InvalidPhoneNumberException)
      .instanceOf(MultiLanguagesException);
  });

  it('confirm password should equal the password', async () => {
    const user = aUserRegistrationRequest({ confirmPassword: 'some other password' });

    await expect(usersManager.register(user))
      .to.eventually.be.rejectedWith(ConfirmPasswordMissMatchException)
      .instanceOf(MultiLanguagesException);
  });

  it('should hash the password before saving it', async () => {
    const encryptMethod = spy(passwordEncryptor, 'encrypt');
    const user = aUserRegistrationRequest();

    await usersManager.register(user);

    const savedUser = await userAccountRepository.findByEmail(new Email(user.email));

    expect(savedUser?.password.equals(new Password(user.password))).to.equal(false);
    expect(encryptMethod.calledOnce).to.equal(true);
  });

  it('should not have two users with the same email', async () => {
    const user = aUserRegistrationRequest();
    const anotherUser = aUserRegistrationRequest({ email: user.email });

    await usersManager.register(user);
    await expect(usersManager.register(anotherUser))
      .to.eventually.be.rejectedWith(EmailAlreadyUsedException)
      .instanceOf(MultiLanguagesException);
  });

  it('should not have two users with the same phone number', async () => {
    const user = aUserRegistrationRequest();
    const anotherUser = aUserRegistrationRequest({ phoneNumber: user.phoneNumber });

    await usersManager.register(user);
    await expect(usersManager.register(anotherUser))
      .to.eventually.be.rejectedWith(PhoneNumberAlreadyUsedException)
      .instanceOf(MultiLanguagesException);
  });

  it('each user should have a unique id', async () => {
    const user = aUserRegistrationRequest();
    const anotherUser = aUserRegistrationRequest();

    const { userId: firstId } = await usersManager.register(user);
    const { userId: secondId } = await usersManager.register(anotherUser);

    expect(firstId).to.not.equal(secondId);
  });
});
