/*!
 * Convert JS SDK
 * Version 1.0.0
 * Copyright(c) 2020-2022 Convert Insights, Inc
 * License Apache-2.0
 */
class e{constructor(e,{loggerManager:r}={}){this._listeners={},this._deferred={},this._loggerManager=r}on(e,r){(this._listeners[e]=this._listeners[e]||[]).push(r),Object.hasOwnProperty.call(this._deferred,e)&&this.fire(e,this._deferred[e].args,this._deferred[e].err)}removeListeners(e){Object.hasOwnProperty.call(this._listeners,e)&&delete this._listeners[e],Object.hasOwnProperty.call(this._deferred,e)&&delete this._deferred[e]}fire(e,r=null,s=null,t=!1){for(const t in this._listeners[e]||[])Object.hasOwnProperty.call(this._listeners,e)&&"function"==typeof this._listeners[e][t]&&this._listeners[e][t].apply(null,[r,s]);t&&!Object.hasOwnProperty.call(this._deferred,e)&&(this._deferred[e]={args:r,err:s})}}export{e as EventManager};
//# sourceMappingURL=index.min.mjs.map
