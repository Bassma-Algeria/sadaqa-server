import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { WilayasService } from '../../core/domain/services/WilayasService';

class FakeWilayasService implements WilayasService {
  private readonly MAX_WILAYA_NUMBER = 58;

  async isExist(wilayaNumber: WilayaNumber): Promise<boolean> {
    return wilayaNumber.value() < this.MAX_WILAYA_NUMBER && wilayaNumber.value() > 0;
  }
}

export { FakeWilayasService };
