import { WilayasService } from '../../core/domain/services/WilayasService';

class FakeWilayasService implements WilayasService {
  async isExist(): Promise<boolean> {
    return true;
  }
}

export { FakeWilayasService };
