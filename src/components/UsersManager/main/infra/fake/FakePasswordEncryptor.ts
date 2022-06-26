import { Password } from '../../core/domain/Password';
import { PasswordEncryptor } from '../../core/domain/PasswordEncryptor';

class FakePasswordEncryptor implements PasswordEncryptor {
  private readonly HASH = `${Math.random() * 10}`;

  async encrypt(password: Password): Promise<Password> {
    const plain = password.value();
    const encrypted = plain + this.HASH;

    return new Password(encrypted);
  }

  async compare(plain: Password, encrypted: Password): Promise<boolean> {
    const decrypted = encrypted.value().split(this.HASH)[0];

    return plain.equals(new Password(decrypted));
  }
}

export { FakePasswordEncryptor };
