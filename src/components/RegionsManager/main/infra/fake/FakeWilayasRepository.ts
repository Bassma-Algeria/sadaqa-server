import { Wilaya } from '../../core/domain/Wilaya';
import { WilayasRepository } from '../../core/domain/services/WilayasRepository';

class FakeWilayasRepository implements WilayasRepository {
    getByCode(): Promise<Wilaya | undefined> {
        throw new Error('Method not implemented.');
    }

    getAll(): Promise<Wilaya[]> {
        throw new Error('Method not implemented.');
    }

    save(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}

export { FakeWilayasRepository };
