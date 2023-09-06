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


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

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

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/*!
 * Convert JS SDK
 * Version 1.0.0
 * Copyright(c) 2020 Convert Insights, Inc
 * License Apache-2.0
 */
var DEFAULT_BATCH_SIZE = 1;
var DEFAULT_RELEASE_INTERVAL = 5000;
/**
 * Data Store wrapper
 * @category Modules
 * @constructor
 * @implements {DataStoreManagerInterface}
 */
var DataStoreManager = /** @class */ (function () {
    /**
     * @param {Config=} config
     * @param {Object=} dependencies
     * @param {Object=} dependencies.dataStore
     * @param {EventManagerInterface=} dependencies.eventManager
     * @param {LogManagerInterface=} dependencies.loggerManager
     */
    function DataStoreManager(config, _a) {
        var _b = _a === void 0 ? {} : _a, dataStore = _b.dataStore, eventManager = _b.eventManager, loggerManager = _b.loggerManager;
        this.batchSize = DEFAULT_BATCH_SIZE;
        this.releaseInterval = DEFAULT_RELEASE_INTERVAL;
        this._loggerManager = loggerManager;
        this._eventManager = eventManager;
        // TODO: Make this be configurable by config
        this.batchSize =
            // Number(objectDeepValue(config, 'events.batch_size')).valueOf() ||
            DEFAULT_BATCH_SIZE;
        this.releaseInterval =
            // Number(objectDeepValue(config, 'events.release_interval')).valueOf() ||
            DEFAULT_RELEASE_INTERVAL;
        this.dataStore = dataStore;
        this._requestsQueue = {};
    }
    DataStoreManager.prototype.set = function (key, data) {
        var _a, _b, _c, _d;
        try {
            (_b = (_a = this.dataStore) === null || _a === void 0 ? void 0 : _a.set) === null || _b === void 0 ? void 0 : _b.call(_a, key, data);
        }
        catch (error) {
            (_d = (_c = this._loggerManager) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.call(_c, 'DataStoreManager.set()', {
                error: error.message
            });
        }
    };
    DataStoreManager.prototype.get = function (key) {
        var _a, _b, _c, _d;
        try {
            return (_b = (_a = this.dataStore) === null || _a === void 0 ? void 0 : _a.get) === null || _b === void 0 ? void 0 : _b.call(_a, key);
        }
        catch (error) {
            (_d = (_c = this._loggerManager) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.call(_c, 'DataStoreManager.get()', {
                error: error.message
            });
        }
        return null;
    };
    DataStoreManager.prototype.enqueue = function (key, data) {
        // eslint-disable-line
        var addData = {};
        addData[key] = data;
        this._requestsQueue = jsSdkUtils.objectDeepMerge(this._requestsQueue, addData);
        if (Object.keys(this._requestsQueue).length >= this.batchSize) {
            this.releaseQueue('size');
        }
        else {
            if (Object.keys(this._requestsQueue).length === 1) {
                this.startQueue();
            }
        }
    };
    DataStoreManager.prototype.releaseQueue = function (reason) {
        var _a, _b;
        // eslint-disable-line
        this.stopQueue();
        for (var key in this._requestsQueue) {
            this.set(key, this._requestsQueue[key]);
        }
        (_b = (_a = this._eventManager) === null || _a === void 0 ? void 0 : _a.fire) === null || _b === void 0 ? void 0 : _b.call(_a, jsSdkEnums.SystemEvents.DATA_STORE_QUEUE_RELEASED, {
            reason: reason || ''
        });
    };
    DataStoreManager.prototype.stopQueue = function () {
        clearTimeout(this._requestsQueueTimerID);
    };
    DataStoreManager.prototype.startQueue = function () {
        var _this = this;
        this._requestsQueueTimerID = setTimeout(function () {
            _this.releaseQueue('timeout');
        }, this.releaseInterval);
    };
    Object.defineProperty(DataStoreManager.prototype, "dataStore", {
        /**
         * dataStore getter
         */
        get: function () {
            return this._dataStore;
        },
        /**
         * dataStore setter
         * @param {any=} dataStore
         */
        set: function (dataStore) {
            var _a, _b;
            if (dataStore) {
                if (this.isValidDataStore(dataStore)) {
                    this._dataStore = dataStore;
                }
                else {
                    (_b = (_a = this._loggerManager) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, jsSdkEnums.ERROR_MESSAGES.DATA_STORE_NOT_VALID);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Validates dataStore object
     * @param {any=} dataStore
     * @return {boolean}
     */
    DataStoreManager.prototype.isValidDataStore = function (dataStore) {
        return (typeof dataStore === 'object' &&
            typeof dataStore['get'] === 'function' &&
            typeof dataStore['set'] === 'function');
    };
    return DataStoreManager;
}());

var LOCAL_STORE_LIMIT = 10000;
/**
 * Provides logic for data. Stores bucket with help of dataStore if it's provided
 * @category Modules
 * @constructor
 * @implements {DataManagerInterface}
 */
var DataManager = /** @class */ (function () {
    /**
     * @param {Config} config
     * @param {Object} dependencies
     * @param {ApiManagerInterface} dependencies.apiManager
     * @param {BucketingManagerInterface} dependencies.bucketingManager
     * @param {RuleManagerInterface} dependencies.ruleManager
     * @param {LogManagerInterface} dependencies.loggerManager
     */
    function DataManager(config, _a) {
        var bucketingManager = _a.bucketingManager, ruleManager = _a.ruleManager, eventManager = _a.eventManager, apiManager = _a.apiManager, loggerManager = _a.loggerManager;
        var _b, _c, _d;
        this._dataEntities = jsSdkEnums.DATA_ENTITIES;
        this._localStoreLimit = LOCAL_STORE_LIMIT;
        this._bucketedVisitors = new Map();
        this._environment = config === null || config === void 0 ? void 0 : config.environment;
        this._apiManager = apiManager;
        this._bucketingManager = bucketingManager;
        this._ruleManager = ruleManager;
        this._loggerManager = loggerManager;
        this._eventManager = eventManager;
        this._config = config;
        this._data = jsSdkUtils.objectDeepValue(config, 'data');
        this._accountId = (_b = this._data) === null || _b === void 0 ? void 0 : _b.account_id;
        this._projectId = (_d = (_c = this._data) === null || _c === void 0 ? void 0 : _c.project) === null || _d === void 0 ? void 0 : _d.id;
        this.dataStoreManager = jsSdkUtils.objectDeepValue(config, 'dataStore');
        // eslint-disable-line
    }
    Object.defineProperty(DataManager.prototype, "data", {
        /**
         * data getter
         */
        get: function () {
            return this._data;
        },
        set: function (data) {
            var _a, _b, _c;
            if (this.isValidConfigData(data)) {
                this._data = data;
                this._accountId = data === null || data === void 0 ? void 0 : data.account_id;
                this._projectId = (_a = data === null || data === void 0 ? void 0 : data.project) === null || _a === void 0 ? void 0 : _a.id;
            }
            else {
                (_c = (_b = this._loggerManager) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.call(_b, jsSdkEnums.ERROR_MESSAGES.CONFIG_DATA_NOT_VALID);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DataManager.prototype, "dataStoreManager", {
        /**
         * dataStoreManager getter
         */
        get: function () {
            return this._dataStoreManager;
        },
        /**
         * dataStoreManager setter
         * @param {any=} dataStore
         */
        set: function (dataStore) {
            this._dataStoreManager = null;
            this._dataStoreManager = new DataStoreManager(this._config, {
                dataStore: dataStore,
                eventManager: this._eventManager,
                loggerManager: this._loggerManager
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Validate locationProperties against locations rules and visitorProperties against audiences rules
     * @param {string} visitorId
     * @param {string|Id} identity Value of the field which name is provided in identityField
     * @param {Record<string, any> | null} visitorProperties
     * @param {Record<string, any> | null} locationProperties
     * @param {IdentityField=} identityField Defaults to 'key'
     * @param {string=} environment
     * @return {Experience | RuleError}
     */
    DataManager.prototype.matchRulesByField = function (visitorId, identity, visitorProperties, locationProperties, identityField, environment) {
        var e_1, _a, e_2, _b;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        if (identityField === void 0) { identityField = 'key'; }
        if (environment === void 0) { environment = this._environment; }
        // eslint-disable-line
        // Retrieve the experience
        var experience = this._getEntityByField(identity, 'experiences', identityField);
        // Retrieve archived experiences
        var archivedExperiences = this.getEntitiesList('archived_experiences');
        // Check whether the experience is archived
        var isArchivedExperience = !!archivedExperiences.find(function (id) { return String(experience === null || experience === void 0 ? void 0 : experience.id) === String(id); });
        // Check environment
        var isEnvironmentMatch = Array.isArray(experience === null || experience === void 0 ? void 0 : experience.environments)
            ? !experience.environments.length || // skip if empty
                experience.environments.includes(environment)
            : true; // skip if no environments
        var matchedErrors = [];
        if (experience && !isArchivedExperience && isEnvironmentMatch) {
            var locationMatched = false, matchedLocations = [];
            if (locationProperties) {
                if (Array.isArray(experience === null || experience === void 0 ? void 0 : experience.locations) &&
                    experience.locations.length) {
                    // Get attached locations
                    var locations = this.getItemsByIds(experience.locations, 'locations');
                    if (locations.length) {
                        // Validate locationProperties against locations rules
                        // and trigger activated/deactivated events
                        matchedLocations = this.selectLocations(visitorId, locations, locationProperties, identityField);
                        // Return rule errors if present
                        matchedErrors = matchedLocations.filter(function (match) {
                            return Object.values(jsSdkEnums.RuleError).includes(match);
                        });
                        if (matchedErrors.length)
                            return matchedErrors[0];
                    }
                    // If there are some matched locations
                    locationMatched = Boolean(matchedLocations.length);
                }
                else if (experience === null || experience === void 0 ? void 0 : experience.site_area) {
                    locationMatched = this._ruleManager.isRuleMatched(locationProperties, experience.site_area, 'SiteArea');
                    // Return rule errors if present
                    if (Object.values(jsSdkEnums.RuleError).includes(locationMatched))
                        return locationMatched;
                }
                else {
                    // Empty experience locations list or unset Site Area means there's no restriction for the location
                    locationMatched = true;
                }
            }
            // Validate locationProperties against site area rules
            if (!locationProperties || locationMatched) {
                var audiences = [], segmentations = [], matchedAudiences = [], matchedSegmentations = [];
                if (visitorProperties) {
                    if (Array.isArray(experience === null || experience === void 0 ? void 0 : experience.audiences) &&
                        experience.audiences.length) {
                        // Get attached transient and/or permnent audiences
                        audiences = this.getItemsByIds(experience.audiences, 'audiences');
                        if (audiences.length) {
                            // Validate visitorProperties against audiences rules
                            matchedAudiences = this.filterMatchedRecordsWithRule(audiences, visitorProperties, 'audience', identityField);
                            // Return rule errors if present
                            matchedErrors = matchedAudiences.filter(function (match) {
                                return Object.values(jsSdkEnums.RuleError).includes(match);
                            });
                            if (matchedErrors.length)
                                return matchedErrors[0];
                            if (matchedAudiences.length) {
                                try {
                                    for (var matchedAudiences_1 = __values(matchedAudiences), matchedAudiences_1_1 = matchedAudiences_1.next(); !matchedAudiences_1_1.done; matchedAudiences_1_1 = matchedAudiences_1.next()) {
                                        var item = matchedAudiences_1_1.value;
                                        (_d = (_c = this._loggerManager) === null || _c === void 0 ? void 0 : _c.info) === null || _d === void 0 ? void 0 : _d.call(_c, jsSdkEnums.MESSAGES.AUDIENCE_MATCH.replace('#', item === null || item === void 0 ? void 0 : item[identityField]));
                                    }
                                }
                                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                finally {
                                    try {
                                        if (matchedAudiences_1_1 && !matchedAudiences_1_1.done && (_a = matchedAudiences_1.return)) _a.call(matchedAudiences_1);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                }
                            }
                        }
                        // Get attached segmentation audiences
                        segmentations = this.getItemsByIds(experience.audiences, 'segments');
                        if (segmentations.length) {
                            // Validate custom segments against segmentations
                            matchedSegmentations = this.filterMatchedCustomSegments(segmentations, visitorId);
                            if (matchedSegmentations.length) {
                                try {
                                    for (var matchedSegmentations_1 = __values(matchedSegmentations), matchedSegmentations_1_1 = matchedSegmentations_1.next(); !matchedSegmentations_1_1.done; matchedSegmentations_1_1 = matchedSegmentations_1.next()) {
                                        var item = matchedSegmentations_1_1.value;
                                        (_f = (_e = this._loggerManager) === null || _e === void 0 ? void 0 : _e.info) === null || _f === void 0 ? void 0 : _f.call(_e, jsSdkEnums.MESSAGES.SEGMENTATION_MATCH.replace('#', item === null || item === void 0 ? void 0 : item[identityField]));
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (matchedSegmentations_1_1 && !matchedSegmentations_1_1.done && (_b = matchedSegmentations_1.return)) _b.call(matchedSegmentations_1);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                            }
                        }
                    }
                    else {
                        (_h = (_g = this._loggerManager) === null || _g === void 0 ? void 0 : _g.info) === null || _h === void 0 ? void 0 : _h.call(_g, jsSdkEnums.MESSAGES.AUDIENCE_NOT_RESTRICTED);
                    }
                }
                // If there are some matched audiences
                if (!visitorProperties ||
                    matchedAudiences.length ||
                    matchedSegmentations.length ||
                    !audiences.length // Empty audiences list means there's no restriction for the audience
                ) {
                    // And experience has variations
                    if ((experience === null || experience === void 0 ? void 0 : experience.variations) && ((_j = experience === null || experience === void 0 ? void 0 : experience.variations) === null || _j === void 0 ? void 0 : _j.length)) {
                        (_l = (_k = this._loggerManager) === null || _k === void 0 ? void 0 : _k.info) === null || _l === void 0 ? void 0 : _l.call(_k, jsSdkEnums.MESSAGES.EXPERIENCE_RULES_MATCHED);
                        return experience;
                    }
                    else {
                        (_o = (_m = this._loggerManager) === null || _m === void 0 ? void 0 : _m.info) === null || _o === void 0 ? void 0 : _o.call(_m, jsSdkEnums.MESSAGES.VARIATIONS_NOT_FOUND);
                        // eslint-disable-line
                    }
                }
                else {
                    (_q = (_p = this._loggerManager) === null || _p === void 0 ? void 0 : _p.info) === null || _q === void 0 ? void 0 : _q.call(_p, jsSdkEnums.MESSAGES.AUDIENCE_NOT_MATCH);
                    // eslint-disable-line
                }
            }
            else {
                (_s = (_r = this._loggerManager) === null || _r === void 0 ? void 0 : _r.info) === null || _s === void 0 ? void 0 : _s.call(_r, jsSdkEnums.MESSAGES.LOCATION_NOT_MATCH);
                // eslint-disable-line
            }
        }
        else {
            (_u = (_t = this._loggerManager) === null || _t === void 0 ? void 0 : _t.info) === null || _u === void 0 ? void 0 : _u.call(_t, jsSdkEnums.MESSAGES.EXPERIENCE_NOT_FOUND);
            // eslint-disable-line
        }
        return null;
    };
    /**
     * Retrieve variation for visitor
     * @param {string} visitorId
     * @param {string|Id} identity Value of the field which name is provided in identityField
     * @param {Record<string, any> | null} visitorProperties
     * @param {Record<string, any> | null} locationProperties
     * @param {IdentityField=} identityField Defaults to 'key'
     * @param {string=} environment
     * @return {BucketedVariation | RuleError}
     * @private
     */
    DataManager.prototype._getBucketingByField = function (visitorId, identity, visitorProperties, locationProperties, identityField, environment) {
        // eslint-disable-line
        if (identityField === void 0) { identityField = 'key'; }
        if (environment === void 0) { environment = this._environment; }
        // Retrieve the experience
        var experience = this.matchRulesByField(visitorId, identity, visitorProperties, locationProperties, identityField, environment);
        if (experience) {
            if (Object.values(jsSdkEnums.RuleError).includes(experience)) {
                return experience;
            }
            return this._retrieveBucketing(visitorId, experience);
        }
        return null;
    };
    /**
     * Retrieve bucketing for Visitor
     * @param {Id} visitorId
     * @param {Experience} experience
     * @return {BucketedVariation}
     * @private
     */
    DataManager.prototype._retrieveBucketing = function (visitorId, experience) {
        var _a, _b;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (!visitorId || !experience)
            return null;
        if (!(experience === null || experience === void 0 ? void 0 : experience.id))
            return null;
        var variation = null;
        var bucketedVariation = null;
        var storeKey = this.getStoreKey(visitorId);
        // Check that visitor id already bucketed and stored and skip bucketing logic
        var _o = this.getLocalStore(visitorId) || {}, bucketing = _o.bucketing, locations = _o.locations, segments = _o.segments;
        var _p = bucketing || {}, _q = experience.id.toString(), variationId = _p[_q];
        if (variationId &&
            (variation = this.retrieveVariation(experience.id, variationId))) {
            // If it's found log debug info. The return value will be formed next step
            (_d = (_c = this._loggerManager) === null || _c === void 0 ? void 0 : _c.info) === null || _d === void 0 ? void 0 : _d.call(_c, jsSdkEnums.MESSAGES.BUCKETED_VISITOR_FOUND.replace('#', "#".concat(variationId)));
            // eslint-disable-line
        }
        else {
            // Try to find a bucketed visitor in dataStore
            var _r = ((_f = (_e = this.dataStoreManager) === null || _e === void 0 ? void 0 : _e.get) === null || _f === void 0 ? void 0 : _f.call(_e, storeKey)) || {}, _s = _r.bucketing, _t = _s === void 0 ? {} : _s, _u = experience.id.toString(), variationId_1 = _t[_u];
            if (variationId_1 &&
                (variation = this.retrieveVariation(experience.id, variationId_1))) {
                // Store the data in local variable
                this.putLocalStore(visitorId, __assign(__assign({ bucketing: __assign(__assign({}, bucketing), (_a = {}, _a[experience.id.toString()] = variationId_1, _a)) }, (locations ? { locations: locations } : {})), (segments ? { segments: segments } : {})));
                // If it's found log debug info. The return value will be formed next step
                (_h = (_g = this._loggerManager) === null || _g === void 0 ? void 0 : _g.info) === null || _h === void 0 ? void 0 : _h.call(_g, jsSdkEnums.MESSAGES.BUCKETED_VISITOR_FOUND.replace('#', "#".concat(variationId_1)));
                // eslint-disable-line
            }
            else {
                // Build buckets where key is variation id and value is traffic distribution
                var buckets = experience.variations.reduce(function (bucket, variation) {
                    if (variation === null || variation === void 0 ? void 0 : variation.id)
                        bucket[variation.id] = (variation === null || variation === void 0 ? void 0 : variation.traffic_allocation) || 100.0;
                    return bucket;
                }, {});
                // Select bucket based for provided visitor id
                variationId_1 = this._bucketingManager.getBucketForVisitor(buckets, visitorId);
                if (variationId_1) {
                    (_k = (_j = this._loggerManager) === null || _j === void 0 ? void 0 : _j.info) === null || _k === void 0 ? void 0 : _k.call(_j, jsSdkEnums.MESSAGES.BUCKETED_VISITOR.replace('#', "#".concat(variationId_1)));
                    // Store the data in local variable
                    var storeData = __assign(__assign({ bucketing: __assign(__assign({}, bucketing), (_b = {}, _b[experience.id.toString()] = variationId_1, _b)) }, (locations ? { locations: locations } : {})), (segments ? { segments: segments } : {}));
                    this.putLocalStore(visitorId, storeData);
                    // Enqueue to store in dataStore
                    this.dataStoreManager.enqueue(storeKey, storeData);
                    // Enqueue bucketing event to api
                    var bucketingEvent = {
                        experienceId: experience.id.toString(),
                        variationId: variationId_1.toString()
                    };
                    var visitorEvent = {
                        eventType: jsSdkEnums.EventType.BUCKETING,
                        data: bucketingEvent
                    };
                    this._apiManager.enqueue(visitorId, visitorEvent, segments);
                    // eslint-disable-line
                    // Retrieve and return variation
                    variation = this.retrieveVariation(experience.id, variationId_1);
                }
                else {
                    (_m = (_l = this._loggerManager) === null || _l === void 0 ? void 0 : _l.error) === null || _m === void 0 ? void 0 : _m.call(_l, jsSdkEnums.ERROR_MESSAGES.UNABLE_TO_SELECT_BUCKET_FOR_VISITOR, {
                        visitorId: visitorId,
                        experience: experience
                    });
                }
            }
        }
        // Build the response as bucketed variation object
        if (variation) {
            bucketedVariation = __assign({
                experienceId: experience === null || experience === void 0 ? void 0 : experience.id,
                experienceName: experience === null || experience === void 0 ? void 0 : experience.name,
                experienceKey: experience === null || experience === void 0 ? void 0 : experience.key
            }, variation);
        }
        return bucketedVariation;
    };
    /**
     * @param {Id} experienceId
     * @param {Id} variationId
     * @return {Variation}
     * @private
     */
    DataManager.prototype.retrieveVariation = function (experienceId, variationId) {
        return this.getSubItem('experiences', experienceId, 'variations', variationId, 'id', 'id');
    };
    /**
     * @param {Id} visitorId
     * @param {StoreData} storeData
     * @private
     */
    DataManager.prototype.putLocalStore = function (visitorId, storeData) {
        var e_3, _a;
        var storeKey = this.getStoreKey(visitorId);
        this._bucketedVisitors.set(storeKey, storeData);
        if (this._bucketedVisitors.size > this._localStoreLimit) {
            try {
                // Delete one of the oldest record
                for (var _b = __values(this._bucketedVisitors), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    this._bucketedVisitors.delete(key);
                    break;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    };
    /**
     * @param {Id} visitorId
     * @return {StoreData} variation id
     * @private
     */
    DataManager.prototype.getLocalStore = function (visitorId) {
        var storeKey = this.getStoreKey(visitorId);
        return this._bucketedVisitors.get(storeKey) || null;
    };
    /**
     * @param {Id} visitorId
     * @return {string} storeKey
     * @private
     */
    DataManager.prototype.getStoreKey = function (visitorId) {
        return "".concat(this._accountId, "-").concat(this._projectId, "-").concat(visitorId);
    };
    /**
     *
     * @param {string} visitorId
     * @param {Array<Record<string, any>>} items
     * @param {Record<string, any>} locationProperties
     * @returns {Array<Record<string, any> | RuleError>}
     */
    DataManager.prototype.selectLocations = function (visitorId, items, locationProperties, identityField) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        if (identityField === void 0) { identityField = 'key'; }
        // eslint-disable-line
        // Get locations from DataStore
        var storeData = this.getLocalStore(visitorId) || {};
        var bucketing = storeData.bucketing, _s = storeData.locations, locations = _s === void 0 ? [] : _s, segments = storeData.segments;
        var matchedRecords = [];
        var match;
        if (jsSdkUtils.arrayNotEmpty(items)) {
            var _loop_1 = function (i, length_1) {
                if (!((_a = items === null || items === void 0 ? void 0 : items[i]) === null || _a === void 0 ? void 0 : _a.rules))
                    return "continue";
                match = this_1._ruleManager.isRuleMatched(locationProperties, items[i].rules, 'location', identityField);
                var identity = (_d = (_c = (_b = items === null || items === void 0 ? void 0 : items[i]) === null || _b === void 0 ? void 0 : _b[identityField]) === null || _c === void 0 ? void 0 : _c.toString) === null || _d === void 0 ? void 0 : _d.call(_c);
                if (match === true) {
                    (_f = (_e = this_1._loggerManager) === null || _e === void 0 ? void 0 : _e.info) === null || _f === void 0 ? void 0 : _f.call(_e, jsSdkEnums.MESSAGES.LOCATION_MATCH.replace('#', "#".concat(identity)));
                    if (!locations.includes(identity)) {
                        locations.push(identity);
                        this_1._eventManager.fire(jsSdkEnums.SystemEvents.LOCATION_ACTIVATED, {
                            visitorId: visitorId,
                            location: {
                                id: (_g = items === null || items === void 0 ? void 0 : items[i]) === null || _g === void 0 ? void 0 : _g.id,
                                key: (_h = items === null || items === void 0 ? void 0 : items[i]) === null || _h === void 0 ? void 0 : _h.key,
                                name: (_j = items === null || items === void 0 ? void 0 : items[i]) === null || _j === void 0 ? void 0 : _j.name
                            }
                        }, null, true);
                        (_l = (_k = this_1._loggerManager) === null || _k === void 0 ? void 0 : _k.info) === null || _l === void 0 ? void 0 : _l.call(_k, jsSdkEnums.MESSAGES.LOCATION_ACTIVATED.replace('#', "#".concat(identity)));
                    }
                    matchedRecords.push(items[i]);
                }
                else if (match !== false) {
                    // catch rule errors
                    matchedRecords.push(match);
                }
                else if (match === false && locations.includes(identity)) {
                    this_1._eventManager.fire(jsSdkEnums.SystemEvents.LOCATION_DEACTIVATED, {
                        visitorId: visitorId,
                        location: {
                            id: (_m = items === null || items === void 0 ? void 0 : items[i]) === null || _m === void 0 ? void 0 : _m.id,
                            key: (_o = items === null || items === void 0 ? void 0 : items[i]) === null || _o === void 0 ? void 0 : _o.key,
                            name: (_p = items === null || items === void 0 ? void 0 : items[i]) === null || _p === void 0 ? void 0 : _p.name
                        }
                    }, null, true);
                    var locationIndex = locations.findIndex(function (location) { return location === identity; });
                    locations.splice(locationIndex, 1);
                    (_r = (_q = this_1._loggerManager) === null || _q === void 0 ? void 0 : _q.info) === null || _r === void 0 ? void 0 : _r.call(_q, jsSdkEnums.MESSAGES.LOCATION_DEACTIVATED.replace('#', "#".concat(identity)));
                }
            };
            var this_1 = this;
            for (var i = 0, length_1 = items.length; i < length_1; i++) {
                _loop_1(i, length_1);
            }
        }
        // Store the data in local variable
        this.putLocalStore(visitorId, __assign(__assign(__assign({}, (bucketing ? { bucketing: bucketing } : {})), { locations: locations }), (segments ? { segments: segments } : {})));
        // eslint-disable-line
        return matchedRecords;
    };
    /**
     * Retrieve variation for visitor
     * @param {string} visitorId
     * @param {string} key
     * @param {Record<string, any> | null} visitorProperties
     * @param {Record<string, any> | null} locationProperties
     * @param {string=} environment
     * @return {BucketedVariation | RuleError}
     */
    DataManager.prototype.getBucketing = function (visitorId, key, visitorProperties, locationProperties, environment) {
        if (environment === void 0) { environment = this._environment; }
        return this._getBucketingByField(visitorId, key, visitorProperties, locationProperties, 'key', environment);
    };
    /**
     * Retrieve variation for Visitor
     * @param {string} visitorId
     * @param {Id} id
     * @param {Record<string, any> | null} visitorProperties
     * @param {Record<string, any> | null} locationProperties
     * @param {string=} environment
     * @return {BucketedVariation | RuleError}
     */
    DataManager.prototype.getBucketingById = function (visitorId, id, visitorProperties, locationProperties, environment) {
        if (environment === void 0) { environment = this._environment; }
        return this._getBucketingByField(visitorId, id, visitorProperties, locationProperties, 'id', environment);
    };
    /**
     * Process conversion event
     * @param {Id} visitorId
     * @param {Id} goalId
     * @param {Record<string, any>=} goalRule An object of key-value pairs that are used for goal matching
     * @param {Array<Record<GoalDataKey, number>>} goalData An array of object of key-value pairs
     * @param {SegmentsData} segments
     */
    DataManager.prototype.convert = function (visitorId, goalId, goalRule, goalData, segments) {
        var _a, _b, _c, _d;
        var goal = typeof goalId === 'string'
            ? this.getEntity(goalId, 'goals')
            : this.getEntityById(goalId, 'goals');
        if (!(goal === null || goal === void 0 ? void 0 : goal.id)) {
            (_b = (_a = this._loggerManager) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, jsSdkEnums.MESSAGES.GOAL_NOT_FOUND);
            return;
        }
        if (goalRule) {
            if (!(goal === null || goal === void 0 ? void 0 : goal.rules))
                return;
            var ruleMatched = this._ruleManager.isRuleMatched(goalRule, goal.rules, 'goal');
            // Return rule errors if present
            if (Object.values(jsSdkEnums.RuleError).includes(ruleMatched))
                return ruleMatched;
            if (!ruleMatched) {
                (_d = (_c = this._loggerManager) === null || _c === void 0 ? void 0 : _c.error) === null || _d === void 0 ? void 0 : _d.call(_c, jsSdkEnums.MESSAGES.GOAL_RULE_NOT_MATCH);
                return;
            }
        }
        var data = {
            goalId: goal.id
        };
        var bucketingData = (this.getLocalStore(visitorId) || {}).bucketing;
        if (bucketingData)
            data.bucketingData = bucketingData;
        var event = {
            eventType: jsSdkEnums.EventType.CONVERSION,
            data: data
        };
        this._apiManager.enqueue(visitorId, event, segments);
        // Split transaction events
        if (goalData) {
            var data_1 = {
                goalId: goal.id,
                goalData: goalData
            };
            if (bucketingData)
                data_1.bucketingData = bucketingData;
            var event_1 = {
                eventType: jsSdkEnums.EventType.CONVERSION,
                data: data_1
            };
            this._apiManager.enqueue(visitorId, event_1, segments);
        }
        // eslint-disable-line
    };
    /**
     * Get audiences that meet the visitorProperties
     * @param {Array<Record<any, any>>} items
     * @param {Record<string, any>} visitorProperties
     * @return {Array<Record<string, any> | RuleError>}
     */
    DataManager.prototype.filterMatchedRecordsWithRule = function (items, visitorProperties, entityType, field) {
        var _a;
        if (field === void 0) { field = 'id'; }
        // eslint-disable-line
        var matchedRecords = [];
        var match;
        if (jsSdkUtils.arrayNotEmpty(items)) {
            for (var i = 0, length_2 = items.length; i < length_2; i++) {
                if (!((_a = items === null || items === void 0 ? void 0 : items[i]) === null || _a === void 0 ? void 0 : _a.rules))
                    continue;
                match = this._ruleManager.isRuleMatched(visitorProperties, items[i].rules, entityType, field);
                if (match === true) {
                    matchedRecords.push(items[i]);
                }
                else if (match !== false) {
                    // catch rule errors
                    matchedRecords.push(match);
                }
            }
        }
        // eslint-disable-line
        return matchedRecords;
    };
    /**
     * Get audiences that meet the custom segments
     * @param {Array<Record<any, any>>} items
     * @param {Id} visitorId
     * @return {Array<Record<string, any>>}
     */
    DataManager.prototype.filterMatchedCustomSegments = function (items, visitorId) {
        var _a;
        // eslint-disable-line
        // Check that custom segments are matched
        var storeData = this.getLocalStore(visitorId) || {};
        // Get custom segments ID from DataStore
        var _b = storeData, _c = _b.segments, _d = _c === void 0 ? {} : _c, _e = jsSdkEnums.SegmentsKeys.CUSTOM_SEGMENTS, _f = _d[_e], customSegments = _f === void 0 ? [] : _f;
        var matchedRecords = [];
        if (jsSdkUtils.arrayNotEmpty(items)) {
            for (var i = 0, length_3 = items.length; i < length_3; i++) {
                if (!((_a = items === null || items === void 0 ? void 0 : items[i]) === null || _a === void 0 ? void 0 : _a.id))
                    continue;
                if (customSegments.includes(items[i].id)) {
                    matchedRecords.push(items[i]);
                }
            }
        }
        // eslint-disable-line
        return matchedRecords;
    };
    /**
     * Get list of data entities
     * @param {string} entityType
     * @return {Array<Entity | Id>}
     */
    DataManager.prototype.getEntitiesList = function (entityType) {
        var list = [];
        if (this._dataEntities.indexOf(entityType) !== -1) {
            list = jsSdkUtils.objectDeepValue(this._data, entityType) || [];
        }
        // eslint-disable-line
        return list;
    };
    /**
     * Get list of data entities grouped by field
     * @param {string} entityType
     * @param {IdentityField=} field
     * @return {Record<string, Entity>}
     */
    DataManager.prototype.getEntitiesListObject = function (entityType, field) {
        if (field === void 0) { field = 'id'; }
        return this.getEntitiesList(entityType).reduce(function (target, entity) {
            target[entity[field]] = entity;
            return target;
        }, {});
    };
    /**
     *
     * @param {string|Id} identity Value of the field which name is provided in identityField
     * @param {string} entityType
     * @param {IdentityField=} identityField Defaults to 'key'
     * @return {Entity}
     * @private
     */
    DataManager.prototype._getEntityByField = function (identity, entityType, identityField) {
        var _a;
        if (identityField === void 0) { identityField = 'key'; }
        // eslint-disable-line
        var list = this.getEntitiesList(entityType);
        if (jsSdkUtils.arrayNotEmpty(list)) {
            for (var i = 0, length_4 = list.length; i < length_4; i++) {
                if (list[i] && String((_a = list[i]) === null || _a === void 0 ? void 0 : _a[identityField]) === String(identity)) {
                    return list[i];
                }
            }
        }
        return null;
    };
    /**
     * Find the entity in list by id
     * @param {string} key
     * @param {string} entityType
     * @return {Entity}
     */
    DataManager.prototype.getEntity = function (key, entityType) {
        return this._getEntityByField(key, entityType, 'key');
    };
    /**
     * Find the entity in list by keys
     * @param {Array<string>} keys
     * @param {string} entityType
     * @return {Array<Entity>}
     */
    DataManager.prototype.getEntities = function (keys, entityType) {
        return this.getItemsByKeys(keys, entityType);
    };
    /**
     * Find the entity in list by id
     * @param {Id} id
     * @param {string} entityType
     * @return {Entity}
     */
    DataManager.prototype.getEntityById = function (id, entityType) {
        return this._getEntityByField(id, entityType, 'id');
    };
    /**
     * Find the entity in list by ids
     * @param {Array<Id>} ids
     * @param {string} entityType
     * @return {Array<Entity>}
     */
    DataManager.prototype.getEntitiesByIds = function (ids, entityType) {
        return this.getItemsByIds(ids, entityType);
    };
    /**
     * Find the items in list by  keys
     * @param {Array<string>} keys
     * @param {string} path
     * @return {Array<Record<string, any>>}
     */
    DataManager.prototype.getItemsByKeys = function (keys, path) {
        var _a;
        var list = this.getEntitiesList(path);
        var items = [];
        if (jsSdkUtils.arrayNotEmpty(list)) {
            for (var i = 0, length_5 = list.length; i < length_5; i++) {
                if (keys.indexOf((_a = list[i]) === null || _a === void 0 ? void 0 : _a.key) !== -1) {
                    items.push(list[i]);
                }
            }
        }
        return items;
    };
    /**
     * Find the items in list by ids
     * @param {Array<Id>} ids
     * @param {String} path
     * @return {Array<Record<string, any>>}
     */
    DataManager.prototype.getItemsByIds = function (ids, path) {
        var _a, _b;
        // eslint-disable-line
        var items = [];
        if (jsSdkUtils.arrayNotEmpty(ids)) {
            var list = this.getEntitiesList(path);
            if (jsSdkUtils.arrayNotEmpty(list)) {
                for (var i = 0, length_6 = list.length; i < length_6; i++) {
                    if (ids.indexOf(Number((_a = list[i]) === null || _a === void 0 ? void 0 : _a.id)) !== -1 ||
                        ids.indexOf(String((_b = list[i]) === null || _b === void 0 ? void 0 : _b.id)) !== -1) {
                        items.push(list[i]);
                    }
                }
            }
        }
        return items;
    };
    /**
     * Find nested item
     * @param {string} entityType
     * @param {string|number} entityIdentity
     * @param {string} subEntityType
     * @param {string|number} subEntityIdentity
     * @param {IdentityField} identityField
     * @param {IdentityField} subIdentityField
     * @return {Record<any, any>}
     */
    DataManager.prototype.getSubItem = function (entityType, entityIdentity, subEntityType, subEntityIdentity, identityField, subIdentityField) {
        var _a;
        var entity = this._getEntityByField(entityIdentity, entityType, identityField);
        for (var k in entity[subEntityType]) {
            if (String((_a = entity[subEntityType][k]) === null || _a === void 0 ? void 0 : _a[subIdentityField]) ===
                String(subEntityIdentity)) {
                return entity[subEntityType][k];
            }
        }
        return null;
    };
    /**
     * Validates data object
     * @param data
     * @return {boolean}
     */
    DataManager.prototype.isValidConfigData = function (data) {
        var _a;
        return jsSdkUtils.objectNotEmpty(data) && !!(data === null || data === void 0 ? void 0 : data.account_id) && !!((_a = data === null || data === void 0 ? void 0 : data.project) === null || _a === void 0 ? void 0 : _a.id);
    };
    return DataManager;
}());

exports.DataManager = DataManager;
exports.DataStoreManager = DataStoreManager;
//# sourceMappingURL=index.js.map
