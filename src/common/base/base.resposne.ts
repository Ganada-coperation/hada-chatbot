export class BaseResponse<T> {
    timestamp: Date;
    code: string;
    message: string;
    result: T | null;

    constructor(code: string, message: string, result: T | null = null) {
        this.timestamp = new Date();
        this.code = code;
        this.message = message;
        this.result = result;
    }

    static success<T>(result: T): BaseResponse<T> {
        return new BaseResponse<T>('COMMON200', '요청에 성공하였습니다.', result);
    }

    static fail<T>(code: string, message: string, data: T | null = null): BaseResponse<T> {
        return new BaseResponse<T>(code, message, data);
    }
}
