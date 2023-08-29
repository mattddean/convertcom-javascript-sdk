'use strict';

var Murmurhash = require('murmurhash');
var jsSdkUtils = require('@convertcom/js-sdk-utils');

/*!
 * Convert JS SDK
 * Version 1.0.0
 * Copyright(c) 2020 Convert Insights, Inc
 * License Apache-2.0
 */
//default hash seed
const DEFAULT_HASH_SEED = 9999;
const DEFAULT_MAX_TRAFFIC = 10000;
const DEFAULT_MAX_HASH = 4294967296;
/**
 * Provides logic for bucketing for specific visitor (by visitorId) or randomly
 * @category Modules
 * @constructor
 * @implements {BucketingManagerInterface}
 */
class BucketingManager {
    /**
     * @param {Config=} config
     * @param {Object=} dependencies
     * @param {LogManagerInterface=} dependencies.loggerManager
     */
    constructor(config, { loggerManager } = {}) {
        this._max_traffic = DEFAULT_MAX_TRAFFIC;
        this._hash_seed = DEFAULT_HASH_SEED;
        this._loggerManager = loggerManager;
        this._max_traffic = jsSdkUtils.objectDeepValue(config, 'bucketing.max_traffic', DEFAULT_MAX_TRAFFIC, true);
        this._hash_seed = jsSdkUtils.objectDeepValue(config, 'bucketing.hash_seed', DEFAULT_HASH_SEED, true);
        // eslint-disable-line
    }
    /**
     * Select variation based on its percentages and value provided
     * @param {object} buckets Key-value object with variations IDs as keys and percentages as values
     * @param {number} value A bucket value
     * @param {number=} redistribute Defaults to '0'
     * @return {string | null}
     */
    selectBucket(buckets, value, redistribute = 0) {
        let variation = null;
        let prev = 0;
        Object.keys(buckets).some((id) => {
            prev += buckets[id] * 100 + redistribute;
            if (value < prev) {
                variation = id;
                return true;
            }
            return false;
        });
        // eslint-disable-line
        return variation || null;
    }
    /**
     * Get a value based on hash from Visitor id to use for bucket selecting
     * @param {Id} visitorId
     * @param {number=} seed
     * @return {number}
     */
    getValueVisitorBased(visitorId, seed = this._hash_seed) {
        const hash = Murmurhash.v3(String(visitorId), seed);
        const val = (hash / DEFAULT_MAX_HASH) * this._max_traffic;
        const result = parseInt(String(val), 10);
        // eslint-disable-line
        return result;
    }
    /**
     * Get a bucket for the visitor
     * @param {object} buckets Key-value object with variations IDs as keys and percentages as values
     * @param {Id} visitorId
     * @param {number} [redistribute=0]
     * @param {number} [seed=]
     * @return {string | null}
     */
    getBucketForVisitor(buckets, visitorId, redistribute = 0, seed) {
        const value = this.getValueVisitorBased(visitorId, seed);
        return this.selectBucket(buckets, value, redistribute);
    }
}

exports.BucketingManager = BucketingManager;
//# sourceMappingURL=index.js.map
