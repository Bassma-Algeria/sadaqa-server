export interface UseCase<Request, Response> {
  handle(request: Request): Promise<Response>;
}
