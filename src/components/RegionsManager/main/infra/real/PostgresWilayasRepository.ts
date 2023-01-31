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
    constructor() {
        // TODO: should move it from here to the component initialization
        const wilayas = [
            { wilayaNumber: 1, arabicName: 'أدرار', englishName: 'Adrar' },
            { wilayaNumber: 2, arabicName: 'الشلف', englishName: 'Chlef' },
            { wilayaNumber: 3, arabicName: 'الأغواط', englishName: 'Laghouat' },
            { wilayaNumber: 4, arabicName: 'أم البواقي', englishName: 'Oum El Bouaghi' },
            { wilayaNumber: 5, arabicName: 'باتنة', englishName: 'Batna' },
            { wilayaNumber: 6, arabicName: 'بجاية', englishName: 'Béjaïa' },
            { wilayaNumber: 7, arabicName: 'بسكرة', englishName: 'Biskra' },
            { wilayaNumber: 8, arabicName: 'بشار', englishName: 'Béchar' },
            { wilayaNumber: 9, arabicName: 'البليدة', englishName: 'Blida' },
            { wilayaNumber: 10, arabicName: 'البويرة', englishName: 'Bouira' },
            { wilayaNumber: 11, arabicName: 'تمنراست', englishName: 'Tamanrasset' },
            { wilayaNumber: 12, arabicName: 'تبسة', englishName: 'Tébessa' },
            { wilayaNumber: 13, arabicName: 'تلمسان', englishName: 'Tlemcen' },
            { wilayaNumber: 14, arabicName: 'تيارت', englishName: 'Tiaret' },
            { wilayaNumber: 15, arabicName: 'تيزي وزو', englishName: 'Tizi Ouzou' },
            { wilayaNumber: 16, arabicName: 'الجزائر', englishName: 'Alger' },
            { wilayaNumber: 17, arabicName: 'الجلفة', englishName: 'Djelfa' },
            { wilayaNumber: 18, arabicName: 'جيجل', englishName: 'Jijel' },
            { wilayaNumber: 19, arabicName: 'سطيف', englishName: 'Sétif' },
            { wilayaNumber: 20, arabicName: 'سعيدة', englishName: 'Saïda' },
            { wilayaNumber: 21, arabicName: 'سكيكدة', englishName: 'Skikda' },
            { wilayaNumber: 22, arabicName: 'سيدي بلعباس', englishName: 'Sidi Bel Abbès' },
            { wilayaNumber: 23, arabicName: 'عنابة', englishName: 'Annaba' },
            { wilayaNumber: 24, arabicName: 'قالمة', englishName: 'Guelma' },
            { wilayaNumber: 25, arabicName: 'قسنطينة', englishName: 'Constantine' },
            { wilayaNumber: 26, arabicName: 'المدية', englishName: 'Médéa' },
            { wilayaNumber: 27, arabicName: 'مستغانم', englishName: 'Mostaganem' },
            { wilayaNumber: 28, arabicName: 'المسيلة', englishName: 'Msila' },
            { wilayaNumber: 29, arabicName: 'معسكر', englishName: 'Mascara' },
            { wilayaNumber: 30, arabicName: 'ورقلة', englishName: 'Ouargla' },
            { wilayaNumber: 31, arabicName: 'وهران', englishName: 'Oran' },
            { wilayaNumber: 32, arabicName: 'البيض', englishName: 'El Bayadh' },
            { wilayaNumber: 33, arabicName: 'إليزي', englishName: 'Illizi' },
            { wilayaNumber: 34, arabicName: 'برج بوعريريج', englishName: 'Bordj Bou Arreridj' },
            { wilayaNumber: 35, arabicName: 'بومرداس', englishName: 'Boumerdès' },
            { wilayaNumber: 36, arabicName: 'الطارف', englishName: 'El Tarf' },
            { wilayaNumber: 37, arabicName: 'تندوف', englishName: 'Tindouf' },
            { wilayaNumber: 38, arabicName: 'تيسمسيلت', englishName: 'Tissemsilt' },
            { wilayaNumber: 39, arabicName: 'الوادي', englishName: 'El Oued' },
            { wilayaNumber: 40, arabicName: 'خنشلة', englishName: 'Khenchela' },
            { wilayaNumber: 41, arabicName: 'سوق أهراس', englishName: 'Souk Ahras' },
            { wilayaNumber: 42, arabicName: 'تيبازة', englishName: 'Tipaza' },
            { wilayaNumber: 43, arabicName: 'ميلة', englishName: 'Mila' },
            { wilayaNumber: 44, arabicName: 'عين الدفلة', englishName: 'Aïn Defla' },
            { wilayaNumber: 45, arabicName: 'النعامة', englishName: 'Naâma' },
            { wilayaNumber: 46, arabicName: 'عين تيموشنت', englishName: 'Aïn Témouchent' },
            { wilayaNumber: 47, arabicName: 'غرداية', englishName: 'Ghardaïa' },
            { wilayaNumber: 48, arabicName: 'غليزان', englishName: 'Relizane' },
            { wilayaNumber: 49, arabicName: 'تيميمون', englishName: 'Timimoun' },
            { wilayaNumber: 50, arabicName: 'برج باجي مختار', englishName: 'Bordj Badji Mokhtar' },
            { wilayaNumber: 51, arabicName: 'أولاد جلال', englishName: 'Ouled Djellal' },
            { wilayaNumber: 52, arabicName: 'بني عباس', englishName: 'Béni Abbès' },
            { wilayaNumber: 53, arabicName: 'عين صالح', englishName: 'In Salah' },
            { wilayaNumber: 54, arabicName: 'عين قزام', englishName: 'In Guezzam' },
            { wilayaNumber: 55, arabicName: 'تقرت', englishName: 'Touggourt' },
            { wilayaNumber: 56, arabicName: 'جانت', englishName: 'Djanet' },
            { wilayaNumber: 57, arabicName: 'المغير', englishName: 'El Meghaier' },
            { wilayaNumber: 58, arabicName: 'المنيعة', englishName: 'El Menia' },
        ];

        prisma.wilaya.count().then(count => {
            if (count === 0) prisma.wilaya.createMany({ data: wilayas });
        });
    }

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
