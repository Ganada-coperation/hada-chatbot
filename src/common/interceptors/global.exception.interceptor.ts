import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import {BaseResponse} from "../base/base.resposne";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

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
