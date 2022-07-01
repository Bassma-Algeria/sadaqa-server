import bcrypt from 'bcrypt';

import { Password } from '../../core/domain/Password';
import { PasswordEncryptor } from '../../core/domain/services/PasswordEncryptor';

class BcryptPasswordEncryptor implements PasswordEncryptor {
  async encrypt(password: Password): Promise<Password> {
    const encrypted = await bcrypt.hash(password.value(), 10);

    return new Password(encrypted);
  }

  async compare(plain: Password, encrypted: Password): Promise<boolean> {
    const isMatch = await bcrypt.compare(plain.value(), encrypted.value());

    return isMatch;
  }
}

export { BcryptPasswordEncryptor };
