import { IChannel } from './channel.interface';
export interface IMessage {
    /** provider object reference */
    _reference?: any;
    id: string;
    author: string;
    msg: string;
    timestamp: number;
    updated?: number;
    updatedBy?: string;
    channel?: IChannel;
}
