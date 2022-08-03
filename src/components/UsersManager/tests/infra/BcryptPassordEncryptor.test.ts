import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { Password } from '../../main/core/domain/Password';
import { PasswordEncryptor } from '../../main/core/domain/services/PasswordEncryptor';
import { BcryptPasswordEncryptor } from '../../main/infra/real/BcryptPasswordEncryptor';

describe('BcryptPasswordEncryptor', () => {
    const passwordEncryptor: PasswordEncryptor = new BcryptPasswordEncryptor();

    it('should encrypt the password, and be able to find out that the encrypted is matching the real', async () => {
        const password = new Password(faker.internet.password());

        const encryptedPassword = await passwordEncryptor.encrypt(password);
        const isMatch = await passwordEncryptor.compare(password, encryptedPassword);

        expect(isMatch).to.equal(true);
    });

    it('should not recognize a wrong password', async () => {
        const password = new Password(faker.internet.password());
        const wrongPassword = new Password(faker.internet.password());

        const encryptedPassword = await passwordEncryptor.encrypt(password);
        const isMatch = await passwordEncryptor.compare(wrongPassword, encryptedPassword);

        expect(isMatch).to.equal(false);
    });
});
