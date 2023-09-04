'use strict';

var jsSdkUtils = require('@convertcom/js-sdk-utils');
var jsSdkEnums = require('@convertcom/js-sdk-enums');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var DEFAULT_KEYS_CASE_SENSITIVE = true;
var DEFAULT_NEGATION = '!';
/**
 * Provides rule processing calculations with corresponding comparisons methods
 * @category Modules
 * @constructor
 * @implements {RuleManagerInterface}
 */
var RuleManager = /** @class */ (function () {
    /**
     * @param {Config=} config
     * @param {Object=} dependencies
     * @param {LogManagerInterface=} dependencies.loggerManager
     */
    function RuleManager(config, _a) {
        var _b = _a === void 0 ? {} : _a, loggerManager = _b.loggerManager;
        this._comparisonProcessor = jsSdkUtils.Comparisons;
        this._negation = DEFAULT_NEGATION;
        this._keys_case_sensitive = DEFAULT_KEYS_CASE_SENSITIVE;
        this._loggerManager = loggerManager;
        this._comparisonProcessor = jsSdkUtils.objectDeepValue(config, 'rules.comparisonProcessor', jsSdkUtils.Comparisons);
        this._negation = String(jsSdkUtils.objectDeepValue(config, 'rules.negation', DEFAULT_NEGATION)).valueOf();
        this._keys_case_sensitive = jsSdkUtils.objectDeepValue(config, 'rules.keys_case_sensitive', DEFAULT_KEYS_CASE_SENSITIVE, true);
        // eslint-disable-line
    }
    Object.defineProperty(RuleManager.prototype, "comparisonProcessor", {
        /**
         * Getter for comparison processor
         */
        get: function () {
            return this._comparisonProcessor;
        },
        /**
         * Setter for comparison processor
         * @param {Record<string, any>} comparisonProcessor
         */
        set: function (comparisonProcessor) {
            this._comparisonProcessor = comparisonProcessor;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Retrieve comparison methods from comparison processor
     * @return {Array<string>} List of methods of comparison processor
     */
    RuleManager.prototype.getComparisonProcessorMethods = function () {
        var _this = this;
        return Object.getOwnPropertyNames(this._comparisonProcessor).filter(function (name) { return typeof _this._comparisonProcessor[name] === 'function'; });
    };
    /**
     * Check input data matching to rule set
     * @param {Record<string, any>} data Single value or key-value data set to compare
     * @param {RuleSet} ruleSet
     * @return {boolean | RuleError}
     */
    RuleManager.prototype.isRuleMatched = function (data, ruleSet) {
        var _a, _b, _c, _d, _e, _f;
        // eslint-disable-line
        // Top OR level
        var match;
        if (Object.prototype.hasOwnProperty.call(ruleSet, 'OR') &&
            jsSdkUtils.arrayNotEmpty(ruleSet === null || ruleSet === void 0 ? void 0 : ruleSet.OR)) {
            for (var i = 0, l = ruleSet.OR.length; i < l; i++) {
                match = this._processAND(data, ruleSet.OR[i]);
                if (Object.values(jsSdkEnums.RuleError).includes(match)) {
                    (_b = (_a = this._loggerManager) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.call(_a, jsSdkEnums.ERROR_MESSAGES.RULE_ERROR);
                }
                else {
                    (_d = (_c = this._loggerManager) === null || _c === void 0 ? void 0 : _c.info) === null || _d === void 0 ? void 0 : _d.call(_c, match === false
                        ? jsSdkEnums.MESSAGES.RULES_NOT_MATCH
                        : jsSdkEnums.MESSAGES.RULES_MATCH.replace('#', String(i)));
                }
                if (match !== false) {
                    return match;
                }
            }
        }
        else {
            (_f = (_e = this._loggerManager) === null || _e === void 0 ? void 0 : _e.warn) === null || _f === void 0 ? void 0 : _f.call(_e, jsSdkEnums.ERROR_MESSAGES.RULE_NOT_VALID);
        }
        return false;
    };
    /**
     * Check is rule object valid
     * @param {Rule} rule
     * @return {boolean}
     */
    RuleManager.prototype.isValidRule = function (rule) {
        // eslint-disable-line
        return (Object.prototype.hasOwnProperty.call(rule, 'matching') &&
            typeof rule.matching === 'object' &&
            Object.prototype.hasOwnProperty.call(rule.matching, 'match_type') &&
            typeof rule.matching.match_type === 'string' &&
            Object.prototype.hasOwnProperty.call(rule.matching, 'negated') &&
            typeof rule.matching.negated === 'boolean' &&
            Object.prototype.hasOwnProperty.call(rule, 'value'));
    };
    /**
     * Process AND block of rule set. Return first false if found
     * @param {Record<string, any>} data Single value or key-value data set to compare
     * @param {RuleAnd} rulesSubset
     * @return {boolean | RuleError}
     * @private
     */
    RuleManager.prototype._processAND = function (data, rulesSubset) {
        var _a, _b, _c, _d;
        // Second AND level
        var match;
        if (Object.prototype.hasOwnProperty.call(rulesSubset, 'AND') &&
            jsSdkUtils.arrayNotEmpty(rulesSubset === null || rulesSubset === void 0 ? void 0 : rulesSubset.AND)) {
            for (var i = 0, l = rulesSubset.AND.length; i < l; i++) {
                match = this._processORWHEN(data, rulesSubset.AND[i]);
                if (match === false) {
                    return false;
                }
            }
            if (match !== false) {
                (_b = (_a = this._loggerManager) === null || _a === void 0 ? void 0 : _a.info) === null || _b === void 0 ? void 0 : _b.call(_a, jsSdkEnums.MESSAGES.RULES_MATCH_AND);
            }
            return match;
        }
        else {
            (_d = (_c = this._loggerManager) === null || _c === void 0 ? void 0 : _c.warn) === null || _d === void 0 ? void 0 : _d.call(_c, jsSdkEnums.ERROR_MESSAGES.RULE_NOT_VALID);
        }
        return false;
    };
    /**
     * Process OR block of rule set. Return first true if found
     * @param {Record<string, any>} data Single value or key-value data set to compare
     * @param {RuleOrWhen} rulesSubset
     * @return {boolean | RuleError}
     * @private
     */
    RuleManager.prototype._processORWHEN = function (data, rulesSubset) {
        var _a, _b;
        // Third OR level. Called OR_WHEN.
        var match;
        if (Object.prototype.hasOwnProperty.call(rulesSubset, 'OR_WHEN') &&
            jsSdkUtils.arrayNotEmpty(rulesSubset === null || rulesSubset === void 0 ? void 0 : rulesSubset.OR_WHEN)) {
            for (var i = 0, l = rulesSubset.OR_WHEN.length; i < l; i++) {
                match = this._processRuleItem(data, rulesSubset.OR_WHEN[i]);
                if (match !== false) {
                    return match;
                }
            }
        }
        else {
            (_b = (_a = this._loggerManager) === null || _a === void 0 ? void 0 : _a.warn) === null || _b === void 0 ? void 0 : _b.call(_a, jsSdkEnums.ERROR_MESSAGES.RULE_NOT_VALID);
        }
        return false;
    };
    /**
     * Process single rule item
     * @param {Record<string, any>} data Single value or key-value data set to compare
     * @param {Rule} rule A single rule to compare
     * @return {boolean | RuleError} Comparison result
     * @private
     */
    RuleManager.prototype._processRuleItem = function (data, rule) {
        var e_1, _a, e_2, _b;
        var _c, _d, _e, _f, _g, _h, _j, _k;
        if (this.isValidRule(rule)) {
            try {
                var negation = rule.matching.negated || false;
                var matching = rule.matching.match_type;
                if (this.getComparisonProcessorMethods().indexOf(matching) !== -1) {
                    if (typeof data === 'object') {
                        // Validate data key-value set.
                        if (data.constructor === Object) {
                            try {
                                // Rule object has to have `key` field
                                for (var _l = __values(Object.keys(data)), _m = _l.next(); !_m.done; _m = _l.next()) {
                                    var key = _m.value;
                                    var k = this._keys_case_sensitive ? key : key.toLowerCase();
                                    var rule_k = this._keys_case_sensitive
                                        ? rule.key
                                        : rule.key.toLowerCase();
                                    if (k === rule_k) {
                                        return this._comparisonProcessor[matching](data[key], rule.value, negation);
                                    }
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_m && !_m.done && (_a = _l.return)) _a.call(_l);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        }
                        else if (rule === null || rule === void 0 ? void 0 : rule.rule_type) {
                            // Rule object has to have `rule_type` field
                            (_d = (_c = this._loggerManager) === null || _c === void 0 ? void 0 : _c.info) === null || _d === void 0 ? void 0 : _d.call(_c, jsSdkEnums.MESSAGES.RULE_MATCH_START.replace('#', rule.rule_type));
                            try {
                                for (var _o = __values(Object.getOwnPropertyNames(data.constructor.prototype)), _p = _o.next(); !_p.done; _p = _o.next()) {
                                    var method = _p.value;
                                    if (method === 'constructor')
                                        continue;
                                    var rule_method = jsSdkUtils.camelCase("get ".concat(rule.rule_type.replace(/_/g, ' ')));
                                    if (method === rule_method) {
                                        var dataValue = data[method](rule);
                                        if (Object.values(jsSdkEnums.RuleError).includes(dataValue))
                                            return dataValue;
                                        if (rule.rule_type === 'js_condition')
                                            return dataValue;
                                        return this._comparisonProcessor[matching](dataValue, rule.value, negation);
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (_p && !_p.done && (_b = _o.return)) _b.call(_o);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                    }
                    else {
                        (_f = (_e = this._loggerManager) === null || _e === void 0 ? void 0 : _e.warn) === null || _f === void 0 ? void 0 : _f.call(_e, 'RuleManager._processRule()', {
                            warn: jsSdkEnums.ERROR_MESSAGES.RULE_DATA_NOT_VALID
                        });
                    }
                }
            }
            catch (error) {
                (_h = (_g = this._loggerManager) === null || _g === void 0 ? void 0 : _g.error) === null || _h === void 0 ? void 0 : _h.call(_g, 'RuleManager._processRule()', {
                    error: error.message
                });
            }
        }
        else {
            (_k = (_j = this._loggerManager) === null || _j === void 0 ? void 0 : _j.warn) === null || _k === void 0 ? void 0 : _k.call(_j, jsSdkEnums.ERROR_MESSAGES.RULE_NOT_VALID);
        }
        return false;
    };
    return RuleManager;
}());

exports.RuleManager = RuleManager;
//# sourceMappingURL=index.js.map
