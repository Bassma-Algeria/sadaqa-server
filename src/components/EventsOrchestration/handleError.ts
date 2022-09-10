import { LoggerConfiguration } from '../Logger/main/LoggerConfiguration';

const logger = LoggerConfiguration.aLogger();

const handleError = async (context: string, error: unknown) => {
    try {
        if (!(error instanceof Error)) return await logger.error({ message: context, stack: '' });

        return await logger.error({
            message: `${context} : ${error.message}`,
            stack: error.stack!,
        });
    } catch (e) {
        console.log('error while logging the error');
    }
};

export { handleError };
