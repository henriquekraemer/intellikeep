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
const t$3=globalThis,e$2=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$3.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,i$1=t=>t,s$1=t$2.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$2.litHtmlPolyfillSupport;B?.(S,k),(t$2.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

const DOMAIN = "intellikeep";
async function getTask(hass, taskId) {
    const result = await hass.connection.sendMessagePromise({
        type: `${DOMAIN}/get_task`,
        task_id: taskId,
    });
    return result.task;
}
async function subscribeTasks(hass, callback) {
    return hass.connection.subscribeMessage((msg) => callback(msg.tasks), { type: `${DOMAIN}/subscribe` });
}
async function createTask(hass, data) {
    await hass.callService(DOMAIN, "create_task", data);
}
async function updateTask(hass, taskId, data) {
    await hass.callService(DOMAIN, "update_task", {
        task_id: taskId,
        ...data,
    });
}
async function completeTask(hass, taskId, completedBy = "", notes = "") {
    await hass.callService(DOMAIN, "complete_task", {
        task_id: taskId,
        completed_by: completedBy,
        notes,
    });
}
async function reopenTask(hass, taskId) {
    await hass.callService(DOMAIN, "reopen_task", { task_id: taskId });
}
async function deleteTask(hass, taskId) {
    await hass.callService(DOMAIN, "delete_task", { task_id: taskId });
}

const messages = {
    en: {
        newTask: "New task",
        tasks: "Tasks",
        settings: "Settings",
        loading: "Loading IntelliKeep…",
        editTask: "Edit Task",
        newTaskTitle: "New Task",
        settingsTitle: "Settings",
        done: "Done",
        undo: "Undo",
        edit: "Edit",
        del: "Del",
        allStatuses: "All statuses",
        overdue: "Overdue",
        dueToday: "Due today",
        pending: "Pending",
        completed: "Done",
        allUrgencies: "All",
        allPriorities: "All priorities",
        searchPlaceholder: "Search by name or description…",
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low",
        noTasks: "No tasks match the current filters.",
        deleteHeading: "Delete task?",
        deleteBody: "This action cannot be undone.",
        noDueDate: "No due date",
        dueTodayCard: "Due today",
        dueTomorrow: "Due tomorrow",
        daysOverdue: (n) => `${n} day${n !== 1 ? "s" : ""} overdue`,
        dueInDays: (n) => `Due in ${n} day${n !== 1 ? "s" : ""}`,
        taskName: "Task name *",
        taskNamePlaceholder: "e.g. Replace HVAC filter",
        description: "Description",
        descriptionPlaceholder: "Optional details…",
        priority: "Priority",
        frequency: "Frequency",
        intervalDays: "Interval (days)",
        dueDate: "Due date",
        linkedEntities: "Linked entities",
        addEntity: "+ Add entity",
        notifyBefore: "Notify N days before due",
        notifyOverdue: "Notify when overdue",
        taskNameRequired: "Task name is required.",
        saving: "Saving…",
        saveChanges: "Save changes",
        createTask: "Create task",
        cancel: "Cancel",
        freqOneTime: "One-time",
        freqDaily: "Daily",
        freqWeekly: "Weekly",
        freqMonthly: "Monthly",
        freqYearly: "Yearly",
        freqCustom: "Custom interval",
        historyLoading: "Loading…",
        taskNotFound: "Task not found.",
        back: "← Back",
        executionHistory: (n) => `Execution history — ${n} record${n !== 1 ? "s" : ""}`,
        noExecutions: "No executions recorded yet.",
        completedAt: "Completed at",
        completedBy: "Completed by",
        notes: "Notes",
        settingsHeading: "IntelliKeep Settings",
        settingsBody: "To change integration settings, go to Settings → Devices & Services → IntelliKeep → Configure.",
        rowsPerPage: "Rows per page:",
        cardsPerPage: "Cards per page:",
        of: "of",
        animationsLabel: "Task animations",
        animationsDesc: "Animate tasks when marked as done or deleted.",
        viewList: "List view",
        viewGrid: "Grid view",
        allClear: "You're all caught up for today!",
        allClearSub: "Nothing due right now. Here's an idea:",
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
        newTaskTitle: "Nova Tarefa",
        settingsTitle: "Configurações",
        done: "Concluir",
        undo: "Desfazer",
        edit: "Editar",
        del: "Excluir",
        allStatuses: "Todos os status",
        overdue: "Atrasada",
        dueToday: "Vence hoje",
        pending: "Pendente",
        completed: "Concluída",
        allUrgencies: "Todas",
        allPriorities: "Todas as prioridades",
        searchPlaceholder: "Buscar por nome ou descrição…",
        critical: "Crítica",
        high: "Alta",
        medium: "Média",
        low: "Baixa",
        noTasks: "Nenhuma tarefa corresponde aos filtros.",
        deleteHeading: "Excluir tarefa?",
        deleteBody: "Esta ação não pode ser desfeita.",
        noDueDate: "Sem data prevista",
        dueTodayCard: "Vence hoje",
        dueTomorrow: "Vence amanhã",
        daysOverdue: (n) => `${n} dia${n !== 1 ? "s" : ""} de atraso`,
        dueInDays: (n) => `Vence em ${n} dia${n !== 1 ? "s" : ""}`,
        taskName: "Nome da tarefa *",
        taskNamePlaceholder: "ex: Trocar filtro do ar-condicionado",
        description: "Descrição",
        descriptionPlaceholder: "Detalhes opcionais…",
        priority: "Prioridade",
        frequency: "Frequência",
        intervalDays: "Intervalo (dias)",
        dueDate: "Data prevista",
        linkedEntities: "Entidades vinculadas",
        addEntity: "+ Adicionar entidade",
        notifyBefore: "Notificar N dias antes do vencimento",
        notifyOverdue: "Notificar quando atrasada",
        taskNameRequired: "O nome da tarefa é obrigatório.",
        saving: "Salvando…",
        saveChanges: "Salvar alterações",
        createTask: "Criar tarefa",
        cancel: "Cancelar",
        freqOneTime: "Única",
        freqDaily: "Diária",
        freqWeekly: "Semanal",
        freqMonthly: "Mensal",
        freqYearly: "Anual",
        freqCustom: "Intervalo personalizado",
        historyLoading: "Carregando…",
        taskNotFound: "Tarefa não encontrada.",
        back: "← Voltar",
        executionHistory: (n) => `Histórico de execuções — ${n} registro${n !== 1 ? "s" : ""}`,
        noExecutions: "Nenhuma execução registrada ainda.",
        completedAt: "Concluída em",
        completedBy: "Concluída por",
        notes: "Observações",
        settingsHeading: "Configurações do IntelliKeep",
        settingsBody: "Para alterar as configurações da integração, acesse Configurações → Dispositivos e Serviços → IntelliKeep → Configurar.",
        rowsPerPage: "Linhas por página:",
        cardsPerPage: "Cards por página:",
        of: "de",
        animationsLabel: "Animações de tarefas",
        animationsDesc: "Animar tarefas ao marcar como concluída ou excluir.",
        viewList: "Visualização em lista",
        viewGrid: "Visualização em cards",
        allClear: "Está tudo em dia por hoje!",
        allClearSub: "Nada pendente agora. Que tal:",
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
};
function t(language) {
    const lang = language?.split("-")[0]?.toLowerCase();
    return messages[lang] ?? messages.en;
}

function priorityColor(p) {
    const m = {
        low: "var(--success-color, #4caf50)",
        medium: "var(--warning-color, #ff9800)",
        high: "var(--error-color, #f44336)",
        critical: "#9c27b0",
    };
    return m[p] ?? "var(--secondary-text-color)";
}
function statusColor(s) {
    const m = {
        pending: "var(--secondary-text-color)",
        due: "var(--warning-color, #ff9800)",
        overdue: "var(--error-color, #f44336)",
        completed: "var(--success-color, #4caf50)",
        snoozed: "var(--disabled-color)",
    };
    return m[s] ?? "var(--secondary-text-color)";
}
let IkTaskCard = class IkTaskCard extends i {
    constructor() {
        super(...arguments);
        this.completing = false;
        this.grid = false;
    }
    _relativeDue(iso) {
        const tr = t(this.hass?.language);
        if (!iso)
            return tr.noDueDate;
        const days = Math.round((new Date(iso).getTime() - Date.now()) / 86400000);
        if (days === 0)
            return tr.dueTodayCard;
        if (days === 1)
            return tr.dueTomorrow;
        if (days === -1)
            return tr.daysOverdue(1);
        if (days > 0)
            return tr.dueInDays(days);
        return tr.daysOverdue(Math.abs(days));
    }
    render() {
        const { task } = this;
        if (this.grid) {
            return b `
        <div class="card">
          <div class="card-top">
            <div class="card-name">${task.name}</div>
            <div class="card-priority-dot" style="background:${priorityColor(task.priority)}" title=${task.priority}></div>
          </div>
          <div class="card-desc">${task.description ?? ""}</div>
          <div class="card-due" style="color:${statusColor(task.status)}">${this._relativeDue(task.due_date)}</div>
          <div class="card-actions"><slot name="actions"></slot></div>
        </div>
      `;
        }
        return b `
      <div class="row">
        <div class="priority-bar" style="background:${priorityColor(task.priority)}">
          <span>${task.priority}</span>
        </div>
        <div class="row-content">
          <div class="body">
            <div class="name">${task.name}</div>
            ${task.description ? b `<div class="desc">${task.description}</div>` : ""}
            <div class="meta">
              <span style="color:${statusColor(task.status)}">${this._relativeDue(task.due_date)}</span>
              ${task.linked_entity_ids.length
            ? b `<span>· ${task.linked_entity_ids.length} entit${task.linked_entity_ids.length > 1 ? "ies" : "y"}</span>`
            : ""}
            </div>
          </div>
          <div class="actions">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    `;
    }
};
IkTaskCard.styles = i$3 `
    :host {
      display: block;
    }
    .row {
      display: flex;
      align-items: stretch;
      gap: 12px;
      overflow: hidden;
    }
    .priority-bar {
      width: 28px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .priority-bar span {
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #fff;
      white-space: nowrap;
    }
    .row-content {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px 12px 0;
    }
    .body {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .desc {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
      font-size: 12px;
      align-items: center;
    }
    .badge {
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #fff;
    }
    .actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;
      justify-content: flex-end;
    }
    /* Grid card layout */
    .card {
      display: flex;
      flex-direction: column;
      padding: 14px 14px 10px;
      border-radius: 10px;
      border: 1.5px solid var(--divider-color);
      background: var(--card-background-color);
      gap: 8px;
      height: 100%;
      box-sizing: border-box;
    }
    .card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 6px;
    }
    .card-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--primary-text-color);
      line-height: 1.3;
      flex: 1;
    }
    .card-priority-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 3px;
    }
    .card-due {
      font-size: 12px;
      font-weight: 500;
    }
    .card-desc {
      font-size: 12px;
      line-height: 1.4;
      height: 2.8em;
      color: var(--secondary-text-color);
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .card-actions {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      margin-top: 2px;
      justify-content: flex-end;
    }
  `;
__decorate([
    n({ attribute: false })
], IkTaskCard.prototype, "task", void 0);
__decorate([
    n({ attribute: false })
], IkTaskCard.prototype, "hass", void 0);
__decorate([
    n({ type: Boolean })
], IkTaskCard.prototype, "completing", void 0);
__decorate([
    n({ type: Boolean })
], IkTaskCard.prototype, "grid", void 0);
IkTaskCard = __decorate([
    t$1("ik-task-card")
], IkTaskCard);

let IkConfirmDialog = class IkConfirmDialog extends i {
    constructor() {
        super(...arguments);
        this.heading = "Are you sure?";
        this.confirmText = "Confirm";
        this.cancelText = "Cancel";
        this.open = false;
    }
    _fire(confirmed) {
        this.dispatchEvent(new CustomEvent("dialog-closed", { detail: { confirmed } }));
        this.open = false;
    }
    render() {
        if (!this.open)
            return b ``;
        return b `
      <div class="backdrop" @click=${() => this._fire(false)}>
        <div class="dialog" @click=${(e) => e.stopPropagation()}>
          <h3>${this.heading}</h3>
          <div class="content"><slot></slot></div>
          <div class="buttons">
            <button class="cancel" @click=${() => this._fire(false)}>${this.cancelText}</button>
            <button class="confirm" @click=${() => this._fire(true)}>${this.confirmText}</button>
          </div>
        </div>
      </div>
    `;
    }
};
IkConfirmDialog.styles = i$3 `
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
      color: #fff;
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
    t$1("ik-confirm-dialog")
], IkConfirmDialog);

let IkTaskListView = class IkTaskListView extends i {
    constructor() {
        super(...arguments);
        this.tasks = [];
        this.enableAnimations = true;
        this._filterTab = "due";
        this._filterPriority = "all";
        this._searchQuery = "";
        this._viewMode = localStorage.getItem("intellikeep.viewMode") === "grid" ? "grid" : "list";
        this._deleteTarget = null;
        this._completing = new Set();
        this._reopening = new Set();
        this._page = 0;
        this._pageSize = 25;
        this._exitingDone = new Set();
        this._exitingDelete = new Set();
        this._exitingUndo = new Set();
        this._exitingEdit = new Set();
    }
    connectedCallback() {
        super.connectedCallback();
        const saved = localStorage.getItem("intellikeep.filterTab");
        if (saved === "due" || saved === "overdue" || saved === "pending" || saved === "completed") {
            this._filterTab = saved;
        }
    }
    _resetPage() {
        this._page = 0;
    }
    get _filtered() {
        const q = this._searchQuery.trim().toLowerCase();
        return this.tasks.filter((task) => {
            const tabMatch = (() => {
                switch (this._filterTab) {
                    case "due": return task.status === "due";
                    case "overdue": return task.status === "overdue";
                    case "pending": return task.status !== "completed";
                    case "completed": return task.status === "completed";
                }
            })();
            if (!tabMatch)
                return false;
            if (this._filterPriority !== "all" && task.priority !== this._filterPriority)
                return false;
            if (q && !task.name.toLowerCase().includes(q) && !(task.description ?? "").toLowerCase().includes(q))
                return false;
            return true;
        });
    }
    get _relaxSuggestion() {
        const tr = t(this.hass?.language);
        const d = new Date();
        const idx = (d.getDate() + d.getMonth()) % tr.relaxSuggestions.length;
        return tr.relaxSuggestions[idx];
    }
    _navigateTo(path) {
        this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
    }
    async _edit(taskId) {
        if (this.enableAnimations) {
            this._exitingEdit = new Set([...this._exitingEdit, taskId]);
            await new Promise((r) => setTimeout(r, 320));
            this._exitingEdit = new Set([...this._exitingEdit].filter((id) => id !== taskId));
        }
        this._navigateTo(`/edit/${taskId}`);
    }
    async _reopen(taskId) {
        this._reopening = new Set([...this._reopening, taskId]);
        if (this.enableAnimations) {
            this._exitingUndo = new Set([...this._exitingUndo, taskId]);
            await new Promise((r) => setTimeout(r, 380));
        }
        try {
            await reopenTask(this.hass, taskId);
        }
        catch (err) {
            console.error("[IntelliKeep] reopen_task failed:", err);
            alert(`Failed to reopen task: ${err}`);
        }
        finally {
            this._reopening = new Set([...this._reopening].filter((id) => id !== taskId));
            this._exitingUndo = new Set([...this._exitingUndo].filter((id) => id !== taskId));
        }
    }
    async _complete(taskId) {
        this._completing = new Set([...this._completing, taskId]);
        if (this.enableAnimations) {
            this._exitingDone = new Set([...this._exitingDone, taskId]);
            await new Promise((r) => setTimeout(r, 380));
        }
        try {
            await completeTask(this.hass, taskId);
        }
        catch (err) {
            console.error("[IntelliKeep] complete_task failed:", err);
            alert(`Failed to complete task: ${err}`);
        }
        finally {
            this._completing = new Set([...this._completing].filter((id) => id !== taskId));
            this._exitingDone = new Set([...this._exitingDone].filter((id) => id !== taskId));
        }
    }
    async _confirmDelete(confirmed) {
        const taskId = this._deleteTarget;
        this._deleteTarget = null;
        if (confirmed && taskId) {
            if (this.enableAnimations) {
                this._exitingDelete = new Set([...this._exitingDelete, taskId]);
                await new Promise((r) => setTimeout(r, 380));
            }
            try {
                await deleteTask(this.hass, taskId);
            }
            catch (err) {
                console.error("[IntelliKeep] delete_task failed:", err);
                alert(`Failed to delete task: ${err}`);
            }
            finally {
                this._exitingDelete = new Set([...this._exitingDelete].filter((id) => id !== taskId));
            }
        }
    }
    render() {
        const tasks = this._filtered;
        const tr = t(this.hass?.language);
        const totalPages = Math.max(1, Math.ceil(tasks.length / this._pageSize));
        const page = Math.min(this._page, totalPages - 1);
        const start = page * this._pageSize;
        const pageTasks = tasks.slice(start, start + this._pageSize);
        const countDue = this.tasks.filter(t => t.status === "due").length;
        const countOverdue = this.tasks.filter(t => t.status === "overdue").length;
        const countPending = this.tasks.filter(t => t.status !== "completed").length;
        const countCompleted = this.tasks.filter(t => t.status === "completed").length;
        const chip = (tab, label, count, extra = "") => b `
      <button
        class="filter-chip ${extra} ${this._filterTab === tab ? "active" : ""}"
        @click=${() => { this._filterTab = tab; localStorage.setItem("intellikeep.filterTab", tab); this._resetPage(); }}
      >
        ${label}
        <span class="chip-badge">${count}</span>
      </button>
    `;
        const isDueClear = this._filterTab === "due" && tasks.length === 0 && !this._searchQuery.trim();
        return b `
      <div class="filter-bar">
        <input
          class="search-input"
          type="search"
          .value=${this._searchQuery}
          placeholder=${tr.searchPlaceholder}
          @input=${(e) => { this._searchQuery = e.target.value; this._resetPage(); }}
        />
      </div>
      <div class="filter-bar">
        ${chip("due", tr.dueToday, countDue)}
        ${chip("overdue", tr.overdue, countOverdue, "chip-overdue")}
        ${chip("pending", tr.pending, countPending)}
        ${chip("completed", tr.completed, countCompleted, "chip-completed")}
        <select class="priority-select" .value=${this._filterPriority} @change=${(e) => { this._filterPriority = e.target.value; this._resetPage(); }}>
          <option value="all">${tr.allPriorities}</option>
          <option value="critical">${tr.critical}</option>
          <option value="high">${tr.high}</option>
          <option value="medium">${tr.medium}</option>
          <option value="low">${tr.low}</option>
        </select>
        <div class="view-toggle">
          <button class="view-btn ${this._viewMode === "list" ? "active" : ""}" title=${tr.viewList}
            @click=${() => { this._viewMode = "list"; localStorage.setItem("intellikeep.viewMode", "list"); }}>&#9776;</button>
          <button class="view-btn ${this._viewMode === "grid" ? "active" : ""}" title=${tr.viewGrid}
            @click=${() => { this._viewMode = "grid"; localStorage.setItem("intellikeep.viewMode", "grid"); }}>&#9783;</button>
        </div>
      </div>

      <ha-card>
        ${isDueClear
            ? b `
            <div class="all-clear">
              <div class="all-clear-emoji">🎉</div>
              <p class="all-clear-title">${tr.allClear}</p>
              <p class="all-clear-sub">${tr.allClearSub}</p>
              <span class="all-clear-suggestion">${this._relaxSuggestion}</span>
            </div>`
            : tasks.length === 0
                ? b `<div class="empty">${tr.noTasks}</div>`
                : this._viewMode === "grid"
                    ? b `<div class="grid-container">${pageTasks.map(task => b `
              <div class="task-wrapper ${this._exitingDone.has(task.task_id) ? "exiting-done" : this._exitingDelete.has(task.task_id) ? "exiting-delete" : this._exitingUndo.has(task.task_id) ? "exiting-undo" : this._exitingEdit.has(task.task_id) ? "exiting-edit" : ""}">
                <ik-task-card .task=${task} .hass=${this.hass} .grid=${true}>
                  <div class="task-actions" slot="actions">
                      ${task.status !== "completed"
                        ? b `<button class="icon-btn primary" title=${tr.done} ?disabled=${this._completing.has(task.task_id)} @click=${() => this._complete(task.task_id)}><ha-icon icon="mdi:check"></ha-icon></button>`
                        : b `<button class="icon-btn undo" title=${tr.undo} ?disabled=${this._reopening.has(task.task_id)} @click=${() => this._reopen(task.task_id)}><ha-icon icon="mdi:undo"></ha-icon></button>`}
                      <button class="icon-btn edit" title=${tr.edit} @click=${() => this._edit(task.task_id)}><ha-icon icon="mdi:pencil"></ha-icon></button>
                      <button class="icon-btn danger" title=${tr.del} @click=${() => { this._deleteTarget = task.task_id; }}><ha-icon icon="mdi:delete"></ha-icon></button>
                  </div>
                </ik-task-card>
              </div>`)}</div>`
                    : b `<div class="list-container">${pageTasks.map((task) => b `
                <div class="list-item task-wrapper ${this._exitingDone.has(task.task_id) ? "exiting-done" : this._exitingDelete.has(task.task_id) ? "exiting-delete" : this._exitingUndo.has(task.task_id) ? "exiting-undo" : this._exitingEdit.has(task.task_id) ? "exiting-edit" : ""}">
                  <ik-task-card .task=${task} .hass=${this.hass}>
                    <div class="task-actions" slot="actions">
                      ${task.status !== "completed"
                        ? b `<button class="icon-btn primary" title=${tr.done} ?disabled=${this._completing.has(task.task_id)} @click=${() => this._complete(task.task_id)}><ha-icon icon="mdi:check"></ha-icon></button>`
                        : b `<button class="icon-btn undo" title=${tr.undo} ?disabled=${this._reopening.has(task.task_id)} @click=${() => this._reopen(task.task_id)}><ha-icon icon="mdi:undo"></ha-icon></button>`}
                      <button class="icon-btn edit" title=${tr.edit} @click=${() => this._edit(task.task_id)}><ha-icon icon="mdi:pencil"></ha-icon></button>
                      <button class="icon-btn danger" title=${tr.del} @click=${() => { this._deleteTarget = task.task_id; }}><ha-icon icon="mdi:delete"></ha-icon></button>
                    </div>
                  </ik-task-card>
                </div>
              `)}</div>`}
      </ha-card>

      ${tasks.length > 0 ? b `
      <div class="pagination">
        <span>${this._viewMode === 'grid' ? tr.cardsPerPage : tr.rowsPerPage}</span>
        <select .value=${String(this._pageSize)} @change=${(e) => { this._pageSize = Number(e.target.value); this._resetPage(); }}>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span>${start + 1}–${Math.min(start + this._pageSize, tasks.length)} ${tr.of} ${tasks.length}</span>
        <button class="page-btn" ?disabled=${page === 0} @click=${() => { this._page = page - 1; }}>&lt;</button>
        <button class="page-btn" ?disabled=${page >= totalPages - 1} @click=${() => { this._page = page + 1; }}>&gt;</button>
      </div>` : ""}

      <ik-confirm-dialog
        heading=${tr.deleteHeading}
        .open=${this._deleteTarget !== null}
        @dialog-closed=${(e) => this._confirmDelete(e.detail.confirmed)}
      >
        ${tr.deleteBody}
      </ik-confirm-dialog>
    `;
    }
};
IkTaskListView.styles = i$3 `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: var(--ik-padding, 20px);
      box-sizing: border-box;
    }
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 0 16px;
      flex-wrap: wrap;
    }
    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 13px;
      border-radius: 20px;
      border: 1.5px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
      white-space: nowrap;
    }
    .filter-chip:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .filter-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .filter-chip.active.chip-overdue {
      background: var(--error-color, #f44336);
      border-color: var(--error-color, #f44336);
    }
    .filter-chip.active.chip-completed {
      background: var(--success-color, #4caf50);
      border-color: var(--success-color, #4caf50);
    }
    .chip-badge {
      display: inline-block;
      background: rgba(0,0,0,0.15);
      border-radius: 10px;
      padding: 0 5px;
      font-size: 11px;
      min-width: 16px;
      text-align: center;
      line-height: 16px;
    }
    .filter-chip:not(.active) .chip-badge {
      background: var(--divider-color);
      color: var(--primary-text-color);
    }
    .priority-select {
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .search-input {
      flex: 1;
      min-width: 160px;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      font-family: inherit;
    }
    .search-input::placeholder { color: var(--secondary-text-color); }
    .view-toggle {
      display: flex;
      border: 1.5px solid var(--divider-color);
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .view-btn {
      padding: 4px 9px;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      transition: background 0.15s, color 0.15s;
    }
    .view-btn.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
      padding: 8px;
    }
    ha-card { flex: 1; min-height: 0; overflow-y: auto; }
    .empty {
      text-align: center;
      padding: 40px 24px;
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
      background: color-mix(in srgb, var(--primary-color) 10%, transparent);
      color: var(--primary-color);
      font-size: 14px;
      font-weight: 500;
    }
    .task-actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
      align-items: center;
    }
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: filter 0.15s, opacity 0.15s;
      --mdc-icon-size: 18px;
      color: #fff;
    }
    .icon-btn:hover { filter: brightness(1.15); }
    .icon-btn:disabled { opacity: 0.4; cursor: default; }
    .icon-btn.primary { background: var(--primary-color); }
    .icon-btn.undo    { background: var(--warning-color, #ff9800); }
    .icon-btn.edit    { background: var(--secondary-text-color, #757575); }
    .icon-btn.danger  { background: var(--error-color, #f44336); }
    .task-divider {
      border: none;
      border-top: 1px solid var(--divider-color);
      margin: 0;
    }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 0 0;
      flex-wrap: wrap;
    }
    .pagination select {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .pagination span {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .page-btn {
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 13px;
    }
    .page-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    @keyframes ik-done-exit {
      0%   { transform: translateX(0);    opacity: 1; background: transparent; }
      15%  { background: color-mix(in srgb, var(--primary-color) 18%, transparent); }
      100% { transform: translateX(56px); opacity: 0; background: transparent; }
    }
    @keyframes ik-delete-exit {
      0%   { transform: translateX(0);     opacity: 1; background: transparent; }
      15%  { background: rgba(244, 67, 54, 0.15); }
      100% { transform: translateX(-56px); opacity: 0; background: transparent; }
    }
    .task-wrapper { overflow: hidden; }
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
    }
    .list-item {
      border: 1.5px solid var(--divider-color);
      border-radius: 10px;
      overflow: hidden;
      background: var(--card-background-color);
    }
    .task-wrapper.exiting-done {
      animation: ik-done-exit 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      pointer-events: none;
    }
    .task-wrapper.exiting-delete {
      animation: ik-delete-exit 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      pointer-events: none;
    }
    @keyframes ik-undo-exit {
      0%   { transform: translateX(0);     opacity: 1; background: transparent; }
      15%  { background: color-mix(in srgb, var(--warning-color, #ff9800) 22%, transparent); }
      100% { transform: translateX(-56px); opacity: 0; background: transparent; }
    }
    .task-wrapper.exiting-undo {
      animation: ik-undo-exit 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      pointer-events: none;
    }
    @keyframes ik-edit-pulse {
      0%   { transform: scale(1);    box-shadow: none; }
      40%  { transform: scale(1.012); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 30%, transparent); }
      100% { transform: scale(1);    box-shadow: none; }
    }
    .task-wrapper.exiting-edit {
      animation: ik-edit-pulse 0.32s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
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
    r()
], IkTaskListView.prototype, "_filterTab", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_filterPriority", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_searchQuery", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_viewMode", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_deleteTarget", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_completing", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_reopening", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_page", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_pageSize", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_exitingDone", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_exitingDelete", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_exitingUndo", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_exitingEdit", void 0);
IkTaskListView = __decorate([
    t$1("ik-task-list-view")
], IkTaskListView);

let IkTaskFormView = class IkTaskFormView extends i {
    constructor() {
        super(...arguments);
        this.task = null;
        this._name = "";
        this._description = "";
        this._priority = "medium";
        this._frequency = "one_time";
        this._customDays = null;
        this._dueDate = "";
        this._dueTime = "";
        this._linkedEntities = [];
        this._notifyDaysBefore = 1;
        this._notifyOnOverdue = true;
        this._saving = false;
        this._error = "";
    }
    connectedCallback() {
        super.connectedCallback();
        if (this.task) {
            this._name = this.task.name;
            this._description = this.task.description;
            this._priority = this.task.priority;
            this._frequency = this.task.frequency;
            this._customDays = this.task.custom_days_interval;
            this._dueDate = this.task.due_date ? this.task.due_date.substring(0, 10) : "";
            this._dueTime = this.task.due_date ? this.task.due_date.substring(11, 16) : "";
            this._linkedEntities = [...this.task.linked_entity_ids];
            this._notifyDaysBefore = this.task.notify_days_before;
            this._notifyOnOverdue = this.task.notify_on_overdue;
        }
        else {
            // Pre-fill due date with current local date/time for new tasks
            const now = new Date();
            now.setSeconds(0, 0);
            const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
            this._dueDate = local.substring(0, 10);
            this._dueTime = local.substring(11, 16);
        }
    }
    _navigate(path) {
        this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
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
            const data = {
                name: this._name.trim(),
                description: this._description.trim(),
                priority: this._priority,
                frequency: this._frequency,
                custom_days_interval: this._frequency === "custom" ? this._customDays : null,
                due_date: this._dueDate ? new Date(`${this._dueDate}T${this._dueTime || "00:00"}`).toISOString() : null,
                linked_entity_ids: this._linkedEntities.filter(Boolean),
                notify_days_before: this._notifyDaysBefore,
                notify_on_overdue: this._notifyOnOverdue,
            };
            if (this.task) {
                await updateTask(this.hass, this.task.task_id, data);
            }
            else {
                await createTask(this.hass, data);
            }
            this._navigate("/tasks");
        }
        catch (err) {
            this._error = String(err);
        }
        finally {
            this._saving = false;
        }
    }
    render() {
        const isEdit = this.task !== null;
        const tr = t(this.hass?.language);
        return b `
      <div class="form">
        <label>
          ${tr.taskName}
          <input .value=${this._name} @input=${(e) => { this._name = e.target.value; }} placeholder=${tr.taskNamePlaceholder} />
        </label>

        <label>
          ${tr.description}
          <textarea .value=${this._description} @input=${(e) => { this._description = e.target.value; }} placeholder=${tr.descriptionPlaceholder}></textarea>
        </label>

        <div class="row">
          <label>
            ${tr.priority}
            <select .value=${this._priority} @change=${(e) => { this._priority = e.target.value; }}>
              <option value="low">${tr.low}</option>
              <option value="medium">${tr.medium}</option>
              <option value="high">${tr.high}</option>
              <option value="critical">${tr.critical}</option>
            </select>
          </label>

          <label>
            ${tr.frequency}
            <select .value=${this._frequency} @change=${(e) => { this._frequency = e.target.value; }}>
              <option value="one_time">${tr.freqOneTime}</option>
              <option value="daily">${tr.freqDaily}</option>
              <option value="weekly">${tr.freqWeekly}</option>
              <option value="monthly">${tr.freqMonthly}</option>
              <option value="yearly">${tr.freqYearly}</option>
              <option value="custom">${tr.freqCustom}</option>
            </select>
          </label>
        </div>

        ${this._frequency === "custom"
            ? b `
              <label>
                ${tr.intervalDays}
                <input type="number" min="1" .value=${String(this._customDays ?? 30)} @input=${(e) => { this._customDays = parseInt(e.target.value, 10); }} />
              </label>
            `
            : A}

        <label>
          ${tr.dueDate}
          <div style="display:flex;gap:8px;">
            <input type="date" style="flex:1" .value=${this._dueDate} @change=${(e) => { this._dueDate = e.target.value; }} />
            <input type="time" style="width:110px" .value=${this._dueTime} @change=${(e) => { this._dueTime = e.target.value; }} />
          </div>
        </label>

        <div>
          <div style="font-size:13px;color:var(--secondary-text-color);margin-bottom:6px;">${tr.linkedEntities}</div>
          <div class="entity-list">
            ${this._linkedEntities.map((eid, i) => b `
                <div class="entity-row">
                  <input .value=${eid} placeholder="sensor.example" @input=${(e) => {
            const arr = [...this._linkedEntities];
            arr[i] = e.target.value;
            this._linkedEntities = arr;
        }} />
                  <button @click=${() => { this._linkedEntities = this._linkedEntities.filter((_, idx) => idx !== i); }}>✕</button>
                </div>
              `)}
            <button class="add-entity" @click=${() => { this._linkedEntities = [...this._linkedEntities, ""]; }}>${tr.addEntity}</button>
          </div>
        </div>

        <div class="row">
          <label>
            ${tr.notifyBefore}
            <input type="number" min="0" max="365" .value=${String(this._notifyDaysBefore)} @input=${(e) => { this._notifyDaysBefore = parseInt(e.target.value, 10); }} />
          </label>
          <label class="checkbox-label">
            <input type="checkbox" .checked=${this._notifyOnOverdue} @change=${(e) => { this._notifyOnOverdue = e.target.checked; }} />
            ${tr.notifyOverdue}
          </label>
        </div>

        ${this._error ? b `<div class="error">${this._error}</div>` : A}

        <div class="actions">
          <button class="save" ?disabled=${this._saving} @click=${this._save}>
            ${this._saving ? tr.saving : isEdit ? tr.saveChanges : tr.createTask}
          </button>
          <button class="cancel" @click=${() => this._navigate("/tasks")}>${tr.cancel}</button>
        </div>
      </div>
    `;
    }
};
IkTaskFormView.styles = i$3 `
    :host { display: block; }
    .form { display: flex; flex-direction: column; gap: 16px; max-width: 600px; }
    label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--secondary-text-color); }
    input, select, textarea {
      padding: 8px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      font-family: inherit;
    }
    textarea { resize: vertical; min-height: 72px; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; }
    .row label { flex: 1; min-width: 160px; }
    .checkbox-label { flex-direction: row; align-items: center; gap: 8px; cursor: pointer; }
    .actions { display: flex; gap: 10px; margin-top: 8px; }
    button {
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    .save { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .cancel { background: var(--secondary-background-color); color: var(--primary-text-color); }
    .error { color: var(--error-color, #f44336); font-size: 13px; }
    .entity-list { display: flex; flex-direction: column; gap: 4px; }
    .entity-row { display: flex; gap: 6px; align-items: center; }
    .entity-row input { flex: 1; }
    .entity-row button { padding: 6px 10px; background: var(--secondary-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); border-radius: 6px; cursor: pointer; }
    .add-entity { background: transparent; border: 1px dashed var(--divider-color); color: var(--secondary-text-color); border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 13px; align-self: flex-start; }
  `;
__decorate([
    n({ attribute: false })
], IkTaskFormView.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], IkTaskFormView.prototype, "task", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_name", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_description", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_priority", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_frequency", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_customDays", void 0);
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
], IkTaskFormView.prototype, "_error", void 0);
IkTaskFormView = __decorate([
    t$1("ik-task-form-view")
], IkTaskFormView);

let IkTaskHistoryView = class IkTaskHistoryView extends i {
    constructor() {
        super(...arguments);
        this.taskId = "";
        this._task = null;
        this._loading = true;
        this._error = "";
    }
    async connectedCallback() {
        super.connectedCallback();
        await this._load();
    }
    async _load() {
        try {
            this._task = await getTask(this.hass, this.taskId);
        }
        catch (err) {
            this._error = String(err);
        }
        finally {
            this._loading = false;
        }
    }
    _navigate(path) {
        this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
    }
    _formatDate(iso) {
        return new Date(iso).toLocaleString();
    }
    render() {
        const tr = t(this.hass?.language);
        if (this._loading)
            return b `<p>${tr.historyLoading}</p>`;
        if (this._error)
            return b `<p style="color:var(--error-color)">${this._error}</p>`;
        if (!this._task)
            return b `<p>${tr.taskNotFound}</p>`;
        const executions = [...(this._task.executions || [])].reverse();
        return b `
      <button class="back-btn" @click=${() => this._navigate("/tasks")}>${tr.back}</button>
      <h2>${this._task.name}</h2>
      <div class="subtitle">${tr.executionHistory(executions.length)}</div>

      <ha-card>
        ${executions.length === 0
            ? b `<div class="empty">${tr.noExecutions}</div>`
            : b `
              <table>
                <thead>
                  <tr>
                    <th>${tr.completedAt}</th>
                    <th>${tr.completedBy}</th>
                    <th>${tr.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  ${executions.map((ex) => b `
                      <tr>
                        <td>${this._formatDate(ex.completed_at)}</td>
                        <td>${ex.completed_by || "—"}</td>
                        <td>${ex.notes || "—"}</td>
                      </tr>
                    `)}
                </tbody>
              </table>
            `}
      </ha-card>
    `;
    }
};
IkTaskHistoryView.styles = i$3 `
    :host { display: block; }
    h2 { margin: 0 0 4px; font-size: 18px; }
    .subtitle { color: var(--secondary-text-color); font-size: 13px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th {
      text-align: left;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-weight: 500;
      border-bottom: 1px solid var(--divider-color);
    }
    td { padding: 10px 12px; border-bottom: 1px solid var(--divider-color); }
    tr:last-child td { border-bottom: none; }
    .empty { text-align: center; padding: 32px; color: var(--secondary-text-color); }
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;
      padding: 6px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 13px;
    }
  `;
__decorate([
    n({ attribute: false })
], IkTaskHistoryView.prototype, "hass", void 0);
__decorate([
    n()
], IkTaskHistoryView.prototype, "taskId", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_task", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_loading", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_error", void 0);
IkTaskHistoryView = __decorate([
    t$1("ik-task-history-view")
], IkTaskHistoryView);

let IkSettingsView = class IkSettingsView extends i {
    constructor() {
        super(...arguments);
        this.enableAnimations = true;
    }
    render() {
        const tr = t(this.hass?.language);
        return b `
      <ha-card>
        <h3>${tr.settingsHeading}</h3>
        <p>${tr.settingsBody}</p>

        <div style="margin-top:16px">
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
        </div>
      </ha-card>
    `;
    }
};
IkSettingsView.styles = i$3 `
    :host { display: block; }
    ha-card { padding: 20px; }
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
      background: #fff;
      border-radius: 50%;
      transition: transform 0.2s;
    }
    input:checked + .slider { background: var(--primary-color); }
    input:checked + .slider::before { transform: translateX(18px); }
  `;
__decorate([
    n({ attribute: false })
], IkSettingsView.prototype, "hass", void 0);
__decorate([
    n({ type: Boolean })
], IkSettingsView.prototype, "enableAnimations", void 0);
IkSettingsView = __decorate([
    t$1("ik-settings-view")
], IkSettingsView);

// HA passes hass + panel + route to panel elements automatically.
let IntelliKeepPanel = class IntelliKeepPanel extends i {
    constructor() {
        super(...arguments);
        this._tasks = [];
        this._currentPath = "/tasks";
        this._loading = true;
        this._enableAnimations = true;
    }
    async connectedCallback() {
        super.connectedCallback();
        this._enableAnimations = localStorage.getItem("intellikeep.animations") !== "false";
        await this._subscribe();
        this._restoreRoute();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._unsubscribe)
            this._unsubscribe();
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
        this._currentPath = path;
        history.replaceState(null, "", location.pathname + "#" + path);
    }
    _getEditTask() {
        const match = this._currentPath.match(/^\/edit\/(.+)$/);
        if (!match)
            return null;
        return this._tasks.find((t) => t.task_id === match[1]) ?? null;
    }
    _getHistoryTaskId() {
        const match = this._currentPath.match(/^\/history\/(.+)$/);
        return match ? match[1] : "";
    }
    render() {
        const path = this._currentPath;
        const tr = t(this.hass?.language);
        const isNew = path === "/new";
        const isEdit = path.startsWith("/edit/");
        const isHistory = path.startsWith("/history/");
        const isSettings = path === "/settings";
        const isTasks = !isNew && !isEdit && !isHistory && !isSettings;
        const dueCount = this._tasks.filter((t) => t.status === "due" || t.status === "overdue").length;
        return b `
      <div class="appbar">
        <ha-icon icon="mdi:clipboard-check-multiple-outline"></ha-icon>
        <span class="appbar-title">IntelliKeep</span>
        <div class="appbar-actions">
          <button class="appbar-btn" @click=${() => this._navigate("/new")}>
            <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
            ${tr.newTask}
          </button>
        </div>
      </div>

      <div class="tabs">
        <div class="tab ${isTasks ? "active" : ""}" @click=${() => this._navigate("/tasks")}>
          ${tr.tasks}
          ${dueCount > 0 ? b `<span style="background:var(--error-color,#f44336);color:#fff;font-size:10px;padding:1px 5px;border-radius:8px;margin-left:5px;font-weight:700">${dueCount}</span>` : A}
        </div>
        <div class="tab ${isSettings ? "active" : ""}" @click=${() => this._navigate("/settings")}>${tr.settings}</div>
      </div>

      <div class="content" @navigate=${(e) => this._navigate(e.detail)}>
        ${isTasks && !this._loading
            ? b `
              <ik-task-list-view
                .hass=${this.hass}
                .tasks=${this._tasks}
                .enableAnimations=${this._enableAnimations}
                @navigate=${(e) => this._navigate(e.detail)}
              ></ik-task-list-view>
            `
            : b `<div class="content-scroll">
            ${this._loading
                ? b `<p>${tr.loading}</p>`
                : isNew
                    ? b `
                  <div class="page-title">${tr.newTaskTitle}</div>
                  <ik-task-form-view
                    .hass=${this.hass}
                    @navigate=${(e) => this._navigate(e.detail)}
                  ></ik-task-form-view>
                `
                    : isEdit
                        ? b `
                  <div class="page-title">${tr.editTask}</div>
                  <ik-task-form-view
                    .hass=${this.hass}
                    .task=${this._getEditTask()}
                    @navigate=${(e) => this._navigate(e.detail)}
                  ></ik-task-form-view>
                `
                        : isHistory
                            ? b `
                  <ik-task-history-view
                    .hass=${this.hass}
                    .taskId=${this._getHistoryTaskId()}
                    @navigate=${(e) => this._navigate(e.detail)}
                  ></ik-task-history-view>
                `
                            : isSettings
                                ? b `
                  <div class="page-title">${tr.settingsTitle}</div>
                  <ik-settings-view
                    .hass=${this.hass}
                    .enableAnimations=${this._enableAnimations}
                    @animations-changed=${(e) => {
                                    this._enableAnimations = e.detail;
                                    localStorage.setItem("intellikeep.animations", String(e.detail));
                                }}
                  ></ik-settings-view>
                `
                                : A}
          </div>`}
      </div>
    `;
    }
};
IntelliKeepPanel.styles = i$3 `
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--primary-background-color);
      --ik-padding: 20px;
    }

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
    .appbar-title { font-size: 20px; font-weight: 500; flex: 1; }
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

    /* Nav tabs */
    .tabs {
      display: flex;
      background: var(--card-background-color);
      border-bottom: 1px solid var(--divider-color);
      padding: 0 var(--ik-padding);
      flex-shrink: 0;
    }
    .tab {
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
    }
    .tab:hover { color: var(--primary-text-color); }
    .tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

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

    .page-title {
      font-size: 22px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin: 0 0 20px;
    }
  `;
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
    r()
], IntelliKeepPanel.prototype, "_tasks", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_currentPath", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_loading", void 0);
__decorate([
    r()
], IntelliKeepPanel.prototype, "_enableAnimations", void 0);
IntelliKeepPanel = __decorate([
    t$1("intellikeep-panel")
], IntelliKeepPanel);

export { IntelliKeepPanel };
