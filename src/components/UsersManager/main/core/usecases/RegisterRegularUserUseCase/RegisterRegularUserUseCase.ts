import { UseCase } from '../UseCase';
import { RegisterRegularUserUseCaseRequest } from './RegisterRegularUserUseCaseRequest';
import { RegisterRegularUserUseCaseResponse } from './RegisterRegularUserUseCaseResponse';

import { Email } from '../../domain/Email';
import { Password } from '../../domain/Password';
import { LastName } from '../../domain/LastName';
import { FirstName } from '../../domain/FirstName';
import { PhoneNumber } from '../../domain/PhoneNumber';
import { WilayaNumber } from '../../domain/WilayaNumber';
import { RegularUserAccount } from '../../domain/RegularUserAccount';

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

class RegisterRegularUserUseCase
  implements UseCase<RegisterRegularUserUseCaseRequest, RegisterRegularUserUseCaseResponse>
{
  constructor(
    private readonly userAccountRepository: RegularUserAccountRepository,
    private readonly userIdGenerator: UserIdGenerator,
    private readonly passwordEncryptor: PasswordEncryptor,
    private readonly wilayasService: WilayasService,
    private readonly associationAccountRepository: AssociationAccountRepository,
    private readonly usersEventBus: UsersEventBus,
  ) {}

  async handle(
    request: RegisterRegularUserUseCaseRequest,
  ): Promise<RegisterRegularUserUseCaseResponse> {
    const { firstName, lastName, email, wilaya, phone, password, confirmPassword } =
      this.getFrom(request);

    this.checkIfPasswordsMatchAndThrowIfNot(password, confirmPassword);

    await this.checkIfEmailUniqueAndThrowIfNot(email);
    await this.checkIfPhoneNumberUniqueAndThrowIfNot(phone);
    await this.checkIfWilayaExistAndThrowIfNot(wilaya);

    const encryptedPassword = await this.encrypt(password);

    const regularUser = RegularUserAccount.builder()
      .userId(this.getNextUserId())
      .firstName(firstName)
      .lastName(lastName)
      .wilayaNumber(wilaya)
      .phoneNumber(phone)
      .email(email)
      .password(encryptedPassword)
      .createdAt(new Date())
      .build();

    await this.userAccountRepository.save(regularUser);

    this.usersEventBus.publishRegularUserRegisteredEvent(regularUser);

    return { regularUserId: regularUser.userId.value() };
  }

  private getFrom(request: RegisterRegularUserUseCaseRequest) {
    return {
      firstName: new FirstName(request.firstName),
      lastName: new LastName(request.lastName),
      wilaya: new WilayaNumber(request.wilayaNumber),
      phone: new PhoneNumber(request.phoneNumber),
      email: new Email(request.email),
      password: new Password(request.password),
      confirmPassword: new Password(request.confirmPassword),
    };
  }

  private checkIfPasswordsMatchAndThrowIfNot(password: Password, confirmPassword: Password) {
    if (!password.equals(confirmPassword)) throw new ConfirmPasswordMissMatchException();
  }

  private async checkIfPhoneNumberUniqueAndThrowIfNot(phone: PhoneNumber) {
    const accountWithSamePhone = await this.userAccountRepository.findByPhoneNumber(phone);
    if (accountWithSamePhone) throw new PhoneNumberAlreadyUsedException();
  }

  private async checkIfWilayaExistAndThrowIfNot(wilaya: WilayaNumber) {
    const isWilayaExist = await this.wilayasService.isExist(wilaya);
    if (!isWilayaExist) throw new InvalidWilayaNumberException();
  }

  private async checkIfEmailUniqueAndThrowIfNot(email: Email) {
    const regularUserWithSameEmail = await this.userAccountRepository.findByEmail(email);
    const associationWithSameEmail = await this.associationAccountRepository.findByEmail(email);

    if (regularUserWithSameEmail || associationWithSameEmail) throw new EmailAlreadyUsedException();
  }

  private encrypt(password: Password) {
    return this.passwordEncryptor.encrypt(password);
  }

  private getNextUserId() {
    return this.userIdGenerator.nextId();
  }
}

export { RegisterRegularUserUseCase };
