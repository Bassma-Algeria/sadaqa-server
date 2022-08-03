import { expect } from 'chai';

import { UuidUserIdGenerator } from '../../main/infra/real/UuidUserIdGenerator';

describe('UuidUserIdGenerator', () => {
    const userIdGenerator = new UuidUserIdGenerator();

    it('should generate a unique user id every time', () => {
        expect(userIdGenerator.nextId().value())
            .to.not.equal(userIdGenerator.nextId().value())
            .to.not.equal(userIdGenerator.nextId().value())
            .to.not.equal(userIdGenerator.nextId().value())
            .to.not.equal(userIdGenerator.nextId().value())
            .to.not.equal(userIdGenerator.nextId().value());
    });
});
