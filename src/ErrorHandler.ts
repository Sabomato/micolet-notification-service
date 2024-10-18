import { NotificationManager } from './NotificationManager.js';

export class ErrorHandler {
    private static handleErrorPrivate(errorMessage: string): void {
        console.error(errorMessage);
        NotificationManager.sendErrorNotification(errorMessage);
    }
    static handleError(action: string, requestId?: string, code?: number): void {
        const message = `Error ${action}:\n requestId:${requestId}\n httpStatusCode:${code}`;
        this.handleErrorPrivate(message);
    }
    static throwError(action: string, requestId?: string, code?: number): void {
        const message = `Error ${action}:\n requestId:${requestId}\n httpStatusCode:${code}`;
        this.handleErrorPrivate(message);
        throw new Error(message);
    }
}
