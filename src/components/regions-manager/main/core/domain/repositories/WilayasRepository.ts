import { Wilaya } from '../Wilaya';
import { WilayaCode } from '../WilayaCode';

export interface WilayasRepository {
    getByCode(code: WilayaCode): Promise<Wilaya | undefined>;
    getAll(): Promise<Wilaya[]>;
    saveMany(wilayas: Wilaya[]): Promise<void>;
}
