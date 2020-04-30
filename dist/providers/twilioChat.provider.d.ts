import { IChannel, IChatHooks, IChatProvider, IMessage, IUser, IChannelBase } from '../entities';
interface ITwilioConfig {
    /**
     * url of serverless that provide the token
     */
    tokenProvider: string;
    /**
     * 'trace', 'debug', 'info', 'warn', 'error' or 'silent'
     */
    loglevel?: string;
    /**
     * twilio needs it
     */
    device?: string;
    /**
     * how many messages fetch
     */
    chatMessagesAmount?: number;
    headers?: Map<string, string>;
}
export declare class TwilioChatProvider implements IChatProvider {
    private config;
    private client;
    private _status;
    name: string;
    version: string;
    hooks: IChatHooks;
    constructor(options: ITwilioConfig);
    status: string;
    updateToken(user: IUser): Promise<void>;
    login(user: IUser): Promise<IUser>;
    logout(): Promise<any>;
    getChannel(channel: IChannel): Promise<IChannel>;
    getChannelById(id: string): Promise<IChannel>;
    /**
     * remember, just descriptors it does not a real channel
     */
    getChannels(): Promise<IChannel[]>;
    getChannelsFromUser(): Promise<IChannel[]>;
    createChannel(channel: IChannelBase): Promise<IChannel>;
    joinChannel(channelId: string): Promise<IChannel>;
    joinUserChannel(channelId: string, userId: string): Promise<IChannel>;
    inviteChannel(channelId: string, userId: string): Promise<any>;
    declineChannel(channelId: string): Promise<IChannel>;
    leaveChannel(channelId: string): Promise<IChannel | void>;
    deleteChannel(channelId: string): Promise<IChannel>;
    getUserById(id: string): Promise<IUser>;
    getUsersByChannel(channelId: string): Promise<IUser[]>;
    removeUserFromChannel(channelId: string, userId: string): Promise<any>;
    getMessages(channelId: string, amount: number): Promise<IMessage[]>;
    sendMessage(channelId: string, msg: string): Promise<any>;
    markReadAllMessages(channel: IChannel): Promise<void>;
    typing(channelId: string): Promise<void>;
    deleteMessage(message: IMessage): Promise<any>;
    editMessage(message: IMessage): Promise<IMessage>;
    private mergeOptions;
    private bindingEvents;
    private validationClient;
    private getDateUpdatedOrCreated;
    private getLastUpdateFromState;
    private getLastUpdate;
    private getMessagesCount;
    private convertToChannel;
    private convertToUser;
    private convertToMessage;
    private sortChannelsByName;
    private sortChannelsByDate;
    private fetchAccessToken;
    private resolveToken;
}
export {};
