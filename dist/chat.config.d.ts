import { IChatHooks } from './entities';
/**
 * this configuration is ONLY for chat
 */
export interface IChatConfig {
    loglevel?: string;
    chatClientLoglevel?: string;
    chatMessagesAmount?: number;
    automaticHandleTokenExpired?: boolean;
    hooks: IChatHooks;
}
export declare const chatConfigDefault: IChatConfig;
