import axios, { AxiosRequestConfig } from 'axios';

export class NotificationManager {
    private url = 'https://ntfy.sh/';
    private defaultNewItemsTopic = process.env["DEFAULT_NEW_ITEMS_TOPIC"] as string
    private defaultErrorTopic = process.env["DEFAULT_ERROR_TOPIC"] as string

    private static INSTANCE: NotificationManager;

    static {
        this.INSTANCE = new NotificationManager();
    }

    public static getInstance(): NotificationManager {
        return this.INSTANCE;
    }
    public sendNotification(message: string, topic: string = this.defaultNewItemsTopic): void {
        const config: AxiosRequestConfig = {
            headers: { Tags: 'eyes' },
        };
        axios.post(this.url + topic, message).catch((error) => {
            return console.error(`Error sending notification: ${error}`);
        });
    }

    public sendErrorNotification(message: string, topic: string = this.defaultErrorTopic): void {
        const config: AxiosRequestConfig = {
            headers: { Tags: 'warning' },
        };

        axios.post(this.url + topic, message, config).catch((error) => {
            return console.error(`Error sending notification: ${error}`);
        });
    }
}
