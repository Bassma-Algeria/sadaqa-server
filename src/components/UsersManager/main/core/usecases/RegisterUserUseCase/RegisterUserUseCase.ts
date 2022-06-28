import { UseCase } from '../UseCase';
import { RegisterUserUseCaseRequest } from './RegisterUserUseCaseRequest';
import { RegisterUserUseCaseResponse } from './RegisterUserUseCaseResponse';

import { UserAccount } from '../../domain/UserAccount';
import { Email } from '../../domain/Email';
import { Password } from '../../domain/Password';
import { LastName } from '../../domain/LastName';
import { FirstName } from '../../domain/FirstName';
import { PhoneNumber } from '../../domain/PhoneNumber';
import { WilayaNumber } from '../../domain/WilayaNumber';

import { WilayasService } from '../../domain/services/WilayasService';
import { UserAccountRepository } from '../../domain/services/UserAccountRepository';
import { UserIdGenerator } from '../../domain/services/UserIdGenerator';
import { PasswordEncryptor } from '../../domain/services/PasswordEncryptor';

import { EmailAlreadyUsedException } from './exeptions/EmailAlreadyUsedException';
import { InvalidWilayaNumberException } from './exeptions/InvalidWilayaNumberException';
import { PhoneNumberAlreadyUsedException } from './exeptions/PhoneNumberAlreadyUsedException';
import { ConfirmPasswordMissMatchException } from './exeptions/ConfirmPasswordMissMatchException';

class RegisterUserUseCase
  implements UseCase<RegisterUserUseCaseRequest, RegisterUserUseCaseResponse>
{
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly userIdGenerator: UserIdGenerator,
    private readonly passwordEncryptor: PasswordEncryptor,
    private readonly wilayasService: WilayasService,
  ) {}

  async handle(request: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const { firstName, lastName, email, wilaya, phone, password, confirmPassword } =
      this.getFrom(request);

    if (!password.equals(confirmPassword)) throw new ConfirmPasswordMissMatchException();

    const accountWithSameEmail = await this.findUserByEmail(email);
    if (accountWithSameEmail) throw new EmailAlreadyUsedException();

    const accountWithSamePhone = await this.findUserByPhone(phone);
    if (accountWithSamePhone) throw new PhoneNumberAlreadyUsedException();

    const isWilayaExist = await this.wilayasService.isExist(wilaya);
    if (!isWilayaExist) throw new InvalidWilayaNumberException();

    const userId = this.getNextUserId();
    const encryptedPassword = await this.encrypt(password);

    const user: UserAccount = UserAccount.builder()
      .userId(userId)
      .firstName(firstName)
      .lastName(lastName)
      .wilayaNumber(wilaya)
      .phoneNumber(phone)
      .email(email)
      .password(encryptedPassword)
      .createdAt(new Date())
      .build();

    await this.userAccountRepository.add(user);

    return { userId: userId.value() };
  }

  private encrypt(password: Password) {
    return this.passwordEncryptor.encrypt(password);
  }

  private getNextUserId() {
    return this.userIdGenerator.nextId();
  }

  private getFrom(request: RegisterUserUseCaseRequest) {
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

  private findUserByPhone(phone: PhoneNumber) {
    return this.userAccountRepository.findByPhoneNumber(phone);
  }

  private findUserByEmail(email: Email) {
    return this.userAccountRepository.findByEmail(email);
  }
}

export { RegisterUserUseCase };
