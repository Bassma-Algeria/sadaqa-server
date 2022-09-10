interface UseCase<Request, Response> {
    handle(request: Request): Promise<Response>;
}

export { UseCase };
