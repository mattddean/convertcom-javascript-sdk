/*!
 * Convert JS SDK
 * Version 1.0.0
 * Copyright(c) 2020-2022 Convert Insights, Inc
 * License Apache-2.0
 */
import t from"murmurhash";import{objectDeepValue as e}from"@convertcom/js-sdk-utils";class s{constructor(t,{loggerManager:s}={}){this._max_traffic=1e4,this._hash_seed=9999,this._loggerManager=s,this._max_traffic=e(t,"bucketing.max_traffic",1e4,!0),this._hash_seed=e(t,"bucketing.hash_seed",9999,!0)}selectBucket(t,e,s=0){let r=null,i=0;return Object.keys(t).some((a=>(i+=100*t[a]+s,e<i&&(r=a,!0)))),r||null}getValueVisitorBased(e,s=this._hash_seed){const r=t.v3(String(e),s)/4294967296*this._max_traffic;return parseInt(String(r),10)}getBucketForVisitor(t,e,s=0,r){const i=this.getValueVisitorBased(e,r);return this.selectBucket(t,i,s)}}export{s as BucketingManager};
//# sourceMappingURL=index.min.mjs.map
