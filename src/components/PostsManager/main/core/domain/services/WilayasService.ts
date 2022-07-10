import { WilayaNumber } from '../WilayaNumber';

export interface WilayasService {
  isExist(wilayaNumber: WilayaNumber): Promise<boolean>;
}
