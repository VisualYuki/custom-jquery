/**
 * JQ class is the most main class for jquery clone plugin, containing all logic: methods, props, ...
 */
export class JQ {
	private $elItems: HTMLElement[] = [];

	/**
	 * Get count of inner el items
	 */
	get length() {
		return this.$elItems.length;
	}

	/**
	 * Get array of inner el items
	 */
	get items(): HTMLElement[] {
		return this.$elItems;
	}

	/**
	 * @constructor init selector or element to JQ class instance
	 */
	constructor(selector: string | HTMLElement) {
		if (typeof selector === "string") {
			document.querySelectorAll<HTMLElement>(selector).forEach((el: HTMLElement, index) => {
				this.$elItems.push(el);
			});
		} else if (selector.nodeType === Node.ELEMENT_NODE) {
			this.$elItems.push(selector);
		} else {
			throw new SyntaxError("Selector isn't string or node element");
		}

		return this;
	}

	/**
	 * The mutual function for addClass & removeClass
	 */
	private operateClassEventLabel(eventLabel: string, classes: string): this {
		let splitClasses: string[] = this.getSplitClassess(classes);

		this.$elItems.forEach((el, index) => {
			splitClasses.forEach((currentClass: string, index: number) => {
				eval(`el.classList.${eventLabel}(currentClass)`);
			});
		});

		return this;
	}

	/**
	 * Split the classes string by reapeting spaces
	 */
	private getSplitClassess(classes: string): string[] {
		return classes.split(/\s+/);
	}

	/**
	 * Add classes from the inner node elements
	 * @returns finished node elements
	 */
	addClass(classes: string): this {
		return this.operateClassEventLabel("add", classes);
	}

	/**
	 * Remove classes from the inner node elements
	 * @returns finished node elements
	 */
	removeClass(classes: string): this {
		return this.operateClassEventLabel("remove", classes);
	}

	/**
	 * Toggle classes from the inner node elements
	 * @returns finished node elements
	 */
	toggleClass(classes: string): this {
		return this.operateClassEventLabel("toggle", classes);
	}

	/**
	 *
	 * @returns Finished node elements
	 */
	hasClass(classes: string): boolean {
		let splitClasses: string[] = this.getSplitClassess(classes);
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

	each(callBackFunction: Function): this {
		this.$elItems.forEach((el, index) => {
			callBackFunction(el, index);
		});

		return this;
	}

	on(currentEvent: string, callback: EventListener): this {
		this.$elItems.forEach((el, index) => {
			el.addEventListener(currentEvent, callback);
		});

		return this;
	}

	private helpForEach(callbackFunction: (value: HTMLElement, index: number, array: Element[]) => void, thisArg?: any) {
		this.$elItems.forEach(callbackFunction);
	}

	/**
	 * The mutual function for attribute actions
	 */
	private operateAttribute(eventLabel: string, attr: string, attrValue?: string, isData: boolean = false): this | string | undefined {
		const finalAttr: string = isData ? `data-${attr}` : attr;
		const finalAttrValueParam: string = attrValue !== undefined ? `, '${attrValue}'` : "";

		if (eventLabel === "set" || eventLabel === "remove") {
			this.helpForEach((el, _index) => {
				eval(`el.${eventLabel}Attribute('${finalAttr}'${finalAttrValueParam})`);
			});
			return this;
		} else if (eventLabel === "get") {
			return eval(`this.getFirstEl()?.${eventLabel}Attribute('${finalAttr}'${finalAttrValueParam})`);
		} else {
			console.log("error in operateAttribute");
		}
	}

	/**
	 * Get/set data attribute
	 */
	data(dataName: string, dataValueName?: string): this | string | undefined {
		const eventLabel: string = dataValueName === undefined ? "get" : "set";
		return this.operateAttribute(eventLabel, dataName, dataValueName, true);
	}

	/**
	 * Get/set attribute
	 */
	attr(attrName: string, dataValueName?: string): this | string | undefined {
		const eventLabel: string = dataValueName === undefined ? "get" : "set";
		return this.operateAttribute(eventLabel, attrName, dataValueName);
	}

	/**
	 * Remove data attribute
	 */
	removeData(dataName: string, dataValueName?: string): this | string | undefined {
		return this.operateAttribute("remove", dataName, dataValueName, true);
	}

	/**
	 * Remove attribute
	 */
	removeAttr(attrName: string, dataValueName?: string): this | string | undefined {
		return this.operateAttribute("remove", attrName, dataValueName);
	}

	/**
	 * set/ get innerHTML for first element
	 */
	html(htmlString?: string): this | string {
		if (htmlString) {
			this.helpForEach((el, _index) => {
				el.innerHTML = htmlString;
			});
		} else {
			return this.getFirstEl()?.innerHTML;
		}

		return this;
	}

	/**
	 * set/ get text for first element
	 */
	text(parText?: string): this | string {
		if (parText) {
			this.helpForEach((el, _index) => {
				el.textContent = parText;
			});
			return this;
		} else {
			return this.getFirstEl()?.textContent;
		}
	}

	private operateHideOrShow(cssValue: string) {
		this.helpForEach((el: HTMLElement, _index: Number) => {
			el.style.display = cssValue;
		});
	}

	private removePx(value: string): number {
		return parseFloat(value);
	}

	private setPx(value: number): string {
		return value + "px";
	}

	/**
	 * help function for one element in hide()
	 */
	private hideEl(el: HTMLElement, duration: number) {
		let totalTime: number = 0;
		const intervalTime: number = 10;
		const elHeight: number = +el.clientHeight;
		const elHeightPart: number = (elHeight * intervalTime) / duration;
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

	hide(duration?: number): this {
		if (typeof duration === "undefined") this.operateHideOrShow("none");
		else {
			this.helpForEach((el: HTMLElement, _index: Number) => {
				this.hideEl(el, duration);
			});
		}

		return this;
	}

	/**
	 * help function for one element in show()
	 */
	private showEl(el: HTMLElement, duration: number) {
		el.style.overflow = "hidden";
		el.style.display = "block";
		el.style.opacity = "0";
		let totalTime: number = 0;
		const intervalTime: number = 10;
		const elHeight: number = this.removePx(getComputedStyle(el).height);
		const elHeightPart: number = (elHeight * intervalTime) / duration;

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

	show(duration?: number, display: string = "block"): this {
		if (typeof duration === "undefined") {
			this.operateHideOrShow("block");
		} else {
			this.helpForEach((el: HTMLElement, _index: Number) => {
				this.showEl(el, duration);
			});
		}

		return this;
	}

	slideToggle(duration?: number): this {
		if (typeof duration === "undefined") {
			this.helpForEach((el: HTMLElement, index) => {
				if (getComputedStyle(el).display === "none") {
					el.style.display = "block";
				} else {
					el.style.display = "none";
				}
			});
		} else {
			this.helpForEach((el: HTMLElement, index) => {
				if (getComputedStyle(el).display === "none") {
					this.showEl(el, duration);
				} else {
					this.hideEl(el, duration);
				}
			});
		}

		return this;
	}

	/**
	 * get first element or first element with tag of $elItems
	 */
	private getFirstEl(tagName?: string): HTMLElement {
		if (tagName === undefined) {
			return this.$elItems[0];
		} else {
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
	val(value: string): string | this {
		if (value === undefined) {
			return this.getFirstEl()?.getAttribute("value");
		} else {
			this.getFirstEl()?.setAttribute("value", value);
			return this;
		}
	}

	/**
	 * @param cssPropNames
	 * if cssPropNames is array, then return {propName: prop:Value} or {"display": "none"} for first element
	 * if cssPropNames is object, then set css prop values
	 * @param object
	 */
	css(cssPropNames: string[] | { [propName: string]: string }): object | this {
		let $firstEl = this.getFirstEl();

		if (Array.isArray(cssPropNames)) {
			let cssPropNameResult: object = {};
			if ($firstEl !== undefined) {
				for (let cssPropName of cssPropNames) {
					cssPropNameResult[cssPropName] = getComputedStyle($firstEl)[cssPropName];
				}
			}

			return cssPropNameResult;
		} else if (typeof cssPropNames === "object") {
			if ($firstEl !== undefined) {
				for (let cssPropName in cssPropNames) {
					this.getFirstEl().style[cssPropName] = cssPropNames[cssPropName];
				}
			}

			return this;
		} else {
			console.log("error in css()");
		}

		return this;
	}

	/**
	 * find child selector for first element
	 */
	find(selector: string): this {
		let resultArray: HTMLElement[] = [];

		this.getFirstEl()
			?.querySelectorAll<HTMLElement>(selector)
			.forEach((el, index) => {
				resultArray.push(el);
			});

		this.$elItems = resultArray;

		return this;
	}

	/**
	 * return closest element for first el of array
	 */
	closest(selector: string): this {
		let isFind = false;
		let $parentEl = this.getFirstEl().parentElement;

		while (!isFind) {
			if ($parentEl?.matches(selector)) {
				isFind = true;
				this.$elItems = [$parentEl];
				return this;
			} else {
				$parentEl = $parentEl.parentElement;
			}

			if ($parentEl.matches("html")) {
				isFind = true;
				return undefined;
			}
		}

		//return $parentEl;
	}

	private getSiblings(): HTMLElement[] {
		let resultArray: HTMLElement[] = [];
		const firstEl: HTMLElement = this.getFirstEl();

		let nextSibling: HTMLElement = firstEl;

		while (nextSibling.nextElementSibling) {
			nextSibling = nextSibling.nextElementSibling as HTMLElement;
			resultArray.push(nextSibling);
		}

		let prevSibling: HTMLElement = firstEl;

		while (prevSibling.previousElementSibling) {
			prevSibling = prevSibling.previousElementSibling as HTMLElement;
			resultArray.push(prevSibling);
		}

		return resultArray;
	}

	siblings(selector?: string): this {
		let siblings: HTMLElement[] = this.getSiblings();
		if (selector === undefined) {
			this.$elItems = siblings;
			return this;
		} else if (typeof selector === "string") {
			this.$elItems = siblings.filter((sibling: HTMLElement) => {
				return sibling.matches(selector);
			});
		}

		return this;
	}

	append(position: InsertPosition, element: JQ | HTMLElement | HTMLElement[]): this {
		if (typeof element === "string") {
			this.helpForEach((el, index) => {
				el.insertAdjacentHTML(position, element);
			});
		} else if (Array.isArray(element)) {
			for (let $el of element) {
				//$el.insertAdjacentHTML(position, element.outerHTML)
			}
		} else if (element instanceof JQ) {
		} else if (element instanceof HTMLElement) {
			this.helpForEach((el, index) => {
				el.insertAdjacentHTML(position, element.outerHTML);
			});
		}

		return this;
	}

	//! добавить append
	//! ajax

	//! добавить click()
	//prop(prop: string): this {
	//	return this;
	//}

	// добавить prop
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
export function $(selector: string | HTMLElement) {
	//let i = ;
	return new JQ(selector);
}

module.exports = JQ;

//let i: JQ = new JQ("input");
