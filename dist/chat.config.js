"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
exports.chatConfigDefault = {
    loglevel: utils_1.generalConfig.loglevel,
    chatClientLoglevel: 'error',
    chatMessagesAmount: 100,
    automaticHandleTokenExpired: true,
    hooks: {},
};
