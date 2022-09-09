import { LoggerConfiguration } from '../../../../../components/Logger/main/LoggerConfiguration';

class BaseGateway {
    private readonly logger = LoggerConfiguration.aLogger();

    protected async logError(context: string, error: unknown) {
        try {
            if (!(error instanceof Error))
                return await this.logger.error({ message: context, stack: '' });

            return await this.logger.error({
                message: `${context} : ${error.message}`,
                stack: error.stack!,
            });
        } catch (e) {
            console.log('error while logging the error');
        }
    }
}

export { BaseGateway };
