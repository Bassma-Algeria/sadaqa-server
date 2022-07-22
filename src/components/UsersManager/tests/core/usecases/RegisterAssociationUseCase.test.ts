import { expect } from 'chai';
import { faker } from '@faker-js/faker';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { aUsersManagerFacade } from './base/aUsersManagerFacade';
import { anAssociationRegistrationRequest } from './base/anAssociationRegistrationRequest';

import { UsersEventBus } from '../../../main/core/domain/services/UsersEventBus';
import { WilayasService } from '../../../main/core/domain/services/WilayasService';
import { PasswordEncryptor } from '../../../main/core/domain/services/PasswordEncryptor';

import { ShortNameException } from '../../../main/core/domain/exceptions/ShortNameException';
import { InvalidEmailException } from '../../../main/core/domain/exceptions/InvalidEmailException';
import { ShortPasswordException } from '../../../main/core/domain/exceptions/ShortPasswordException';
import { MultiLanguagesException } from '../../../main/core/domain/exceptions/MultiLanguagesException';
import { EmailAlreadyUsedException } from '../../../main/core/domain/exceptions/EmailAlreadyUsedException';
import { InvalidPhoneNumberException } from '../../../main/core/domain/exceptions/InvalidPhoneNumberException';
import { InvalidWilayaNumberException } from '../../../main/core/domain/exceptions/InvalidWilayaNumberException';
import { PhoneNumberAlreadyUsedException } from '../../../main/core/domain/exceptions/PhoneNumberAlreadyUsedException';
import { NoAssociationDocsProvidedException } from '../../../main/core/domain/exceptions/NoAssociationDocsProvidedException';
import { ConfirmPasswordMissMatchException } from '../../../main/core/usecases/RegisterAssociationUseCase/exeptions/ConfirmPasswordMissMatchException';

describe('RegisterAssociationUseCase', () => {
  const usersEventBusMock = mock<UsersEventBus>();
  const wilayasServiceMock = mock<WilayasService>();
  const passwordEncryptorMock = mock<PasswordEncryptor>();
  const usersManager = aUsersManagerFacade({
    wilayasService: instance(wilayasServiceMock),
    passwordEncryptor: instance(passwordEncryptorMock),
    usersEventBus: instance(usersEventBusMock),
  });

  beforeEach(() => {
    when(wilayasServiceMock.isExist(anything())).thenResolve(true);
  });

  it('given a registration request, the email should be valid', async () => {
    const INVALID_EMAIL = faker.lorem.words(5);
    const request = anAssociationRegistrationRequest({ email: INVALID_EMAIL });

    await expect(usersManager.registerAssociation(request))
      .to.eventually.be.rejectedWith(InvalidEmailException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a registration request, the phone number should be valid', async () => {
    const INVALID_PHONE_NUMBER = faker.datatype.number().toString();
    const request = anAssociationRegistrationRequest({ phoneNumber: INVALID_PHONE_NUMBER });

    await expect(usersManager.registerAssociation(request))
      .to.eventually.be.rejectedWith(InvalidPhoneNumberException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a registration request, the association name should have more that 3 characters', async () => {
    const INVALID_NAME = faker.lorem.word(2);
    const request = anAssociationRegistrationRequest({ associationName: INVALID_NAME });

    await expect(usersManager.registerAssociation(request))
      .to.eventually.be.rejectedWith(ShortNameException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a registration request, the password should have more that 6 characters', async () => {
    const INVALID_PASSWORD = faker.internet.password(5);
    const request = anAssociationRegistrationRequest({ password: INVALID_PASSWORD });

    await expect(usersManager.registerAssociation(request))
      .to.eventually.be.rejectedWith(ShortPasswordException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a registration request, the wilaya number should be valid', async () => {
    when(wilayasServiceMock.isExist(anything())).thenResolve(false);

    const INVALID_WILAYA_NUMBER = faker.datatype.number();
    const request = anAssociationRegistrationRequest({ wilayaNumber: INVALID_WILAYA_NUMBER });

    await expect(usersManager.registerAssociation(request))
      .to.eventually.be.rejectedWith(InvalidWilayaNumberException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a registration request, the password should equal the confirm password', async () => {
    const password = faker.internet.password(10);
    const confirmPassword = faker.internet.password(11);
    const request = anAssociationRegistrationRequest({ password, confirmPassword });

    await expect(usersManager.registerAssociation(request))
      .to.eventually.be.rejectedWith(ConfirmPasswordMissMatchException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a registration request, should at least provide one association document', async () => {
    const request = anAssociationRegistrationRequest({ associationDocs: [] });

    await expect(usersManager.registerAssociation(request))
      .to.eventually.be.rejectedWith(NoAssociationDocsProvidedException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given a registration request, should encrypt the password before saving it', async () => {
    await usersManager.registerAssociation(anAssociationRegistrationRequest());

    verify(passwordEncryptorMock.encrypt(anything())).called();
  });

  it('given X registration requests, should have a unique associationId for each association', async () => {
    const { associationId: id1 } = await usersManager.registerAssociation(
      anAssociationRegistrationRequest(),
    );
    const { associationId: id2 } = await usersManager.registerAssociation(
      anAssociationRegistrationRequest(),
    );

    expect(id1).to.not.equal(id2);
  });

  it('given X registration requests, should not have two associations with the same email', async () => {
    const SAME_EMAIL = faker.internet.email();

    await usersManager.registerAssociation(anAssociationRegistrationRequest({ email: SAME_EMAIL }));

    await expect(
      usersManager.registerAssociation(anAssociationRegistrationRequest({ email: SAME_EMAIL })),
    )
      .to.eventually.be.rejectedWith(EmailAlreadyUsedException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('given X registration requests, should not have two associations with the same phone number', async () => {
    const SAME_PHONE = faker.phone.number('05 ## ## ## ##');

    await usersManager.registerAssociation(
      anAssociationRegistrationRequest({ phoneNumber: SAME_PHONE }),
    );

    await expect(
      usersManager.registerAssociation(
        anAssociationRegistrationRequest({ phoneNumber: SAME_PHONE }),
      ),
    )
      .to.eventually.be.rejectedWith(PhoneNumberAlreadyUsedException)
      .and.to.be.an.instanceOf(MultiLanguagesException);
  });

  it('should publish an association registered event when the association is registered', async () => {
    await usersManager.registerAssociation(anAssociationRegistrationRequest());

    verify(usersEventBusMock.publishAssociationRegisteredEvent(anything())).called();
  });
});
