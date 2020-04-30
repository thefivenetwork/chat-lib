"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_chat_js_1 = __importDefault(require("twilio-chat/dist/twilio-chat.js"));
const chat_constants_1 = require("../chat.constants");
const utils_1 = require("../utils");
class TwilioChatProvider {
    constructor(options) {
        this.client = null;
        this._status = '';
        this.name = 'twilio';
        this.version = twilio_chat_js_1.default.version;
        this.hooks = {};
        this.getDateUpdatedOrCreated = (channel) => {
            if (channel.dateUpdated) {
                return new Date(channel.dateUpdated);
            }
            else if (channel.dateCreated) {
                return new Date(channel.dateCreated);
            }
            else {
                return new Date(0);
            }
        };
        this.getLastUpdateFromState = (state) => {
            if (state.lastMessage && state.lastMessage.timestamp) {
                return state.lastMessage.timestamp;
            }
            else {
                return this.getDateUpdatedOrCreated(state);
            }
        };
        this.getLastUpdate = (channel) => {
            if (channel.lastMessage && channel.lastMessage.timestamp) {
                return new Date(channel.lastMessage.timestamp);
            }
            else if (channel.lastUpdate) {
                return this.getDateUpdatedOrCreated(channel);
            }
            else if (channel.state) {
                return this.getLastUpdateFromState(channel.state);
            }
            else if (channel._reference) {
                return this.getDateUpdatedOrCreated(channel._reference);
            }
            else {
                return this.getDateUpdatedOrCreated(channel);
            }
        };
        this.getMessagesCount = (channel) => {
            if (channel.messagesCount) {
                return channel.messagesCount;
            }
            else if (channel.state && channel.state.lastMessage && channel.state.lastMessage.index) {
                return channel.state.lastMessage.index;
            }
            else {
                return 0;
            }
        };
        this.convertToChannel = (channel) => {
            // channel
            return {
                _reference: channel,
                id: channel.uniqueName,
                sid: channel.sid,
                name: channel.friendlyName,
                public: (channel.type === 'public'),
                invited: (channel.status === 'invited'),
                joined: (channel.status === 'joined'),
                messagesCount: this.getMessagesCount(channel),
                lastMessageRead: channel.lastConsumedMessageIndex ? channel.lastConsumedMessageIndex + 1 : 0,
                lastUpdate: this.getLastUpdate(channel),
                lastIndex: channel.lastMessage && channel.lastMessage.index ? channel.lastMessage.index : 0,
                membersCount: channel.membersCount || 0
            };
        };
        this.status = chat_constants_1.ChatStatus.disconnected;
        this.config = this.mergeOptions(options);
    }
    set status(status) {
        const oldStatus = this._status;
        this._status = status;
        if (this.hooks.connectionStateChanged) {
            this.hooks.connectionStateChanged(status, oldStatus);
        }
    }
    get status() {
        return this._status;
    }
    updateToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.resolveToken(user);
            return this.client.updateToken(token);
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.resolveToken(user);
            this.client = yield twilio_chat_js_1.default.create(token, { logLevel: this.config.loglevel });
            this.status = chat_constants_1.ChatStatus.connected;
            this.bindingEvents();
            yield this.client.user.updateFriendlyName(user.name);
            return this.convertToUser(this.client.user);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client.shutdown();
        });
    }
    getChannel(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            return this.getChannelById(channel.id);
        });
    }
    getChannelById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.client.getChannelByUniqueName(id);
            return this.convertToChannel(channel);
        });
    }
    /**
     * remember, just descriptors it does not a real channel
     */
    getChannels() {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const page = yield this.client.getPublicChannelDescriptors();
            return this.sortChannelsByDate(this.sortChannelsByName(page.items).map(this.convertToChannel));
        });
    }
    getChannelsFromUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const page = yield this.client.getUserChannelDescriptors();
            return this.sortChannelsByDate(this.sortChannelsByName(page.items).map((items) => {
                return this.convertToChannel(items);
            }));
        });
    }
    createChannel(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const _channel = yield this.client.createChannel({
                uniqueName: channel.id,
                friendlyName: channel.name,
                isPrivate: !channel.public
            });
            return this.convertToChannel(_channel);
        });
    }
    joinChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            let channel = yield this.getChannelById(channelId);
            channel = yield channel._reference.join();
            return this.convertToChannel(channel);
        });
    }
    joinUserChannel(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.getChannelById(channelId);
            return channel._reference.add(userId);
        });
    }
    inviteChannel(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.getChannelById(channelId);
            return channel._reference.invite(userId);
        });
    }
    declineChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.getChannelById(channelId);
            return channel._reference.decline();
        });
    }
    leaveChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.getChannelById(channelId);
            if (channel.joined) {
                // TODO
                // channel._reference.removeListener('messageAdded', updateUnreadMessages);
                return channel._reference.leave();
            }
        });
    }
    deleteChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.getChannelById(channelId);
            // TODO
            // channel._reference.removeListener('messageAdded', updateUnreadMessages);
            return channel._reference.delete();
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            return this.client.getUserDescriptor(id).then(this.convertToUser);
        });
    }
    getUsersByChannel(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.getChannelById(channelId);
            const members = yield channel._reference.getMembers();
            return Promise.all(members.map((member) => __awaiter(this, void 0, void 0, function* () {
                return yield member.getUser().then(this.convertToUser);
            })));
        });
    }
    removeUserFromChannel(channelId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.getChannelById(channelId);
            return channel._reference.removeMember(userId);
        });
    }
    getMessages(channelId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.getChannelById(channelId);
            const page = yield channel._reference.getMessages(amount);
            return page.items.map((message) => this.convertToMessage(message));
        });
    }
    sendMessage(channelId, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.getChannelById(channelId);
            return channel._reference.sendMessage(msg);
        });
    }
    markReadAllMessages(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            return channel._reference.setAllMessagesConsumed();
        });
    }
    typing(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validationClient();
            const channel = yield this.getChannelById(channelId);
            return channel._reference.typing();
        });
    }
    deleteMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return message._reference.remove();
        });
    }
    editMessage(message) {
        return message._reference.updateBody(message.msg).then(this.convertToMessage);
    }
    mergeOptions(options) {
        const headers = new Map();
        headers.set('Content-Type', 'application/json; charset=utf-8');
        const optionsDefault = {
            loglevel: 'warn',
            tokenProvider: '',
            device: 'browser',
            chatMessagesAmount: 30,
        };
        this.config = Object.assign({}, optionsDefault, options);
        this.config.headers = this.config.headers ? new Map([...headers, ...this.config.headers]) : headers;
        // intentionally
        return this.config;
    }
    bindingEvents() {
        this.client.on('tokenAboutToExpire', () => {
            utils_1.Log.event('tokenAboutToExpire');
            return this.hooks.tokenAboutToExpire && this.hooks.tokenAboutToExpire();
        });
        this.client.on('connectionStateChanged', (state) => {
            utils_1.Log.event('connectionStateChanged', state);
            let rState = '';
            switch (state) {
                case 'connected':
                    rState = chat_constants_1.ChatStatus.connected;
                    break;
                case 'connecting':
                    rState = chat_constants_1.ChatStatus.connecting;
                    break;
                case 'disconnecting':
                    rState = chat_constants_1.ChatStatus.disconnecting;
                    break;
                case 'disconnected':
                    rState = chat_constants_1.ChatStatus.disconnected;
                    break;
                default:
                    rState = chat_constants_1.ChatStatus.unknown;
                    utils_1.Log.warn('Unknown state by twilio');
            }
            this.status = rState;
        });
        this.client.user.on('updated', (data) => {
            utils_1.Log.event('userUpdated');
            const user = this.convertToUser(data.user);
            return this.hooks.userUpdated && this.hooks.userUpdated(user);
        });
        /**
         * be careful, only works with channels JOINED
         */
        this.client.on('channelAdded', (channel) => {
            utils_1.Log.event('channelAdded');
            const _channel = this.convertToChannel(channel);
            return this.hooks.channelAdded && this.hooks.channelAdded(_channel);
        });
        this.client.on('channelJoined', (channel) => {
            utils_1.Log.event('channelJoined');
            const _channel = this.convertToChannel(channel);
            _channel._reference.on('messageAdded', (message) => {
                utils_1.Log.event('messageAdded');
                message = this.convertToMessage(message);
                return this.hooks.messageAdded && this.hooks.messageAdded(message);
            });
            _channel._reference.on('messageUpdated', (message) => {
                utils_1.Log.event('messageUpdated');
                message = this.convertToMessage(message);
                return this.hooks.messageUpdated && this.hooks.messageUpdated(message);
            });
            _channel._reference.on('messageRemoved', (message) => {
                utils_1.Log.event('messageRemoved');
                message = this.convertToMessage(message);
                return this.hooks.messageRemoved && this.hooks.messageRemoved(message);
            });
            return this.hooks.channelJoined && this.hooks.channelJoined(_channel);
        });
        this.client.on('channelUpdated', (channel) => {
            utils_1.Log.event('channelUpdated');
            const _channel = this.convertToChannel(channel.channel);
            return this.hooks.channelUpdated && this.hooks.channelUpdated(_channel, channel.updateReasons);
        });
        this.client.on('channelInvited', (channel) => {
            utils_1.Log.event('channelInvited');
            const _channel = this.convertToChannel(channel);
            return this.hooks.channelInvited && this.hooks.channelInvited(_channel);
        });
        this.client.on('channelLeft', (channel) => {
            utils_1.Log.event('channelLeft');
            const _channel = this.convertToChannel(channel);
            return this.hooks.channelLeft && this.hooks.channelLeft(_channel);
        });
        this.client.on('channelRemoved', (channel) => {
            utils_1.Log.event('channelRemoved');
            const _channel = this.convertToChannel(channel);
            return this.hooks.channelRemoved && this.hooks.channelRemoved(_channel);
        });
        this.client.on('memberJoined', (user) => {
            utils_1.Log.event('memberJoined');
            const _user = this.convertToUser(user);
            return this.hooks.userJoined && this.hooks.userJoined(_user);
        });
        this.client.on('memberLeft', (user) => {
            utils_1.Log.event('memberLeft');
            const _user = this.convertToUser(user);
            return this.hooks.userLeft && this.hooks.userLeft(_user);
        });
        this.client.on('typingStarted', (member) => __awaiter(this, void 0, void 0, function* () {
            utils_1.Log.event('typingStarted');
            const user = yield member.getUser();
            const _user = this.convertToUser(user);
            return this.hooks.typingStarted && this.hooks.typingStarted(_user);
        }));
        this.client.on('typingEnded', (member) => __awaiter(this, void 0, void 0, function* () {
            utils_1.Log.event('typingEnded');
            const user = yield member.getUser();
            const _user = this.convertToUser(user);
            return this.hooks.typingEnded && this.hooks.typingEnded(_user);
        }));
    }
    validationClient() {
        if (!this.client) {
            throw new Error('Client did not initialized, you need to do the login');
        }
    }
    convertToUser(item) {
        return {
            _reference: item,
            name: item.friendlyName || item.identity,
            id: item.identity,
            online: item.online
        };
    }
    convertToMessage(msg) {
        return {
            _reference: msg,
            id: msg.sid,
            author: msg.author,
            msg: msg.body,
            timestamp: msg.timestamp,
            updated: msg.dateUpdated,
            updatedBy: msg.lastUpdatedBy,
            channel: this.convertToChannel(msg.channel)
        };
    }
    sortChannelsByName(channels) {
        return channels.sort((a, b) => {
            return a.friendlyName.localeCompare(b.friendlyName);
        });
    }
    sortChannelsByDate(channels) {
        return channels.sort((a, b) => a.lastUpdate < b.lastUpdate ? 1 : -1);
    }
    fetchAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {};
            if (this.config.headers) {
                this.config.headers.forEach((value, key) => {
                    headers[key] = value;
                });
            }
            try {
                const r = yield fetch(`${this.config.tokenProvider}`, {
                    headers,
                    method: 'POST',
                    body: JSON.stringify({
                        identity: user.id,
                        device: this.config.device
                    })
                });
                return yield r.json();
            }
            catch (e) {
                this.status = chat_constants_1.ChatStatus.getTokenFailed;
                throw new Error('Failed to fetch the Access Token with error');
            }
        });
    }
    resolveToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.status = chat_constants_1.ChatStatus.preToken;
            const tokenPkg = yield this.fetchAccessToken(user);
            this.status = chat_constants_1.ChatStatus.tokened;
            return tokenPkg.token;
        });
    }
}
exports.TwilioChatProvider = TwilioChatProvider;
