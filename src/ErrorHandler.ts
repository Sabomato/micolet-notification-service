import { NotificationManager } from './NotificationManager.js';

export class ErrorHandler {
    private _awsRequestId!: string;
    public set awsRequestId(value: string) {
        this._awsRequestId = value;
    }
    private static INSTANCE: ErrorHandler;

    static {
        this.INSTANCE = new ErrorHandler();
        this.getInstance().awsRequestId = '';
    }

    public static getInstance(): ErrorHandler {
        return this.INSTANCE;
    }
    private handleErrorPrivate(errorMessage: string): void {
        console.error(errorMessage);
        NotificationManager.getInstance().sendErrorNotification(errorMessage);
    }
    public handleError(action: string, code?: number, requestId: string = this._awsRequestId): void {
        const message = `Error ${action}:\n requestId:${requestId}\n httpStatusCode:${code}`;
        this.handleErrorPrivate(message);
    }
    public throwError(action: string, code?: number, requestId: string = this._awsRequestId): void {
        const message = `Error ${action}:\n requestId:${requestId}\n httpStatusCode:${code}`;
        this.handleErrorPrivate(message);
        throw new Error(message);
    }
}
