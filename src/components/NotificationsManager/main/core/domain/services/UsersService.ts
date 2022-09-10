import { UserId } from '../UserId';

export interface UsersService {
    getIdsOfAssociationsInWilaya(wilayaNumber: number): Promise<UserId[]>;

    getIdsOfUsersInWilaya(wilayaNumber: number): Promise<UserId[]>;
}