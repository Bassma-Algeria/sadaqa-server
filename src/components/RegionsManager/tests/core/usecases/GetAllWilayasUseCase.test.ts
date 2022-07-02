import { stub } from 'sinon';
import { expect } from 'chai';

import { RegionsManagerFacade } from '../../../main/core/RegionsManagerFacade';
import { FakeWilayasRepository } from '../../../main/infra/fake/FakeWilayasRepository';

describe('GetAllWilayasUseCase', () => {
  const fakeWilayasRepository = new FakeWilayasRepository();
  const regionsManagerFacade = new RegionsManagerFacade(fakeWilayasRepository);

  it('should get all the wilayas', async () => {
    const getAllStub = stub(fakeWilayasRepository, 'getAll').callsFake(() => Promise.resolve([]));

    await regionsManagerFacade.getAllWilayas();

    expect(getAllStub.calledOnce).to.equal(true);
  });
});
