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

// Colors follow the panel's tokens (panel/src/styles.ts): red and amber mean overdue and due today only
const cardStyles = i$3 `
  :host {
    display: block;
    --ik-error-text: color-mix(in srgb, var(--error-color) 70%, var(--primary-text-color));
    --ik-error-fill: color-mix(in srgb, var(--error-color) 20%, transparent);
    --ik-warning-text: color-mix(in srgb, var(--warning-color) 55%, var(--primary-text-color));
    --ik-warning-fill: color-mix(in srgb, var(--warning-color) 16%, transparent);
    --ik-primary-fill: color-mix(in srgb, var(--primary-color) 16%, transparent);
    --ik-focus-ring: var(--ha-color-focus, var(--primary-color));
  }

  ha-card {
    overflow: hidden;
  }

  button {
    font: inherit;
  }

  button:focus-visible,
  a:focus-visible {
    outline: 2px solid var(--ik-focus-ring);
    outline-offset: 2px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--ik-primary-fill);
    color: var(--primary-color);
    --mdc-icon-size: 20px;
  }

  .header-text {
    flex: 1 1 auto;
    min-width: 0;
  }

  .title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--primary-text-color);
  }

  .summary {
    margin-top: 2px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  .summary .overdue {
    color: var(--ik-error-text);
  }

  .summary .today {
    color: var(--ik-warning-text);
  }

  .row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 56px;
    padding-inline-end: 12px;
    border-top: 1px solid var(--divider-color);
  }

  .check {
    width: 44px;
    height: 44px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-inline-start: 4px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: none;
    cursor: pointer;
  }

  .check:hover:not(:disabled) {
    background: var(--secondary-background-color);
  }

  .check:disabled {
    cursor: default;
  }

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

  .check:hover:not(:disabled) .box {
    border-color: var(--primary-color);
  }

  .check[aria-checked="true"] .box {
    background: var(--primary-color);
    border-color: var(--primary-color);
  }

  .text {
    flex: 1 1 auto;
    min-width: 0;
    padding: 8px 0;
  }

  .name,
  .secondary {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .name {
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .secondary {
    margin-top: 2px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  .chip {
    flex: none;
    display: inline-flex;
    align-items: center;
    height: 24px;
    padding: 0 10px;
    border-radius: 12px;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  .chip.overdue {
    background: var(--ik-error-fill);
    color: var(--ik-error-text);
  }

  .chip.today {
    background: var(--ik-warning-fill);
    color: var(--ik-warning-text);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    padding: 4px 8px;
    border-top: 1px solid var(--divider-color);
  }

  .footer a {
    display: inline-flex;
    align-items: center;
    height: 44px;
    padding: 0 12px;
    border-radius: 22px;
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-color);
    text-decoration: none;
  }

  .footer a:hover {
    background: var(--ik-primary-fill);
  }
`;

// Wording follows panel/src/translations.ts wherever the two share a phrase
const messages = {
    en: {
        loading: "Loading tasks…",
        allClear: "All caught up!",
        defaultTitle: "Home maintenance",
        overdueCount: (n) => `${n} overdue`,
        dueTodayCount: (n) => `${n} due today`,
        openCount: (n) => `${n} open task${n !== 1 ? "s" : ""}`,
        viewAll: (n) => (n === 1 ? "View 1 task" : `View all ${n} tasks`),
        markComplete: (name) => `Mark ${name} as complete`,
        taskCompleted: "Task completed",
        undoAction: "Undo",
        actionFailed: (error) => `Something went wrong: ${error}`,
        overdue: "Overdue",
        daysOverdue: (n) => `${n} day${n !== 1 ? "s" : ""} overdue`,
        editorMaxTasks: "Max tasks to show",
        editorShowLinkedEntities: "Show linked areas and devices",
        editorShowDescription: "Show task description",
    },
    pt: {
        loading: "Carregando tarefas…",
        allClear: "Está tudo em dia!",
        defaultTitle: "Manutenção da casa",
        overdueCount: (n) => `${n} atrasada${n !== 1 ? "s" : ""}`,
        dueTodayCount: (n) => `${n} vence${n !== 1 ? "m" : ""} hoje`,
        openCount: (n) => `${n} tarefa${n !== 1 ? "s" : ""} aberta${n !== 1 ? "s" : ""}`,
        viewAll: (n) => (n === 1 ? "Ver 1 tarefa" : `Ver todas as ${n} tarefas`),
        markComplete: (name) => `Marcar ${name} como concluída`,
        taskCompleted: "Tarefa concluída",
        undoAction: "Desfazer",
        actionFailed: (error) => `Algo deu errado: ${error}`,
        overdue: "Atrasada",
        daysOverdue: (n) => `${n} dia${n !== 1 ? "s" : ""} de atraso`,
        editorMaxTasks: "Máximo de tarefas a exibir",
        editorShowLinkedEntities: "Mostrar áreas e dispositivos vinculados",
        editorShowDescription: "Mostrar descrição da tarefa",
    },
    es: {
        loading: "Cargando tareas…",
        allClear: "¡Todo al día!",
        defaultTitle: "Mantenimiento del hogar",
        overdueCount: (n) => `${n} vencida${n !== 1 ? "s" : ""}`,
        dueTodayCount: (n) => `${n} vence${n !== 1 ? "n" : ""} hoy`,
        openCount: (n) => `${n} tarea${n !== 1 ? "s" : ""} abierta${n !== 1 ? "s" : ""}`,
        viewAll: (n) => (n === 1 ? "Ver 1 tarea" : `Ver las ${n} tareas`),
        markComplete: (name) => `Marcar ${name} como completada`,
        taskCompleted: "Tarea completada",
        undoAction: "Deshacer",
        actionFailed: (error) => `Algo salió mal: ${error}`,
        overdue: "Vencida",
        daysOverdue: (n) => `${n} día${n !== 1 ? "s" : ""} de retraso`,
        editorMaxTasks: "Máximo de tareas a mostrar",
        editorShowLinkedEntities: "Mostrar áreas y dispositivos vinculados",
        editorShowDescription: "Mostrar descripción de la tarea",
    },
};
function t(language) {
    const lang = language?.split("-")[0]?.toLowerCase() ?? "en";
    return messages[lang] ?? messages.en;
}

// Date helpers, kept in sync with panel/src/utils.ts (the card is a separate bundle)
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
    if (!timeZone)
        return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    const parts = formatter("en-US", { timeZone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(d);
    const part = (type) => Number(parts.find(p => p.type === type)?.value);
    return Date.UTC(part("year"), part("month") - 1, part("day"));
};
/** Calendar days from today to `d` in the Home Assistant time zone; negative once `d` is a past day. */
const daysUntil = (d, hass) => {
    if (Number.isNaN(d.getTime()))
        return NaN;
    const timeZone = hassTimeZone(hass);
    return Math.round((dayStamp(d, timeZone) - dayStamp(new Date(), timeZone)) / 86400000);
};
/** Whether `date` is midnight in the Home Assistant time zone, which is how a due date without a time is saved. */
const isMidnight = (date, hass) => {
    const parts = formatter("en-US", { timeZone: hassTimeZone(hass), hour: "numeric", minute: "numeric", hourCycle: "h23" })
        .formatToParts(new Date(date));
    const part = (type) => Number(parts.find(p => p.type === type)?.value);
    return part("hour") === 0 && part("minute") === 0;
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
/** A due date like formatRelative, but just "Today" for a task due all day (saved at midnight), as the panel calendar shows it. */
const formatRelativeDue = (date, hass) => isMidnight(date, hass) ? relativeDay(date, hass) ?? formatDate(date, hass) : formatRelative(date, hass);
/** "Tue, Oct 20"; the year shows only when it isn't the current one. */
const formatShortDate = (date, hass) => {
    const d = new Date(date);
    const timeZone = hassTimeZone(hass);
    const year = (stamp) => new Date(stamp).getUTCFullYear();
    const sameYear = year(dayStamp(d, timeZone)) === year(dayStamp(new Date(), timeZone));
    return formatDate(d, hass, { weekday: "short", year: sameYear ? undefined : "numeric" });
};
/** Overdue and due-today tasks are tinted; nothing else is (same rule as the panel). */
const urgencyOf = (task, hass) => {
    if (task.status === "overdue")
        return "overdue";
    if (task.status !== "completed" && task.due_date && daysUntil(new Date(task.due_date), hass) <= 0)
        return "today";
    return null;
};
/** Readable text of an error from a service call or anything thrown. */
const errorText = (err) => err instanceof Error ? err.message : err?.message ?? String(err);

/** The IntelliKeep panel; "View all" opens it. */
const PANEL_PATH = "/intellikeep";
const DEFAULT_MAX_TASKS = 3;
const PRIORITIES = ["critical", "high", "medium", "low"];
/** Editor label in the frontend's language. getConfigForm is static, so there is no `hass` to read it from. */
function configLabel(name) {
    const root = document.querySelector("home-assistant");
    const tr = t(root?.hass?.language);
    // `title` has no entry: Home Assistant labels that field with its own translation
    const labels = {
        max_tasks: tr.editorMaxTasks,
        show_linked_entities: tr.editorShowLinkedEntities,
        show_description: tr.editorShowDescription,
    };
    return labels[name];
}
/**
 * Dashboard card: a header with how many tasks are overdue and due today,
 * the next open tasks with a checkbox that completes them (with Undo), and
 * a link to the panel.
 */
let IntelliKeepCard = class IntelliKeepCard extends i {
    constructor() {
        super(...arguments);
        this._tasks = [];
        this._loading = true;
        this._completing = new Set();
    }
    static get styles() {
        return cardStyles;
    }
    setConfig(config) {
        this.config = config;
    }
    static getConfigForm() {
        return {
            schema: [
                { name: "title", selector: { text: {} } },
                { name: "max_tasks", selector: { number: { min: 1, max: 50, mode: "box" } } },
                { name: "show_linked_entities", selector: { boolean: {} } },
                { name: "show_description", selector: { boolean: {} } },
            ],
            computeLabel: (field) => configLabel(field.name),
        };
    }
    // No title: the card then shows its default one in the user's language
    static getStubConfig() {
        return {
            max_tasks: DEFAULT_MAX_TASKS,
            show_linked_entities: false,
            show_description: false,
        };
    }
    /** Height in 50px units, for masonry dashboards: header, one per row, footer. */
    getCardSize() {
        return 2 + (this.config?.max_tasks ?? DEFAULT_MAX_TASKS);
    }
    firstUpdated(_changedProperties) {
        this._subscribe();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    }
    async _subscribe() {
        try {
            this._unsubscribe = await this.hass.connection.subscribeMessage((msg) => {
                this._tasks = msg.tasks;
                this._loading = false;
            }, { type: "intellikeep/subscribe" });
        }
        catch (_err) {
            // Fallback: fetch once
            await this._fetchTasks();
        }
    }
    async _fetchTasks() {
        try {
            const result = await this.hass.callWS({ type: "intellikeep/get_tasks" });
            this._tasks = result.tasks;
        }
        finally {
            this._loading = false;
        }
    }
    /** Open tasks (or the configured statuses and priorities), most urgent first. */
    get _openTasks() {
        const statuses = this.config.filter_status;
        const priorities = this.config.filter_priority;
        const dueTime = (task) => (task.due_date ? Date.parse(task.due_date) : Infinity);
        return this._tasks
            .filter((task) => (statuses?.length ? statuses.includes(task.status) : task.status !== "completed"))
            .filter((task) => !priorities?.length || priorities.includes(task.priority))
            .sort((a, b) => dueTime(a) - dueTime(b)
            || PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority)
            || a.task_number - b.task_number);
    }
    _toast(message, action, duration = 4000) {
        this.dispatchEvent(new CustomEvent("hass-notification", {
            detail: { message, action, duration },
            bubbles: true,
            composed: true,
        }));
    }
    _setCompleting(taskId, busy) {
        const next = new Set(this._completing);
        if (busy)
            next.add(taskId);
        else
            next.delete(taskId);
        this._completing = next;
    }
    async _completeTask(task) {
        const tr = t(this.hass.language);
        this._setCompleting(task.task_id, true);
        try {
            await this.hass.callService("intellikeep", "complete_task", {
                task_id: task.task_id,
                completed_by: this.hass.user?.name ?? "",
            });
            this._toast(tr.taskCompleted, { text: tr.undoAction, action: () => void this._reopenTask(task) }, 8000);
        }
        catch (err) {
            this._toast(tr.actionFailed(errorText(err)));
        }
        finally {
            this._setCompleting(task.task_id, false);
        }
    }
    async _reopenTask(task) {
        try {
            await this.hass.callService("intellikeep", "reopen_task", {
                task_id: task.task_id,
                performed_by: this.hass.user?.name ?? "",
            });
        }
        catch (err) {
            this._toast(t(this.hass.language).actionFailed(errorText(err)));
        }
    }
    /** Same-tab navigation inside Home Assistant; modified clicks keep the browser's handling. */
    _openPanel(e) {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
            return;
        e.preventDefault();
        history.pushState(null, "", PANEL_PATH);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
    }
    _linkedLabel(entry) {
        if (entry.startsWith("area:")) {
            const areaId = entry.slice(5);
            return this.hass.areas?.[areaId]?.name ?? areaId;
        }
        if (entry.startsWith("device:")) {
            const deviceId = entry.slice(7);
            const device = this.hass.devices?.[deviceId];
            if (!device)
                return deviceId;
            const deviceName = device.name_by_user || device.name;
            const area = device.area_id ? this.hass.areas?.[device.area_id] : undefined;
            return area ? `${area.name} · ${deviceName}` : deviceName;
        }
        return entry;
    }
    _renderSummary(tasks) {
        const tr = t(this.hass?.language);
        if (this._loading)
            return tr.loading;
        if (tasks.length === 0)
            return tr.allClear;
        const overdue = tasks.filter((task) => urgencyOf(task, this.hass) === "overdue").length;
        const today = tasks.filter((task) => urgencyOf(task, this.hass) === "today").length;
        const parts = [
            overdue ? b `<span class="overdue">${tr.overdueCount(overdue)}</span>` : null,
            today ? b `<span class="today">${tr.dueTodayCount(today)}</span>` : null,
        ].filter((part) => part !== null);
        if (parts.length === 0)
            return tr.openCount(tasks.length);
        return parts.map((part, i) => b `${i > 0 ? " · " : ""}${part}`);
    }
    _renderChip(task) {
        const tr = t(this.hass?.language);
        if (!task.due_date)
            return A;
        const urgency = urgencyOf(task, this.hass);
        if (urgency === "overdue") {
            const days = -daysUntil(new Date(task.due_date), this.hass);
            return b `<span class="chip overdue">${days > 0 ? tr.daysOverdue(days) : tr.overdue}</span>`;
        }
        if (urgency === "today") {
            return b `<span class="chip today">${formatRelativeDue(task.due_date, this.hass)}</span>`;
        }
        return b `<span class="chip">${formatShortDate(task.due_date, this.hass)}</span>`;
    }
    _renderTask(task) {
        const tr = t(this.hass?.language);
        const completing = this._completing.has(task.task_id);
        const description = this.config.show_description ? task.description : "";
        const links = this.config.show_linked_entities
            ? task.linked_entity_ids.map((entry) => this._linkedLabel(entry)).join(", ")
            : "";
        return b `
      <div class="row">
        <button
          class="check"
          role="checkbox"
          aria-checked=${completing ? "true" : "false"}
          aria-label=${tr.markComplete(task.name)}
          ?disabled=${completing || task.status === "completed"}
          @click=${() => this._completeTask(task)}
        >
          <span class="box">${completing ? b `<ha-icon icon="mdi:check"></ha-icon>` : A}</span>
        </button>
        <div class="text">
          <div class="name">${task.name}</div>
          ${description ? b `<div class="secondary">${description}</div>` : A}
          ${links ? b `<div class="secondary">${links}</div>` : A}
        </div>
        ${this._renderChip(task)}
      </div>
    `;
    }
    render() {
        const tr = t(this.hass?.language);
        const title = this.config?.title || tr.defaultTitle;
        const open = this._openTasks;
        const shown = open.slice(0, this.config.max_tasks ?? DEFAULT_MAX_TASKS);
        return b `
      <ha-card>
        <div class="header">
          <div class="header-icon" aria-hidden="true"><ha-icon icon="mdi:wrench-outline"></ha-icon></div>
          <div class="header-text">
            <h2 class="title">${title}</h2>
            <div class="summary">${this._renderSummary(open)}</div>
          </div>
        </div>
        ${shown.map((task) => this._renderTask(task))}
        ${open.length > 0 ? b `
          <div class="footer">
            <a href=${PANEL_PATH} @click=${this._openPanel}>${tr.viewAll(open.length)}</a>
          </div>
        ` : A}
      </ha-card>
    `;
    }
};
__decorate([
    n({ attribute: false })
], IntelliKeepCard.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], IntelliKeepCard.prototype, "config", void 0);
__decorate([
    r()
], IntelliKeepCard.prototype, "_tasks", void 0);
__decorate([
    r()
], IntelliKeepCard.prototype, "_loading", void 0);
__decorate([
    r()
], IntelliKeepCard.prototype, "_completing", void 0);
IntelliKeepCard = __decorate([
    t$1("intellikeep-card")
], IntelliKeepCard);
// Register in the Lovelace card picker
window.customCards = window.customCards || [];
window.customCards.push({
    type: "intellikeep-card",
    name: "IntelliKeep Card",
    description: "Overdue and upcoming IntelliKeep tasks, completed with one click.",
    documentationURL: "https://github.com/henriquekraemer/intellikeep",
});

export { IntelliKeepCard };
