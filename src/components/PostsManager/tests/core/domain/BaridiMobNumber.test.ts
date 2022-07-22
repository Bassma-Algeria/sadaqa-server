import { expect } from 'chai';
import { faker } from '@faker-js/faker';

import { BaridiMobNumber } from '../../../main/core/domain/BaridiMobNumber';

describe('BaridiMobNumber value object', function () {
  it('should trim the baridi mob number', () => {
    const number = faker.phone.number('00799999############').toString();

    const baridiMobNumber = new BaridiMobNumber(`  ${number} `);

    expect(baridiMobNumber.value()).to.equal(number);
  });
});
