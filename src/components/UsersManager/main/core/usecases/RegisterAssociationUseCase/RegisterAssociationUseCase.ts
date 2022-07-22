import { UseCase } from '../UseCase';
import { RegisterAssociationUseCaseRequest } from './RegisterAssociationUseCaseRequest';
import { RegisterAssociationUseCaseResponse } from './RegisterAssociationUseCaseResponse';

import { Email } from '../../domain/Email';
import { Password } from '../../domain/Password';
import { PhoneNumber } from '../../domain/PhoneNumber';
import { WilayaNumber } from '../../domain/WilayaNumber';
import { AssociationName } from '../../domain/AssociationName';
import { AssociationDocs } from '../../domain/AssociationDocs';
import { AssociationAccount } from '../../domain/AssociationAccount';

import { UsersEventBus } from '../../domain/services/UsersEventBus';
import { WilayasService } from '../../domain/services/WilayasService';
import { UserIdGenerator } from '../../domain/services/UserIdGenerator';
import { PasswordEncryptor } from '../../domain/services/PasswordEncryptor';
import { RegularUserAccountRepository } from '../../domain/services/RegularUserAccountRepository';
import { AssociationAccountRepository } from '../../domain/services/AssociationAccountRepository';

import { ConfirmPasswordMissMatchException } from './exeptions/ConfirmPasswordMissMatchException';

import { EmailAlreadyUsedException } from '../../domain/exceptions/EmailAlreadyUsedException';
import { InvalidWilayaNumberException } from '../../domain/exceptions/InvalidWilayaNumberException';
import { PhoneNumberAlreadyUsedException } from '../../domain/exceptions/PhoneNumberAlreadyUsedException';

class RegisterAssociationUseCase
  implements UseCase<RegisterAssociationUseCaseRequest, RegisterAssociationUseCaseResponse>
{
  constructor(
    private readonly wilayaService: WilayasService,
    private readonly passwordEncryptor: PasswordEncryptor,
    private readonly userIdGenerator: UserIdGenerator,
    private readonly associationAccountRepository: AssociationAccountRepository,
    private readonly regularUserAccountRepository: RegularUserAccountRepository,
    private readonly usersEventBus: UsersEventBus,
  ) {}

  async handle(
    request: RegisterAssociationUseCaseRequest,
  ): Promise<RegisterAssociationUseCaseResponse> {
    const {
      associationName,
      email,
      phoneNumber,
      wilayaNumber,
      confirmPassword,
      password,
      associationDocs,
    } = this.getFrom(request);

    this.checkIfPasswordsMatchAndThrowIfNot(password, confirmPassword);

    await this.checkIfWilayaExistAndThrowIfNot(wilayaNumber);
    await this.checkIfEmailIsUniqueAndThrowIfNot(email);
    await this.checkIfPhoneIsUniqueAndThrowIfNot(phoneNumber);

    const encryptedPassword = await this.encrypt(password);

    const associationAccount = AssociationAccount.aBuilder()
      .withId(this.getRandomAssociationId())
      .withName(associationName)
      .withWilayaNumber(wilayaNumber)
      .withPhone(phoneNumber)
      .withEmail(email)
      .withPassword(encryptedPassword)
      .withCreatedAt(this.now())
      .withActiveStatus(false)
      .build();

    await this.associationAccountRepository.save(associationAccount);

    this.usersEventBus.publishAssociationRegisteredEvent({ associationAccount, associationDocs });

    return { associationId: associationAccount.associationId.value() };
  }

  private checkIfPasswordsMatchAndThrowIfNot(password: Password, confirmPassword: Password) {
    if (!password.equals(confirmPassword)) throw new ConfirmPasswordMissMatchException();
  }

  private getFrom(request: RegisterAssociationUseCaseRequest) {
    const email = new Email(request.email);
    const password = new Password(request.password);
    const phoneNumber = new PhoneNumber(request.phoneNumber);
    const wilayaNumber = new WilayaNumber(request.wilayaNumber);
    const confirmPassword = new Password(request.confirmPassword);
    const associationName = new AssociationName(request.associationName);
    const associationDocs = new AssociationDocs(request.associationDocs);

    return {
      associationName,
      email,
      phoneNumber,
      wilayaNumber,
      password,
      confirmPassword,
      associationDocs,
    };
  }

  private isWilayaExist(wilayaNumber: WilayaNumber) {
    return this.wilayaService.isExist(wilayaNumber);
  }

  private async checkIfWilayaExistAndThrowIfNot(wilayaNumber: WilayaNumber) {
    const isWilayaExist = await this.isWilayaExist(wilayaNumber);
    if (!isWilayaExist) throw new InvalidWilayaNumberException();
  }

  private async checkIfEmailIsUniqueAndThrowIfNot(email: Email) {
    const associationWithSameEmail = await this.associationAccountRepository.findByEmail(email);
    const regularUserWithSameEmail = await this.regularUserAccountRepository.findByEmail(email);

    if (associationWithSameEmail || regularUserWithSameEmail) throw new EmailAlreadyUsedException();
  }

  private async checkIfPhoneIsUniqueAndThrowIfNot(phone: PhoneNumber) {
    const accountWithSamePhone = await this.associationAccountRepository.findByPhoneNumber(phone);
    if (accountWithSamePhone) throw new PhoneNumberAlreadyUsedException();
  }

  private encrypt(password: Password) {
    return this.passwordEncryptor.encrypt(password);
  }

  private getRandomAssociationId() {
    return this.userIdGenerator.nextId();
  }

  private now() {
    return new Date();
  }
}

export { RegisterAssociationUseCase };
