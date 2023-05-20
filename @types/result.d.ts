import { TError } from 'util/@types/error'
import { ErrorGeneral } from '@lib/error'

export declare class Result<T> {
    private ok
    private status
    private value?
    private error?
    private constructor();
    static failure<T>(errorInfo: TError, statusCode: number): Result<T>;
    static success<T>(successInfo: T, statusCode?: number): Result<T>;
    isSuccess(): boolean;
    getResponse(): T;
    getError(): ErrorGeneral;
    getStatus(): number;
    getResult(): {
        ok: boolean;
        status: number;
        value: T | undefined;
        error: ErrorGeneral | undefined;
    };
}