import { Wilaya } from '../Wilaya';
import { WilayaNumber } from '../WilayaNumber';

export interface WilayasRepository {
    getByNumber(wilayaNumber: WilayaNumber): Promise<Wilaya | undefined>;
    getAll(): Promise<Wilaya[]>;
}
