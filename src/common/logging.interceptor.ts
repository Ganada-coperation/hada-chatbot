import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const method = req.method;
        const url = req.url;

        const now = Date.now();

        return next.handle().pipe(
            tap((responseData) => {
                console.log(`📤 [${method}] ${url} 응답시간: ${Date.now() - now}ms`);
                console.log('🟢 응답 내용:', JSON.stringify(responseData, null, 2));
            }),
        );
    }
}
