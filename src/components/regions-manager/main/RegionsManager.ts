import { WilayaDto } from './presenters/WilayaDto';

export interface RegionsManager {
    getAlgerianWilayas(): Promise<WilayaDto[]>;

    /*
     * @throws {NotFoundException} if the wilaya is not found
     * @throws {ValidationException} if the wilaya code is invalid
     */
    getWilayaByCode(code: number): Promise<WilayaDto>;
}
