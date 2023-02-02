import { prisma } from '../../../_shared_/persistence/prisma/PrismaClient';

import { Wilaya } from '../core/domain/Wilaya';
import { WilayaCode } from '../core/domain/WilayaCode';
import { WilayasRepository } from '../core/domain/repositories/WilayasRepository';

class PostgresWilayasRepository implements WilayasRepository {
    async getAll(): Promise<Wilaya[]> {
        const wilayas = await prisma.wilaya.findMany();

        return wilayas.map(wilaya => Wilaya.FromState(wilaya));
    }

    async getByCode(code: WilayaCode): Promise<Wilaya | undefined> {
        const wilaya = await prisma.wilaya.findUnique({
            where: { code: code.value() },
        });

        if (!wilaya) return undefined;
        else return Wilaya.FromState(wilaya);
    }

    async saveMany(wilayas: Wilaya[]): Promise<void> {
        const dbModels = wilayas.map(wilaya => wilaya.state);

        await prisma.wilaya.createMany({
            data: dbModels,
        });
    }
}

export { PostgresWilayasRepository };
