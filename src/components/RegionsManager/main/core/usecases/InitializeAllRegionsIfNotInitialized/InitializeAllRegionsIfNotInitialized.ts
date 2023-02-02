import { UseCase } from '../UseCase';
import { WilayasRepository } from '../../domain/services/WilayasRepository';
import { Wilaya } from '../../domain/Wilaya';

class InitializeAllRegionsIfNotInitialized implements UseCase<void, void> {
    constructor(private readonly wilayasRepository: WilayasRepository) {}

    async handle(): Promise<void> {
        const wilayas = await this.wilayasRepository.getAll();

        if (wilayas.length === 0) await this.addAlgerianWilayas();
    }

    private async addAlgerianWilayas() {
        await this.wilayasRepository.saveMany([
            Wilaya.Create(1, 'Adrar'),
            Wilaya.Create(2, 'Chlef'),
            Wilaya.Create(3, 'Laghouat'),
            Wilaya.Create(4, 'Oum El Bouaghi'),
            Wilaya.Create(5, 'Batna'),
            Wilaya.Create(6, 'Bejaia'),
            Wilaya.Create(7, 'Biskra'),
            Wilaya.Create(8, 'Bechar'),
            Wilaya.Create(9, 'Blida'),
            Wilaya.Create(10, 'Bouira'),
            Wilaya.Create(11, 'Tamanrasset'),
            Wilaya.Create(12, 'Tebessa'),
            Wilaya.Create(13, 'Tlemcen'),
            Wilaya.Create(14, 'Tiaret'),
            Wilaya.Create(15, 'Tizi Ouzou'),
            Wilaya.Create(16, 'Alger'),
            Wilaya.Create(17, 'Djelfa'),
            Wilaya.Create(18, 'Jijel'),
            Wilaya.Create(19, 'Setif'),
            Wilaya.Create(20, 'Saida'),
            Wilaya.Create(21, 'Skikda'),
            Wilaya.Create(22, 'Sidi Bel Abbès'),
            Wilaya.Create(23, 'Annaba'),
            Wilaya.Create(24, 'Guelma'),
            Wilaya.Create(25, 'Constantine'),
            Wilaya.Create(26, 'Medea'),
            Wilaya.Create(27, 'Mostaganem'),
            Wilaya.Create(28, 'MSila'),
            Wilaya.Create(29, 'Mascara'),
            Wilaya.Create(30, 'Ouargla'),
            Wilaya.Create(31, 'Oran'),
            Wilaya.Create(32, 'El Bayadh'),
            Wilaya.Create(33, 'Illizi'),
            Wilaya.Create(34, 'Bordj Bou Arreridj'),
            Wilaya.Create(35, 'Boumerdes'),
            Wilaya.Create(36, 'El Tarf'),
            Wilaya.Create(37, 'Tindouf'),
            Wilaya.Create(38, 'Tissemsilt'),
            Wilaya.Create(39, 'El Oued'),
            Wilaya.Create(40, 'Khenchela'),
            Wilaya.Create(41, 'Souk Ahras'),
            Wilaya.Create(42, 'Tipaza'),
            Wilaya.Create(43, 'Mila'),
            Wilaya.Create(44, 'Ain Defla'),
            Wilaya.Create(45, 'Naama'),
            Wilaya.Create(46, 'Ain Temouchent'),
            Wilaya.Create(47, 'Ghardaia'),
            Wilaya.Create(48, 'Relizane'),
            Wilaya.Create(49, 'Timimoun'),
            Wilaya.Create(50, 'Bordj Badji Mokhtar'),
            Wilaya.Create(51, 'Ouled Djellal'),
            Wilaya.Create(52, 'Beni Abbes'),
            Wilaya.Create(53, 'In Salah'),
            Wilaya.Create(54, 'In Guezzam'),
            Wilaya.Create(55, 'Touggourt'),
            Wilaya.Create(56, 'Djanet'),
            Wilaya.Create(57, 'El Meghaier'),
            Wilaya.Create(58, 'El Menia'),
        ]);
    }
}

export { InitializeAllRegionsIfNotInitialized };
