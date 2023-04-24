'use strict';

var enums = require('@convertcom/enums');

/*!
 * Convert JS SDK
 * Version 1.0.0
 * Copyright(c) 2020 Convert Insights, Inc
 * License Apache-2.0
 */
const DEFAULT_LOG_LEVEL = enums.LogLevel.TRACE;
/**
 * Provides logging logic
 * @category Modules
 * @constructor
 * @implements {LogManagerInterface}
 */
class LogManager {
    /**
     * @param {Record<any, any>=} sdk
     * @param {LogLevel=} level
     * @param {LogMethodMapInterface=} mapper
     */
    constructor(sdk = console, level = DEFAULT_LOG_LEVEL, mapper) {
        this._defaultMapper = {
            [enums.LogMethod.LOG]: enums.LogMethod.LOG,
            [enums.LogMethod.DEBUG]: enums.LogMethod.DEBUG,
            [enums.LogMethod.INFO]: enums.LogMethod.INFO,
            [enums.LogMethod.WARN]: enums.LogMethod.WARN,
            [enums.LogMethod.ERROR]: enums.LogMethod.ERROR
        };
        this._clients = [];
        this.addClient(sdk, level, mapper);
    }
    _isValidLevel(level) {
        return Object.values(enums.LogLevel).includes(level);
    }
    _isValidMethod(method) {
        return Object.values(enums.LogMethod).includes(method);
    }
    _log(method, level, ...args) {
        this._clients.forEach((client) => {
            if (level >= client.level && enums.LogLevel.SILENT !== level) {
                const fn = client.sdk[client.mapper[method]];
                if (fn) {
                    fn.call(client.sdk, ...args);
                }
                else {
                    console.log(`Info: Unable to find method "${method}()" in client sdk:`, client.sdk.constructor.name);
                    console[method](...args);
                }
            }
        });
    }
    /**
     * @param {LogLevel} level
     * @param {Array<any>} args
     */
    log(level, ...args) {
        if (!this._isValidLevel(level)) {
            // throw new Error('Invalid Log Level');
            console.error('Invalid Log Level');
            return;
        }
        this._log(enums.LogMethod.LOG, level, ...args);
    }
    /**
     * @param {Array<any>} args
     */
    trace(...args) {
        this._log(enums.LogMethod.LOG, enums.LogLevel.TRACE, ...args);
    }
    /**
     * @param {Array<any>} args
     */
    debug(...args) {
        this._log(enums.LogMethod.DEBUG, enums.LogLevel.DEBUG, ...args);
    }
    /**
     * @param {Array<any>} args
     */
    info(...args) {
        this._log(enums.LogMethod.INFO, enums.LogLevel.INFO, ...args);
    }
    /**
     * @param {Array<any>} args
     */
    warn(...args) {
        this._log(enums.LogMethod.WARN, enums.LogLevel.WARN, ...args);
    }
    /**
     * @param {Array<any>} args
     */
    error(...args) {
        this._log(enums.LogMethod.ERROR, enums.LogLevel.ERROR, ...args);
    }
    /**
     * @param {Record<any, any>=} sdk
     * @param {LogLevel=} level
     * @param {LogMethodMapInterface=} methodMap
     */
    addClient(sdk = console, level = DEFAULT_LOG_LEVEL, methodMap) {
        if (!sdk) {
            // throw new Error('Invalid Client SDK');
            console.error('Invalid Client SDK');
            return;
        }
        if (!this._isValidLevel(level)) {
            // throw new Error('Invalid Log Level');
            console.error('Invalid Log Level');
            return;
        }
        const mapper = Object.assign({}, this._defaultMapper);
        if (methodMap) {
            Object.keys(methodMap)
                .filter(this._isValidMethod)
                .forEach((method) => {
                mapper[method] = methodMap[method];
            });
        }
        this._clients.push({ sdk, level, mapper });
    }
}

exports.LogManager = LogManager;
//# sourceMappingURL=index.js.map
