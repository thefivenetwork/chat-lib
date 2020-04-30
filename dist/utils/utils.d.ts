export declare function noop(): void;
export declare class Log {
    static levels: string[];
    private static _loglevel;
    static loglevel: string;
    private static convertLoglevel;
    static trace(...messages: any): void;
    static event(...eventName: any): void;
    static info(...messages: any): void;
    static group(...messages: any): void;
    static groupEnd(): void;
    static log(...messages: any): void;
    static warn(...messages: any): void;
    static error(...messages: any): void;
}
