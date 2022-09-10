import { prisma } from '../../../../_shared_/persistence/prisma/PrismaClient';

import { Wilaya } from '../../core/domain/Wilaya';
import { WilayaNumber } from '../../core/domain/WilayaNumber';
import { WilayasRepository } from '../../core/domain/services/WilayasRepository';
import { WilayaName } from '../../core/domain/WilayaName';

interface DBModel {
    wilayaNumber: number;
    arabicName: string;
    englishName: string;
}

class PostgresWilayasRepository implements WilayasRepository {
    async getAll(): Promise<Wilaya[]> {
        const wilayas = await prisma.wilaya.findMany();

        return wilayas.map(wilaya => this.toWilayaEntity(wilaya));
    }

    async getByNumber(wilayaNumber: WilayaNumber): Promise<Wilaya | undefined> {
        const wilaya = await prisma.wilaya.findUnique({
            where: { wilayaNumber: wilayaNumber.value() },
        });

        if (!wilaya) return undefined;
        else return this.toWilayaEntity(wilaya);
    }

    private toWilayaEntity(wliayaDb: DBModel): Wilaya {
        return new Wilaya(
            new WilayaName({ ar: wliayaDb.arabicName, en: wliayaDb.englishName }),
            new WilayaNumber(wliayaDb.wilayaNumber),
        );
    }

    private toDBModel(wilaya: Wilaya): DBModel {
        return {
            arabicName: wilaya.wilayaName.value().ar,
            englishName: wilaya.wilayaName.value().en,
            wilayaNumber: wilaya.wilayaNumber.value(),
        };
    }
}

export { PostgresWilayasRepository };
