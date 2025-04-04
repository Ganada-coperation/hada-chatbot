import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {BaseResponse} from "../base/base.resposne";

@Injectable()
export class ResponseInterceptor<T = any, R = any> implements NestInterceptor<T, R> {
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
        const controller = context.getClass();

        if (controller.name === 'KakaoController') {
            return next.handle() as unknown as Observable<R>;
        }

        return next.handle().pipe(
            map((data) => BaseResponse.success(data) as unknown as R),
        );
    }
}

