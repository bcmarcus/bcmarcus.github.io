/*! For license information please see 943.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkcall_to_action=self.webpackChunkcall_to_action||[]).push([[943],{5943:function(t,e,r){r.r(e),r.d(e,{default:function(){return g}});var n=r(7294),o=r(8353),a=r(2e3),i=r(9250),c=r(9655),u=[{url:"/path/to/gmail/endpoint",name:"gmail"},{url:"/path/to/outlook/endpoint",name:"outlook"},{url:"/path/to/canvas/endpoint",name:"canvas"}],l=function(){return n.createElement("div",null,u.map((function(t){var e,r=(t.name,{OAuth:"dummyOAuth",timeRemaining:10}),o=null===(e=r.timeRemaining)?"grey":e<3?"red":e<7?"yellow":"green";return n.createElement("div",{key:t.name},n.createElement("button",{className:"bg-".concat(o,"-500")},t.name),n.createElement("p",null,"Time remaining: ",r.timeRemaining," days"),n.createElement("div",{className:"h-4 w-4 bg-".concat(o,"-500")}))})))},s=function(){return n.createElement("div",null,n.createElement("h1",null,"AccountSettingsTab"))},f=r(3013);function h(t){return h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},h(t)}function p(){p=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",u=a.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function s(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),c=new P(n||[]);return o(i,"_invoke",{value:O(t,r,c)}),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=s;var m="suspendedStart",y="suspendedYield",v="executing",d="completed",g={};function b(){}function w(){}function x(){}var E={};l(E,i,(function(){return this}));var L=Object.getPrototypeOf,k=L&&L(L(C([])));k&&k!==r&&n.call(k,i)&&(E=k);var N=x.prototype=b.prototype=Object.create(E);function j(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function r(o,a,i,c){var u=f(t[o],t,a);if("throw"!==u.type){var l=u.arg,s=l.value;return s&&"object"==h(s)&&n.call(s,"__await")?e.resolve(s.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(s).then((function(t){l.value=t,i(l)}),(function(t){return r("throw",t,i,c)}))}c(u.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function O(e,r,n){var o=m;return function(a,i){if(o===v)throw new Error("Generator is already running");if(o===d){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=_(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===m)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var l=f(e,r,n);if("normal"===l.type){if(o=n.done?d:y,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=d,n.method="throw",n.arg=l.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=f(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function A(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(A,this),this.reset(!0)}function C(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(h(e)+" is not iterable")}return w.prototype=x,o(N,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=l(x,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,u,"GeneratorFunction")),t.prototype=Object.create(N),t},e.awrap=function(t){return{__await:t}},j(S.prototype),l(S.prototype,c,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new S(s(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},j(N),l(N,u,"Generator"),l(N,i,(function(){return this})),l(N,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=C,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),l=n.call(i,"finallyLoc");if(u&&l){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;T(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:C(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function m(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function y(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){m(a,n,o,i,c,"next",t)}function c(t){m(a,n,o,i,c,"throw",t)}i(void 0)}))}}function v(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,a,i,c=[],u=!0,l=!1;try{if(a=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=a.call(r)).done)&&(c.push(n.value),c.length!==e);u=!0);}catch(t){l=!0,o=t}finally{try{if(!u&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(l)throw o}}return c}}(t,e)||function(t,e){if(t){if("string"==typeof t)return d(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?d(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function d(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var g=function(){var t,e=v((0,n.useState)("dashboard"),2),r=e[0],u=e[1],h=(0,a.aC)(),m=h.signout,d=h.auth,g=h.user,b=(0,a.CU)().getData,w=(0,i.s0)(),x=v((0,n.useState)(""),2),E=(x[0],x[1]);return(0,n.useEffect)((function(){var t;!function(){(t=t||y(p().mark((function t(){var e;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!g){t.next=6;break}return console.log(g.uid),t.next=4,b("users",g.uid);case 4:e=t.sent,console.log(e);case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}()}),[g]),(0,n.useEffect)((function(){var t,e=(0,o.Aj)(d,(function(e){return(t=t||y(p().mark((function t(e){var r;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e){t.next=5;break}return t.next=3,(0,o.wU)(e);case 3:r=t.sent,E(r);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}));return function(){e()}}),[]),n.createElement("div",{className:"theme-primary flex h-screen"},n.createElement("div",{className:"w-48"},n.createElement("nav",{className:"fixed h-screen overflow-y-auto bg-blue-500 p-0"},n.createElement("div",{className:"flex flex-col h-full justify-between"},n.createElement("div",null,n.createElement(c.rU,{to:"/"},n.createElement("button",{className:"flex justify-center w-full p-0 m-0 border-none bg-transparent cursor-pointer h-20 outline-none text-white mb-4"},n.createElement("img",{src:f.Z,alt:"Logo",className:"w-24 cursor-pointer"}))),n.createElement("ul",{className:"list-none p-0"},n.createElement("li",null,n.createElement("button",{className:"flex items-center justify-between w-full px-5 py-4 m-0 border-none bg-transparent cursor-pointer text-lg text-left h-20 outline-none text-white hover:bg-black hover:bg-opacity-20 transition-colors duration-300",onClick:function(){return u("dashboard")}},"Dashboard",n.createElement("span",{className:"material-icons ml-2"},"dashboard"))))),n.createElement("div",null,n.createElement("ul",{className:"list-none p-0 mb-0"},n.createElement("li",null,n.createElement("button",{className:"flex items-center justify-between w-full px-5 py-4 m-0 border-none bg-transparent cursor-pointer text-lg text-left h-20 outline-none text-white hover:bg-black hover:bg-opacity-20 transition-colors duration-300",onClick:function(){return u("accountSettingsTab")}},"Settings",n.createElement("span",{className:"material-icons ml-2"},"settings")))),n.createElement("button",{className:"flex items-center justify-between w-full px-5 py-4 m-0 border-none bg-transparent cursor-pointer text-lg text-left h-20 outline-none text-white hover:bg-black hover:bg-opacity-20 transition-colors duration-300",onClick:function(){return(t=t||y(p().mark((function t(){return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,m(d);case 3:w("/"),t.next=9;break;case 6:t.prev=6,t.t0=t.catch(0),console.error("Error signing out:",t.t0);case 9:case"end":return t.stop()}}),t,null,[[0,6]])})))).apply(this,arguments)}},"Logout",n.createElement("span",{className:"material-icons ml-2"},"logout")))))),n.createElement("main",{className:"flex-grow p-4"},"dashboard"===r&&n.createElement(l,null),"accountSettingsTab"===r&&n.createElement(s,null)))}}}]);