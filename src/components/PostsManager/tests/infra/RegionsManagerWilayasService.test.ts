import { expect } from 'chai';
import { anything, instance, mock, when } from 'ts-mockito';

import { WilayaNumber } from '../../main/core/domain/WilayaNumber';
import { RegionsManagerFacade } from '../../../RegionsManager/main/RegionsManagerFacade';
import { RegionsManagerWilayasService } from '../../main/infra/real/RegionsManagerWilayasService';

describe('RegionsManagerWilayasService', () => {
  const EXISTING_WILAYA_NUMBER = 3;
  const NOT_EXISTING_WILAYA_NUMBER = 10000;

  const regionsManager = mock<RegionsManagerFacade>();
  const regionsManagerWilayasService = new RegionsManagerWilayasService(instance(regionsManager));

  it('should return true when the wilaya exist', async () => {
    when(regionsManager.getWilaya(anything())).thenResolve({ name: { ar: '', en: '' } });

    const isWilayaExist = await regionsManagerWilayasService.isExist(
      new WilayaNumber(EXISTING_WILAYA_NUMBER),
    );

    expect(isWilayaExist).to.equal(true);
  });

  it('should return false when the wilaya not exist', async () => {
    when(regionsManager.getWilaya(anything())).thenReject();

    const isWilayaExist = await regionsManagerWilayasService.isExist(
      new WilayaNumber(NOT_EXISTING_WILAYA_NUMBER),
    );

    expect(isWilayaExist).to.equal(false);
  });
});
