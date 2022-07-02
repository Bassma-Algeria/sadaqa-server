import { expect } from 'chai';

import { WilayaNumber } from '../../main/core/domain/WilayaNumber';
import { PostgresWilayasRepository } from '../../main/infra/real/PostgresWilayasRepository';

describe('PostgresWilayasRepostory', () => {
  const wilayasRepository = new PostgresWilayasRepository();

  it('should get the wilaya by its number', async () => {
    const EXIST_WILAYA_NUMBER = 18;

    const wilaya = await wilayasRepository.getByNumber(new WilayaNumber(EXIST_WILAYA_NUMBER));

    expect(wilaya).to.not.equal(undefined);
  });

  it('should return undefined when no wilaya found', async () => {
    const NOT_EXIST_WILAYA_NUMBER = 2993;

    const wilaya = await wilayasRepository.getByNumber(new WilayaNumber(NOT_EXIST_WILAYA_NUMBER));

    expect(wilaya).to.equal(undefined);
  });

  it('should return all the wilayas', async () => {
    const TOTAL_NUMBER_OF_WILAYAS = 58;

    const allWilayas = await wilayasRepository.getAll();

    expect(allWilayas).to.have.lengthOf(TOTAL_NUMBER_OF_WILAYAS);
  });
});
