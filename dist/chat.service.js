"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_config_1 = require("./chat.config");
const utils_1 = require("./utils");
const version_1 = require("./utils/version");
class ChatService {
    constructor(chatProvider, customConfig) {
        this.typingMembers = new Set();
        this.config = Object.assign({}, chat_config_1.chatConfigDefault, customConfig, { hooks: Object.assign({}, chat_config_1.chatConfigDefault.hooks, customConfig.hooks) });
        this.user = { name: '', id: '' };
        utils_1.Log.loglevel = this.config.loglevel || '';
        this.chatProvider = chatProvider;
        // events to handlers
        this.hooks.tokenAboutToExpire = this.tokenAboutToExpireHandler.bind(this);
        this.hooks.typingStarted = this.typingStarted.bind(this);
        this.hooks.typingEnded = this.typingEnded.bind(this);
        this.hooks.connectionStateChanged = this.config.hooks.connectionStateChanged;
        this.hooks.userUpdated = this.config.hooks.userUpdated;
        this.hooks.channelAdded = this.config.hooks.channelAdded;
        this.hooks.channelJoined = this.config.hooks.channelJoined;
        this.hooks.channelUpdated = this.config.hooks.channelUpdated;
        this.hooks.channelInvited = this.config.hooks.channelInvited;
        this.hooks.channelLeft = this.config.hooks.channelLeft;
        this.hooks.channelRemoved = this.config.hooks.channelRemoved;
        this.hooks.userJoined = this.config.hooks.userJoined;
        this.hooks.userLeft = this.config.hooks.userLeft;
        this.hooks.userUpdated = this.config.hooks.userUpdated;
        this.hooks.messageAdded = this.config.hooks.messageAdded;
        this.hooks.messageUpdated = this.config.hooks.messageUpdated;
        this.hooks.messageRemoved = this.config.hooks.messageRemoved;
    }
    get hooks() {
        return this.chatProvider.hooks;
    }
    get status() {
        return this.chatProvider.status;
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = yield this.chatProvider.login(user);
            return this.user;
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chatProvider.logout();
            return this.user;
        });
    }
    getChannel(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.getChannel(channel);
        });
    }
    getChannelById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.getChannelById(id);
        });
    }
    getChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.getChannels();
        });
    }
    getChannelsFromUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.getChannelsFromUser();
        });
    }
    createChannel(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.createChannel(channel);
        });
    }
    joinChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.joinChannel(channelId);
        });
    }
    joinUserChannel(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.joinUserChannel(channelId, userId);
        });
    }
    inviteChannel(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.inviteChannel(channelId, userId);
        });
    }
    declineChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.declineChannel(channelId);
        });
    }
    leaveChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.leaveChannel(channelId);
        });
    }
    deleteChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.deleteChannel(channelId);
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.getUserById(id);
        });
    }
    getUsersByChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.getUsersByChannel(channelId);
        });
    }
    removeUserFromChannel(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.removeUserFromChannel(channelId, userId);
        });
    }
    getMessages(channelId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount == null) {
                amount = this.config.chatMessagesAmount;
            }
            return this.chatProvider.getMessages(channelId, amount);
        });
    }
    sendMessage(channelId, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.sendMessage(channelId, msg);
        });
    }
    markReadAllMessages(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.markReadAllMessages(channel);
        });
    }
    typing(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.chatProvider.typing(channelId);
        });
    }
    deleteMessage(message) {
        if (message) {
            return this.chatProvider.deleteMessage(message);
        }
        return Promise.resolve();
    }
    editMessage(message) {
        return this.chatProvider.editMessage(message);
    }
    get version() {
        return {
            providerName: this.chatProvider.name,
            providerVersion: this.chatProvider.version,
            version: version_1.version
        };
    }
    // interceptor
    typingStarted(user) {
        this.typingStartedResolved(user);
        const typingStartedFn = this.config.hooks.typingStarted;
        return typingStartedFn && typingStartedFn(user);
    }
    typingEnded(user) {
        this.typingEndedResolved(user);
        const typingEnded = this.config.hooks.typingEnded;
        return typingEnded && typingEnded(user);
    }
    typingStartedResolved(user) {
        const typingStartedResolvedFn = this.config.hooks.typingStartedResolved;
        if (typingStartedResolvedFn) {
            this.typingMembers.add(user.name);
            typingStartedResolvedFn(this.buildTypingIndicator());
        }
    }
    typingEndedResolved(user) {
        const typingEndedResolvedFn = this.config.hooks.typingEndedResolved;
        if (typingEndedResolvedFn) {
            this.typingMembers.delete(user.name);
            typingEndedResolvedFn(this.buildTypingIndicator());
        }
    }
    tokenAboutToExpireHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.config.automaticHandleTokenExpired) {
                yield this.chatProvider.updateToken(this.user);
                return this.config.hooks.tokenAboutToExpire && this.config.hooks.tokenAboutToExpire();
            }
            else {
                return this.config.hooks.tokenAboutToExpire && this.config.hooks.tokenAboutToExpire();
            }
        });
    }
    buildTypingIndicator() {
        let message = 'Typing: ';
        const names = Array.from(this.typingMembers).slice(0, 3);
        if (this.typingMembers.size) {
            message += names.join(', ');
        }
        if (this.typingMembers.size > 3) {
            message += ', and ' + (this.typingMembers.size - 3) + 'more';
        }
        if (this.typingMembers.size) {
            message += '...';
        }
        else {
            message = '';
        }
        return message;
    }
}
exports.ChatService = ChatService;
