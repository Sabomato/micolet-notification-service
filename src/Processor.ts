interface IUser {
    name: string;
    topic: string;
    items: IItem[];
}

interface IItem {
    name: string;
    url: string;
    lastNumberOfItems: number;
}

interface IProcessor {
    process(users: IUser[]): Promise<void>;
}
