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
async function addTaskNote(hass, taskId, content, addedBy = "") {
    await hass.callService(DOMAIN, "add_task_note", {
        task_id: taskId,
        content,
        added_by: addedBy,
    });
}
async function deleteAllData(hass) {
    await hass.callService(DOMAIN, "delete_all_data", {});
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
        allPending: "All",
        completed: "Done",
        allUrgencies: "All",
        allPriorities: "All priorities",
        searchPlaceholder: "Search by name or description…",
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low",
        noTasks: "No tasks match the current filters.",
        noUpcoming: "No tasks scheduled for the selected period.",
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
        save: "Save",
        saveChanges: "Save changes",
        createTask: "Create",
        cancel: "Cancel",
        freqOneTime: "One-time",
        freqDaily: "Daily",
        freqWeekly: "Weekly",
        freqMonthly: "Monthly",
        freqYearly: "Yearly",
        freqCustom: "Custom interval",
        historyLoading: "Loading…",
        taskNotFound: "Task not found.",
        editTab: "Edit",
        notesTab: "Notes",
        historyTab: (_n) => "History",
        back: "← Back",
        executionHistory: (n) => `Execution history — ${n} record${n !== 1 ? "s" : ""}`,
        noExecutions: "No executions recorded yet.",
        taskCompletedReadonly: "Task completed — fields are read-only. Use Undo to re-open.",
        lateLabel: "Late",
        historyNavTab: "History",
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
        completedAt: "Completed at",
        completedBy: "Completed by",
        notes: "Notes",
        settingsHeading: "IntelliKeep Settings",
        settingsBody: "To change integration settings, go to Settings → Devices & Services → IntelliKeep → Configure.",
        rowsPerPage: "Rows per page:",
        of: "of",
        animationsLabel: "Task animations",
        animationsDesc: "Animate tasks when marked as done or deleted.",
        deleteAllBtn: "Delete all data",
        deleteAllHeading: "Delete all data?",
        deleteAllBody: "This will permanently delete all tasks, notes and execution history. This action cannot be undone.",
        urgentSection: "Due Today & Overdue",
        otherPendingSection: "Upcoming",
        rangeAll: "All",
        rangeWeek: "This week",
        rangeNextWeek: "Next week",
        rangeMonth: "This month",
        rangeCustom: "Custom",
        rangeTo: "to",
        rangeApply: "Apply",
        rangeClear: "Clear",
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
        allPending: "Todas",
        completed: "Concluída",
        allUrgencies: "Todas",
        allPriorities: "Todas as prioridades",
        searchPlaceholder: "Buscar por nome ou descrição…",
        critical: "Crítica",
        high: "Alta",
        medium: "Média",
        low: "Baixa",
        noTasks: "Nenhuma tarefa corresponde aos filtros.",
        noUpcoming: "Nenhuma tarefa agendada para o período selecionado.",
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
        save: "Salvar",
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
        editTab: "Editar",
        notesTab: "Notas",
        historyTab: (_n) => "Histórico",
        back: "← Voltar",
        executionHistory: (n) => `Histórico de execuções — ${n} registro${n !== 1 ? "s" : ""}`,
        noExecutions: "Nenhuma execução registrada ainda.",
        taskCompletedReadonly: "Tarefa concluída — campos em modo leitura. Use Desfazer para reabrir.",
        lateLabel: "Atrasada",
        historyNavTab: "Histórico",
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
        completedAt: "Concluída em",
        completedBy: "Concluída por",
        notes: "Observações",
        settingsHeading: "Configurações do IntelliKeep",
        settingsBody: "Para alterar as configurações da integração, acesse Configurações → Dispositivos e Serviços → IntelliKeep → Configurar.",
        rowsPerPage: "Linhas por página:",
        of: "de",
        animationsLabel: "Animações de tarefas",
        animationsDesc: "Animar tarefas ao marcar como concluída ou excluir.",
        deleteAllBtn: "Deletar todos os dados",
        deleteAllHeading: "Deletar todos os dados?",
        deleteAllBody: "Isso irá apagar permanentemente todas as tarefas, notas e histórico de execuções. Esta ação não pode ser desfeita.",
        urgentSection: "Vence Hoje & Atrasadas",
        otherPendingSection: "Próximas",
        rangeAll: "Todas",
        rangeWeek: "Esta semana",
        rangeNextWeek: "Próxima semana",
        rangeMonth: "Este mês",
        rangeCustom: "Personalizado",
        rangeTo: "até",
        rangeApply: "Aplicar",
        rangeClear: "Limpar",
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
        return b `
      <div class="row">
        <div class="priority-bar" style="background:${priorityColor(task.priority)}">
          <span>${task.priority}</span>
        </div>
        ${task.task_number ? b `
          <div class="task-num-col">
            <span>#${String(task.task_number).padStart(3, '0')}</span>
          </div>` : ""}
        <div class="row-content">
          <div class="body">
            <div class="name">
              ${task.name}
            </div>
            ${task.description ? b `<div class="desc">${task.description}</div>` : ""}
            <div class="meta">
              <span style="color:${statusColor(task.status)}">${this._relativeDue(task.due_date)}</span>
              ${task.linked_entity_ids.length
            ? b `<span>· ${task.linked_entity_ids.length} entit${task.linked_entity_ids.length > 1 ? "ies" : "y"}</span>`
            : ""}
            </div>
          </div>
        </div>
        <div class="actions">
          <slot name="actions"></slot>
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
      gap: 0;
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
    .task-num-col {
      flex-shrink: 0;
      align-self: stretch;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      padding: 0 10px;
      border-right: 1px solid var(--divider-color, rgba(0,0,0,0.12));
    }
    .task-num-col span {
      font-size: 18px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.01em;
      color: var(--secondary-text-color);
    }
    .row-content {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
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
    .task-num {
      display: none;
    }
    .actions {
      align-self: stretch;
      display: flex;
      flex-shrink: 0;
      overflow: hidden;
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
        this._filterTab = "pending";
        this._filterPriority = "all";
        this._searchQuery = "";
        this._upcomingRange = localStorage.getItem("intellikeep.upcomingRange") ?? "week";
        this._upcomingCustomFrom = localStorage.getItem("intellikeep.upcomingCustomFrom") ?? "";
        this._upcomingCustomTo = localStorage.getItem("intellikeep.upcomingCustomTo") ?? "";
        this._customFromDraft = localStorage.getItem("intellikeep.upcomingCustomFrom") ?? "";
        this._customToDraft = localStorage.getItem("intellikeep.upcomingCustomTo") ?? "";
        this._deleteTarget = null;
        this._completing = new Set();
        this._reopening = new Set();
        this._page = 0;
        this._pageSize = 25;
        this._pendingPage = 0;
        this._urgentPage = 0;
        this._exitingDone = new Set();
        this._exitingDelete = new Set();
        this._exitingUndo = new Set();
        this._exitingEdit = new Set();
        this._swipeData = new Map();
        this._swipeMoved = new Set();
    }
    connectedCallback() {
        super.connectedCallback();
        const saved = localStorage.getItem("intellikeep.filterTab");
        if (saved === "pending" || saved === "completed") {
            this._filterTab = saved;
        }
    }
    _onPointerDown(id, e) {
        if (e.pointerType !== "touch")
            return;
        e.currentTarget.setPointerCapture(e.pointerId);
        this._swipeData.set(id, { startX: e.clientX, startY: e.clientY, decided: false, canceled: false });
    }
    _onPointerMove(id, e) {
        if (e.pointerType !== "touch")
            return;
        const s = this._swipeData.get(id);
        if (!s || s.canceled)
            return;
        const dx = e.clientX - s.startX;
        const dy = e.clientY - s.startY;
        if (!s.decided) {
            if (Math.abs(dy) > Math.abs(dx) + 8) {
                s.canceled = true;
                e.currentTarget.releasePointerCapture(e.pointerId);
                return;
            }
            if (Math.abs(dx) < 8)
                return;
            s.decided = true;
        }
        const el = e.currentTarget;
        const clamped = Math.max(-120, Math.min(120, dx));
        el.style.transform = `translateX(${clamped}px)`;
        el.style.transition = "none";
        const container = el.parentElement;
        if (container) {
            const bgDone = container.querySelector(".swipe-bg-done");
            const bgDel = container.querySelector(".swipe-bg-delete");
            if (bgDone)
                bgDone.style.opacity = dx > 0 ? String(Math.min(1, dx / 80)) : "0";
            if (bgDel)
                bgDel.style.opacity = dx < 0 ? String(Math.min(1, -dx / 80)) : "0";
        }
    }
    _onPointerUp(id, task, e) {
        if (e.pointerType !== "touch")
            return;
        const s = this._swipeData.get(id);
        this._swipeData.delete(id);
        const el = e.currentTarget;
        const match = el.style.transform.match(/translateX\((-?\d+\.?\d*)px\)/);
        const offset = match ? parseFloat(match[1]) : 0;
        el.style.transition = "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.transform = "translateX(0)";
        const container = el.parentElement;
        if (container) {
            const bgDone = container.querySelector(".swipe-bg-done");
            const bgDel = container.querySelector(".swipe-bg-delete");
            if (bgDone) {
                bgDone.style.transition = "opacity 0.25s";
                bgDone.style.opacity = "0";
            }
            if (bgDel) {
                bgDel.style.transition = "opacity 0.25s";
                bgDel.style.opacity = "0";
            }
        }
        if (s?.decided)
            this._swipeMoved.add(id);
        if (!s || s.canceled || !s.decided)
            return;
        if (offset >= 80) {
            task.status !== "completed" ? this._complete(id) : this._reopen(id);
        }
        else if (offset <= -80) {
            this._deleteTarget = id;
        }
    }
    _resetPage() {
        this._page = 0;
        this._pendingPage = 0;
        this._urgentPage = 0;
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
        const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (isDesktop) {
            this.dispatchEvent(new CustomEvent("open-task-modal", { detail: taskId, bubbles: true, composed: true }));
            return;
        }
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
            await completeTask(this.hass, taskId, this.hass.user?.name ?? "");
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
        if (!this.enableAnimations) {
            this.setAttribute("no-animations", "");
        }
        else {
            this.removeAttribute("no-animations");
        }
        const tr = t(this.hass?.language);
        const q = this._searchQuery.trim().toLowerCase();
        const matchesQ = (task) => !q || task.name.toLowerCase().includes(q) || (task.description ?? "").toLowerCase().includes(q) ||
            (task.task_number ? String(task.task_number).padStart(3, '0').includes(q) : false);
        const matchesPr = (task) => this._filterPriority === "all" || task.priority === this._filterPriority;
        const countPending = this.tasks.filter(t => t.status === "due" || t.status === "overdue").length;
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
        const swipeDoneColor = (task) => task.status !== "completed"
            ? "var(--success-color, #4caf50)"
            : "var(--warning-color, #ff9800)";
        const swipeDoneIcon = (task) => task.status !== "completed" ? "mdi:check-bold" : "mdi:undo";
        const taskItem = (task) => b `
      <div class="list-item task-wrapper ${this._exitingDone.has(task.task_id) ? "exiting-done" : this._exitingDelete.has(task.task_id) ? "exiting-delete" : this._exitingUndo.has(task.task_id) ? "exiting-undo" : this._exitingEdit.has(task.task_id) ? "exiting-edit" : ""}">
        <div class="swipe-bg swipe-bg-done" style="background:${swipeDoneColor(task)}">
          <ha-icon icon=${swipeDoneIcon(task)}></ha-icon>
        </div>
        <div class="swipe-bg swipe-bg-delete">
          <ha-icon icon="mdi:trash-can"></ha-icon>
        </div>
        <div class="swipe-content"
          @pointerdown=${(e) => this._onPointerDown(task.task_id, e)}
          @pointermove=${(e) => this._onPointerMove(task.task_id, e)}
          @pointerup=${(e) => this._onPointerUp(task.task_id, task, e)}
          @pointercancel=${(e) => this._onPointerUp(task.task_id, task, e)}
          @click=${() => { if (!this._swipeMoved.delete(task.task_id))
            this._edit(task.task_id); }}>
          <ik-task-card .task=${task} .hass=${this.hass}>
            <div class="task-actions" slot="actions">
              <button class="icon-btn danger" title=${tr.del} @click=${(e) => { e.stopPropagation(); this._deleteTarget = task.task_id; }}><ha-icon icon="mdi:delete"></ha-icon></button>
              ${task.status !== "completed"
            ? b `<button class="icon-btn primary" title=${tr.done} ?disabled=${this._completing.has(task.task_id)} @click=${(e) => { e.stopPropagation(); this._complete(task.task_id); }}><ha-icon icon="mdi:check"></ha-icon></button>`
            : b `<button class="icon-btn undo" title=${tr.undo} ?disabled=${this._reopening.has(task.task_id)} @click=${(e) => { e.stopPropagation(); this._reopen(task.task_id); }}><ha-icon icon="mdi:undo"></ha-icon></button>`}
            </div>
          </ik-task-card>
        </div>
      </div>
    `;
        const filterSection = b `
      <div class="filter-bar">
        ${chip("pending", tr.pending, countPending)}
        ${chip("completed", tr.completed, countCompleted, "chip-completed")}
        <select class="priority-select" .value=${this._filterPriority} @change=${(e) => { this._filterPriority = e.target.value; this._resetPage(); }}>
          <option value="all">${tr.allPriorities}</option>
          <option value="critical">${tr.critical}</option>
          <option value="high">${tr.high}</option>
          <option value="medium">${tr.medium}</option>
          <option value="low">${tr.low}</option>
        </select>
      </div>
      <div class="filter-bar">
        <div class="search-wrapper">
          <ha-icon class="search-icon" icon="mdi:magnify"></ha-icon>
          <input
            class="search-input"
            type="search"
            .value=${this._searchQuery}
            placeholder=${tr.searchPlaceholder}
            @input=${(e) => { this._searchQuery = e.target.value; this._resetPage(); }}
          />
        </div>
      </div>
    `;
        const confirmDialog = b `
      <ik-confirm-dialog
        heading=${tr.deleteHeading}
        .open=${this._deleteTarget !== null}
        @dialog-closed=${(e) => this._confirmDelete(e.detail.confirmed)}
      >
        ${tr.deleteBody}
      </ik-confirm-dialog>
    `;
        const priorityRank = { critical: 0, high: 1, medium: 2, low: 3 };
        const sortUpcoming = (a, b) => {
            const aDate = a.due_date ? new Date(a.due_date).getTime() : Infinity;
            const bDate = b.due_date ? new Date(b.due_date).getTime() : Infinity;
            if (aDate !== bDate)
                return aDate - bDate;
            return (priorityRank[a.priority] ?? 99) - (priorityRank[b.priority] ?? 99);
        };
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const rangeEnd = (days) => { const d = new Date(today); d.setDate(d.getDate() + days); d.setHours(23, 59, 59, 999); return d; };
        // next week: Monday–Sunday of the calendar week after this one
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + (8 - today.getDay()) % 7 || 7);
        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextMonday.getDate() + 6);
        nextSunday.setHours(23, 59, 59, 999);
        // this month: rest of current calendar month
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
        let upcomingMax = null;
        let upcomingMin = null;
        if (this._upcomingRange === "week")
            upcomingMax = rangeEnd(7);
        else if (this._upcomingRange === "nextweek") {
            upcomingMin = nextMonday;
            upcomingMax = nextSunday;
        }
        else if (this._upcomingRange === "month")
            upcomingMax = monthEnd;
        else if (this._upcomingRange === "custom") {
            upcomingMin = this._upcomingCustomFrom ? new Date(this._upcomingCustomFrom) : null;
            upcomingMax = this._upcomingCustomTo ? new Date(this._upcomingCustomTo + "T23:59:59") : null;
        }
        const inUpcomingRange = (task) => {
            if (this._upcomingRange === "all")
                return true;
            if (!task.due_date)
                return false;
            const d = new Date(task.due_date);
            if (upcomingMin && d < upcomingMin)
                return false;
            if (upcomingMax && d > upcomingMax)
                return false;
            return true;
        };
        const setUpcomingRange = (v) => {
            this._upcomingRange = v;
            localStorage.setItem("intellikeep.upcomingRange", v);
        };
        if (this._filterTab === "pending") {
            const urgentTasksAll = this.tasks.filter(t => (t.status === "due" || t.status === "overdue") && matchesPr(t) && matchesQ(t));
            const urgentTotalPages = Math.max(1, Math.ceil(urgentTasksAll.length / this._pageSize));
            const urgentPage = Math.min(this._urgentPage, urgentTotalPages - 1);
            const urgentStart = urgentPage * this._pageSize;
            const urgentTasks = urgentTasksAll.slice(urgentStart, urgentStart + this._pageSize);
            const otherTasksAll = this.tasks.filter(t => t.status !== "completed" && t.status !== "due" && t.status !== "overdue" && matchesPr(t) && matchesQ(t) && inUpcomingRange(t))
                .sort(sortUpcoming);
            const pendingTotalPages = Math.max(1, Math.ceil(otherTasksAll.length / this._pageSize));
            const pendingPage = Math.min(this._pendingPage, pendingTotalPages - 1);
            const pendingStart = pendingPage * this._pageSize;
            const otherTasks = otherTasksAll.slice(pendingStart, pendingStart + this._pageSize);
            const upcomingRangeChip = (v, label) => b `
        <button class="upcoming-chip ${this._upcomingRange === v ? "active" : ""}" @click=${() => setUpcomingRange(v)}>${label}</button>
      `;
            const upcomingFilterBar = b `
        <div class="upcoming-filter">
          ${upcomingRangeChip("week", tr.rangeWeek)}
          ${upcomingRangeChip("nextweek", tr.rangeNextWeek)}
          ${upcomingRangeChip("month", tr.rangeMonth)}
          ${upcomingRangeChip("all", tr.rangeAll)}
          ${upcomingRangeChip("custom", tr.rangeCustom)}
        </div>
        ${this._upcomingRange === "custom" ? b `
          <div class="custom-range">
            <input type="date" .value=${this._customFromDraft}
              @change=${(e) => { this._customFromDraft = e.target.value; }}
            />
            <span>${tr.rangeTo}</span>
            <input type="date" .value=${this._customToDraft}
              @change=${(e) => { this._customToDraft = e.target.value; }}
            />
            <button class="custom-range-btn apply-btn" @click=${() => {
                this._upcomingCustomFrom = this._customFromDraft;
                this._upcomingCustomTo = this._customToDraft;
                localStorage.setItem("intellikeep.upcomingCustomFrom", this._upcomingCustomFrom);
                localStorage.setItem("intellikeep.upcomingCustomTo", this._upcomingCustomTo);
                this._pendingPage = 0;
            }}>${tr.rangeApply}</button>
            <button class="custom-range-btn" ?disabled=${!this._customFromDraft && !this._customToDraft} @click=${() => {
                this._customFromDraft = "";
                this._customToDraft = "";
                this._upcomingCustomFrom = "";
                this._upcomingCustomTo = "";
                localStorage.removeItem("intellikeep.upcomingCustomFrom");
                localStorage.removeItem("intellikeep.upcomingCustomTo");
                this._pendingPage = 0;
            }}>${tr.rangeClear}</button>
          </div>` : ""}
      `;
            return b `
        ${filterSection}
        <div class="sections-scroll">
          <div>
            <div class="section-header urgent">
              <ha-icon icon="mdi:clock-alert-outline" style="--mdc-icon-size:15px"></ha-icon>
              ${tr.urgentSection}
            </div>
            <ha-card>
              ${urgentTasksAll.length === 0 && !q && this._filterPriority === "all"
                ? b `
                  <div class="all-clear">
                    <div class="all-clear-emoji">🎉</div>
                    <p class="all-clear-title">${tr.allClear}</p>
                    <p class="all-clear-sub">${tr.allClearSub}</p>
                    <span class="all-clear-suggestion">${this._relaxSuggestion}</span>
                  </div>`
                : urgentTasksAll.length === 0
                    ? b `<div class="empty">${tr.noTasks}</div>`
                    : b `<div class="list-container">${urgentTasks.map(taskItem)}</div>`}
            </ha-card>
            ${urgentTasksAll.length > 0 ? b `
            <div class="pagination">
              <span>${tr.rowsPerPage}</span>
              <select .value=${String(this._pageSize)} @change=${(e) => { this._pageSize = Number(e.target.value); this._urgentPage = 0; }}>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>${urgentStart + 1}–${Math.min(urgentStart + this._pageSize, urgentTasksAll.length)} ${tr.of} ${urgentTasksAll.length}</span>
              <button class="page-btn" ?disabled=${urgentPage === 0} @click=${() => { this._urgentPage = urgentPage - 1; }}>&lt;</button>
              <button class="page-btn" ?disabled=${urgentPage >= urgentTotalPages - 1} @click=${() => { this._urgentPage = urgentPage + 1; }}>&gt;</button>
            </div>` : ""}
          </div>
          ${otherTasksAll.length > 0 ? b `
          <div>
            <div class="section-header">
              <ha-icon icon="mdi:clock-outline" style="--mdc-icon-size:15px"></ha-icon>
              ${tr.otherPendingSection}
            </div>
            ${upcomingFilterBar}
            <ha-card>
              <div class="list-container">${otherTasks.map(taskItem)}</div>
            </ha-card>
          </div>` : b `
          <div>
            <div class="section-header">
              <ha-icon icon="mdi:clock-outline" style="--mdc-icon-size:15px"></ha-icon>
              ${tr.otherPendingSection}
            </div>
            ${upcomingFilterBar}
            <ha-card>
              <div class="empty">${tr.noUpcoming}</div>
            </ha-card>
          </div>`}
          ${otherTasksAll.length > 0 ? b `
          <div class="pagination">
            <span>${tr.rowsPerPage}</span>
            <select .value=${String(this._pageSize)} @change=${(e) => { this._pageSize = Number(e.target.value); this._pendingPage = 0; }}>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>${pendingStart + 1}–${Math.min(pendingStart + this._pageSize, otherTasksAll.length)} ${tr.of} ${otherTasksAll.length}</span>
            <button class="page-btn" ?disabled=${pendingPage === 0} @click=${() => { this._pendingPage = pendingPage - 1; }}>&lt;</button>
            <button class="page-btn" ?disabled=${pendingPage >= pendingTotalPages - 1} @click=${() => { this._pendingPage = pendingPage + 1; }}>&gt;</button>
          </div>` : ""}
        </div>
        ${confirmDialog}
      `;
        }
        // completed tab
        const completedTasks = this.tasks
            .filter(t => t.status === "completed" && matchesPr(t) && matchesQ(t))
            .sort((a, b) => new Date(b.last_completed_at ?? b.updated_at).getTime() - new Date(a.last_completed_at ?? a.updated_at).getTime());
        const totalPages = Math.max(1, Math.ceil(completedTasks.length / this._pageSize));
        const page = Math.min(this._page, totalPages - 1);
        const start = page * this._pageSize;
        const pageTasks = completedTasks.slice(start, start + this._pageSize);
        return b `
      ${filterSection}
      <div class="list-scroll">
        <ha-card class="full-card">
          ${completedTasks.length === 0
            ? b `<div class="empty">${tr.noTasks}</div>`
            : b `<div class="list-container">${pageTasks.map(taskItem)}</div>`}
        </ha-card>
        ${completedTasks.length > 0 ? b `
        <div class="pagination">
          <span>${tr.rowsPerPage}</span>
          <select .value=${String(this._pageSize)} @change=${(e) => { this._pageSize = Number(e.target.value); this._resetPage(); }}>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>${start + 1}–${Math.min(start + this._pageSize, completedTasks.length)} ${tr.of} ${completedTasks.length}</span>
          <button class="page-btn" ?disabled=${page === 0} @click=${() => { this._page = page - 1; }}>&lt;</button>
          <button class="page-btn" ?disabled=${page >= totalPages - 1} @click=${() => { this._page = page + 1; }}>&gt;</button>
        </div>` : ""}
      </div>
      ${confirmDialog}
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
      border-radius: 8px;
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
    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 160px;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 8px;
      color: var(--secondary-text-color);
      --mdc-icon-size: 16px;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 5px 10px 5px 30px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
      font-family: inherit;
      box-sizing: border-box;
    }
    .search-input::placeholder { color: var(--secondary-text-color); }

    .full-card { display: block; }
    .list-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }
    .sections-scroll {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-bottom: 8px;
    }
    .section-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--secondary-text-color);
      padding: 0 2px 8px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .section-header.urgent {
      color: var(--error-color, #f44336);
    }
    .upcoming-filter {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 0 10px;
      flex-wrap: wrap;
    }
    .upcoming-chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 6px;
      border: 1.5px solid var(--divider-color);
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      transition: background 0.15s, border-color 0.15s, color 0.15s;
    }
    .upcoming-chip:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .upcoming-chip.active {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .custom-range {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      padding: 0 0 10px;
    }
    .custom-range input[type="date"] {
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 12px;
      font-family: inherit;
    }
    .custom-range span {
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .custom-range-btn {
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
    }
    .custom-range-btn:hover {
      background: var(--secondary-background-color);
    }
    .apply-btn {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
    .apply-btn:hover {
      opacity: 0.9;
    }
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
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      align-self: stretch;
      border-radius: 0;
      border: none;
      cursor: pointer;
      transition: filter 0.15s, opacity 0.15s;
      --mdc-icon-size: 20px;
      color: #fff;
    }
    .icon-btn + .icon-btn { border-left: 1px solid rgba(255,255,255,0.2); }
    .icon-btn:hover { filter: brightness(1.12); }
    .icon-btn:disabled { opacity: 0.4; cursor: default; }
    .icon-btn.primary { background: var(--primary-color); }
    .icon-btn.undo    { background: var(--warning-color, #ff9800); }
    .icon-btn.edit    { background: var(--secondary-text-color, #757575); }
    .icon-btn.danger  { background: var(--error-color, #f44336); }
    .task-actions {
      display: flex;
      align-self: stretch;
      flex-shrink: 0;
      opacity: 0;
      transition: opacity 0.18s ease;
      border-left: 1px solid var(--divider-color, rgba(0,0,0,0.08));
    }
    @media (hover: hover) {
      .task-wrapper:hover .task-actions { opacity: 1; }
    }
    :host([no-animations]) *, :host([no-animations]) *::before, :host([no-animations]) *::after {
      transition: none !important;
      animation: none !important;
    }
    :host([no-animations]) .icon-btn:hover,
    :host([no-animations]) .icon-btn:active {
      filter: none !important;
      transform: none !important;
    }
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
      padding: 12px 0;
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
      position: relative;
      border: 1.5px solid var(--divider-color);
      border-radius: 10px;
      overflow: hidden;
    }
    .swipe-bg {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      opacity: 0;
      pointer-events: none;
      --mdc-icon-size: 26px;
    }
    .swipe-bg-done {
      justify-content: flex-start;
      padding-left: 18px;
    }
    .swipe-bg-delete {
      background: var(--error-color, #f44336);
      justify-content: flex-end;
      padding-right: 18px;
    }
    .swipe-bg ha-icon { color: #fff; }
    .swipe-content {
      position: relative;
      background: var(--card-background-color);
      touch-action: pan-y;
      will-change: transform;
      cursor: pointer;
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
], IkTaskListView.prototype, "_upcomingRange", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_upcomingCustomFrom", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_upcomingCustomTo", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_customFromDraft", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_customToDraft", void 0);
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
], IkTaskListView.prototype, "_pendingPage", void 0);
__decorate([
    r()
], IkTaskListView.prototype, "_urgentPage", void 0);
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
        this.tasks = [];
        this.enableAnimations = true;
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
        this._completing = false;
        this._deleting = false;
        this._showDeleteConfirm = false;
        this._error = "";
        this._activeTab = "edit";
        this._newNoteContent = "";
        this._addingNote = false;
        this._historyPage = 0;
        this._historyPageSize = 10;
        this._notesPage = 0;
        this._prevOccPage = 0;
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
    _formatDate(iso) {
        return new Date(iso).toLocaleString();
    }
    async _complete() {
        if (!this.task)
            return;
        this._completing = true;
        try {
            if (this.task.status !== "completed") {
                await completeTask(this.hass, this.task.task_id, this.hass.user?.name ?? "");
            }
            else {
                await reopenTask(this.hass, this.task.task_id);
            }
            this._navigate("/tasks");
        }
        finally {
            this._completing = false;
        }
    }
    async _handleDelete(confirmed) {
        this._showDeleteConfirm = false;
        if (!confirmed || !this.task)
            return;
        this._deleting = true;
        try {
            await deleteTask(this.hass, this.task.task_id);
            this._navigate("/tasks");
        }
        finally {
            this._deleting = false;
        }
    }
    _cancel() {
        this._navigate("/tasks");
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
        const isCompleted = isEdit && this.task.status === "completed";
        const tr = t(this.hass?.language);
        if (!this.enableAnimations) {
            this.setAttribute("no-animations", "");
        }
        else {
            this.removeAttribute("no-animations");
        }
        const executions = isEdit ? [...(this.task.executions || [])].reverse() : [];
        const pageSize = this._historyPageSize;
        const totalPages = Math.max(1, Math.ceil(executions.length / pageSize));
        const histPage = Math.min(this._historyPage, totalPages - 1);
        const histStart = histPage * pageSize;
        const pageExecs = executions.slice(histStart, histStart + pageSize);
        const editPanel = b `
      <div class="tab-panel ${!isEdit || this._activeTab === 'edit' ? 'tab-active' : ''}">
        ${isCompleted ? b `
          <div class="readonly-banner">
            <ha-icon icon="mdi:lock-outline" style="--mdc-icon-size:16px;flex-shrink:0"></ha-icon>
            ${tr.taskCompletedReadonly}
          </div>
        ` : A}
        <label>
          ${tr.taskName}
          <input .value=${this._name} ?disabled=${isCompleted} @input=${(e) => { this._name = e.target.value; }} placeholder=${tr.taskNamePlaceholder} />
        </label>

        <label>
          ${tr.description}
          <textarea .value=${this._description} ?disabled=${isCompleted} @input=${(e) => { this._description = e.target.value; }} placeholder=${tr.descriptionPlaceholder}></textarea>
        </label>

        <div class="row">
          <label>
            ${tr.priority}
            <select .value=${this._priority} ?disabled=${isCompleted} @change=${(e) => { this._priority = e.target.value; }}>
              <option value="low">${tr.low}</option>
              <option value="medium">${tr.medium}</option>
              <option value="high">${tr.high}</option>
              <option value="critical">${tr.critical}</option>
            </select>
          </label>
          <label>
            ${tr.frequency}
            <select .value=${this._frequency} ?disabled=${isCompleted} @change=${(e) => { this._frequency = e.target.value; }}>
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
                <input type="number" min="1" ?disabled=${isCompleted} .value=${String(this._customDays ?? 30)} @input=${(e) => { this._customDays = parseInt(e.target.value, 10); }} />
              </label>
            `
            : A}

        <label>
          ${tr.dueDate}
          <div style="display:flex;gap:8px;">
            <input type="date" style="flex:1" ?disabled=${isCompleted} .value=${this._dueDate} @change=${(e) => { this._dueDate = e.target.value; }} />
            <input type="time" style="width:110px" ?disabled=${isCompleted} .value=${this._dueTime} @change=${(e) => { this._dueTime = e.target.value; }} />
          </div>
        </label>

        <div>
          <div style="font-size:13px;color:var(--secondary-text-color);margin-bottom:6px;">${tr.linkedEntities}</div>
          <div class="entity-list">
            ${this._linkedEntities.map((eid, i) => b `
                <div class="entity-row">
                  <input .value=${eid} ?disabled=${isCompleted} placeholder="sensor.example" @input=${(e) => {
            const arr = [...this._linkedEntities];
            arr[i] = e.target.value;
            this._linkedEntities = arr;
        }} />
                  <button ?disabled=${isCompleted} @click=${() => { this._linkedEntities = this._linkedEntities.filter((_, idx) => idx !== i); }}>✕</button>
                </div>
              `)}
            <button class="add-entity" ?disabled=${isCompleted} @click=${() => { this._linkedEntities = [...this._linkedEntities, ""]; }}>${tr.addEntity}</button>
          </div>
        </div>

        <div class="row">
          <label>
            ${tr.notifyBefore}
            <input type="number" min="0" max="365" ?disabled=${isCompleted} .value=${String(this._notifyDaysBefore)} @input=${(e) => { this._notifyDaysBefore = parseInt(e.target.value, 10); }} />
          </label>
          <label class="checkbox-label">
            <input type="checkbox" ?disabled=${isCompleted} .checked=${this._notifyOnOverdue} @change=${(e) => { this._notifyOnOverdue = e.target.checked; }} />
            ${tr.notifyOverdue}
          </label>
        </div>
      </div>
    `;
        const notesPanel = isEdit ? b `
      <div class="tab-panel ${this._activeTab === 'notes' ? 'tab-active' : ''}">
        <div class="notes-add-form">
          <label>
            ${tr.taskNotesLabel}
            <textarea
              .value=${this._newNoteContent}
              @input=${(e) => { this._newNoteContent = e.target.value; }}
              placeholder=${tr.taskNotesPlaceholder}
              rows="4"
            ></textarea>
          </label>
          <div class="notes-add-btn-row">
            <button
              class="save"
              ?disabled=${this._addingNote || !this._newNoteContent.trim()}
              @click=${async () => {
            if (!this.task || !this._newNoteContent.trim())
                return;
            this._addingNote = true;
            try {
                await addTaskNote(this.hass, this.task.task_id, this._newNoteContent.trim(), this.hass.user?.name ?? "");
                this._newNoteContent = "";
                this._notesPage = 0;
            }
            finally {
                this._addingNote = false;
            }
        }}
            >
              <ha-icon icon="mdi:plus"></ha-icon>
              <span class="btn-label"> ${tr.addNoteBtn}</span>
            </button>
          </div>
        </div>
        <hr class="notes-divider" />
        ${(() => {
            const allNotes = [...(this.task.notes || [])].reverse();
            const notesPageSize = this.constructor._NOTES_PAGE_SIZE;
            const notesTotalPages = Math.max(1, Math.ceil(allNotes.length / notesPageSize));
            const notesPage = Math.min(this._notesPage, notesTotalPages - 1);
            const notesStart = notesPage * notesPageSize;
            const pageNotes = allNotes.slice(notesStart, notesStart + notesPageSize);
            return allNotes.length === 0
                ? b `<div class="history-empty">${tr.noNotes}</div>`
                : b `
              <div class="notes-list">
                ${pageNotes.map((note) => b `
                  <div class="note-item">
                    <div class="note-meta">${this._formatDate(note.created_at)}${note.added_by ? b ` · ${note.added_by}` : A}</div>
                    <div class="note-content">${note.content}</div>
                  </div>
                `)}
              </div>
              ${allNotes.length > notesPageSize ? b `
                <div class="history-pagination">
                  <span>${notesStart + 1}–${Math.min(notesStart + notesPageSize, allNotes.length)} ${tr.of} ${allNotes.length}</span>
                  <button class="history-page-btn" ?disabled=${notesPage === 0} @click=${() => { this._notesPage = notesPage - 1; }}>&lt;</button>
                  <button class="history-page-btn" ?disabled=${notesPage >= notesTotalPages - 1} @click=${() => { this._notesPage = notesPage + 1; }}>&gt;</button>
                </div>
              ` : A}
            `;
        })()}
      </div>
    ` : A;
        // For children: previous_task_id is the root/family ID.
        // Show all family members (root itself + siblings) created before this task.
        const relatedTasks = isEdit && this.task.previous_task_id
            ? (() => {
                const rootId = this.task.previous_task_id;
                const currentCreatedAt = new Date(this.task.created_at).getTime();
                return this.tasks
                    .filter(t => (t.task_id === rootId || t.previous_task_id === rootId) &&
                    new Date(t.created_at).getTime() < currentCreatedAt)
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            })()
            : [];
        const historyPanel = isEdit ? b `
      <div class="tab-panel ${this._activeTab === 'history' ? 'tab-active' : ''}">
        ${executions.length === 0
            ? b `<div class="history-empty">${tr.noExecutions}</div>`
            : b `
            <div class="exec-table-wrap">
              <table class="exec-table">
                <thead>
                  <tr>
                    <th>${tr.completedAt}</th>
                    <th>${tr.completedBy}</th>
                    <th>${tr.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  ${pageExecs.map((ex) => b `
                    <tr>
                      <td>${this._formatDate(ex.completed_at)}${ex.was_late ? b `<span class="late-badge">${tr.lateLabel}</span>` : A}</td>
                      <td>${ex.completed_by || "—"}</td>
                      <td>${ex.notes || "—"}</td>
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
            ${executions.length > 0 ? b `
              <div class="history-pagination">
                <span>${tr.rowsPerPage}</span>
                <select .value=${String(this._historyPageSize)} @change=${(e) => { this._historyPageSize = Number(e.target.value); this._historyPage = 0; }}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span class="history-summary">${histStart + 1}–${Math.min(histStart + this._historyPageSize, executions.length)} ${tr.of} ${executions.length}</span>
                <button class="history-page-btn" ?disabled=${histPage === 0} @click=${() => { this._historyPage = histPage - 1; }}>&lt;</button>
                <button class="history-page-btn" ?disabled=${histPage >= totalPages - 1} @click=${() => { this._historyPage = histPage + 1; }}>&gt;</button>
              </div>
            ` : A}
          `}
        ${this.task.previous_task_id ? b `
          <div class="related-section">
            <div class="related-section-title">${tr.relatedTasksTitle}</div>
            ${(() => {
            const prevPageSize = this.constructor._PREV_OCC_PAGE_SIZE;
            const prevTotalPages = Math.max(1, Math.ceil(relatedTasks.length / prevPageSize));
            const prevPage = Math.min(this._prevOccPage, prevTotalPages - 1);
            const prevStart = prevPage * prevPageSize;
            const pageOcc = relatedTasks.slice(prevStart, prevStart + prevPageSize);
            return b `
                <div class="related-list">
                  ${pageOcc.map((rt) => b `
                    <div class="related-item">
                      <div class="related-item-num">${rt.task_number ? `#${String(rt.task_number).padStart(3, '0')}` : '—'}</div>
                      <div class="related-item-info">
                        <span class="related-item-name">
                          ${rt.due_date ? new Date(rt.due_date).toLocaleDateString() : "—"}
                        </span>
                        ${rt.executions.length > 0 ? b `
                          <span class="related-item-meta">
                            ${tr.completedBy}: ${rt.executions[rt.executions.length - 1].completed_by || "—"}
                          </span>
                        ` : A}
                      </div>
                      <span class="related-item-status ${rt.status}">${tr[rt.status] ?? rt.status}</span>
                      <button class="btn-related-view" @click=${() => this._navigate(`/edit/${rt.task_id}`)}>
                        <ha-icon icon="mdi:open-in-app"></ha-icon>${tr.viewTask}
                      </button>
                    </div>
                  `)}
                </div>
                ${relatedTasks.length > prevPageSize ? b `
                  <div class="history-pagination">
                    <span>${prevStart + 1}–${Math.min(prevStart + prevPageSize, relatedTasks.length)} ${tr.of} ${relatedTasks.length}</span>
                    <button class="history-page-btn" ?disabled=${prevPage === 0} @click=${() => { this._prevOccPage = prevPage - 1; }}>&lt;</button>
                    <button class="history-page-btn" ?disabled=${prevPage >= prevTotalPages - 1} @click=${() => { this._prevOccPage = prevPage + 1; }}>&gt;</button>
                  </div>
                ` : A}
              `;
        })()}
          </div>
        ` : A}
      </div>
    ` : A;
        return b `
      <div class="form">
        ${isEdit ? b `
          <div class="form-tabs">
            <div class="form-tab ${this._activeTab === 'edit' ? 'active' : ''}" @click=${() => { this._activeTab = "edit"; }}>${tr.editTab}</div>
            <div class="form-tab ${this._activeTab === 'notes' ? 'active' : ''}" @click=${() => { this._activeTab = "notes"; }}>${tr.notesTab}</div>
            <div class="form-tab ${this._activeTab === 'history' ? 'active' : ''}" @click=${() => { this._activeTab = "history"; this._historyPage = 0; }}>${tr.historyTab(executions.length)}</div>
          </div>
        ` : A}
        ${isEdit
            ? b `<div class="tab-panels">${editPanel}${notesPanel}${historyPanel}</div>`
            : editPanel}
                ${this._error ? b `<div class="error">${this._error}</div>` : A}
          ${isEdit ? b `
          <div class="form-footer">
            <button class="btn-delete" ?disabled=${this._deleting} @click=${() => { this._showDeleteConfirm = true; }}>
              <ha-icon icon="mdi:delete"></ha-icon><span class="btn-label"> ${tr.del}</span>
            </button>
            <div class="form-footer-spacer"></div>
            ${!isCompleted ? b `
              <button class="cancel" @click=${this._cancel}>
                <span class="btn-label">${tr.cancel}</span>
              </button>` : A}
            ${this.task.status !== "completed"
            ? b `<button class="btn-done" ?disabled=${this._completing} @click=${this._complete}>
                  <ha-icon icon="mdi:check"></ha-icon><span class="btn-label"> ${tr.done}</span>
                </button>`
            : b `<button class="btn-undo" ?disabled=${this._completing} @click=${this._complete}>
                  <ha-icon icon="mdi:undo"></ha-icon><span class="btn-label"> ${tr.undo}</span>
                </button>`}
            ${!isCompleted ? b `
              <button class="save" ?disabled=${this._saving} @click=${this._save}>
                <ha-icon icon="mdi:content-save"></ha-icon><span class="btn-label"> ${this._saving ? tr.saving : tr.save}</span>
              </button>` : A}
          </div>
          <ik-confirm-dialog
            .heading=${tr.deleteHeading}
            .body=${tr.deleteBody}
            .open=${this._showDeleteConfirm}
            @dialog-closed=${(e) => this._handleDelete(e.detail.confirmed)}
          ></ik-confirm-dialog>
        ` : b `
          <div class="form-footer">
            <div class="form-footer-spacer"></div>
            <button class="cancel" @click=${this._cancel}>
              <span class="btn-label">${tr.cancel}</span>
            </button>
            <button class="save" ?disabled=${this._saving} @click=${this._save}>
              <ha-icon icon="mdi:content-save"></ha-icon><span class="btn-label"> ${this._saving ? tr.saving : tr.createTask}</span>
            </button>
          </div>
        `}
      </div>
    `;
    }
};
IkTaskFormView._NOTES_PAGE_SIZE = 5;
IkTaskFormView._PREV_OCC_PAGE_SIZE = 5;
IkTaskFormView.styles = i$3 `
    :host { display: block; }
    .form { display: flex; flex-direction: column; gap: 16px; max-width: 600px; }
    .tab-panels {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }
    .tab-panel {
      grid-column: 1;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      visibility: hidden;
      pointer-events: none;
    }
    .tab-panel.tab-active {
      visibility: visible;
      pointer-events: auto;
    }
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
    input:disabled, select:disabled, textarea:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--secondary-background-color);
    }
    .entity-row button:disabled { opacity: 0.4; cursor: not-allowed; }
    .add-entity:disabled { opacity: 0.4; cursor: not-allowed; }
    .readonly-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .checkbox-label { flex-direction: row; align-items: center; gap: 8px; cursor: pointer; align-self: flex-end; padding-bottom: 8px; }
    .actions { display: flex; gap: 10px; margin-top: 8px; }
    button {
      padding: 10px 20px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: filter 0.15s, transform 0.15s;
    }
    @media (hover: hover) {
      button:not(:disabled):hover { filter: brightness(1.08); transform: translateY(-1px); }
      button:not(:disabled):active { transform: translateY(0); filter: brightness(0.97); }
    }
    .save { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .cancel { background: var(--secondary-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); }
    .error { color: var(--error-color, #f44336); font-size: 13px; }
    .form-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding-top: 14px;
      border-top: 1px solid var(--divider-color);
    }
    .form-footer-spacer { flex: 1; }
    .btn-done {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn-undo {
      background: var(--warning-color, #ff9800);
      color: #fff;
    }
    .btn-delete {
      background: var(--error-color, #f44336);
      color: #fff;
      margin-left: auto;
    }
    .btn-done, .btn-undo, .btn-delete, .save {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      --mdc-icon-size: 18px;
    }
    .error { color: var(--error-color, #f44336); font-size: 13px; }
    .entity-list { display: flex; flex-direction: column; gap: 4px; }
    .entity-row { display: flex; gap: 6px; align-items: center; }
    .entity-row input { flex: 1; }
    .entity-row button { padding: 6px 10px; background: var(--secondary-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); border-radius: 6px; cursor: pointer; }
    .add-entity { background: transparent; border: 1px dashed var(--divider-color); color: var(--secondary-text-color); border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 13px; align-self: flex-start; }
    :host([no-animations]) *, :host([no-animations]) *::before, :host([no-animations]) *::after {
      transition: none !important;
      animation: none !important;
    }
    :host([no-animations]) button:hover,
    :host([no-animations]) button:active {
      filter: none !important;
      transform: none !important;
    }
    .form-tabs {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: -4px;
    }
    .form-tab {
      padding: 10px 16px;
      font-size: 13px;
      font-weight: 500;
      color: var(--secondary-text-color);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      user-select: none;
      transition: color 0.15s, border-color 0.15s;
    }
    .form-tab:hover { color: var(--primary-text-color); }
    .form-tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    .history-empty {
      text-align: center;
      padding: 40px 20px;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .exec-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .exec-table th {
      text-align: left;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-weight: 500;
      border-bottom: 1px solid var(--divider-color);
    }
    .exec-table th.col-num,
    .exec-table td.col-num {
      width: 44px;
      text-align: center;
      font-size: 12px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
      white-space: nowrap;
      border-right: 1px solid var(--divider-color);
    }
    .exec-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: top;
    }
    .exec-table tbody tr:last-child td { border-bottom: none; }
    .history-pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 12px 0 0;
      flex-wrap: wrap;
    }
    @media (max-width: 600px) {
      .history-pagination {
        justify-content: flex-end;
        margin-top: 8px;
      }
      .history-pagination .history-summary {
        width: auto;
        order: 0;
      }
    }
    .history-pagination select {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .history-pagination span {
      font-size: 13px;
      color: var(--secondary-text-color);
    }
    .history-page-btn {
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 13px;
    }
    .history-page-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .exec-table-wrap {
      overflow-y: auto;
      max-height: 350px;
    }
    .late-badge {
      display: inline-block;
      background: var(--warning-color, #ff9800);
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 4px;
      margin-left: 6px;
      vertical-align: middle;
    }
    .related-section {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--divider-color);
    }
    .related-section-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color);
      margin-bottom: 10px;
    }
    .related-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .related-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      background: var(--secondary-background-color);
      border-radius: 8px;
    }
    .related-item-num {
      flex-shrink: 0;
      font-size: 13px;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      color: var(--secondary-text-color);
      min-width: 36px;
      text-align: center;
    }
    .related-item-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .related-item-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .related-item-meta {
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .related-item-status {
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 4px;
      font-weight: 600;
    }
    .related-item-status.overdue { background: var(--error-color, #f44336); color: #fff; }
    .related-item-status.due { background: var(--warning-color, #ff9800); color: #fff; }
    .related-item-status.pending { background: transparent; color: var(--secondary-text-color); border: 1px solid var(--divider-color); }
    .related-item-status.completed { background: var(--success-color, #4caf50); color: #fff; }
    .btn-related-view {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 4px 9px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      --mdc-icon-size: 13px;
    }
    .btn-related-view:hover { background: var(--card-background-color); }
    .notes-textarea {
      min-height: 200px;
    }
    .notes-add-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .notes-add-btn-row {
      display: flex;
      justify-content: flex-end;
    }
    .notes-divider {
      border: none;
      border-top: 1px solid var(--divider-color);
      margin: 16px 0 12px;
    }
    .notes-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 320px;
      overflow-y: auto;
    }
    .note-item {
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 12px 14px;
    }
    .note-meta {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-bottom: 6px;
    }
    .note-content {
      font-size: 13px;
      color: var(--primary-text-color);
      white-space: pre-wrap;
      word-break: break-word;
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
], IkTaskFormView.prototype, "_completing", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_deleting", void 0);
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
], IkTaskFormView.prototype, "_newNoteContent", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_addingNote", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_historyPage", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_historyPageSize", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_notesPage", void 0);
__decorate([
    r()
], IkTaskFormView.prototype, "_prevOccPage", void 0);
IkTaskFormView = __decorate([
    t$1("ik-task-form-view")
], IkTaskFormView);

let IkTaskHistoryView = class IkTaskHistoryView extends i {
    constructor() {
        super(...arguments);
        this.tasks = [];
        this._page = 0;
        this._pageSize = 25;
    }
    _navigate(path) {
        this.dispatchEvent(new CustomEvent("navigate", { detail: path, bubbles: true, composed: true }));
    }
    _formatDate(iso) {
        return new Date(iso).toLocaleString();
    }
    _flatExecutions() {
        const flat = [];
        for (const task of this.tasks) {
            for (const ex of task.executions ?? []) {
                flat.push({ ...ex, _taskId: task.task_id, _taskName: task.name });
            }
        }
        flat.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
        return flat;
    }
    render() {
        const tr = t(this.hass?.language);
        const all = this._flatExecutions();
        const total = all.length;
        const totalPages = Math.max(1, Math.ceil(total / this._pageSize));
        const page = Math.min(this._page, totalPages - 1);
        const start = page * this._pageSize;
        const pageItems = all.slice(start, start + this._pageSize);
        return b `
      <div class="header">
        <h2>${tr.globalHistoryTitle}</h2>
      </div>

      <ha-card>
        ${total === 0
            ? b `<div class="empty">${tr.globalHistoryEmpty}</div>`
            : b `
            <table>
              <thead>
                <tr>
                  <th>${tr.completedAt}</th>
                  <th>${tr.taskHeader}</th>
                  <th>${tr.completedBy}</th>
                  <th>${tr.notes}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${pageItems.map((ex) => b `
                  <tr>
                    <td>
                      ${this._formatDate(ex.completed_at)}
                      ${ex.was_late ? b `<span class="late-badge">${tr.lateLabel}</span>` : A}
                    </td>
                    <td class="task-name">${ex._taskName}</td>
                    <td>${ex.completed_by || "—"}</td>
                    <td>${ex.notes || "—"}</td>
                    <td>
                      <button class="btn-view" @click=${() => this._navigate(`/edit/${ex._taskId}`)}>
                        <ha-icon icon="mdi:open-in-app"></ha-icon>
                        ${tr.viewTask}
                      </button>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
            ${total > 10 ? b `
              <div class="pagination">
                <span>${tr.rowsPerPage}</span>
                <select .value=${String(this._pageSize)} @change=${(e) => {
                this._pageSize = Number(e.target.value);
                this._page = 0;
            }}>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span>${start + 1}–${Math.min(start + this._pageSize, total)} ${tr.of} ${total}</span>
                <button class="page-btn" ?disabled=${page === 0} @click=${() => { this._page = page - 1; }}>&lt;</button>
                <button class="page-btn" ?disabled=${page >= totalPages - 1} @click=${() => { this._page = page + 1; }}>&gt;</button>
              </div>
            ` : A}
          `}
      </ha-card>
    `;
    }
};
IkTaskHistoryView.styles = i$3 `
    :host { display: block; }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 8px;
    }
    h2 { margin: 0; font-size: 20px; font-weight: 500; }
    .empty {
      text-align: center;
      padding: 60px 20px;
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th {
      text-align: left;
      padding: 8px 12px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-weight: 500;
      border-bottom: 1px solid var(--divider-color);
      white-space: nowrap;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--divider-color);
      vertical-align: middle;
    }
    tbody tr:last-child td { border-bottom: none; }
    .task-name { font-weight: 500; color: var(--primary-text-color); }
    .late-badge {
      display: inline-block;
      background: var(--warning-color, #ff9800);
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      padding: 1px 6px;
      border-radius: 4px;
      margin-left: 6px;
      vertical-align: middle;
    }
    .btn-view {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 10px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: transparent;
      color: var(--primary-color);
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      --mdc-icon-size: 14px;
    }
    .btn-view:hover { background: var(--secondary-background-color); }
    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      padding: 14px 0 0;
      flex-wrap: wrap;
    }
    .pagination span { font-size: 13px; color: var(--secondary-text-color); }
    .pagination select {
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 13px;
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
    .page-btn:disabled { opacity: 0.4; cursor: default; }
    ha-card { overflow: hidden; }
  `;
__decorate([
    n({ attribute: false })
], IkTaskHistoryView.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], IkTaskHistoryView.prototype, "tasks", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_page", void 0);
__decorate([
    r()
], IkTaskHistoryView.prototype, "_pageSize", void 0);
IkTaskHistoryView = __decorate([
    t$1("ik-task-history-view")
], IkTaskHistoryView);

let IkSettingsView = class IkSettingsView extends i {
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
    .danger-zone {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--divider-color);
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
      color: #fff;
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
        this._modalTaskId = null;
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
    render() {
        const path = this._currentPath;
        const tr = t(this.hass?.language);
        const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        const isNew = path === "/new";
        const isEdit = path.startsWith("/edit/");
        const isSettings = path === "/settings";
        const isTasks = !isNew && !isEdit && !isSettings;
        const dueCount = this._tasks.filter((t) => t.status === "due" || t.status === "overdue").length;
        return b `
      <div class="appbar">
        ${isMobile && (isNew || isEdit) ? b `
          <button class="appbar-btn appbar-back" @click=${() => this._navigate("/tasks")} aria-label=${tr.back}>
            <ha-icon icon="mdi:arrow-left" style="--mdc-icon-size:20px"></ha-icon>
          </button>
        ` : b `<ha-icon icon="mdi:clipboard-check-multiple-outline"></ha-icon>`}
        <span class="appbar-title">IntelliKeep</span>
        <div class="appbar-actions">
          <button class="appbar-btn" @click=${() => {
            if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                this._modalTaskId = "__new__";
            }
            else {
                this._navigate("/new");
            }
        }}>
            <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
            ${tr.newTask}
          </button>
        </div>
      </div>

      ${!(isMobile && (isNew || isEdit)) ? b `
        <div class="tabs">
          <div class="tab ${isTasks ? "active" : ""}" @click=${() => this._navigate("/tasks")}>
            ${tr.tasks}
            ${dueCount > 0 ? b `<span style="background:var(--error-color,#f44336);color:#fff;font-size:10px;padding:1px 5px;border-radius:8px;margin-left:5px;font-weight:700">${dueCount}</span>` : A}
          </div>
          <div class="tab ${isSettings ? "active" : ""}" @click=${() => this._navigate("/settings")}>${tr.settings}</div>
        </div>
      ` : A}

      <div class="content" @navigate=${(e) => this._navigate(e.detail)} @open-task-modal=${(e) => { this._modalTaskId = e.detail; }}>
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
                    .tasks=${this._tasks}
                    .enableAnimations=${this._enableAnimations}
                    @navigate=${(e) => this._navigate(e.detail)}
                  ></ik-task-form-view>
                `
                    : isEdit
                        ? b `
                  <div class="page-title">${(() => { const t2 = this._getEditTask(); return t2?.task_number ? `${tr.editTask} #${String(t2.task_number).padStart(3, '0')}` : tr.editTask; })()}</div>
                  <ik-task-form-view
                    .hass=${this.hass}
                    .task=${this._getEditTask()}
                    .tasks=${this._tasks}
                    .enableAnimations=${this._enableAnimations}
                    @navigate=${(e) => this._navigate(e.detail)}
                  ></ik-task-form-view>
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

      ${this._modalTaskId !== null ? b `
        <div class="modal-overlay" @click=${(e) => { if (e.target === e.currentTarget)
            this._modalTaskId = null; }}>
          <div class="modal-container">
            <div class="modal-header">
              <span class="modal-title">${(() => { if (this._modalTaskId === "__new__")
            return tr.newTaskTitle; const mt = this._tasks.find(t => t.task_id === this._modalTaskId); return mt?.task_number ? `${tr.editTask} #${String(mt.task_number).padStart(3, '0')}` : tr.editTask; })()}</span>
              <button class="modal-close" @click=${() => { this._modalTaskId = null; }}><ha-icon icon="mdi:close" style="--mdc-icon-size:20px"></ha-icon></button>
            </div>
            <ik-task-form-view
              .hass=${this.hass}
              .task=${this._modalTaskId === "__new__" ? null : (this._tasks.find(t => t.task_id === this._modalTaskId) ?? null)}
              .tasks=${this._tasks}
              .enableAnimations=${this._enableAnimations}
              @navigate=${(e) => { e.stopPropagation(); this._modalTaskId = null; }}
            ></ik-task-form-view>
          </div>
        </div>
      ` : A}
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
    .appbar-back { padding: 6px 8px; margin-right: 4px; }

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

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.48);
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
__decorate([
    r()
], IntelliKeepPanel.prototype, "_modalTaskId", void 0);
IntelliKeepPanel = __decorate([
    t$1("intellikeep-panel")
], IntelliKeepPanel);

export { IntelliKeepPanel };
