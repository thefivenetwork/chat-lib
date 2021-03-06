import { IChannel, IChatHooks, IChatProvider, IChatService, IMessage, IUser, IChannelBase } from './entities';
import { IChatConfig } from './chat.config';
export declare class ChatService implements IChatService {
    private chatProvider;
    private config;
    private user;
    private typingMembers;
    constructor(chatProvider: IChatProvider, customConfig: IChatConfig);
    readonly hooks: IChatHooks;
    readonly status: string;
    login(user: IUser): Promise<IUser>;
    logout(): Promise<any>;
    getChannel(channel: IChannel): Promise<IChannel>;
    getChannelById(id: string): Promise<IChannel>;
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
    getMessages(channelId: string, amount?: number): Promise<IMessage[]>;
    sendMessage(channelId: string, msg: string): Promise<any>;
    markReadAllMessages(channel: IChannel): Promise<void>;
    typing(channelId: string): Promise<void>;
    deleteMessage(message: IMessage): Promise<any>;
    editMessage(message: IMessage): Promise<IMessage>;
    readonly version: {
        providerName: string;
        providerVersion: string;
        version: string;
    };
    private typingStarted;
    private typingEnded;
    private typingStartedResolved;
    private typingEndedResolved;
    private tokenAboutToExpireHandler;
    private buildTypingIndicator;
}
