import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException, Logger,
} from '@nestjs/common';
import {BaseResponse} from "../base/base.resposne";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

    // 로거
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        this.logger.error(
            `Unhandled Exception: ${exception instanceof Error ? exception.message : String(exception)}`,
            exception instanceof Error ? exception.stack : undefined,
        );


        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : 500;

        const message =
            exception instanceof HttpException
                ? exception.message
                : 'Internal server error';

        const code =
            exception instanceof HttpException
                ? 'ERROR_' + status
                : 'ERROR_500';

        response.status(status).json(
            BaseResponse.fail(code, message),
        );
    }
}
