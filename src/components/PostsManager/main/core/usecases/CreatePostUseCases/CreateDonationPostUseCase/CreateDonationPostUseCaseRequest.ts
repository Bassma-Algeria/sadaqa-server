export interface CreateDonationPostUseCaseRequest {
    readonly title: string;
    readonly description: string;
    readonly wilayaNumber: number;
    readonly publisherId: string;
    readonly category: string;
    readonly pictures: Buffer[];
}
