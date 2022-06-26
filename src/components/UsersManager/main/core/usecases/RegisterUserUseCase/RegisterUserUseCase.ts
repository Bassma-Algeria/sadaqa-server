import { UseCase } from '../UseCase';
import { RegisterUserUseCaseRequest } from './RegisterUserUseCaseRequest';
import { RegisterUserUseCaseResponse } from './RegisterUserUseCaseResponse';

import { User } from '../../domain/User';
import { Email } from '../../domain/Email';
import { Password } from '../../domain/Password';
import { LastName } from '../../domain/LastName';
import { FirstName } from '../../domain/FirstName';
import { PhoneNumber } from '../../domain/PhoneNumber';
import { WilayaNumber } from '../../domain/WilayaNumber';

import { UsersRepository } from '../../domain/UsersRepository';
import { UserIdGenerator } from '../../domain/UserIdGenerator';
import { PasswordEncryptor } from '../../domain/PasswordEncryptor';

import { EmailAlreadyUsedException } from './exeptions/EmailAlreadyUsedException';
import { PhoneNumberAlreadyUsedException } from './exeptions/PhoneNumberAlreadyUsedException';
import { ConfirmPasswordMissMatchException } from './exeptions/ConfirmPasswordMissMatchException';

class RegisterUserUseCase
  implements UseCase<RegisterUserUseCaseRequest, RegisterUserUseCaseResponse>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userIdGenerator: UserIdGenerator,
    private readonly passwordEncryptor: PasswordEncryptor,
  ) {}

  async handle(request: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const user = this.getUserFrom(request);
    const confirmPassword = new Password(request.confirmPassword);

    if (!user.password.equals(confirmPassword)) throw new ConfirmPasswordMissMatchException();

    const userWithSameEmail = await this.findUserByEmail(user.email);
    if (userWithSameEmail) throw new EmailAlreadyUsedException();

    const userWithSamePhone = await this.findUserByPhone(user.phone);
    if (userWithSamePhone) throw new PhoneNumberAlreadyUsedException();

    const userWithEncrypedPassword = await this.getUserWithEncryptedPasswordFrom(user);

    await this.usersRepository.add(userWithEncrypedPassword);

    return { userId: user.userId.value() };
  }

  private async getUserWithEncryptedPasswordFrom(user: User) {
    const encryptedPassword = await this.passwordEncryptor.encrypt(user.password);

    return User.builder(user).password(encryptedPassword).build();
  }

  private findUserByPhone(phone: PhoneNumber) {
    return this.usersRepository.findByPhoneNumber(phone);
  }

  private findUserByEmail(email: Email) {
    return this.usersRepository.findByEmail(email);
  }

  private getUserFrom(request: RegisterUserUseCaseRequest) {
    return new User(
      this.userIdGenerator.nextId(),
      new FirstName(request.firstName),
      new LastName(request.lastName),
      new WilayaNumber(request.wilayaNumber),
      new PhoneNumber(request.phoneNumber),
      new Email(request.email),
      new Password(request.password),
    );
  }
}

export { RegisterUserUseCase };
