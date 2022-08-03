import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { Token } from '../../main/core/domain/Token';
import { UserId } from '../../main/core/domain/UserId';
import { JwtTokenizationService } from '../../main/infra/real/JwtTokenizationService';
import { InvalidTokenException } from '../../main/core/domain/exception/InvalidTokenException';

describe('JwtTokenizationService', () => {
    const tokenizationService = new JwtTokenizationService();

    it('should generate a token from a userId, and decode it properly', async () => {
        const userId = new UserId(faker.datatype.uuid());

        const token = await tokenizationService.generateTokenFrom(userId);
        const decodedUserId = await tokenizationService.decodeToken(token);

        expect(decodedUserId.value()).to.equal(userId.value());
    });

    it('should generate the same token from the same userId', async () => {
        const userId = new UserId(faker.datatype.uuid());

        const token1 = await tokenizationService.generateTokenFrom(userId);
        const token2 = await tokenizationService.generateTokenFrom(userId);

        expect(token1.value()).to.equal(token2.value());
    });

    it('should generate unique token for every unique userId', async () => {
        const userId1 = new UserId(faker.datatype.uuid());
        const userId2 = new UserId(faker.datatype.uuid());

        const token1 = await tokenizationService.generateTokenFrom(userId1);
        const token2 = await tokenizationService.generateTokenFrom(userId2);

        expect(token1.value()).to.not.equal(token2.value());
    });

    it('should not decode tokens that are not gerenated from our system', async () => {
        const token = faker.datatype.string(10);

        await expect(
            tokenizationService.decodeToken(new Token(token)),
        ).to.eventually.be.rejectedWith(InvalidTokenException);
    });
});
