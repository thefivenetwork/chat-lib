export interface IChannelBase {
    id: string;
    name: string;
    public: boolean;
}
export interface IChannel extends IChannelBase {
    /** provider object reference */
    _reference?: any;
    sid: string;
    invited: boolean;
    joined: boolean;
    messagesCount: number;
    lastMessageRead: number;
    lastUpdate: Date;
    membersCount: number;
    lastIndex: number;
}
