import { expect } from 'chai';

import { Email } from '../../../main/core/domain/Email';

describe('Email value object', () => {
    it('should trim and lower case the Email', () => {
        expect(new Email(' SomeEmail@GMAIL.com  ').value()).to.equal('someemail@gmail.com');
    });
});
