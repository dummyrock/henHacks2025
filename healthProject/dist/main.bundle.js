/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@gsilber/webez/EzComponent.js":
/*!****************************************************!*\
  !*** ./node_modules/@gsilber/webez/EzComponent.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EzComponent = exports.HttpMethod = void 0;
const EzRouter_1 = __webpack_require__(/*! ./EzRouter */ "./node_modules/@gsilber/webez/EzRouter.js");
const eventsubject_1 = __webpack_require__(/*! ./eventsubject */ "./node_modules/@gsilber/webez/eventsubject.js");
/**
 * @description An enum for the HTTP methods
 * @export
 * @group AJAX Support
 * @enum {string}
 */
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["OPTIONS"] = "OPTIONS";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
/**
 * @description A base class for creating web components
 * @export
 * @group Abstract Superclasses
 * @abstract
 * @class EzComponent
 * @example class MyComponent extends EzComponent {
 *   constructor() {
 *     super("<h1>Hello World</h1>", "h1{color:red;}");
 *   }
 * }
 */
class EzComponent {
    /**
     * @description An event that fires when the window is resized
     * @readonly
     * @type {EventSubject<SizeInfo>}
     * @memberof EzComponent
     * @example this.onResizeEvent.subscribe((sizeInfo) => {
     *  console.log(sizeInfo.windowWidth);
     *  console.log(sizeInfo.windowHeight);
     * });
     */
    get onResizeEvent() {
        return EzComponent.resizeEvent;
    }
    /**
     * @description Creates an instance of EzComponent.
     * @param {string} [html=""] The html as a string to be used as the body of this component
     * @param {string} [css=""] The css as a string to be used as the style of this component
     * @memberof EzComponent
     * @public
     * @constructor
     */
    constructor(html, css) {
        this.html = html;
        this.css = css;
        /**
         * @hidden
         */
        this.router = null;
        this.htmlElement = window.document.createElement("div");
        this.shadow = this.htmlElement.attachShadow({ mode: "open" });
        this.template = window.document.createElement("template");
        this.template.innerHTML = this.html;
        for (let style of window.document.styleSheets) {
            /* Jest does not populate the ownerNode member, so this can't be tested*/
            if (style.ownerNode)
                this.shadow.appendChild(style.ownerNode.cloneNode(true));
        }
        this.styles = window.document.createElement("style");
        this.styles.innerHTML = this.css;
        this.shadow.appendChild(this.styles);
        const innerDiv = window.document.createElement("div");
        innerDiv.id = "rootTemplate";
        innerDiv.appendChild(this.template.content);
        this.template.content.appendChild(innerDiv);
        this.shadow.appendChild(innerDiv);
        this.shadow.appendChild(this.template.content.cloneNode(true));
        if (!window.onresize) {
            window.onresize = () => {
                EzComponent.resizeEvent.next({
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight,
                });
            };
        }
    }
    /**
     * @description Add a component to the dom
     * @param component The component to add
     * @param id The id of the element to append the component to (optional)
     * @returns void
     * @memberof EzComponent
     * @example
     *   component.addComponent(childComponent);
     *   component.addComponent(childComponent, "myDiv");
     */
    addComponent(component, id = "root", front = false) {
        if (front) {
            if (id === "root") {
                if (this.shadow.firstChild)
                    this.shadow.insertBefore(component.htmlElement, this.shadow.firstChild);
            }
            else {
                let el = this.shadow.getElementById(id);
                if (el) {
                    if (el.firstChild)
                        el.insertBefore(component.htmlElement, el.firstChild);
                    else
                        el.appendChild(component.htmlElement);
                }
            }
        }
        else {
            if (id === "root") {
                this.shadow.appendChild(component.htmlElement);
            }
            else {
                let el = this.shadow.getElementById(id);
                if (el) {
                    el.appendChild(component.htmlElement);
                }
            }
        }
    }
    /**
     * @description Add a router to the component
     * @param router The router to add
     * @param id The id of the element to append the router to (optional)
     * @returns the router
     * @memberof EzComponent
     * @example component.addRouter(router);
     */
    addRouter(routes, id = "root") {
        if (this.router)
            throw new Error("A router has already been added to this component");
        this.router = new EzRouter_1.EzRouter(this, routes, id);
        this.router.route(window.location.pathname);
    }
    /**
     * @description Remove a component from the dom
     * @param component
     * @returns EzComponent
     * @memberof EzComponent
     * @example
     * component.addComponent(childComponent);
     * component.removeComponent(childComponent);
     */
    removeComponent(component) {
        component.htmlElement.remove();
        return component;
    }
    /**
     * @description Append the component to a dom element
     * @param domElement
     * @returns void
     * @memberof EzComponent
     * @example component.appendToDomElement(document.getElementById("myDiv"));
     */
    appendToDomElement(domElement) {
        domElement.appendChild(this.htmlElement);
    }
    /**
     * @description Makes an AJAX call
     * @param {string} url The URL to make the AJAX call to
     * @param {HttpMethod} method The HTTP method to use (GET or POST)
     * @param {Headers} headers The headers to send with the request (optional)
     * @param {T} data The data to send in the request body (optional)
     * @returns {Promise<T>} A promise that resolves with the response data
     * @memberof EzComponent
     * @static
     * @example myComponent.ajax("https://some.api.url.com/posts", HttpMethod.GET)
     *  .subscribe((data) => {
     *   console.log(data);
     * }, (error) => {
     *   console.error(error);
     * });
     */
    static ajax(url, method, headers = [], data) {
        const evt = new eventsubject_1.EventSubject();
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        for (let header of headers) {
            Object.keys(header).forEach((key) => {
                if (header[key])
                    xhr.setRequestHeader(key, header[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                evt.next(JSON.parse(xhr.responseText));
            }
            else {
                evt.error(new Error(xhr.statusText));
            }
        };
        xhr.onerror = () => {
            evt.error(new Error("Network error"));
        };
        xhr.send(JSON.stringify(data));
        return evt;
    }
    /**
     * @description Get the size of the window
     * @returns {SizeInfo} The size of the window
     * @memberof EzComponent
     * @example const sizeInfo: SizeInfo = myComponent.getWindowSize();
     */
    getWindowSize() {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        };
    }
    /**
     * @description Set focus to an element on this component
     * @param {string} elementId The id of the element to focus
     * @returns void
     */
    focus(elementId) {
        let el = this.shadow.getElementById(elementId);
        if (el)
            el.focus();
    }
    /**
     * @description Click an element on this component
     * @param {string} elementId The id of the element to click
     * @returns void
     */
    click(elementId) {
        let el = this.shadow.getElementById(elementId);
        if (el)
            el.click();
    }
    /**
     * @description Get the value of an element on this component.
     * @param {string} elementId The id of the element to get the value of
     * @returns string | undefined
     * @throws Error when element does not have a value property or does not exist
     * @memberof
     */
    getValue(elementId) {
        const element = this.shadow.getElementById(elementId);
        if (element instanceof HTMLInputElement)
            return element.value;
        else if (element instanceof HTMLTextAreaElement)
            return element.value;
        else if (element instanceof HTMLSelectElement)
            return element.value;
        else if (element instanceof HTMLOptionElement)
            return element.value;
        else
            throw new Error("Element does not have a value property");
    }
}
exports.EzComponent = EzComponent;
EzComponent.resizeEvent = new eventsubject_1.EventSubject();


/***/ }),

/***/ "./node_modules/@gsilber/webez/EzDialog.js":
/*!*************************************************!*\
  !*** ./node_modules/@gsilber/webez/EzDialog.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EzDialog = exports.popupDialog = void 0;
const EzComponent_1 = __webpack_require__(/*! ./EzComponent */ "./node_modules/@gsilber/webez/EzComponent.js");
const eventsubject_1 = __webpack_require__(/*! ./eventsubject */ "./node_modules/@gsilber/webez/eventsubject.js");
/** @hidden */
exports.popupDialog = undefined;
const alertDialogTempalte = `
<div style="width: 600px; margin: -10px">
    <div
        id="title"
        style="
            background: silver;
            padding: 10px;
            font-size: 20pt;
            font-weight: bold;
            overflow: hidden;
        "
    >
        My Dialog
    </div>
    <div
        style="
            display: flex;
            min-height: 100px;
            margin: 10px;
            font-size: 20px;
            text-align: center;
            align-items: center;
            justify-items: center;
            line-height: 20px;
        "
    >
        <div
            id="content"
            style="display: block; width: 100%; text-align: center"
        >
            Question goes here
        </div>
    </div>
    <div id="buttonDiv" style="margin: 10px; text-align: right; justify-content: center">
    </div>
</div>`;
const backgroundTemplate = `
.dialog-background {
    display: none;
    position: absolute;
    text-align:center;
    z-index: 1050;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    outline: 0;
    background-color: rgb(0, 0, 0, 0.5);

}`;
const popupTemplate = `
.dialog-popup {
    position: relative;
    top:50%;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    transform: translateY(-50%);
    margin:auto;
    box-shadow: 4px 8px 8px 4px rgba(0, 0, 0, 0.2);
	display:inline-block;
	overflow:hidden;
}`;
/**
 * @description A dialog component that can be used to create a popup dialog
 * @export
 * @class EzDialog
 * @group Abstract Superclasses
 * @extends {EzComponent}
 * @example const dialog = new EzDialog("<h1>Hello World</h1>", "h1{color:red;}");
 */
class EzDialog extends EzComponent_1.EzComponent {
    /**
     * @description Creates an instance of EzComponent.
     * @param {string} [html=""] The html as a string to be used as the body of this component
     * @param {string} [css=""] The css as a string to be used as the style of this component
     * @memberof EzComponent
     * @public
     * @constructor
     * @example const dlg = new EzDialog("<h1>Hello World</h1>", "h1{color:red;}");
     */
    constructor(html = "", css = "") {
        super(html, css);
        this.closeEvent = new eventsubject_1.EventSubject();
        const styleEl = window.document.createElement("style");
        styleEl.innerHTML = backgroundTemplate + popupTemplate;
        this["shadow"].appendChild(styleEl);
        //now add 2 more divs
        this.background = window.document.createElement("div");
        this.background.className = "dialog-background";
        this.background.id = "background-root";
        this.background.style.display = "none";
        this.popup = window.document.createElement("div");
        this.popup.className = "dialog-popup";
        this.background.appendChild(this.popup);
        this["shadow"].appendChild(this.background);
        const outside = this["shadow"].getElementById("rootTemplate");
        if (outside)
            this.popup.appendChild(outside);
    }
    /**
     * @description Show or hide the dialog
     * @param {boolean} [show=true] Show or hide the dialog
     * @returns void
     * @memberof EzDialog
     * @example
     * const dialog = new MyDialog();
     * dialog.show();
     * dialog.closeEvent.subscribe((value) => {
     *    console.log(value);
     *    dialog.show(false);
     * });
     */
    show(show = true) {
        if (show) {
            this.background.style.display = "inline-block";
        }
        else {
            this.background.style.display = "none";
        }
    }
    static clickPopupButton(buttonNumber) {
        if (exports.popupDialog) {
            const button = this.popupButtons.length > buttonNumber ?
                this.popupButtons[buttonNumber]
                : undefined;
            if (button)
                button.click();
        }
    }
    /**
     * @description Show a popup dialog
     * @static
     * @param {EzComponent} attachTo The component to attach the dialog to
     * @param {string} message The message to display
     * @param {string} [title="Alert"] The title of the dialog
     * @param {string[]} [buttons=["Ok"]] The buttons to display
     * @param {string} [btnClass=""] The class to apply to the buttons
     * @returns {EventSubject<string>} The event subject that is triggered when the dialog is closed
     * @memberof EzDialog
     * @example
     * EzDialog.popup("Hello World", "Alert", ["Ok","Cancel"], "btn btn-primary")
     *    .subscribe((value:string) => {
     *       if (value === "Ok") console.log("Ok was clicked");
     *       else console.log("Cancel was clicked");
     *   });
     *
     *
     */
    static popup(attachTo, message, title = "Alert", buttons = ["Ok"], btnClass = "") {
        const dialog = new EzDialog(alertDialogTempalte);
        exports.popupDialog = dialog;
        let titleEl = dialog["shadow"].getElementById("title");
        if (titleEl)
            titleEl.innerHTML = title;
        let contentEl = dialog["shadow"].getElementById("content");
        if (contentEl)
            contentEl.innerHTML = message;
        //add buttons
        const buttonDiv = dialog["shadow"].getElementById("buttonDiv");
        if (buttonDiv) {
            for (let btn of buttons) {
                let button = window.document.createElement("button");
                button.innerHTML = btn;
                button.value = btn;
                button.id = "btn_" + btn;
                button.className = btnClass;
                button.style.marginLeft = "10px";
                button.addEventListener("click", () => {
                    dialog.show(false);
                    dialog.closeEvent.next(button.value);
                });
                this.popupButtons.push(button);
                buttonDiv.appendChild(button);
            }
        }
        attachTo.addComponent(dialog);
        dialog.show();
        dialog.closeEvent.subscribe(() => {
            attachTo["removeComponent"](dialog);
        });
        return dialog.closeEvent;
    }
}
exports.EzDialog = EzDialog;
EzDialog.popupButtons = [];


/***/ }),

/***/ "./node_modules/@gsilber/webez/EzRouter.js":
/*!*************************************************!*\
  !*** ./node_modules/@gsilber/webez/EzRouter.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EzRouter = void 0;
class EzRouter {
    constructor(container, routes, id) {
        this.container = container;
        this.routes = routes;
        this.id = id;
        this.baseRoute =  false || "";
        this.currentComponent = null;
        this.selectedPage = 0;
        this.route(window.location.pathname.replace(this.baseRoute, ""));
    }
    selectedRoute() {
        return this.selectedPage;
    }
    route(path) {
        const route = this.routes.find((r) => r.path === path);
        if (route) {
            this.selectedPage = this.routes.indexOf(route);
            if (this.currentComponent)
                this.container["removeComponent"](this.currentComponent);
            this.currentComponent = route.component;
            if (this.id === "root") {
                this.container.addComponent(route.component);
            }
            else {
                this.container.addComponent(route.component, this.id);
            }
            window.history.pushState({}, "", this.baseRoute + path);
        }
    }
}
exports.EzRouter = EzRouter;


/***/ }),

/***/ "./node_modules/@gsilber/webez/bind.decorators.js":
/*!********************************************************!*\
  !*** ./node_modules/@gsilber/webez/bind.decorators.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BindStyleToNumberAppendPx = exports.BindStyleToNumber = exports.BindValueToNumber = exports.BindCheckedToBoolean = exports.BindVisibleToBoolean = exports.BindDisabledToBoolean = exports.BindCSSClassToBoolean = exports.BindList = exports.BindAttribute = exports.BindValue = exports.BindCSSClass = exports.BindStyle = void 0;
const eventsubject_1 = __webpack_require__(/*! ./eventsubject */ "./node_modules/@gsilber/webez/eventsubject.js");
/**
 * @description Gets the public key of the field name
 * @param name the name of the field
 * @returns the public key
 * @ignore
 */
function getPublicKey(name) {
    return String(name);
}
/**
 * @description Gets the private key of the field name
 * @param name the name of the field
 * @returns the private key
 * @ignore
 */
function getPrivateKey(name) {
    return `__${String(name)}`;
}
/**
 * @description replaces a property with a new setter and the default getter.  The new setter can call the original setter.
 * @param target the class to replace the setter in
 * @param name the property to replace the setter for
 * @param value the initial value of the property
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 * @param callSetterFirst if true, the setter is called before the original setter, otherwise it is called after.
 * @ignore
 */
function hookProperty(target, name, value, setter, callSetterFirst = false) {
    const publicKey = getPublicKey(name);
    const privateKey = getPrivateKey(name);
    Object.defineProperty(target, privateKey, {
        value,
        writable: true,
        enumerable: false,
        configurable: true,
    });
    Object.defineProperty(target, publicKey, {
        get() {
            return this[privateKey];
        },
        set(value) {
            if (callSetterFirst)
                setter(value);
            this[privateKey] = value;
            if (!callSetterFirst)
                setter(value);
        },
        enumerable: true,
        configurable: true,
    });
}
/**
 * @description Replace setter and getter with the ones provided.  These may call the original setter and getter.
 * @param target the class to replace the setter and getter in
 * @param name the property to replace the setter and getter for
 * @param origDescriptor the original property descriptor
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 * @param callSetterFirst if true, the setter is called before the original setter, otherwise it is called after.
 * @ignore
 */
function hookPropertySetter(target, name, origDescriptor, setter, callSetterFirst = false) {
    const publicKey = getPublicKey(name);
    Object.defineProperty(target, publicKey, {
        get: origDescriptor.get, // Leave the get accessor as it was
        set(value) {
            if (callSetterFirst)
                setter(value);
            if (origDescriptor.set) {
                origDescriptor.set.call(target, value); // Call the original set accessor with the provided value
            }
            if (!callSetterFirst)
                setter(value);
        },
        enumerable: origDescriptor.enumerable,
        configurable: origDescriptor.configurable,
    });
}
/**
 * @description Returns a property descriptor for a property in this class
 * @param target the class to get the property descriptor from
 * @param key the property to get the descriptor for
 * @returns PropertyDescriptor
 * @throws Error if the property descriptor is not found
 * @ignore
 */
function getPropertyDescriptor(target, key) {
    let origDescriptor = Object.getOwnPropertyDescriptor(target, key);
    /* this can't happen.  Just here for type safety checking*/
    if (!origDescriptor) {
        throw new Error(`can not find setter with name: ${key}`);
    }
    return origDescriptor;
}
/**
 * @description Returns true if the element has a value attribute
 * @param element the element to check
 * @returns boolean
 * @ignore
 */
function elementHasValue(element) {
    return (element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLOptionElement ||
        element instanceof HTMLButtonElement);
}
function walkDOM(element, clone, func) {
    func(element, clone); // Process the current node
    // Recurse into child nodes
    element = element.firstChild;
    clone = clone.firstChild;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (element) {
        walkDOM(element, clone, func);
        element = element.nextSibling;
        clone = clone.nextSibling;
    }
}
/**
 * @description Clones the event listeners from the element to the clone
 * @param element the element to clone the event listeners from
 * @param clone the element to clone the event listeners to
 * @ignore
 */
function cloneEventListeners(element, clone) {
    const listeners = ["change", "input", "blur", "click"];
    listeners.forEach((listener) => {
        walkDOM(element, clone, (el, cl) => {
            cl.addEventListener(listener, (e) => {
                if (elementHasValue(el)) {
                    el.value = e.target.value;
                }
                if (element instanceof HTMLButtonElement)
                    element.innerHTML = e.target.innerHTML;
                if (element instanceof HTMLOptionElement)
                    element.text = e.target.text;
                el.dispatchEvent(new Event(listener));
            });
        });
    });
}
/**
 * @description Recreates the set of elements bound to the array by duplicating the element parameter for each element in the array
 * @param arr the array of values to bind to the elements
 * @param element the element to duplicate for each element in the array
 * @param overwrite if true, the innerHTML of the element will be replaced with the value in the array, otherwise the value will be set as the value of the element
 * @param listItemId an array of ids of the elements to set the value of in the list item
 * @returns void
 * @ignore
 */
function recreateBoundList(arr, element, overwrite, listItemId) {
    var _a, _b;
    //hide current element
    element.style.display = "none";
    const sibs = [];
    let n = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.firstChild;
    for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== element)
            sibs.push(n);
    }
    if (sibs.length > arr.length) {
        //remove extra siblings
        sibs.slice(arr.length).forEach((v) => {
            v.remove();
        });
    }
    else if (sibs.length < arr.length) {
        //add the extra siblings
        for (let i = sibs.length; i < arr.length; i++) {
            let clone = element.cloneNode(true);
            for (let id of listItemId) {
                const el = clone.querySelector(`#${id}`);
                if (el && elementHasValue(el)) {
                    el.value = arr[i];
                }
                else if (el) {
                    el.innerHTML = arr[i];
                }
            }
            cloneEventListeners(element, clone);
            sibs.push(clone);
            (_b = element.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(clone);
        }
    }
    //replace the value of the siblings with the value in the array
    arr.forEach((v, i) => {
        sibs[i].style.display = element.getAttribute("original-display") || "";
        if (sibs[i] instanceof HTMLOptionElement) {
            sibs[i].value = v;
            sibs[i].text = v;
        }
        else if (element instanceof HTMLButtonElement) {
            sibs[i].innerHTML = v;
            sibs[i].value = v;
        }
        else if (elementHasValue(sibs[i]))
            sibs[i].value = v;
        else if (overwrite)
            sibs[i].innerHTML = v;
    });
}
const boundProxyRebuild = new eventsubject_1.EventSubject();
/**
 * @description Creates a proxy object that will update the bound list when the array is modified
 * @param array the array to proxy
 * @param element the element to bind the array to
 * @returns Proxy
 * @ignore
 */
function boundProxyFactory(array) {
    return new Proxy(array, {
        set(target, prop, value) {
            if (prop !== "length") {
                target[prop] = value;
                boundProxyRebuild.next();
                //recreateBoundList(target, element);
            }
            return true;
        },
        get(target, prop) {
            let ops = [
                "fill",
                "copyWithin",
                "push",
                "pop",
                "reverse",
                "shift",
                "slice",
                "sort",
                "splice",
                "unshift",
            ];
            if (ops.indexOf(prop) !== -1) {
                const origMethod = target[prop];
                return function (...args) {
                    origMethod.apply(target, args);
                    boundProxyRebuild.next();
                    //recreateBoundList(target, element);
                };
            }
            return target[prop];
        },
    });
}
// Actual implementation, should not be in documentation as the overloads capture the two cases
/**@ignore */
function BindStyle(id, style, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            //replace the style tag with the new value
            if (value !== undefined)
                element.style[style] = transform.call(this, value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    element.style[style] = transform.call(this, value);
                });
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    element.style[style] = transform.call(this, value);
                });
            }
        });
    };
}
exports.BindStyle = BindStyle;
// Actual implementation, should not be in documentation as the overloads capture the two cases
/**@ignore */
function BindCSSClass(id, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            if (value !== undefined) {
                let valArray = transform
                    .call(this, value)
                    .split(" ")
                    .filter((v) => v.length > 0);
                if (valArray.length > 0)
                    element.className = valArray.join(" ");
            }
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    let origValue = context.access.get(this);
                    let currentList;
                    if (origValue) {
                        currentList = transform
                            .call(this, origValue)
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (currentList.length > 0)
                            currentList.forEach((v) => (element.className =
                                element.className.replace(v, "")));
                    }
                    let newClasses = transform
                        .call(this, value)
                        .split(" ")
                        .filter((v) => v.length > 0);
                    if (newClasses.length > 0)
                        newClasses.forEach((v) => (element.className += ` ${v}`));
                }, true);
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    let origValue = context.access.get(this);
                    let currentList;
                    if (origValue) {
                        currentList = transform
                            .call(this, origValue)
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (currentList.length > 0)
                            currentList.forEach((v) => (element.className =
                                element.className.replace(v, "")));
                    }
                    let newClasses = transform
                        .call(this, value)
                        .split(" ")
                        .filter((v) => v.length > 0);
                    if (newClasses.length > 0)
                        newClasses.forEach((v) => (element.className += ` ${v}`));
                }, true);
            }
        });
    };
}
exports.BindCSSClass = BindCSSClass;
// Actual implementation, should not be in documentation as the overloads capture the two cases
function BindValue(id, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            if (element instanceof HTMLOptionElement) {
                element.value = transform.call(this, value);
                element.text = transform.call(this, value);
            }
            else if (element instanceof HTMLButtonElement) {
                element.innerHTML = transform.call(this, value);
                element.value = transform.call(this, value);
            }
            else if (value !== undefined) {
                if (elementHasValue(element))
                    element.value = transform.call(this, value);
                else
                    element.innerHTML = transform.call(this, value);
            }
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    if (element instanceof HTMLOptionElement) {
                        element.value =
                            transform.call(this, value);
                        element.text = transform.call(this, value);
                    }
                    else if (element instanceof HTMLButtonElement) {
                        element.innerHTML =
                            transform.call(this, value);
                        element.value = transform.call(this, value);
                    }
                    else if (elementHasValue(element))
                        element.value =
                            transform.call(this, value);
                    else
                        element.innerHTML = transform.call(this, value);
                });
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    if (element instanceof HTMLOptionElement) {
                        element.value =
                            transform.call(this, value);
                        element.text = transform.call(this, value);
                    }
                    else if (element instanceof HTMLButtonElement) {
                        element.innerHTML =
                            transform.call(this, value);
                        element.value = transform.call(this, value);
                    }
                    else if (elementHasValue(element))
                        element.value =
                            transform.call(this, value);
                    else
                        element.innerHTML = transform.call(this, value);
                });
            }
        });
    };
}
exports.BindValue = BindValue;
// Actual implementation, should not be in documentation as the overloads capture the two cases
function BindAttribute(id, attribute, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            let setfn;
            setfn = (value) => {
                let val = transform.call(this, value);
                if (val !== "") {
                    if (attribute === "checked") {
                        element.checked = true;
                    }
                    else {
                        element.setAttribute(attribute, val);
                    }
                }
                else {
                    if (attribute === "checked") {
                        element.checked = false;
                    }
                    else {
                        element.removeAttribute(attribute);
                    }
                }
            };
            if (value !== undefined)
                setfn(value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, setfn);
            }
            else {
                hookProperty(this, context.name, value, setfn);
            }
        });
    };
}
exports.BindAttribute = BindAttribute;
//implementation
function BindList(id, transform = (value) => value, replaceInnerHtml = true, listItemId = []) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            if (element.parentElement &&
                element.parentElement.children.length !== 1)
                throw new Error("lists must be bound to elements that are only children of their parent");
            element.setAttribute("original-display", element.style.display);
            const value = context.access.get(this);
            const privateKey = getPrivateKey(context.name);
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const setfn = (value) => {
                recreateBoundList(transform.call(this, value), element, replaceInnerHtml, listItemId);
                boundProxyRebuild.subscribe(() => {
                    recreateBoundList(transform.call(this, value), element, replaceInnerHtml, listItemId);
                });
                this[privateKey] = boundProxyFactory(value);
            };
            setfn(value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    boundProxyRebuild.subscribe(() => {
                        recreateBoundList(transform.call(this, value), element, replaceInnerHtml, listItemId);
                    });
                    boundProxyFactory(value);
                    //recreateBoundList(transform.call(this, value));
                });
            }
            else {
                hookProperty(this, context.name, value, setfn);
            }
        });
    };
}
exports.BindList = BindList;
// Wrapper methods for specific operations
/**
 * @description Decorator to bind the cssClassName property if the boolean property is true
 * @param id the element to bind the property to
 * @param cssClassName the class name to add
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will add the css class myCSSClass to the div with id myDiv if the enabled property is true
 * @BindCSSClassToBoolean("myDiv", "myCSSClass")
 * public enabled: boolean = true;
 */
function BindCSSClassToBoolean(id, cssClassName) {
    return BindCSSClass(id, (value) => (value ? cssClassName : ""));
}
exports.BindCSSClassToBoolean = BindCSSClassToBoolean;
/**
 * @description Decorator to bind the disabled attribute of an element to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will disable the button with id myButton if the disabled property is true
 * @BindDisabledToBoolean("myButton")
 * public disabled: boolean = true;
 */
function BindDisabledToBoolean(id) {
    return BindAttribute(id, "disabled", (value) => value ? "disabled" : "");
}
exports.BindDisabledToBoolean = BindDisabledToBoolean;
/**
 * @description Decorator to bind the visibility of an element to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will hide the div with id myDiv1 if the visible property is false
 * @BindVisibleToBoolean("myDiv1")
 * public visible: boolean = true;
 */
function BindVisibleToBoolean(id) {
    return BindStyle(id, "display", (value) => value ? "block" : "none");
}
exports.BindVisibleToBoolean = BindVisibleToBoolean;
/**
 * @description Decorator to bind the checked/unchecked value of a checkbox input to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will check the checkbox with id myCheckbox if the checked property is true
 * @BindCheckedToBoolean("myCheckbox")
 * public checked: boolean = true;
 */
function BindCheckedToBoolean(id) {
    return BindAttribute(id, "checked", (value) => value ? "checked" : "");
}
exports.BindCheckedToBoolean = BindCheckedToBoolean;
/**
 * @description Decorator to bind the value of an element to a number
 * @param id the element to bind the property to
 * @param append an optional string to append to the number before setting the value
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will bind the text (value) of the div with id myDiv1 to the number in value
 * @BindValueToNumber("myDiv1")
 * public value: number = 100;
 */
function BindValueToNumber(id, append = "") {
    return BindValue(id, (value) => `${value}${append}`);
}
exports.BindValueToNumber = BindValueToNumber;
/**
 * @description Decorator to bind a specific style to a number, and optionally append a string to the value
 * @param id the element to bind the property to
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @Param optional string to append to the number before setting the value
 * @returns DecoratorCallback
 * @overload
 * @export
 * @group Bind Decorators
 * @example
 * //This will set the width of the div to the number in width
 * @BindStyleToNumber("myDiv", "width","%")
 * public width: number = 100;
 */
function BindStyleToNumber(id, style, append = "") {
    return BindStyle(id, style, (value) => `${value}${append}`);
}
exports.BindStyleToNumber = BindStyleToNumber;
/**
 * @description Decorator to bind a specific style to a number, and append a 'px' to the value
 * @param id the element to bind the property to
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @returns DecoratorCallback
 * @overload
 * @export
 * @group Bind Decorators
 * @example
 * //This will set the width of the div to the number in width
 * @BindStyleToNumberAppendPx("myDiv", "width")
 * public width: number = 100;
 */
function BindStyleToNumberAppendPx(id, style) {
    return BindStyleToNumber(id, style, "px");
}
exports.BindStyleToNumberAppendPx = BindStyleToNumberAppendPx;


/***/ }),

/***/ "./node_modules/@gsilber/webez/bootstrap.js":
/*!**************************************************!*\
  !*** ./node_modules/@gsilber/webez/bootstrap.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bootstrap = void 0;
/** @hidden */
function bootstrap(target, testModeHTML = "", ...args) {
    if (testModeHTML.length > 0) {
        window.document.body.innerHTML = testModeHTML;
    }
    let obj = Object.assign(new target(...args));
    const element = window.document.getElementById("main-target");
    if (element)
        obj.appendToDomElement(element);
    else
        obj.appendToDomElement(window.document.body);
    return obj;
}
exports.bootstrap = bootstrap;


/***/ }),

/***/ "./node_modules/@gsilber/webez/event.decorators.js":
/*!*********************************************************!*\
  !*** ./node_modules/@gsilber/webez/event.decorators.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = exports.Input = exports.Change = exports.Blur = exports.Click = exports.WindowEvent = exports.GenericEvent = void 0;
/**
 * @description Decorator to bind a generic event to an element
 * @param htmlElementID the element to bind the event to
 * @param type the event to bind
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @GenericEvent("myButton", "click")
 * myButtonClick(e: MouseEvent) {
 *    console.log("Button was clicked");
 * }
 */
function GenericEvent(htmlElementID, type) {
    return function (target, context) {
        context.addInitializer(function () {
            let element = this["shadow"].getElementById(htmlElementID);
            if (element) {
                element.addEventListener(type, (e) => {
                    if (type === "input" || type === "change")
                        if (element.type === "checkbox") {
                            e.value = element.checked ? "on" : "";
                        }
                        else {
                            e.value = element.value;
                        }
                    target.call(this, e);
                });
            }
        });
    };
}
exports.GenericEvent = GenericEvent;
/**
 * @description Decorator to bind a window event to the window
 * @param type the event to bind
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @WindowEvent("resize")
 * onResize(e: WindowEvent) {
 *   console.log("Window was resized");
 * }
 */
function WindowEvent(type) {
    return function (target, context) {
        context.addInitializer(function () {
            window.addEventListener(type, (e) => {
                target.call(this, e);
            });
        });
    };
}
exports.WindowEvent = WindowEvent;
/**
 * @description Decorator to bind a click event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @Click("myButton")
 * myButtonClick(e: MouseEvent) {
 *   console.log("Button was clicked");
 * }
 */
function Click(htmlElementID) {
    return GenericEvent(htmlElementID, "click");
}
exports.Click = Click;
/**
 * @description Decorator to bind a blur event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @Blur("myInput")
 * myInputBlur(e: FocusEvent) {
 *  console.log("Input lost focus");
 * }
 */
function Blur(htmlElementID) {
    return GenericEvent(htmlElementID, "blur");
}
exports.Blur = Blur;
/**
 * @description Decorator to bind a change event to an element.  For checkboxes, this will return "on" when checked or "" when unchecked.
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @Change("myInput")
 * myInputChange(e: ChangeEvent) {
 *   console.log("Input changed");
 */
function Change(htmlElementID) {
    return GenericEvent(htmlElementID, "change");
}
exports.Change = Change;
/**
 * @description Decorator to bind an input event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @group Event Decorators
 * @example
 * @Input("myInput")
 * myInputChange(e: InputEvent) {
 *  console.log("Input changed");
 * }
 */
function Input(htmlElementID) {
    return GenericEvent(htmlElementID, "input");
}
exports.Input = Input;
/**
 * @description Decorator to call a method periodically with a timer
 * @param intervalMS the interval in milliseconds to call the method
 * @returns DecoratorCallback
 * @note This executes repeatedly.  The decorated function is passed a cancel function that can be called to stop the timer.
 * @export
 * @group Event Decorators
 * @example
 * let counter=0;
 * @Timer(1000)
 * myTimerMethod(cancel: TimerCancelMethod) {
 *   console.log("Timer method called once per second");
 *   if (counter++ > 5) cancel();
 */
function Timer(intervalMS) {
    return function (target, context) {
        context.addInitializer(function () {
            const intervalID = setInterval(() => {
                target.call(this, () => {
                    clearInterval(intervalID);
                });
            }, intervalMS);
        });
    };
}
exports.Timer = Timer;


/***/ }),

/***/ "./node_modules/@gsilber/webez/eventsubject.js":
/*!*****************************************************!*\
  !*** ./node_modules/@gsilber/webez/eventsubject.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventSubject = void 0;
/**
 * EventSubject
 * @description A class for creating event subjects
 * @export
 * @class EventSubject
 * @group Async Event Sources
 */
class EventSubject {
    constructor() {
        this.refCount = 0;
        this.callbacks = [];
        this.errorFns = [];
    }
    /**
     * Subscribe to the event subject
     * @param callback The callback to call when the event is triggered
     * @param error The callback to call when an error is triggered
     * @returns The id of the subscription
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *  console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    subscribe(callback, error) {
        this.callbacks.push({ id: this.refCount, fn: callback });
        if (error)
            this.errorFns.push({ id: this.refCount, fn: error });
        return this.refCount++;
    }
    /**
     * Unsubscribe from the event subject
     * @param id The id of the subscription to remove
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *   console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    unsubscribe(id) {
        this.callbacks = this.callbacks.filter((cb) => cb.id !== id);
        this.errorFns = this.errorFns.filter((cb) => cb.id !== id);
    }
    /**
     * Trigger the event subject
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *   console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    next(value) {
        for (const callback of this.callbacks)
            callback.fn(value);
    }
    /**
     * Trigger the error event subject
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *   console.log(value);
     * }, (error) => {
     *  console.error(error);
     * });
     * subject.error(new Error("It doesnt't work!"));
     * subject.unsubscribe(id);
     */
    error(value) {
        for (const errorFn of this.errorFns)
            errorFn.fn(value);
    }
    /**
     * Convert the event subject to a promise
     * @description Convert the event subject to a promise.
     * This is useful for the async/await style async pattern.
     * @returns Promise<T>
     * @example
     * async myFunction() {
     *   const result=await EzDialog.popup(
     *     "Hello World",
     *     "Alert", ["Ok","Cancel"]).toPromise();
     *   console.log(result);
     * }
     */
    toPromise() {
        return new Promise((resolve, reject) => {
            this.subscribe((value) => {
                resolve(value);
            }, (error) => {
                reject(error);
            });
        });
    }
}
exports.EventSubject = EventSubject;


/***/ }),

/***/ "./node_modules/@gsilber/webez/index.js":
/*!**********************************************!*\
  !*** ./node_modules/@gsilber/webez/index.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./bind.decorators */ "./node_modules/@gsilber/webez/bind.decorators.js"), exports);
__exportStar(__webpack_require__(/*! ./event.decorators */ "./node_modules/@gsilber/webez/event.decorators.js"), exports);
__exportStar(__webpack_require__(/*! ./EzComponent */ "./node_modules/@gsilber/webez/EzComponent.js"), exports);
__exportStar(__webpack_require__(/*! ./EzDialog */ "./node_modules/@gsilber/webez/EzDialog.js"), exports);
__exportStar(__webpack_require__(/*! ./EzRouter */ "./node_modules/@gsilber/webez/EzRouter.js"), exports);
__exportStar(__webpack_require__(/*! ./eventsubject */ "./node_modules/@gsilber/webez/eventsubject.js"), exports);
__exportStar(__webpack_require__(/*! ./bootstrap */ "./node_modules/@gsilber/webez/bootstrap.js"), exports);


/***/ }),

/***/ "./node_modules/axios/dist/browser/axios.cjs":
/*!***************************************************!*\
  !*** ./node_modules/axios/dist/browser/axios.cjs ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*! Axios v1.8.1 Copyright (c) 2025 Matt Zabriskie and contributors */


function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// utils is a library of generic helper functions non-specific to axios

const {toString} = Object.prototype;
const {getPrototypeOf} = Object;

const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type
};

const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {isArray} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = (thing) => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = (val) => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = (val) => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = (thing) => {
  let kind;
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) || (
      isFunction(thing.append) && (
        (kind = kindOf(thing)) === 'formdata' ||
        // detect form-data instance
        (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
      )
    )
  )
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');

const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = (str) => str.trim ?
  str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {allOwnKeys = false} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;

    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}

function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}

const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : __webpack_require__.g)
})();

const isContextDefined = (context) => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  const {caseless} = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };

  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {allOwnKeys}= {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {allOwnKeys});
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};

  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};


/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];

  const iterator = generator.call(obj);

  let result;

  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];

  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }

  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');

const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({hasOwnProperty}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');

const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};

  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });

  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }

    const value = obj[name];

    if (!isFunction(value)) return;

    descriptor.enumerable = false;

    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }

    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};

const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};

  const define = (arr) => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };

  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

  return obj;
};

const noop = () => {};

const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
}

const toJSONObject = (obj) => {
  const stack = new Array(10);

  const visit = (source, i) => {

    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      if(!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};

        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });

        stack[i] = undefined;

        return target;
      }
    }

    return source;
  };

  return visit(obj, 0);
};

const isAsyncFn = kindOfTest('AsyncFunction');

const isThenable = (thing) =>
  thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }

  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({source, data}) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);

    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    }
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === 'function',
  isFunction(_global.postMessage)
);

const asap = typeof queueMicrotask !== 'undefined' ?
  queueMicrotask.bind(_global) : ( typeof process !== 'undefined' && process.nextTick || _setImmediate);

// *********************

var utils$1 = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap
};

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = (new Error()).stack;
  }

  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}

utils$1.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils$1.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});

const prototype$1 = AxiosError.prototype;
const descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);

  utils$1.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.cause = error;

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

// eslint-disable-next-line strict
var httpAdapter = null;

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return utils$1.isPlainObject(thing) || utils$1.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return utils$1.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return utils$1.isArray(arr) && !arr.some(isVisitable);
}

const predicates = utils$1.toFlatObject(utils$1, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!utils$1.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (FormData)();

  // eslint-disable-next-line no-param-reassign
  options = utils$1.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !utils$1.isUndefined(source[option]);
  });

  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && utils$1.isSpecCompliantForm(formData);

  if (!utils$1.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }

  function convertValue(value) {
    if (value === null) return '';

    if (utils$1.isDate(value)) {
      return value.toISOString();
    }

    if (!useBlob && utils$1.isBlob(value)) {
      throw new AxiosError('Blob is not supported. Use a Buffer instead.');
    }

    if (utils$1.isArrayBuffer(value) || utils$1.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;

    if (value && !path && typeof value === 'object') {
      if (utils$1.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (
        (utils$1.isArray(value) && isFlatArray(value)) ||
        ((utils$1.isFileList(value) || utils$1.endsWith(key, '[]')) && (arr = utils$1.toArray(value))
        )) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);

        arr.forEach(function each(el, index) {
          !(utils$1.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
            convertValue(el)
          );
        });
        return false;
      }
    }

    if (isVisitable(value)) {
      return true;
    }

    formData.append(renderKey(path, key, dots), convertValue(value));

    return false;
  }

  const stack = [];

  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });

  function build(value, path) {
    if (utils$1.isUndefined(value)) return;

    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }

    stack.push(value);

    utils$1.forEach(value, function each(el, key) {
      const result = !(utils$1.isUndefined(el) || el === null) && visitor.call(
        formData, el, utils$1.isString(key) ? key.trim() : key, path, exposedHelpers
      );

      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });

    stack.pop();
  }

  if (!utils$1.isObject(obj)) {
    throw new TypeError('data must be an object');
  }

  build(obj);

  return formData;
}

/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode$1(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];

  params && toFormData(params, this, options);
}

const prototype = AxiosURLSearchParams.prototype;

prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};

prototype.toString = function toString(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;

  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};

/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  
  const _encode = options && options.encode || encode;

  if (utils$1.isFunction(options)) {
    options = {
      serialize: options
    };
  } 

  const serializeFn = options && options.serialize;

  let serializedParams;

  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils$1.isURLSearchParams(params) ?
      params.toString() :
      new AxiosURLSearchParams(params, options).toString(_encode);
  }

  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");

    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils$1.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}

var InterceptorManager$1 = InterceptorManager;

var transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

var URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

var FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

var Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

var platform$1 = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};

const hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';

const _navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = hasBrowserEnv &&
  (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = (() => {
  return (
    typeof WorkerGlobalScope !== 'undefined' &&
    // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope &&
    typeof self.importScripts === 'function'
  );
})();

const origin = hasBrowserEnv && window.location.href || 'http://localhost';

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  hasBrowserEnv: hasBrowserEnv,
  hasStandardBrowserWebWorkerEnv: hasStandardBrowserWebWorkerEnv,
  hasStandardBrowserEnv: hasStandardBrowserEnv,
  navigator: _navigator,
  origin: origin
});

var platform = {
  ...utils,
  ...platform$1
};

function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path, helpers) {
      if (platform.isNode && utils$1.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }

      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}

/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return utils$1.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];

    if (name === '__proto__') return true;

    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils$1.isArray(target) ? target.length : name;

    if (isLast) {
      if (utils$1.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }

      return !isNumericKey;
    }

    if (!target[name] || !utils$1.isObject(target[name])) {
      target[name] = [];
    }

    const result = buildPath(path, value, target[name], index);

    if (result && utils$1.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }

    return !isNumericKey;
  }

  if (utils$1.isFormData(formData) && utils$1.isFunction(formData.entries)) {
    const obj = {};

    utils$1.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });

    return obj;
  }

  return null;
}

/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (utils$1.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils$1.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

const defaults = {

  transitional: transitionalDefaults,

  adapter: ['xhr', 'http', 'fetch'],

  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = utils$1.isObject(data);

    if (isObjectPayload && utils$1.isHTMLForm(data)) {
      data = new FormData(data);
    }

    const isFormData = utils$1.isFormData(data);

    if (isFormData) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }

    if (utils$1.isArrayBuffer(data) ||
      utils$1.isBuffer(data) ||
      utils$1.isStream(data) ||
      utils$1.isFile(data) ||
      utils$1.isBlob(data) ||
      utils$1.isReadableStream(data)
    ) {
      return data;
    }
    if (utils$1.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils$1.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }

    let isFileList;

    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }

      if ((isFileList = utils$1.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;

        return toFormData(
          isFileList ? {'files[]': data} : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }

    if (isObjectPayload || hasJSONContentType ) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';

    if (utils$1.isResponse(data) || utils$1.isReadableStream(data)) {
      return data;
    }

    if (data && utils$1.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;

      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};

utils$1.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], (method) => {
  defaults.headers[method] = {};
});

var defaults$1 = defaults;

// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils$1.toObjectSet([
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
]);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;

  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();

    if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
      return;
    }

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};

const $internals = Symbol('internals');

function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}

function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }

  return utils$1.isArray(value) ? value.map(normalizeValue) : String(value);
}

function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;

  while ((match = tokensRE.exec(str))) {
    tokens[match[1]] = match[2];
  }

  return tokens;
}

const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (utils$1.isFunction(filter)) {
    return filter.call(this, value, header);
  }

  if (isHeaderNameFilter) {
    value = header;
  }

  if (!utils$1.isString(value)) return;

  if (utils$1.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }

  if (utils$1.isRegExp(filter)) {
    return filter.test(value);
  }
}

function formatHeader(header) {
  return header.trim()
    .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
      return char.toUpperCase() + str;
    });
}

function buildAccessors(obj, header) {
  const accessorName = utils$1.toCamelCase(' ' + header);

  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}

class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }

  set(header, valueOrRewrite, rewrite) {
    const self = this;

    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);

      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }

      const key = utils$1.findKey(self, lHeader);

      if(!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
        self[key || _header] = normalizeValue(_value);
      }
    }

    const setHeaders = (headers, _rewrite) =>
      utils$1.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

    if (utils$1.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if(utils$1.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else if (utils$1.isHeaders(header)) {
      for (const [key, value] of header.entries()) {
        setHeader(value, key, rewrite);
      }
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }

    return this;
  }

  get(header, parser) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      if (key) {
        const value = this[key];

        if (!parser) {
          return value;
        }

        if (parser === true) {
          return parseTokens(value);
        }

        if (utils$1.isFunction(parser)) {
          return parser.call(this, value, key);
        }

        if (utils$1.isRegExp(parser)) {
          return parser.exec(value);
        }

        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }

  has(header, matcher) {
    header = normalizeHeader(header);

    if (header) {
      const key = utils$1.findKey(this, header);

      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }

    return false;
  }

  delete(header, matcher) {
    const self = this;
    let deleted = false;

    function deleteHeader(_header) {
      _header = normalizeHeader(_header);

      if (_header) {
        const key = utils$1.findKey(self, _header);

        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];

          deleted = true;
        }
      }
    }

    if (utils$1.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }

    return deleted;
  }

  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;

    while (i--) {
      const key = keys[i];
      if(!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }

    return deleted;
  }

  normalize(format) {
    const self = this;
    const headers = {};

    utils$1.forEach(this, (value, header) => {
      const key = utils$1.findKey(headers, header);

      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }

      const normalized = format ? formatHeader(header) : String(header).trim();

      if (normalized !== header) {
        delete self[header];
      }

      self[normalized] = normalizeValue(value);

      headers[normalized] = true;
    });

    return this;
  }

  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }

  toJSON(asStrings) {
    const obj = Object.create(null);

    utils$1.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils$1.isArray(value) ? value.join(', ') : value);
    });

    return obj;
  }

  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }

  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }

  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }

  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }

  static concat(first, ...targets) {
    const computed = new this(first);

    targets.forEach((target) => computed.set(target));

    return computed;
  }

  static accessor(header) {
    const internals = this[$internals] = (this[$internals] = {
      accessors: {}
    });

    const accessors = internals.accessors;
    const prototype = this.prototype;

    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);

      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }

    utils$1.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

    return this;
  }
}

AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
utils$1.reduceDescriptors(AxiosHeaders.prototype, ({value}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  }
});

utils$1.freezeMethods(AxiosHeaders);

var AxiosHeaders$1 = AxiosHeaders;

/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || defaults$1;
  const context = response || config;
  const headers = AxiosHeaders$1.from(context.headers);
  let data = context.data;

  utils$1.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });

  headers.normalize();

  return data;
}

function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}

utils$1.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;

  min = min !== undefined ? min : 1000;

  return function push(chunkLength) {
    const now = Date.now();

    const startedAt = timestamps[tail];

    if (!firstSampleTS) {
      firstSampleTS = now;
    }

    bytes[head] = chunkLength;
    timestamps[head] = now;

    let i = tail;
    let bytesCount = 0;

    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }

    head = (head + 1) % samplesCount;

    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }

    if (now - firstSampleTS < min) {
      return;
    }

    const passed = startedAt && now - startedAt;

    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}

/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;

  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn.apply(null, args);
  };

  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if ( passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };

  const flush = () => lastArgs && invoke(lastArgs);

  return [throttled, flush];
}

const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);

  return throttle(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;

    bytesNotified = loaded;

    const data = {
      loaded,
      total,
      progress: total ? (loaded / total) : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };

    listener(data);
  }, freq);
};

const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;

  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};

const asyncDecorator = (fn) => (...args) => utils$1.asap(() => fn(...args));

var isURLSameOrigin = platform.hasStandardBrowserEnv ? ((origin, isMSIE) => (url) => {
  url = new URL(url, platform.origin);

  return (
    origin.protocol === url.protocol &&
    origin.host === url.host &&
    (isMSIE || origin.port === url.port)
  );
})(
  new URL(platform.origin),
  platform.navigator && /(msie|trident)/i.test(platform.navigator.userAgent)
) : () => true;

var cookies = platform.hasStandardBrowserEnv ?

  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure) {
      const cookie = [name + '=' + encodeURIComponent(value)];

      utils$1.isNumber(expires) && cookie.push('expires=' + new Date(expires).toGMTString());

      utils$1.isString(path) && cookie.push('path=' + path);

      utils$1.isString(domain) && cookie.push('domain=' + domain);

      secure === true && cookie.push('secure');

      document.cookie = cookie.join('; ');
    },

    read(name) {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return (match ? decodeURIComponent(match[3]) : null);
    },

    remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  }

  :

  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {},
    read() {
      return null;
    },
    remove() {}
  };

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
}

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && isRelativeUrl || allowAbsoluteUrls == false) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? { ...thing } : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};

  function getMergedValue(target, source, prop, caseless) {
    if (utils$1.isPlainObject(target) && utils$1.isPlainObject(source)) {
      return utils$1.merge.call({caseless}, target, source);
    } else if (utils$1.isPlainObject(source)) {
      return utils$1.merge({}, source);
    } else if (utils$1.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop , caseless) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(a, b, prop , caseless);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a, prop , caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!utils$1.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!utils$1.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b , prop) => mergeDeepProperties(headersToObject(a), headersToObject(b),prop, true)
  };

  utils$1.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    (utils$1.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
}

var resolveConfig = (config) => {
  const newConfig = mergeConfig({}, config);

  let {data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth} = newConfig;

  newConfig.headers = headers = AxiosHeaders$1.from(headers);

  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' +
      btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : ''))
    );
  }

  let contentType;

  if (utils$1.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // Let the browser set it
    } else if ((contentType = headers.getContentType()) !== false) {
      // fix semicolon duplication issue for ReactNative FormData implementation
      const [type, ...tokens] = contentType ? contentType.split(';').map(token => token.trim()).filter(Boolean) : [];
      headers.setContentType([type || 'multipart/form-data', ...tokens].join('; '));
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils$1.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));

    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);

      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }

  return newConfig;
};

const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

var xhrAdapter = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders$1.from(_config.headers).normalize();
    let {responseType, onUploadProgress, onDownloadProgress} = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;

    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);

      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }

    let request = new XMLHttpRequest();

    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = AxiosHeaders$1.from(
        'getAllResponseHeaders' in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
        request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || transitionalDefaults;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils$1.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!utils$1.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      ([downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true));
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      ([uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress));

      request.upload.addEventListener('progress', uploadThrottled);

      request.upload.addEventListener('loadend', flushUpload);
    }

    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config, request) : cancel);
        request.abort();
        request = null;
      };

      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }

    const protocol = parseProtocol(_config.url);

    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData || null);
  });
};

const composeSignals = (signals, timeout) => {
  const {length} = (signals = signals ? signals.filter(Boolean) : []);

  if (timeout || length) {
    let controller = new AbortController();

    let aborted;

    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError ? err : new CanceledError(err instanceof Error ? err.message : err));
      }
    };

    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError(`timeout ${timeout} of ms exceeded`, AxiosError.ETIMEDOUT));
    }, timeout);

    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    };

    signals.forEach((signal) => signal.addEventListener('abort', onabort));

    const {signal} = controller;

    signal.unsubscribe = () => utils$1.asap(unsubscribe);

    return signal;
  }
};

var composeSignals$1 = composeSignals;

const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;

  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }

  let pos = 0;
  let end;

  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};

const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};

const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }

  const reader = stream.getReader();
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};

const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);

  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };

  return new ReadableStream({
    async pull(controller) {
      try {
        const {done, value} = await iterator.next();

        if (done) {
         _onFinish();
          controller.close();
          return;
        }

        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  })
};

const isFetchSupported = typeof fetch === 'function' && typeof Request === 'function' && typeof Response === 'function';
const isReadableStreamSupported = isFetchSupported && typeof ReadableStream === 'function';

// used only inside the fetch adapter
const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ?
    ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) :
    async (str) => new Uint8Array(await new Response(str).arrayBuffer())
);

const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false
  }
};

const supportsRequestStream = isReadableStreamSupported && test(() => {
  let duplexAccessed = false;

  const hasContentType = new Request(platform.origin, {
    body: new ReadableStream(),
    method: 'POST',
    get duplex() {
      duplexAccessed = true;
      return 'half';
    },
  }).headers.has('Content-Type');

  return duplexAccessed && !hasContentType;
});

const DEFAULT_CHUNK_SIZE = 64 * 1024;

const supportsResponseStream = isReadableStreamSupported &&
  test(() => utils$1.isReadableStream(new Response('').body));


const resolvers = {
  stream: supportsResponseStream && ((res) => res.body)
};

isFetchSupported && (((res) => {
  ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
    !resolvers[type] && (resolvers[type] = utils$1.isFunction(res[type]) ? (res) => res[type]() :
      (_, config) => {
        throw new AxiosError(`Response type '${type}' is not supported`, AxiosError.ERR_NOT_SUPPORT, config);
      });
  });
})(new Response));

const getBodyLength = async (body) => {
  if (body == null) {
    return 0;
  }

  if(utils$1.isBlob(body)) {
    return body.size;
  }

  if(utils$1.isSpecCompliantForm(body)) {
    const _request = new Request(platform.origin, {
      method: 'POST',
      body,
    });
    return (await _request.arrayBuffer()).byteLength;
  }

  if(utils$1.isArrayBufferView(body) || utils$1.isArrayBuffer(body)) {
    return body.byteLength;
  }

  if(utils$1.isURLSearchParams(body)) {
    body = body + '';
  }

  if(utils$1.isString(body)) {
    return (await encodeText(body)).byteLength;
  }
};

const resolveBodyLength = async (headers, body) => {
  const length = utils$1.toFiniteNumber(headers.getContentLength());

  return length == null ? getBodyLength(body) : length;
};

var fetchAdapter = isFetchSupported && (async (config) => {
  let {
    url,
    method,
    data,
    signal,
    cancelToken,
    timeout,
    onDownloadProgress,
    onUploadProgress,
    responseType,
    headers,
    withCredentials = 'same-origin',
    fetchOptions
  } = resolveConfig(config);

  responseType = responseType ? (responseType + '').toLowerCase() : 'text';

  let composedSignal = composeSignals$1([signal, cancelToken && cancelToken.toAbortSignal()], timeout);

  let request;

  const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
  });

  let requestContentLength;

  try {
    if (
      onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' &&
      (requestContentLength = await resolveBodyLength(headers, data)) !== 0
    ) {
      let _request = new Request(url, {
        method: 'POST',
        body: data,
        duplex: "half"
      });

      let contentTypeHeader;

      if (utils$1.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
        headers.setContentType(contentTypeHeader);
      }

      if (_request.body) {
        const [onProgress, flush] = progressEventDecorator(
          requestContentLength,
          progressEventReducer(asyncDecorator(onUploadProgress))
        );

        data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
      }
    }

    if (!utils$1.isString(withCredentials)) {
      withCredentials = withCredentials ? 'include' : 'omit';
    }

    // Cloudflare Workers throws when credentials are defined
    // see https://github.com/cloudflare/workerd/issues/902
    const isCredentialsSupported = "credentials" in Request.prototype;
    request = new Request(url, {
      ...fetchOptions,
      signal: composedSignal,
      method: method.toUpperCase(),
      headers: headers.normalize().toJSON(),
      body: data,
      duplex: "half",
      credentials: isCredentialsSupported ? withCredentials : undefined
    });

    let response = await fetch(request);

    const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');

    if (supportsResponseStream && (onDownloadProgress || (isStreamResponse && unsubscribe))) {
      const options = {};

      ['status', 'statusText', 'headers'].forEach(prop => {
        options[prop] = response[prop];
      });

      const responseContentLength = utils$1.toFiniteNumber(response.headers.get('content-length'));

      const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
        responseContentLength,
        progressEventReducer(asyncDecorator(onDownloadProgress), true)
      ) || [];

      response = new Response(
        trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }),
        options
      );
    }

    responseType = responseType || 'text';

    let responseData = await resolvers[utils$1.findKey(resolvers, responseType) || 'text'](response, config);

    !isStreamResponse && unsubscribe && unsubscribe();

    return await new Promise((resolve, reject) => {
      settle(resolve, reject, {
        data: responseData,
        headers: AxiosHeaders$1.from(response.headers),
        status: response.status,
        statusText: response.statusText,
        config,
        request
      });
    })
  } catch (err) {
    unsubscribe && unsubscribe();

    if (err && err.name === 'TypeError' && /fetch/i.test(err.message)) {
      throw Object.assign(
        new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request),
        {
          cause: err.cause || err
        }
      )
    }

    throw AxiosError.from(err, err && err.code, config, request);
  }
});

const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter,
  fetch: fetchAdapter
};

utils$1.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {value});
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {value});
  }
});

const renderReason = (reason) => `- ${reason}`;

const isResolvedHandle = (adapter) => utils$1.isFunction(adapter) || adapter === null || adapter === false;

var adapters = {
  getAdapter: (adapters) => {
    adapters = utils$1.isArray(adapters) ? adapters : [adapters];

    const {length} = adapters;
    let nameOrAdapter;
    let adapter;

    const rejectedReasons = {};

    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters[i];
      let id;

      adapter = nameOrAdapter;

      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];

        if (adapter === undefined) {
          throw new AxiosError(`Unknown adapter '${id}'`);
        }
      }

      if (adapter) {
        break;
      }

      rejectedReasons[id || '#' + i] = adapter;
    }

    if (!adapter) {

      const reasons = Object.entries(rejectedReasons)
        .map(([id, state]) => `adapter ${id} ` +
          (state === false ? 'is not supported by the environment' : 'is not available in the build')
        );

      let s = length ?
        (reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0])) :
        'as no adapter specified';

      throw new AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        'ERR_NOT_SUPPORT'
      );
    }

    return adapter;
  },
  adapters: knownAdapters
};

/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders$1.from(config.headers);

  // Transform request data
  config.data = transformData.call(
    config,
    config.transformRequest
  );

  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }

  const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );

    response.headers = AxiosHeaders$1.from(response.headers);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }

    return Promise.reject(reason);
  });
}

const VERSION = "1.8.1";

const validators$1 = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators$1[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators$1.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

validators$1.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  }
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

var validator = {
  assertOptions,
  validators: validators$1
};

const validators = validator.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};

        Error.captureStackTrace ? Error.captureStackTrace(dummy) : (dummy = new Error());

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack;
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }

      throw err;
    }
  }

  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }

    config = mergeConfig(this.defaults, config);

    const {transitional, paramsSerializer, headers} = config;

    if (transitional !== undefined) {
      validator.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }

    if (paramsSerializer != null) {
      if (utils$1.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }

    validator.assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && utils$1.merge(
      headers.common,
      headers[config.method]
    );

    headers && utils$1.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      (method) => {
        delete headers[method];
      }
    );

    config.headers = AxiosHeaders$1.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }

      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });

    let promise;
    let i = 0;
    let len;

    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), undefined];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);

      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }

    return promise;
  }

  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
utils$1.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});

utils$1.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

var Axios$1 = Axios;

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    let resolvePromise;

    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;

      let i = token._listeners.length;

      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);

      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };

      return promise;
    };

    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new CanceledError(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }

    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }

  toAbortSignal() {
    const controller = new AbortController();

    const abort = (err) => {
      controller.abort(err);
    };

    this.subscribe(abort);

    controller.signal.unsubscribe = () => this.unsubscribe(abort);

    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}

var CancelToken$1 = CancelToken;

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return utils$1.isObject(payload) && (payload.isAxiosError === true);
}

const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
};

Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});

var HttpStatusCode$1 = HttpStatusCode;

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context);

  // Copy axios.prototype to instance
  utils$1.extend(instance, Axios$1.prototype, context, {allOwnKeys: true});

  // Copy context to instance
  utils$1.extend(instance, context, null, {allOwnKeys: true});

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
const axios = createInstance(defaults$1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios$1;

// Expose Cancel & CancelToken
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;

// Expose AxiosError class
axios.AxiosError = AxiosError;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = spread;

// Expose isAxiosError
axios.isAxiosError = isAxiosError;

// Expose mergeConfig
axios.mergeConfig = mergeConfig;

axios.AxiosHeaders = AxiosHeaders$1;

axios.formToJSON = thing => formDataToJSON(utils$1.isHTMLForm(thing) ? new FormData(thing) : thing);

axios.getAdapter = adapters.getAdapter;

axios.HttpStatusCode = HttpStatusCode$1;

axios.default = axios;

module.exports = axios;
//# sourceMappingURL=axios.cjs.map


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./styles.css":
/*!**********************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./styles.css ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*Put your global styles here.  
* Individual components can be styled locatlly
*/

/* Add your global styles here */
/* Note you cannot use url's in this file, you must put those in the component's css file 
* or put a new css file in the assets directory and add it to the head element
* of the index.html file if you need them to be global.
*/
`, "",{"version":3,"sources":["webpack://./styles.css"],"names":[],"mappings":"AAAA;;CAEC;;AAED,gCAAgC;AAChC;;;CAGC","sourcesContent":["/*Put your global styles here.  \r\n* Individual components can be styled locatlly\r\n*/\r\n\r\n/* Add your global styles here */\r\n/* Note you cannot use url's in this file, you must put those in the component's css file \r\n* or put a new css file in the assets directory and add it to the head element\r\n* of the index.html file if you need them to be global.\r\n*/\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/Diagnoses/Diagnoses.component.css":
/*!***********************************************!*\
  !*** ./src/Diagnoses/Diagnoses.component.css ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("");

/***/ }),

/***/ "./src/Diagnoses/Diagnoses.component.html":
/*!************************************************!*\
  !*** ./src/Diagnoses/Diagnoses.component.html ***!
  \************************************************/
/***/ ((module) => {

module.exports = "<ul>\r\n    <li id=\"diagnosis-item\"></li>\r\n</ul>";

/***/ }),

/***/ "./src/Diagnoses/Diagnoses.component.ts":
/*!**********************************************!*\
  !*** ./src/Diagnoses/Diagnoses.component.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DiagnosesComponent = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const Diagnoses_component_html_1 = __importDefault(__webpack_require__(/*! ./Diagnoses.component.html */ "./src/Diagnoses/Diagnoses.component.html"));
const Diagnoses_component_css_1 = __importDefault(__webpack_require__(/*! ./Diagnoses.component.css */ "./src/Diagnoses/Diagnoses.component.css"));
let DiagnosesComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _newDiagnosis_decorators;
    let _newDiagnosis_initializers = [];
    let _newDiagnosis_extraInitializers = [];
    return _a = class DiagnosesComponent extends _classSuper {
            constructor() {
                super(Diagnoses_component_html_1.default, Diagnoses_component_css_1.default);
                this.newDiagnosis = __runInitializers(this, _newDiagnosis_initializers, "COVID-19");
                __runInitializers(this, _newDiagnosis_extraInitializers);
            }
            changeString(diagnosis) {
                this.newDiagnosis = diagnosis;
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _newDiagnosis_decorators = [(0, webez_1.BindValue)("diagnosis-item")];
            __esDecorate(null, null, _newDiagnosis_decorators, { kind: "field", name: "newDiagnosis", static: false, private: false, access: { has: obj => "newDiagnosis" in obj, get: obj => obj.newDiagnosis, set: (obj, value) => { obj.newDiagnosis = value; } }, metadata: _metadata }, _newDiagnosis_initializers, _newDiagnosis_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.DiagnosesComponent = DiagnosesComponent;


/***/ }),

/***/ "./src/Perscriptions/Perscriptions.component.css":
/*!*******************************************************!*\
  !*** ./src/Perscriptions/Perscriptions.component.css ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("");

/***/ }),

/***/ "./src/Perscriptions/Perscriptions.component.html":
/*!********************************************************!*\
  !*** ./src/Perscriptions/Perscriptions.component.html ***!
  \********************************************************/
/***/ ((module) => {

module.exports = "<ul>\r\n    <li id=\"perscirption-item\"></li>\r\n</ul>\r\n";

/***/ }),

/***/ "./src/Perscriptions/Perscriptions.component.ts":
/*!******************************************************!*\
  !*** ./src/Perscriptions/Perscriptions.component.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PerscriptionsComponent = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const Perscriptions_component_html_1 = __importDefault(__webpack_require__(/*! ./Perscriptions.component.html */ "./src/Perscriptions/Perscriptions.component.html"));
const Perscriptions_component_css_1 = __importDefault(__webpack_require__(/*! ./Perscriptions.component.css */ "./src/Perscriptions/Perscriptions.component.css"));
let PerscriptionsComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _newDiagnosis_decorators;
    let _newDiagnosis_initializers = [];
    let _newDiagnosis_extraInitializers = [];
    return _a = class PerscriptionsComponent extends _classSuper {
            constructor() {
                super(Perscriptions_component_html_1.default, Perscriptions_component_css_1.default);
                this.newDiagnosis = __runInitializers(this, _newDiagnosis_initializers, "Naproxen");
                __runInitializers(this, _newDiagnosis_extraInitializers);
            }
            changeString(diagnosis) {
                this.newDiagnosis = diagnosis;
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _newDiagnosis_decorators = [(0, webez_1.BindValue)("perscirption-item")];
            __esDecorate(null, null, _newDiagnosis_decorators, { kind: "field", name: "newDiagnosis", static: false, private: false, access: { has: obj => "newDiagnosis" in obj, get: obj => obj.newDiagnosis, set: (obj, value) => { obj.newDiagnosis = value; } }, metadata: _metadata }, _newDiagnosis_initializers, _newDiagnosis_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PerscriptionsComponent = PerscriptionsComponent;


/***/ }),

/***/ "./src/Symptoms/Symptoms.component.css":
/*!*********************************************!*\
  !*** ./src/Symptoms/Symptoms.component.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("");

/***/ }),

/***/ "./src/Symptoms/Symptoms.component.html":
/*!**********************************************!*\
  !*** ./src/Symptoms/Symptoms.component.html ***!
  \**********************************************/
/***/ ((module) => {

module.exports = "<ul>\r\n    <li id=\"symptom-item\"></li>\r\n</ul>\r\n";

/***/ }),

/***/ "./src/Symptoms/Symptoms.component.ts":
/*!********************************************!*\
  !*** ./src/Symptoms/Symptoms.component.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SymptomsComponent = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const Symptoms_component_html_1 = __importDefault(__webpack_require__(/*! ./Symptoms.component.html */ "./src/Symptoms/Symptoms.component.html"));
const Symptoms_component_css_1 = __importDefault(__webpack_require__(/*! ./Symptoms.component.css */ "./src/Symptoms/Symptoms.component.css"));
let SymptomsComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _newSymptom_decorators;
    let _newSymptom_initializers = [];
    let _newSymptom_extraInitializers = [];
    return _a = class SymptomsComponent extends _classSuper {
            constructor() {
                super(Symptoms_component_html_1.default, Symptoms_component_css_1.default);
                this.newSymptom = __runInitializers(this, _newSymptom_initializers, "Fever");
                __runInitializers(this, _newSymptom_extraInitializers);
            }
            changeString(symptom) {
                this.newSymptom = symptom;
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _newSymptom_decorators = [(0, webez_1.BindValue)("symptom-item")];
            __esDecorate(null, null, _newSymptom_decorators, { kind: "field", name: "newSymptom", static: false, private: false, access: { has: obj => "newSymptom" in obj, get: obj => obj.newSymptom, set: (obj, value) => { obj.newSymptom = value; } }, metadata: _metadata }, _newSymptom_initializers, _newSymptom_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SymptomsComponent = SymptomsComponent;


/***/ }),

/***/ "./src/app/main.component.css":
/*!************************************!*\
  !*** ./src/app/main.component.css ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".title{\r\n\tfont-size: 20px;\r\n\tcolor: #000;\r\n\tmargin-bottom: 20px;\r\n\tbackground-color: bisque;\r\n}\r\n\r\n#top-head{\r\n\tpadding-bottom: 4%\r\n}\r\n\r\n.fade-in-text {\r\n\tanimation: fadeIn 6s;\r\n  }\r\n\r\n  @keyframes fadeIn {\r\n\t0% { opacity: 0; }\r\n\t100% { opacity: 1; }\r\n  }\r\n\r\n  @-moz-keyframes fadeIn {\r\n\t0% { opacity: 0; }\r\n\t100% { opacity: 1; }\r\n  }\r\n  \r\n  @-webkit-keyframes fadeIn {\r\n\t0% { opacity: 0; }\r\n\t100% { opacity: 1; }\r\n  }\r\n  \r\n  @-o-keyframes fadeIn {\r\n\t0% { opacity: 0; }\r\n\t100% { opacity: 1; }\r\n  }\r\n  \r\n  @-ms-keyframes fadeIn {\r\n\t0% { opacity: 0; }\r\n\t100% { opacity: 1; }\r\n  }\r\n\r\n#welcome-banner{\r\n\r\n\tcolor:rgb(14, 47, 23);\r\n\tfont-size: 40px;\r\n\ttext-align:center;\r\n\tfont-family:sans-serif;\r\n\tborder-radius: 20px;\r\n\tfont-style: bold;\r\n\t\r\n}\r\n\r\n#enterButtons{\r\n\tpadding: 20px;\r\n}\r\n\r\n#login{\r\n\tfont-family:'Courier New', Courier, monospace;\r\n\tfont-weight: bold;\r\n\tborder-radius: 30px;\r\n\tfont-size: 35px;\r\n\tbackground-color: aquamarine;\r\n\tborder-color: black;\r\n\tborder-style:solid;\r\n\tbox-shadow: 0px 5px black;\r\n\tpadding: 20px;\r\n}\r\n\r\n#signUp{\r\n\tfont-family:'Courier New', Courier, monospace;\r\n\tfont-weight: bold;\r\n\tborder-radius: 30px;\r\n\tfont-size: 35px;\r\n\tbackground-color: aquamarine;\r\n\tborder-color: black;\r\n\tborder-style:solid;\r\n\tbox-shadow: 0px 5px black;\r\n\tpadding: 20px;\r\n}\r\n\r\ninput[type=text], input[type=password] {\r\n\twidth: 100%;\r\n\tpadding: 12px 20px;\r\n\tmargin: 8px 0;\r\n\tdisplay: inline-block;\r\n\tborder: 1px solid #ccc;\r\n\tborder-radius: 4px;\r\n\tbox-sizing: border-box;\r\n  }\r\n  \r\n  /* Style the submit button */\r\n  input[type=submit] {\r\n\twidth: 100%;\r\n\tbackground-color: #04AA6D;\r\n\tcolor: white;\r\n\tpadding: 14px 20px;\r\n\tmargin: 8px 0;\r\n\tborder: none;\r\n\tborder-radius: 4px;\r\n\tcursor: pointer;\r\n  }\r\n  \r\n  /* Add a background color to the submit button on mouse-over */\r\n  input[type=submit]:hover {\r\n\tbackground-color: #45a049;\r\n  }");

/***/ }),

/***/ "./src/app/main.component.html":
/*!*************************************!*\
  !*** ./src/app/main.component.html ***!
  \*************************************/
/***/ ((module) => {

module.exports = "<div id=\"top-head\"></div>\r\n<div id=\"welcome-banner\">\r\n  <div id=\"title-banner\">\r\n      Welcome to DoseAlert: <p>The One Stop Shop For All Your Medical Needs</p>\r\n  </div>\r\n  <div id=\"enterButtons\">\r\n      <button id=\"login\">Login</button>\r\n      <button id=\"signUp\">Sign up</button>\r\n  </div>\r\n</div>\r\n<div id=\"entry\" class=\"fade-in-text\"></div>\r\n<div id=\"new-user\"></div>\r\n<div id=\"user-homepage\"></div>\r\n";

/***/ }),

/***/ "./src/app/main.component.ts":
/*!***********************************!*\
  !*** ./src/app/main.component.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainComponent = void 0;
const main_component_html_1 = __importDefault(__webpack_require__(/*! ./main.component.html */ "./src/app/main.component.html"));
const main_component_css_1 = __importDefault(__webpack_require__(/*! ./main.component.css */ "./src/app/main.component.css"));
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const user_home_component_1 = __webpack_require__(/*! ../user_home/user_home.component */ "./src/user_home/user_home.component.ts");
const login_component_1 = __webpack_require__(/*! ../login/login.component */ "./src/login/login.component.ts");
const signup_component_1 = __webpack_require__(/*! ../signup/signup.component */ "./src/signup/signup.component.ts");
const axios_1 = __importDefault(__webpack_require__(/*! axios */ "./node_modules/axios/dist/browser/axios.cjs"));
function createUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post('http://128.4.102.9:8000/push-username-password/', userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'secret-key-123'
                },
            });
            return response.data.userID;
        }
        catch (error) {
            console.error('Error creating user:', error);
            return -1;
        }
    });
}
let MainComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _instanceExtraInitializers = [];
    let _newDisplay_decorators;
    let _newDisplay_initializers = [];
    let _newDisplay_extraInitializers = [];
    let _showLogin_decorators;
    let _showSignup_decorators;
    return _a = class MainComponent extends _classSuper {
            constructor() {
                super(main_component_html_1.default, main_component_css_1.default);
                this.newDisplay = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _newDisplay_initializers, "none"));
                this.userHomepage = (__runInitializers(this, _newDisplay_extraInitializers), new user_home_component_1.UserHomepageComponent());
                this.login = new login_component_1.LoginComponent();
                this.signup = new signup_component_1.SignupComponent();
                this.userID = 0;
                this.removeLogin();
                this.removeSignup();
            }
            showLogin() {
                this.removeComponent(this.signup);
                this.addComponent(this.login, "entry");
            }
            showSignup() {
                this.removeComponent(this.login);
                this.addComponent(this.signup, "entry");
            }
            removeLogin() {
                this.login.clickEvent.subscribe(() => __awaiter(this, void 0, void 0, function* () {
                    this.userData = this.login.sendUserID();
                    this.removeComponent(this.login);
                    this.userID = yield createUser(this.userData);
                    this.addComponent(this.userHomepage, "user-homepage");
                    this.userHomepage.setUserID(this.userID);
                }));
            }
            removeSignup() {
                this.signup.clickEvent.subscribe(() => {
                    this.removeComponent(this.signup);
                });
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _newDisplay_decorators = [(0, webez_1.BindStyle)("new-user", "display")];
            _showLogin_decorators = [(0, webez_1.Click)("login")];
            _showSignup_decorators = [(0, webez_1.Click)("signUp")];
            __esDecorate(_a, null, _showLogin_decorators, { kind: "method", name: "showLogin", static: false, private: false, access: { has: obj => "showLogin" in obj, get: obj => obj.showLogin }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _showSignup_decorators, { kind: "method", name: "showSignup", static: false, private: false, access: { has: obj => "showSignup" in obj, get: obj => obj.showSignup }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _newDisplay_decorators, { kind: "field", name: "newDisplay", static: false, private: false, access: { has: obj => "newDisplay" in obj, get: obj => obj.newDisplay, set: (obj, value) => { obj.newDisplay = value; } }, metadata: _metadata }, _newDisplay_initializers, _newDisplay_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MainComponent = MainComponent;


/***/ }),

/***/ "./src/login/login.component.css":
/*!***************************************!*\
  !*** ./src/login/login.component.css ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".title{\r\n\tfont-size: 20px;\r\n\tcolor: #000;\r\n\tmargin-bottom: 20px;\r\n\tbackground-color: bisque;\r\n}\r\n\r\n#welcome-banner{\r\n\tbackground-color: rgb(195, 255, 230);\r\n\tfont-size: 40px;\r\n\ttext-align:center;\r\n\tfont-family:Verdana, Geneva, Tahoma, sans-serif;\r\n\tborder-radius: 20px;\r\n\ttext-shadow: 2px 2px grey;\r\n\tfont-style: italic;\r\n}\r\n\r\n#enterButtons{\r\n\tpadding: 20px\r\n}\r\n#InUserID{\r\n\twidth: 20%\r\n}\r\n#InKeyID{\r\n\twidth: 20%;\r\n}\r\n\r\n#login{\r\n\tdisplay:inline-flex;\r\n\tfont-family:'Courier New', Courier, monospace;\r\n\tfont-weight: bold;\r\n\tborder-radius: 100px;\r\n\tfont-size: large;\r\n\tbackground-color: aquamarine;\r\n\tborder-color: black;\r\n\tpadding: 30px;\r\n}\r\n\r\n#signUp{\r\n\tfont-family:'Courier New', Courier, monospace;\r\n\tfont-weight: bold;\r\n\tborder-radius: 100px;\r\n\tfont-size: large;\r\n\tbackground-color: aquamarine;\r\n\tborder-color: black;\r\n\tpadding: 30px;\r\n}\r\n\r\n#submit{\r\n\tborder-radius: 4px;\r\n\tbackground-color: aquamarine;\r\n\tborder-color: black;\r\n\tborder-style:solid;\r\n\tbox-shadow: 0px 2px black;\r\n}\r\n\r\ninput[type=text], input[type=password] {\r\n\twidth: 100%;\r\n\tpadding: 12px 20px;\r\n\tmargin: 8px 0;\r\n\tdisplay: inline-block;\r\n\tborder: 1px solid #ccc;\r\n\tborder-radius: 4px;\r\n\tbox-sizing: border-box;\r\n  }\r\n  \r\n  input[type=submit] {\r\n\twidth: 100%;\r\n\tbackground-color: #04AA6D;\r\n\tcolor: white;\r\n\tpadding: 14px 20px;\r\n\tmargin: 8px 0;\r\n\tborder: none;\r\n\tborder-radius: 4px;\r\n\tcursor: pointer;\r\n  }\r\n  \r\n  input[type=submit]:hover {\r\n\tbackground-color: #45a049;\r\n  }");

/***/ }),

/***/ "./src/login/login.component.html":
/*!****************************************!*\
  !*** ./src/login/login.component.html ***!
  \****************************************/
/***/ ((module) => {

module.exports = "<!-- Returning User Form -->\n<div id=\"returning-user\">\n    <form>\n    <label for=\"UserID\">Username:</label>\n    <input type=\"text\" id=\"InUserID\" name=\"username\" placeholder=\"Username\" required>\n\n    <label for=\"KeyID\">Password:</label>\n    <input type=\"password\" id=\"InKeyID\" name=\"password\" placeholder=\"Password\" required>\n    \n    <button id=\"submit\">Submit</button>\n    </form>\n</div>";

/***/ }),

/***/ "./src/login/login.component.ts":
/*!**************************************!*\
  !*** ./src/login/login.component.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginComponent = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const login_component_html_1 = __importDefault(__webpack_require__(/*! ./login.component.html */ "./src/login/login.component.html"));
const login_component_css_1 = __importDefault(__webpack_require__(/*! ./login.component.css */ "./src/login/login.component.css"));
let LoginComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _instanceExtraInitializers = [];
    let _onClick_decorators;
    return _a = class LoginComponent extends _classSuper {
            constructor() {
                super(login_component_html_1.default, login_component_css_1.default);
                this.clickEvent = (__runInitializers(this, _instanceExtraInitializers), new webez_1.EventSubject());
            }
            sendUserID() {
                return this.userData;
            }
            onClick(event) {
                const username = this.getValue("InUserID");
                const password = this.getValue("InKeyID");
                this.userData = {
                    username: username,
                    password: password
                };
                this.clickEvent.next();
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _onClick_decorators = [(0, webez_1.Click)("submit")];
            __esDecorate(_a, null, _onClick_decorators, { kind: "method", name: "onClick", static: false, private: false, access: { has: obj => "onClick" in obj, get: obj => obj.onClick }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.LoginComponent = LoginComponent;


/***/ }),

/***/ "./src/notification/notification.component.css":
/*!*****************************************************!*\
  !*** ./src/notification/notification.component.css ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#notification-item{\r\n    display: flex;\r\n    justify-content: space-between;\r\n    width: 50%;\r\n    margin: 0 auto;\r\n}");

/***/ }),

/***/ "./src/notification/notification.component.html":
/*!******************************************************!*\
  !*** ./src/notification/notification.component.html ***!
  \******************************************************/
/***/ ((module) => {

module.exports = "<div id=\"notification-item\">\n    <p id=\"date\">Text</p>\n    <p id=\"notif_type\">is</p>\n    <p id=\"description\">annoying</p>\n    <p id=\"doctor-name\"></p>\n</div>";

/***/ }),

/***/ "./src/notification/notification.component.ts":
/*!****************************************************!*\
  !*** ./src/notification/notification.component.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationComponent = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const notification_component_html_1 = __importDefault(__webpack_require__(/*! ./notification.component.html */ "./src/notification/notification.component.html"));
const notification_component_css_1 = __importDefault(__webpack_require__(/*! ./notification.component.css */ "./src/notification/notification.component.css"));
let NotificationComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _date_decorators;
    let _date_initializers = [];
    let _date_extraInitializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _type_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _doctorName_decorators;
    let _doctorName_initializers = [];
    let _doctorName_extraInitializers = [];
    return _a = class NotificationComponent extends _classSuper {
            constructor(date, type, description, doctorName) {
                super(notification_component_html_1.default, notification_component_css_1.default);
                this.date = __runInitializers(this, _date_initializers, "");
                this.type = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _type_initializers, ""));
                this.description = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _description_initializers, ""));
                this.doctorName = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _doctorName_initializers, ""));
                __runInitializers(this, _doctorName_extraInitializers);
                this.date = date;
                this.type = type;
                this.description = description;
                this.doctorName = doctorName;
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _date_decorators = [(0, webez_1.BindValue)('date')];
            _type_decorators = [(0, webez_1.BindValue)('notif_type')];
            _description_decorators = [(0, webez_1.BindValue)('description')];
            _doctorName_decorators = [(0, webez_1.BindValue)('doctor-name')];
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: obj => "date" in obj, get: obj => obj.date, set: (obj, value) => { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _doctorName_decorators, { kind: "field", name: "doctorName", static: false, private: false, access: { has: obj => "doctorName" in obj, get: obj => obj.doctorName, set: (obj, value) => { obj.doctorName = value; } }, metadata: _metadata }, _doctorName_initializers, _doctorName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.NotificationComponent = NotificationComponent;


/***/ }),

/***/ "./src/signup/signup.component.css":
/*!*****************************************!*\
  !*** ./src/signup/signup.component.css ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".title{\r\n\tfont-size: 20px;\r\n\tcolor: #000;\r\n\tmargin-bottom: 20px;\r\n\tbackground-color: bisque;\r\n}\r\n\r\n#welcome-banner{\r\n\tbackground-color: rgb(195, 255, 230);\r\n\tfont-size: 40px;\r\n\ttext-align:center;\r\n\tfont-family:Verdana, Geneva, Tahoma, sans-serif;\r\n\tborder-radius: 20px;\r\n\ttext-shadow: 2px 2px grey;\r\n\tfont-style: italic;\r\n}\r\n\r\n#enterButtons{\r\n\tpadding: 20px\r\n}\r\n\r\n#login{\r\n\tfont-family:'Courier New', Courier, monospace;\r\n\tfont-weight: bold;\r\n\tborder-radius: 100px;\r\n\tfont-size: large;\r\n\tbackground-color: aquamarine;\r\n\tborder-color: black;\r\n\tpadding: 30px;\r\n}\r\n\r\n#signUp{\r\n\tfont-family:'Courier New', Courier, monospace;\r\n\tfont-weight: bold;\r\n\tborder-radius: 100px;\r\n\tfont-size: large;\r\n\tbackground-color: aquamarine;\r\n\tborder-color: black;\r\n\tpadding: 30px;\r\n}\r\n\r\n#submit{\r\n\tborder-radius: 4px;\r\n\tbackground-color: aquamarine;\r\n\tborder-color: black;\r\n\tborder-style:solid;\r\n\tbox-shadow: 0px 2px black;\r\n}\r\n\r\ninput[type=text], input[type=password] {\r\n\twidth: 100%;\r\n\tpadding: 12px 20px;\r\n\tmargin: 8px 0;\r\n\tdisplay: inline-block;\r\n\tborder: 1px solid #ccc;\r\n\tborder-radius: 4px;\r\n\tbox-sizing: border-box;\r\n  }\r\n  \r\n  /* Style the submit button */\r\n  input[type=submit] {\r\n\twidth: 100%;\r\n\tbackground-color: #04AA6D;\r\n\tcolor: white;\r\n\tpadding: 14px 20px;\r\n\tmargin: 8px 0;\r\n\tborder: none;\r\n\tborder-radius: 4px;\r\n\tcursor: pointer;\r\n  }\r\n  \r\n  /* Add a background color to the submit button on mouse-over */\r\n  input[type=submit]:hover {\r\n\tbackground-color: #45a049;\r\n  }");

/***/ }),

/***/ "./src/signup/signup.component.html":
/*!******************************************!*\
  !*** ./src/signup/signup.component.html ***!
  \******************************************/
/***/ ((module) => {

module.exports = "<!-- New User Form -->\n<div id=\"new-user\">\n    <form>\n        <label for=\"signup-UserID\">Username:</label>\n        <input type=\"text\" id=\"signup-UserID\" name=\"username\" placeholder=\"Username\" required>\n  \n        <label for=\"signup-KeyID\">Password:</label>\n        <input type=\"password\" id=\"signup-KeyID\" name=\"password\" placeholder=\"Password\" required>\n  \n        <label for=\"signup-ReEnterPassword\">Re-Enter Password:</label>\n        <input type=\"password\" id=\"signup-ReEnterPassword\" name=\"reEnterPassword\" placeholder=\"Re-enter Password\" required>\n  \n        <label for=\"signup-Email\">Enter Email:</label>\n        <input type=\"email\" id=\"signup-Email\" name=\"email\" placeholder=\"Email\" required>\n  \n        <label for=\"signup-PhoneID\">Enter Phone Number:</label>\n        <input type=\"text\" id=\"signup-PhoneID\" name=\"phone-number\" placeholder=\"Phone Number\" required>\n        \n        <button id=\"submit\">Submit</button>\n    </form>\n  </div>";

/***/ }),

/***/ "./src/signup/signup.component.ts":
/*!****************************************!*\
  !*** ./src/signup/signup.component.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignupComponent = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const signup_component_html_1 = __importDefault(__webpack_require__(/*! ./signup.component.html */ "./src/signup/signup.component.html"));
const signup_component_css_1 = __importDefault(__webpack_require__(/*! ./signup.component.css */ "./src/signup/signup.component.css"));
let SignupComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _instanceExtraInitializers = [];
    let _onClick_decorators;
    return _a = class SignupComponent extends _classSuper {
            constructor() {
                super(signup_component_html_1.default, signup_component_css_1.default);
                this.clickEvent = (__runInitializers(this, _instanceExtraInitializers), new webez_1.EventSubject());
            }
            onClick(event) {
                this.clickEvent.next();
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _onClick_decorators = [(0, webez_1.Click)("submit")];
            __esDecorate(_a, null, _onClick_decorators, { kind: "method", name: "onClick", static: false, private: false, access: { has: obj => "onClick" in obj, get: obj => obj.onClick }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.SignupComponent = SignupComponent;


/***/ }),

/***/ "./src/user_home/user_home.component.css":
/*!***********************************************!*\
  !*** ./src/user_home/user_home.component.css ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#patient-tab{\r\n    border-radius: 20px;\r\n    padding: 20px;\r\n    font-size: 23px;\r\n    background-color: rgb(163, 224, 255);\r\n    border-color: black;\r\n\tborder-style:solid;\r\n\tbox-shadow: 0px 5px black;\r\n}\r\n\r\n#provider-tab{\r\n    border-radius: 20px;\r\n    padding: 20px;\r\n    font-size: 23px;\r\n    background-color: rgb(181, 252, 208);\r\n    border-color: black;\r\n\tborder-style:solid;\r\n\tbox-shadow: 0px 5px black;\r\n}\r\n\r\n#health-tab{\r\n    border-radius: 20px;\r\n    padding: 20px;\r\n    font-size: 23px;\r\n    background-color:rgb(228, 189, 254);\r\n    border-color: black;\r\n\tborder-style:solid;\r\n\tbox-shadow: 0px 5px black;\r\n}\r\n\r\n#notifications-tab{\r\n    border-radius: 20px;\r\n    padding: 20px;\r\n    font-size: 23px;\r\n    background-color: rgb(255, 180, 180);\r\n    border-color: black;\r\n\tborder-style:solid;\r\n\tbox-shadow: 0px 5px black;\r\n}\r\n\r\n#tabs{\r\n    padding: 20px;\r\n    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;\r\n}\r\n\r\n.fade-in-text {\r\n\tanimation: fadeIn 6s;\r\n  }\r\n\r\n  @keyframes fadeIn {\r\n\t0% { opacity: 0; }\r\n\t100% { opacity: 1; }\r\n  }\r\n\r\n  @-moz-keyframes fadeIn {\r\n\t0% { opacity: 0; }\r\n\t100% { opacity: 1; }\r\n  }\r\n  \r\n  @-webkit-keyframes fadeIn {\r\n\t0% { opacity: 0; }\r\n\t100% { opacity: 1; }\r\n  }\r\n  \r\n  @-o-keyframes fadeIn {\r\n\t0% { opacity: 0; }\r\n\t100% { opacity: 1; }\r\n  }\r\n  \r\n  @-ms-keyframes fadeIn {\r\n\t0% { opacity: 0; }\r\n\t100% { opacity: 1; }\r\n  }");

/***/ }),

/***/ "./src/user_home/user_home.component.html":
/*!************************************************!*\
  !*** ./src/user_home/user_home.component.html ***!
  \************************************************/
/***/ ((module) => {

module.exports = "<div id=\"tabs\">\r\n<button class=\"tablink\" id=\"patient-tab\">Patient Information</button>\r\n<button class=\"tablink\" id=\"provider-tab\">Health Provider Information</button>\r\n<button class=\"tablink\" id=\"health-tab\">Perscription and Diagnoses</button>\r\n<button class=\"tablink\" id=\"notifications-tab\">Appointments/Notifications</button>\r\n</div>\r\n\r\n<div id=\"patientInfo\" class=\"fade-in-text\">\r\n    <p>Username: <span id=\"patient-username\"></span></p>\r\n    <p>Height: <span id=\"patient-height\"></span></p>\r\n    <p>Weight: <span id=\"patient-weight\"></span></p>\r\n    <p>Phone Number: <span id=\"patient-number\"></span></p>\r\n  </div>\r\n\r\n\r\n  <div id=\"healthprovider-info\" class=\"fade-in-text\">\r\n    <h3>Hospital: <span id=\"hospital-name\"></span></h3>\r\n    <p>Primary Doctor: <span id=\"doctor-name\"></span></p>\r\n    <p>Primary Doctor Number: <span id=\"docotor-number\"></span></p>\r\n    <p>Health Insurance: <span id=\"health-insurance\"></span></p>\r\n  </div>\r\n\r\n  <div id=\"perscription-diagnoses\" class=\"fade-in-text\">\r\n    <h3>Rx Number: <span id=\"rx-number\"></span></h3>\r\n\r\n    <p>Current Perscriptions: <span id=\"perscriptions\"></span>\r\n    <div id=\"perscription-list\"></div>\r\n    <input type=\"text\" id=\"perscription-appended\" name=\"perscirp\" placeholder=\"Enter New Diagnoses\">\r\n<button id=\"add-perscription\">Add Perscription</button>\r\n    <p>Diagnoses: <span id=\"diagnoses-items\"></span></p>\r\n    <div id=\"diagonis-list\"></div>\r\n    <input type=\"text\" id=\"diagnosis-appended\" name=\"diagn\" placeholder=\"Enter New Diagnoses\">\r\n<button id=\"add-diagnoses\">Add Diagnosis</button>\r\n<p>Symptoms: <span id=\"symptoms-items\"></span></p>\r\n    <div id=\"symptoms-list\"></div>\r\n    <input type=\"text\" id=\"symptoms-appended\" name=\"symptom\" placeholder=\"Enter New Symptoms\">\r\n<button id=\"add-symptoms\">Add Symptoms</button>\r\n  </div>\r\n  \r\n  </div>\r\n\r\n  <div id=\"notifications\" class=\"fade-in-text\">\r\n    <h3>Recent Notifications:</h3>\r\n    <p>Upcoming Appointments: </p><div id=\"appointments\"></div>\r\n    <p>Perscription Reminders: </p><div id=\"perscription-reminders\"></div>\r\n  </div>";

/***/ }),

/***/ "./src/user_home/user_home.component.ts":
/*!**********************************************!*\
  !*** ./src/user_home/user_home.component.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserHomepageComponent = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const user_home_component_html_1 = __importDefault(__webpack_require__(/*! ./user_home.component.html */ "./src/user_home/user_home.component.html"));
const user_home_component_css_1 = __importDefault(__webpack_require__(/*! ./user_home.component.css */ "./src/user_home/user_home.component.css"));
const Diagnoses_component_1 = __webpack_require__(/*! ../Diagnoses/Diagnoses.component */ "./src/Diagnoses/Diagnoses.component.ts");
const Perscriptions_component_1 = __webpack_require__(/*! ../Perscriptions/Perscriptions.component */ "./src/Perscriptions/Perscriptions.component.ts");
const Symptoms_component_1 = __webpack_require__(/*! ../Symptoms/Symptoms.component */ "./src/Symptoms/Symptoms.component.ts");
const notification_component_1 = __webpack_require__(/*! ../notification/notification.component */ "./src/notification/notification.component.ts");
const axios_1 = __importDefault(__webpack_require__(/*! axios */ "./node_modules/axios/dist/browser/axios.cjs"));
function getUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`http://128.4.102.9:8000/users/${userId}`, {
            headers: {
                "X-API-KEY": "secret-key-123"
            }
        });
        return response.data;
    });
}
function getHealthEntries(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`http://128.4.102.9:8000/users/${userId}/health-entries/`, {
            headers: {
                "X-API-KEY": "secret-key-123"
            }
        });
        return response.data;
    });
}
let UserHomepageComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _instanceExtraInitializers = [];
    let _newDiagnosis_decorators;
    let _newDiagnosis_initializers = [];
    let _newDiagnosis_extraInitializers = [];
    let _newPerscription_decorators;
    let _newPerscription_initializers = [];
    let _newPerscription_extraInitializers = [];
    let _newSymptom_decorators;
    let _newSymptom_initializers = [];
    let _newSymptom_extraInitializers = [];
    let _profileDisplay_decorators;
    let _profileDisplay_initializers = [];
    let _profileDisplay_extraInitializers = [];
    let _providerDisplay_decorators;
    let _providerDisplay_initializers = [];
    let _providerDisplay_extraInitializers = [];
    let _healthDisplay_decorators;
    let _healthDisplay_initializers = [];
    let _healthDisplay_extraInitializers = [];
    let _notifcationDisplay_decorators;
    let _notifcationDisplay_initializers = [];
    let _notifcationDisplay_extraInitializers = [];
    let _patientName_decorators;
    let _patientName_initializers = [];
    let _patientName_extraInitializers = [];
    let _height_decorators;
    let _height_initializers = [];
    let _height_extraInitializers = [];
    let _weight_decorators;
    let _weight_initializers = [];
    let _weight_extraInitializers = [];
    let _patientNumber_decorators;
    let _patientNumber_initializers = [];
    let _patientNumber_extraInitializers = [];
    let _onDiagnosisChange_decorators;
    let _addDiagnosis_decorators;
    let _onPerscriptionChange_decorators;
    let _addPerscription_decorators;
    let _onSymptomChange_decorators;
    let _addSymptom_decorators;
    let _showPatient_decorators;
    let _showProvider_decorators;
    let _showHealth_decorators;
    let _showNotification_decorators;
    return _a = class UserHomepageComponent extends _classSuper {
            constructor() {
                super(user_home_component_html_1.default, user_home_component_css_1.default);
                this.diagnoses = (__runInitializers(this, _instanceExtraInitializers), new Diagnoses_component_1.DiagnosesComponent());
                this.perscriptions = new Perscriptions_component_1.PerscriptionsComponent();
                this.symptoms = new Symptoms_component_1.SymptomsComponent();
                this.newDiagnosis = __runInitializers(this, _newDiagnosis_initializers, "");
                this.newPerscription = (__runInitializers(this, _newDiagnosis_extraInitializers), __runInitializers(this, _newPerscription_initializers, ""));
                this.newSymptom = (__runInitializers(this, _newPerscription_extraInitializers), __runInitializers(this, _newSymptom_initializers, ""));
                this.profileDisplay = (__runInitializers(this, _newSymptom_extraInitializers), __runInitializers(this, _profileDisplay_initializers, "block"));
                this.providerDisplay = (__runInitializers(this, _profileDisplay_extraInitializers), __runInitializers(this, _providerDisplay_initializers, "none"));
                this.healthDisplay = (__runInitializers(this, _providerDisplay_extraInitializers), __runInitializers(this, _healthDisplay_initializers, "none"));
                this.notifcationDisplay = (__runInitializers(this, _healthDisplay_extraInitializers), __runInitializers(this, _notifcationDisplay_initializers, "none"));
                this.patientName = (__runInitializers(this, _notifcationDisplay_extraInitializers), __runInitializers(this, _patientName_initializers, ""));
                this.height = (__runInitializers(this, _patientName_extraInitializers), __runInitializers(this, _height_initializers, 0));
                this.weight = (__runInitializers(this, _height_extraInitializers), __runInitializers(this, _weight_initializers, 0));
                this.patientNumber = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _patientNumber_initializers, ""));
                this.userID = (__runInitializers(this, _patientNumber_extraInitializers), 0);
            }
            setUserData() {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        this.userInfo = yield getUser(this.userID);
                        this.initData();
                    }
                    catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                });
            }
            setHealthData() {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const healthEntries = yield getHealthEntries(this.userID);
                        for (const entry of healthEntries) {
                            const data = entry;
                            const notifs = new notification_component_1.NotificationComponent(data.date, data.entry_type, data.description, data.doctor_info);
                            if (data.entry_type == 'appointment') {
                                this.addComponent(notifs, "appointments");
                            }
                            else if (data.entry_type == "prescription") {
                                this.addComponent(notifs, "perscription-reminders");
                            }
                        }
                    }
                    catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                });
            }
            onDiagnosisChange(event) {
                this.newDiagnosis = event.value;
            }
            initData() {
                this.patientName = this.userInfo.username;
                this.height = this.userInfo.height;
                this.weight = this.userInfo.weight;
                this.patientNumber = this.userInfo.phone_number;
            }
            setUserID(userID) {
                this.userID = userID;
                this.setUserData();
                this.setHealthData();
            }
            addDiagnosis() {
                this.diagnoses = new Diagnoses_component_1.DiagnosesComponent();
                this.diagnoses.changeString(this.newDiagnosis);
                this.addComponent(this.diagnoses, "diagonis-list");
            }
            onPerscriptionChange(event) {
                this.newPerscription = event.value;
            }
            addPerscription() {
                this.perscriptions = new Perscriptions_component_1.PerscriptionsComponent();
                this.perscriptions.changeString(this.newPerscription);
                this.addComponent(this.perscriptions, "perscription-list");
            }
            onSymptomChange(event) {
                this.newSymptom = event.value;
            }
            addSymptom() {
                this.symptoms = new Symptoms_component_1.SymptomsComponent();
                this.symptoms.changeString(this.newSymptom);
                this.addComponent(this.symptoms, "symptoms-list");
            }
            showPatient() {
                this.profileDisplay = "block";
                this.providerDisplay = "none";
                this.healthDisplay = "none";
                this.notifcationDisplay = "none";
            }
            showProvider() {
                this.profileDisplay = "none";
                this.providerDisplay = "block";
                this.healthDisplay = "none";
                this.notifcationDisplay = "none";
            }
            showHealth() {
                this.profileDisplay = "none";
                this.providerDisplay = "none";
                this.healthDisplay = "block";
                this.notifcationDisplay = "none";
            }
            showNotification() {
                this.profileDisplay = "none";
                this.providerDisplay = "none";
                this.healthDisplay = "none";
                this.notifcationDisplay = "block";
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _newDiagnosis_decorators = [(0, webez_1.BindValue)("diagnosis-appended")];
            _newPerscription_decorators = [(0, webez_1.BindValue)("perscription-appended")];
            _newSymptom_decorators = [(0, webez_1.BindValue)("symptoms-appended")];
            _profileDisplay_decorators = [(0, webez_1.BindStyle)("patientInfo", "display")];
            _providerDisplay_decorators = [(0, webez_1.BindStyle)("healthprovider-info", "display")];
            _healthDisplay_decorators = [(0, webez_1.BindStyle)("perscription-diagnoses", "display")];
            _notifcationDisplay_decorators = [(0, webez_1.BindStyle)("notifications", "display")];
            _patientName_decorators = [(0, webez_1.BindValue)("patient-username")];
            _height_decorators = [(0, webez_1.BindValueToNumber)("patient-height")];
            _weight_decorators = [(0, webez_1.BindValueToNumber)("patient-weight")];
            _patientNumber_decorators = [(0, webez_1.BindValue)("patient-number")];
            _onDiagnosisChange_decorators = [(0, webez_1.Change)("diagnosis-appended")];
            _addDiagnosis_decorators = [(0, webez_1.Click)("add-diagnoses")];
            _onPerscriptionChange_decorators = [(0, webez_1.Change)("perscription-appended")];
            _addPerscription_decorators = [(0, webez_1.Click)("add-perscription")];
            _onSymptomChange_decorators = [(0, webez_1.Change)("symptoms-appended")];
            _addSymptom_decorators = [(0, webez_1.Click)("add-symptoms")];
            _showPatient_decorators = [(0, webez_1.Click)("patient-tab")];
            _showProvider_decorators = [(0, webez_1.Click)("provider-tab")];
            _showHealth_decorators = [(0, webez_1.Click)("health-tab")];
            _showNotification_decorators = [(0, webez_1.Click)("notifications-tab")];
            __esDecorate(_a, null, _onDiagnosisChange_decorators, { kind: "method", name: "onDiagnosisChange", static: false, private: false, access: { has: obj => "onDiagnosisChange" in obj, get: obj => obj.onDiagnosisChange }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addDiagnosis_decorators, { kind: "method", name: "addDiagnosis", static: false, private: false, access: { has: obj => "addDiagnosis" in obj, get: obj => obj.addDiagnosis }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onPerscriptionChange_decorators, { kind: "method", name: "onPerscriptionChange", static: false, private: false, access: { has: obj => "onPerscriptionChange" in obj, get: obj => obj.onPerscriptionChange }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addPerscription_decorators, { kind: "method", name: "addPerscription", static: false, private: false, access: { has: obj => "addPerscription" in obj, get: obj => obj.addPerscription }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _onSymptomChange_decorators, { kind: "method", name: "onSymptomChange", static: false, private: false, access: { has: obj => "onSymptomChange" in obj, get: obj => obj.onSymptomChange }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _addSymptom_decorators, { kind: "method", name: "addSymptom", static: false, private: false, access: { has: obj => "addSymptom" in obj, get: obj => obj.addSymptom }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _showPatient_decorators, { kind: "method", name: "showPatient", static: false, private: false, access: { has: obj => "showPatient" in obj, get: obj => obj.showPatient }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _showProvider_decorators, { kind: "method", name: "showProvider", static: false, private: false, access: { has: obj => "showProvider" in obj, get: obj => obj.showProvider }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _showHealth_decorators, { kind: "method", name: "showHealth", static: false, private: false, access: { has: obj => "showHealth" in obj, get: obj => obj.showHealth }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _showNotification_decorators, { kind: "method", name: "showNotification", static: false, private: false, access: { has: obj => "showNotification" in obj, get: obj => obj.showNotification }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _newDiagnosis_decorators, { kind: "field", name: "newDiagnosis", static: false, private: false, access: { has: obj => "newDiagnosis" in obj, get: obj => obj.newDiagnosis, set: (obj, value) => { obj.newDiagnosis = value; } }, metadata: _metadata }, _newDiagnosis_initializers, _newDiagnosis_extraInitializers);
            __esDecorate(null, null, _newPerscription_decorators, { kind: "field", name: "newPerscription", static: false, private: false, access: { has: obj => "newPerscription" in obj, get: obj => obj.newPerscription, set: (obj, value) => { obj.newPerscription = value; } }, metadata: _metadata }, _newPerscription_initializers, _newPerscription_extraInitializers);
            __esDecorate(null, null, _newSymptom_decorators, { kind: "field", name: "newSymptom", static: false, private: false, access: { has: obj => "newSymptom" in obj, get: obj => obj.newSymptom, set: (obj, value) => { obj.newSymptom = value; } }, metadata: _metadata }, _newSymptom_initializers, _newSymptom_extraInitializers);
            __esDecorate(null, null, _profileDisplay_decorators, { kind: "field", name: "profileDisplay", static: false, private: false, access: { has: obj => "profileDisplay" in obj, get: obj => obj.profileDisplay, set: (obj, value) => { obj.profileDisplay = value; } }, metadata: _metadata }, _profileDisplay_initializers, _profileDisplay_extraInitializers);
            __esDecorate(null, null, _providerDisplay_decorators, { kind: "field", name: "providerDisplay", static: false, private: false, access: { has: obj => "providerDisplay" in obj, get: obj => obj.providerDisplay, set: (obj, value) => { obj.providerDisplay = value; } }, metadata: _metadata }, _providerDisplay_initializers, _providerDisplay_extraInitializers);
            __esDecorate(null, null, _healthDisplay_decorators, { kind: "field", name: "healthDisplay", static: false, private: false, access: { has: obj => "healthDisplay" in obj, get: obj => obj.healthDisplay, set: (obj, value) => { obj.healthDisplay = value; } }, metadata: _metadata }, _healthDisplay_initializers, _healthDisplay_extraInitializers);
            __esDecorate(null, null, _notifcationDisplay_decorators, { kind: "field", name: "notifcationDisplay", static: false, private: false, access: { has: obj => "notifcationDisplay" in obj, get: obj => obj.notifcationDisplay, set: (obj, value) => { obj.notifcationDisplay = value; } }, metadata: _metadata }, _notifcationDisplay_initializers, _notifcationDisplay_extraInitializers);
            __esDecorate(null, null, _patientName_decorators, { kind: "field", name: "patientName", static: false, private: false, access: { has: obj => "patientName" in obj, get: obj => obj.patientName, set: (obj, value) => { obj.patientName = value; } }, metadata: _metadata }, _patientName_initializers, _patientName_extraInitializers);
            __esDecorate(null, null, _height_decorators, { kind: "field", name: "height", static: false, private: false, access: { has: obj => "height" in obj, get: obj => obj.height, set: (obj, value) => { obj.height = value; } }, metadata: _metadata }, _height_initializers, _height_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: obj => "weight" in obj, get: obj => obj.weight, set: (obj, value) => { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _patientNumber_decorators, { kind: "field", name: "patientNumber", static: false, private: false, access: { has: obj => "patientNumber" in obj, get: obj => obj.patientNumber, set: (obj, value) => { obj.patientNumber = value; } }, metadata: _metadata }, _patientNumber_initializers, _patientNumber_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UserHomepageComponent = UserHomepageComponent;


/***/ }),

/***/ "./styles.css":
/*!********************!*\
  !*** ./styles.css ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!./node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!*************************!*\
  !*** ./wbcore/start.ts ***!
  \*************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../styles.css */ "./styles.css");
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const main_component_1 = __webpack_require__(/*! ../src/app/main.component */ "./src/app/main.component.ts");
(0, webez_1.bootstrap)(main_component_1.MainComponent);

})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map