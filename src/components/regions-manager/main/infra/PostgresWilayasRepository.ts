import { Wilaya } from '../core/domain/Wilaya';
import { WilayaCode } from '../core/domain/WilayaCode';
import { WilayasRepository } from '../core/domain/repositories/WilayasRepository';

import { WilayaDbClient } from '../../../persistence/postgres/prisma/PrismaClients';

class PostgresWilayasRepository implements WilayasRepository {
    constructor(private readonly dbClient: WilayaDbClient) {}

    async getAll(): Promise<Wilaya[]> {
        const wilayas = await this.dbClient.findMany();

        return wilayas.map(wilaya => Wilaya.FromState(wilaya));
    }

    async getByCode(code: WilayaCode): Promise<Wilaya | undefined> {
        const wilaya = await this.dbClient.findUnique({
            where: { code: code.value() },
        });

        if (!wilaya) return undefined;
        else return Wilaya.FromState(wilaya);
    }

    async saveMany(wilayas: Wilaya[]): Promise<void> {
        const dbModels = wilayas.map(wilaya => wilaya.state);

        await this.dbClient.createMany({
            data: dbModels,
        });
    }
}

export { PostgresWilayasRepository };
