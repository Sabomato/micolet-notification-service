import axios, { AxiosRequestConfig } from 'axios';

export class NotificationManager {
    private static url = 'https://ntfy.sh/';
    private static defaultNewItemsTopic = 'new_items_topic_default12£$ssal1231';
    private static defaultErrorTopic = 'error_topic_default12£$ssal1231';

    static sendNotification(message: string, topic: string = this.defaultNewItemsTopic): void {
        const config: AxiosRequestConfig = {
            headers: { Tags: 'eyes' },
        };
        axios.post(this.url + topic, message).catch((error) => {
            return console.error(`Error sending notification: ${error}`);
        });
    }

    static sendErrorNotification(message: string, topic: string = this.defaultErrorTopic): void {
        const config: AxiosRequestConfig = {
            headers: { Tags: 'warning' },
        };

        axios.post(this.url + topic, message, config).catch((error) => {
            return console.error(`Error sending notification: ${error}`);
        });
    }
}
