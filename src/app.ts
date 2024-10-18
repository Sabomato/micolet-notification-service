import { Context, Handler } from 'aws-lambda';
import { NotificationManager } from './NotificationManager.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DynamoDBDocument, NativeAttributeValue, ScanCommandInput, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { AxiosRequestConfig } from 'axios';
import { ErrorHandler } from './ErrorHandler.js';
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
const TABLE_NAME = 'MicoletNotificationServiceTable';
const USER_ATTRIBUTE_NAME = 'user'; // if refactored, refactor updateUser aswell
const USERID_ATTRIBUTE_NAME = 'userID'; // if refactored, refactor updateUser aswell
const MAX_NUM_PAGES = 15;
const dynamo = DynamoDBDocument.from(new DynamoDB());
const errorTopic = 'ErrorTopicGoFixIt:(';
export const lambdaHandler: Handler = async (event: string, context: Context) => {
    const users = await getUsers();
    if (users instanceof Error || typeof users == undefined) {
        return false;
    }
    const updatedUsers = await process(users as IUser[]);
    dynamo.destroy();
    return true;
};
interface IUser {
    userID: string;
    name: string;
    topic: string;
    items: IItem[];
}
interface IItem {
    name: string;
    url: string;
    lastNumberOfItems: number;
}

function isSuccessCode(httpStatusCode: number | undefined) {
    return httpStatusCode !== undefined && httpStatusCode.toString()[0] == '2';
}
async function getUsers(): Promise<IUser[] | undefined> {
    let users: IUser[] | undefined = [];
    const dynamo = DynamoDBDocument.from(new DynamoDB());
    const params: ScanCommandInput = {
        TableName: TABLE_NAME,
    };
    const result = await dynamo.scan(params);
    if (!isSuccessCode(result.$metadata.httpStatusCode)) {
        ErrorHandler.throwError('Error getting users', result.$metadata.requestId, result.$metadata.httpStatusCode);
        return undefined;
    }
    users = result.Items?.flatMap((value: Record<string, NativeAttributeValue>) => {
        const userInfo = JSON.parse(value[USER_ATTRIBUTE_NAME]); //TODO: make this dynamic
        const user = { userID: value[USERID_ATTRIBUTE_NAME], ...userInfo }; //TODO: make this dynamic

        return user;
    });
    return users;
}

async function updateUser(user: IUser): Promise<number> {
    const USER_ATTRIBUTE_VAR_NAME = '#' + USER_ATTRIBUTE_NAME;
    const params: UpdateCommandInput = {
        TableName: TABLE_NAME,
        Key: {
            userID: user.userID,
        },
        UpdateExpression: `set ${USER_ATTRIBUTE_VAR_NAME} = :x`,
        ExpressionAttributeValues: {
            //TODO: make this dynamic
            ':x': JSON.stringify({
                name: user.name,
                topic: user.topic,
                items: user.items,
            }),
        },
        ExpressionAttributeNames: {
            '#user': USER_ATTRIBUTE_NAME,
        },
    };
    const result = await dynamo.update(params);
    if (!isSuccessCode(result.$metadata.httpStatusCode)) {
        ErrorHandler.handleError(
            `Error updating user ${user.name}`,
            result.$metadata.requestId,
            result.$metadata.httpStatusCode,
        );
    }
    return result.$metadata.httpStatusCode as number;
}

async function findNumberOfWantedItems(item: IItem, config: AxiosRequestConfig<any>): Promise<number> {
    let j = 1;
    let numberOfItems = 0;
    config.url = item.url;
    //add support for multiple pages
    console.log(`Checking link ${item.url}`);
    const response = await axios.request(config);
    const selector = cheerio.load(response.data);
    const newItems = selector("[class='']").has('.mt5.thumb-add-to-cart');
    numberOfItems = newItems.length;
    if (newItems.length == 0) {
        return numberOfItems;
    }
    //could be improved by checking if there's any unavailable items in the page

    while (j < MAX_NUM_PAGES) {
        config.url = item.url + `&page=${++j}`;
        //add support for multiple pages
        const response = await axios.request(config);
        //console.log(response.data)

        const selector = cheerio.load(response.data);
        const newItems = selector("[class='']").has('.mt5.thumb-add-to-cart');
        if (newItems.length == 0) {
            break;
        }

        numberOfItems += newItems.length;
    }

    return numberOfItems;
}
async function process(users: IUser[]): Promise<IUser[]> {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: '',
        headers: {
            'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Service-Worker-Navigation-Preload': 'true',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-User': '?1',
            'Sec-Fetch-Dest': 'document',
            host: 'www.micolet.pt',
            Cookie: '_Micolet_session=4F%2Bd04YlQqHPH%2FG5EFPdP4yvsi3YJxpUSE5GsKETApjHNWeaCjYuTLCYv5JdPE4gzD%2F4ai9H%2FIEzPRxNL4LKVbuY2fNHk7gPd8WwE1lDaNHfb1ajHEi0fJv7fKtX8TvjEuF4zckzp02l7lQEjvvR%2FP81C7sccXfDGJLQB7vwMVOvUrc8AtTXxAuiB96K0NOGHtgrj%2B4z8Ni6dJ0F9UQ4tvG%2BbnuIO96Pi4bbx1CFHmm%2FTaAANEbnUMNzEMx3zSTaMdODAMzIbrCsv4l4UEfmoZlGWH4F4Qac--X2v6bwF7YxkXU0S7--Bng%2FplxUDsd9DtF8Y7xBgw%3D%3D',
        },
    };

    for (const user of users) {
        console.log(`Verifying items for ${JSON.stringify(user.name)}`);
        for (let i = 0; i < user.items.length; i++) {
            const item = user.items[i];
            const numberOfItems = await findNumberOfWantedItems(item, config);
            console.log(`Number of previous items=${item.lastNumberOfItems}\nCurrent number of items=${numberOfItems}`);
            if (numberOfItems > item.lastNumberOfItems && item.lastNumberOfItems > -1) {
                const message = `New ${item.name} arrived! Check it out at ${item.url}`;
                console.log(`Sending notification "${message}" to user ${user.name}`);
                NotificationManager.sendNotification(message);
            }
            user.items[i].lastNumberOfItems = numberOfItems;
        }

        updateUser(user);
    }
    return users;
}
