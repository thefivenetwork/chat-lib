"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
function noop() {
}
exports.noop = noop;
class Log {
    static set loglevel(value) {
        Log._loglevel = Log.convertLoglevel(value);
    }
    static convertLoglevel(level) {
        const index = Log.levels.indexOf(level);
        if (index === -1) {
            console.warn('Loglevel invalid on common module');
        }
        return index;
    }
    static trace(...messages) {
        if (Log._loglevel === 0) {
            console.trace(...messages);
        }
    }
    static event(...eventName) {
        if (Log._loglevel <= 1) {
            console.warn('[Event:', ...eventName, new Date().toISOString(), ']');
        }
    }
    static info(...messages) {
        if (Log._loglevel <= 1) {
            console.info(...messages);
        }
    }
    static group(...messages) {
        if (Log._loglevel <= 1) {
            console.group(...messages);
        }
    }
    static groupEnd() {
        if (Log._loglevel <= 2) {
            console.groupEnd();
        }
    }
    static log(...messages) {
        if (Log._loglevel <= 2) {
            console.log(...messages);
        }
    }
    static warn(...messages) {
        if (Log._loglevel <= 3) {
            console.warn(...messages);
        }
    }
    static error(...messages) {
        if (Log._loglevel <= 4) {
            console.error(...messages);
        }
    }
}
// be careful with the order, is important!
Log.levels = [
    'trace',
    'info',
    'log',
    'warn',
    'error',
    'silent'
];
Log._loglevel = Log.convertLoglevel(config_1.generalConfig.loglevel);
exports.Log = Log;
