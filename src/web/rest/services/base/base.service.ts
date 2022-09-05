import { LoggerConfiguration } from '../../../../components/Logger/main/LoggerConfiguration';

abstract class Service {
    private readonly logger = LoggerConfiguration.aLogger();

    protected async logError(context: string, error: unknown) {
        if (!(error instanceof Error))
            return await this.logger.error({ message: context, stack: '' });

        return await this.logger.error({
            message: `${context} : ${error.message}`,
            stack: error.stack!,
        });
    }
}

export { Service };
