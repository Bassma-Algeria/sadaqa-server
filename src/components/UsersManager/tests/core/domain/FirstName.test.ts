import { expect } from 'chai';

import { FirstName } from '../../../main/core/domain/FirstName';

describe('FirstName value object', () => {
    it('should trim and lower case the first name', () => {
        expect(new FirstName(' Yasser  ').value()).to.equal('yasser');
    });
});
