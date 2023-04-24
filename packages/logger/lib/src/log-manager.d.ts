/*!
 * Convert JS SDK
 * Version 1.0.0
 * Copyright(c) 2020 Convert Insights, Inc
 * License Apache-2.0
 */
import { LogLevel } from '@convertcom/enums';
import { LogMethodMapInterface } from './interfaces/log-method-map';
import { LogManagerInterface } from './interfaces/log-manager';
/**
 * Provides logging logic
 * @category Modules
 * @constructor
 * @implements {LogManagerInterface}
 */
export declare class LogManager implements LogManagerInterface {
    private _clients;
    private _defaultMapper;
    /**
     * @param {Record<any, any>=} sdk
     * @param {LogLevel=} level
     * @param {LogMethodMapInterface=} mapper
     */
    constructor(sdk?: Record<any, any>, level?: LogLevel, mapper?: LogMethodMapInterface);
    private _isValidLevel;
    private _isValidMethod;
    private _log;
    /**
     * @param {LogLevel} level
     * @param {Array<any>} args
     */
    log(level: LogLevel, ...args: any[]): void;
    /**
     * @param {Array<any>} args
     */
    trace(...args: any[]): void;
    /**
     * @param {Array<any>} args
     */
    debug(...args: any[]): void;
    /**
     * @param {Array<any>} args
     */
    info(...args: any[]): void;
    /**
     * @param {Array<any>} args
     */
    warn(...args: any[]): void;
    /**
     * @param {Array<any>} args
     */
    error(...args: any[]): void;
    /**
     * @param {Record<any, any>=} sdk
     * @param {LogLevel=} level
     * @param {LogMethodMapInterface=} methodMap
     */
    addClient(sdk?: Record<any, any>, level?: LogLevel, methodMap?: LogMethodMapInterface): void;
}