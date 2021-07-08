/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 124:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": () => (/* binding */ $)
/* harmony export */ });
/* unused harmony export JQ */
/**
 * JQ class is the most main class for jquery clone plugin, containing all logic: methods, props, ...
 */
class JQ {
    /**
     * @constructor init selector or element to JQ class instance
     */
    constructor(selector) {
        this.$elItems = [];
        if (typeof selector === "string") {
            document.querySelectorAll(selector).forEach((el, index) => {
                this.$elItems.push(el);
            });
        }
        else if (selector.nodeType === Node.ELEMENT_NODE) {
            this.$elItems.push(selector);
        }
        else {
            throw new SyntaxError("Selector isn't string or node element");
        }
        return this;
    }
    /**
     * Get count of inner el items
     */
    get length() {
        return this.$elItems.length;
    }
    /**
     * Get array of inner el items
     */
    get items() {
        return this.$elItems;
    }
    /**
     * The mutual function for addClass & removeClass
     */
    operateClassEventLabel(eventLabel, classes) {
        let splitClasses = this.getSplitClassess(classes);
        this.$elItems.forEach((el, index) => {
            splitClasses.forEach((currentClass, index) => {
                eval(`el.classList.${eventLabel}(currentClass)`);
            });
        });
        return this;
    }
    /**
     * Split the classes string by reapeting spaces
     */
    getSplitClassess(classes) {
        return classes.split(/\s+/);
    }
    /**
     * Add classes from the inner node elements
     * @returns finished node elements
     */
    addClass(classes) {
        return this.operateClassEventLabel("add", classes);
    }
    /**
     * Remove classes from the inner node elements
     * @returns finished node elements
     */
    removeClass(classes) {
        return this.operateClassEventLabel("remove", classes);
    }
    /**
     * Toggle classes from the inner node elements
     * @returns finished node elements
     */
    toggleClass(classes) {
        return this.operateClassEventLabel("toggle", classes);
    }
    /**
     *
     * @returns Finished node elements
     */
    hasClass(classes) {
        let splitClasses = this.getSplitClassess(classes);
        let hasClass = this.length === 0 ? false : true;
        this.$elItems.forEach((el, index) => {
            splitClasses.forEach((arrayClass, index) => {
                if (!el.classList.contains(arrayClass)) {
                    hasClass = false;
                    return;
                }
            });
        });
        return hasClass;
    }
    each(callBackFunction) {
        this.$elItems.forEach((el, index) => {
            callBackFunction(el, index);
        });
        return this;
    }
    on(currentEvent, callback) {
        this.$elItems.forEach((el, index) => {
            el.addEventListener(currentEvent, callback);
        });
        return this;
    }
    helpForEach(callbackFunction, thisArg) {
        this.$elItems.forEach(callbackFunction);
    }
    /**
     * The mutual function for attribute actions
     */
    operateAttribute(eventLabel, attr, attrValue, isData = false) {
        const finalAttr = isData ? `data-${attr}` : attr;
        const finalAttrValueParam = attrValue !== undefined ? `, '${attrValue}'` : "";
        if (eventLabel === "set" || eventLabel === "remove") {
            this.helpForEach((el, _index) => {
                eval(`el.${eventLabel}Attribute('${finalAttr}'${finalAttrValueParam})`);
            });
            return this;
        }
        else if (eventLabel === "get") {
            return eval(`this.getFirstEl()?.${eventLabel}Attribute('${finalAttr}'${finalAttrValueParam})`);
        }
        else {
            console.log("error in operateAttribute");
        }
    }
    /**
     * Get/set data attribute
     */
    data(dataName, dataValueName) {
        const eventLabel = dataValueName === undefined ? "get" : "set";
        return this.operateAttribute(eventLabel, dataName, dataValueName, true);
    }
    /**
     * Get/set attribute
     */
    attr(attrName, dataValueName) {
        const eventLabel = dataValueName === undefined ? "get" : "set";
        return this.operateAttribute(eventLabel, attrName, dataValueName);
    }
    /**
     * Remove data attribute
     */
    removeData(dataName, dataValueName) {
        return this.operateAttribute("remove", dataName, dataValueName, true);
    }
    /**
     * Remove attribute
     */
    removeAttr(attrName, dataValueName) {
        return this.operateAttribute("remove", attrName, dataValueName);
    }
    /**
     * set/ get innerHTML for first element
     */
    html(htmlString) {
        var _a;
        if (htmlString) {
            this.helpForEach((el, _index) => {
                el.innerHTML = htmlString;
            });
        }
        else {
            return (_a = this.getFirstEl()) === null || _a === void 0 ? void 0 : _a.innerHTML;
        }
        return this;
    }
    /**
     * set/ get text for first element
     */
    text(parText) {
        var _a;
        if (parText) {
            this.helpForEach((el, _index) => {
                el.textContent = parText;
            });
            return this;
        }
        else {
            return (_a = this.getFirstEl()) === null || _a === void 0 ? void 0 : _a.textContent;
        }
    }
    operateHideOrShow(cssValue) {
        this.helpForEach((el, _index) => {
            el.style.display = cssValue;
        });
    }
    removePx(value) {
        return parseFloat(value);
    }
    setPx(value) {
        return value + "px";
    }
    /**
     * help function for one element in hide()
     */
    hideEl(el, duration) {
        let totalTime = 0;
        const intervalTime = 10;
        const elHeight = +el.clientHeight;
        const elHeightPart = (elHeight * intervalTime) / duration;
        el.style.maxHeight = this.setPx(elHeight);
        el.style.overflow = "hidden";
        const intervalId = setInterval(() => {
            const elHeight = this.removePx(el.style.maxHeight) - elHeightPart;
            totalTime += intervalTime;
            el.style.maxHeight = this.setPx(elHeight);
            if (totalTime > duration) {
                clearInterval(intervalId);
                el.style.display = "none";
                el.style.removeProperty("overflow");
                el.style.removeProperty("max-height");
            }
        }, intervalTime);
    }
    hide(duration) {
        if (typeof duration === "undefined")
            this.operateHideOrShow("none");
        else {
            this.helpForEach((el, _index) => {
                this.hideEl(el, duration);
            });
        }
        return this;
    }
    /**
     * help function for one element in show()
     */
    showEl(el, duration) {
        el.style.overflow = "hidden";
        el.style.display = "block";
        el.style.opacity = "0";
        let totalTime = 0;
        const intervalTime = 10;
        const elHeight = this.removePx(getComputedStyle(el).height);
        const elHeightPart = (elHeight * intervalTime) / duration;
        el.style.height = "0";
        el.style.opacity = "1";
        const intervalId = setInterval(() => {
            const nextElHeight = this.removePx(el.style.height) + elHeightPart;
            el.style.height = this.setPx(nextElHeight);
            totalTime += intervalTime;
            if (totalTime > duration) {
                clearInterval(intervalId);
                el.style.removeProperty("overflow");
                el.style.removeProperty("opacity");
                el.style.removeProperty("height");
                el.style.display = "block";
            }
        }, intervalTime);
    }
    show(duration, display = "block") {
        if (typeof duration === "undefined") {
            this.operateHideOrShow("block");
        }
        else {
            this.helpForEach((el, _index) => {
                this.showEl(el, duration);
            });
        }
        return this;
    }
    slideToggle(duration) {
        if (typeof duration === "undefined") {
            this.helpForEach((el, index) => {
                if (getComputedStyle(el).display === "none") {
                    el.style.display = "block";
                }
                else {
                    el.style.display = "none";
                }
            });
        }
        else {
            this.helpForEach((el, index) => {
                if (getComputedStyle(el).display === "none") {
                    this.showEl(el, duration);
                }
                else {
                    this.hideEl(el, duration);
                }
            });
        }
        return this;
    }
    /**
     * get first element or first element with tag of $elItems
     */
    getFirstEl(tagName) {
        if (tagName === undefined) {
            return this.$elItems[0];
        }
        else {
            for (let $el of this.$elItems) {
                if ($el.tagName === tagName.toUpperCase()) {
                    return $el;
                }
            }
        }
    }
    /**
     * return a input value of first input in list
     * @param value a input value for set
     */
    val(value) {
        var _a, _b;
        if (value === undefined) {
            return (_a = this.getFirstEl()) === null || _a === void 0 ? void 0 : _a.getAttribute("value");
        }
        else {
            (_b = this.getFirstEl()) === null || _b === void 0 ? void 0 : _b.setAttribute("value", value);
            return this;
        }
    }
    /**
     * @param cssPropNames
     * if cssPropNames is array, then return {propName: prop:Value} or {"display": "none"} for first element
     * if cssPropNames is object, then set css prop values
     * @param object
     */
    css(cssPropNames) {
        let $firstEl = this.getFirstEl();
        if (Array.isArray(cssPropNames)) {
            let cssPropNameResult = {};
            if ($firstEl !== undefined) {
                for (let cssPropName of cssPropNames) {
                    cssPropNameResult[cssPropName] = getComputedStyle($firstEl)[cssPropName];
                }
            }
            return cssPropNameResult;
        }
        else if (typeof cssPropNames === "object") {
            if ($firstEl !== undefined) {
                for (let cssPropName in cssPropNames) {
                    this.getFirstEl().style[cssPropName] = cssPropNames[cssPropName];
                }
            }
            return this;
        }
        else {
            console.log("error in css()");
        }
        return this;
    }
    /**
     * find child selector for first element
     */
    find(selector) {
        var _a;
        let resultArray = [];
        (_a = this.getFirstEl()) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector).forEach((el, index) => {
            resultArray.push(el);
        });
        this.$elItems = resultArray;
        return this;
    }
    /**
     * return closest element for first el of array
     */
    closest(selector) {
        let isFind = false;
        let $parentEl = this.getFirstEl().parentElement;
        while (!isFind) {
            if ($parentEl === null || $parentEl === void 0 ? void 0 : $parentEl.matches(selector)) {
                isFind = true;
                this.$elItems = [$parentEl];
                return this;
            }
            else {
                $parentEl = $parentEl.parentElement;
            }
            if ($parentEl.matches("html")) {
                isFind = true;
                return undefined;
            }
        }
        //return $parentEl;
    }
    getSiblings() {
        let resultArray = [];
        const firstEl = this.getFirstEl();
        let nextSibling = firstEl;
        while (nextSibling.nextElementSibling) {
            nextSibling = nextSibling.nextElementSibling;
            resultArray.push(nextSibling);
        }
        let prevSibling = firstEl;
        while (prevSibling.previousElementSibling) {
            prevSibling = prevSibling.previousElementSibling;
            resultArray.push(prevSibling);
        }
        return resultArray;
    }
    siblings(selector) {
        let siblings = this.getSiblings();
        if (selector === undefined) {
            this.$elItems = siblings;
            return this;
        }
        else if (typeof selector === "string") {
            this.$elItems = siblings.filter((sibling) => {
                return sibling.matches(selector);
            });
        }
        return this;
    }
    append(position, element) {
        if (typeof element === "string") {
            this.helpForEach((el, index) => {
                el.insertAdjacentHTML(position, element);
            });
        }
        else if (Array.isArray(element)) {
            for (let $el of element) {
                //$el.insertAdjacentHTML(position, element.outerHTML)
            }
        }
        else if (element instanceof JQ) {
        }
        else if (element instanceof HTMLElement) {
            this.helpForEach((el, index) => {
                el.insertAdjacentHTML(position, element.outerHTML);
            });
        }
        return this;
    }
}
/**
 * Init selector or element to JQ instance
 *
 * @param selector class selector or node element
 * @returns return `JQ` class instance
 * @example
 * ``` $('body') or $('.element-class') ```
 * @example
 * let $el = document.querySelector(".element-class") -> $($el)
 */
//! добавить перегрузку: поиск без this
function $(selector) {
    //let i = ;
    return new JQ(selector);
}
//let i: JQ = new JQ("input");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/* harmony import */ var _jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(124);


window.$ = _jquery__WEBPACK_IMPORTED_MODULE_0__.$;
//$(".text").slideToggle(5000);
//console.log($(".text").css({ borderTop: "1px solid red" }));
//console.log($(".outer1212").find(".inner"));
//console.log($(".inner").closest("body").attr("id", 12));
//console.log($("div").items);
//console.log($("input").siblings("p"));
// @ts-ignore
//console.log(i);
//$(".xfgfg").
//$(".test");
//console.log($("p").text());
//$("input").val("new-value");
(0,_jquery__WEBPACK_IMPORTED_MODULE_0__.$)(".outer").append("afterbegin", (document.createElement("a").textContent = "sdf"));

})();

/******/ })()
;