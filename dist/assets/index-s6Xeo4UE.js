const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/step003-bjWkdILs.js","assets/linear-BCfk2I7B.js","assets/src-51qo7f6l.js","assets/axis-DtUEpaBV.js","assets/line-XuMgxOSY.js","assets/step004-CbX-M_uP.js","assets/step005-CDcYtmyb.js","assets/step006-B_46naNV.js","assets/parameters-Lm_51_Zf.js","assets/gpuLoop-Be70l4tF.js","assets/step007-DkDDzphp.js","assets/step008-DcPOdtPb.js","assets/step009-C_x-M_cb.js","assets/step010-F2cKC71G.js","assets/step012-ZlDfvZoc.js","assets/step014-Dj3YQ51P.js","assets/step026-CzKUKdIC.js","assets/step028-C7Dl_epO.js","assets/step041-D7QZybam.js","assets/step042-BN-z0yHe.js","assets/step043-Bg-6pLME.js","assets/step044-UbrNCNlS.js","assets/step045-B5zl_Yep.js","assets/step046-Lv8vZ7hV.js","assets/step047-DR3QuOxn.js","assets/step048-BWI2hS_v.js","assets/step049-3rL6JZy1.js","assets/step050-BYyFat5f.js","assets/step051-Bd7wTU2q.js","assets/step052-D03pFtPe.js","assets/step053-DxZoPdtj.js","assets/step054-CO4Z4fro.js","assets/step055-BtzlrRQa.js","assets/step056-DbFphfQZ.js","assets/step057-DcXZRhqH.js","assets/step058-ChU8d58O.js","assets/step059-CetpPZNw.js","assets/step060-BxAAhZYh.js","assets/step061-BbAnHJWB.js","assets/step062-CuxphMla.js","assets/step063-CdCO_1LU.js","assets/step064-COPUKah3.js","assets/step065-NfqMNcbK.js","assets/step066-DBwDDpF-.js","assets/step067-DkcXY6ln.js","assets/step068-nk0hq0FU.js","assets/step069-CXyA6XWO.js","assets/step070-CHH_BG8p.js","assets/step072-DI5YQZMI.js","assets/step074-BRB7fIA8.js","assets/step075-BXs73I2A.js","assets/step076-D1oaTnro.js","assets/step077-DFfsT7XC.js","assets/step078-DMDdqygc.js","assets/step079-B-iSSKxI.js","assets/step080-BovbWj9A.js","assets/step081-DRk64i15.js","assets/step082-Cc3XrnLV.js","assets/step083-9XqBqvMw.js","assets/step084-B-yVlfGy.js","assets/step085-DFIgQU0u.js","assets/step086-D5dzoBLI.js","assets/step089-BNNtL8Fh.js","assets/step090-s9NYqNJD.js","assets/step091-DmSHHcqT.js","assets/step092-zWdKIQOI.js","assets/step094-74wSq6nd.js","assets/step099-BWBANpeG.js","assets/step100-CcgS9RsY.js"])))=>i.map(i=>d[i]);
(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={f:.055,k:.062,Du:.2097,Dv:.105,dt:1,gridSize:256,stepsPerFrame:8,colorMode:`grayscale`,boundaryMode:`periodic`,paused:!1},t=new class extends EventTarget{constructor(){super(),this.stepIndex=0,this.params={...e},this.gpuAvailable=!1,this.renderer=null,this.scene=null,this.camera=null,this.animFrameId=null,this._stepCleanup=null}setStep(e,t){this.stepIndex=e,this._stepCleanup=t||null,this.dispatchEvent(new CustomEvent(`stepchange`,{detail:{index:e}}))}runCleanup(){this._stepCleanup&&=(this._stepCleanup(),null),this.animFrameId&&=(cancelAnimationFrame(this.animFrameId),null)}updateParam(e,t){this.params[e]=t,this.dispatchEvent(new CustomEvent(`paramchange`,{detail:{key:e,value:t}}))}resetParams(e){Object.assign(this.params,e),this.dispatchEvent(new CustomEvent(`paramsreset`,{detail:e}))}},n=`modulepreload`,r=function(e){return`/`+e},i={},a=function(e,t,a){let o=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}o=l(t.map(t=>{if(t=r(t,a),t in i)return;i[t]=!0;let o=t.endsWith(`.css`),s=o?`[rel="stylesheet"]`:``;if(a)for(let n=e.length-1;n>=0;n--){let r=e[n];if(r.href===t&&(!o||r.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${s}`))return;let l=document.createElement(`link`);if(l.rel=o?`stylesheet`:n,o||(l.as=`script`),l.crossOrigin=``,l.href=t,c&&l.setAttribute(`nonce`,c),document.head.appendChild(l),o)return new Promise((e,n)=>{l.addEventListener(`load`,e),l.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(t=>{for(let e of t||[])e.status===`rejected`&&s(e.reason);return e().catch(s)})},o={0:()=>a(()=>import(`./step001-CKOGC7kT.js`),[]),1:()=>a(()=>import(`./step002-Dw1uef9J.js`),[]),2:()=>a(()=>import(`./step003-bjWkdILs.js`),__vite__mapDeps([0,1,2,3,4])),3:()=>a(()=>import(`./step004-CbX-M_uP.js`),__vite__mapDeps([5,2])),4:()=>a(()=>import(`./step005-CDcYtmyb.js`),__vite__mapDeps([6,1,2,3,4])),5:()=>a(()=>import(`./step006-B_46naNV.js`),__vite__mapDeps([7,8,9])),6:()=>a(()=>import(`./step007-DkDDzphp.js`),__vite__mapDeps([10,8,9])),7:()=>a(()=>import(`./step008-DcPOdtPb.js`),__vite__mapDeps([11,1,2,3])),8:()=>a(()=>import(`./step009-C_x-M_cb.js`),__vite__mapDeps([12,1,2,3,4])),9:()=>a(()=>import(`./step010-F2cKC71G.js`),__vite__mapDeps([13,1,2,4])),10:()=>a(()=>import(`./step011-DYCzmli6.js`),[]),11:()=>a(()=>import(`./step012-ZlDfvZoc.js`),__vite__mapDeps([14,1,2,3,4])),12:()=>a(()=>import(`./step013-D23wo0nl.js`),[]),13:()=>a(()=>import(`./step014-Dj3YQ51P.js`),__vite__mapDeps([15,1,2,3,4])),14:()=>a(()=>import(`./step015-BfvQXenE.js`),[]),15:()=>a(()=>import(`./step016-33HIbsed.js`),[]),16:()=>a(()=>import(`./step017-sYRapwK-.js`),[]),17:()=>a(()=>import(`./step018-BKee8bIt.js`),[]),18:()=>a(()=>import(`./step019-DC175_0h.js`),[]),19:()=>a(()=>import(`./step020-DeYQk7mU.js`),[]),20:()=>a(()=>import(`./step021-DieVA8DP.js`),[]),21:()=>a(()=>import(`./step022-CMJdOP43.js`),[]),22:()=>a(()=>import(`./step023-DKJxvz0K.js`),[]),23:()=>a(()=>import(`./step024-CdVqte5d.js`),[]),24:()=>a(()=>import(`./step025-BVPNMC1r.js`),[]),25:()=>a(()=>import(`./step026-CzKUKdIC.js`),__vite__mapDeps([16,8,9])),26:()=>a(()=>import(`./step027-BVbeXZZ8.js`),[]),27:()=>a(()=>import(`./step028-C7Dl_epO.js`),__vite__mapDeps([17,8,9])),28:()=>a(()=>import(`./step029-BjKZsjpZ.js`),[]),29:()=>a(()=>import(`./step030-BR-tzRy1.js`),[]),30:()=>a(()=>import(`./step031-ZD7D24fg.js`),[]),31:()=>a(()=>import(`./step032-BRBSrCAH.js`),[]),32:()=>a(()=>import(`./step033-DZ8-7SM3.js`),[]),33:()=>a(()=>import(`./step034-VppATgVC.js`),[]),34:()=>a(()=>import(`./step035-B60RfSpw.js`),[]),35:()=>a(()=>import(`./step036-oR-S-_kd.js`),[]),36:()=>a(()=>import(`./step037-IR9fwg8f.js`),[]),37:()=>a(()=>import(`./step038-DhlcGR7k.js`),[]),38:()=>a(()=>import(`./step039-BXHD_Csx.js`),[]),39:()=>a(()=>import(`./step040-CsopJjzu.js`),[]),40:()=>a(()=>import(`./step041-D7QZybam.js`),__vite__mapDeps([18,8,9])),41:()=>a(()=>import(`./step042-BN-z0yHe.js`),__vite__mapDeps([19,8,9])),42:()=>a(()=>import(`./step043-Bg-6pLME.js`),__vite__mapDeps([20,8,9])),43:()=>a(()=>import(`./step044-UbrNCNlS.js`),__vite__mapDeps([21,8,9])),44:()=>a(()=>import(`./step045-B5zl_Yep.js`),__vite__mapDeps([22,8,9])),45:()=>a(()=>import(`./step046-Lv8vZ7hV.js`),__vite__mapDeps([23,8,9])),46:()=>a(()=>import(`./step047-DR3QuOxn.js`),__vite__mapDeps([24,8,9])),47:()=>a(()=>import(`./step048-BWI2hS_v.js`),__vite__mapDeps([25,8,9])),48:()=>a(()=>import(`./step049-3rL6JZy1.js`),__vite__mapDeps([26,8,9])),49:()=>a(()=>import(`./step050-BYyFat5f.js`),__vite__mapDeps([27,8,9])),50:()=>a(()=>import(`./step051-Bd7wTU2q.js`),__vite__mapDeps([28,8,9])),51:()=>a(()=>import(`./step052-D03pFtPe.js`),__vite__mapDeps([29,8,9])),52:()=>a(()=>import(`./step053-DxZoPdtj.js`),__vite__mapDeps([30,8,9])),53:()=>a(()=>import(`./step054-CO4Z4fro.js`),__vite__mapDeps([31,8,9])),54:()=>a(()=>import(`./step055-BtzlrRQa.js`),__vite__mapDeps([32,8,9])),55:()=>a(()=>import(`./step056-DbFphfQZ.js`),__vite__mapDeps([33,8,9])),56:()=>a(()=>import(`./step057-DcXZRhqH.js`),__vite__mapDeps([34,8,9])),57:()=>a(()=>import(`./step058-ChU8d58O.js`),__vite__mapDeps([35,8,9])),58:()=>a(()=>import(`./step059-CetpPZNw.js`),__vite__mapDeps([36,8,9])),59:()=>a(()=>import(`./step060-BxAAhZYh.js`),__vite__mapDeps([37,8,9])),60:()=>a(()=>import(`./step061-BbAnHJWB.js`),__vite__mapDeps([38,8,9])),61:()=>a(()=>import(`./step062-CuxphMla.js`),__vite__mapDeps([39,8,9])),62:()=>a(()=>import(`./step063-CdCO_1LU.js`),__vite__mapDeps([40,8,9])),63:()=>a(()=>import(`./step064-COPUKah3.js`),__vite__mapDeps([41,8,9])),64:()=>a(()=>import(`./step065-NfqMNcbK.js`),__vite__mapDeps([42,8,9])),65:()=>a(()=>import(`./step066-DBwDDpF-.js`),__vite__mapDeps([43,8,9])),66:()=>a(()=>import(`./step067-DkcXY6ln.js`),__vite__mapDeps([44,8,9])),67:()=>a(()=>import(`./step068-nk0hq0FU.js`),__vite__mapDeps([45,8,9])),68:()=>a(()=>import(`./step069-CXyA6XWO.js`),__vite__mapDeps([46,8,9])),69:()=>a(()=>import(`./step070-CHH_BG8p.js`),__vite__mapDeps([47,8,9])),70:()=>a(()=>import(`./step071-C9ZWurA4.js`),[]),71:()=>a(()=>import(`./step072-DI5YQZMI.js`),__vite__mapDeps([48,8,9])),72:()=>a(()=>import(`./step073-BZmIXlvi.js`),[]),73:()=>a(()=>import(`./step074-BRB7fIA8.js`),__vite__mapDeps([49,8,9])),74:()=>a(()=>import(`./step075-BXs73I2A.js`),__vite__mapDeps([50,8,9])),75:()=>a(()=>import(`./step076-D1oaTnro.js`),__vite__mapDeps([51,8,9])),76:()=>a(()=>import(`./step077-DFfsT7XC.js`),__vite__mapDeps([52,8,9])),77:()=>a(()=>import(`./step078-DMDdqygc.js`),__vite__mapDeps([53,8,9])),78:()=>a(()=>import(`./step079-B-iSSKxI.js`),__vite__mapDeps([54,8,9])),79:()=>a(()=>import(`./step080-BovbWj9A.js`),__vite__mapDeps([55,8,9])),80:()=>a(()=>import(`./step081-DRk64i15.js`),__vite__mapDeps([56,8,9])),81:()=>a(()=>import(`./step082-Cc3XrnLV.js`),__vite__mapDeps([57,8,9])),82:()=>a(()=>import(`./step083-9XqBqvMw.js`),__vite__mapDeps([58,8,9])),83:()=>a(()=>import(`./step084-B-yVlfGy.js`),__vite__mapDeps([59,8,9])),84:()=>a(()=>import(`./step085-DFIgQU0u.js`),__vite__mapDeps([60,8,9])),85:()=>a(()=>import(`./step086-D5dzoBLI.js`),__vite__mapDeps([61,8])),86:()=>a(()=>import(`./step087-714hqv5R.js`),[]),87:()=>a(()=>import(`./step088-A73KlMmH.js`),[]),88:()=>a(()=>import(`./step089-BNNtL8Fh.js`),__vite__mapDeps([62,8,9])),89:()=>a(()=>import(`./step090-s9NYqNJD.js`),__vite__mapDeps([63,8,9])),90:()=>a(()=>import(`./step091-DmSHHcqT.js`),__vite__mapDeps([64,8,9])),91:()=>a(()=>import(`./step092-zWdKIQOI.js`),__vite__mapDeps([65,8,9])),92:()=>a(()=>import(`./step093-Cc7NuQzu.js`),[]),93:()=>a(()=>import(`./step094-74wSq6nd.js`),__vite__mapDeps([66,8,9])),94:()=>a(()=>import(`./step095-CYphoZoa.js`),[]),95:()=>a(()=>import(`./step096-DAaqz_XJ.js`),[]),96:()=>a(()=>import(`./step097-BALkAB7y.js`),[]),97:()=>a(()=>import(`./step098-CvO8E2dI.js`),[]),98:()=>a(()=>import(`./step099-BWBANpeG.js`),__vite__mapDeps([67,8,9])),99:()=>a(()=>import(`./step100-CcgS9RsY.js`),__vite__mapDeps([68,8,9]))},s={};async function c(e){if(s[e])return s[e];let t=o[e];if(!t)throw Error(`No step at index ${e}`);let n=await t();return s[e]=n.default,n.default}var l=class e{constructor(t,n,r,i,a=`div`){this.parent=t,this.object=n,this.property=r,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add(`lil-controller`),this.domElement.classList.add(i),this.$name=document.createElement(`div`),this.$name.classList.add(`lil-name`),e.nextNameID=e.nextNameID||0,this.$name.id=`lil-gui-name-${++e.nextNameID}`,this.$widget=document.createElement(`div`),this.$widget.classList.add(`lil-widget`),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener(`keydown`,e=>e.stopPropagation()),this.domElement.addEventListener(`keyup`,e=>e.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(r)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle(`lil-disabled`,e),this.$disable.toggleAttribute(`disabled`,e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?`none`:``,this}hide(){return this.show(!1)}options(e){let t=this.parent.add(this.object,this.property,e);return t.name(this._name),this.destroy(),t}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);let e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}},u=class extends l{constructor(e,t,n){super(e,t,n,`lil-boolean`,`label`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`checkbox`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener(`change`,()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}};function d(e){let t,n;return(t=e.match(/(#|0x)?([a-f0-9]{6})/i))?n=t[2]:(t=e.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?n=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=e.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(n=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),n?`#`+n:!1}var f={isPrimitive:!0,match:e=>typeof e==`string`,fromHexString:d,toHexString:d},p={isPrimitive:!0,match:e=>typeof e==`number`,fromHexString:e=>parseInt(e.substring(1),16),toHexString:e=>`#`+e.toString(16).padStart(6,0)},m=[f,p,{isPrimitive:!1,match:e=>Array.isArray(e)||ArrayBuffer.isView(e),fromHexString(e,t,n=1){let r=p.fromHexString(e);t[0]=(r>>16&255)/255*n,t[1]=(r>>8&255)/255*n,t[2]=(r&255)/255*n},toHexString([e,t,n],r=1){r=255/r;let i=e*r<<16^t*r<<8^n*r<<0;return p.toHexString(i)}},{isPrimitive:!1,match:e=>Object(e)===e,fromHexString(e,t,n=1){let r=p.fromHexString(e);t.r=(r>>16&255)/255*n,t.g=(r>>8&255)/255*n,t.b=(r&255)/255*n},toHexString({r:e,g:t,b:n},r=1){r=255/r;let i=e*r<<16^t*r<<8^n*r<<0;return p.toHexString(i)}}];function h(e){return m.find(t=>t.match(e))}var g=class extends l{constructor(e,t,n,r){super(e,t,n,`lil-color`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`color`),this.$input.setAttribute(`tabindex`,-1),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$text=document.createElement(`input`),this.$text.setAttribute(`type`,`text`),this.$text.setAttribute(`spellcheck`,`false`),this.$text.setAttribute(`aria-labelledby`,this.$name.id),this.$display=document.createElement(`div`),this.$display.classList.add(`lil-display`),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=h(this.initialValue),this._rgbScale=r,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener(`input`,()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener(`blur`,()=>{this._callOnFinishChange()}),this.$text.addEventListener(`input`,()=>{let e=d(this.$text.value);e&&this._setValueFromHexString(e)}),this.$text.addEventListener(`focus`,()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener(`blur`,()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){let t=this._format.fromHexString(e);this.setValue(t)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}},_=class extends l{constructor(e,t,n){super(e,t,n,`lil-function`),this.$button=document.createElement(`button`),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener(`click`,e=>{e.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener(`touchstart`,()=>{},{passive:!0}),this.$disable=this.$button}},v=class extends l{constructor(e,t,n,r,i,a){super(e,t,n,`lil-number`),this._initInput(),this.min(r),this.max(i);let o=a!==void 0;this.step(o?a:this._getImplicitStep(),o),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,t=!0){return this._step=e,this._stepExplicit=t,this}updateDisplay(){let e=this.getValue();if(this._hasSlider){let t=(e-this._min)/(this._max-this._min);t=Math.max(0,Math.min(t,1)),this.$fill.style.width=t*100+`%`}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`text`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),window.matchMedia(`(pointer: coarse)`).matches&&(this.$input.setAttribute(`type`,`number`),this.$input.setAttribute(`step`,`any`)),this.$widget.appendChild(this.$input),this.$disable=this.$input;let e=()=>{let e=parseFloat(this.$input.value);isNaN(e)||(this._stepExplicit&&(e=this._snap(e)),this.setValue(this._clamp(e)))},t=e=>{let t=parseFloat(this.$input.value);isNaN(t)||(this._snapClampSetValue(t+e),this.$input.value=this.getValue())},n=e=>{e.key===`Enter`&&this.$input.blur(),e.code===`ArrowUp`&&(e.preventDefault(),t(this._step*this._arrowKeyMultiplier(e))),e.code===`ArrowDown`&&(e.preventDefault(),t(this._step*this._arrowKeyMultiplier(e)*-1))},r=e=>{this._inputFocused&&(e.preventDefault(),t(this._step*this._normalizeMouseWheel(e)))},i=!1,a,o,s,c,l,u=e=>{a=e.clientX,o=s=e.clientY,i=!0,c=this.getValue(),l=0,window.addEventListener(`mousemove`,d),window.addEventListener(`mouseup`,f)},d=e=>{if(i){let t=e.clientX-a,n=e.clientY-o;Math.abs(n)>5?(e.preventDefault(),this.$input.blur(),i=!1,this._setDraggingStyle(!0,`vertical`)):Math.abs(t)>5&&f()}if(!i){let t=e.clientY-s;l-=t*this._step*this._arrowKeyMultiplier(e),c+l>this._max?l=this._max-c:c+l<this._min&&(l=this._min-c),this._snapClampSetValue(c+l)}s=e.clientY},f=()=>{this._setDraggingStyle(!1,`vertical`),this._callOnFinishChange(),window.removeEventListener(`mousemove`,d),window.removeEventListener(`mouseup`,f)};this.$input.addEventListener(`input`,e),this.$input.addEventListener(`keydown`,n),this.$input.addEventListener(`wheel`,r,{passive:!1}),this.$input.addEventListener(`mousedown`,u),this.$input.addEventListener(`focus`,()=>{this._inputFocused=!0}),this.$input.addEventListener(`blur`,()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()})}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement(`div`),this.$slider.classList.add(`lil-slider`),this.$fill=document.createElement(`div`),this.$fill.classList.add(`lil-fill`),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add(`lil-has-slider`);let e=(e,t,n,r,i)=>(e-t)/(n-t)*(i-r)+r,t=t=>{let n=this.$slider.getBoundingClientRect(),r=e(t,n.left,n.right,this._min,this._max);this._snapClampSetValue(r)},n=e=>{this._setDraggingStyle(!0),t(e.clientX),window.addEventListener(`mousemove`,r),window.addEventListener(`mouseup`,i)},r=e=>{t(e.clientX)},i=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener(`mousemove`,r),window.removeEventListener(`mouseup`,i)},a=!1,o,s,c=e=>{e.preventDefault(),this._setDraggingStyle(!0),t(e.touches[0].clientX),a=!1},l=e=>{e.touches.length>1||(this._hasScrollBar?(o=e.touches[0].clientX,s=e.touches[0].clientY,a=!0):c(e),window.addEventListener(`touchmove`,u,{passive:!1}),window.addEventListener(`touchend`,d))},u=e=>{if(a){let t=e.touches[0].clientX-o,n=e.touches[0].clientY-s;Math.abs(t)>Math.abs(n)?c(e):(window.removeEventListener(`touchmove`,u),window.removeEventListener(`touchend`,d))}else e.preventDefault(),t(e.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener(`touchmove`,u),window.removeEventListener(`touchend`,d)},f=this._callOnFinishChange.bind(this),p;this.$slider.addEventListener(`mousedown`,n),this.$slider.addEventListener(`touchstart`,l,{passive:!1}),this.$slider.addEventListener(`wheel`,e=>{if(Math.abs(e.deltaX)<Math.abs(e.deltaY)&&this._hasScrollBar)return;e.preventDefault();let t=this._normalizeMouseWheel(e)*this._step;this._snapClampSetValue(this.getValue()+t),this.$input.value=this.getValue(),clearTimeout(p),p=setTimeout(f,400)},{passive:!1})}_setDraggingStyle(e,t=`horizontal`){this.$slider&&this.$slider.classList.toggle(`lil-active`,e),document.body.classList.toggle(`lil-dragging`,e),document.body.classList.toggle(`lil-${t}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:t,deltaY:n}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(t=0,n=-e.wheelDelta/120,n*=this._stepExplicit?1:10),t+-n}_arrowKeyMultiplier(e){let t=this._stepExplicit?1:10;return e.shiftKey?t*=10:e.altKey&&(t/=10),t}_snap(e){let t=0;return this._hasMin?t=this._min:this._hasMax&&(t=this._max),e-=t,e=Math.round(e/this._step)*this._step,e+=t,e=parseFloat(e.toPrecision(15)),e}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){let e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}},y=class extends l{constructor(e,t,n,r){super(e,t,n,`lil-option`),this.$select=document.createElement(`select`),this.$select.setAttribute(`aria-labelledby`,this.$name.id),this.$display=document.createElement(`div`),this.$display.classList.add(`lil-display`),this.$select.addEventListener(`change`,()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener(`focus`,()=>{this.$display.classList.add(`lil-focus`)}),this.$select.addEventListener(`blur`,()=>{this.$display.classList.remove(`lil-focus`)}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(r)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(e=>{let t=document.createElement(`option`);t.textContent=e,this.$select.appendChild(t)}),this.updateDisplay(),this}updateDisplay(){let e=this.getValue(),t=this._values.indexOf(e);return this.$select.selectedIndex=t,this.$display.textContent=t===-1?e:this._names[t],this}},b=class extends l{constructor(e,t,n){super(e,t,n,`lil-string`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`text`),this.$input.setAttribute(`spellcheck`,`false`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$input.addEventListener(`input`,()=>{this.setValue(this.$input.value)}),this.$input.addEventListener(`keydown`,e=>{e.code===`Enter`&&this.$input.blur()}),this.$input.addEventListener(`blur`,()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}},x=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;function S(e){let t=document.createElement(`style`);t.innerHTML=e;let n=document.querySelector(`head link[rel=stylesheet], head style`);n?document.head.insertBefore(t,n):document.head.appendChild(t)}var C=!1,w=class e{constructor({parent:e,autoPlace:t=e===void 0,container:n,width:r,title:i=`Controls`,closeFolders:a=!1,injectStyles:o=!0,touchStyles:s=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement(`div`),this.domElement.classList.add(`lil-gui`),this.$title=document.createElement(`button`),this.$title.classList.add(`lil-title`),this.$title.setAttribute(`aria-expanded`,!0),this.$title.addEventListener(`click`,()=>this.openAnimated(this._closed)),this.$title.addEventListener(`touchstart`,()=>{},{passive:!0}),this.$children=document.createElement(`div`),this.$children.classList.add(`lil-children`),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(i),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add(`lil-root`),s&&this.domElement.classList.add(`lil-allow-touch-styles`),!C&&o&&(S(x),C=!0),n?n.appendChild(this.domElement):t&&(this.domElement.classList.add(`lil-auto-place`,`autoPlace`),document.body.appendChild(this.domElement)),r&&this.domElement.style.setProperty(`--width`,r+`px`),this._closeFolders=a}add(e,t,n,r,i){if(Object(n)===n)return new y(this,e,t,n);let a=e[t];switch(typeof a){case`number`:return new v(this,e,t,n,r,i);case`boolean`:return new u(this,e,t);case`string`:return new b(this,e,t);case`function`:return new _(this,e,t)}console.error(`gui.add failed
	property:`,t,`
	object:`,e,`
	value:`,a)}addColor(e,t,n=1){return new g(this,e,t,n)}addFolder(t){let n=new e({parent:this,title:t});return this.root._closeFolders&&n.close(),n}load(e,t=!0){return e.controllers&&this.controllers.forEach(t=>{t instanceof _||t._name in e.controllers&&t.load(e.controllers[t._name])}),t&&e.folders&&this.folders.forEach(t=>{t._title in e.folders&&t.load(e.folders[t._title])}),this}save(e=!0){let t={controllers:{},folders:{}};return this.controllers.forEach(e=>{if(!(e instanceof _)){if(e._name in t.controllers)throw Error(`Cannot save GUI with duplicate property "${e._name}"`);t.controllers[e._name]=e.save()}}),e&&this.folders.forEach(e=>{if(e._title in t.folders)throw Error(`Cannot save GUI with duplicate folder "${e._title}"`);t.folders[e._title]=e.save()}),t}open(e=!0){return this._setClosed(!e),this.$title.setAttribute(`aria-expanded`,!this._closed),this.domElement.classList.toggle(`lil-closed`,this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?`none`:``,this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute(`aria-expanded`,!this._closed),requestAnimationFrame(()=>{let t=this.$children.clientHeight;this.$children.style.height=t+`px`,this.domElement.classList.add(`lil-transition`);let n=e=>{e.target===this.$children&&(this.$children.style.height=``,this.domElement.classList.remove(`lil-transition`),this.$children.removeEventListener(`transitionend`,n))};this.$children.addEventListener(`transitionend`,n);let r=e?this.$children.scrollHeight:0;this.domElement.classList.toggle(`lil-closed`,!e),requestAnimationFrame(()=>{this.$children.style.height=r+`px`})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(e=>e.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(t=>{e=e.concat(t.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(t=>{e=e.concat(t.foldersRecursive())}),e}},T=null,E={create(e){return this.destroy(),T=new w({container:e,title:`Parameters`,width:220}),e.style.position=`relative`,T},get(){return T},destroy(){if(T){try{T.destroy()}catch{}T=null}}};async function D(e){if(e<0||e>=100)return;t.runCleanup(),E.destroy(),N(),document.getElementById(`col-math`).scrollTop=0,document.getElementById(`col-code`).scrollTop=0;let n=await c(e);j(n.math),M(n.code);let r=document.getElementById(`viz-container`),i=n.init?n.init(r,t):null;t.setStep(e,i),A(e,n.title),history.replaceState(null,``,`#${e+1}`)}function O(){D(t.stepIndex+1)}function k(){D(t.stepIndex-1)}function A(e,t){document.getElementById(`step-indicator`).textContent=`${e+1} / 100`,document.getElementById(`step-title-display`).textContent=t||``,document.getElementById(`progress-fill`).style.width=`${(e+1)/100*100}%`,document.getElementById(`btn-prev`).disabled=e===0,document.getElementById(`btn-next`).disabled=e===99}function j(e){let t=document.getElementById(`math-content`);t.innerHTML=e||``,window.renderMathInElement&&window.renderMathInElement(t,{delimiters:[{left:`$$`,right:`$$`,display:!0},{left:`$`,right:`$`,display:!1}]})}function M(e){let t=document.getElementById(`code-content`);if(!e){t.innerHTML=``;return}t.innerHTML=typeof e==`string`?e:``,t.querySelectorAll(`pre code`).forEach(e=>{window.hljs&&window.hljs.highlightElement(e)})}function N(){let e=document.getElementById(`viz-container`);for(;e.firstChild;)e.removeChild(e.firstChild)}function P(){document.getElementById(`btn-next`).addEventListener(`click`,O),document.getElementById(`btn-prev`).addEventListener(`click`,k),document.addEventListener(`keydown`,e=>{e.target.tagName===`INPUT`||e.target.tagName===`TEXTAREA`||(e.key===`ArrowRight`&&O(),e.key===`ArrowLeft`&&k(),e.key===` `&&(e.preventDefault(),t.params.paused=!t.params.paused))});let e=parseInt(window.location.hash.replace(`#`,``));D(isFinite(e)&&e>=1&&e<=100?e-1:parseInt(localStorage.getItem(`gs-step`)||`0`)||0),t.addEventListener(`stepchange`,e=>{localStorage.setItem(`gs-step`,String(e.detail.index))})}function F(){return new Promise(e=>{if(window.renderMathInElement){e();return}let t=document.createElement(`script`);t.src=`https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js`,t.onload=()=>{let t=document.createElement(`script`);t.src=`https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js`,t.onload=e,document.head.appendChild(t)},document.head.appendChild(t)})}function I(){return new Promise(e=>{if(window.hljs){e();return}let t=document.createElement(`script`);t.src=`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js`,t.onload=e,document.head.appendChild(t);let n=document.createElement(`link`);n.rel=`stylesheet`,n.href=`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css`,document.head.appendChild(n)})}async function L(){await Promise.all([F(),I()]),P()}L().catch(e=>{console.error(`Failed to initialize course:`,e),document.body.innerHTML=`<pre style="padding:20px;font-family:monospace;color:red">
Error: ${e.message}
Check browser console for details.
  </pre>`});export{E as t};