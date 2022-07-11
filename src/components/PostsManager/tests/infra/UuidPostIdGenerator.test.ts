import { expect } from 'chai';
import { UuidPostIdGenerator } from '../../main/infra/real/UuidPostIdGenerator';

describe('UuidPostIdGenerator', () => {
  const postIdGenerator = new UuidPostIdGenerator();

  it('should generate a random id every time', () => {
    expect(postIdGenerator.nextId().value())
      .to.not.equal(postIdGenerator.nextId().value())
      .to.not.equal(postIdGenerator.nextId().value())
      .to.not.equal(postIdGenerator.nextId().value());
  });
});
