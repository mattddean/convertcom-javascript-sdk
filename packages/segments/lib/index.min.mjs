/*!
 * Convert JS SDK
 * Version 1.0.0
 * Copyright(c) 2020-2022 Convert Insights, Inc
 * License Apache-2.0
 */
import{SegmentsKeys as t,RuleError as e}from"@convertcom/js-sdk-enums";import{objectDeepValue as s}from"@convertcom/js-sdk-utils";class a{constructor(t,{dataManager:e,ruleManager:a,loggerManager:n}){this._dataManager=e,this._ruleManager=a,this._loggerManager=n,this._data=s(t,"data")}getSegments(t){const e=this._dataManager.getLocalStore(t)||{};return null==e?void 0:e.segments}putSegments(t,e){const s=this._dataManager.getLocalStore(t)||{};this._dataManager.putLocalStore(t,Object.assign(Object.assign({},s),{segments:e}));const a=this._dataManager.getStoreKey(t);this._dataManager.dataStoreManager.enqueue(a,Object.assign(Object.assign({},s),{segments:e}))}setCustomSegments(s,a,n){var g;const r=this._dataManager.getLocalStore(s)||{},{segments:{[t.CUSTOM_SEGMENTS]:o=[]}={}}=r,i=[];let c,u=!1;for(const t of a){if(n&&!u&&(u=this._ruleManager.isRuleMatched(n,null==t?void 0:t.rules),Object.values(e).includes(u)))return u;if(!n||u){const e=null===(g=null==t?void 0:t.id)||void 0===g?void 0:g.toString();o.includes(e)||i.push(e)}}return i.length&&(c=Object.assign(Object.assign({},r.segments||{}),{[t.CUSTOM_SEGMENTS]:[...o,...i]}),this.putSegments(s,c)),c}selectCustomSegments(t,e,s){const a=this._dataManager.getEntities(e,"segments");return this.setCustomSegments(t,a,s)}selectCustomSegmentsByIds(t,e,s){const a=this._dataManager.getEntitiesByIds(e,"segments");return this.setCustomSegments(t,a,s)}}export{a as SegmentsManager};
//# sourceMappingURL=index.min.mjs.map
