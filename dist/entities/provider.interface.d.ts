import { IUser } from './user.interface';
import { IChannel, IChannelBase } from './channel.interface';
import { IMessage } from './message.interface';
export interface IChatService {
    hooks: IChatHooks;
    status: string;
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
    typing(channelId: string): Promise<void>;
    deleteMessage(message: IMessage): Promise<any>;
    editMessage(message: IMessage): Promise<IMessage>;
    markReadAllMessages(channel: IChannel): Promise<void>;
}
export interface IChatProvider extends IChatService {
    name: string;
    version: string;
    updateToken(user: IUser): Promise<void>;
}
export interface IChatHooks {
    tokenAboutToExpire?(): void;
    connectionStateChanged?(state: string, oldStatus?: string): void;
    userUpdated?(data: IUser): void;
    channelAdded?(channel: IChannel): void;
    channelJoined?(channel: IChannel): void;
    channelUpdated?(channel: IChannel, reason: any): void;
    channelInvited?(channel: IChannel): void;
    channelLeft?(channel: IChannel): void;
    channelRemoved?(channel: IChannel): void;
    userJoined?(user: IUser): void;
    userLeft?(user: IUser): void;
    messageAdded?(message: IMessage): void;
    messageUpdated?(message: IMessage): void;
    messageRemoved?(message: IMessage): void;
    typingStarted?(user: IUser): void;
    typingEnded?(user: IUser): void;
    typingStartedResolved?(result: string): void;
    typingEndedResolved?(result: string): void;
}
