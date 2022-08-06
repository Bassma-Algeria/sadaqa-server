export interface GetConversationUseCaseRequest {
    between: string;
    and: string;
    page?: number;
}