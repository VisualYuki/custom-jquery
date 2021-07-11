/**
 * The main jQuery class
 */
export class JQ {
	/**
	 * An array of HTMLElements for next use by methods in the chain (for chain of responsibility (pattern))
	 */
	private $elItems: HTMLElement[] = [];

	/**
	 * Get the count of `$elItems`
	 */
	get length(): number {
		return this.$elItems.length;
	}

	/**
	 * Get the array of `$elItems`. it's needed to get an array element by index
	 * @example $("p").items[0]
	 */
	get items(): HTMLElement[] {
		return this.$elItems;
	}

	/**
	 * Create `$elItems` by the `selector`
	 */
	constructor(selectorOrElement: string | HTMLElement) {
		if (typeof selectorOrElement === 'string') {
			document.querySelectorAll<HTMLElement>(selectorOrElement).forEach((el: HTMLElement, index) => {
				this.$elItems.push(el);
			});
		} else if (selectorOrElement instanceof HTMLElement) {
			this.$elItems.push(selectorOrElement);
		} else {
			throw new SyntaxError("Selector isn't string or node element");
		}

		return this;
	}

	/**
	 * A main method for working with HTMLElement classes
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
	 * Add classes for `$elItems`
	 */
	addClass(classes: string): this {
		return this.operateClassEventLabel('add', classes);
	}

	/**
	 * Remove classes for `$elItems`
	 */
	removeClass(classes: string): this {
		return this.operateClassEventLabel('remove', classes);
	}

	/**
	 * Toggle classes for `$elItems`
	 */
	toggleClass(classes: string): this {
		return this.operateClassEventLabel('toggle', classes);
	}

	/**
	 * If each of the `$elItems` has class(es) then return true else return false
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

	/**
	 * Set callback function for each `$elItems`
	 */
	each(callBackFunction: (el: HTMLElement, index: number) => void): this {
		this.$elItems.forEach((el, index) => {
			callBackFunction(el, index);
		});

		return this;
	}

	/**
	 * Set eventHandler for each `$elItems`
	 * @param currentEvent native js event name
	 */
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
	 * The main function for attribute actions
	 */
	private operateAttribute(
		eventLabel: string,
		attr: string,
		attrValue?: string | number,
		isData: boolean = false
	): this | string | undefined {
		const finalAttr: string = isData ? `data-${attr}` : attr;
		const finalAttrValueParam: string = attrValue !== undefined ? `, '${attrValue}'` : '';

		if (eventLabel === 'set' || eventLabel === 'remove') {
			this.helpForEach((el, _index) => {
				eval(`el.${eventLabel}Attribute('${finalAttr}'${finalAttrValueParam})`);
			});
			return this;
		} else if (eventLabel === 'get') {
			return eval(`this.getFirstEl()?.${eventLabel}Attribute('${finalAttr}'${finalAttrValueParam})`);
		} else {
			console.log('error in operateAttribute');
		}
	}

	/**
	 * Get/set data attribute.
	 * @description If there are more than one `$elItems`, then return get for first element
	 */
	data(dataName: string, dataValueName?: string): this | string | undefined {
		const eventLabel: string = dataValueName === undefined ? 'get' : 'set';
		return this.operateAttribute(eventLabel, dataName, dataValueName, true);
	}

	/**
	 * Get/set attribute
	 * @description If there are more than one `$elItems`, then return get for first element
	 */
	attr(attrName: string, dataValueName?: string | number): this | string | undefined {
		const eventLabel: string = dataValueName === undefined ? 'get' : 'set';
		return this.operateAttribute(eventLabel, attrName, dataValueName);
	}

	/**
	 * Remove data attribute
	 */
	removeData(dataName: string, dataValueName?: string): this | string | undefined {
		return this.operateAttribute('remove', dataName, dataValueName, true);
	}

	/**
	 * Remove attribute
	 */
	removeAttr(attrName: string, dataValueName?: string): this | string | undefined {
		return this.operateAttribute('remove', attrName, dataValueName);
	}

	/**
	 * set for `$elItems` or get innerHTML for first element of `$elItems`
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
		return value + 'px';
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
		el.style.overflow = 'hidden';

		const intervalId = setInterval(() => {
			const elHeight = this.removePx(el.style.maxHeight) - elHeightPart;
			totalTime += intervalTime;
			el.style.maxHeight = this.setPx(elHeight);

			if (totalTime > duration) {
				clearInterval(intervalId);
				el.style.display = 'none';
				el.style.removeProperty('overflow');
				el.style.removeProperty('max-height');
			}
		}, intervalTime);
	}

	hide(duration?: number): this {
		if (typeof duration === 'undefined') this.operateHideOrShow('none');
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
		el.style.overflow = 'hidden';
		el.style.display = 'block';
		el.style.opacity = '0';
		let totalTime: number = 0;
		const intervalTime: number = 10;
		const elHeight: number = this.removePx(getComputedStyle(el).height);
		const elHeightPart: number = (elHeight * intervalTime) / duration;

		el.style.height = '0';
		el.style.opacity = '1';

		const intervalId = setInterval(() => {
			const nextElHeight = this.removePx(el.style.height) + elHeightPart;
			el.style.height = this.setPx(nextElHeight);
			totalTime += intervalTime;

			if (totalTime > duration) {
				clearInterval(intervalId);
				el.style.removeProperty('overflow');
				el.style.removeProperty('opacity');
				el.style.removeProperty('height');
				el.style.display = 'block';
			}
		}, intervalTime);
	}

	show(duration?: number, display: string = 'block'): this {
		if (typeof duration === 'undefined') {
			this.operateHideOrShow('block');
		} else {
			this.helpForEach((el: HTMLElement, _index: Number) => {
				this.showEl(el, duration);
			});
		}

		return this;
	}

	slideToggle(duration?: number): this {
		if (typeof duration === 'undefined') {
			this.helpForEach((el: HTMLElement, index) => {
				if (getComputedStyle(el).display === 'none') {
					el.style.display = 'block';
				} else {
					el.style.display = 'none';
				}
			});
		} else {
			this.helpForEach((el: HTMLElement, index) => {
				if (getComputedStyle(el).display === 'none') {
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
	val(value?: string): this | string | undefined {
		if (value === undefined) {
			return this.getFirstEl()?.getAttribute('value');
		} else {
			this.getFirstEl()?.setAttribute('value', value);
			return this;
		}
	}

	/**
	 * @param cssPropNames
	 * if cssPropNames is array, then return {propName: prop:Value} or {"display": "none"} for first element
	 * if cssPropNames is object, then set css prop values
	 * @param object
	 */
	css(cssPropNames: string[] | {[propName: string]: string}): object | this {
		let $firstEl = this.getFirstEl();

		if (Array.isArray(cssPropNames)) {
			let cssPropNameResult: object = {};
			if ($firstEl !== undefined) {
				for (let cssPropName of cssPropNames) {
					cssPropNameResult[cssPropName] = getComputedStyle($firstEl)[cssPropName];
				}
			}

			return cssPropNameResult;
		} else if (typeof cssPropNames === 'object') {
			this.helpForEach(($el, index) => {
				for (let cssPropName in cssPropNames) {
					$el.style[cssPropName] = cssPropNames[cssPropName];
				}
			});

			return this;
		} else {
			console.log('error in css()');
		}

		return this;
	}

	/**
	 * Find child selector for first element of `$elItems`
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
	 * Return closest elements for first el of `$elItems`
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

			if ($parentEl.matches('html')) {
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

	/**
	 * Return sibling elements for first el of `$elItems`
	 */
	siblings(selector?: string): this {
		let siblings: HTMLElement[] = this.getSiblings();
		if (selector === undefined) {
			this.$elItems = siblings;
			return this;
		} else if (typeof selector === 'string') {
			this.$elItems = siblings.filter((sibling: HTMLElement) => {
				return sibling.matches(selector);
			});
		}

		return this;
	}

	append(position: InsertPosition, element: string | JQ | HTMLElement | HTMLElement[]): this {
		if (typeof element === 'string') {
			this.helpForEach(($el, index) => {
				$el.insertAdjacentHTML(position, element);
			});
		} else if (Array.isArray(element)) {
			for (let $el of element) {
				this.helpForEach((el, index) => {
					el.insertAdjacentHTML(position, $el.outerHTML);
				});
			}
		} else if (element instanceof JQ) {
			this.helpForEach(($targetEl, index) => {
				for (let $triggerEl of element.items) {
					$targetEl.insertAdjacentHTML(position, $triggerEl.outerHTML);
				}
			});
		} else if (element instanceof HTMLElement) {
			this.helpForEach(($el, index) => {
				$el.insertAdjacentHTML(position, element.outerHTML);
			});
		}

		return this;
	}

	/**
	 * Trigger click event on `$elItems`
	 */
	click(): this {
		let event = new Event('click');
		this.helpForEach(($el, number) => {
			$el.dispatchEvent(event);
		});

		return this;
	}
}

/**
 * Init selector or element to JQ instance
 *
 * @param selectorOrElement class selector or node element
 * @returns return `JQ` class instance
 * @example
 * ``` $('body') or $('.element-class') ```
 * @example
 * let $el = document.querySelector(".element-class") -> $($el)
 */

//! добавить перегрузку: поиск без this
export function $(selectorOrElement: string | HTMLElement) {
	//let i = ;
	return new JQ(selectorOrElement);
}

type ajaxMethod = 'POST' | 'GET';

$.ajax = (options: {url: string; data?: object; method?: ajaxMethod; success?: Function; error?: Function}) => {
	//let formData: FormData = new FormData();
	//formData.append('id', '1');

	fetch(options.url, {
		method: options.method ? options.method : 'GET',
		//body: formData,
	})
		.then((success) => {
			return success.json();
		})
		.then((data) => options.success(data))
		.catch((error) => options.error('1212'));
};
