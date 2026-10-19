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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$5=globalThis,e$3=t$5.ShadowRoot&&(void 0===t$5.ShadyCSS||t$5.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$3&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$3),i$6=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$3)},S$1=(s,o)=>{if(e$3)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$5.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$3=e$3?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$5,defineProperty:e$2,getOwnPropertyDescriptor:h$2,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$2=a$1.trustedTypes,l$1=c$2?c$2.emptyScript:"",p$2=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$3={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$5(t,s),b$1={attribute:true,type:String,converter:u$3,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$2(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$2(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$3(s));}else void 0!==s&&i.push(c$3(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$3).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$3;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$2?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$4=globalThis,i$4=t=>t,s$2=t$4.trustedTypes,e$1=s$2?s$2.createPolicy("lit-html",{createHTML:t=>t}):void 0,h$1="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c$1=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u$2=Array.isArray,d=t=>u$2(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v$1=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m$1=/>/g,p$1=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u$2(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$1?e$1.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v$1;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v$1?"!--"===u[1]?c=_:void 0!==u[1]?c=m$1:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p$1):void 0!==u[3]&&(c=p$1):c===p$1?">"===u[0]?(c=n??v$1,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p$1:'"'===u[3]?$:g):c===$||c===g?c=p$1:c===_||c===m$1?c=v$1:(c=p$1,n=void 0);const x=c===p$1&&t[i+1].startsWith("/>")?" ":"";l+=c===v$1?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h$1+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h$1)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$2?s$2.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c$1()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c$1());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M$1(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M$1(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M$1(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u$2(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c$1()),this.O(c$1()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$4(t).nextSibling;i$4(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M$1(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M$1(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M$1(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M$1(this,t);}}const j={I:k},B=t$4.litHtmlPolyfillSupport;B?.(S,k),(t$4.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c$1(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s$1=globalThis;let i$3 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$3._$litElement$=true,i$3["finalized"]=true,s$1.litElementHydrateSupport?.({LitElement:i$3});const o$1=s$1.litElementPolyfillSupport;o$1?.({LitElement:i$3});(s$1.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$3,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2={CHILD:2},e=t=>(...e)=>({_$litDirective$:t,values:e});let i$2 = class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const {I:t$1}=j,i$1=o=>o,s=()=>document.createComment(""),v=(o,n,e)=>{const l=o._$AA.parentNode,d=void 0===n?o._$AB:n._$AA;if(void 0===e){const i=l.insertBefore(s(),d),n=l.insertBefore(s(),d);e=new t$1(i,n,o,o.options);}else {const t=e._$AB.nextSibling,n=e._$AM,c=n!==o;if(c){let t;e._$AQ?.(o),e._$AM=o,void 0!==e._$AP&&(t=o._$AU)!==n._$AU&&e._$AP(t);}if(t!==d||c){let o=e._$AA;for(;o!==t;){const t=i$1(o).nextSibling;i$1(l).insertBefore(o,d),o=t;}}}return e},u$1=(o,t,i=o)=>(o._$AI(t,i),o),m={},p=(o,t=m)=>o._$AH=t,M=o=>o._$AH,h=o=>{o._$AR(),o._$AA.remove();};

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const i=e(class extends i$2{constructor(){super(...arguments),this.key=A;}render(r,t){return this.key=r,t}update(r,[t,e]){return t!==this.key&&(p(r),this.key=t),e}});

const DOMAIN = "intellikeep";
/** Future repeats of the open recurring tasks due from `start` to `end`. */
async function getRepeats(hass, start, end) {
    const result = await hass.connection.sendMessagePromise({
        type: `${DOMAIN}/get_repeats`,
        start: start.toISOString(),
        end: end.toISOString(),
    });
    return result.repeats;
}
async function subscribeTasks(hass, callback) {
    return hass.connection.subscribeMessage((msg) => callback(msg.tasks), { type: `${DOMAIN}/subscribe` });
}
async function createTask(hass, data) {
    await hass.callService(DOMAIN, "create_task", data);
}
async function updateTask(hass, taskId, data, updatedBy = "") {
    await hass.callService(DOMAIN, "update_task", {
        task_id: taskId,
        ...data,
        updated_by: updatedBy,
    });
}
async function completeTask(hass, taskId, completedBy = "", notes = "") {
    await hass.callService(DOMAIN, "complete_task", {
        task_id: taskId,
        completed_by: completedBy,
        notes,
    });
}
async function reopenTask(hass, taskId, performedBy = "") {
    await hass.callService(DOMAIN, "reopen_task", { task_id: taskId, performed_by: performedBy });
}
async function deleteTask(hass, taskId) {
    await hass.callService(DOMAIN, "delete_task", { task_id: taskId });
}
async function addTaskNote(hass, taskId, content, addedBy = "") {
    await hass.callService(DOMAIN, "add_task_note", {
        task_id: taskId,
        content,
        added_by: addedBy,
    });
}
async function deleteTaskNote(hass, taskId, noteId) {
    await hass.callService(DOMAIN, "delete_task_note", {
        task_id: taskId,
        note_id: noteId,
    });
}
async function deleteAllData(hass) {
    await hass.callService(DOMAIN, "delete_all_data", {});
}

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const messages = {
    en: {
        newTask: "New task",
        tasks: "Tasks",
        settings: "Settings",
        loading: "Loading IntelliKeep…",
        editTask: "Edit Task",
        newTaskTitle: "New task",
        settingsTitle: "Settings",
        done: "Done",
        undo: "Reopen",
        edit: "Edit",
        del: "Del",
        overdue: "Overdue",
        pending: "Pending",
        completed: "Done",
        allPriorities: "All priorities",
        filterAreasLabel: "Areas",
        filterAreasPlaceholder: "Add area filter…",
        filterDevicesLabel: "Devices",
        filterDevicesPlaceholder: "Add device filter…",
        filterModeLabel: "Combine",
        filterModeAny: "Area OR device",
        filterModeAll: "Area AND device",
        clearFilters: "Clear filters",
        removeFilter: "Remove filter",
        noResults: "No results",
        addFilter: "Add",
        filterToggleTitle: "Filter by area / device",
        filterAreaTag: (name) => `Area: ${name}`,
        filterDeviceTag: (name) => `Device: ${name}`,
        searchPlaceholder: "Search tasks",
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low",
        noTasks: "No tasks match the current filters.",
        deleteHeading: "Delete task?",
        deleteBody: "This action cannot be undone.",
        noDueDate: "No due date",
        daysOverdue: (n) => `${n} day${n !== 1 ? "s" : ""} overdue`,
        taskName: "Task name *",
        taskNamePlaceholder: "e.g. Replace HVAC filter",
        description: "Description",
        descriptionPlaceholder: "Optional details…",
        priority: "Priority",
        frequency: "Frequency",
        dueDate: "Due date",
        allAreas: "All areas",
        selectEntity: "Select entity…",
        noSpecificDevice: "No specific device",
        notifyOverdue: "Notify when overdue",
        taskNameRequired: "Task name is required.",
        saving: "Saving…",
        save: "Save",
        saveChanges: "Save changes",
        createTask: "Create",
        cancel: "Cancel",
        repeatOn: "Repeat on",
        weekdaysNoneHint: "No days selected: repeats every 7 days after each completion.",
        dueDateSnapped: (d) => `Due date moved to the next selected day: ${d}`,
        historyLoading: "Loading…",
        taskNotFound: "Task not found.",
        notesTab: "Notes",
        back: "← Back",
        executionHistory: (n) => `Execution history — ${n} record${n !== 1 ? "s" : ""}`,
        noExecutions: "No executions recorded yet.",
        taskCompletedReadonly: "Task completed — fields are read-only. Use Reopen to re-open.",
        lateLabel: "Late",
        historyNavTab: "History",
        exportCsv: "Export CSV",
        printHistory: "Print",
        columns: "Columns",
        columnPickerTitle: "Visible columns",
        globalHistoryTitle: "Execution History",
        globalHistoryEmpty: "No executions recorded yet.",
        taskHeader: "Task",
        viewTask: "View",
        relatedTasksTitle: "Previous Occurrences",
        noRelatedTasks: "No previous occurrences.",
        taskNotesLabel: "Add a note",
        taskNotesPlaceholder: "Write a note about this task...",
        addNoteBtn: "Add note",
        noNotes: "No notes yet.",
        deleteNoteHeading: "Delete note?",
        deleteNoteBody: "This action cannot be undone.",
        completedBy: "Completed by",
        notes: "Notes",
        activityLog: "Activity Log",
        noActivity: "No activity recorded yet.",
        activityBy: "by",
        activityEdited: "Edited",
        activityCompleted: "Marked as done",
        activityReopened: "Reopened",
        activityNoteAdded: "Note added",
        activityNoteDeleted: "Note deleted",
        settingsHeading: "IntelliKeep Settings",
        settingsBody: "To change integration settings, go to Settings → Devices & Services → IntelliKeep → Configure.",
        rowsPerPage: "Rows per page:",
        of: "of",
        animationsLabel: "Task animations",
        animationsDesc: "Enable transitions and slide-out effects when completing, deleting, reopening or navigating tasks.",
        deleteAllBtn: "Delete all data",
        deleteAllHeading: "Delete all data?",
        deleteAllBody: "This will permanently delete all tasks, notes and execution history. This action cannot be undone.",
        calendarNavTab: "Calendar",
        calendarWeek: "Week",
        calendarMonth: "Month",
        calendarToday: "Today",
        calendarPrevious: "Previous",
        calendarNext: "Next",
        calendarViewLabel: "Calendar view",
        allDay: "All day",
        moreTasks: (n) => `+${n} more`,
        noTasksDay: "No tasks on this day.",
        noTasksWeek: "No tasks this week.",
        futureRepeat: "Future repeat",
        showFutureRepeats: "Show future repeats",
        listModeLabel: "Show",
        listOpen: "Open",
        listCompleted: "Completed",
        filters: "Filters",
        groupBy: "Group by",
        groupByDue: "Due date",
        groupByArea: "Area",
        groupByNone: "None",
        addTask: "Add task",
        closeSearch: "Close search",
        navLabel: "IntelliKeep sections",
        groupOverdue: "Overdue",
        groupToday: "Today",
        groupThisWeek: "This week",
        groupLater: "Later",
        groupNoArea: "No area",
        markComplete: (name) => `Mark ${name} as complete`,
        reopenTask: (name) => `Reopen ${name}`,
        moreActions: (name) => `More actions for ${name}`,
        duplicate: "Duplicate",
        deleteAction: "Delete",
        taskCompleted: "Task completed",
        undoAction: "Undo",
        actionFailed: (error) => `Something went wrong: ${error}`,
        noCompletedRecently: "No tasks completed in the last 30 days.",
        detailsTab: "Details",
        close: "Close",
        nameLabel: "Name",
        iconLabel: "Icon",
        scheduleSection: "Schedule",
        nextDue: "Next due",
        clearDueDate: "Clear date",
        clearTime: "Remove the time (all day)",
        timeLabel: "Time",
        repeatLabel: "Repeat",
        repeatEvery: "Repeat every",
        doesNotRepeat: "Does not repeat",
        repeatUnitLabel: "Repeat unit",
        repeatUnit: (unit, n) => n === 1 ? { daily: "day", weekly: "week", monthly: "month", yearly: "year" }[unit]
            : { daily: "days", weekly: "weeks", monthly: "months", yearly: "years" }[unit],
        repeats: (unit, n) => n === 1 ? `Repeats ${{ daily: "daily", weekly: "weekly", monthly: "monthly", yearly: "yearly" }[unit]}`
            : `Repeats every ${n} ${{ daily: "days", weekly: "weeks", monthly: "months", yearly: "years" }[unit]}`,
        repeatsShort: (unit, n) => n === 1 ? { daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly" }[unit]
            : `Every ${n} ${{ daily: "days", weekly: "weeks", monthly: "months", yearly: "years" }[unit]}`,
        anchorLegend: "Count the next due date from",
        anchorCompletion: "Completion date",
        anchorCompletionHint: "done late, next one moves too",
        anchorDueDate: "Original due date",
        anchorDueDateHint: "keeps a fixed calendar",
        linkedSection: "Linked to",
        addLink: "Add area or device",
        linkHint: "The area and device filters in the task list, calendar and history use these links.",
        removeLink: (name) => `Remove ${name}`,
        add: "Add",
        notificationsSection: "Notifications",
        remindMe: "Remind me",
        daysBeforeDue: (n) => `day${n === 1 ? "" : "s"} before it is due`,
        markCompleteAction: "Mark complete",
        reopenAction: "Reopen",
        searchHistory: "Search history",
        rangeLast7: "Last 7 days",
        rangeLast30: "Last 30 days",
        rangeLast90: "Last 90 days",
        rangeLast365: "Last 12 months",
        rangeAllTime: "All time",
        colCompleted: "Completed",
        colBy: "By",
        colTiming: "Timing",
        onTime: "On time",
        daysLate: (n) => `${n} day${n === 1 ? "" : "s"} late`,
        openRecord: (name) => `Open ${name}`,
        moreHistoryActions: "More actions",
        noCompletionsInRange: "No completions in this period.",
        allClear: "You're all caught up!",
        allClearSub: "No open tasks. Here's an idea:",
        relaxSuggestions: [
            "\u2615 Brew a fresh cup of coffee and enjoy it slowly.",
            "\u{1F6B6} Take a short walk outside and get some fresh air.",
            "\u{1F4D6} Read a chapter of that book you've been putting off.",
            "\u{1F3B5} Put on your favourite playlist and unwind.",
            "\u{1F9D8} Do a 5-minute breathing exercise.",
            "\u{1F33F} Water your plants and check in on them.",
            "\u{1F3AE} Boot up a game you haven't played in a while.",
            "\u{1F375} Make some tea and watch the world go by.",
        ],
    },
    pt: {
        newTask: "Nova tarefa",
        tasks: "Tarefas",
        settings: "Configurações",
        loading: "Carregando IntelliKeep…",
        editTask: "Editar Tarefa",
        newTaskTitle: "Nova tarefa",
        settingsTitle: "Configurações",
        done: "Concluir",
        undo: "Reabrir",
        edit: "Editar",
        del: "Excluir",
        overdue: "Atrasada",
        pending: "Pendente",
        completed: "Concluída",
        allPriorities: "Todas as prioridades",
        filterAreasLabel: "Áreas",
        filterAreasPlaceholder: "Adicionar filtro de área…",
        filterDevicesLabel: "Dispositivos",
        filterDevicesPlaceholder: "Adicionar filtro de dispositivo…",
        filterModeLabel: "Combinar",
        filterModeAny: "Área OU dispositivo",
        filterModeAll: "Área E dispositivo",
        clearFilters: "Limpar filtros",
        removeFilter: "Remover filtro",
        noResults: "Sem resultados",
        addFilter: "Adicionar",
        filterToggleTitle: "Filtrar por área / dispositivo",
        filterAreaTag: (name) => `Área: ${name}`,
        filterDeviceTag: (name) => `Dispositivo: ${name}`,
        searchPlaceholder: "Buscar tarefas",
        critical: "Crítica",
        high: "Alta",
        medium: "Média",
        low: "Baixa",
        noTasks: "Nenhuma tarefa corresponde aos filtros.",
        deleteHeading: "Excluir tarefa?",
        deleteBody: "Esta ação não pode ser desfeita.",
        noDueDate: "Sem data prevista",
        daysOverdue: (n) => `${n} dia${n !== 1 ? "s" : ""} de atraso`,
        taskName: "Nome da tarefa *",
        taskNamePlaceholder: "ex: Trocar filtro do ar-condicionado",
        description: "Descrição",
        descriptionPlaceholder: "Detalhes opcionais…",
        priority: "Prioridade",
        frequency: "Frequência",
        dueDate: "Data prevista",
        allAreas: "Todas as áreas",
        selectEntity: "Selecionar entidade…",
        noSpecificDevice: "Nenhum device específico",
        notifyOverdue: "Notificar quando atrasada",
        taskNameRequired: "O nome da tarefa é obrigatório.",
        saving: "Salvando…",
        save: "Salvar",
        saveChanges: "Salvar alterações",
        createTask: "Criar tarefa",
        cancel: "Cancelar",
        repeatOn: "Repetir em",
        weekdaysNoneHint: "Nenhum dia selecionado: repete a cada 7 dias após cada conclusão.",
        dueDateSnapped: (d) => `Data prevista movida para o próximo dia selecionado: ${d}`,
        historyLoading: "Carregando…",
        taskNotFound: "Tarefa não encontrada.",
        notesTab: "Notas",
        back: "← Voltar",
        executionHistory: (n) => `Histórico de execuções — ${n} registro${n !== 1 ? "s" : ""}`,
        noExecutions: "Nenhuma execução registrada ainda.",
        taskCompletedReadonly: "Tarefa concluída — campos em modo leitura. Use Reabrir para reabrir.",
        lateLabel: "Atrasada",
        historyNavTab: "Histórico",
        exportCsv: "Exportar CSV",
        printHistory: "Imprimir",
        columns: "Colunas",
        columnPickerTitle: "Colunas visíveis",
        globalHistoryTitle: "Histórico de Execuções",
        globalHistoryEmpty: "Nenhuma execução registrada ainda.",
        taskHeader: "Tarefa",
        viewTask: "Ver",
        relatedTasksTitle: "Ocorrências Anteriores",
        noRelatedTasks: "Nenhuma ocorrência anterior.",
        taskNotesLabel: "Adicionar uma nota",
        taskNotesPlaceholder: "Escreva uma nota sobre esta tarefa...",
        addNoteBtn: "Adicionar nota",
        noNotes: "Nenhuma nota ainda.",
        deleteNoteHeading: "Excluir nota?",
        deleteNoteBody: "Esta ação não pode ser desfeita.",
        completedBy: "Concluída por",
        notes: "Observações",
        activityLog: "Registro de Atividades",
        noActivity: "Nenhuma atividade registrada ainda.",
        activityBy: "por",
        activityEdited: "Editado",
        activityCompleted: "Marcado como concluído",
        activityReopened: "Reaberto",
        activityNoteAdded: "Nota adicionada",
        activityNoteDeleted: "Nota excluída",
        settingsHeading: "Configurações do IntelliKeep",
        settingsBody: "Para alterar as configurações da integração, acesse Configurações → Dispositivos e Serviços → IntelliKeep → Configurar.",
        rowsPerPage: "Linhas por página:",
        of: "de",
        animationsLabel: "Animações de tarefas",
        animationsDesc: "Habilita transições e efeitos de saída ao concluir, excluir, reabrir ou navegar entre tarefas.",
        deleteAllBtn: "Deletar todos os dados",
        deleteAllHeading: "Deletar todos os dados?",
        deleteAllBody: "Isso irá apagar permanentemente todas as tarefas, notas e histórico de execuções. Esta ação não pode ser desfeita.",
        calendarNavTab: "Calendário",
        calendarWeek: "Semana",
        calendarMonth: "Mês",
        calendarToday: "Hoje",
        calendarPrevious: "Anterior",
        calendarNext: "Próximo",
        calendarViewLabel: "Visualização do calendário",
        allDay: "Dia inteiro",
        moreTasks: (n) => `+${n} ${n === 1 ? "outra" : "outras"}`,
        noTasksDay: "Nenhuma tarefa neste dia.",
        noTasksWeek: "Nenhuma tarefa nesta semana.",
        futureRepeat: "Repetição futura",
        showFutureRepeats: "Mostrar repetições futuras",
        listModeLabel: "Mostrar",
        listOpen: "Abertas",
        listCompleted: "Concluídas",
        filters: "Filtros",
        groupBy: "Agrupar por",
        groupByDue: "Vencimento",
        groupByArea: "Área",
        groupByNone: "Nenhum",
        addTask: "Adicionar tarefa",
        closeSearch: "Fechar busca",
        navLabel: "Seções do IntelliKeep",
        groupOverdue: "Atrasadas",
        groupToday: "Hoje",
        groupThisWeek: "Esta semana",
        groupLater: "Mais tarde",
        groupNoArea: "Sem área",
        markComplete: (name) => `Marcar ${name} como concluída`,
        reopenTask: (name) => `Reabrir ${name}`,
        moreActions: (name) => `Mais ações para ${name}`,
        duplicate: "Duplicar",
        deleteAction: "Excluir",
        taskCompleted: "Tarefa concluída",
        undoAction: "Desfazer",
        actionFailed: (error) => `Algo deu errado: ${error}`,
        noCompletedRecently: "Nenhuma tarefa concluída nos últimos 30 dias.",
        detailsTab: "Detalhes",
        close: "Fechar",
        nameLabel: "Nome",
        iconLabel: "Ícone",
        scheduleSection: "Agenda",
        nextDue: "Próximo vencimento",
        clearDueDate: "Limpar data",
        clearTime: "Remover o horário (dia inteiro)",
        timeLabel: "Hora",
        repeatLabel: "Repetição",
        repeatEvery: "Repetir a cada",
        doesNotRepeat: "Não repete",
        repeatUnitLabel: "Unidade da repetição",
        repeatUnit: (unit, n) => n === 1 ? { daily: "dia", weekly: "semana", monthly: "mês", yearly: "ano" }[unit]
            : { daily: "dias", weekly: "semanas", monthly: "meses", yearly: "anos" }[unit],
        repeats: (unit, n) => n === 1 ? `Repete ${{ daily: "todo dia", weekly: "toda semana", monthly: "todo mês", yearly: "todo ano" }[unit]}`
            : `Repete a cada ${n} ${{ daily: "dias", weekly: "semanas", monthly: "meses", yearly: "anos" }[unit]}`,
        repeatsShort: (unit, n) => n === 1 ? { daily: "Todo dia", weekly: "Toda semana", monthly: "Todo mês", yearly: "Todo ano" }[unit]
            : `A cada ${n} ${{ daily: "dias", weekly: "semanas", monthly: "meses", yearly: "anos" }[unit]}`,
        anchorLegend: "Contar o próximo vencimento a partir da",
        anchorCompletion: "Data de conclusão",
        anchorCompletionHint: "concluída com atraso, a próxima também atrasa",
        anchorDueDate: "Data de vencimento original",
        anchorDueDateHint: "mantém um calendário fixo",
        linkedSection: "Vinculada a",
        addLink: "Adicionar área ou dispositivo",
        linkHint: "Os filtros de área e dispositivo da lista, do calendário e do histórico usam esses vínculos.",
        removeLink: (name) => `Remover ${name}`,
        add: "Adicionar",
        notificationsSection: "Notificações",
        remindMe: "Avisar",
        daysBeforeDue: (n) => `dia${n === 1 ? "" : "s"} antes do vencimento`,
        markCompleteAction: "Concluir",
        reopenAction: "Reabrir",
        searchHistory: "Buscar no histórico",
        rangeLast7: "Últimos 7 dias",
        rangeLast30: "Últimos 30 dias",
        rangeLast90: "Últimos 90 dias",
        rangeLast365: "Últimos 12 meses",
        rangeAllTime: "Todo o período",
        colCompleted: "Concluída",
        colBy: "Por",
        colTiming: "Prazo",
        onTime: "No prazo",
        daysLate: (n) => `${n} dia${n === 1 ? "" : "s"} de atraso`,
        openRecord: (name) => `Abrir ${name}`,
        moreHistoryActions: "Mais ações",
        noCompletionsInRange: "Nenhuma conclusão neste período.",
        allClear: "Está tudo em dia!",
        allClearSub: "Nenhuma tarefa em aberto. Que tal:",
        relaxSuggestions: [
            "\u2615 Prepare um café gostoso e aprecie cada gole.",
            "\u{1F6B6} Dê uma caminhada e tome um ar fresco.",
            "\u{1F4D6} Leia um capítulo daquele livro que está esperando.",
            "\u{1F3B5} Coloque sua playlist favorita e relaxe.",
            "\u{1F9D8} Faça um exercício de respiração de 5 minutos.",
            "\u{1F33F} Regue suas plantas e veja como estão.",
            "\u{1F3AE} Jogue aquele jogo que faz tempo que não abre.",
            "\u{1F375} Prepare um chá e observe o mundo passar.",
        ],
    },
    es: {
        newTask: "Nueva tarea",
        tasks: "Tareas",
        settings: "Configuración",
        loading: "Cargando IntelliKeep…",
        editTask: "Editar tarea",
        newTaskTitle: "Nueva tarea",
        settingsTitle: "Configuración",
        done: "Completar",
        undo: "Reabrir",
        edit: "Editar",
        del: "Eliminar",
        overdue: "Vencida",
        pending: "Pendiente",
        completed: "Completada",
        allPriorities: "Todas las prioridades",
        filterAreasLabel: "Áreas",
        filterAreasPlaceholder: "Agregar filtro de área…",
        filterDevicesLabel: "Dispositivos",
        filterDevicesPlaceholder: "Agregar filtro de dispositivo…",
        filterModeLabel: "Combinar",
        filterModeAny: "Área O dispositivo",
        filterModeAll: "Área Y dispositivo",
        clearFilters: "Limpiar filtros",
        removeFilter: "Quitar filtro",
        noResults: "Sin resultados",
        addFilter: "Agregar",
        filterToggleTitle: "Filtrar por área / dispositivo",
        filterAreaTag: (name) => `Área: ${name}`,
        filterDeviceTag: (name) => `Dispositivo: ${name}`,
        searchPlaceholder: "Buscar tareas",
        critical: "Crítica",
        high: "Alta",
        medium: "Media",
        low: "Baja",
        noTasks: "Ninguna tarea coincide con los filtros.",
        deleteHeading: "¿Eliminar tarea?",
        deleteBody: "Esta acción no se puede deshacer.",
        noDueDate: "Sin fecha de vencimiento",
        daysOverdue: (n) => `${n} día${n !== 1 ? "s" : ""} de retraso`,
        taskName: "Nombre de la tarea *",
        taskNamePlaceholder: "ej: Cambiar filtro del aire acondicionado",
        description: "Descripción",
        descriptionPlaceholder: "Detalles opcionales…",
        priority: "Prioridad",
        frequency: "Frecuencia",
        dueDate: "Fecha de vencimiento",
        allAreas: "Todas las áreas",
        selectEntity: "Seleccionar entidad…",
        noSpecificDevice: "Ningún dispositivo específico",
        notifyOverdue: "Notificar cuando esté vencida",
        taskNameRequired: "El nombre de la tarea es obligatorio.",
        saving: "Guardando…",
        save: "Guardar",
        saveChanges: "Guardar cambios",
        createTask: "Crear",
        cancel: "Cancelar",
        repeatOn: "Repetir el",
        weekdaysNoneHint: "Ningún día seleccionado: se repite cada 7 días después de cada finalización.",
        dueDateSnapped: (d) => `Fecha de vencimiento movida al siguiente día seleccionado: ${d}`,
        historyLoading: "Cargando…",
        taskNotFound: "Tarea no encontrada.",
        notesTab: "Notas",
        back: "← Volver",
        executionHistory: (n) => `Historial de ejecuciones — ${n} registro${n !== 1 ? "s" : ""}`,
        noExecutions: "Aún no hay ejecuciones registradas.",
        taskCompletedReadonly: "Tarea completada — campos de solo lectura. Use Reabrir para reabrir.",
        lateLabel: "Con retraso",
        historyNavTab: "Historial",
        exportCsv: "Exportar CSV",
        printHistory: "Imprimir",
        columns: "Columnas",
        columnPickerTitle: "Columnas visibles",
        globalHistoryTitle: "Historial de Ejecuciones",
        globalHistoryEmpty: "Aún no hay ejecuciones registradas.",
        taskHeader: "Tarea",
        viewTask: "Ver",
        relatedTasksTitle: "Ocurrencias anteriores",
        noRelatedTasks: "Sin ocurrencias anteriores.",
        taskNotesLabel: "Agregar una nota",
        taskNotesPlaceholder: "Escribe una nota sobre esta tarea...",
        addNoteBtn: "Agregar nota",
        noNotes: "Aún no hay notas.",
        deleteNoteHeading: "¿Eliminar nota?",
        deleteNoteBody: "Esta acción no se puede deshacer.",
        completedBy: "Completada por",
        notes: "Notas",
        activityLog: "Registro de actividad",
        noActivity: "Aún no hay actividad registrada.",
        activityBy: "por",
        activityEdited: "Editado",
        activityCompleted: "Marcado como completado",
        activityReopened: "Reabierto",
        activityNoteAdded: "Nota agregada",
        activityNoteDeleted: "Nota eliminada",
        settingsHeading: "Configuración de IntelliKeep",
        settingsBody: "Para cambiar la configuración de la integración, ve a Configuración → Dispositivos y servicios → IntelliKeep → Configurar.",
        rowsPerPage: "Filas por página:",
        of: "de",
        animationsLabel: "Animaciones de tareas",
        animationsDesc: "Activa transiciones y efectos de salida al completar, eliminar, reabrir o navegar entre tareas.",
        deleteAllBtn: "Eliminar todos los datos",
        deleteAllHeading: "¿Eliminar todos los datos?",
        deleteAllBody: "Se eliminarán permanentemente todas las tareas, notas e historial de ejecuciones. Esta acción no se puede deshacer.",
        calendarNavTab: "Calendario",
        calendarWeek: "Semana",
        calendarMonth: "Mes",
        calendarToday: "Hoy",
        calendarPrevious: "Anterior",
        calendarNext: "Siguiente",
        calendarViewLabel: "Vista del calendario",
        allDay: "Todo el día",
        moreTasks: (n) => `+${n} más`,
        noTasksDay: "No hay tareas este día.",
        noTasksWeek: "No hay tareas esta semana.",
        futureRepeat: "Repetición futura",
        showFutureRepeats: "Mostrar repeticiones futuras",
        listModeLabel: "Mostrar",
        listOpen: "Abiertas",
        listCompleted: "Completadas",
        filters: "Filtros",
        groupBy: "Agrupar por",
        groupByDue: "Vencimiento",
        groupByArea: "Área",
        groupByNone: "Ninguno",
        addTask: "Agregar tarea",
        closeSearch: "Cerrar búsqueda",
        navLabel: "Secciones de IntelliKeep",
        groupOverdue: "Vencidas",
        groupToday: "Hoy",
        groupThisWeek: "Esta semana",
        groupLater: "Más adelante",
        groupNoArea: "Sin área",
        markComplete: (name) => `Marcar ${name} como completada`,
        reopenTask: (name) => `Reabrir ${name}`,
        moreActions: (name) => `Más acciones para ${name}`,
        duplicate: "Duplicar",
        deleteAction: "Eliminar",
        taskCompleted: "Tarea completada",
        undoAction: "Deshacer",
        actionFailed: (error) => `Algo salió mal: ${error}`,
        noCompletedRecently: "Ninguna tarea completada en los últimos 30 días.",
        detailsTab: "Detalles",
        close: "Cerrar",
        nameLabel: "Nombre",
        iconLabel: "Icono",
        scheduleSection: "Programación",
        nextDue: "Próximo vencimiento",
        clearDueDate: "Borrar fecha",
        clearTime: "Quitar la hora (todo el día)",
        timeLabel: "Hora",
        repeatLabel: "Repetición",
        repeatEvery: "Repetir cada",
        doesNotRepeat: "No se repite",
        repeatUnitLabel: "Unidad de repetición",
        repeatUnit: (unit, n) => n === 1 ? { daily: "día", weekly: "semana", monthly: "mes", yearly: "año" }[unit]
            : { daily: "días", weekly: "semanas", monthly: "meses", yearly: "años" }[unit],
        repeats: (unit, n) => n === 1 ? `Se repite ${{ daily: "cada día", weekly: "cada semana", monthly: "cada mes", yearly: "cada año" }[unit]}`
            : `Se repite cada ${n} ${{ daily: "días", weekly: "semanas", monthly: "meses", yearly: "años" }[unit]}`,
        repeatsShort: (unit, n) => n === 1 ? { daily: "Cada día", weekly: "Cada semana", monthly: "Cada mes", yearly: "Cada año" }[unit]
            : `Cada ${n} ${{ daily: "días", weekly: "semanas", monthly: "meses", yearly: "años" }[unit]}`,
        anchorLegend: "Contar el próximo vencimiento desde la",
        anchorCompletion: "Fecha de finalización",
        anchorCompletionHint: "si se completa tarde, la siguiente también se retrasa",
        anchorDueDate: "Fecha de vencimiento original",
        anchorDueDateHint: "mantiene un calendario fijo",
        linkedSection: "Vinculada a",
        addLink: "Agregar área o dispositivo",
        linkHint: "Los filtros de área y dispositivo de la lista, el calendario y el historial usan estos vínculos.",
        removeLink: (name) => `Quitar ${name}`,
        add: "Agregar",
        notificationsSection: "Notificaciones",
        remindMe: "Avisar",
        daysBeforeDue: (n) => `día${n === 1 ? "" : "s"} antes del vencimiento`,
        markCompleteAction: "Completar",
        reopenAction: "Reabrir",
        searchHistory: "Buscar en el historial",
        rangeLast7: "Últimos 7 días",
        rangeLast30: "Últimos 30 días",
        rangeLast90: "Últimos 90 días",
        rangeLast365: "Últimos 12 meses",
        rangeAllTime: "Todo el periodo",
        colCompleted: "Completada",
        colBy: "Por",
        colTiming: "Puntualidad",
        onTime: "A tiempo",
        daysLate: (n) => `${n} día${n === 1 ? "" : "s"} de retraso`,
        openRecord: (name) => `Abrir ${name}`,
        moreHistoryActions: "Más acciones",
        noCompletionsInRange: "Ninguna finalización en este periodo.",
        allClear: "¡Todo al día!",
        allClearSub: "Sin tareas abiertas. Una idea:",
        relaxSuggestions: [
            "\u2615 Prepara un café y disfrútalo con calma.",
            "\u{1F6B6} Da un paseo corto y toma aire fresco.",
            "\u{1F4D6} Lee un capítulo de ese libro que tienes pendiente.",
            "\u{1F3B5} Pon tu playlist favorita y relájate.",
            "\u{1F9D8} Haz un ejercicio de respiración de 5 minutos.",
            "\u{1F33F} Riega tus plantas y comprueba cómo están.",
            "\u{1F3AE} Abre ese juego que hace tiempo no juegas.",
            "\u{1F375} Prepara un té y observa el mundo pasar.",
        ],
    },
};
function t(language) {
    const lang = language?.split("-")[0]?.toLowerCase();
    return messages[lang] ?? messages.en;
}

/** Returns true when the device has a precise pointer and hover support (desktop/laptop). */
const isDesktop = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const pad2 = (n) => String(n).padStart(2, "0");
/** Local calendar date of `d` as YYYY-MM-DD, the format of `<input type="date">`. */
const localDate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
/** Local time of day of `d` as HH:MM, the format of `<input type="time">`. */
const localTime = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
/** Language of the user's Home Assistant profile, used for every date and time. */
const hassLanguage = (hass) => hass?.locale?.language ?? hass?.language ?? "en";
/**
 * Time zone Home Assistant shows times in: the server's when the user profile
 * asks for it, otherwise undefined, which Intl reads as the browser's own zone.
 */
const hassTimeZone = (hass) => hass?.locale?.time_zone === "server" ? hass.config?.time_zone : undefined;
/** 12- or 24-hour clock from the profile's time format; undefined follows the language. */
const hourCycle = (hass) => {
    switch (hass?.locale?.time_format) {
        case "12":
            return "h12";
        case "24":
            return "h23";
        case "system":
            return formatter(undefined, { hour: "numeric" }).resolvedOptions().hour12 ? "h12" : "h23";
        default:
            return undefined;
    }
};
// Building an Intl.DateTimeFormat is slow, and lists format the same pattern for every row
const formatters = new Map();
const formatter = (language, options) => {
    const key = JSON.stringify([language, options]);
    let f = formatters.get(key);
    if (!f) {
        f = new Intl.DateTimeFormat(language, options);
        formatters.set(key, f);
    }
    return f;
};
const format = (date, hass, options) => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime()))
        return "—";
    const opts = { timeZone: hassTimeZone(hass), ...options };
    if (opts.hour !== undefined)
        opts.hourCycle ?? (opts.hourCycle = hourCycle(hass));
    return formatter(hassLanguage(hass), opts).format(d);
};
const DATE = { year: "numeric", month: "short", day: "numeric" };
const TIME = { hour: "numeric", minute: "2-digit" };
/** Date like "Oct 18, 2026" / "18 de out. de 2026"; `options` override the default fields. */
const formatDate = (date, hass, options = {}) => format(date, hass, { ...DATE, ...options });
/** Time of day like "19:14" or "7:14 PM", following the profile's 12/24-hour setting. */
const formatTime = (date, hass, options = {}) => format(date, hass, { ...TIME, ...options });
/** Date and time like "Oct 18, 2026, 7:14 PM"; `options` override the default fields. */
const formatDateTime = (date, hass, options = {}) => format(date, hass, { ...DATE, ...TIME, ...options });
/** Calendar date of `d` in `timeZone` as a UTC timestamp, so day differences ignore DST. */
const dayStamp = (d, timeZone) => {
    if (Number.isNaN(d.getTime()))
        return NaN;
    if (!timeZone)
        return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    const parts = formatter("en-US", { timeZone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(d);
    const part = (type) => Number(parts.find(p => p.type === type)?.value);
    return Date.UTC(part("year"), part("month") - 1, part("day"));
};
/** Calendar day of `date` in the Home Assistant time zone, as a UTC midnight: a date with no zone, so adding days ignores DST. */
const calendarDay = (date, hass) => new Date(dayStamp(new Date(date), hassTimeZone(hass)));
/** Whether `date` is midnight in the Home Assistant time zone, which is how a due date without a time is saved. */
const isMidnight = (date, hass) => {
    const parts = formatter("en-US", { timeZone: hassTimeZone(hass), hour: "numeric", minute: "numeric", hourCycle: "h23" })
        .formatToParts(new Date(date));
    const part = (type) => Number(parts.find(p => p.type === type)?.value);
    return part("hour") === 0 && part("minute") === 0;
};
/** A span like "Oct 19 – 25, 2026", with the parts both ends share written once; `options` override the default fields. */
const formatDateRange = (start, end, hass, options = {}) => {
    const f = formatter(hassLanguage(hass), { timeZone: hassTimeZone(hass), ...DATE, ...options });
    return f.formatRange ? f.formatRange(start, end) : `${f.format(start)} – ${f.format(end)}`;
};
/** Calendar days from `from` to `to` in the Home Assistant time zone. */
const daysBetween = (from, to, hass) => {
    const timeZone = hassTimeZone(hass);
    return Math.round((dayStamp(new Date(to), timeZone) - dayStamp(new Date(from), timeZone)) / 86400000);
};
/** Calendar days from today to `d` in the Home Assistant time zone; negative once `d` is a past day. */
const daysUntil = (d, hass) => {
    const timeZone = hassTimeZone(hass);
    return Math.round((dayStamp(d, timeZone) - dayStamp(new Date(), timeZone)) / 86400000);
};
/** "Today", "Yesterday" or "Tomorrow" in the profile language; null for any other day. */
const relativeDay = (date, hass) => {
    const days = daysUntil(new Date(date), hass);
    if (Number.isNaN(days) || Math.abs(days) > 1)
        return null;
    const raw = new Intl.RelativeTimeFormat(hassLanguage(hass), { numeric: "auto" }).format(days, "day");
    return raw.charAt(0).toUpperCase() + raw.slice(1);
};
/**
 * "Today, 19:14", "Yesterday, 08:02" or "Tomorrow, 09:00" for the days next
 * to today; any other day falls back to formatDateTime.
 */
const formatRelative = (date, hass) => {
    const day = relativeDay(date, hass);
    return day ? `${day}, ${formatTime(date, hass)}` : formatDateTime(date, hass);
};
/** A due date like formatRelative, but just "Today" for a task due all day (saved at midnight), as the calendar shows it. */
const formatRelativeDue = (date, hass) => isMidnight(date, hass) ? relativeDay(date, hass) ?? formatDate(date, hass) : formatRelative(date, hass);
/** Short day like "Tue, Oct 20"; the year is added only when it isn't the current one. */
const formatShortDate = (date, hass) => {
    const d = new Date(date);
    const timeZone = hassTimeZone(hass);
    const year = (stamp) => new Date(stamp).getUTCFullYear();
    const sameYear = year(dayStamp(d, timeZone)) === year(dayStamp(new Date(), timeZone));
    return formatDate(d, hass, { weekday: "short", year: sameYear ? undefined : "numeric" });
};
const WEEKDAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
// CLDR regions whose week starts on Sunday or Saturday, for browsers without Intl.Locale week info
const SUNDAY_FIRST = new Set("AG AS BD BR BS BT BW BZ CA CN CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW".split(" "));
const SATURDAY_FIRST = new Set("AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY".split(" "));
/** First day of the week (0 = Sunday): the profile setting, or the convention of the language's region. */
const firstWeekday = (hass) => {
    const named = WEEKDAY_NAMES.indexOf(hass?.locale?.first_weekday ?? "language");
    if (named >= 0)
        return named;
    try {
        const locale = new Intl.Locale(hassLanguage(hass));
        const info = locale.getWeekInfo?.() ?? locale.weekInfo;
        if (info)
            return info.firstDay % 7;
        const region = locale.maximize().region ?? "";
        return SUNDAY_FIRST.has(region) ? 0 : SATURDAY_FIRST.has(region) ? 6 : 1;
    }
    catch {
        return 1;
    }
};
/** Days from today to the first day of next week (1 to 7), in the Home Assistant time zone. */
const daysUntilNextWeek = (hass) => {
    const today = new Date(dayStamp(new Date(), hassTimeZone(hass))).getUTCDay();
    return (firstWeekday(hass) - today + 7) % 7 || 7;
};
/** Shows a Home Assistant toast, optionally with an action button such as Undo. */
const showToast = (el, message, action, duration = 4000) => {
    el.dispatchEvent(new CustomEvent("hass-notification", {
        detail: { message, action, duration },
        bubbles: true,
        composed: true,
    }));
};
/** Short weekday name in the profile language, capitalized ("Mon", "Seg"); 2024-01-01 is a Monday. */
const weekdayName = (code, hass) => {
    const raw = new Date(2024, 0, 1 + WEEKDAYS.indexOf(code))
        .toLocaleDateString(hassLanguage(hass), { weekday: "short" })
        .replace(/\.$/, "");
    return raw.charAt(0).toUpperCase() + raw.slice(1);
};
/** "Repeats monthly", "Repeats every 2 weeks (Mon, Thu)" (short: "Monthly", "Every 2 weeks (Mon, Thu)"); null for one-time tasks. */
const repeatLabel = (task, hass, short = false) => {
    if (task.frequency === "one_time")
        return null;
    const tr = t(hass?.language ?? "en");
    const label = (short ? tr.repeatsShort : tr.repeats)(task.frequency, Math.max(1, task.repeat_interval || 1));
    const days = task.frequency === "weekly" ? (task.weekdays ?? []).map((code) => weekdayName(code, hass)) : [];
    return days.length ? `${label} (${days.join(", ")})` : label;
};
/** Readable text of an error from a service call or anything thrown. */
const errorText = (err) => err instanceof Error ? err.message : err?.message ?? String(err);

/**
 * Design tokens (docs/design/DESIGN.md, section 2), mapped onto Home Assistant
 * theme variables so the light theme and user themes keep working. They are set
 * once on the panel host and inherit into every view and dialog rendered inside it.
 */
const tokens = i$6 `
  :host {
    /* Surfaces */
    --ik-surface: var(--ha-card-background, var(--card-background-color));
    --ik-dialog-surface: var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color)));
    --ik-subtle-fill: var(--secondary-background-color);
    --ik-field-fill: var(--ha-color-form-background, var(--secondary-background-color));
    --ik-focus-ring: var(--ha-color-focus, var(--primary-color));

    /*
     * Red and amber mean urgency only: overdue, due today, and Critical priority.
     * Text mixes the theme color with the text color so it keeps 4.5:1 contrast:
     * lighter on dark themes, darker on light ones (raw amber on white is about 2:1).
     */
    --ik-error-text: color-mix(in srgb, var(--error-color) 70%, var(--primary-text-color));
    --ik-error-fill: color-mix(in srgb, var(--error-color) 20%, transparent);
    --ik-warning-text: color-mix(in srgb, var(--warning-color) 55%, var(--primary-text-color));
    --ik-warning-fill: color-mix(in srgb, var(--warning-color) 16%, transparent);
    --ik-success-text: color-mix(in srgb, var(--success-color) 60%, var(--primary-text-color));
    --ik-success-fill: color-mix(in srgb, var(--success-color) 16%, transparent);
    --ik-primary-fill: color-mix(in srgb, var(--primary-color) 16%, transparent);

    /* Shape */
    --ik-radius-card: var(--ha-card-border-radius, 12px);
    --ik-radius-dialog: 24px;
    --ik-radius-pill: 20px;
    --ik-radius-field: 10px;
    --ik-radius-chip: 14px;
    --ik-chip-height: 28px;
    --ik-hit-target: 44px;

    /* Type scale; the font family always comes from Home Assistant */
    --ik-row-title-size: 15px;
    --ik-row-title-weight: 500;
    --ik-row-secondary-size: 13px;
    --ik-group-header-size: 13px;
    --ik-group-header-weight: 500;
    --ik-group-header-spacing: 0.03em;
  }
`;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u=(e,s,t)=>{const r=new Map;for(let l=s;l<=t;l++)r.set(e[l],l);return r},c=e(class extends i$2{constructor(e){if(super(e),e.type!==t$2.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,s,t){let r;void 0===t?t=s:void 0!==s&&(r=s);const l=[],o=[];let i=0;for(const s of e)l[i]=r?r(s,i):i,o[i]=t(s,i),i++;return {values:o,keys:l}}render(e,s,t){return this.dt(e,s,t).values}update(s,[t,r,c]){const d=M(s),{values:p$1,keys:a}=this.dt(t,r,c);if(!Array.isArray(d))return this.ut=a,p$1;const h$1=this.ut??=[],v$1=[];let m,y,x=0,j=d.length-1,k=0,w=p$1.length-1;for(;x<=j&&k<=w;)if(null===d[x])x++;else if(null===d[j])j--;else if(h$1[x]===a[k])v$1[k]=u$1(d[x],p$1[k]),x++,k++;else if(h$1[j]===a[w])v$1[w]=u$1(d[j],p$1[w]),j--,w--;else if(h$1[x]===a[w])v$1[w]=u$1(d[x],p$1[w]),v(s,v$1[w+1],d[x]),x++,w--;else if(h$1[j]===a[k])v$1[k]=u$1(d[j],p$1[k]),v(s,d[x],d[j]),j--,k++;else if(void 0===m&&(m=u(a,k,w),y=u(h$1,x,j)),m.has(h$1[x]))if(m.has(h$1[j])){const e=y.get(a[k]),t=void 0!==e?d[e]:null;if(null===t){const e=v(s,d[x]);u$1(e,p$1[k]),v$1[k]=e;}else v$1[k]=u$1(t,p$1[k]),v(s,d[x],t),d[e]=null;k++;}else h(d[j]),j--;else h(d[x]),x++;for(;k<=w;){const e=v(s,v$1[w+1]);u$1(e,p$1[k]),v$1[k++]=e;}for(;x<=j;){const e=d[x++];null!==e&&h(e);}return this.ut=a,p(s,v$1),E}});

/**
 * Button that opens a list of actions. HA's own menu elements are lazy-loaded
 * and not guaranteed in a custom panel, so this one is self-contained. The list
 * is position: fixed, so scrolling containers and card borders don't clip it.
 * Fires `menu-select` with the chosen item's `action`.
 */
let IkMenu = class IkMenu extends i$3 {
    constructor() {
        super(...arguments);
        this.items = [];
        /** Accessible name of the icon button, or the visible text of the pill button. */
        this.label = "";
        this.icon = "mdi:dots-vertical";
        /** Text button with a chevron instead of an icon-only button. */
        this.pill = false;
        /** Pill only: an icon before the text. */
        this.pillIcon = "";
        this._open = false;
        this._position = "";
        this._onViewportChange = (e) => {
            // Scrolling inside the menu itself must not close it
            if (e.type === "scroll" && e.composedPath().includes(this.renderRoot.querySelector(".menu")))
                return;
            this._close(false);
        };
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._close(false);
    }
    updated(changed) {
        if (changed.has("_open") && this._open) {
            const items = this._items();
            (items.find((i) => i.getAttribute("aria-checked") === "true") ?? items[0])?.focus();
        }
    }
    _items() {
        return Array.from(this.renderRoot.querySelectorAll(".item"));
    }
    _toggle(e) {
        e.stopPropagation();
        if (this._open) {
            this._close();
            return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const estimatedHeight = this.items.length * 44 + 16;
        const vertical = rect.bottom + estimatedHeight > window.innerHeight && rect.top > estimatedHeight
            ? `bottom: ${window.innerHeight - rect.top + 4}px`
            : `top: ${rect.bottom + 4}px`;
        this._position = `${vertical}; right: ${Math.max(8, window.innerWidth - rect.right)}px`;
        this._open = true;
        window.addEventListener("scroll", this._onViewportChange, true);
        window.addEventListener("resize", this._onViewportChange);
    }
    _close(refocus = true) {
        if (!this._open)
            return;
        this._open = false;
        window.removeEventListener("scroll", this._onViewportChange, true);
        window.removeEventListener("resize", this._onViewportChange);
        if (refocus)
            this.renderRoot.querySelector(".trigger")?.focus();
    }
    _select(action) {
        this._close();
        this.dispatchEvent(new CustomEvent("menu-select", { detail: action, bubbles: true, composed: true }));
    }
    _onKeydown(e) {
        const items = this._items();
        const index = items.indexOf(this.shadowRoot?.activeElement);
        const focus = (i) => items[(i + items.length) % items.length]?.focus();
        switch (e.key) {
            case "ArrowDown":
                focus(index + 1);
                break;
            case "ArrowUp":
                focus(index - 1);
                break;
            case "Home":
                focus(0);
                break;
            case "End":
                focus(items.length - 1);
                break;
            case "Escape":
                this._close();
                break;
            case "Tab":
                this._close(false);
                return;
            default: return;
        }
        e.preventDefault();
    }
    render() {
        return b `
      <button
        class="trigger ${this.pill ? "pill" : "icon"}"
        aria-haspopup="menu"
        aria-expanded=${this._open ? "true" : "false"}
        aria-label=${this.pill ? A : this.label}
        title=${this.pill ? A : this.label}
        @click=${this._toggle}
      >
        ${this.pill
            ? b `${this.pillIcon ? b `<ha-icon icon=${this.pillIcon}></ha-icon>` : A}${this.label}<ha-icon icon="mdi:chevron-down"></ha-icon>`
            : b `<ha-icon icon=${this.icon}></ha-icon>`}
      </button>
      ${this._open ? b `
        <div class="scrim" @click=${(e) => { e.stopPropagation(); this._close(false); }}></div>
        <div class="menu" role="menu" style=${this._position} @keydown=${this._onKeydown}>
          ${this.items.map((item) => "divider" in item
            ? b `<div class="divider" role="separator"></div>`
            : b `
              <button
                class="item ${item.danger ? "danger" : ""}"
                role=${item.selected === undefined ? "menuitem" : "menuitemradio"}
                aria-checked=${item.selected === undefined ? A : String(item.selected)}
                @click=${(e) => { e.stopPropagation(); this._select(item.action); }}
              >
                ${item.icon ? b `<ha-icon icon=${item.icon}></ha-icon>` : A}
                ${item.label}
                ${item.selected ? b `<ha-icon class="check" icon="mdi:check"></ha-icon>` : A}
              </button>
            `)}
        </div>
      ` : A}
    `;
    }
};
IkMenu.styles = i$6 `
    :host { display: inline-flex; }
    .trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      font: inherit;
    }
    .trigger.icon {
      width: var(--ik-hit-target, 44px);
      height: var(--ik-hit-target, 44px);
      border-radius: 50%;
      --mdc-icon-size: 20px;
    }
    .trigger.pill {
      gap: 8px;
      height: 40px;
      padding: 0 12px 0 16px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-pill, 20px);
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      --mdc-icon-size: 18px;
    }
    .trigger:hover { background: var(--ik-subtle-fill, var(--secondary-background-color)); color: var(--primary-text-color); }
    .trigger:focus-visible, .item:focus-visible {
      outline: 2px solid var(--ik-focus-ring, var(--primary-color));
      outline-offset: -2px;
    }
    .scrim { position: fixed; inset: 0; z-index: 10; }
    .menu {
      position: fixed;
      z-index: 11;
      min-width: 180px;
      max-height: 70vh;
      overflow-y: auto;
      padding: 6px 0;
      border-radius: 12px;
      background: var(--ik-surface, var(--card-background-color));
      border: 1px solid var(--divider-color);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.24);
    }
    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: var(--ik-hit-target, 44px);
      padding: 0 16px;
      border: none;
      background: none;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
      text-align: start;
      cursor: pointer;
      --mdc-icon-size: 20px;
    }
    .item ha-icon { color: var(--secondary-text-color); }
    .item:hover { background: var(--ik-subtle-fill, var(--secondary-background-color)); }
    .item.danger, .item.danger ha-icon { color: var(--error-color); }
    .item .check { margin-inline-start: auto; color: var(--primary-color); }
    .divider { height: 1px; margin: 6px 0; background: var(--divider-color); }
  `;
__decorate([
    n({ attribute: false })
], IkMenu.prototype, "items", void 0);
__decorate([
    n()
], IkMenu.prototype, "label", void 0);
__decorate([
    n()
], IkMenu.prototype, "icon", void 0);
__decorate([
    n({ type: Boolean })
], IkMenu.prototype, "pill", void 0);
__decorate([
    n()
], IkMenu.prototype, "pillIcon", void 0);
__decorate([
    r()
], IkMenu.prototype, "_open", void 0);
__decorate([
    r()
], IkMenu.prototype, "_position", void 0);
IkMenu = __decorate([
    t$3("ik-menu")
], IkMenu);

const PRIORITY_ICON = {
    critical: "mdi:chevron-double-up",
    high: "mdi:chevron-up",
    medium: "mdi:equal",
    low: "mdi:chevron-down",
};
/** Overdue and due-today rows are tinted; nothing else is. */
const urgencyOf = (task, hass) => {
    if (task.status === "overdue")
        return "overdue";
    if (task.status !== "completed" && task.due_date && daysUntil(new Date(task.due_date), hass) <= 0)
        return "today";
    return null;
};
/**
 * One task in the list: checkbox, icon, name and description, priority, due
 * chip and a ⋮ menu. With `completion` set the row stands for that completion
 * record instead, checked, with the completion time in the chip.
 * `narrow` keeps only the checkbox and the name, with due, priority and
 * repeat in one line under it.
 * Fires `task-toggle` from the checkbox, `task-open` from the name and
 * `menu-select` (detail: "edit" | "duplicate" | "history" | "delete") from the menu.
 */
let IkTaskCard = class IkTaskCard extends i$3 {
    constructor() {
        super(...arguments);
        this.completion = null;
        /** An action on this task is in flight. */
        this.busy = false;
        /** Completed rows only: whether unchecking may reopen the task. */
        this.canReopen = false;
        this.narrow = false;
        /** Narrow only: the row sits under a "Today" header, so a due time alone is enough. */
        this.timeOnly = false;
    }
    _fire(type) {
        this.dispatchEvent(new CustomEvent(type));
    }
    /** The name and the text under it open the task. */
    _onTextClick(e) {
        // Modified clicks keep the browser's own handling (open in a new tab)
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
            return;
        e.preventDefault();
        this._fire("task-open");
    }
    /** Narrow rows: "3 days overdue · High · Monthly" under the name. */
    _renderMeta(urgency) {
        const { task } = this;
        const tr = t(this.hass?.language);
        const dot = b `<span aria-hidden="true">·</span>`;
        let due = A;
        if (this.completion) {
            due = b `<span class="meta-item done"><ha-icon icon="mdi:check"></ha-icon>${formatRelative(this.completion.completed_at, this.hass)}</span>`;
        }
        else if (task.due_date && urgency === "overdue") {
            const days = -daysUntil(new Date(task.due_date), this.hass);
            due = b `<span class="meta-item overdue">${days > 0 ? tr.daysOverdue(days) : tr.overdue}</span>`;
        }
        else if (task.due_date && urgency === "today") {
            // Under the Today header only the time is left to say; a task due all day has none
            const when = !this.timeOnly ? formatRelativeDue(task.due_date, this.hass)
                : isMidnight(task.due_date, this.hass) ? tr.allDay : formatTime(task.due_date, this.hass);
            due = b `<span class="meta-item today">${when}</span>`;
        }
        else if (task.due_date) {
            due = b `<span class="meta-item">${formatShortDate(task.due_date, this.hass)}</span>`;
        }
        const repeat = repeatLabel(task, this.hass, true);
        return b `
      <div class="meta">
        ${due}${due !== A ? dot : A}
        <span class="meta-item ${task.priority}">
          <ha-icon icon=${PRIORITY_ICON[task.priority] ?? PRIORITY_ICON.medium}></ha-icon>${tr[task.priority] ?? task.priority}
        </span>
        ${repeat ? b `${dot}<span class="meta-item"><ha-icon icon="mdi:repeat"></ha-icon>${repeat}</span>` : A}
      </div>
    `;
    }
    _renderChip(urgency) {
        const tr = t(this.hass?.language);
        if (this.completion) {
            return b `<span class="chip done"><ha-icon icon="mdi:check"></ha-icon>${formatRelative(this.completion.completed_at, this.hass)}</span>`;
        }
        const { due_date } = this.task;
        if (!due_date)
            return A;
        if (urgency === "overdue") {
            const days = -daysUntil(new Date(due_date), this.hass);
            return b `<span class="chip overdue"><ha-icon icon="mdi:alert-outline"></ha-icon>${days > 0 ? tr.daysOverdue(days) : tr.overdue}</span>`;
        }
        if (urgency === "today") {
            return b `<span class="chip today"><ha-icon icon="mdi:clock-outline"></ha-icon>${formatRelativeDue(due_date, this.hass)}</span>`;
        }
        return b `<span class="chip">${formatShortDate(due_date, this.hass)}</span>`;
    }
    render() {
        const { task } = this;
        const tr = t(this.hass?.language);
        const checked = this.completion !== null || this.busy;
        const urgency = this.completion ? null : urgencyOf(task, this.hass);
        const menuItems = [
            { action: "edit", label: tr.edit, icon: "mdi:pencil-outline" },
            { action: "duplicate", label: tr.duplicate, icon: "mdi:content-copy" },
            { action: "history", label: tr.historyNavTab, icon: "mdi:history" },
            { divider: true },
            { action: "delete", label: tr.deleteAction, icon: "mdi:delete-outline", danger: true },
        ];
        return b `
      <div class="row ${urgency ?? ""}">
        <button
          class="check"
          role="checkbox"
          aria-checked=${checked ? "true" : "false"}
          aria-label=${this.completion ? tr.reopenTask(task.name) : tr.markComplete(task.name)}
          ?disabled=${this.busy || (this.completion !== null && !this.canReopen)}
          @click=${() => this._fire("task-toggle")}
        >
          <span class="box">${checked ? b `<ha-icon icon="mdi:check"></ha-icon>` : A}</span>
        </button>
        ${this.narrow ? b `
          <div class="text" @click=${this._onTextClick}>
            <a class="name" href="#/edit/${task.task_id}">${task.name}</a>
            ${this._renderMeta(urgency)}
          </div>
        ` : b `
          <div class="icon" aria-hidden="true"><ha-icon icon=${task.icon || "mdi:wrench-outline"}></ha-icon></div>
          <div class="text" @click=${this._onTextClick}>
            <a class="name" href="#/edit/${task.task_id}">${task.name}</a>${task.task_number
            ? b `<span class="number">#${String(task.task_number).padStart(3, "0")}</span>`
            : A}
            ${task.description ? b `<div class="desc">${task.description}</div>` : A}
          </div>
          <div class="priority ${task.priority}">
            <ha-icon icon=${PRIORITY_ICON[task.priority] ?? PRIORITY_ICON.medium}></ha-icon>${tr[task.priority] ?? task.priority}
          </div>
          <div class="due">${this._renderChip(urgency)}</div>
          <ik-menu .items=${menuItems} .label=${tr.moreActions(task.name)}></ik-menu>
        `}
      </div>
    `;
    }
};
IkTaskCard.styles = i$6 `
    :host { display: block; }
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      min-height: 72px;
      padding: 6px 4px;
      box-sizing: border-box;
    }
    button { font: inherit; }
    button:focus-visible, a:focus-visible {
      outline: 2px solid var(--ik-focus-ring);
      outline-offset: 2px;
    }
    .check {
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      cursor: pointer;
    }
    .check:hover:not(:disabled) { background: var(--ik-subtle-fill); }
    .check:disabled { cursor: default; }
    .box {
      width: 20px;
      height: 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--secondary-text-color);
      border-radius: 6px;
      color: var(--text-primary-color);
      --mdc-icon-size: 16px;
    }
    .check:hover:not(:disabled) .box { border-color: var(--primary-color); }
    .check[aria-checked="true"] .box {
      background: var(--primary-color);
      border-color: var(--primary-color);
    }
    .check:disabled .box { opacity: 0.6; }
    .icon {
      width: 40px;
      height: 40px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--ik-subtle-fill);
      color: var(--primary-text-color);
      --mdc-icon-size: 20px;
    }
    .overdue .icon { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .today .icon { background: var(--ik-warning-fill); color: var(--ik-warning-text); }
    .text { flex: 1 1 260px; min-width: 0; cursor: pointer; }
    .name {
      font-size: var(--ik-row-title-size);
      font-weight: var(--ik-row-title-weight);
      color: var(--primary-text-color);
      text-decoration: none;
      overflow-wrap: anywhere;
    }
    .name:hover { text-decoration: underline; }
    .number {
      margin-inline-start: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .desc {
      margin-top: 3px;
      font-size: var(--ik-row-secondary-size);
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .priority {
      width: 96px;
      flex: none;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--ik-row-secondary-size);
      color: var(--secondary-text-color);
      --mdc-icon-size: 16px;
    }
    .priority.high { color: var(--primary-text-color); }
    .priority.critical { color: var(--ik-error-text); }
    .due {
      width: 168px;
      flex: none;
      display: flex;
      justify-content: flex-end;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: var(--ik-chip-height);
      padding: 0 12px;
      border-radius: var(--ik-radius-chip);
      background: var(--ik-subtle-fill);
      color: var(--primary-text-color);
      font-size: var(--ik-row-secondary-size);
      font-weight: 500;
      white-space: nowrap;
      --mdc-icon-size: 14px;
    }
    .chip.overdue { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .chip.today { background: var(--ik-warning-fill); color: var(--ik-warning-text); }
    .chip.done { background: var(--ik-success-fill); color: var(--ik-success-text); }

    :host([narrow]) .row {
      flex-wrap: nowrap;
      gap: 6px;
      min-height: 64px;
      padding: 4px 8px 4px 0;
    }
    :host([narrow]) .text { flex: 1 1 auto; }
    :host([narrow]) .name {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px 6px;
      margin-top: 3px;
      font-size: var(--ik-row-secondary-size);
      color: var(--secondary-text-color);
      --mdc-icon-size: 14px;
    }
    .meta-item { display: inline-flex; align-items: center; gap: 4px; }
    .meta .overdue { color: var(--ik-error-text); font-weight: 500; }
    .meta .today { color: var(--ik-warning-text); font-weight: 500; }
    .meta .done { color: var(--ik-success-text); font-weight: 500; }
    .meta .high ha-icon { color: var(--primary-text-color); }
    .meta .critical ha-icon { color: var(--ik-error-text); }
  `;
__decorate([
    n({ attribute: false })
], IkTaskCard.prototype, "task", void 0);
__decorate([
    n({ attribute: false })
], IkTaskCard.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], IkTaskCard.prototype, "completion", void 0);
__decorate([
    n({ type: Boolean })
], IkTaskCard.prototype, "busy", void 0);
__decorate([
    n({ type: Boolean })
], IkTaskCard.prototype, "canReopen", void 0);
__decorate([
    n({ type: Boolean, reflect: true })
], IkTaskCard.prototype, "narrow", void 0);
__decorate([
    n({ type: Boolean })
], IkTaskCard.prototype, "timeOnly", void 0);
IkTaskCard = __decorate([
    t$3("ik-task-card")
], IkTaskCard);

/** The focused element, looking inside open shadow roots. */
const deepActiveElement = () => {
    let el = document.activeElement;
    while (el?.shadowRoot?.activeElement)
        el = el.shadowRoot.activeElement;
    return el;
};
/**
 * Asks to confirm a destructive action. While open it holds the keyboard
 * focus (Cancel first), Escape cancels, and closing gives the focus back to
 * where it was.
 */
let IkConfirmDialog = class IkConfirmDialog extends i$3 {
    constructor() {
        super(...arguments);
        this.heading = "Are you sure?";
        this.confirmText = "Confirm";
        this.cancelText = "Cancel";
        this.open = false;
        this._returnFocus = null;
    }
    willUpdate(changed) {
        if (changed.has("open") && this.open)
            this._returnFocus = deepActiveElement();
    }
    updated(changed) {
        if (!changed.has("open"))
            return;
        if (this.open) {
            // Cancel first, so Enter right after opening doesn't confirm
            this.renderRoot.querySelector(".cancel")?.focus();
        }
        else if (changed.get("open")) {
            if (this._returnFocus?.isConnected)
                this._returnFocus.focus();
            this._returnFocus = null;
        }
    }
    _fire(confirmed) {
        this.dispatchEvent(new CustomEvent("dialog-closed", { detail: { confirmed } }));
        this.open = false;
    }
    _onKeydown(e) {
        if (e.key === "Escape") {
            // Only this dialog closes, not a task dialog under it
            e.stopPropagation();
            this._fire(false);
        }
        else if (e.key === "Tab") {
            // Tab and Shift+Tab move between the two buttons instead of the page behind
            e.preventDefault();
            const cancel = this.renderRoot.querySelector(".cancel");
            const confirm = this.renderRoot.querySelector(".confirm");
            (this.renderRoot.activeElement === cancel ? confirm : cancel)?.focus();
        }
    }
    render() {
        if (!this.open)
            return b ``;
        return b `
      <div class="backdrop" @click=${() => this._fire(false)} @keydown=${this._onKeydown}>
        <div
          class="dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="heading"
          aria-describedby="content"
          @click=${(e) => e.stopPropagation()}
        >
          <h3 id="heading">${this.heading}</h3>
          <div class="content" id="content"><slot></slot></div>
          <div class="buttons">
            <button class="cancel" @click=${() => this._fire(false)}>${this.cancelText}</button>
            <button class="confirm" @click=${() => this._fire(true)}>${this.confirmText}</button>
          </div>
        </div>
      </div>
    `;
    }
};
IkConfirmDialog.styles = i$6 `
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      padding: 24px;
      min-width: 280px;
      max-width: 400px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.2));
    }
    h3 {
      margin: 0 0 8px;
      font-size: 16px;
      color: var(--primary-text-color);
    }
    .content {
      color: var(--secondary-text-color);
      font-size: 14px;
      margin-bottom: 20px;
    }
    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    button:focus-visible {
      outline: 2px solid var(--ik-focus-ring, var(--primary-color));
      outline-offset: 2px;
    }
    button {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    .cancel {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }
    .confirm {
      background: var(--error-color, #f44336);
      color: var(--text-primary-color);
    }
  `;
__decorate([
    n()
], IkConfirmDialog.prototype, "heading", void 0);
__decorate([
    n()
], IkConfirmDialog.prototype, "confirmText", void 0);
__decorate([
    n()
], IkConfirmDialog.prototype, "cancelText", void 0);
__decorate([
    n({ type: Boolean })
], IkConfirmDialog.prototype, "open", void 0);
IkConfirmDialog = __decorate([
    t$3("ik-confirm-dialog")
], IkConfirmDialog);

let IkSearchableSelect = class IkSearchableSelect extends i$3 {
    constructor() {
        super(...arguments);
        this.items = [];
        this.value = "";
        this.placeholder = "";
        this.disabled = false;
        this.noResultsText = "No results";
        this._search = "";
        this._open = false;
    }
    get _selectedLabel() {
        return this.items.find(i => i.value === this.value)?.label ?? "";
    }
    get _filtered() {
        const q = this._search.toLowerCase();
        return q ? this.items.filter(i => i.label.toLowerCase().includes(q)) : this.items;
    }
    _onFocus() {
        if (this.disabled)
            return;
        this._search = "";
        this._open = true;
    }
    _onInput(e) {
        this._search = e.target.value;
        this._open = true;
    }
    _select(item) {
        this._open = false;
        this._search = "";
        if (item.value === this.value)
            return;
        this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: item.value }, bubbles: true, composed: true }));
    }
    _clear(e) {
        e.stopPropagation();
        this._open = false;
        this._search = "";
        if (this.value === "")
            return;
        this.dispatchEvent(new CustomEvent("value-changed", { detail: { value: "" }, bubbles: true, composed: true }));
    }
    _onBlur() {
        // Delay to allow click on option
        setTimeout(() => { this._open = false; this._search = ""; }, 150);
    }
    render() {
        const displayValue = this._open ? this._search : this._selectedLabel;
        const filtered = this._filtered;
        return b `
      <div class="input-wrap">
        <input
          .value=${displayValue}
          placeholder=${this._open ? (this._selectedLabel || this.placeholder) : this.placeholder}
          ?disabled=${this.disabled}
          @focus=${this._onFocus}
          @input=${this._onInput}
          @blur=${this._onBlur}
        />
        ${this.value ? b `<button class="clear-btn" @mousedown=${this._clear}><ha-icon icon="mdi:close"></ha-icon></button>` : A}
      </div>
      ${this._open ? b `
        <div class="dropdown">
          ${filtered.length === 0
            ? b `<div class="option empty">${this.noResultsText}</div>`
            : filtered.map(item => b `
                <div
                  class="option ${item.value === this.value ? "selected" : ""}"
                  @mousedown=${() => this._select(item)}
                >${item.label}</div>
              `)}
        </div>
      ` : A}
    `;
    }
};
IkSearchableSelect.styles = i$6 `
    :host { display: block; position: relative; }
    .input-wrap {
      display: flex;
      align-items: center;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color);
      overflow: hidden;
    }
    input {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 14px;
      font-family: inherit;
      padding: 8px 10px;
      outline: none;
      min-width: 0;
    }
    input:disabled { opacity: 0.6; cursor: not-allowed; }
    .clear-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 0 6px;
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      --mdc-icon-size: 16px;
    }
    .clear-btn:hover { color: var(--primary-text-color); }
    .dropdown {
      position: absolute;
      top: calc(100% + 2px);
      left: 0;
      right: 0;
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
      z-index: 100;
      max-height: 220px;
      overflow-y: auto;
    }
    .option {
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
      color: var(--primary-text-color);
    }
    .option:hover, .option.focused { background: var(--secondary-background-color); }
    .option.selected { color: var(--primary-color); font-weight: 500; }
    .option.empty { color: var(--secondary-text-color); font-style: italic; cursor: default; }
  `;
__decorate([
    n({ type: Array })
], IkSearchableSelect.prototype, "items", void 0);
__decorate([
    n()
], IkSearchableSelect.prototype, "value", void 0);
__decorate([
    n()
], IkSearchableSelect.prototype, "placeholder", void 0);
__decorate([
    n({ type: Boolean })
], IkSearchableSelect.prototype, "disabled", void 0);
__decorate([
    n()
], IkSearchableSelect.prototype, "noResultsText", void 0);
__decorate([
    r()
], IkSearchableSelect.prototype, "_search", void 0);
__decorate([
    r()
], IkSearchableSelect.prototype, "_open", void 0);
IkSearchableSelect = __decorate([
    t$3("ik-searchable-select")
], IkSearchableSelect);

let IkLinkFilter = class IkLinkFilter extends i$3 {
    constructor() {
        super(...arguments);
        this.areas = [];
        this.devices = [];
        this.selectedAreaIds = [];
        this.selectedDeviceIds = [];
        this.filterMode = "or";
        this.open = false;
        this._areaPickerValue = "";
        this._devicePickerValue = "";
    }
    _emit(selectedAreaIds, selectedDeviceIds, filterMode) {
        this.dispatchEvent(new CustomEvent("filter-changed", {
            detail: { selectedAreaIds, selectedDeviceIds, filterMode },
            bubbles: true,
            composed: true,
        }));
    }
    _applyPickerFilters() {
        let areas = [...this.selectedAreaIds];
        let devices = [...this.selectedDeviceIds];
        if (this._areaPickerValue && !areas.includes(this._areaPickerValue)) {
            areas = [...areas, this._areaPickerValue];
        }
        if (this._devicePickerValue && !devices.includes(this._devicePickerValue)) {
            devices = [...devices, this._devicePickerValue];
        }
        this._areaPickerValue = "";
        this._devicePickerValue = "";
        this._emit(areas, devices, this.filterMode);
    }
    _removeAreaFilter(areaId) {
        this._emit(this.selectedAreaIds.filter((v) => v !== areaId), this.selectedDeviceIds, this.filterMode);
    }
    _removeDeviceFilter(deviceId) {
        this._emit(this.selectedAreaIds, this.selectedDeviceIds.filter((v) => v !== deviceId), this.filterMode);
    }
    _clearFilters() {
        this._areaPickerValue = "";
        this._devicePickerValue = "";
        this._emit([], [], this.filterMode);
    }
    _setFilterMode(mode) {
        this._emit(this.selectedAreaIds, this.selectedDeviceIds, mode);
    }
    _getAreaName(areaId) {
        return this.areas.find((a) => a.area_id === areaId)?.name ?? areaId;
    }
    _getDeviceLabel(device) {
        return device.name_by_user || device.name;
    }
    _getDeviceName(deviceId) {
        const device = this.devices.find((d) => d.id === deviceId);
        return device ? this._getDeviceLabel(device) : deviceId;
    }
    render() {
        const tr = t(this.hass?.language);
        const hasFilters = this.selectedAreaIds.length > 0 || this.selectedDeviceIds.length > 0;
        const canCombineFilters = this.selectedAreaIds.length > 0 && this.selectedDeviceIds.length > 0;
        const canAddFilter = Boolean(this._areaPickerValue || this._devicePickerValue);
        const areaItems = this.areas
            .filter((a) => !this.selectedAreaIds.includes(a.area_id))
            .map((a) => ({ value: a.area_id, label: a.name }));
        const deviceItems = this.devices
            .filter((d) => !this.selectedDeviceIds.includes(d.id))
            .filter((d) => !this._areaPickerValue || d.area_id === this._areaPickerValue)
            .map((d) => ({ value: d.id, label: this._getDeviceLabel(d) }));
        return b `
      ${this.open ? b `
        <div class="filter-bar">
          <div class="filter-group">
            <div class="picker-pair">
              <span class="filter-label">${tr.filterAreasLabel}</span>
              <ik-searchable-select
                class="filter-select"
                .items=${areaItems}
                .value=${this._areaPickerValue}
                .placeholder=${tr.filterAreasPlaceholder}
                .noResultsText=${tr.noResults}
                ?disabled=${areaItems.length === 0}
                @value-changed=${(e) => { this._areaPickerValue = e.detail.value; this._devicePickerValue = ""; }}
              ></ik-searchable-select>
            </div>
            <div class="picker-pair">
              <span class="filter-label">${tr.filterDevicesLabel}</span>
              <ik-searchable-select
                class="filter-select"
                .items=${deviceItems}
                .value=${this._devicePickerValue}
                .placeholder=${tr.filterDevicesPlaceholder}
                .noResultsText=${tr.noResults}
                ?disabled=${deviceItems.length === 0}
                @value-changed=${(e) => { this._devicePickerValue = e.detail.value; }}
              ></ik-searchable-select>
            </div>
            <button
              class="add-filter-btn"
              ?disabled=${!canAddFilter}
              @click=${() => this._applyPickerFilters()}
            ><ha-icon icon="mdi:plus"></ha-icon>${tr.addFilter}</button>
          </div>
        </div>
        <div class="filter-bar">
          <div class="filter-group">
            <span class="filter-label">${tr.filterModeLabel}</span>
            <div class="filter-mode-group">
              <button
                class="filter-mode-chip ${this.filterMode === "or" ? "active" : ""}"
                ?disabled=${!canCombineFilters}
                @click=${() => this._setFilterMode("or")}
              >${tr.filterModeAny}</button>
              <button
                class="filter-mode-chip ${this.filterMode === "and" ? "active" : ""}"
                ?disabled=${!canCombineFilters}
                @click=${() => this._setFilterMode("and")}
              >${tr.filterModeAll}</button>
            </div>
          </div>
        </div>
      ` : A}
      ${hasFilters ? b `
        <div class="active-filter-tags">
          ${this.selectedAreaIds.map((areaId) => b `
            <span class="active-filter-tag">
              ${tr.filterAreaTag(this._getAreaName(areaId))}
              <button @click=${() => this._removeAreaFilter(areaId)} aria-label=${tr.removeFilter}><ha-icon icon="mdi:close"></ha-icon></button>
            </span>
          `)}
          ${this.selectedDeviceIds.map((deviceId) => b `
            <span class="active-filter-tag">
              ${tr.filterDeviceTag(this._getDeviceName(deviceId))}
              <button @click=${() => this._removeDeviceFilter(deviceId)} aria-label=${tr.removeFilter}><ha-icon icon="mdi:close"></ha-icon></button>
            </span>
          `)}
          <button class="clear-filters-btn" @click=${() => this._clearFilters()}><ha-icon icon="mdi:filter-off"></ha-icon>${tr.clearFilters}</button>
        </div>
      ` : A}
    `;
    }
};
IkLinkFilter.styles = i$6 `
    :host { display: block; }
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 0 8px;
      flex-wrap: wrap;
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      width: 100%;
    }
    .picker-pair {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1 1 220px;
      min-width: 0;
    }
    .filter-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .filter-select {
      flex: 1;
      min-width: 0;
    }
    .add-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 14px;
      border-radius: 6px;
      border: 1px solid var(--primary-color);
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      flex-shrink: 0;
      margin-left: auto;
      --mdc-icon-size: 16px;
    }
    .add-filter-btn:disabled { opacity: 0.4; cursor: default; }
    @media (hover: none) and (pointer: coarse) {
      .picker-pair { flex: 1 1 100%; }
    }
    .filter-mode-group {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .filter-mode-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 82px;
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
    }
    .filter-mode-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .filter-mode-chip:disabled { opacity: 0.45; cursor: default; }
    .active-filter-tags {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      padding-bottom: 8px;
    }
    .active-filter-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      color: var(--primary-text-color);
      font-size: 12px;
      border: 1px solid color-mix(in srgb, var(--primary-color) 30%, var(--divider-color));
    }
    .active-filter-tag button {
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      padding: 0;
      display: inline-flex;
      align-items: center;
      --mdc-icon-size: 14px;
    }
    .clear-filters-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      border-radius: 999px;
      border: 1px dashed var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      --mdc-icon-size: 14px;
    }
    .clear-filters-btn:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  `;
__decorate([
    n({ attribute: false })
], IkLinkFilter.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], IkLinkFilter.prototype, "areas", void 0);
__decorate([
    n({ attribute: false })
], IkLinkFilter.prototype, "devices", void 0);
__decorate([
    n({ attribute: false })
], IkLinkFilter.prototype, "selectedAreaIds", void 0);
__decorate([
    n({ attribute: false })
], IkLinkFilter.prototype, "selectedDeviceIds", void 0);
__decorate([
    n()
], IkLinkFilter.prototype, "filterMode", void 0);
__decorate([
    n({ type: Boolean })
], IkLinkFilter.prototype, "open", void 0);
__decorate([
    r()
], IkLinkFilter.prototype, "_areaPickerValue", void 0);
__decorate([
    r()
], IkLinkFilter.prototype, "_devicePickerValue", void 0);
IkLinkFilter = __decorate([
    t$3("ik-link-filter")
], IkLinkFilter);

const MODE_STORAGE_KEY$1 = "intellikeep.listMode";
const GROUP_BY_STORAGE_KEY = "intellikeep.groupBy";
const FILTER_MODE_STORAGE_KEY$1 = "intellikeep.filterMode";
const FILTER_AREAS_STORAGE_KEY$1 = "intellikeep.filterAreas";
const FILTER_DEVICES_STORAGE_KEY$1 = "intellikeep.filterDevices";
/** Completed lists the completion records of the last 30 days, the History tab's default range. */
const COMPLETED_WINDOW_DAYS = 30;
const PRIORITIES$2 = ["critical", "high", "medium", "low"];
const GROUP_BYS = ["due", "priority", "area", "none"];
const loadStoredList$2 = (key) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
    }
    catch {
        return [];
    }
};
const loadStoredChoice = (key, choices, fallback) => {
    try {
        const value = localStorage.getItem(key);
        return value && choices.includes(value) ? value : fallback;
    }
    catch {
        return fallback;
    }
};
/**
 * The Tasks tab: toolbar, then the open tasks or recent completions in groups.
 * The search text belongs to the panel (narrow layouts search from the app
 * bar), so typing here fires `search-changed` instead of keeping it.
 */
let IkTaskListView = class IkTaskListView extends i$3 {
    constructor() {
        super(...arguments);
        this.tasks = [];
        this.enableAnimations = true;
        /** Phone layout: compact toolbar and rows, Group by inside Filters, a floating Add task button. */
        this.narrow = false;
        this.searchQuery = "";
        this._mode = loadStoredChoice(MODE_STORAGE_KEY$1, ["open", "completed"], "open");
        this._groupBy = loadStoredChoice(GROUP_BY_STORAGE_KEY, GROUP_BYS, "due");
        this._filterPriority = "all";
        this._filterMode = localStorage.getItem(FILTER_MODE_STORAGE_KEY$1) ?? "or";
        this._selectedAreaIds = loadStoredList$2(FILTER_AREAS_STORAGE_KEY$1);
        this._selectedDeviceIds = loadStoredList$2(FILTER_DEVICES_STORAGE_KEY$1);
        this._areas = [];
        this._devices = [];
        this._showFilters = false;
        this._deleteTarget = null;
        /** Tasks with a complete, reopen or delete call in flight. */
        this._busy = new Set();
    }
    connectedCallback() {
        super.connectedCallback();
        void this._loadRegistries();
    }
    willUpdate(changed) {
        if (changed.has("enableAnimations"))
            this.toggleAttribute("no-animations", !this.enableAnimations);
    }
    async _loadRegistries() {
        try {
            const [areas, devices] = await Promise.all([
                this.hass.connection.sendMessagePromise({ type: "config/area_registry/list" }),
                this.hass.connection.sendMessagePromise({ type: "config/device_registry/list" }),
            ]);
            this._areas = areas.sort((left, right) => left.name.localeCompare(right.name));
            this._devices = devices.sort((left, right) => this._getDeviceLabel(left).localeCompare(this._getDeviceLabel(right)));
        }
        catch (error) {
            console.error("[IntelliKeep] Failed to load registries for task filters:", error);
        }
    }
    _onFilterChanged(e) {
        const { selectedAreaIds, selectedDeviceIds, filterMode } = e.detail;
        this._selectedAreaIds = selectedAreaIds;
        this._selectedDeviceIds = selectedDeviceIds;
        this._filterMode = filterMode;
        localStorage.setItem(FILTER_MODE_STORAGE_KEY$1, filterMode);
        localStorage.setItem(FILTER_AREAS_STORAGE_KEY$1, JSON.stringify(selectedAreaIds));
        localStorage.setItem(FILTER_DEVICES_STORAGE_KEY$1, JSON.stringify(selectedDeviceIds));
    }
    _getDeviceLabel(device) {
        return device.name_by_user || device.name;
    }
    _matchesLinkedFilters(task) {
        if (this._selectedAreaIds.length === 0 && this._selectedDeviceIds.length === 0) {
            return true;
        }
        const taskAreaIds = new Set(task.linked_entity_ids.filter((value) => value.startsWith("area:")).map((value) => value.slice(5)));
        const taskDeviceIds = new Set(task.linked_entity_ids.filter((value) => value.startsWith("device:")).map((value) => value.slice(7)));
        const matchesArea = this._selectedAreaIds.length === 0
            ? null
            : this._selectedAreaIds.some((areaId) => {
                if (taskAreaIds.has(areaId)) {
                    return true;
                }
                return [...taskDeviceIds].some((deviceId) => {
                    const device = this._devices.find((entry) => entry.id === deviceId);
                    return device?.area_id === areaId;
                });
            });
        const matchesDevice = this._selectedDeviceIds.length === 0
            ? null
            : this._selectedDeviceIds.some((deviceId) => taskDeviceIds.has(deviceId));
        if (matchesArea === null) {
            return Boolean(matchesDevice);
        }
        if (matchesDevice === null) {
            return matchesArea;
        }
        return this._filterMode === "and" ? matchesArea && matchesDevice : matchesArea || matchesDevice;
    }
    /** Area a task belongs to for grouping: a linked area, or the area of a linked device (first by name). */
    _areaOf(task) {
        const areaName = (areaId) => this._areas.find((a) => a.area_id === areaId)?.name;
        const names = task.linked_entity_ids
            .map((link) => link.startsWith("area:")
            ? areaName(link.slice(5))
            : link.startsWith("device:")
                ? areaName(this._devices.find((d) => d.id === link.slice(7))?.area_id)
                : undefined)
            .filter((name) => Boolean(name))
            .sort((a, b) => a.localeCompare(b));
        return names[0] ?? null;
    }
    get _relaxSuggestion() {
        const tr = t(this.hass?.language);
        const d = new Date();
        const idx = (d.getDate() + d.getMonth()) % tr.relaxSuggestions.length;
        return tr.relaxSuggestions[idx];
    }
    _setMode(mode) {
        this._mode = mode;
        localStorage.setItem(MODE_STORAGE_KEY$1, mode);
    }
    _setGroupBy(groupBy) {
        if (!GROUP_BYS.includes(groupBy))
            return;
        this._groupBy = groupBy;
        localStorage.setItem(GROUP_BY_STORAGE_KEY, groupBy);
    }
    _searchChanged(query) {
        this.dispatchEvent(new CustomEvent("search-changed", { detail: query, bubbles: true, composed: true }));
    }
    _setBusy(taskId, busy) {
        const next = new Set(this._busy);
        if (busy)
            next.add(taskId);
        else
            next.delete(taskId);
        this._busy = next;
    }
    _openTask(request) {
        this.dispatchEvent(new CustomEvent("open-task", { detail: request, bubbles: true, composed: true }));
    }
    /** A completion can be taken back only while it is the task's latest and the task is still done. */
    _canReopen(row) {
        const { task, completion } = row;
        return completion !== null && task.status === "completed"
            && task.executions[task.executions.length - 1]?.execution_id === completion.execution_id;
    }
    _toggle(row) {
        if (row.completion === null)
            void this._complete(row.task);
        else if (this._canReopen(row))
            void this._reopen(row.task);
    }
    async _complete(task) {
        const tr = t(this.hass.language);
        this._setBusy(task.task_id, true);
        try {
            await completeTask(this.hass, task.task_id, this.hass.user?.name ?? "");
            showToast(this, tr.taskCompleted, { text: tr.undoAction, action: () => void this._reopen(task) }, 8000);
        }
        catch (err) {
            console.error("[IntelliKeep] complete_task failed:", err);
            showToast(this, tr.actionFailed(errorText(err)));
        }
        finally {
            this._setBusy(task.task_id, false);
        }
    }
    async _reopen(task) {
        const tr = t(this.hass.language);
        this._setBusy(task.task_id, true);
        try {
            await reopenTask(this.hass, task.task_id, this.hass.user?.name ?? "");
        }
        catch (err) {
            console.error("[IntelliKeep] reopen_task failed:", err);
            showToast(this, tr.actionFailed(errorText(err)));
        }
        finally {
            this._setBusy(task.task_id, false);
        }
    }
    async _confirmDelete(confirmed) {
        const task = this._deleteTarget;
        this._deleteTarget = null;
        if (!confirmed || !task)
            return;
        this._setBusy(task.task_id, true);
        try {
            await deleteTask(this.hass, task.task_id);
        }
        catch (err) {
            console.error("[IntelliKeep] delete_task failed:", err);
            showToast(this, t(this.hass.language).actionFailed(errorText(err)));
        }
        finally {
            this._setBusy(task.task_id, false);
        }
    }
    _onMenuAction(task, action) {
        if (action === "edit")
            this._openTask({ taskId: task.task_id });
        else if (action === "duplicate")
            this._openTask({ taskId: null, template: task });
        else if (action === "history")
            this._openTask({ taskId: task.task_id, tab: "history" });
        else if (action === "delete")
            this._deleteTarget = task;
    }
    _groups(rows, tr) {
        const priorityRank = (row) => PRIORITIES$2.indexOf(row.task.priority);
        const dueTime = (row) => (row.task.due_date ? Date.parse(row.task.due_date) : Infinity);
        // Open: by due date, then most important first. Completed: most recent first.
        const compare = this._mode === "open"
            ? (a, b) => dueTime(a) - dueTime(b) || priorityRank(a) - priorityRank(b) || a.task.task_number - b.task.task_number
            : (a, b) => Date.parse(b.completion.completed_at) - Date.parse(a.completion.completed_at);
        let groups;
        let groupOf;
        if (this._groupBy === "priority") {
            groups = PRIORITIES$2.map((p) => ({ key: p, label: tr[p], rows: [] }));
            groupOf = (row) => row.task.priority;
        }
        else if (this._groupBy === "area") {
            const names = [...new Set(rows.map((row) => this._areaOf(row.task)).filter((n) => n !== null))];
            groups = [
                ...names.sort((a, b) => a.localeCompare(b)).map((name) => ({ key: `area:${name}`, label: name, rows: [] })),
                { key: "no-area", label: tr.groupNoArea, rows: [] },
            ];
            groupOf = (row) => {
                const name = this._areaOf(row.task);
                return name === null ? "no-area" : `area:${name}`;
            };
        }
        else if (this._groupBy === "due" && this._mode === "open") {
            const nextWeek = daysUntilNextWeek(this.hass);
            groups = [
                { key: "overdue", label: tr.groupOverdue, tone: "overdue", rows: [] },
                { key: "today", label: tr.groupToday, tone: "today", rows: [] },
                { key: "week", label: tr.groupThisWeek, rows: [] },
                { key: "later", label: tr.groupLater, rows: [] },
                { key: "none", label: tr.noDueDate, rows: [] },
            ];
            groupOf = ({ task }) => {
                if (!task.due_date)
                    return "none";
                const urgency = urgencyOf(task, this.hass);
                if (urgency)
                    return urgency;
                return daysUntil(new Date(task.due_date), this.hass) < nextWeek ? "week" : "later";
            };
        }
        else {
            // No grouping; completion records have no due-date groups either
            groups = [{ key: "all", label: null, rows: [] }];
            groupOf = () => "all";
        }
        const byKey = new Map(groups.map((group) => [group.key, group]));
        for (const row of rows)
            byKey.get(groupOf(row))?.rows.push(row);
        return groups.filter((group) => group.rows.length > 0).map((group) => ({ ...group, rows: group.rows.sort(compare) }));
    }
    _renderGroup(group) {
        return b `
      <section>
        ${group.label !== null ? b `
          <h2 class="group-header ${group.tone ?? ""}">${group.label}<span class="count">${group.rows.length}</span></h2>
        ` : A}
        <div class="group">
          ${c(group.rows, (row) => row.completion?.execution_id ?? row.task.task_id, (row) => b `
            <ik-task-card
              class=${this._busy.has(row.task.task_id) ? "leaving" : ""}
              .task=${row.task}
              .hass=${this.hass}
              .completion=${row.completion}
              .busy=${this._busy.has(row.task.task_id)}
              .canReopen=${this._canReopen(row)}
              .narrow=${this.narrow}
              .timeOnly=${group.key === "today"}
              @task-toggle=${() => this._toggle(row)}
              @task-open=${() => this._openTask({ taskId: row.task.task_id })}
              @menu-select=${(e) => this._onMenuAction(row.task, e.detail)}
            ></ik-task-card>
          `)}
        </div>
      </section>
    `;
    }
    render() {
        const tr = t(this.hass?.language);
        const q = this.searchQuery.trim().toLowerCase();
        const matches = (task) => (!q || task.name.toLowerCase().includes(q) || (task.description ?? "").toLowerCase().includes(q)
            || (task.task_number ? String(task.task_number).padStart(3, "0").includes(q) : false))
            && (this._filterPriority === "all" || task.priority === this._filterPriority)
            && this._matchesLinkedFilters(task);
        const since = Date.now() - COMPLETED_WINDOW_DAYS * 86400000;
        const recent = (ex) => Date.parse(ex.completed_at) >= since;
        const openTasks = this.tasks.filter((task) => task.status !== "completed");
        const completedCount = this.tasks.reduce((n, task) => n + (task.executions ?? []).filter(recent).length, 0);
        const rows = this._mode === "open"
            ? openTasks.filter(matches).map((task) => ({ task, completion: null }))
            : this.tasks.filter(matches).flatMap((task) => (task.executions ?? []).filter(recent).map((completion) => ({ task, completion })));
        const activeFilterCount = this._selectedAreaIds.length + this._selectedDeviceIds.length + (this._filterPriority !== "all" ? 1 : 0);
        const groupByLabel = {
            due: tr.groupByDue,
            priority: tr.priority,
            area: tr.groupByArea,
            none: tr.groupByNone,
        };
        const groupByItems = GROUP_BYS.map((g) => ({ action: g, label: groupByLabel[g], selected: g === this._groupBy }));
        const segment = (mode, label, count) => b `
      <button class="segment" aria-pressed=${this._mode === mode ? "true" : "false"} @click=${() => this._setMode(mode)}>
        ${label}<span class="count">${count}</span>
      </button>
    `;
        let content;
        if (this._mode === "open" && openTasks.length === 0) {
            content = b `
        <div class="all-clear">
          <div class="all-clear-emoji">🎉</div>
          <p class="all-clear-title">${tr.allClear}</p>
          <p class="all-clear-sub">${tr.allClearSub}</p>
          <span class="all-clear-suggestion">${this._relaxSuggestion}</span>
        </div>`;
        }
        else if (this._mode === "completed" && completedCount === 0) {
            content = b `<div class="empty">${tr.noCompletedRecently}</div>`;
        }
        else if (rows.length === 0) {
            content = b `<div class="empty">${tr.noTasks}</div>`;
        }
        else {
            content = this._groups(rows, tr).map((group) => this._renderGroup(group));
        }
        return b `
      <div class="toolbar">
        <div class="segmented" role="group" aria-label=${tr.listModeLabel}>
          ${segment("open", tr.listOpen, openTasks.length)}
          ${segment("completed", tr.listCompleted, completedCount)}
        </div>
        ${this.narrow ? b `
          <button
            class="icon-pill"
            aria-label=${tr.filters}
            title=${tr.filters}
            aria-expanded=${this._showFilters ? "true" : "false"}
            @click=${() => { this._showFilters = !this._showFilters; }}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>
            ${activeFilterCount ? b `<span class="count">${activeFilterCount}</span>` : A}
          </button>
        ` : b `
          <label class="search">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              type="search"
              .value=${this.searchQuery}
              placeholder=${tr.searchPlaceholder}
              aria-label=${tr.searchPlaceholder}
              @input=${(e) => this._searchChanged(e.target.value)}
            />
          </label>
          <button
            class="pill"
            aria-expanded=${this._showFilters ? "true" : "false"}
            @click=${() => { this._showFilters = !this._showFilters; }}
          >
            <ha-icon icon="mdi:filter-variant"></ha-icon>${tr.filters}
            ${activeFilterCount ? b `<span class="count">${activeFilterCount}</span>` : A}
          </button>
          <ik-menu
            pill
            .label=${`${tr.groupBy}: ${groupByLabel[this._groupBy]}`}
            .items=${groupByItems}
            @menu-select=${(e) => this._setGroupBy(e.detail)}
          ></ik-menu>
          <button class="add" @click=${() => this._openTask({ taskId: null })}>
            <ha-icon icon="mdi:plus"></ha-icon>${tr.addTask}
          </button>
        `}
      </div>
      <div class="filters">
        ${this._showFilters && this.narrow ? b `
          <label class="priority-filter">
            ${tr.groupBy}
            <select .value=${this._groupBy} @change=${(e) => this._setGroupBy(e.target.value)}>
              ${GROUP_BYS.map((g) => b `<option value=${g} ?selected=${g === this._groupBy}>${groupByLabel[g]}</option>`)}
            </select>
          </label>
        ` : A}
        ${this._showFilters ? b `
          <label class="priority-filter">
            ${tr.priority}
            <select .value=${this._filterPriority} @change=${(e) => { this._filterPriority = e.target.value; }}>
              <option value="all">${tr.allPriorities}</option>
              ${PRIORITIES$2.map((p) => b `<option value=${p}>${tr[p]}</option>`)}
            </select>
          </label>
        ` : A}
        <ik-link-filter
          .hass=${this.hass}
          .areas=${this._areas}
          .devices=${this._devices}
          .selectedAreaIds=${this._selectedAreaIds}
          .selectedDeviceIds=${this._selectedDeviceIds}
          .filterMode=${this._filterMode}
          ?open=${this._showFilters}
          @filter-changed=${(e) => this._onFilterChanged(e)}
        ></ik-link-filter>
      </div>
      <div class="list-scroll">
        <div class="groups">${content}</div>
      </div>
      ${this.narrow ? b `
        <button class="fab" @click=${() => this._openTask({ taskId: null })}>
          <ha-icon icon="mdi:plus"></ha-icon>${tr.addTask}
        </button>
      ` : A}
      <ik-confirm-dialog
        heading=${tr.deleteHeading}
        confirmText=${tr.deleteAction}
        cancelText=${tr.cancel}
        .open=${this._deleteTarget !== null}
        @dialog-closed=${(e) => this._confirmDelete(e.detail.confirmed)}
      >
        ${tr.deleteBody}
      </ik-confirm-dialog>
    `;
    }
};
IkTaskListView.styles = i$6 `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--ik-padding, 20px) var(--ik-padding, 20px) 0;
      box-sizing: border-box;
    }
    :host([no-animations]) *, :host([no-animations]) *::before, :host([no-animations]) *::after {
      transition: none !important;
      animation: none !important;
    }
    button { font: inherit; }
    button:focus-visible, input:focus-visible, select:focus-visible {
      outline: 2px solid var(--ik-focus-ring);
      outline-offset: 2px;
    }
    .toolbar, .filters, .groups {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
    }
    .count {
      display: inline-block;
      min-width: 8px;
      padding: 1px 7px;
      border-radius: 9px;
      background: color-mix(in srgb, currentColor 14%, transparent);
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    .segmented {
      display: inline-flex;
      gap: 2px;
      padding: 2px;
      border-radius: 21px;
      border: 1px solid var(--divider-color);
      background: var(--ik-surface);
    }
    .segment {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 38px;
      padding: 0 14px;
      border: none;
      border-radius: 19px;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .segment:hover { color: var(--primary-text-color); }
    .segment[aria-pressed="true"] { background: var(--ik-primary-fill); color: var(--primary-color); }
    .search {
      flex: 1 1 280px;
      display: flex;
      align-items: center;
      gap: 10px;
      height: 42px;
      padding: 0 16px;
      box-sizing: border-box;
      border-radius: 21px;
      border: 1px solid var(--divider-color);
      background: var(--ik-surface);
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .search:focus-within { border-color: var(--primary-color); }
    .search input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
    }
    .search input::placeholder { color: var(--secondary-text-color); }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 16px;
      border-radius: var(--ik-radius-pill);
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .pill:hover { background: var(--ik-subtle-fill); }
    .pill[aria-expanded="true"] { border-color: var(--primary-color); color: var(--primary-color); }
    .pill .count { background: var(--primary-color); color: var(--text-primary-color); }
    .add {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 20px 0 16px;
      border: none;
      border-radius: var(--ik-radius-pill);
      background: var(--primary-color);
      color: var(--text-primary-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .add:hover { filter: brightness(1.08); }
    .filters { padding-bottom: 8px; }
    .icon-pill {
      position: relative;
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-inline-start: auto;
      padding: 0;
      border-radius: 50%;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      --mdc-icon-size: 20px;
    }
    .icon-pill:hover { background: var(--ik-subtle-fill); }
    .icon-pill[aria-expanded="true"] { border-color: var(--primary-color); color: var(--primary-color); }
    .icon-pill .count {
      position: absolute;
      top: -4px;
      inset-inline-end: -4px;
      background: var(--primary-color);
      color: var(--text-primary-color);
    }
    .fab {
      position: fixed;
      right: calc(16px + env(safe-area-inset-right));
      bottom: calc(16px + env(safe-area-inset-bottom));
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      height: 52px;
      padding: 0 22px 0 18px;
      border: none;
      border-radius: 26px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.32);
      --mdc-icon-size: 22px;
    }
    .fab:hover { filter: brightness(1.08); }
    .priority-filter {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .priority-filter select {
      padding: 5px 10px;
      border-radius: var(--ik-radius-field);
      border: 1px solid var(--divider-color);
      background: var(--ik-field-fill);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
    }
    .list-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding-bottom: 32px;
    }
    /* Room for the floating Add task button under the last row */
    :host([narrow]) .list-scroll { padding-bottom: 88px; }
    :host([narrow]) .groups { gap: 18px; }
    :host([narrow]) .group { padding: 0 4px; }
    .groups {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .group-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 0;
      padding: 0 4px 10px;
      font-size: var(--ik-group-header-size);
      font-weight: var(--ik-group-header-weight);
      letter-spacing: var(--ik-group-header-spacing);
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .group-header .count { color: var(--secondary-text-color); }
    .group-header.overdue { color: var(--ik-error-text); }
    .group-header.today { color: var(--ik-warning-text); }
    .group {
      padding: 4px 8px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--ik-surface);
    }
    .group ik-task-card + ik-task-card { border-top: 1px solid var(--divider-color); }
    ik-task-card { transition: opacity 0.2s ease; }
    ik-task-card.leaving { opacity: 0.5; }
    .empty {
      padding: 40px 24px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .all-clear {
      text-align: center;
      padding: 48px 24px 40px;
    }
    .all-clear-emoji {
      font-size: 64px;
      line-height: 1;
      margin-bottom: 16px;
    }
    .all-clear-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 0 0 8px;
    }
    .all-clear-sub {
      font-size: 14px;
      color: var(--secondary-text-color);
      margin: 0 0 20px;
    }
    .all-clear-suggestion {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 12px;
      background: var(--ik-primary-fill);
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
    }
  `;
__decorate([
    n({ attribute: false })
], IkTaskListView.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], IkTaskListView.prototype, "tasks", void 0);
__decorate([
    n({ type: Boolean })
], IkTaskListView.prototype, "enableAnimations", void 0);
__decorate([
    n({ type: Boolean, reflect: true })
], IkTaskListView.prototype, "narrow", void 0);
__decorate([
    n()
], IkTaskListView.prototype, "searchQuery", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_mode", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_groupBy", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_filterPriority", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_filterMode", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_selectedAreaIds", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_selectedDeviceIds", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_areas", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_devices", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_showFilters", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_deleteTarget", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_busy", void 0);
IkTaskListView = __decorate([
    t$3("ik-task-list-view")
], IkTaskListView);

var IkTaskFormView_1;
const PRIORITIES$1 = ["low", "medium", "high", "critical"];
const REPEAT_UNITS = ["daily", "weekly", "monthly", "yearly"];
/**
 * Icon of tasks without one. HA's picker shows a placeholder as a bare icon with
 * no name, so it gets this as its value instead, and `required` hides its clear
 * button, which would leave that bare icon behind.
 */
const DEFAULT_ICON = "mdi:wrench-outline";
/** Household icons suggested by the plain icon field (used until HA's icon picker is loaded); any MDI name works. */
const ICON_SUGGESTIONS = [
    "mdi:wrench-outline", "mdi:air-filter", "mdi:air-conditioner", "mdi:smoke-detector", "mdi:fire-extinguisher",
    "mdi:water-boiler", "mdi:water-pump", "mdi:water-filter", "mdi:fridge-outline", "mdi:washing-machine",
    "mdi:dishwasher", "mdi:stove", "mdi:garage", "mdi:home-roof", "mdi:weather-pouring", "mdi:lightbulb-outline",
    "mdi:battery-outline", "mdi:car", "mdi:mower", "mdi:flower-outline", "mdi:pool", "mdi:broom",
    "mdi:trash-can-outline", "mdi:paw", "mdi:pill", "mdi:shield-check-outline",
];
/**
 * The task dialog: details form, notes and history of one task, or the form
 * for a new one. It brings its own header, tabs and footer, so the panel only
 * provides the surface (a dialog on desktop, the whole page on phones).
 * Closing fires `navigate` with `returnPath`.
 */
let IkTaskFormView = IkTaskFormView_1 = class IkTaskFormView extends i$3 {
    constructor() {
        super(...arguments);
        this.task = null;
        this.tasks = [];
        this.enableAnimations = true;
        this.returnPath = "/tasks";
        /** New tasks only: a task whose fields the form starts from (Duplicate). */
        this.template = null;
        /** New tasks without a template: the due day (YYYY-MM-DD), picked on the calendar. */
        this.dueDate = "";
        /** Existing tasks only: the tab shown when the form opens. */
        this.initialTab = "edit";
        this._name = "";
        this._description = "";
        this._icon = "";
        this._priority = "medium";
        this._frequency = "one_time";
        this._repeatInterval = 1;
        this._scheduleAnchor = "completion";
        this._weekdays = [];
        this._dueDateSnapped = false;
        this._dueDate = "";
        this._dueTime = "";
        this._linkedEntities = [];
        this._notifyDaysBefore = 1;
        this._notifyOnOverdue = true;
        this._saving = false;
        this._completing = false;
        this._showDeleteConfirm = false;
        this._error = "";
        this._activeTab = "edit";
        this._linkPickerOpen = false;
        this._pickArea = "";
        this._pickDevice = "";
        this._newNoteContent = "";
        this._addingNote = false;
        this._showDeleteNoteConfirm = false;
        this._deleteNoteTarget = null;
        this._notesPage = 0;
        this._prevOccPage = 0;
        this._activityPage = 0;
        this._areas = [];
        this._deviceRegistry = [];
        /** HA loads ha-icon-picker lazily (it comes with the more-info dialog); until then the form shows a plain text field. */
        this._haIconPicker = !!customElements.get("ha-icon-picker");
    }
    connectedCallback() {
        super.connectedCallback();
        const source = this.task ?? this.template;
        if (this.task)
            this._activeTab = this.initialTab;
        if (source) {
            this._name = source.name;
            this._description = source.description;
            this._icon = source.icon ?? "";
            this._priority = source.priority;
            this._frequency = source.frequency;
            this._repeatInterval = Math.max(1, source.repeat_interval || 1);
            this._scheduleAnchor = source.schedule_anchor ?? "completion";
            this._weekdays = [...(source.weekdays ?? [])];
            // due_date comes in UTC; the inputs (and the save below) work in local time
            const due = source.due_date ? new Date(source.due_date) : null;
            this._dueDate = due ? localDate(due) : "";
            // A due date without a time is saved at midnight: it opens as all day again, with no time
            this._dueTime = due && localTime(due) !== "00:00" ? localTime(due) : "";
            this._linkedEntities = [...source.linked_entity_ids];
            this._notifyDaysBefore = source.notify_days_before;
            this._notifyOnOverdue = source.notify_on_overdue;
        }
        else if (this.dueDate) {
            // Added from a calendar day: due that day, all day
            this._dueDate = this.dueDate;
            this._dueTime = "";
        }
        else {
            // Pre-fill due date with current local date/time for new tasks
            const now = new Date();
            this._dueDate = localDate(now);
            this._dueTime = localTime(now);
        }
        this._loadRegistries();
        if (!this._haIconPicker) {
            customElements.whenDefined("ha-icon-picker").then(() => { this._haIconPicker = true; });
        }
    }
    willUpdate(changed) {
        if (changed.has("enableAnimations"))
            this.toggleAttribute("no-animations", !this.enableAnimations);
    }
    updated() {
        // The description grows with its text instead of scrolling inside a small box
        const textarea = this.renderRoot.querySelector("#description");
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight + 2}px`;
        }
    }
    async _loadRegistries() {
        const [areas, devices] = await Promise.all([
            this.hass.connection.sendMessagePromise({ type: "config/area_registry/list" }),
            this.hass.connection.sendMessagePromise({ type: "config/device_registry/list" }),
        ]);
        this._areas = areas.sort((a, b) => a.name.localeCompare(b.name));
        this._deviceRegistry = devices.sort((a, b) => (a.name_by_user || a.name).localeCompare(b.name_by_user || b.name));
    }
    _navigate(path) {
        this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
    }
    _close() {
        this._navigate(this.returnPath);
    }
    _formatDate(iso) {
        return formatDateTime(iso, this.hass);
    }
    _areaName(areaId) {
        return this._areas.find((a) => a.area_id === areaId)?.name;
    }
    _deviceLabel(device) {
        return device.name_by_user || device.name;
    }
    _resolveActivityDetails(details) {
        return details.replace(/\b(area|device):([a-zA-Z0-9_-]+)/g, (_match, type, id) => {
            if (type === "area")
                return this._areaName(id) ?? id;
            const device = this._deviceRegistry.find((d) => d.id === id);
            return device ? this._deviceLabel(device) : id;
        });
    }
    /** Chip text and icon of one linked item (area:…, device:… or an entity id). */
    _linkInfo(link) {
        if (link.startsWith("area:")) {
            return { label: this._areaName(link.slice(5)) ?? link.slice(5), icon: "mdi:texture-box" };
        }
        if (link.startsWith("device:")) {
            const device = this._deviceRegistry.find((d) => d.id === link.slice(7));
            if (!device)
                return { label: link.slice(7), icon: "mdi:devices" };
            const area = this._areaName(device.area_id);
            return { label: area ? `${area} · ${this._deviceLabel(device)}` : this._deviceLabel(device), icon: "mdi:devices" };
        }
        const name = this.hass?.states?.[link]?.attributes?.friendly_name;
        return { label: typeof name === "string" ? name : link, icon: "mdi:shape-outline" };
    }
    _addLink() {
        const link = this._pickDevice ? `device:${this._pickDevice}` : this._pickArea ? `area:${this._pickArea}` : "";
        if (link && !this._linkedEntities.includes(link))
            this._linkedEntities = [...this._linkedEntities, link];
        this._closeLinkPicker();
    }
    _closeLinkPicker() {
        this._linkPickerOpen = false;
        this._pickArea = "";
        this._pickDevice = "";
    }
    async _complete() {
        if (!this.task)
            return;
        const tr = t(this.hass.language);
        const task = this.task;
        const user = this.hass.user?.name ?? "";
        this._completing = true;
        try {
            if (task.status !== "completed") {
                await completeTask(this.hass, task.task_id, user);
                showToast(this, tr.taskCompleted, {
                    text: tr.undoAction,
                    action: () => void reopenTask(this.hass, task.task_id, user).catch((err) => showToast(this, tr.actionFailed(errorText(err)))),
                }, 8000);
            }
            else {
                await reopenTask(this.hass, task.task_id, user);
            }
            this._close();
        }
        catch (err) {
            this._error = tr.actionFailed(errorText(err));
        }
        finally {
            this._completing = false;
        }
    }
    async _handleDelete(confirmed) {
        this._showDeleteConfirm = false;
        if (!confirmed || !this.task)
            return;
        try {
            await deleteTask(this.hass, this.task.task_id);
            this._close();
        }
        catch (err) {
            this._error = t(this.hass.language).actionFailed(errorText(err));
        }
    }
    _onMenuAction(action) {
        if (!this.task)
            return;
        if (action === "duplicate") {
            this.dispatchEvent(new CustomEvent("open-task", {
                detail: { taskId: null, template: this.task },
                bubbles: true,
                composed: true,
            }));
        }
        else if (action === "delete") {
            this._showDeleteConfirm = true;
        }
    }
    _toggleWeekday(code) {
        const next = this._weekdays.includes(code)
            ? this._weekdays.filter(c => c !== code)
            : [...this._weekdays, code];
        this._weekdays = WEEKDAYS.filter(c => next.includes(c));
        this._snapDueDateToWeekdays();
    }
    /**
     * Weekly tasks pinned to weekdays must start on one of those days. If the
     * chosen due date does not match, move it forward to the next selected day
     * and flag it so the form can explain the change.
     */
    _snapDueDateToWeekdays() {
        this._dueDateSnapped = false;
        if (this._frequency !== "weekly" || this._weekdays.length === 0 || !this._dueDate)
            return;
        const [y, m, d] = this._dueDate.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        const codeOf = (dt) => WEEKDAYS[(dt.getDay() + 6) % 7];
        if (this._weekdays.includes(codeOf(date)))
            return;
        for (let i = 1; i <= 7; i++) {
            const candidate = new Date(y, m - 1, d + i);
            if (this._weekdays.includes(codeOf(candidate))) {
                this._dueDate = localDate(candidate);
                this._dueDateSnapped = true;
                return;
            }
        }
    }
    /** The chosen due day in the profile language; it is a local calendar day, so no time zone applies. */
    _formatDueDay(options = { weekday: "short" }) {
        const [y, m, d] = this._dueDate.split("-").map(Number);
        return formatDate(new Date(y, m - 1, d), this.hass, { ...options, timeZone: undefined });
    }
    _openDatePicker() {
        const input = this.renderRoot.querySelector(".date-native");
        try {
            input?.showPicker();
        }
        catch {
            input?.focus();
        }
    }
    async _save() {
        const tr = t(this.hass?.language);
        if (!this._name.trim()) {
            this._error = tr.taskNameRequired;
            return;
        }
        this._saving = true;
        this._error = "";
        try {
            const recurring = this._frequency !== "one_time";
            const data = {
                name: this._name.trim(),
                description: this._description.trim(),
                icon: this._icon.trim() || null,
                priority: this._priority,
                frequency: this._frequency,
                repeat_interval: recurring ? Math.max(1, this._repeatInterval || 1) : 1,
                schedule_anchor: this._scheduleAnchor,
                weekdays: this._frequency === "weekly" ? this._weekdays : [],
                due_date: this._dueDate ? new Date(`${this._dueDate}T${this._dueTime || "00:00"}`).toISOString() : null,
                linked_entity_ids: this._linkedEntities.filter(Boolean),
                notify_days_before: this._notifyDaysBefore,
                notify_on_overdue: this._notifyOnOverdue,
            };
            if (this.task) {
                await updateTask(this.hass, this.task.task_id, data, this.hass.user?.name ?? "");
            }
            else {
                await createTask(this.hass, data);
            }
            this._close();
        }
        catch (err) {
            this._error = tr.actionFailed(errorText(err));
        }
        finally {
            this._saving = false;
        }
    }
    _renderHeader(isEdit) {
        const tr = t(this.hass?.language);
        const task = this.task;
        const repeat = task ? repeatLabel(task, this.hass) : null;
        const number = task?.task_number ? `#${String(task.task_number).padStart(3, "0")}` : "";
        const menuItems = [
            { action: "duplicate", label: tr.duplicate, icon: "mdi:content-copy" },
            { divider: true },
            { action: "delete", label: tr.deleteAction, icon: "mdi:delete-outline", danger: true },
        ];
        return b `
      <div class="header">
        <button class="icon-btn" aria-label=${tr.close} title=${tr.close} @click=${this._close}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
        <div class="titles">
          <h2 class="title">${task ? task.name : tr.newTaskTitle}</h2>
          ${number || repeat ? b `<div class="subtitle">${[number, repeat].filter(Boolean).join(" · ")}</div>` : A}
        </div>
        ${isEdit ? b `
          <ik-menu .items=${menuItems} .label=${tr.moreActions(task.name)} @menu-select=${(e) => this._onMenuAction(e.detail)}></ik-menu>
        ` : A}
      </div>
      ${isEdit ? b `
        <div class="tabs" role="tablist">
          ${[["edit", tr.detailsTab], ["notes", tr.notesTab], ["history", tr.historyNavTab]].map(([tab, label]) => b `
            <button
              class="tab"
              role="tab"
              aria-selected=${this._activeTab === tab ? "true" : "false"}
              @click=${() => { this._activeTab = tab; }}
            >${label}</button>
          `)}
        </div>
      ` : A}
    `;
    }
    _renderDetails(readonly) {
        const tr = t(this.hass?.language);
        const recurring = this._frequency !== "one_time";
        const unitValue = recurring ? this._frequency : "one_time";
        const devicesForPick = this._deviceRegistry.filter((d) => !this._pickArea || d.area_id === this._pickArea);
        return b `
      ${readonly ? b `
        <div class="readonly-banner"><ha-icon icon="mdi:lock-outline"></ha-icon>${tr.taskCompletedReadonly}</div>
      ` : A}

      <div class="name-row">
        <div>
          <label class="label" for="name">${tr.nameLabel}</label>
          <input
            id="name"
            class="field"
            required
            .value=${this._name}
            ?disabled=${readonly}
            placeholder=${tr.taskNamePlaceholder}
            @input=${(e) => { this._name = e.target.value; }}
          />
        </div>
        ${this._haIconPicker ? b `
          <div class="icon-field">
            <span class="label" id="icon-label">${tr.iconLabel}</span>
            <div class="icon-box" role="group" aria-labelledby="icon-label">
              <ha-icon-picker
                .hass=${this.hass}
                .value=${this._icon || DEFAULT_ICON}
                .required=${true}
                .disabled=${readonly}
                @value-changed=${(e) => { this._icon = e.detail.value ?? ""; }}
              ></ha-icon-picker>
            </div>
          </div>
        ` : b `
          <div class="icon-field">
            <label class="label" for="icon">${tr.iconLabel}</label>
            <ha-icon icon=${this._icon.trim() || DEFAULT_ICON}></ha-icon>
            <input
              id="icon"
              class="field"
              list="icon-suggestions"
              autocomplete="off"
              spellcheck="false"
              .value=${this._icon}
              ?disabled=${readonly}
              placeholder=${DEFAULT_ICON}
              @input=${(e) => { this._icon = e.target.value; }}
            />
            <datalist id="icon-suggestions">${ICON_SUGGESTIONS.map((icon) => b `<option value=${icon}></option>`)}</datalist>
          </div>
        `}
      </div>

      <div>
        <label class="label" for="description">${tr.description}</label>
        <textarea
          id="description"
          class="field"
          .value=${this._description}
          ?disabled=${readonly}
          placeholder=${tr.descriptionPlaceholder}
          @input=${(e) => { this._description = e.target.value; }}
        ></textarea>
      </div>

      <fieldset>
        <legend class="label">${tr.priority}</legend>
        <div class="segmented">
          ${PRIORITIES$1.map((p) => b `
            <button
              type="button"
              class="segment ${p}"
              aria-pressed=${this._priority === p ? "true" : "false"}
              ?disabled=${readonly}
              @click=${() => { this._priority = p; }}
            ><ha-icon icon=${PRIORITY_ICON[p]}></ha-icon>${tr[p]}</button>
          `)}
        </div>
      </fieldset>

      <div class="section">
        <h3 class="section-title">${tr.scheduleSection}</h3>
        <div class="two-cols date-time">
          <div>
            <span class="label" id="due-label">${recurring ? tr.nextDue : tr.dueDate}</span>
            <div class="date-wrap">
              <button
                type="button"
                class="field date-field ${this._dueDate ? "" : "empty"}"
                aria-labelledby="due-label due-value"
                ?disabled=${readonly}
                @click=${this._openDatePicker}
              ><span class="date-text" id="due-value">${this._dueDate ? this._formatDueDay({ weekday: "short", year: "numeric" }) : tr.noDueDate}</span></button>
              <input
                class="date-native"
                type="date"
                tabindex="-1"
                aria-hidden="true"
                .value=${this._dueDate}
                @change=${(e) => { this._dueDate = e.target.value; this._snapDueDateToWeekdays(); }}
              />
              ${this._dueDate && !readonly ? b `
                <button type="button" class="icon-btn clear-date" aria-label=${tr.clearDueDate} title=${tr.clearDueDate}
                  @click=${() => { this._dueDate = ""; this._dueTime = ""; }}><ha-icon icon="mdi:close"></ha-icon></button>
              ` : A}
            </div>
          </div>
          <div>
            <label class="label" for="due-time">${tr.timeLabel}</label>
            <div class="date-wrap">
              <input
                id="due-time"
                class="field time-field ${this._dueDate && !this._dueTime ? "all-day" : ""}"
                type="time"
                .value=${this._dueTime}
                aria-describedby=${this._dueDate && !this._dueTime ? "all-day-text" : A}
                ?disabled=${readonly || !this._dueDate}
                @change=${(e) => { this._dueTime = e.target.value; }}
              />
              ${this._dueDate && !this._dueTime ? b `<span class="all-day-text" id="all-day-text">${tr.allDay}</span>` : A}
              ${this._dueTime && !readonly ? b `
                <button type="button" class="icon-btn clear-time" aria-label=${tr.clearTime} title=${tr.clearTime}
                  @click=${() => { this._dueTime = ""; }}><ha-icon icon="mdi:close"></ha-icon></button>
              ` : A}
            </div>
          </div>
        </div>

        <div class="repeat-row">
          ${recurring ? b `
            <div class="every">
              <label class="label" for="repeat-every">${tr.repeatEvery}</label>
              <input
                id="repeat-every"
                class="field"
                type="number"
                min="1"
                max="3650"
                inputmode="numeric"
                .value=${String(this._repeatInterval)}
                ?disabled=${readonly}
                @input=${(e) => { this._repeatInterval = Math.max(1, parseInt(e.target.value, 10) || 1); }}
              />
            </div>
          ` : A}
          <div class="unit">
            ${recurring ? A : b `<label class="label" for="repeat-unit">${tr.repeatLabel}</label>`}
            <div class="select-wrap">
              <select
                id="repeat-unit"
                class="field"
                aria-label=${tr.repeatUnitLabel}
                .value=${unitValue}
                ?disabled=${readonly}
                @change=${(e) => { this._frequency = e.target.value; this._snapDueDateToWeekdays(); }}
              >
                <option value="one_time" ?selected=${unitValue === "one_time"}>${tr.doesNotRepeat}</option>
                ${REPEAT_UNITS.map((unit) => b `
                  <option value=${unit} ?selected=${unitValue === unit}>${tr.repeatUnit(unit, this._repeatInterval)}</option>
                `)}
              </select>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </div>
          </div>
        </div>

        ${this._frequency === "weekly" ? b `
          <div>
            <span class="label" id="weekdays-label">${tr.repeatOn}</span>
            <div class="weekday-chips" role="group" aria-labelledby="weekdays-label">
              ${WEEKDAYS.map((code) => b `
                <button
                  type="button"
                  class="weekday-chip"
                  aria-pressed=${this._weekdays.includes(code) ? "true" : "false"}
                  ?disabled=${readonly}
                  @click=${() => this._toggleWeekday(code)}
                >${weekdayName(code, this.hass)}</button>
              `)}
            </div>
            ${this._weekdays.length === 0
            ? b `<div class="hint">${tr.weekdaysNoneHint}</div>`
            : this._dueDateSnapped && this._dueDate
                ? b `<div class="hint">${tr.dueDateSnapped(this._formatDueDay({ weekday: "short", day: "2-digit", month: "2-digit", year: undefined }))}</div>`
                : A}
          </div>
        ` : A}

        ${recurring ? b `
          <fieldset>
            <legend class="label">${tr.anchorLegend}</legend>
            ${[["completion", tr.anchorCompletion, tr.anchorCompletionHint], ["due_date", tr.anchorDueDate, tr.anchorDueDateHint]].map(([value, label, hint]) => b `
              <label class="radio">
                <input
                  type="radio"
                  name="anchor"
                  .checked=${this._scheduleAnchor === value}
                  ?disabled=${readonly}
                  @change=${() => { this._scheduleAnchor = value; }}
                />
                <span>${label} <span class="muted">· ${hint}</span></span>
              </label>
            `)}
          </fieldset>
        ` : A}
      </div>

      <div class="section">
        <h3 class="section-title">${tr.linkedSection}</h3>
        ${this._linkedEntities.length ? b `
          <div class="chips">
            ${this._linkedEntities.filter(Boolean).map((link) => {
            const { label, icon } = this._linkInfo(link);
            return b `
                <span class="chip">
                  <ha-icon icon=${icon}></ha-icon><span>${label}</span>
                  ${readonly ? A : b `
                    <button type="button" aria-label=${tr.removeLink(label)} title=${tr.removeLink(label)}
                      @click=${() => { this._linkedEntities = this._linkedEntities.filter((l) => l !== link); }}>
                      <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                  `}
                </span>
              `;
        })}
          </div>
        ` : A}
        ${this._linkPickerOpen ? b `
          <div class="link-picker">
            <ik-searchable-select
              .items=${[{ value: "", label: tr.allAreas }, ...this._areas.map((a) => ({ value: a.area_id, label: a.name }))]}
              .value=${this._pickArea}
              .placeholder=${tr.allAreas}
              .noResultsText=${tr.noResults}
              @value-changed=${(e) => { this._pickArea = e.detail.value; this._pickDevice = ""; }}
            ></ik-searchable-select>
            <ik-searchable-select
              .items=${[{ value: "", label: tr.noSpecificDevice }, ...devicesForPick.map((d) => ({ value: d.id, label: this._deviceLabel(d) }))]}
              .value=${this._pickDevice}
              .placeholder=${tr.noSpecificDevice}
              .noResultsText=${tr.noResults}
              @value-changed=${(e) => { this._pickDevice = e.detail.value; }}
            ></ik-searchable-select>
            <button type="button" class="btn plain" @click=${this._closeLinkPicker}>${tr.cancel}</button>
            <button type="button" class="btn filled" ?disabled=${!this._pickArea && !this._pickDevice} @click=${this._addLink}>${tr.add}</button>
          </div>
        ` : b `
          <button type="button" class="add-link" ?disabled=${readonly} @click=${() => { this._linkPickerOpen = true; }}>
            <ha-icon icon="mdi:plus"></ha-icon>${tr.addLink}
          </button>
        `}
        <div class="hint">${tr.linkHint}</div>
      </div>

      <div class="section">
        <h3 class="section-title">${tr.notificationsSection}</h3>
        <div class="inline-field">
          <label for="remind">${tr.remindMe}</label>
          <input
            id="remind"
            class="field"
            type="number"
            min="0"
            max="365"
            inputmode="numeric"
            .value=${String(this._notifyDaysBefore)}
            ?disabled=${readonly}
            @input=${(e) => { this._notifyDaysBefore = Math.max(0, parseInt(e.target.value, 10) || 0); }}
          />
          <span>${tr.daysBeforeDue(this._notifyDaysBefore)}</span>
        </div>
        <div class="switch-row">
          <span id="notify-overdue">${tr.notifyOverdue}</span>
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${this._notifyOnOverdue ? "true" : "false"}
            aria-labelledby="notify-overdue"
            ?disabled=${readonly}
            @click=${() => { this._notifyOnOverdue = !this._notifyOnOverdue; }}
          ></button>
        </div>
      </div>

      ${this._error ? b `<div class="error" role="alert">${this._error}</div>` : A}
    `;
    }
    _pager(page, total, pageSize, onPage) {
        const tr = t(this.hass?.language);
        if (total <= pageSize)
            return A;
        const pages = Math.ceil(total / pageSize);
        const start = page * pageSize;
        return b `
      <div class="pager">
        <span>${start + 1}–${Math.min(start + pageSize, total)} ${tr.of} ${total}</span>
        <button class="icon-btn" aria-label="‹" ?disabled=${page === 0} @click=${() => onPage(page - 1)}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
        <button class="icon-btn" aria-label="›" ?disabled=${page >= pages - 1} @click=${() => onPage(page + 1)}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </div>
    `;
    }
    _renderNotes() {
        const tr = t(this.hass?.language);
        const task = this.task;
        const all = [...(task.notes || [])].reverse();
        const size = IkTaskFormView_1._NOTES_PAGE_SIZE;
        const page = Math.min(this._notesPage, Math.max(0, Math.ceil(all.length / size) - 1));
        return b `
      <div class="note-form">
        <label class="label" for="new-note">${tr.taskNotesLabel}</label>
        <textarea
          id="new-note"
          class="field"
          rows="4"
          .value=${this._newNoteContent}
          placeholder=${tr.taskNotesPlaceholder}
          @input=${(e) => { this._newNoteContent = e.target.value; }}
        ></textarea>
        <button
          class="btn filled"
          ?disabled=${this._addingNote || !this._newNoteContent.trim()}
          @click=${async () => {
            if (!this._newNoteContent.trim())
                return;
            this._addingNote = true;
            try {
                await addTaskNote(this.hass, task.task_id, this._newNoteContent.trim(), this.hass.user?.name ?? "");
                this._newNoteContent = "";
                this._notesPage = 0;
            }
            catch (err) {
                showToast(this, tr.actionFailed(errorText(err)));
            }
            finally {
                this._addingNote = false;
            }
        }}
        ><ha-icon icon="mdi:plus"></ha-icon>${tr.addNoteBtn}</button>
      </div>
      ${all.length === 0 ? b `<div class="empty">${tr.noNotes}</div>` : b `
        <div class="list">
          ${all.slice(page * size, page * size + size).map((note) => b `
            <div class="note">
              <div class="note-header">
                <span class="note-meta">${this._formatDate(note.created_at)}${note.added_by ? ` · ${note.added_by}` : ""}</span>
                <button class="icon-btn" aria-label=${tr.deleteAction} title=${tr.deleteAction}
                  @click=${() => { this._deleteNoteTarget = note.note_id; this._showDeleteNoteConfirm = true; }}>
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>
              </div>
              <div class="note-content">${note.content}</div>
            </div>
          `)}
        </div>
        ${this._pager(page, all.length, size, (p) => { this._notesPage = p; })}
      `}
      <ik-confirm-dialog
        heading=${tr.deleteNoteHeading}
        confirmText=${tr.deleteAction}
        cancelText=${tr.cancel}
        .open=${this._showDeleteNoteConfirm}
        @dialog-closed=${async (e) => {
            this._showDeleteNoteConfirm = false;
            const noteId = this._deleteNoteTarget;
            this._deleteNoteTarget = null;
            if (!e.detail.confirmed || !noteId)
                return;
            try {
                await deleteTaskNote(this.hass, task.task_id, noteId);
            }
            catch (err) {
                showToast(this, tr.actionFailed(errorText(err)));
            }
        }}
      >${tr.deleteNoteBody}</ik-confirm-dialog>
    `;
    }
    _renderHistory() {
        const tr = t(this.hass?.language);
        const task = this.task;
        const activities = [...(task.activities || [])].reverse();
        const actSize = IkTaskFormView_1._ACTIVITY_PAGE_SIZE;
        const actPage = Math.min(this._activityPage, Math.max(0, Math.ceil(activities.length / actSize) - 1));
        const actionIcon = {
            edited: "mdi:pencil-outline",
            completed: "mdi:check-circle-outline",
            reopened: "mdi:undo-variant",
            note_added: "mdi:note-plus-outline",
            note_deleted: "mdi:note-remove-outline",
        };
        const actionLabel = {
            edited: tr.activityEdited,
            completed: tr.activityCompleted,
            reopened: tr.activityReopened,
            note_added: tr.activityNoteAdded,
            note_deleted: tr.activityNoteDeleted,
        };
        // Every occurrence links to the family's first task; list the ones created before this one
        const rootId = task.previous_task_id;
        const created = Date.parse(task.created_at);
        const previous = rootId
            ? this.tasks
                .filter((t) => (t.task_id === rootId || t.previous_task_id === rootId) && Date.parse(t.created_at) < created)
                .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
            : [];
        const occSize = IkTaskFormView_1._PREV_OCC_PAGE_SIZE;
        const occPage = Math.min(this._prevOccPage, Math.max(0, Math.ceil(previous.length / occSize) - 1));
        const statusLabel = {
            pending: tr.pending, due: tr.groupToday, overdue: tr.overdue, completed: tr.completed,
        };
        return b `
      <h3 class="section-title">${tr.activityLog}</h3>
      ${activities.length === 0 ? b `<div class="empty">${tr.noActivity}</div>` : b `
        <div class="list">
          ${activities.slice(actPage * actSize, actPage * actSize + actSize).map((a) => b `
            <div class="activity">
              <ha-icon icon=${actionIcon[a.action] ?? "mdi:history"}></ha-icon>
              <div>
                <div>${actionLabel[a.action] ?? a.action}${a.performed_by ? b ` <span class="muted">${tr.activityBy} ${a.performed_by}</span>` : A}</div>
                <div class="activity-meta">${this._formatDate(a.timestamp)}</div>
                ${a.details ? b `<div class="activity-details">${this._resolveActivityDetails(a.details)}</div>` : A}
              </div>
            </div>
          `)}
        </div>
        ${this._pager(actPage, activities.length, actSize, (p) => { this._activityPage = p; })}
      `}
      ${rootId ? b `
        <div class="section">
          <h3 class="section-title">${tr.relatedTasksTitle}</h3>
          ${previous.length === 0 ? b `<div class="empty">${tr.noRelatedTasks}</div>` : b `
            <div class="list">
              ${previous.slice(occPage * occSize, occPage * occSize + occSize).map((rt) => b `
                <div class="occurrence">
                  <span class="occurrence-number">${rt.task_number ? `#${String(rt.task_number).padStart(3, "0")}` : "—"}</span>
                  <div class="occurrence-info">
                    <div>${rt.due_date ? formatDate(rt.due_date, this.hass) : "—"}</div>
                    ${rt.executions.length > 0 ? b `
                      <div class="occurrence-meta">${tr.completedBy}: ${rt.executions[rt.executions.length - 1].completed_by || "—"}</div>
                    ` : A}
                  </div>
                  <span class="status-chip ${rt.status}">${statusLabel[rt.status] ?? rt.status}</span>
                </div>
              `)}
            </div>
            ${this._pager(occPage, previous.length, occSize, (p) => { this._prevOccPage = p; })}
          `}
        </div>
      ` : A}
    `;
    }
    _renderFooter(isEdit, completed) {
        const tr = t(this.hass?.language);
        if (isEdit && completed) {
            return b `
        <div class="footer">
          <button class="btn outlined" ?disabled=${this._completing} @click=${this._complete}>
            <ha-icon icon="mdi:undo"></ha-icon>${tr.reopenAction}
          </button>
          <span class="spacer"></span>
          <button class="btn plain" @click=${this._close}>${tr.close}</button>
        </div>
      `;
        }
        return b `
      <div class="footer">
        ${isEdit ? b `
          <button class="btn success" ?disabled=${this._completing} @click=${this._complete}>
            <ha-icon icon="mdi:check"></ha-icon>${tr.markCompleteAction}
          </button>
        ` : A}
        <span class="spacer"></span>
        <button class="btn plain" @click=${this._close}>${tr.cancel}</button>
        <button class="btn filled" ?disabled=${this._saving} @click=${this._save}>${isEdit ? tr.save : tr.createTask}</button>
      </div>
    `;
    }
    render() {
        const tr = t(this.hass?.language);
        const isEdit = this.task !== null;
        const completed = isEdit && this.task.status === "completed";
        const tab = isEdit ? this._activeTab : "edit";
        return b `
      ${this._renderHeader(isEdit)}
      <div class="body" role=${isEdit ? "tabpanel" : A}>
        ${tab === "edit" ? this._renderDetails(completed) : tab === "notes" ? this._renderNotes() : this._renderHistory()}
      </div>
      ${tab === "edit" ? this._renderFooter(isEdit, completed) : A}
      <ik-confirm-dialog
        heading=${tr.deleteHeading}
        confirmText=${tr.deleteAction}
        cancelText=${tr.cancel}
        .open=${this._showDeleteConfirm}
        @dialog-closed=${(e) => this._handleDelete(e.detail.confirmed)}
      >${tr.deleteBody}</ik-confirm-dialog>
    `;
    }
};
IkTaskFormView._NOTES_PAGE_SIZE = 5;
IkTaskFormView._PREV_OCC_PAGE_SIZE = 5;
IkTaskFormView._ACTIVITY_PAGE_SIZE = 5;
IkTaskFormView.styles = i$6 `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      max-height: inherit;
      height: 100%;
      color: var(--primary-text-color);
    }
    :host([no-animations]) *, :host([no-animations]) *::before, :host([no-animations]) *::after {
      transition: none !important;
      animation: none !important;
    }
    button { font: inherit; }
    button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, a:focus-visible {
      outline: 2px solid var(--ik-focus-ring);
      outline-offset: 2px;
    }

    /* Header and tabs */
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 12px 0;
    }
    .icon-btn {
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      --mdc-icon-size: 22px;
    }
    .icon-btn:hover { background: var(--ik-subtle-fill); color: var(--primary-text-color); }
    .titles { flex: 1; min-width: 0; padding-inline-start: 4px; }
    .title {
      margin: 0;
      font-size: 20px;
      font-weight: 400;
      line-height: 1.3;
      overflow-wrap: anywhere;
    }
    .subtitle { margin-top: 2px; font-size: 13px; color: var(--secondary-text-color); }
    .tabs {
      display: flex;
      gap: 4px;
      padding: 4px 16px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .tab {
      height: 48px;
      padding: 0 16px;
      border: none;
      border-bottom: 2px solid transparent;
      background: none;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .tab:hover { color: var(--primary-text-color); }
    .tab[aria-selected="true"] { color: var(--primary-color); border-bottom-color: var(--primary-color); }

    /* Body */
    .body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .header + .body { padding-top: 16px; }
    .label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .field {
      width: 100%;
      box-sizing: border-box;
      min-height: 48px;
      padding: 0 14px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-field);
      background: var(--ik-field-fill);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 15px;
    }
    .field:focus { outline: none; border-color: var(--primary-color); }
    .field:disabled { opacity: 0.6; cursor: not-allowed; }
    textarea.field {
      padding: 12px 14px;
      min-height: 84px;
      line-height: 1.45;
      resize: none;
      overflow: hidden;
    }
    select.field {
      appearance: none;
      padding-inline-end: 40px;
      cursor: pointer;
    }
    .select-wrap { position: relative; }
    .select-wrap ha-icon {
      position: absolute;
      inset-inline-end: 12px;
      top: 14px;
      color: var(--secondary-text-color);
      pointer-events: none;
      --mdc-icon-size: 20px;
    }
    .hint { margin-top: 6px; font-size: 12px; color: var(--secondary-text-color); }
    .error { color: var(--ik-error-text); font-size: 13px; }
    .readonly-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: var(--ik-radius-field);
      background: var(--ik-subtle-fill);
      font-size: 13px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 16px;
    }
    .name-row { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
    .name-row > :first-child { flex: 3 1 260px; }
    /* Grows to the full row when it wraps under the name */
    .icon-field { flex: 1 1 230px; min-width: 200px; position: relative; }
    .icon-field ha-icon {
      position: absolute;
      inset-inline-start: 14px;
      bottom: 13px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }
    .icon-field .field { padding-inline-start: 44px; font-size: 14px; }
    /* HA's picker field is taller than ours: the box crops it to our field height, centered */
    .icon-box {
      display: flex;
      align-items: center;
      height: 48px;
      box-sizing: border-box;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-field);
      background: var(--ik-field-fill);
      overflow: hidden;
    }
    .icon-box:focus-within { border-color: var(--primary-color); }
    .icon-box ha-icon-picker {
      flex: 1 1 auto;
      min-width: 0;
      --ha-color-form-background: transparent;
    }

    /* Priority segmented control */
    fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
    legend { padding: 0; }
    .segmented {
      display: flex;
      gap: 4px;
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      background: var(--ik-field-fill);
    }
    .segment {
      flex: 1 1 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-width: 0;
      height: 44px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      --mdc-icon-size: 16px;
    }
    .segment:hover:not(:disabled) { color: var(--primary-text-color); }
    .segment[aria-pressed="true"] {
      /* A step towards the text color: lighter on dark themes, darker on light ones */
      background: color-mix(in srgb, var(--primary-text-color) 10%, var(--ik-field-fill));
      color: var(--primary-text-color);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .segment.critical[aria-pressed="true"] { color: var(--ik-error-text); }
    .segment:disabled { cursor: not-allowed; opacity: 0.6; }

    /* Sections */
    .section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 22px;
      border-top: 1px solid var(--divider-color);
    }
    .section-title {
      margin: 0;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .two-cols { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .date-field {
      display: flex;
      align-items: center;
      gap: 8px;
      text-align: start;
      cursor: pointer;
    }
    .date-wrap .date-field { padding-inline-end: 48px; }
    .date-field .date-text {
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .date-field.empty .date-text { color: var(--secondary-text-color); }
    .date-wrap { position: relative; }
    .date-native {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
    }
    .clear-date {
      position: absolute;
      inset-inline-end: 4px;
      top: 2px;
    }
    /* No time means all day: "All day" stands in for the empty time's --:-- until the field is focused */
    .time-field.all-day:not(:focus) { color: transparent; }
    .time-field.all-day:not(:focus)::-webkit-datetime-edit { color: transparent; }
    .all-day-text {
      position: absolute;
      inset-inline-start: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      color: var(--secondary-text-color);
      pointer-events: none;
    }
    .time-field.all-day:focus + .all-day-text { display: none; }
    /* Left of the native clock button */
    .clear-time {
      position: absolute;
      inset-inline-end: 36px;
      top: 2px;
    }
    .date-wrap .time-field:not(.all-day) { padding-inline-end: 80px; }
    .repeat-row { display: flex; align-items: flex-end; gap: 12px; }
    .repeat-row .every { width: 96px; flex: none; }
    .repeat-row .unit { flex: 1; }
    .weekday-chips { display: flex; gap: 6px; flex-wrap: wrap; }
    .weekday-chip {
      flex: 1 1 0;
      min-width: 44px;
      max-width: 72px;
      height: 40px;
      border-radius: 20px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
    }
    .weekday-chip[aria-pressed="true"] {
      background: var(--ik-primary-fill);
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .weekday-chip:disabled { opacity: 0.6; cursor: not-allowed; }
    .radio {
      display: flex;
      align-items: center;
      gap: 12px;
      min-height: 44px;
      font-size: 14px;
      cursor: pointer;
    }
    .radio input {
      width: 20px;
      height: 20px;
      margin: 0;
      flex: none;
      accent-color: var(--primary-color);
    }
    .muted { color: var(--secondary-text-color); }

    /* Linked to */
    .chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      max-width: 100%;
      height: 32px;
      padding: 0 4px 0 12px;
      border-radius: 16px;
      background: var(--ik-subtle-fill);
      font-size: 13px;
      --mdc-icon-size: 16px;
    }
    .chip > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .chip button {
      width: 24px;
      height: 24px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .chip button:hover { background: var(--divider-color); color: var(--primary-text-color); }
    .add-link {
      display: flex;
      align-items: center;
      gap: 10px;
      height: 48px;
      padding: 0 14px;
      border: 1px dashed var(--divider-color);
      border-radius: var(--ik-radius-field);
      background: transparent;
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .add-link:disabled { opacity: 0.6; cursor: not-allowed; }
    .link-picker {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-field);
    }
    .link-picker ik-searchable-select { flex: 1 1 180px; min-width: 0; }

    /* Notifications */
    .inline-field { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; font-size: 14px; }
    .inline-field .field { width: 72px; text-align: center; }
    .switch-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 44px;
      font-size: 14px;
    }
    .switch {
      width: 44px;
      height: 26px;
      flex: none;
      display: flex;
      padding: 3px;
      border: none;
      border-radius: 13px;
      background: var(--divider-color);
      cursor: pointer;
      transition: background 0.15s;
    }
    .switch::after {
      content: "";
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--text-primary-color);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      transition: transform 0.15s;
    }
    .switch[aria-checked="true"] { background: var(--primary-color); }
    .switch[aria-checked="true"]::after { transform: translateX(18px); }
    .switch:disabled { opacity: 0.6; cursor: not-allowed; }

    /* Footer and buttons */
    .footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      padding: 16px 24px 20px;
      border-top: 1px solid var(--divider-color);
    }
    .spacer { flex: 1; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 20px;
      border: none;
      border-radius: var(--ik-radius-pill);
      background: transparent;
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .btn:disabled { opacity: 0.5; cursor: default; }
    .btn.filled { background: var(--primary-color); color: var(--text-primary-color); }
    .btn.filled:hover:not(:disabled) { filter: brightness(1.08); }
    .btn.plain:hover:not(:disabled) { background: var(--ik-primary-fill); }
    .btn.success {
      padding-inline-start: 16px;
      border: 1px solid color-mix(in srgb, var(--success-color) 45%, transparent);
      background: var(--ik-success-fill);
      color: var(--ik-success-text);
    }
    .btn.outlined {
      padding-inline-start: 16px;
      border: 1px solid var(--divider-color);
      color: var(--primary-text-color);
    }

    /* Notes and history tabs */
    .empty { padding: 32px 16px; text-align: center; color: var(--secondary-text-color); font-size: 14px; }
    .note-form { display: flex; flex-direction: column; gap: 10px; }
    .note-form .btn { align-self: flex-end; }
    .list { display: flex; flex-direction: column; gap: 10px; }
    .note {
      padding: 12px 14px;
      border-radius: var(--ik-radius-field);
      background: var(--ik-subtle-fill);
    }
    .note-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .note-meta { flex: 1; font-size: 12px; color: var(--secondary-text-color); }
    .note-header .icon-btn { width: 32px; height: 32px; --mdc-icon-size: 16px; }
    .note-content { font-size: 14px; white-space: pre-wrap; word-break: break-word; }
    .pager { display: flex; align-items: center; justify-content: flex-end; gap: 4px; font-size: 13px; color: var(--secondary-text-color); }
    .pager .icon-btn { width: 36px; height: 36px; --mdc-icon-size: 20px; }
    .activity { display: flex; align-items: flex-start; gap: 12px; font-size: 14px; }
    .activity > ha-icon { flex: none; margin-top: 1px; color: var(--secondary-text-color); --mdc-icon-size: 18px; }
    .activity-meta, .activity-details { margin-top: 2px; font-size: 12px; color: var(--secondary-text-color); }
    .activity-details { font-style: italic; }
    .occurrence {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--ik-radius-field);
      background: var(--ik-subtle-fill);
      font-size: 14px;
    }
    .occurrence-number { min-width: 40px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
    .occurrence-info { flex: 1; min-width: 0; }
    .occurrence-meta { font-size: 12px; color: var(--secondary-text-color); }
    .status-chip {
      display: inline-flex;
      align-items: center;
      height: 24px;
      padding: 0 10px;
      border-radius: 12px;
      background: var(--ik-surface);
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
    }
    .status-chip.overdue { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .status-chip.due { background: var(--ik-warning-fill); color: var(--ik-warning-text); }
    .status-chip.completed { background: var(--ik-success-fill); color: var(--ik-success-text); }

    @media (max-width: 480px) {
      .body { padding: 16px; }
      .footer { padding: 12px 16px 16px; }
      .segment { flex-direction: column; gap: 2px; height: 52px; font-size: 12px; }
      /* The date ("Mon, Oct 19, 2026") needs more room than the time */
      .two-cols.date-time { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); }
    }
  `;
__decorate([
    n({ attribute: false })
], IkTaskFormView.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], IkTaskFormView.prototype, "task", void 0);
__decorate([
    n({ attribute: false })
], IkTaskFormView.prototype, "tasks", void 0);
__decorate([
    n({ type: Boolean })
], IkTaskFormView.prototype, "enableAnimations", void 0);
__decorate([
    n({ type: String })
], IkTaskFormView.prototype, "returnPath", void 0);
__decorate([
    n({ attribute: false })
], IkTaskFormView.prototype, "template", void 0);
__decorate([
    n()
], IkTaskFormView.prototype, "dueDate", void 0);
__decorate([
    n()
], IkTaskFormView.prototype, "initialTab", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_name", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_description", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_icon", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_priority", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_frequency", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_repeatInterval", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_scheduleAnchor", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_weekdays", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_dueDateSnapped", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_dueDate", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_dueTime", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_linkedEntities", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_notifyDaysBefore", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_notifyOnOverdue", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_saving", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_completing", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_showDeleteConfirm", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_error", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_activeTab", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_linkPickerOpen", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_pickArea", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_pickDevice", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_newNoteContent", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_addingNote", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_showDeleteNoteConfirm", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_deleteNoteTarget", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_notesPage", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_prevOccPage", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_activityPage", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_areas", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_deviceRegistry", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_haIconPicker", void 0);
IkTaskFormView = IkTaskFormView_1 = __decorate([
    t$3("ik-task-form-view")
], IkTaskFormView);

const ALL_COLUMNS = ["task", "completed", "by", "timing", "area", "device"];
// Areas and devices were mostly "—", so they start hidden
const DEFAULT_COLUMNS = ["task", "completed", "by", "timing"];
// Column names stored by earlier versions
const LEGACY_COLUMNS = { date: "completed", late: "timing" };
const RANGES = ["7", "30", "90", "365", "all"];
const PAGE_SIZES = [10, 25, 50];
const HISTORY_FILTER_MODE_KEY = "intellikeep.historyFilterMode";
const HISTORY_FILTER_AREAS_KEY = "intellikeep.historyFilterAreas";
const HISTORY_FILTER_DEVICES_KEY = "intellikeep.historyFilterDevices";
const HISTORY_COLUMNS_KEY = "intellikeep.historyColumns";
const HISTORY_RANGE_KEY = "intellikeep.historyRange";
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 336 416" height="40"><path fill="#000" d="M292.085,275.543C294.886,277,295.348,279.164,295.347,281.645C295.325,315.301,295.372,348.957,295.294,382.613C295.28,388.929,292.366,391.331,285.198,391.337C238.711,391.373,192.224,391.381,145.737,391.383C117.744,391.384,89.752,391.372,61.76,391.338C52.998,391.327,50.684,389.06,50.679,380.502C50.66,348.345,50.66,316.187,50.672,284.029C50.675,276.321,52.218,274.831,60.105,274.712C74.264,274.499,74.276,274.499,74.281,288.852C74.29,313.345,74.38,337.839,74.197,362.33C74.163,366.986,75.349,368.728,80.342,368.692C110.826,368.476,141.319,368.967,171.796,368.439C193.28,368.067,214.74,368.713,236.211,368.615C245.861,368.572,255.494,367.96,265.164,368.535C271.299,368.9,271.738,368.131,271.741,362.094C271.754,336.435,271.738,310.775,271.748,285.116C271.752,276.257,273.215,274.788,282.272,274.737C285.416,274.719,288.61,274.25,292.085,275.543z"/><path fill="#000" d="M320.53,252.723C324.286,259.571,323.451,265.254,318.429,268.988C313.15,272.914,307.521,272.273,301.916,266.689C278.307,243.165,254.779,219.561,231.214,195.992C213.423,178.198,195.629,160.407,177.823,142.628C173.271,138.083,172.813,138.093,168.221,142.681C128.256,182.607,88.297,222.539,48.336,262.468C46.921,263.881,45.523,265.313,44.07,266.686C38.204,272.228,31.425,272.392,26.385,267.138C21.725,262.279,22.113,256.061,27.791,250.309C38.21,239.756,48.781,229.354,59.281,218.879C93.962,184.281,128.635,149.675,163.32,115.08C170.895,107.526,175.581,107.627,183.172,115.229C228.863,160.979,274.576,206.706,320.53,252.723z"/><path fill="#000" d="M156.557,299.525C160.166,295.201,163.61,293.158,169.639,294.584C188.024,298.934,202.203,278.403,195.773,264.969C191.913,266.43,189.825,269.979,187.009,272.568C182.092,277.087,177.339,277.472,173.526,273.318C169.779,269.236,170.283,263.932,174.822,259.711C177.585,257.141,180.352,254.576,183.233,251.902C170.99,244.815,153.777,253.19,151.394,266.927C150.864,269.979,149.961,273.067,151.083,276.274C151.425,277.252,151.101,278.62,150.704,279.666C149.946,281.662,137.044,293.377,133.971,294.688C133.681,285.538,126.866,285.16,120.151,282.742C114.014,280.532,118.691,272.931,117.727,267.826C117.243,265.263,118.846,263.837,121.486,263.62C122.641,263.526,123.774,263.175,124.925,262.992C133.809,261.58,136.709,254.209,131.268,246.85C126.987,241.059,127.051,240.303,132.346,235.224C133.307,234.302,134.406,233.517,135.31,232.546C138.794,228.804,142.381,228.471,146.093,232.144C149.484,235.501,152.877,235.731,157.272,233.559C160.724,231.853,162.316,229.797,162.78,226.125C163.134,223.321,162.531,219.364,166.19,218.519C171.178,217.368,176.475,216.846,181.348,219.095C183.268,219.981,183.115,222.479,183.339,224.484C183.681,227.533,183.168,231.265,186.962,232.483C191.091,233.807,195.296,237.25,199.659,232.296C201.401,230.318,204.219,227.906,207.119,229.88C211.043,232.551,215.395,235.136,217.096,239.996C217.941,242.408,215.652,243.833,214.56,245.642C212.962,248.291,209.523,250.215,211.586,254.354C213.777,258.746,215.417,263.246,221.712,262.839C226.698,262.516,229.147,265.016,228.365,270.214C228.218,271.191,228.351,272.21,228.352,273.21C228.365,282.781,228.365,282.781,219.095,284.28C214.023,285.101,210.057,293.711,213.037,297.829C219.4,306.62,219.14,305.42,211.119,313.586C207.521,317.248,204.313,317.986,199.993,314.391C195.228,310.426,190.997,310.642,185.99,314.197C183.352,316.069,183.55,319.213,183.431,321.895C183.217,326.712,181.234,329.019,176.291,328.379C175.635,328.294,174.959,328.378,174.292,328.364C164.372,328.15,164,330.187,162.549,318.557C161.772,312.323,155.906,312.984,151.746,311.527C150.326,311.029,148.113,312.422,147.466,310.154C146.913,308.213,148.863,307.326,149.972,306.171C152.05,304.009,154.19,301.907,156.557,299.525z"/><path fill="#000" d="M187.924,40.781C205.599,43.236,221.527,49.142,236.326,58.295C239.911,60.513,241.081,62.498,238.145,66.093C235.942,68.791,233.966,71.722,232.238,74.748C230.315,78.116,228.374,78.323,225.038,76.4C214.334,70.231,203.171,65.211,190.839,62.966C167.933,58.798,146.534,63.005,126.185,73.783C124.42,74.718,122.629,75.632,120.973,76.739C118.387,78.469,116.544,78.228,114.861,75.388C112.828,71.955,110.482,68.702,108.193,65.427C106.166,62.526,106.48,60.446,109.688,58.503C132.412,44.741,156.758,37.761,183.492,40.471C184.816,40.605,186.149,40.647,187.924,40.781z"/><path fill="#000" d="M249.011,121.883C257.669,121.869,265.833,121.736,273.991,121.886C281.088,122.017,282.31,123.418,282.315,130.551C282.327,150.037,282.339,169.524,282.293,189.011C282.288,190.743,282.888,192.665,281.228,194.426C277.668,193.409,276.164,189.866,273.427,187.893C263.098,180.447,258.608,170.705,260.525,157.832C261.166,153.531,262.538,147.803,259.723,144.809C256.842,141.747,251.207,144.022,246.801,143.972C230.856,143.788,233.06,145.359,232.957,130.084C232.904,122.165,233.218,121.898,241.018,121.839C243.516,121.82,246.015,121.869,249.011,121.883z"/><path fill="#000" d="M82.143,171.044C84.154,175.714,83.172,178.934,79.275,181.722C74.754,184.956,71.094,189.342,66.515,192.12C64.384,191.171,64.222,189.57,63.768,188.198C55.428,162.95,55.684,137.621,62.993,112.198C63.977,108.774,65.532,107.412,69.078,108.985C72.873,110.668,76.729,112.241,80.644,113.619C84.002,114.8,84.733,116.54,83.668,120.052C78.615,136.733,77.489,153.612,82.143,171.044z"/><path fill="#000" d="M64.331,91.478C59.424,81.825,60.131,73.819,66.226,67.22C72.174,60.78,81.1,59.016,89.529,62.614C96.86,65.744,101.61,73.692,100.771,81.428C99.82,90.211,93.526,97.565,85.744,99.288C77.061,101.21,70.053,98.692,64.331,91.478z"/><path fill="#000" d="M278.435,66.513C285.689,74.329,286.806,82.963,281.826,90.845C277.285,98.032,267.981,101.683,260.2,99.33C251.19,96.606,245.216,88.625,245.767,79.543C246.201,72.378,249.594,66.785,256.202,63.726C263.926,60.15,271.373,60.818,278.435,66.513z"/><path fill="#000" d="M101.244,112.328C102.895,105.379,107.409,101.405,113.707,101.001C119.431,100.635,125.066,104.316,126.983,109.673C128.768,114.664,126.993,120.768,122.626,123.969C118.201,127.212,113.259,127.318,108.428,125.259C103.044,122.964,101.095,118.352,101.244,112.328z"/></svg>`;
const loadStoredList$1 = (key) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw)
            return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
    }
    catch {
        return [];
    }
};
const loadStoredColumns = () => {
    const stored = loadStoredList$1(HISTORY_COLUMNS_KEY)
        .map((key) => LEGACY_COLUMNS[key] ?? key)
        .filter((key) => ALL_COLUMNS.includes(key));
    return new Set(stored.length ? stored : DEFAULT_COLUMNS);
};
const loadStoredRange = () => {
    try {
        const value = localStorage.getItem(HISTORY_RANGE_KEY);
        return value && RANGES.includes(value) ? value : "30";
    }
    catch {
        return "30";
    }
};
/**
 * The History tab: every completion record, newest first, as a table with
 * configurable columns. The narrow layout lists the records by day instead.
 */
let IkTaskHistoryView = class IkTaskHistoryView extends i$3 {
    constructor() {
        super(...arguments);
        this.tasks = [];
        this.narrow = false;
        this._search = "";
        this._range = loadStoredRange();
        this._page = 0;
        this._pageSize = 25;
        this._areas = [];
        this._devices = [];
        this._selectedAreaIds = loadStoredList$1(HISTORY_FILTER_AREAS_KEY);
        this._selectedDeviceIds = loadStoredList$1(HISTORY_FILTER_DEVICES_KEY);
        this._filterMode = localStorage.getItem(HISTORY_FILTER_MODE_KEY) ?? "or";
        this._showFilters = false;
        this._showColumns = false;
        this._columns = loadStoredColumns();
    }
    connectedCallback() {
        super.connectedCallback();
        void this._loadRegistries();
    }
    async _loadRegistries() {
        try {
            const [areas, devices] = await Promise.all([
                this.hass.connection.sendMessagePromise({ type: "config/area_registry/list" }),
                this.hass.connection.sendMessagePromise({ type: "config/device_registry/list" }),
            ]);
            this._areas = areas.sort((a, b) => a.name.localeCompare(b.name));
            this._devices = devices.sort((a, b) => (a.name_by_user || a.name).localeCompare(b.name_by_user || b.name));
        }
        catch (error) {
            console.error("[IntelliKeep] Failed to load registries for history filters:", error);
        }
    }
    _onFilterChanged(e) {
        const { selectedAreaIds, selectedDeviceIds, filterMode } = e.detail;
        this._selectedAreaIds = selectedAreaIds;
        this._selectedDeviceIds = selectedDeviceIds;
        this._filterMode = filterMode;
        localStorage.setItem(HISTORY_FILTER_MODE_KEY, filterMode);
        localStorage.setItem(HISTORY_FILTER_AREAS_KEY, JSON.stringify(selectedAreaIds));
        localStorage.setItem(HISTORY_FILTER_DEVICES_KEY, JSON.stringify(selectedDeviceIds));
        this._page = 0;
    }
    _toggleColumn(key) {
        const next = new Set(this._columns);
        if (next.has(key)) {
            if (next.size > 1)
                next.delete(key);
        }
        else {
            next.add(key);
        }
        this._columns = next;
        localStorage.setItem(HISTORY_COLUMNS_KEY, JSON.stringify(ALL_COLUMNS.filter((k) => next.has(k))));
    }
    _setRange(range) {
        if (!RANGES.includes(range))
            return;
        this._range = range;
        this._page = 0;
        localStorage.setItem(HISTORY_RANGE_KEY, range);
    }
    _matchesLinkedFilters(linkedEntityIds) {
        if (this._selectedAreaIds.length === 0 && this._selectedDeviceIds.length === 0)
            return true;
        const taskAreaIds = new Set(linkedEntityIds.filter((v) => v.startsWith("area:")).map((v) => v.slice(5)));
        const taskDeviceIds = new Set(linkedEntityIds.filter((v) => v.startsWith("device:")).map((v) => v.slice(7)));
        const matchesArea = this._selectedAreaIds.length === 0 ? null
            : this._selectedAreaIds.some((areaId) => {
                if (taskAreaIds.has(areaId))
                    return true;
                return [...taskDeviceIds].some((deviceId) => {
                    const device = this._devices.find((d) => d.id === deviceId);
                    return device?.area_id === areaId;
                });
            });
        const matchesDevice = this._selectedDeviceIds.length === 0 ? null
            : this._selectedDeviceIds.some((deviceId) => taskDeviceIds.has(deviceId));
        if (matchesArea === null)
            return Boolean(matchesDevice);
        if (matchesDevice === null)
            return matchesArea;
        return this._filterMode === "and" ? matchesArea && matchesDevice : matchesArea || matchesDevice;
    }
    _openTask(taskId) {
        // The record's details live in the task's own History tab
        this.dispatchEvent(new CustomEvent("open-task", {
            detail: { taskId, tab: "history" },
            bubbles: true,
            composed: true,
        }));
    }
    _linkedAreas(linkedEntityIds) {
        return linkedEntityIds
            .filter((v) => v.startsWith("area:"))
            .map((v) => this._areas.find((a) => a.area_id === v.slice(5))?.name ?? v.slice(5))
            .join(", ") || "—";
    }
    _linkedDevices(linkedEntityIds) {
        return linkedEntityIds
            .filter((v) => v.startsWith("device:"))
            .map((v) => {
            const d = this._devices.find((device) => device.id === v.slice(7));
            return d ? (d.name_by_user || d.name) : v.slice(7);
        })
            .join(", ") || "—";
    }
    /** "On time", or how late: days from the occurrence's due date to the completion. */
    _timing(row) {
        const tr = t(this.hass?.language);
        if (!row.execution.was_late)
            return { late: false, label: tr.onTime };
        const days = row.task.due_date ? daysBetween(row.task.due_date, row.execution.completed_at, this.hass) : 0;
        return { late: true, label: days > 0 ? tr.daysLate(days) : tr.lateLabel };
    }
    _number(task) {
        return task.task_number ? `#${String(task.task_number).padStart(3, "0")}` : "";
    }
    /** Completion records in the chosen range that match the search and filters, newest first. */
    _rows() {
        const since = this._range === "all" ? -Infinity : Date.now() - Number(this._range) * 86400000;
        const q = this._search.trim().toLowerCase();
        const rows = [];
        for (const task of this.tasks) {
            if (!this._matchesLinkedFilters(task.linked_entity_ids ?? []))
                continue;
            for (const execution of task.executions ?? []) {
                if (Date.parse(execution.completed_at) < since)
                    continue;
                if (q && ![task.name, this._number(task), execution.completed_by].some((text) => text?.toLowerCase().includes(q)))
                    continue;
                rows.push({ execution, task });
            }
        }
        return rows.sort((a, b) => Date.parse(b.execution.completed_at) - Date.parse(a.execution.completed_at));
    }
    _columnLabels() {
        const tr = t(this.hass?.language);
        return {
            task: tr.taskHeader,
            completed: tr.colCompleted,
            by: tr.colBy,
            timing: tr.colTiming,
            area: tr.filterAreasLabel,
            device: tr.filterDevicesLabel,
        };
    }
    /** Plain-text cell values for CSV and print. */
    _exportValues(row) {
        return {
            task: row.task.name,
            completed: formatDateTime(row.execution.completed_at, this.hass, { second: "2-digit" }),
            by: row.execution.completed_by || "",
            timing: this._timing(row).label,
            area: this._linkedAreas(row.task.linked_entity_ids).replace("—", ""),
            device: this._linkedDevices(row.task.linked_entity_ids).replace("—", ""),
        };
    }
    _escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    _exportCsv() {
        const labels = this._columnLabels();
        const keys = ALL_COLUMNS.filter((k) => this._columns.has(k));
        const lines = [
            ["#", ...keys.map((k) => labels[k])],
            ...this._rows().map((row) => {
                const values = this._exportValues(row);
                return [this._number(row.task), ...keys.map((k) => values[k])];
            }),
        ];
        const csv = lines.map((line) => line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "intellikeep-history.csv";
        a.click();
        URL.revokeObjectURL(url);
    }
    _printHistory() {
        const tr = t(this.hass?.language);
        const e = (s) => this._escapeHtml(s);
        const labels = this._columnLabels();
        const keys = ALL_COLUMNS.filter((k) => this._columns.has(k));
        const rows = this._rows().map((row) => {
            const values = this._exportValues(row);
            return `<tr><td>${e(this._number(row.task))}</td>${keys.map((k) => `<td>${e(values[k] || "—")}</td>`).join("")}</tr>`;
        }).join("");
        const headerCells = keys.map((k) => `<th>${e(labels[k])}</th>`).join("");
        const doc = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${e(tr.globalHistoryTitle)}</title>
<style>
  @page { margin: 0; }
  body { font-family: sans-serif; font-size: 12px; padding: 1.5cm; box-sizing: border-box; }
  .print-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #000; }
  .print-brand { display: flex; align-items: center; gap: 10px; }
  .print-brand svg { height: 36px; width: auto; }
  .print-brand-name { font-size: 18px; font-weight: 700; letter-spacing: 0.02em; }
  .print-report-title { font-size: 13px; color: #555; text-align: right; }
  .print-date { font-size: 11px; color: #888; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 6px 8px; border: 1px solid #ccc; text-align: left; }
  th { background: #f5f5f5; font-weight: 600; }
</style></head><body>
<div class="print-header">
  <div class="print-brand">
    ${LOGO_SVG}
    <span class="print-brand-name">IntelliKeep</span>
  </div>
  <div class="print-report-title">
    <div>${e(tr.globalHistoryTitle)}</div>
    <div class="print-date">${e(formatDate(new Date(), this.hass))}</div>
  </div>
</div>
<table><thead><tr>
  <th>#</th>${headerCells}
</tr></thead><tbody>${rows}</tbody></table>
</body></html>`;
        const blob = new Blob([doc], { type: "text/html;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const win = window.open(url, "_blank");
        win?.addEventListener("load", () => {
            win.print();
            URL.revokeObjectURL(url);
        });
    }
    _onMenuAction(action) {
        if (action === "columns")
            this._showColumns = !this._showColumns;
        else if (action === "csv")
            this._exportCsv();
        else if (action === "print")
            this._printHistory();
    }
    render() {
        const tr = t(this.hass?.language);
        const labels = this._columnLabels();
        const cols = this._columns;
        const rows = this._rows();
        const total = rows.length;
        const totalPages = Math.max(1, Math.ceil(total / this._pageSize));
        const page = Math.min(this._page, totalPages - 1);
        const start = page * this._pageSize;
        const filterCount = this._selectedAreaIds.length + this._selectedDeviceIds.length;
        const rangeLabels = {
            "7": tr.rangeLast7,
            "30": tr.rangeLast30,
            "90": tr.rangeLast90,
            "365": tr.rangeLast365,
            all: tr.rangeAllTime,
        };
        const rangeItems = RANGES.map((r) => ({ action: r, label: rangeLabels[r], selected: r === this._range }));
        const menuItems = [
            // The narrow list has no columns to pick
            ...(this.narrow ? [] : [{ action: "columns", label: tr.columns, icon: "mdi:table-column" }]),
            { action: "csv", label: tr.exportCsv, icon: "mdi:download" },
            { action: "print", label: tr.printHistory, icon: "mdi:printer-outline" },
        ];
        const pageRows = rows.slice(start, start + this._pageSize);
        const pagination = total > PAGE_SIZES[0] ? b `
      <div class="pagination">
        <label>${tr.rowsPerPage}
          <select .value=${String(this._pageSize)} @change=${(e) => { this._pageSize = Number(e.target.value); this._page = 0; }}>
            ${PAGE_SIZES.map((size) => b `<option value=${size} ?selected=${size === this._pageSize}>${size}</option>`)}
          </select>
        </label>
        <span>${start + 1}–${Math.min(start + this._pageSize, total)} ${tr.of} ${total}</span>
        <button class="icon-btn" aria-label="‹" ?disabled=${page === 0} @click=${() => { this._page = page - 1; }}><ha-icon icon="mdi:chevron-left"></ha-icon></button>
        <button class="icon-btn" aria-label="›" ?disabled=${page >= totalPages - 1} @click=${() => { this._page = page + 1; }}><ha-icon icon="mdi:chevron-right"></ha-icon></button>
      </div>
    ` : A;
        const hasAny = this.tasks.some((task) => (task.executions ?? []).length > 0);
        return b `
      <div class="toolbar">
        <label class="search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            .value=${this._search}
            placeholder=${tr.searchHistory}
            aria-label=${tr.searchHistory}
            @input=${(e) => { this._search = e.target.value; this._page = 0; }}
          />
        </label>
        <ik-menu
          pill
          pillIcon="mdi:calendar-blank-outline"
          .label=${rangeLabels[this._range]}
          .items=${rangeItems}
          @menu-select=${(e) => this._setRange(e.detail)}
        ></ik-menu>
        <button class="pill" aria-expanded=${this._showFilters ? "true" : "false"} @click=${() => { this._showFilters = !this._showFilters; }}>
          <ha-icon icon="mdi:filter-variant"></ha-icon>${tr.filters}
          ${filterCount ? b `<span class="count">${filterCount}</span>` : A}
        </button>
        <ik-menu .items=${menuItems} .label=${tr.moreHistoryActions} @menu-select=${(e) => this._onMenuAction(e.detail)}></ik-menu>
      </div>

      <div class="panel">
        ${this._showColumns && !this.narrow ? b `
          <div class="columns" role="group" aria-label=${tr.columnPickerTitle}>
            <span class="columns-title">${tr.columnPickerTitle}</span>
            ${ALL_COLUMNS.map((key) => {
            const on = cols.has(key);
            return b `
                <button
                  class="column-chip"
                  aria-pressed=${on ? "true" : "false"}
                  ?disabled=${on && cols.size === 1}
                  @click=${() => this._toggleColumn(key)}
                >${on ? b `<ha-icon icon="mdi:check"></ha-icon>` : A}${labels[key]}</button>
              `;
        })}
          </div>
        ` : A}
        <ik-link-filter
          .hass=${this.hass}
          .areas=${this._areas}
          .devices=${this._devices}
          .selectedAreaIds=${this._selectedAreaIds}
          .selectedDeviceIds=${this._selectedDeviceIds}
          .filterMode=${this._filterMode}
          ?open=${this._showFilters}
          @filter-changed=${(e) => this._onFilterChanged(e)}
        ></ik-link-filter>
      </div>

      ${total === 0
            ? b `<div class="empty">${hasAny ? tr.noCompletionsInRange : tr.globalHistoryEmpty}</div>`
            : this.narrow
                ? b `${this._renderDays(pageRows, tr)}${pagination}`
                : b `
          <div class="table-card">
            <div class="table-scroll">
              <table>
                <thead>
                  <tr>
                    ${ALL_COLUMNS.filter((k) => cols.has(k)).map((k) => b `<th scope="col">${labels[k]}</th>`)}
                    <th class="open-col"><span hidden>${tr.viewTask}</span></th>
                  </tr>
                </thead>
                <tbody>
                  ${pageRows.map((row) => this._renderRow(row))}
                </tbody>
              </table>
            </div>
            ${pagination}
          </div>
        `}
    `;
    }
    /** "Today", "Yesterday" or "Tue, Oct 13": the header over one day's records. */
    _dayLabel(date) {
        return relativeDay(date, this.hass) ?? formatShortDate(date, this.hass);
    }
    /** Narrow layout: the page's records grouped under the day they were completed. */
    _renderDays(rows, tr) {
        const days = [];
        for (const row of rows) {
            // Rows come newest first, so a day's records are next to each other
            const label = this._dayLabel(row.execution.completed_at);
            const last = days[days.length - 1];
            if (last?.label === label)
                last.rows.push(row);
            else
                days.push({ label, rows: [row] });
        }
        return b `
      <div class="days">
        ${days.map((day) => b `
          <section>
            <h2 class="group-header">${day.label}</h2>
            <div class="group">${day.rows.map((row) => this._renderListRow(row, tr))}</div>
          </section>
        `)}
      </div>
    `;
    }
    /** Narrow row: task icon, name and number, then "19:16 · Dev · On time". */
    _renderListRow(row, tr) {
        const { task, execution } = row;
        const timing = this._timing(row);
        const dot = b `<span aria-hidden="true">·</span>`;
        return b `
      <button class="row" @click=${() => this._openTask(task.task_id)}>
        <span class="ico" aria-hidden="true"><ha-icon icon=${task.icon || "mdi:wrench-outline"}></ha-icon></span>
        <span class="text">
          <span class="title"><span class="name">${task.name}</span><span class="number">${this._number(task)}</span></span>
          <span class="meta">
            <span title=${formatDateTime(execution.completed_at, this.hass, { second: "2-digit" })}>${formatTime(execution.completed_at, this.hass)}</span>
            ${execution.completed_by ? b `${dot}<span>${execution.completed_by}</span>` : A}
            ${dot}
            <span class="timing ${timing.late ? "late" : "on-time"}">
              <ha-icon icon=${timing.late ? "mdi:clock-alert-outline" : "mdi:check"}></ha-icon>${timing.label}
            </span>
          </span>
        </span>
        <ha-icon class="chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
      </button>
    `;
    }
    _renderRow(row) {
        const tr = t(this.hass?.language);
        const { task, execution } = row;
        const cols = this._columns;
        const timing = this._timing(row);
        const by = execution.completed_by;
        const cells = {
            task: b `
        <div class="task-cell">
          <div class="ico" aria-hidden="true"><ha-icon icon=${task.icon || "mdi:wrench-outline"}></ha-icon></div>
          <div><div class="name">${task.name}</div><div class="number">${this._number(task)}</div></div>
        </div>`,
            completed: b `<span title=${formatDateTime(execution.completed_at, this.hass, { second: "2-digit" })}>${formatRelative(execution.completed_at, this.hass)}</span>`,
            by: by
                ? b `<div class="by"><span class="avatar" aria-hidden="true">${by.trim().charAt(0).toUpperCase()}</span>${by}</div>`
                : b `<span class="muted">—</span>`,
            timing: b `
        <span class="chip ${timing.late ? "late" : "on-time"}">
          <ha-icon icon=${timing.late ? "mdi:clock-alert-outline" : "mdi:check"}></ha-icon>${timing.label}
        </span>`,
            area: this._linkedAreas(task.linked_entity_ids),
            device: this._linkedDevices(task.linked_entity_ids),
        };
        return b `
      <tr @click=${() => this._openTask(task.task_id)}>
        ${ALL_COLUMNS.filter((k) => cols.has(k)).map((k) => b `<td>${cells[k]}</td>`)}
        <td class="open-col">
          <button class="icon-btn" aria-label=${tr.openRecord(task.name)} title=${tr.openRecord(task.name)}
            @click=${(e) => { e.stopPropagation(); this._openTask(task.task_id); }}>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
        </td>
      </tr>
    `;
    }
};
IkTaskHistoryView.styles = i$6 `
    :host { display: block; }
    button { font: inherit; }
    button:focus-visible, input:focus-visible, select:focus-visible, tr:focus-visible {
      outline: 2px solid var(--ik-focus-ring);
      outline-offset: 2px;
    }
    .toolbar, .panel, .table-card, .empty {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
    }
    .search {
      flex: 1 1 280px;
      display: flex;
      align-items: center;
      gap: 10px;
      height: 42px;
      padding: 0 16px;
      box-sizing: border-box;
      border-radius: 21px;
      border: 1px solid var(--divider-color);
      background: var(--ik-surface);
      color: var(--secondary-text-color);
      --mdc-icon-size: 18px;
    }
    .search:focus-within { border-color: var(--primary-color); }
    .search input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      font-size: 14px;
    }
    .search input::placeholder { color: var(--secondary-text-color); }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 16px;
      border-radius: var(--ik-radius-pill);
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .pill:hover { background: var(--ik-subtle-fill); }
    .pill[aria-expanded="true"] { border-color: var(--primary-color); color: var(--primary-color); }
    .count {
      display: inline-block;
      min-width: 8px;
      padding: 1px 7px;
      border-radius: 9px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      font-size: 12px;
      text-align: center;
    }
    .panel { padding-bottom: 12px; }
    .columns {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }
    .columns-title { margin-inline-end: 4px; font-size: 13px; font-weight: 500; color: var(--secondary-text-color); }
    .column-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 32px;
      padding: 0 12px;
      border-radius: 16px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font-size: 13px;
      cursor: pointer;
      --mdc-icon-size: 16px;
    }
    .column-chip[aria-pressed="true"] {
      border-color: var(--primary-color);
      background: var(--ik-primary-fill);
      color: var(--primary-color);
    }
    .column-chip:disabled { opacity: 0.6; cursor: default; }
    .table-card {
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--ik-surface);
      overflow: hidden;
    }
    .table-scroll { overflow-x: auto; }
    table { width: 100%; min-width: 760px; border-collapse: collapse; }
    th {
      height: 48px;
      padding: 0 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
      text-align: start;
      white-space: nowrap;
    }
    td {
      height: 64px;
      padding: 0 16px;
      border-bottom: 1px solid var(--divider-color);
      font-size: 14px;
    }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr { cursor: pointer; }
    tbody tr:hover { background: var(--ik-subtle-fill); }
    .task-cell { display: flex; align-items: center; gap: 12px; }
    .ico {
      width: 36px;
      height: 36px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--ik-subtle-fill);
      --mdc-icon-size: 18px;
    }
    .name { font-weight: 500; }
    .number, .muted { font-size: 12px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
    .by { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 28px;
      height: 28px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--ik-primary-fill);
      color: var(--primary-color);
      font-size: 13px;
      font-weight: 500;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 26px;
      padding: 0 10px;
      border-radius: 13px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      --mdc-icon-size: 14px;
    }
    .chip.on-time { background: var(--ik-success-fill); color: var(--ik-success-text); }
    .chip.late { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .open-col { width: 60px; text-align: end; }
    .icon-btn {
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      --mdc-icon-size: 20px;
    }
    .icon-btn:hover { background: var(--ik-subtle-fill); color: var(--primary-text-color); }
    .icon-btn:disabled { opacity: 0.4; cursor: default; }
    .pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 8px 12px;
      border-top: 1px solid var(--divider-color);
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .pagination select {
      padding: 4px 8px;
      border-radius: var(--ik-radius-field);
      border: 1px solid var(--divider-color);
      background: var(--ik-field-fill);
      color: var(--primary-text-color);
      font: inherit;
    }
    .empty { padding: 48px 24px; text-align: center; color: var(--secondary-text-color); }

    /* ── Narrow: the records listed by day ── */
    .days { display: flex; flex-direction: column; gap: 18px; }
    .group-header {
      margin: 0;
      padding: 0 4px 10px;
      font-size: var(--ik-group-header-size);
      font-weight: var(--ik-group-header-weight);
      letter-spacing: var(--ik-group-header-spacing);
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .group {
      padding: 0 4px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--ik-surface);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: 64px;
      padding: 8px 4px;
      box-sizing: border-box;
      border: none;
      background: none;
      color: inherit;
      text-align: start;
      cursor: pointer;
    }
    .row + .row { border-top: 1px solid var(--divider-color); }
    .row .ico { width: 40px; height: 40px; --mdc-icon-size: 20px; }
    .row .text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .row .title { display: flex; align-items: baseline; gap: 6px; min-width: 0; }
    .row .name {
      min-width: 0;
      font-size: var(--ik-row-title-size);
      font-weight: var(--ik-row-title-weight);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row .number { flex: none; }
    .meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px 6px;
      font-size: var(--ik-row-secondary-size);
      color: var(--secondary-text-color);
      --mdc-icon-size: 14px;
    }
    .timing { display: inline-flex; align-items: center; gap: 4px; font-weight: 500; }
    .timing.on-time { color: var(--ik-success-text); }
    .timing.late { color: var(--ik-error-text); }
    .chevron { flex: none; color: var(--secondary-text-color); --mdc-icon-size: 20px; }
    :host([narrow]) .pagination { justify-content: center; padding: 12px 0 0; border-top: none; }
  `;
__decorate([
    n({ attribute: false })
], IkTaskHistoryView.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], IkTaskHistoryView.prototype, "tasks", void 0);
__decorate([
    n({ type: Boolean, reflect: true })
], IkTaskHistoryView.prototype, "narrow", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_search", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_range", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_page", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_pageSize", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_areas", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_devices", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_selectedAreaIds", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_selectedDeviceIds", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_filterMode", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_showFilters", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_showColumns", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_columns", void 0);
IkTaskHistoryView = __decorate([
    t$3("ik-task-history-view")
], IkTaskHistoryView);

let IkSettingsView = class IkSettingsView extends i$3 {
    constructor() {
        super(...arguments);
        this.enableAnimations = true;
        this._showDeleteAllConfirm = false;
        this._deletingAll = false;
    }
    render() {
        const tr = t(this.hass?.language);
        return b `
      <ha-card>
        <div>
          <div class="toggle-row">
            <div>
              <div class="toggle-label">${tr.animationsLabel}</div>
              <div class="toggle-desc">${tr.animationsDesc}</div>
            </div>
            <label class="switch">
              <input type="checkbox"
                .checked=${this.enableAnimations}
                @change=${(e) => this.dispatchEvent(new CustomEvent("animations-changed", {
            detail: e.target.checked,
            bubbles: true, composed: true
        }))}
              />
              <span class="slider"></span>
            </label>
          </div>
          <div class="info-row">
            <span class="info-label">Available services</span>
            <span class="info-value">intellikeep.create_task, intellikeep.complete_task, intellikeep.delete_task, intellikeep.update_task</span>
          </div>
          <div class="info-row">
            <span class="info-label">HA Event</span>
            <span class="info-value">intellikeep_task_notification</span>
          </div>
          <div class="info-row">
            <span class="info-label">Storage location</span>
            <span class="info-value">.storage/intellikeep.json</span>
          </div>
          <div class="info-row">
            <span class="info-label">Sensors</span>
            <span class="info-value">sensor.tasks_due_today · sensor.tasks_overdue · sensor.next_due_task</span>
          </div>
          <div class="danger-zone">
            <h4>Danger zone</h4>
            <button class="btn-danger" ?disabled=${this._deletingAll} @click=${() => { this._showDeleteAllConfirm = true; }}>
              <ha-icon icon="mdi:delete-sweep"></ha-icon>
              ${tr.deleteAllBtn}
            </button>
          </div>
        </div>
        <ik-confirm-dialog
          .heading=${tr.deleteAllHeading}
          .open=${this._showDeleteAllConfirm}
          @dialog-closed=${async (e) => {
            this._showDeleteAllConfirm = false;
            if (!e.detail.confirmed)
                return;
            this._deletingAll = true;
            try {
                await deleteAllData(this.hass);
            }
            finally {
                this._deletingAll = false;
            }
        }}
        >${tr.deleteAllBody}</ik-confirm-dialog>
      </ha-card>
    `;
    }
};
IkSettingsView.styles = i$6 `
    :host { display: block; }
    ha-card {
      padding: 20px;
      box-shadow: none;
      border: none;
      background: transparent;
    }
    h3 { margin: 0 0 8px; font-size: 16px; }
    p { color: var(--secondary-text-color); font-size: 14px; line-height: 1.5; }
    .info-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-size: 13px; color: var(--secondary-text-color); min-width: 160px; }
    .info-value { font-size: 14px; color: var(--primary-text-color); font-weight: 500; }
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color);
    }
    .toggle-label {
      font-size: 14px;
      color: var(--primary-text-color);
    }
    .toggle-desc {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    /* Simple toggle switch */
    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 22px;
      flex-shrink: 0;
    }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute;
      inset: 0;
      background: var(--disabled-color, #ccc);
      border-radius: 22px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .slider::before {
      content: "";
      position: absolute;
      width: 16px;
      height: 16px;
      left: 3px;
      top: 3px;
      background: var(--text-primary-color);
      border-radius: 50%;
      transition: transform 0.2s;
    }
    input:checked + .slider { background: var(--primary-color); }
    input:checked + .slider::before { transform: translateX(18px); }
    .danger-zone {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--divider-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .danger-zone h4 {
      margin: 0 0 8px;
      font-size: 13px;
      font-weight: 600;
      color: var(--error-color, #f44336);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .btn-danger {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      background: var(--error-color, #f44336);
      color: var(--text-primary-color);
      --mdc-icon-size: 18px;
    }
    .btn-danger:disabled { opacity: 0.6; cursor: default; }
  `;
__decorate([
    n({ attribute: false })
], IkSettingsView.prototype, "hass", void 0);
__decorate([
    n({ type: Boolean })
], IkSettingsView.prototype, "enableAnimations", void 0);
__decorate([
    r()
], IkSettingsView.prototype, "_showDeleteAllConfirm", void 0);
__decorate([
    r()
], IkSettingsView.prototype, "_deletingAll", void 0);
IkSettingsView = __decorate([
    t$3("ik-settings-view")
], IkSettingsView);

const MODE_STORAGE_KEY = "intellikeep.calendar.mode";
const PRIORITY_STORAGE_KEY = "intellikeep.calendar.filterPriority";
const REPEATS_STORAGE_KEY = "intellikeep.calendar.showRepeats";
// Shared with task-list-view so area/device filters persist across views
const FILTER_AREAS_STORAGE_KEY = "intellikeep.filterAreas";
const FILTER_DEVICES_STORAGE_KEY = "intellikeep.filterDevices";
const FILTER_MODE_STORAGE_KEY = "intellikeep.filterMode";
const PRIORITIES = ["critical", "high", "medium", "low"];
/** Lines a month cell shows; with more tasks the last line becomes "+N more". */
const CELL_LINES = 3;
const DAY_MS = 86400000;
// Days are UTC midnights (see calendarDay): plain dates, so adding days ignores DST.
// Formatting one with DAY_ONLY shows that date whatever Home Assistant's time zone is.
const DAY_ONLY = { timeZone: "UTC" };
const addDays = (day, n) => new Date(day.getTime() + n * DAY_MS);
const dayKey = (day) => day.toISOString().slice(0, 10);
const sameDay = (a, b) => a.getTime() === b.getTime();
const rank = (event) => event.tone === "done" ? 2 : event.tone === "repeat" ? 1 : 0;
/** Open tasks, then future repeats, then completed ones; all-day before timed, then by time, then most important first. */
const compareEvents = (a, b) => rank(a) - rank(b)
    || Number(a.time !== null) - Number(b.time !== null)
    || (a.time && b.time ? a.time.getTime() - b.time.getTime() : 0)
    || PRIORITIES.indexOf(a.task.priority) - PRIORITIES.indexOf(b.task.priority)
    || a.task.task_number - b.task.task_number;
const loadStored = (key) => {
    try {
        return localStorage.getItem(key);
    }
    catch {
        return null;
    }
};
const store = (key, value) => {
    try {
        localStorage.setItem(key, value);
    }
    catch {
        // Storage blocked: the choice just isn't remembered
    }
};
const loadStoredList = (key) => {
    try {
        const parsed = JSON.parse(loadStored(key) ?? "[]");
        return Array.isArray(parsed) ? parsed.filter((value) => typeof value === "string") : [];
    }
    catch {
        return [];
    }
};
/**
 * The Calendar tab: tasks on their due days, laid out like Home Assistant's
 * calendar (Today, previous and next, the period, Month or Week). Clicking a
 * task opens it and clicking a day's empty space adds a task due that day.
 * Recurring tasks also show their future repeats, which the backend projects
 * for the period shown, as dashed outlines. The narrow layout shows a small month with dots and lists the chosen day's
 * tasks under it; its week is a list of days.
 */
let IkCalendarView = class IkCalendarView extends i$3 {
    constructor() {
        super(...arguments);
        this.tasks = [];
        this.narrow = false;
        this._mode = loadStored(MODE_STORAGE_KEY) === "week" ? "week" : "month";
        /** A day in the period shown. */
        this._ref = calendarDay(new Date(), undefined);
        /** Narrow month: the day whose tasks are listed under the grid. */
        this._selected = this._ref;
        this._showFilters = false;
        this._filterPriority = (() => {
            const stored = loadStored(PRIORITY_STORAGE_KEY);
            return PRIORITIES.includes(stored) ? stored : "all";
        })();
        this._filterMode = loadStored(FILTER_MODE_STORAGE_KEY) === "and" ? "and" : "or";
        this._selectedAreaIds = loadStoredList(FILTER_AREAS_STORAGE_KEY);
        this._selectedDeviceIds = loadStoredList(FILTER_DEVICES_STORAGE_KEY);
        this._areas = [];
        this._devices = [];
        this._showRepeats = loadStored(REPEATS_STORAGE_KEY) !== "false";
        /** Future repeats of the open recurring tasks around the period shown. */
        this._repeats = [];
        /** First and last day the repeats were last asked for, so they reload when the period changes. */
        this._repeatsSpan = "";
        /** Counts requests, so a slow answer for an earlier period doesn't replace a newer one. */
        this._repeatsRequest = 0;
    }
    connectedCallback() {
        super.connectedCallback();
        void this._loadRegistries();
    }
    willUpdate(changed) {
        // Open on today in Home Assistant's time zone, known once hass arrives
        if (changed.has("hass") && !changed.get("hass") && this.hass)
            this._go(this._today);
    }
    updated(changed) {
        if (!this.hass || !this._showRepeats)
            return;
        const [first, last] = this._shownDays();
        const span = `${dayKey(first)}|${dayKey(last)}`;
        // Completing or editing a task moves its repeats, and every change comes with a new task list
        if (span !== this._repeatsSpan || changed.has("tasks") || changed.has("_showRepeats")) {
            this._repeatsSpan = span;
            // Days are UTC midnights: a day more on each side covers any time zone
            void this._loadRepeats(addDays(first, -1), addDays(last, 2));
        }
    }
    async _loadRepeats(start, end) {
        const request = ++this._repeatsRequest;
        let repeats = [];
        try {
            repeats = await getRepeats(this.hass, start, end);
        }
        catch {
            // Backend without get_repeats yet (HA not restarted after an update): open occurrences only
        }
        if (request === this._repeatsRequest)
            this._repeats = repeats;
    }
    _setShowRepeats(show) {
        this._showRepeats = show;
        store(REPEATS_STORAGE_KEY, String(show));
    }
    async _loadRegistries() {
        try {
            const [areas, devices] = await Promise.all([
                this.hass.connection.sendMessagePromise({ type: "config/area_registry/list" }),
                this.hass.connection.sendMessagePromise({ type: "config/device_registry/list" }),
            ]);
            this._areas = areas.sort((a, b) => a.name.localeCompare(b.name));
            this._devices = devices.sort((a, b) => (a.name_by_user || a.name).localeCompare(b.name_by_user || b.name));
        }
        catch {
            // registries unavailable — area/device filters just won't work
        }
    }
    _onFilterChanged(e) {
        const { selectedAreaIds, selectedDeviceIds, filterMode } = e.detail;
        this._selectedAreaIds = selectedAreaIds;
        this._selectedDeviceIds = selectedDeviceIds;
        this._filterMode = filterMode;
        store(FILTER_MODE_STORAGE_KEY, filterMode);
        store(FILTER_AREAS_STORAGE_KEY, JSON.stringify(selectedAreaIds));
        store(FILTER_DEVICES_STORAGE_KEY, JSON.stringify(selectedDeviceIds));
    }
    _setPriority(priority) {
        this._filterPriority = priority;
        store(PRIORITY_STORAGE_KEY, priority);
    }
    _matchesLinkedFilters(task) {
        if (this._selectedAreaIds.length === 0 && this._selectedDeviceIds.length === 0)
            return true;
        const taskAreaIds = new Set(task.linked_entity_ids.filter(v => v.startsWith("area:")).map(v => v.slice(5)));
        const taskDeviceIds = new Set(task.linked_entity_ids.filter(v => v.startsWith("device:")).map(v => v.slice(7)));
        const matchesArea = this._selectedAreaIds.length === 0 ? null
            : this._selectedAreaIds.some(areaId => {
                if (taskAreaIds.has(areaId))
                    return true;
                return [...taskDeviceIds].some(deviceId => {
                    const dev = this._devices.find(d => d.id === deviceId);
                    return dev?.area_id === areaId;
                });
            });
        const matchesDevice = this._selectedDeviceIds.length === 0 ? null
            : this._selectedDeviceIds.some(deviceId => taskDeviceIds.has(deviceId));
        if (matchesArea === null)
            return Boolean(matchesDevice);
        if (matchesDevice === null)
            return matchesArea;
        return this._filterMode === "and" ? matchesArea && matchesDevice : matchesArea || matchesDevice;
    }
    _matchesFilters(task) {
        return (this._filterPriority === "all" || task.priority === this._filterPriority) && this._matchesLinkedFilters(task);
    }
    /** The filtered tasks and their future repeats by due day (YYYY-MM-DD), each day sorted. */
    _eventsByDay() {
        const byDay = new Map();
        const add = (task, due, tone) => {
            const event = { task, time: isMidnight(due, this.hass) ? null : new Date(due), tone };
            const key = dayKey(calendarDay(due, this.hass));
            const events = byDay.get(key);
            if (events)
                events.push(event);
            else
                byDay.set(key, [event]);
        };
        for (const task of this.tasks) {
            if (!task.due_date || !this._matchesFilters(task))
                continue;
            add(task, task.due_date, task.status === "completed" ? "done" : urgencyOf(task, this.hass));
        }
        if (this._showRepeats) {
            const byId = new Map(this.tasks.map(task => [task.task_id, task]));
            for (const repeat of this._repeats) {
                const task = byId.get(repeat.task_id);
                if (task && this._matchesFilters(task))
                    add(task, repeat.due_date, "repeat");
            }
        }
        for (const events of byDay.values())
            events.sort(compareEvents);
        return byDay;
    }
    get _today() {
        return calendarDay(new Date(), this.hass);
    }
    /** First day of the week holding `day`, following the profile's first weekday. */
    _weekStart(day) {
        return addDays(day, -((day.getUTCDay() - firstWeekday(this.hass) + 7) % 7));
    }
    /** First and last day on screen: the whole weeks of the month, or the week. */
    _shownDays() {
        if (this._mode === "week") {
            const start = this._weekStart(this._ref);
            return [start, addDays(start, 6)];
        }
        const days = this._monthDays();
        return [days[0], days[days.length - 1]];
    }
    /** Whole weeks covering the month shown. */
    _monthDays() {
        const year = this._ref.getUTCFullYear();
        const month = this._ref.getUTCMonth();
        const start = this._weekStart(new Date(Date.UTC(year, month, 1)));
        const last = new Date(Date.UTC(year, month + 1, 0));
        const weeks = Math.ceil(((last.getTime() - start.getTime()) / DAY_MS + 1) / 7);
        return Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
    }
    _go(day) {
        this._ref = day;
        this._selected = day;
    }
    _navigate(delta) {
        const ref = this._ref;
        this._go(this._mode === "week"
            ? addDays(ref, 7 * delta)
            : new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth() + delta, 1)));
    }
    _setMode(mode) {
        this._mode = mode;
        this._ref = this._selected;
        store(MODE_STORAGE_KEY, mode);
    }
    _showWeek(day) {
        this._go(day);
        this._setMode("week");
    }
    _openTask(request) {
        this.dispatchEvent(new CustomEvent("open-task", { detail: request, bubbles: true, composed: true }));
    }
    _addOn(day) {
        this._openTask({ taskId: null, dueDate: dayKey(day) });
    }
    _periodLabel() {
        let label;
        if (this._mode === "month") {
            label = formatDate(this._ref, this.hass, { ...DAY_ONLY, day: undefined, month: "long" });
        }
        else {
            const start = this._weekStart(this._ref);
            label = formatDateRange(start, addDays(start, 6), this.hass, DAY_ONLY);
        }
        return label.charAt(0).toUpperCase() + label.slice(1);
    }
    _weekdayLabel(day, weekday) {
        return formatDate(day, this.hass, { ...DAY_ONLY, weekday, year: undefined, month: undefined, day: undefined })
            .replace(/\.$/, "");
    }
    /** "Tuesday, October 20", with the year only when it isn't the current one. */
    _dayLabel(day) {
        const year = day.getUTCFullYear() === this._today.getUTCFullYear() ? undefined : "numeric";
        return formatDate(day, this.hass, { ...DAY_ONLY, weekday: "long", month: "long", year });
    }
    _criticalMark(event, tr) {
        return event.task.priority === "critical" && event.tone !== "done"
            ? b `<ha-icon class="critical" icon=${PRIORITY_ICON.critical} role="img" aria-label=${tr.critical}></ha-icon>`
            : A;
    }
    /** Marks a future repeat; opening one opens the task's open occurrence. */
    _repeatMark(tr, className = "") {
        return b `<ha-icon class=${className} icon="mdi:repeat" role="img" aria-label=${tr.futureRepeat}></ha-icon>`;
    }
    _renderChip(event, tr) {
        const { task, time, tone } = event;
        return b `
      <button
        class="event ${time ? "timed" : "all-day"} ${tone ?? ""}"
        title=${tone === "repeat" ? `${task.name} · ${tr.futureRepeat}` : task.name}
        @click=${(e) => { e.stopPropagation(); this._openTask({ taskId: task.task_id }); }}
      >
        ${tone === "done"
            ? b `<ha-icon class="mark" icon="mdi:check"></ha-icon>`
            : tone === "repeat" ? this._repeatMark(tr, "mark")
                : time ? b `<span class="dot"></span>` : A}
        ${time ? b `<span class="time">${formatTime(time, this.hass)}</span>` : A}
        ${this._criticalMark(event, tr)}
        <span class="name">${task.name}</span>
      </button>
    `;
    }
    _renderMonth(byDay, tr) {
        const today = this._today;
        const days = this._monthDays();
        const month = this._ref.getUTCMonth();
        return b `
      <div class="month" style="--weeks: ${days.length / 7}">
        ${days.slice(0, 7).map(day => b `<div class="weekday">${this._weekdayLabel(day, "short")}</div>`)}
        ${days.map(day => {
            const events = byDay.get(dayKey(day)) ?? [];
            const shown = events.length > CELL_LINES ? events.slice(0, CELL_LINES - 1) : events;
            return b `
            <div class="cell ${day.getUTCMonth() !== month ? "other" : ""}" @click=${() => this._addOn(day)}>
              <span class="day-num ${sameDay(day, today) ? "today" : ""}">${day.getUTCDate()}</span>
              ${shown.map(event => this._renderChip(event, tr))}
              ${events.length > shown.length ? b `
                <button class="more" @click=${(e) => { e.stopPropagation(); this._showWeek(day); }}>
                  ${tr.moreTasks(events.length - shown.length)}
                </button>
              ` : A}
            </div>
          `;
        })}
      </div>
    `;
    }
    _renderBlock(event, tr) {
        const { task, time, tone } = event;
        return b `
      <button class="block ${tone ?? ""}" @click=${(e) => { e.stopPropagation(); this._openTask({ taskId: task.task_id }); }}>
        <span class="block-time">
          ${tone === "done" ? b `<ha-icon icon="mdi:check"></ha-icon>` : tone === "repeat" ? this._repeatMark(tr) : A}${time ? formatTime(time, this.hass) : tr.allDay}
        </span>
        <span class="block-name">${this._criticalMark(event, tr)}${task.name}</span>
      </button>
    `;
    }
    _renderWeek(byDay, tr) {
        const today = this._today;
        const start = this._weekStart(this._ref);
        const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
        return b `
      <div class="week">
        ${days.map(day => b `
          <div class="week-head">
            <span class="weekday">${this._weekdayLabel(day, "short")}</span>
            <span class="day-num ${sameDay(day, today) ? "today" : ""}">${day.getUTCDate()}</span>
          </div>
        `)}
        ${days.map(day => b `
          <div class="week-col" @click=${() => this._addOn(day)}>
            ${(byDay.get(dayKey(day)) ?? []).map(event => this._renderBlock(event, tr))}
          </div>
        `)}
      </div>
    `;
    }
    /** A narrow list row: icon, name, then "19:14 · High · Monthly" ("· Future repeat" for a repeat). */
    _renderRow(event, tr) {
        const { task, time, tone } = event;
        const dot = b `<span aria-hidden="true">·</span>`;
        let when;
        if (tone === "done") {
            when = tr.listCompleted;
        }
        else if (tone === "overdue") {
            const days = -daysUntil(new Date(task.due_date), this.hass);
            when = days > 0 ? tr.daysOverdue(days) : tr.overdue;
        }
        else {
            when = time ? formatTime(time, this.hass) : tr.allDay;
        }
        const repeat = tone === "repeat" ? tr.futureRepeat : repeatLabel(task, this.hass, true);
        return b `
      <button class="row ${tone ?? ""}" @click=${() => this._openTask({ taskId: task.task_id })}>
        <span class="icon" aria-hidden="true">
          <ha-icon icon=${tone === "done" ? "mdi:check" : task.icon || "mdi:wrench-outline"}></ha-icon>
        </span>
        <span class="text">
          <span class="name">${task.name}</span>
          <span class="meta">
            <span class="meta-item when">${when}</span>${dot}
            <span class="meta-item ${task.priority}">
              <ha-icon icon=${PRIORITY_ICON[task.priority] ?? PRIORITY_ICON.medium}></ha-icon>${tr[task.priority] ?? task.priority}
            </span>
            ${repeat ? b `${dot}<span class="meta-item"><ha-icon icon="mdi:repeat"></ha-icon>${repeat}</span>` : A}
          </span>
        </span>
        <ha-icon class="chevron" icon="mdi:chevron-right"></ha-icon>
      </button>
    `;
    }
    _renderDay(day, events, tr) {
        return b `
      <section>
        <h2 class="group-header ${sameDay(day, this._today) ? "today" : ""}">${this._dayLabel(day)}</h2>
        <div class="group">
          ${events.length ? events.map(event => this._renderRow(event, tr)) : b `<div class="empty">${tr.noTasksDay}</div>`}
        </div>
      </section>
    `;
    }
    _renderMiniMonth(byDay, tr) {
        const today = this._today;
        const days = this._monthDays();
        const month = this._ref.getUTCMonth();
        const select = (day) => {
            // A day of the next or previous month brings that month in
            if (day.getUTCMonth() !== month)
                this._ref = day;
            this._selected = day;
        };
        return b `
      <div class="mini">
        ${days.slice(0, 7).map(day => b `<div class="weekday" aria-hidden="true">${this._weekdayLabel(day, "narrow")}</div>`)}
        ${days.map(day => b `
          <button
            class="mini-day ${day.getUTCMonth() !== month ? "other" : ""}"
            aria-pressed=${sameDay(day, this._selected) ? "true" : "false"}
            aria-label=${this._dayLabel(day)}
            @click=${() => select(day)}
          >
            <span class="day-num ${sameDay(day, today) ? "today" : ""}">${day.getUTCDate()}</span>
            <span class="dots">
              ${(byDay.get(dayKey(day)) ?? []).slice(0, 3).map(event => b `<span class="dot ${event.tone ?? ""}"></span>`)}
            </span>
          </button>
        `)}
      </div>
      <div class="agenda">${this._renderDay(this._selected, byDay.get(dayKey(this._selected)) ?? [], tr)}</div>
    `;
    }
    _renderWeekList(byDay, tr) {
        const start = this._weekStart(this._ref);
        const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
            .filter(day => byDay.has(dayKey(day)));
        return b `
      <div class="agenda">
        ${days.length
            ? days.map(day => this._renderDay(day, byDay.get(dayKey(day)), tr))
            : b `<div class="group empty">${tr.noTasksWeek}</div>`}
      </div>
    `;
    }
    _renderToolbar(tr, activeFilterCount) {
        const segment = (mode, label) => b `
      <button class="segment" aria-pressed=${this._mode === mode ? "true" : "false"} @click=${() => this._setMode(mode)}>${label}</button>
    `;
        const views = b `
      <div class="segmented" role="group" aria-label=${tr.calendarViewLabel}>
        ${segment("month", tr.calendarMonth)}${segment("week", tr.calendarWeek)}
      </div>
    `;
        const today = b `<button class="today-btn" @click=${() => this._go(this._today)}>${tr.calendarToday}</button>`;
        const step = (delta, label, icon) => b `
      <button class="round" aria-label=${label} title=${label} @click=${() => this._navigate(delta)}>
        <ha-icon icon=${icon}></ha-icon>
      </button>
    `;
        const prev = step(-1, tr.calendarPrevious, "mdi:chevron-left");
        const next = step(1, tr.calendarNext, "mdi:chevron-right");
        const period = b `<h2 class="period" aria-live="polite">${this._periodLabel()}</h2>`;
        const expanded = this._showFilters ? "true" : "false";
        const toggleFilters = () => { this._showFilters = !this._showFilters; };
        const count = activeFilterCount ? b `<span class="count">${activeFilterCount}</span>` : A;
        if (this.narrow) {
            return b `
        <div class="toolbar">
          ${views}
          <span class="spacer"></span>
          ${today}
          <button class="icon-pill" aria-label=${tr.filters} title=${tr.filters} aria-expanded=${expanded} @click=${toggleFilters}>
            <ha-icon icon="mdi:filter-variant"></ha-icon>${count}
          </button>
        </div>
        <div class="period-row">${prev}${period}${next}</div>
      `;
        }
        return b `
      <div class="toolbar">
        ${today}${prev}${next}${period}
        <button class="pill" aria-expanded=${expanded} @click=${toggleFilters}>
          <ha-icon icon="mdi:filter-variant"></ha-icon>${tr.filters}${count}
        </button>
        ${views}
        <button class="add" @click=${() => this._openTask({ taskId: null })}>
          <ha-icon icon="mdi:plus"></ha-icon>${tr.addTask}
        </button>
      </div>
    `;
    }
    render() {
        const tr = t(this.hass?.language);
        const byDay = this._eventsByDay();
        const activeFilterCount = this._selectedAreaIds.length + this._selectedDeviceIds.length + (this._filterPriority !== "all" ? 1 : 0);
        let body;
        if (this.narrow)
            body = this._mode === "month" ? this._renderMiniMonth(byDay, tr) : this._renderWeekList(byDay, tr);
        else
            body = this._mode === "month" ? this._renderMonth(byDay, tr) : this._renderWeek(byDay, tr);
        return b `
      ${this._renderToolbar(tr, activeFilterCount)}
      <div class="filters">
        ${this._showFilters ? b `
          <div class="filter-row">
            <label class="priority-filter">
              ${tr.priority}
              <select .value=${this._filterPriority} @change=${(e) => this._setPriority(e.target.value)}>
                <option value="all">${tr.allPriorities}</option>
                ${PRIORITIES.map(p => b `<option value=${p} ?selected=${p === this._filterPriority}>${tr[p]}</option>`)}
              </select>
            </label>
            <label class="switch-row">
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${this._showRepeats ? "true" : "false"}
                @click=${() => this._setShowRepeats(!this._showRepeats)}
              ></button>
              ${tr.showFutureRepeats}
            </label>
          </div>
        ` : A}
        <ik-link-filter
          .hass=${this.hass}
          .areas=${this._areas}
          .devices=${this._devices}
          .selectedAreaIds=${this._selectedAreaIds}
          .selectedDeviceIds=${this._selectedDeviceIds}
          .filterMode=${this._filterMode}
          ?open=${this._showFilters}
          @filter-changed=${(e) => this._onFilterChanged(e)}
        ></ik-link-filter>
      </div>
      <div class="body">${body}</div>
      ${this.narrow ? b `
        <button
          class="fab"
          @click=${() => this._openTask(this._mode === "month" ? { taskId: null, dueDate: dayKey(this._selected) } : { taskId: null })}
        >
          <ha-icon icon="mdi:plus"></ha-icon>${tr.addTask}
        </button>
      ` : A}
    `;
    }
};
IkCalendarView.styles = i$6 `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--ik-padding, 20px) var(--ik-padding, 20px) 0;
      box-sizing: border-box;
      --ik-repeat-outline: color-mix(in srgb, var(--primary-color) 55%, transparent);
    }
    button { font: inherit; }
    button:focus-visible, select:focus-visible {
      outline: 2px solid var(--ik-focus-ring);
      outline-offset: 2px;
    }
    .toolbar, .period-row, .filters, .month, .week, .mini, .agenda {
      width: 100%;
      max-width: 1120px;
      margin-inline: auto;
      box-sizing: border-box;
    }

    /* ── Toolbar ── */
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 12px;
      padding-bottom: 16px;
    }
    .today-btn {
      height: 40px;
      padding: 0 18px;
      border: none;
      border-radius: var(--ik-radius-pill);
      background: var(--ik-primary-fill);
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
    }
    .today-btn:hover { background: color-mix(in srgb, var(--primary-color) 26%, transparent); }
    .round {
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      flex: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--primary-text-color);
      cursor: pointer;
      --mdc-icon-size: 24px;
    }
    .round:hover { background: var(--ik-subtle-fill); }
    .toolbar .round + .round { margin-inline-start: -8px; }
    .period {
      flex: 1 1 auto;
      min-width: 0;
      margin: 0;
      font-size: 20px;
      font-weight: 400;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count {
      display: inline-block;
      min-width: 8px;
      padding: 1px 7px;
      border-radius: 9px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    .segmented {
      display: inline-flex;
      gap: 2px;
      padding: 2px;
      border-radius: 21px;
      border: 1px solid var(--divider-color);
      background: var(--ik-surface);
    }
    .segment {
      height: 38px;
      padding: 0 16px;
      border: none;
      border-radius: 19px;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .segment:hover { color: var(--primary-text-color); }
    .segment[aria-pressed="true"] { background: var(--ik-primary-fill); color: var(--primary-color); }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 16px;
      border-radius: var(--ik-radius-pill);
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .pill:hover { background: var(--ik-subtle-fill); }
    .pill[aria-expanded="true"] { border-color: var(--primary-color); color: var(--primary-color); }
    .add {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      height: 40px;
      padding: 0 20px 0 16px;
      border: none;
      border-radius: var(--ik-radius-pill);
      background: var(--primary-color);
      color: var(--text-primary-color);
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
    .add:hover { filter: brightness(1.08); }
    .spacer { flex: 1; }
    .icon-pill {
      position: relative;
      width: var(--ik-hit-target);
      height: var(--ik-hit-target);
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border-radius: 50%;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      --mdc-icon-size: 20px;
    }
    .icon-pill:hover { background: var(--ik-subtle-fill); }
    .icon-pill[aria-expanded="true"] { border-color: var(--primary-color); color: var(--primary-color); }
    .icon-pill .count { position: absolute; top: -4px; inset-inline-end: -4px; }
    .period-row {
      display: flex;
      align-items: center;
      gap: 4px;
      padding-bottom: 12px;
    }
    .period-row .period { text-align: center; font-size: 18px; }
    .fab {
      position: fixed;
      right: calc(16px + env(safe-area-inset-right));
      bottom: calc(16px + env(safe-area-inset-bottom));
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      height: 52px;
      padding: 0 22px 0 18px;
      border: none;
      border-radius: 26px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.32);
      --mdc-icon-size: 22px;
    }
    .fab:hover { filter: brightness(1.08); }
    .filters { padding-bottom: 8px; }
    .priority-filter {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
    }
    .filter-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 24px;
      padding-bottom: 8px;
    }
    .filter-row .priority-filter { padding-bottom: 0; }
    .switch-row {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-height: var(--ik-hit-target);
      font-size: 13px;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .switch {
      width: 44px;
      height: 26px;
      flex: none;
      display: flex;
      padding: 3px;
      border: none;
      border-radius: 13px;
      background: var(--divider-color);
      cursor: pointer;
      transition: background 0.15s;
    }
    .switch::after {
      content: "";
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--text-primary-color);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      transition: transform 0.15s;
    }
    .switch[aria-checked="true"] { background: var(--primary-color); }
    .switch[aria-checked="true"]::after { transform: translateX(18px); }
    .priority-filter select {
      padding: 5px 10px;
      border-radius: var(--ik-radius-field);
      border: 1px solid var(--divider-color);
      background: var(--ik-field-fill);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 13px;
    }

    .body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      padding-bottom: 24px;
    }
    /* Room for the floating Add task button under the last row */
    :host([narrow]) .body { padding-bottom: 88px; }

    /* ── Month and week grids: 1px gaps over a divider-colored background draw the lines ── */
    .month, .week {
      flex: 1 0 auto;
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      gap: 1px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--divider-color);
      overflow: hidden;
    }
    /* The panel grows with its content, so the grid asks for the screen height left under the toolbar */
    .month, .week { min-height: calc(100vh - 210px); }
    .month { grid-template-rows: auto repeat(var(--weeks), minmax(108px, 1fr)); }
    .week { grid-template-rows: auto minmax(360px, 1fr); }
    .weekday {
      padding: 10px 4px;
      background: var(--ik-surface);
      text-align: center;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: var(--ik-group-header-spacing);
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .day-num {
      width: 26px;
      height: 26px;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: center;
      border-radius: 50%;
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .day-num.today { background: var(--primary-color); color: var(--text-primary-color); }
    .other .day-num:not(.today) { color: var(--secondary-text-color); opacity: 0.6; }
    .cell, .week-col {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      background: var(--ik-surface);
      cursor: pointer;
    }
    .cell { padding: 4px 4px 6px; }
    .cell:hover, .week-col:hover { background: color-mix(in srgb, var(--primary-text-color) 3%, var(--ik-surface)); }
    .critical { flex: none; color: var(--ik-error-text); }

    /* Month: a dot and the time for timed tasks, a tinted bar for all-day ones, as in HA's calendar */
    .event {
      display: flex;
      align-items: center;
      gap: 5px;
      width: 100%;
      min-width: 0;
      height: 22px;
      padding: 0 6px;
      box-sizing: border-box;
      border: none;
      border-radius: 6px;
      background: none;
      color: var(--primary-text-color);
      font-size: 12px;
      text-align: start;
      cursor: pointer;
      --mdc-icon-size: 14px;
    }
    .event:hover .name { text-decoration: underline; }
    .event .name {
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 500;
    }
    .event .time { flex: none; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
    .event .dot {
      width: 8px;
      height: 8px;
      flex: none;
      border-radius: 50%;
      background: var(--primary-color);
    }
    .event.overdue .dot { background: var(--error-color); }
    .event.overdue .time { color: var(--ik-error-text); }
    .event.today .dot { background: var(--warning-color); }
    .event.today .time { color: var(--ik-warning-text); }
    .event.all-day { background: var(--ik-primary-fill); }
    .event.all-day.overdue { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .event.all-day.today { background: var(--ik-warning-fill); color: var(--ik-warning-text); }
    .event.done { background: none; color: var(--secondary-text-color); }
    .event.done .name { font-weight: 400; }
    .event .mark { flex: none; color: var(--ik-success-text); }
    /* Future repeats are dashed outlines in secondary text: there is no task yet, only the date it will have */
    .event.repeat { color: var(--secondary-text-color); }
    .event.repeat .name { font-weight: 400; }
    .event.repeat .mark { color: var(--secondary-text-color); }
    .event.all-day.repeat { background: none; border: 1px dashed var(--ik-repeat-outline); }
    .more {
      align-self: flex-start;
      padding: 2px 6px;
      border: none;
      border-radius: 6px;
      background: none;
      color: var(--secondary-text-color);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
    }
    .more:hover { background: var(--ik-subtle-fill); color: var(--primary-text-color); }

    /* Week: one column per day, each task a tinted block */
    .week-head {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 4px;
      background: var(--ik-surface);
    }
    .week-head .weekday { padding: 0; }
    .week-head .day-num { width: 36px; height: 36px; font-size: 20px; font-weight: 400; }
    .week-col { gap: 6px; padding: 8px 6px; }
    .block {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;
      padding: 6px 8px;
      box-sizing: border-box;
      border: none;
      border-radius: 8px;
      background: var(--ik-primary-fill);
      color: var(--primary-text-color);
      text-align: start;
      cursor: pointer;
      --mdc-icon-size: 14px;
    }
    .block.overdue { background: var(--ik-error-fill); }
    .block.today { background: var(--ik-warning-fill); }
    .block.done { background: var(--ik-subtle-fill); color: var(--secondary-text-color); }
    .block.repeat {
      padding: 5px 7px;
      border: 1px dashed var(--ik-repeat-outline);
      background: none;
      color: var(--secondary-text-color);
    }
    .block.repeat .block-name { font-weight: 400; }
    .block:hover .block-name { text-decoration: underline; }
    .block-time {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .block.overdue .block-time { color: var(--ik-error-text); }
    .block.today .block-time { color: var(--ik-warning-text); }
    .block.done .block-time ha-icon { color: var(--ik-success-text); }
    .block-name {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }
    .block-name .critical { vertical-align: -2px; margin-inline-end: 3px; }

    /* ── Narrow: small month with dots ── */
    .mini {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
      padding: 4px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--ik-surface);
    }
    .mini .weekday { padding: 6px 0 2px; background: none; letter-spacing: 0; }
    .mini-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      min-width: 0;
      height: 50px;
      padding: 5px 0 0;
      border: none;
      border-radius: 12px;
      background: none;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .mini-day .day-num { width: 30px; height: 30px; font-size: 14px; }
    .mini-day[aria-pressed="true"] { background: var(--ik-primary-fill); }
    .dots { display: flex; gap: 3px; height: 6px; }
    .dots .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary-color); }
    .dots .dot.overdue { background: var(--error-color); }
    .dots .dot.today { background: var(--warning-color); }
    .dots .dot.done { background: var(--secondary-text-color); opacity: 0.6; }
    .dots .dot.repeat { background: none; box-shadow: inset 0 0 0 1.5px var(--primary-color); }

    /* ── Narrow: the chosen day, or the week, as a list ── */
    .agenda {
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding-top: 18px;
    }
    .group-header {
      margin: 0;
      padding: 0 4px 10px;
      font-size: var(--ik-group-header-size);
      font-weight: var(--ik-group-header-weight);
      letter-spacing: var(--ik-group-header-spacing);
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .group-header.today { color: var(--primary-color); }
    .group {
      padding: 0 4px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-card);
      background: var(--ik-surface);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      min-height: 64px;
      padding: 8px 4px;
      box-sizing: border-box;
      border: none;
      background: none;
      color: inherit;
      text-align: start;
      cursor: pointer;
    }
    .row + .row { border-top: 1px solid var(--divider-color); }
    .row .icon {
      width: 40px;
      height: 40px;
      box-sizing: border-box;
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--ik-subtle-fill);
      color: var(--primary-text-color);
      --mdc-icon-size: 20px;
    }
    .row.overdue .icon { background: var(--ik-error-fill); color: var(--ik-error-text); }
    .row.today .icon { background: var(--ik-warning-fill); color: var(--ik-warning-text); }
    .row.done .icon { background: var(--ik-success-fill); color: var(--ik-success-text); }
    .row.repeat .icon { background: none; border: 1px dashed var(--ik-repeat-outline); color: var(--secondary-text-color); }
    .row .text { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .row .name {
      font-size: var(--ik-row-title-size);
      font-weight: var(--ik-row-title-weight);
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .row.done .name, .row.repeat .name { color: var(--secondary-text-color); }
    .meta {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px 6px;
      font-size: var(--ik-row-secondary-size);
      color: var(--secondary-text-color);
      --mdc-icon-size: 14px;
    }
    .meta-item { display: inline-flex; align-items: center; gap: 4px; }
    .row.overdue .when { color: var(--ik-error-text); font-weight: 500; }
    .row.today .when { color: var(--ik-warning-text); font-weight: 500; }
    .row.done .when { color: var(--ik-success-text); font-weight: 500; }
    .meta .high ha-icon { color: var(--primary-text-color); }
    .meta .critical ha-icon { color: var(--ik-error-text); }
    .chevron { flex: none; color: var(--secondary-text-color); --mdc-icon-size: 20px; }
    .empty {
      padding: 20px 16px;
      text-align: center;
      font-size: 14px;
      color: var(--secondary-text-color);
    }
  `;
__decorate([
    n({ attribute: false })
], IkCalendarView.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], IkCalendarView.prototype, "tasks", void 0);
__decorate([
    n({ type: Boolean, reflect: true })
], IkCalendarView.prototype, "narrow", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_mode", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_ref", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_selected", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_showFilters", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_filterPriority", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_filterMode", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_selectedAreaIds", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_selectedDeviceIds", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_areas", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_devices", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_showRepeats", void 0);
__decorate([
    r()
], IkCalendarView.prototype, "_repeats", void 0);
IkCalendarView = __decorate([
    t$3("ik-calendar-view")
], IkCalendarView);

const MDI_COG_OUTLINE = "M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z";
const MDI_MAGNIFY = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z";
const MDI_CLOSE = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";
// HA passes hass + panel + route to panel elements automatically.
let IntelliKeepPanel = class IntelliKeepPanel extends i$3 {
    constructor() {
        super(...arguments);
        this.narrow = false;
        this._tasks = [];
        this._currentPath = "/tasks";
        this._returnPath = "/tasks";
        this._loading = true;
        this._enableAnimations = true;
        this._modalStack = [];
        this._showSettings = false;
        /** Form tab, copied task and due day for the next form opened (see OpenTaskRequest). */
        this._formTab = "edit";
        this._formTemplate = null;
        this._formDueDate = "";
        /** The panel is under 600px wide, even if HA isn't narrow (a docked sidebar on a small window). */
        this._smallWidth = false;
        /** Tasks tab search text; narrow layouts type it in the app bar. */
        this._taskSearch = "";
        this._searchOpen = false;
        /** Where keyboard focus was before the task dialog opened, to give it back on close. */
        this._focusBeforeDialog = null;
    }
    async connectedCallback() {
        super.connectedCallback();
        this._resizeObserver = new ResizeObserver((entries) => {
            this._smallWidth = entries[0].contentRect.width < 600;
        });
        this._resizeObserver.observe(this);
        this._enableAnimations = localStorage.getItem("intellikeep.animations") !== "false";
        await this._subscribe();
        this._restoreRoute();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._unsubscribe)
            this._unsubscribe();
        this._resizeObserver?.disconnect();
    }
    /** Phone layout: HA's narrow flag, or a panel under 600px wide. */
    get _narrowLayout() {
        return this.narrow || this._smallWidth;
    }
    willUpdate() {
        this.toggleAttribute("narrow-layout", this._narrowLayout);
    }
    async _subscribe() {
        try {
            this._unsubscribe = await subscribeTasks(this.hass, (tasks) => {
                this._tasks = tasks;
                this._loading = false;
            });
        }
        catch {
            this._loading = false;
        }
    }
    _restoreRoute() {
        const hash = location.hash.replace("#", "") || "/tasks";
        this._currentPath = hash;
    }
    _navigate(path) {
        if (path.startsWith("/edit/") || path === "/new") {
            this._returnPath = this._currentPath;
        }
        this._currentPath = path;
        this._formTab = "edit";
        this._formTemplate = null;
        this._formDueDate = "";
        history.replaceState(null, "", location.pathname + "#" + path);
    }
    updated(changed) {
        if (changed.has("_searchOpen") && this._searchOpen) {
            this.renderRoot.querySelector(".appbar-search")?.focus();
        }
        if (!changed.has("_modalStack"))
            return;
        const wasOpen = (changed.get("_modalStack") ?? []).length > 0;
        if (this._modalStack.length > 0 && !wasOpen) {
            this.renderRoot.querySelector(".task-dialog")?.focus();
        }
        else if (this._modalStack.length === 0 && wasOpen) {
            this._focusBeforeDialog?.focus();
            this._focusBeforeDialog = null;
        }
    }
    _openModal(top) {
        if (this._modalStack.length === 0) {
            let active = document.activeElement;
            while (active?.shadowRoot?.activeElement)
                active = active.shadowRoot.activeElement;
            this._focusBeforeDialog = active;
        }
        this._modalStack = [top];
    }
    /** Opens the task form as a dialog on desktop, or as its own page on touch devices (after _navigate's reset). */
    _openTask(request) {
        if (isDesktop()) {
            this._openModal(request.taskId ?? "__new__");
        }
        else {
            this._navigate(request.taskId ? `/edit/${request.taskId}` : "/new");
        }
        this._formTab = request.tab ?? "edit";
        this._formTemplate = request.template ?? null;
        this._formDueDate = request.dueDate ?? "";
    }
    _closeSearch() {
        this._searchOpen = false;
        this._taskSearch = "";
    }
    /** Tab links: plain clicks switch tabs in place, modified clicks open a new browser tab. */
    _onTabClick(e, path) {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
            return;
        e.preventDefault();
        this._navigate(path);
    }
    _getEditTask() {
        const match = this._currentPath.match(/^\/edit\/(.+)$/);
        if (!match)
            return null;
        return this._tasks.find((t) => t.task_id === match[1]) ?? null;
    }
    _renderTaskDialog() {
        const tr = t(this.hass?.language);
        const top = this._modalStack[this._modalStack.length - 1];
        const task = top === "__new__" ? null : (this._tasks.find((t) => t.task_id === top) ?? null);
        const close = () => { this._modalStack = []; };
        return b `
      <div
        class="modal-overlay"
        @click=${(e) => { if (e.target === e.currentTarget)
            close(); }}
        @keydown=${(e) => { if (e.key === "Escape")
            close(); }}
      >
        <div class="modal-container task-dialog" role="dialog" aria-modal="true" aria-label=${task?.name ?? tr.newTaskTitle} tabindex="-1">
          ${i(`${top}|${this._formTemplate?.task_id ?? ""}|${this._formDueDate}`, b `
            <ik-task-form-view
              .hass=${this.hass}
              .task=${task}
              .tasks=${this._tasks}
              .template=${this._formTemplate}
              .dueDate=${this._formDueDate}
              .initialTab=${this._formTab}
              .enableAnimations=${this._enableAnimations}
              @navigate=${(e) => { e.stopPropagation(); close(); }}
              @open-task=${(e) => { e.stopPropagation(); this._openTask(e.detail); }}
            ></ik-task-form-view>
          `)}
        </div>
      </div>
    `;
    }
    render() {
        const path = this._currentPath;
        const tr = t(this.hass?.language);
        const isMobile = !isDesktop();
        const isNew = path === "/new";
        const isEdit = path.startsWith("/edit/");
        const isSettings = path === "/settings";
        const isHistory = path === "/history";
        const isCalendar = path === "/calendar";
        const isTasks = !isNew && !isEdit && !isSettings && !isHistory && !isCalendar;
        const showTabs = isTasks || isHistory || isCalendar;
        const isFormPage = (isNew || isEdit) && !this._loading;
        // The form page has its own close button and title; phones give it the whole screen
        const showAppbar = !(isMobile && isFormPage);
        const narrow = this._narrowLayout;
        const searchInAppbar = narrow && isTasks;
        const searchOpen = searchInAppbar && (this._searchOpen || this._taskSearch !== "");
        return b `
      ${showAppbar ? b `<div class="appbar">
        ${isMobile && (isNew || isEdit || isSettings) ? b `
          <ha-icon-button class="appbar-back" .label=${tr.back} @click=${() => this._navigate(this._returnPath)} path="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z">
          </ha-icon-button>
        ` : b `<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>`}
        ${searchOpen ? b `
          <input
            class="appbar-search"
            type="search"
            .value=${this._taskSearch}
            placeholder=${tr.searchPlaceholder}
            aria-label=${tr.searchPlaceholder}
            @input=${(e) => { this._taskSearch = e.target.value; }}
            @keydown=${(e) => { if (e.key === "Escape")
            this._closeSearch(); }}
          />
        ` : b `
          <span class="appbar-title">${isMobile && (isNew || isEdit || isSettings)
            ? isNew ? tr.newTaskTitle
                : isSettings ? tr.settingsTitle
                    : (() => { const t2 = this._getEditTask(); return t2?.task_number ? `${tr.editTask} #${String(t2.task_number).padStart(3, "0")}` : tr.editTask; })()
            : "IntelliKeep"}</span>
        `}
        <div class="appbar-actions">
          ${searchInAppbar ? b `
            <ha-icon-button
              class="appbar-back"
              .label=${searchOpen ? tr.closeSearch : tr.searchPlaceholder}
              .path=${searchOpen ? MDI_CLOSE : MDI_MAGNIFY}
              @click=${() => { if (searchOpen)
            this._closeSearch();
        else
            this._searchOpen = true; }}
            ></ha-icon-button>
          ` : A}
          ${showTabs && !searchOpen ? b `
            <ha-icon-button class="appbar-back" .label=${tr.settings} @click=${() => {
            if (isMobile) {
                this._navigate("/settings");
            }
            else {
                this._showSettings = true;
            }
        }} .path=${MDI_COG_OUTLINE}>
            </ha-icon-button>
          ` : A}
        </div>
      </div>` : A}

      <div class="content"
        @navigate=${(e) => this._navigate(e.detail)}
        @open-task=${(e) => this._openTask(e.detail)}>
        ${showTabs ? b `
          <nav class="tabs" aria-label=${tr.navLabel}>
            ${[["/tasks", tr.tasks, isTasks], ["/calendar", tr.calendarNavTab, isCalendar], ["/history", tr.historyNavTab, isHistory]].map(([tabPath, label, active]) => b `
              <a
                class="tab"
                href="#${tabPath}"
                aria-current=${active ? "page" : "false"}
                @click=${(e) => this._onTabClick(e, tabPath)}
              >${label}</a>
            `)}
          </nav>
        ` : A}
        ${isTasks && !this._loading
            ? b `
              <ik-task-list-view
                .hass=${this.hass}
                .tasks=${this._tasks}
                .enableAnimations=${this._enableAnimations}
                .narrow=${narrow}
                .searchQuery=${this._taskSearch}
                @search-changed=${(e) => { this._taskSearch = e.detail; }}
              ></ik-task-list-view>
            `
            : isCalendar && !this._loading
                ? b `
              <ik-calendar-view
                .hass=${this.hass}
                .tasks=${this._tasks}
                .narrow=${narrow}
              ></ik-calendar-view>
            `
                : isFormPage
                    ? b `
              <div class="form-page">
                ${i(`${path}|${this._formTemplate?.task_id ?? ""}|${this._formDueDate}`, b `
                  <ik-task-form-view
                    .hass=${this.hass}
                    .task=${isEdit ? this._getEditTask() : null}
                    .tasks=${this._tasks}
                    .template=${this._formTemplate}
                    .dueDate=${this._formDueDate}
                    .initialTab=${this._formTab}
                    .enableAnimations=${this._enableAnimations}
                    .returnPath=${this._returnPath}
                  ></ik-task-form-view>
                `)}
              </div>
            `
                    : b `<div class="content-scroll">
            ${this._loading
                        ? b `<p>${tr.loading}</p>`
                        : isSettings
                            ? b `
                  ${!isMobile ? b `<div class="page-title">${tr.settingsTitle}</div>` : A}
                  <ik-settings-view
                    .hass=${this.hass}
                    .enableAnimations=${this._enableAnimations}
                    @animations-changed=${(e) => {
                                this._enableAnimations = e.detail;
                                localStorage.setItem("intellikeep.animations", String(e.detail));
                            }}
                  ></ik-settings-view>
                `
                            : isHistory
                                ? b `
                  <ik-task-history-view
                    .hass=${this.hass}
                    .tasks=${this._tasks}
                    .narrow=${narrow}
                  ></ik-task-history-view>
                `
                                : A}
          </div>`}
      </div>

      ${this._modalStack.length > 0 ? this._renderTaskDialog() : A}

      ${this._showSettings ? b `
        <div class="modal-overlay" @click=${(e) => { if (e.target === e.currentTarget)
            this._showSettings = false; }}>
          <div class="modal-container">
            <div class="modal-header">
              <span class="modal-title">${tr.settingsTitle}</span>
              <button class="modal-close" @click=${() => { this._showSettings = false; }}><ha-icon icon="mdi:close" style="--mdc-icon-size:20px"></ha-icon></button>
            </div>
            <ik-settings-view
              .hass=${this.hass}
              .enableAnimations=${this._enableAnimations}
              @animations-changed=${(e) => {
            this._enableAnimations = e.detail;
            localStorage.setItem("intellikeep.animations", String(e.detail));
        }}
            ></ik-settings-view>
          </div>
        </div>
      ` : A}
    `;
    }
};
IntelliKeepPanel.styles = [tokens, i$6 `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--primary-background-color);
      --ik-padding: 20px;
    }
    :host([narrow-layout]) { --ik-padding: 16px; }

    /* Top app bar */
    .appbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 var(--ik-padding);
      height: 56px;
      background: var(--app-header-background-color, var(--primary-color));
      color: var(--app-header-text-color, #fff);
      box-shadow: 0 2px 4px rgba(0,0,0,.2);
      flex-shrink: 0;
    }
    .appbar ha-icon { opacity: 0.9; }
    .appbar-title { font-size: 20px; font-weight: 400; flex: 1; }
    .appbar-actions ha-icon-button {
      --ha-icon-button-size: 44px;
      --mdc-icon-button-size: 44px;
    }
    :host([narrow-layout]) .appbar { gap: 4px; padding: 0 4px; }
    :host([narrow-layout]) .appbar-actions ha-icon-button { margin: 0; }
    :host([narrow-layout]) .appbar-title { margin-inline-start: 8px; }
    .appbar-search {
      flex: 1;
      min-width: 0;
      height: 40px;
      padding: 0 8px;
      border: none;
      outline: none;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 18px;
    }
    .appbar-search::placeholder { color: inherit; opacity: 0.7; }
    .appbar-search::-webkit-search-cancel-button { display: none; }
    .appbar-actions { display: flex; gap: 4px; }
    .appbar-btn {
      background: rgba(255,255,255,.15);
      border: none;
      border-radius: 6px;
      color: inherit;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .appbar-btn:hover { background: rgba(255,255,255,.25); }
    .appbar-btn.active { background: rgba(255,255,255,.3); font-weight: 600; }
    .appbar-back {
      margin-right: -8px;
      color: var(--app-header-text-color, #fff);
      /* Current Home Assistant sizes ha-icon-button from --ha-icon-button-size; 2026.1 still reads the --mdc- one */
      --ha-icon-button-size: 40px;
      --mdc-icon-button-size: 40px;
      --mdc-ripple-color: var(--app-header-text-color, #fff);
    }

    /* Nav tabs */
    .tabs {
      display: flex;
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 0 var(--ik-padding);
      flex-shrink: 0;
    }
    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
      padding: 0 16px;
      box-sizing: border-box;
      font-size: 14px;
      font-weight: 500;
      color: var(--secondary-text-color);
      text-decoration: none;
      border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
    }
    .tab:hover { color: var(--primary-text-color); }
    .tab:focus-visible { outline: 2px solid var(--ik-focus-ring); outline-offset: -2px; }
    .tab[aria-current="page"] {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    :host([narrow-layout]) .tabs { padding: 0; }
    :host([narrow-layout]) .tab { flex: 1 1 0; }

    /* Content */
    .content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .content-scroll {
      flex: 1;
      overflow-y: auto;
      padding: var(--ik-padding);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: var(--mdc-dialog-scrim-color, rgba(0, 0, 0, 0.48));
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    .modal-container {
      background: var(--card-background-color);
      border-radius: 12px;
      padding: 24px;
      width: 100%;
      max-width: 640px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 8px 40px rgba(0,0,0,0.28);
    }
    .modal-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .modal-title {
      font-size: 18px;
      font-weight: 500;
      flex: 1;
      color: var(--primary-text-color);
    }
    .modal-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
    }
    .modal-close:hover { background: var(--secondary-background-color); }

    /* Task dialog: the form brings its own header, tabs and footer */
    .modal-container.task-dialog {
      display: flex;
      flex-direction: column;
      max-width: 600px;
      padding: 0;
      overflow: hidden;
      border-radius: var(--ik-radius-dialog);
      background: var(--ik-dialog-surface);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
    }
    .task-dialog:focus { outline: none; }
    .task-dialog > ik-task-form-view, .form-page > ik-task-form-view { flex: 1 1 auto; min-height: 0; }
    .form-page {
      flex: 1;
      min-height: 0;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: var(--ik-padding);
    }
    .form-page > ik-task-form-view {
      width: 100%;
      max-width: 600px;
      max-height: 100%;
      overflow: hidden;
      border: 1px solid var(--divider-color);
      border-radius: var(--ik-radius-dialog);
      background: var(--ik-dialog-surface);
    }
    @media (max-width: 600px) {
      .form-page { padding: 0; align-items: stretch; }
      .form-page > ik-task-form-view { max-width: none; max-height: none; border: none; border-radius: 0; }
    }

    .page-title {
      font-size: 22px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin: 0 0 20px;
    }
  `];
__decorate([
    n({ attribute: false })
], IntelliKeepPanel.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], IntelliKeepPanel.prototype, "panel", void 0);
__decorate([
    n({ attribute: false })
], IntelliKeepPanel.prototype, "route", void 0);
__decorate([
    n({ type: Boolean })
], IntelliKeepPanel.prototype, "narrow", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_tasks", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_currentPath", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_returnPath", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_loading", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_enableAnimations", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_modalStack", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_showSettings", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_formTab", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_formTemplate", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_formDueDate", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_smallWidth", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_taskSearch", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_searchOpen", void 0);
IntelliKeepPanel = __decorate([
    t$3("intellikeep-panel")
], IntelliKeepPanel);

export { IntelliKeepPanel };
