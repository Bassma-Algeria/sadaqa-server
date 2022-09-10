export interface GetAllWilayasUseCaseResponse {
    wilayas: {
        code: number;
        name: { en: string; ar: string };
    }[];
}
