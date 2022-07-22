import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { anything, instance, mock, verify } from 'ts-mockito';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { aRegularUserRegistrationRequest } from './base/aRegularUserRegistrationRequest';

import { UsersManagerFacade } from '../../../main/UsersManagerFacade';

import { UsersEventBus } from '../../../main/core/domain/services/UsersEventBus';

import { FakeWilayasService } from '../../../main/infra/fake/FakeWilayasService';
import { FakePasswordEncryptor } from '../../../main/infra/fake/FakePasswordEncryptor';

import { ShortNameException } from '../../../main/core/domain/exceptions/ShortNameException';
import { InvalidEmailException } from '../../../main/core/domain/exceptions/InvalidEmailException';
import { ShortPasswordException } from '../../../main/core/domain/exceptions/ShortPasswordException';
import { MultiLanguagesException } from '../../../main/core/domain/exceptions/MultiLanguagesException';
import { InvalidPhoneNumberException } from '../../../main/core/domain/exceptions/InvalidPhoneNumberException';

import { EmailAlreadyUsedException } from '../../../main/core/domain/exceptions/EmailAlreadyUsedException';
import { InvalidWilayaNumberException } from '../../../main/core/domain/exceptions/InvalidWilayaNumberException';
import { PhoneNumberAlreadyUsedException } from '../../../main/core/domain/exceptions/PhoneNumberAlreadyUsedException';
import { ConfirmPasswordMissMatchException } from '../../../main/core/usecases/RegisterRegularUserUseCase/exeptions/ConfirmPasswordMissMatchException';

describe('RegisterRegularUserUseCase', () => {
  const usersEventBusMock = mock<UsersEventBus>();
  const wilayasService = new FakeWilayasService();
  const passwordEncryptor = new FakePasswordEncryptor();

  let usersManager: UsersManagerFacade;

  beforeEach(() => {
    usersManager = aUsersManagerFacade({
      wilayasService,
      passwordEncryptor,
      usersEventBus: instance(usersEventBusMock),
    });
  });

  it('email should be valid', async () => {
    const user = aRegularUserRegistrationRequest({ email: 'invalid email!' });

    await expect(usersManager.registerRegularUser(user))
      .to.eventually.be.rejectedWith(InvalidEmailException)
      .instanceOf(MultiLanguagesException);
  });

  it('password should be more than 6 characters', async () => {
    const user = aRegularUserRegistrationRequest({ password: 'short' });

    await expect(usersManager.registerRegularUser(user))
      .to.eventually.be.rejectedWith(ShortPasswordException)
      .instanceOf(MultiLanguagesException);
  });

  it('first name and last name should have more than 3 characters', async () => {
    const user = aRegularUserRegistrationRequest({ firstName: 'sh', lastName: 'sdf' });

    await expect(usersManager.registerRegularUser(user))
      .to.eventually.be.rejectedWith(ShortNameException)
      .instanceOf(MultiLanguagesException);
  });

  it('wilaya number should be valid', async () => {
    const isExistMock = stub(wilayasService, 'isExist').callsFake(() => Promise.resolve(false));

    const user = aRegularUserRegistrationRequest({ wilayaNumber: 100 });

    await expect(usersManager.registerRegularUser(user)).to.eventually.be.rejectedWith(
      InvalidWilayaNumberException,
    );

    isExistMock.restore();
  });

  it('phone number should be valid', async () => {
    const user = aRegularUserRegistrationRequest({ phoneNumber: '05 182 1' });
    const anotherUser = aRegularUserRegistrationRequest({ phoneNumber: '03 99 83 12 38' });

    await expect(usersManager.registerRegularUser(user)).to.eventually.be.rejectedWith(
      InvalidPhoneNumberException,
    );
    await expect(usersManager.registerRegularUser(anotherUser))
      .to.eventually.be.rejectedWith(InvalidPhoneNumberException)
      .instanceOf(MultiLanguagesException);
  });

  it('confirm password should equal the password', async () => {
    const user = aRegularUserRegistrationRequest({ confirmPassword: 'some other password' });

    await expect(usersManager.registerRegularUser(user))
      .to.eventually.be.rejectedWith(ConfirmPasswordMissMatchException)
      .instanceOf(MultiLanguagesException);
  });

  it('should hash the password before saving it', async () => {
    const encryptMethod = spy(passwordEncryptor, 'encrypt');
    const user = aRegularUserRegistrationRequest();

    await usersManager.registerRegularUser(user);

    expect(encryptMethod.calledOnce).to.equal(true);
  });

  it('should not have two users with the same email', async () => {
    const user = aRegularUserRegistrationRequest();
    const anotherUser = aRegularUserRegistrationRequest({ email: user.email });

    await usersManager.registerRegularUser(user);
    await expect(usersManager.registerRegularUser(anotherUser))
      .to.eventually.be.rejectedWith(EmailAlreadyUsedException)
      .instanceOf(MultiLanguagesException);
  });

  it('should not have two users with the same phone number', async () => {
    const user = aRegularUserRegistrationRequest();
    const anotherUser = aRegularUserRegistrationRequest({ phoneNumber: user.phoneNumber });

    await usersManager.registerRegularUser(user);
    await expect(usersManager.registerRegularUser(anotherUser))
      .to.eventually.be.rejectedWith(PhoneNumberAlreadyUsedException)
      .instanceOf(MultiLanguagesException);
  });

  it('each user should have a unique id', async () => {
    const user = aRegularUserRegistrationRequest();
    const anotherUser = aRegularUserRegistrationRequest();

    const { regularUserId: firstId } = await usersManager.registerRegularUser(user);
    const { regularUserId: secondId } = await usersManager.registerRegularUser(anotherUser);

    expect(firstId).to.not.equal(secondId);
  });

  it('should publish an association registered event when the association is registered', async () => {
    await usersManager.registerRegularUser(aRegularUserRegistrationRequest());

    verify(usersEventBusMock.publishRegularUserRegisteredEvent(anything())).called();
  });
});
