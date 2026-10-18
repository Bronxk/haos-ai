//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, _ = g ? g.emptyScript : "", v = h.reactiveElementPolyfillSupport, y = (e, t) => e, b = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? _ : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, x = (e, t) => !l(e, t), S = {
	attribute: !0,
	type: String,
	converter: b,
	reflect: !1,
	useDefault: !1,
	hasChanged: x
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var C = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = S) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? S;
	}
	static _$Ei() {
		if (this.hasOwnProperty(y("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(y("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(y("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? b : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? b : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? x)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[y("elementProperties")] = /* @__PURE__ */ new Map(), C[y("finalized")] = /* @__PURE__ */ new Map(), v?.({ ReactiveElement: C }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var ee = globalThis, te = (e) => e, ne = ee.trustedTypes, re = ne ? ne.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ie = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, ae = "?" + w, oe = `<${ae}>`, T = document, se = () => T.createComment(""), ce = (e) => e === null || typeof e != "object" && typeof e != "function", le = Array.isArray, ue = (e) => le(e) || typeof e?.[Symbol.iterator] == "function", de = "[ 	\n\f\r]", fe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, pe = /-->/g, me = />/g, E = RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), he = /'/g, ge = /"/g, _e = /^(?:script|style|textarea|title)$/i, D = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), ve = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), ye = /* @__PURE__ */ new WeakMap(), k = T.createTreeWalker(T, 129);
function be(e, t) {
	if (!le(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return re === void 0 ? t : re.createHTML(t);
}
var xe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = fe;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === fe ? c[1] === "!--" ? o = pe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = E) : (_e.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = E) : o = me : o === E ? c[0] === ">" ? (o = i ?? fe, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? E : c[3] === "\"" ? ge : he) : o === ge || o === he ? o = E : o === pe || o === me ? o = fe : (o = E, i = void 0);
		let d = o === E && e[t + 1].startsWith("/>") ? " " : "";
		a += o === fe ? n + oe : l >= 0 ? (r.push(s), n.slice(0, l) + ie + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
	}
	return [be(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Se = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = xe(t, n);
		if (this.el = e.createElement(l, r), k.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = k.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ie)) {
					let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ee : r[1] === "?" ? De : r[1] === "@" ? Oe : Te
					}), i.removeAttribute(e);
				} else e.startsWith(w) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (_e.test(i.tagName)) {
					let e = i.textContent.split(w), t = e.length - 1;
					if (t > 0) {
						i.textContent = ne ? ne.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], se()), k.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], se());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ae) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(w, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += w.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = T.createElement("template");
		return n.innerHTML = e, n;
	}
};
function A(e, t, n = e, r) {
	if (t === ve) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = ce(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = A(e, i._$AS(e, t.values), i, r)), t;
}
var Ce = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? T).importNode(t, !0);
		k.currentNode = r;
		let i = k.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new we(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ke(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = k.nextNode(), a++);
		}
		return k.currentNode = T, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, we = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = A(this, e, t), ce(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== ve && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ue(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== O && ce(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Se.createElement(be(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ce(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ye.get(e.strings);
		return t === void 0 && ye.set(e.strings, t = new Se(e)), t;
	}
	k(t) {
		le(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(se()), this.O(se()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = te(e).nextSibling;
			te(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Te = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = O;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = A(this, e, t, 0), a = !ce(e) || e !== this._$AH && e !== ve, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = A(this, r[n + o], t, o), s === ve && (s = this._$AH[o]), a ||= !ce(s) || s !== this._$AH[o], s === O ? e = O : e !== O && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ee = class extends Te {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === O ? void 0 : e;
	}
}, De = class extends Te {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== O);
	}
}, Oe = class extends Te {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = A(this, e, t, 0) ?? O) === ve) return;
		let n = this._$AH, r = e === O && n !== O || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== O && (n === O || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ke = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		A(this, e);
	}
}, Ae = ee.litHtmlPolyfillSupport;
Ae?.(Se, we), (ee.litHtmlVersions ??= []).push("3.3.3");
var je = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new we(t.insertBefore(se(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Me = globalThis, Ne = class extends C {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return ve;
	}
};
Ne._$litElement$ = !0, Ne.finalized = !0, Me.litElementHydrateSupport?.({ LitElement: Ne });
var Pe = Me.litElementPolyfillSupport;
Pe?.({ LitElement: Ne }), (Me.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var Fe = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Ie = {
	attribute: !0,
	type: String,
	converter: b,
	reflect: !1,
	hasChanged: x
}, Le = (e = Ie, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function Re(e) {
	return (t, n) => typeof n == "object" ? Le(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function j(e) {
	return Re({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/identity.js
var ze = Symbol.for("yaml.alias"), Be = Symbol.for("yaml.document"), M = Symbol.for("yaml.map"), Ve = Symbol.for("yaml.pair"), N = Symbol.for("yaml.scalar"), He = Symbol.for("yaml.seq"), P = Symbol.for("yaml.node.type"), Ue = (e) => !!e && typeof e == "object" && e[P] === ze, We = (e) => !!e && typeof e == "object" && e[P] === Be, Ge = (e) => !!e && typeof e == "object" && e[P] === M, F = (e) => !!e && typeof e == "object" && e[P] === Ve, I = (e) => !!e && typeof e == "object" && e[P] === N, Ke = (e) => !!e && typeof e == "object" && e[P] === He;
function L(e) {
	if (e && typeof e == "object") switch (e[P]) {
		case M:
		case He: return !0;
	}
	return !1;
}
function R(e) {
	if (e && typeof e == "object") switch (e[P]) {
		case ze:
		case M:
		case N:
		case He: return !0;
	}
	return !1;
}
var qe = (e) => (I(e) || L(e)) && !!e.anchor, z = Symbol("break visit"), Je = Symbol("skip children"), Ye = Symbol("remove node");
function Xe(e, t) {
	let n = Qe(t);
	We(e) ? Ze(null, e.contents, n, Object.freeze([e])) === Ye && (e.contents = null) : Ze(null, e, n, Object.freeze([]));
}
Xe.BREAK = z, Xe.SKIP = Je, Xe.REMOVE = Ye;
function Ze(e, t, n, r) {
	let i = $e(e, t, n, r);
	if (R(i) || F(i)) return et(e, r, i), Ze(e, i, n, r);
	if (typeof i != "symbol") {
		if (L(t)) {
			r = Object.freeze(r.concat(t));
			for (let e = 0; e < t.items.length; ++e) {
				let i = Ze(e, t.items[e], n, r);
				if (typeof i == "number") e = i - 1;
				else if (i === z) return z;
				else i === Ye && (t.items.splice(e, 1), --e);
			}
		} else if (F(t)) {
			r = Object.freeze(r.concat(t));
			let e = Ze("key", t.key, n, r);
			if (e === z) return z;
			e === Ye && (t.key = null);
			let i = Ze("value", t.value, n, r);
			if (i === z) return z;
			i === Ye && (t.value = null);
		}
	}
	return i;
}
function Qe(e) {
	return typeof e == "object" && (e.Collection || e.Node || e.Value) ? Object.assign({
		Alias: e.Node,
		Map: e.Node,
		Scalar: e.Node,
		Seq: e.Node
	}, e.Value && {
		Map: e.Value,
		Scalar: e.Value,
		Seq: e.Value
	}, e.Collection && {
		Map: e.Collection,
		Seq: e.Collection
	}, e) : e;
}
function $e(e, t, n, r) {
	if (typeof n == "function") return n(e, t, r);
	if (Ge(t)) return n.Map?.(e, t, r);
	if (Ke(t)) return n.Seq?.(e, t, r);
	if (F(t)) return n.Pair?.(e, t, r);
	if (I(t)) return n.Scalar?.(e, t, r);
	if (Ue(t)) return n.Alias?.(e, t, r);
}
function et(e, t, n) {
	let r = t[t.length - 1];
	if (L(r)) r.items[e] = n;
	else if (F(r)) e === "key" ? r.key = n : r.value = n;
	else if (We(r)) r.contents = n;
	else {
		let e = Ue(r) ? "alias" : "scalar";
		throw Error(`Cannot replace node with ${e} parent`);
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/directives.js
var tt = {
	"!": "%21",
	",": "%2C",
	"[": "%5B",
	"]": "%5D",
	"{": "%7B",
	"}": "%7D"
}, nt = (e) => e.replace(/[!,[\]{}]/g, (e) => tt[e]), rt = class e {
	constructor(t, n) {
		this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, e.defaultYaml, t), this.tags = Object.assign({}, e.defaultTags, n);
	}
	clone() {
		let t = new e(this.yaml, this.tags);
		return t.docStart = this.docStart, t;
	}
	atDocument() {
		let t = new e(this.yaml, this.tags);
		switch (this.yaml.version) {
			case "1.1":
				this.atNextDocument = !0;
				break;
			case "1.2": this.atNextDocument = !1, this.yaml = {
				explicit: e.defaultYaml.explicit,
				version: "1.2"
			}, this.tags = Object.assign({}, e.defaultTags);
		}
		return t;
	}
	add(t, n) {
		this.atNextDocument &&= (this.yaml = {
			explicit: e.defaultYaml.explicit,
			version: "1.1"
		}, this.tags = Object.assign({}, e.defaultTags), !1);
		let r = t.trim().split(/[ \t]+/), i = r.shift();
		switch (i) {
			case "%TAG": {
				if (r.length !== 2 && (n(0, "%TAG directive should contain exactly two parts"), r.length < 2)) return !1;
				let [e, t] = r;
				return this.tags[e] = t, !0;
			}
			case "%YAML": {
				if (this.yaml.explicit = !0, r.length !== 1) return n(0, "%YAML directive should contain exactly one part"), !1;
				let [e] = r;
				if (e === "1.1" || e === "1.2") return this.yaml.version = e, !0;
				{
					let t = /^\d+\.\d+$/.test(e);
					return n(6, `Unsupported YAML version ${e}`, t), !1;
				}
			}
			default: return n(0, `Unknown directive ${i}`, !0), !1;
		}
	}
	tagName(e, t) {
		if (e === "!") return "!";
		if (e[0] !== "!") return t(`Not a valid tag: ${e}`), null;
		if (e[1] === "<") {
			let n = e.slice(2, -1);
			return n === "!" || n === "!!" ? (t(`Verbatim tags aren't resolved, so ${e} is invalid.`), null) : (e[e.length - 1] !== ">" && t("Verbatim tags must end with a >"), n);
		}
		let [, n, r] = e.match(/^(.*!)([^!]*)$/s);
		r || t(`The ${e} tag has no suffix`);
		let i = this.tags[n];
		if (i) try {
			return i + decodeURIComponent(r);
		} catch (e) {
			return t(String(e)), null;
		}
		return n === "!" ? e : (t(`Could not resolve tag: ${e}`), null);
	}
	tagString(e) {
		for (let [t, n] of Object.entries(this.tags)) if (e.startsWith(n)) return t + nt(e.substring(n.length));
		return e[0] === "!" ? e : `!<${e}>`;
	}
	toString(e) {
		let t = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], n = Object.entries(this.tags), r;
		if (e && n.length > 0 && R(e.contents)) {
			let t = {};
			Xe(e.contents, (e, n) => {
				R(n) && n.tag && (t[n.tag] = !0);
			}), r = Object.keys(t);
		} else r = [];
		for (let [i, a] of n) (i !== "!!" || a !== "tag:yaml.org,2002:") && (!e || r.some((e) => e.startsWith(a))) && t.push(`%TAG ${i} ${a}`);
		return t.join("\n");
	}
};
rt.defaultYaml = {
	explicit: !1,
	version: "1.2"
}, rt.defaultTags = { "!!": "tag:yaml.org,2002:" };
//#endregion
//#region node_modules/yaml/browser/dist/doc/anchors.js
function it(e) {
	if (/[\x00-\x19\s,[\]{}]/.test(e)) {
		let t = `Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;
		throw Error(t);
	}
	return !0;
}
function at(e) {
	let t = /* @__PURE__ */ new Set();
	return Xe(e, { Value(e, n) {
		n.anchor && t.add(n.anchor);
	} }), t;
}
function ot(e, t) {
	for (let n = 1;; ++n) {
		let r = `${e}${n}`;
		if (!t.has(r)) return r;
	}
}
function st(e, t) {
	let n = [], r = /* @__PURE__ */ new Map(), i = null;
	return {
		onAnchor: (r) => {
			n.push(r), i ??= at(e);
			let a = ot(t, i);
			return i.add(a), a;
		},
		setAnchors: () => {
			for (let e of n) {
				let t = r.get(e);
				if (typeof t == "object" && t.anchor && (I(t.node) || L(t.node))) t.node.anchor = t.anchor;
				else {
					let t = /* @__PURE__ */ Error("Failed to resolve repeated object (this should not happen)");
					throw t.source = e, t;
				}
			}
		},
		sourceObjects: r
	};
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/applyReviver.js
function ct(e, t, n, r) {
	if (r && typeof r == "object") {
		if (Array.isArray(r)) for (let t = 0, n = r.length; t < n; ++t) {
			let n = r[t], i = ct(e, r, String(t), n);
			i === void 0 ? delete r[t] : i !== n && (r[t] = i);
		}
		else if (r instanceof Map) for (let t of Array.from(r.keys())) {
			let n = r.get(t), i = ct(e, r, t, n);
			i === void 0 ? r.delete(t) : i !== n && r.set(t, i);
		}
		else if (r instanceof Set) for (let t of Array.from(r)) {
			let n = ct(e, r, t, t);
			n === void 0 ? r.delete(t) : n !== t && (r.delete(t), r.add(n));
		}
		else for (let [t, n] of Object.entries(r)) {
			let i = ct(e, r, t, n);
			i === void 0 ? delete r[t] : i !== n && (r[t] = i);
		}
	}
	return e.call(t, n, r);
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/toJS.js
function B(e, t, n) {
	if (Array.isArray(e)) return e.map((e, t) => B(e, String(t), n));
	if (e && typeof e.toJSON == "function") {
		if (!n || !qe(e)) return e.toJSON(t, n);
		let r = {
			aliasCount: 0,
			count: 1,
			res: void 0
		};
		n.anchors.set(e, r), n.onCreate = (e) => {
			r.res = e, delete n.onCreate;
		};
		let i = e.toJSON(t, n);
		return n.onCreate && n.onCreate(i), i;
	}
	return typeof e == "bigint" && !n?.keep ? Number(e) : e;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Node.js
var lt = class {
	constructor(e) {
		Object.defineProperty(this, P, { value: e });
	}
	clone() {
		let e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
		return this.range && (e.range = this.range.slice()), e;
	}
	toJS(e, { mapAsMap: t, maxAliasCount: n, onAnchor: r, reviver: i } = {}) {
		if (!We(e)) throw TypeError("A document argument is required");
		let a = {
			anchors: /* @__PURE__ */ new Map(),
			doc: e,
			keep: !0,
			mapAsMap: t === !0,
			mapKeyWarned: !1,
			maxAliasCount: typeof n == "number" ? n : 100
		}, o = B(this, "", a);
		if (typeof r == "function") for (let { count: e, res: t } of a.anchors.values()) r(t, e);
		return typeof i == "function" ? ct(i, { "": o }, "", o) : o;
	}
}, ut = class extends lt {
	constructor(e) {
		super(ze), this.source = e, Object.defineProperty(this, "tag", { set() {
			throw Error("Alias nodes cannot have tags");
		} });
	}
	resolve(e, t) {
		if (t?.maxAliasCount === 0) throw ReferenceError("Alias resolution is disabled");
		let n;
		t?.aliasResolveCache ? n = t.aliasResolveCache : (n = [], Xe(e, { Node: (e, t) => {
			(Ue(t) || qe(t)) && n.push(t);
		} }), t && (t.aliasResolveCache = n));
		let r;
		for (let e of n) {
			if (e === this) break;
			e.anchor === this.source && (r = e);
		}
		if (r && t) {
			let { anchors: e, doc: n, maxAliasCount: i } = t, a = e.get(r);
			/* istanbul ignore if */
			if (a ||= (B(r, null, t), e.get(r)), a?.res === void 0) throw ReferenceError("This should not happen: Alias anchor was not resolved?");
			if (i >= 0 && (a.count += 1, a.aliasCount === 0 && (a.aliasCount = dt(n, r, e)), a.count * a.aliasCount > i)) throw ReferenceError("Excessive alias count indicates a resource exhaustion attack");
		}
		return r;
	}
	toJSON(e, t) {
		if (!t) return { source: this.source };
		let n = this.resolve(t.doc, t);
		if (!n) {
			let e = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
			throw ReferenceError(e);
		}
		return t.anchors.get(n).res;
	}
	toString(e, t, n) {
		let r = `*${this.source}`;
		if (e) {
			if (it(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source)) {
				let e = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
				throw Error(e);
			}
			if (e.implicitKey) return `${r} `;
		}
		return r;
	}
};
function dt(e, t, n) {
	if (Ue(t)) {
		let r = t.resolve(e), i = n && r && n.get(r);
		return i ? i.count * i.aliasCount : 0;
	}
	if (L(t)) {
		let r = 0;
		for (let i of t.items) {
			let t = dt(e, i, n);
			t > r && (r = t);
		}
		return r;
	}
	if (F(t)) {
		let r = dt(e, t.key, n), i = dt(e, t.value, n);
		return Math.max(r, i);
	}
	return 1;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Scalar.js
var ft = (e) => !e || typeof e != "function" && typeof e != "object", V = class extends lt {
	constructor(e) {
		super(N), this.value = e;
	}
	toJSON(e, t) {
		return t?.keep ? this.value : B(this.value, e, t);
	}
	toString() {
		return String(this.value);
	}
};
V.BLOCK_FOLDED = "BLOCK_FOLDED", V.BLOCK_LITERAL = "BLOCK_LITERAL", V.PLAIN = "PLAIN", V.QUOTE_DOUBLE = "QUOTE_DOUBLE", V.QUOTE_SINGLE = "QUOTE_SINGLE";
//#endregion
//#region node_modules/yaml/browser/dist/doc/createNode.js
var pt = "tag:yaml.org,2002:";
function mt(e, t, n) {
	if (t) {
		let e = n.filter((e) => e.tag === t), r = e.find((e) => !e.format) ?? e[0];
		if (!r) throw Error(`Tag ${t} not found`);
		return r;
	}
	return n.find((t) => t.identify?.(e) && !t.format);
}
function ht(e, t, n) {
	if (We(e) && (e = e.contents), R(e)) return e;
	if (F(e)) {
		let t = n.schema[M].createNode?.(n.schema, null, n);
		return t.items.push(e), t;
	}
	(e instanceof String || e instanceof Number || e instanceof Boolean || typeof BigInt < "u" && e instanceof BigInt) && (e = e.valueOf());
	let { aliasDuplicateObjects: r, onAnchor: i, onTagObj: a, schema: o, sourceObjects: s } = n, c;
	if (r && e && typeof e == "object") {
		if (c = s.get(e), c) return c.anchor ?? (c.anchor = i(e)), new ut(c.anchor);
		c = {
			anchor: null,
			node: null
		}, s.set(e, c);
	}
	t?.startsWith("!!") && (t = pt + t.slice(2));
	let l = mt(e, t, o.tags);
	if (!l) {
		if (e && typeof e.toJSON == "function" && (e = e.toJSON()), !e || typeof e != "object") {
			let t = new V(e);
			return c && (c.node = t), t;
		}
		l = e instanceof Map ? o[M] : Symbol.iterator in Object(e) ? o[He] : o[M];
	}
	a && (a(l), delete n.onTagObj);
	let u = l?.createNode ? l.createNode(n.schema, e, n) : typeof l?.nodeClass?.from == "function" ? l.nodeClass.from(n.schema, e, n) : new V(e);
	return t ? u.tag = t : l.default || (u.tag = l.tag), c && (c.node = u), u;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Collection.js
function gt(e, t, n) {
	let r = n;
	for (let e = t.length - 1; e >= 0; --e) {
		let n = t[e];
		if (typeof n == "number" && Number.isInteger(n) && n >= 0) {
			let e = [];
			e[n] = r, r = e;
		} else r = /* @__PURE__ */ new Map([[n, r]]);
	}
	return ht(r, void 0, {
		aliasDuplicateObjects: !1,
		keepUndefined: !1,
		onAnchor: () => {
			throw Error("This should not happen, please report a bug.");
		},
		schema: e,
		sourceObjects: /* @__PURE__ */ new Map()
	});
}
var _t = (e) => e == null || typeof e == "object" && !!e[Symbol.iterator]().next().done, vt = class extends lt {
	constructor(e, t) {
		super(e), Object.defineProperty(this, "schema", {
			value: t,
			configurable: !0,
			enumerable: !1,
			writable: !0
		});
	}
	clone(e) {
		let t = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
		return e && (t.schema = e), t.items = t.items.map((t) => R(t) || F(t) ? t.clone(e) : t), this.range && (t.range = this.range.slice()), t;
	}
	addIn(e, t) {
		if (_t(e)) this.add(t);
		else {
			let [n, ...r] = e, i = this.get(n, !0);
			if (L(i)) i.addIn(r, t);
			else if (i === void 0 && this.schema) this.set(n, gt(this.schema, r, t));
			else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`);
		}
	}
	deleteIn(e) {
		let [t, ...n] = e;
		if (n.length === 0) return this.delete(t);
		let r = this.get(t, !0);
		if (L(r)) return r.deleteIn(n);
		throw Error(`Expected YAML collection at ${t}. Remaining path: ${n}`);
	}
	getIn(e, t) {
		let [n, ...r] = e, i = this.get(n, !0);
		return r.length === 0 ? !t && I(i) ? i.value : i : L(i) ? i.getIn(r, t) : void 0;
	}
	hasAllNullValues(e) {
		return this.items.every((t) => {
			if (!F(t)) return !1;
			let n = t.value;
			return n == null || e && I(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
		});
	}
	hasIn(e) {
		let [t, ...n] = e;
		if (n.length === 0) return this.has(t);
		let r = this.get(t, !0);
		return L(r) ? r.hasIn(n) : !1;
	}
	setIn(e, t) {
		let [n, ...r] = e;
		if (r.length === 0) this.set(n, t);
		else {
			let e = this.get(n, !0);
			if (L(e)) e.setIn(r, t);
			else if (e === void 0 && this.schema) this.set(n, gt(this.schema, r, t));
			else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`);
		}
	}
}, yt = (e) => e.replace(/^(?!$)(?: $)?/gm, "#");
function H(e, t) {
	return /^\n+$/.test(e) ? e.substring(1) : t ? e.replace(/^(?! *$)/gm, t) : e;
}
var U = (e, t, n) => e.endsWith("\n") ? H(n, t) : n.includes("\n") ? "\n" + H(n, t) : (e.endsWith(" ") ? "" : " ") + n, bt = "flow", xt = "block", St = "quoted";
function Ct(e, t, n = "flow", { indentAtStart: r, lineWidth: i = 80, minContentWidth: a = 20, onFold: o, onOverflow: s } = {}) {
	if (!i || i < 0) return e;
	i < a && (a = 0);
	let c = Math.max(1 + a, 1 + i - t.length);
	if (e.length <= c) return e;
	let l = [], u = {}, d = i - t.length;
	typeof r == "number" && (r > i - Math.max(2, a) ? l.push(0) : d = i - r);
	let f, p, m = !1, h = -1, g = -1, _ = -1;
	n === "block" && (h = wt(e, h, t.length), h !== -1 && (d = h + c));
	for (let r; r = e[h += 1];) {
		if (n === "quoted" && r === "\\") {
			switch (g = h, e[h + 1]) {
				case "x":
					h += 3;
					break;
				case "u":
					h += 5;
					break;
				case "U":
					h += 9;
					break;
				default: h += 1;
			}
			_ = h;
		}
		if (r === "\n") n === "block" && (h = wt(e, h, t.length)), d = h + t.length + c, f = void 0;
		else {
			if (r === " " && p && p !== " " && p !== "\n" && p !== "	") {
				let t = e[h + 1];
				t && t !== " " && t !== "\n" && t !== "	" && (f = h);
			}
			if (h >= d) {
				if (f) l.push(f), d = f + c, f = void 0;
				else if (n === "quoted") {
					for (; p === " " || p === "	";) p = r, r = e[h += 1], m = !0;
					let t = h > _ + 1 ? h - 2 : g - 1;
					if (u[t]) return e;
					l.push(t), u[t] = !0, d = t + c, f = void 0;
				} else m = !0;
			}
		}
		p = r;
	}
	if (m && s && s(), l.length === 0) return e;
	o && o();
	let v = e.slice(0, l[0]);
	for (let r = 0; r < l.length; ++r) {
		let i = l[r], a = l[r + 1] || e.length;
		i === 0 ? v = `\n${t}${e.slice(0, a)}` : (n === "quoted" && u[i] && (v += `${e[i]}\\`), v += `\n${t}${e.slice(i + 1, a)}`);
	}
	return v;
}
function wt(e, t, n) {
	let r = t, i = t + 1, a = e[i];
	for (; a === " " || a === "	";) if (t < i + n) a = e[++t];
	else {
		do
			a = e[++t];
		while (a && a !== "\n");
		r = t, i = t + 1, a = e[i];
	}
	return r;
}
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyString.js
var Tt = (e, t) => ({
	indentAtStart: t ? e.indent.length : e.indentAtStart,
	lineWidth: e.options.lineWidth,
	minContentWidth: e.options.minContentWidth
}), Et = (e) => /^(%|---|\.\.\.)/m.test(e);
function Dt(e, t, n) {
	if (!t || t < 0) return !1;
	let r = t - n, i = e.length;
	if (i <= r) return !1;
	for (let t = 0, n = 0; t < i; ++t) if (e[t] === "\n") {
		if (t - n > r) return !0;
		if (n = t + 1, i - n <= r) return !1;
	}
	return !0;
}
function Ot(e, t) {
	let n = JSON.stringify(e);
	if (t.options.doubleQuotedAsJSON) return n;
	let { implicitKey: r } = t, i = t.options.doubleQuotedMinMultiLineLength, a = t.indent || (Et(e) ? "  " : ""), o = "", s = 0;
	for (let e = 0, t = n[e]; t; t = n[++e]) if (t === " " && n[e + 1] === "\\" && n[e + 2] === "n" && (o += n.slice(s, e) + "\\ ", e += 1, s = e, t = "\\"), t === "\\") switch (n[e + 1]) {
		case "u":
			{
				o += n.slice(s, e);
				let t = n.substr(e + 2, 4);
				switch (t) {
					case "0000":
						o += "\\0";
						break;
					case "0007":
						o += "\\a";
						break;
					case "000b":
						o += "\\v";
						break;
					case "001b":
						o += "\\e";
						break;
					case "0085":
						o += "\\N";
						break;
					case "00a0":
						o += "\\_";
						break;
					case "2028":
						o += "\\L";
						break;
					case "2029":
						o += "\\P";
						break;
					default: t.substr(0, 2) === "00" ? o += "\\x" + t.substr(2) : o += n.substr(e, 6);
				}
				e += 5, s = e + 1;
			}
			break;
		case "n":
			if (r || n[e + 2] === "\"" || n.length < i) e += 1;
			else {
				for (o += n.slice(s, e) + "\n\n"; n[e + 2] === "\\" && n[e + 3] === "n" && n[e + 4] !== "\"";) o += "\n", e += 2;
				o += a, n[e + 2] === " " && (o += "\\"), e += 1, s = e + 1;
			}
			break;
		default: e += 1;
	}
	return o = s ? o + n.slice(s) : n, r ? o : Ct(o, a, St, Tt(t, !1));
}
function kt(e, t) {
	if (t.options.singleQuote === !1 || t.implicitKey && e.includes("\n") || /[ \t]\n|\n[ \t]/.test(e)) return Ot(e, t);
	let n = t.indent || (Et(e) ? "  " : ""), r = "'" + e.replace(/'/g, "''").replace(/\n+/g, `$&\n${n}`) + "'";
	return t.implicitKey ? r : Ct(r, n, bt, Tt(t, !1));
}
function At(e, t) {
	let { singleQuote: n } = t.options, r;
	if (n === !1) r = Ot;
	else {
		let t = e.includes("\""), i = e.includes("'");
		r = t && !i ? kt : i && !t ? Ot : n ? kt : Ot;
	}
	return r(e, t);
}
var jt;
try {
	jt = /* @__PURE__ */ RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
} catch {
	jt = /\n+(?!\n|$)/g;
}
function Mt({ comment: e, type: t, value: n }, r, i, a) {
	let { blockQuote: o, commentString: s, lineWidth: c } = r.options;
	if (!o || /\n[\t ]+$/.test(n)) return At(n, r);
	let l = r.indent || (r.forceBlockIndent || Et(n) ? "  " : ""), u = o === "literal" ? !0 : o === "folded" || t === V.BLOCK_FOLDED ? !1 : t === V.BLOCK_LITERAL || !Dt(n, c, l.length);
	if (!n) return u ? "|\n" : ">\n";
	let d, f;
	for (f = n.length; f > 0; --f) {
		let e = n[f - 1];
		if (e !== "\n" && e !== "	" && e !== " ") break;
	}
	let p = n.substring(f), m = p.indexOf("\n");
	m === -1 ? d = "-" : n === p || m !== p.length - 1 ? (d = "+", a && a()) : d = "", p &&= (n = n.slice(0, -p.length), p[p.length - 1] === "\n" && (p = p.slice(0, -1)), p.replace(jt, `$&${l}`));
	let h = !1, g, _ = -1;
	for (g = 0; g < n.length; ++g) {
		let e = n[g];
		if (e === " ") h = !0;
		else if (e === "\n") _ = g;
		else break;
	}
	let v = n.substring(0, _ < g ? _ + 1 : g);
	v &&= (n = n.substring(v.length), v.replace(/\n+/g, `$&${l}`));
	let y = (h ? l ? "2" : "1" : "") + d;
	if (e && (y += " " + s(e.replace(/ ?[\r\n]+/g, " ")), i && i()), !u) {
		let e = n.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${l}`), i = !1, a = Tt(r, !0);
		o !== "folded" && t !== V.BLOCK_FOLDED && (a.onOverflow = () => {
			i = !0;
		});
		let s = Ct(`${v}${e}${p}`, l, xt, a);
		if (!i) return `>${y}\n${l}${s}`;
	}
	return n = n.replace(/\n+/g, `$&${l}`), `|${y}\n${l}${v}${n}${p}`;
}
function Nt(e, t, n, r) {
	let { type: i, value: a } = e, { actualString: o, implicitKey: s, indent: c, indentStep: l, inFlow: u } = t;
	if (s && a.includes("\n") || u && /[[\]{},]/.test(a)) return At(a, t);
	if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(a)) return s || u || !a.includes("\n") ? At(a, t) : Mt(e, t, n, r);
	if (!s && !u && i !== V.PLAIN && a.includes("\n")) return Mt(e, t, n, r);
	if (Et(a)) {
		if (c === "") return t.forceBlockIndent = !0, Mt(e, t, n, r);
		if (s && c === l) return At(a, t);
	}
	let d = a.replace(/\n+/g, `$&\n${c}`);
	if (o) {
		let e = (e) => e.default && e.tag !== "tag:yaml.org,2002:str" && e.test?.test(d), { compat: n, tags: r } = t.doc.schema;
		if (r.some(e) || n?.some(e)) return At(a, t);
	}
	return s ? d : Ct(d, c, bt, Tt(t, !1));
}
function Pt(e, t, n, r) {
	let { implicitKey: i, inFlow: a } = t, o = typeof e.value == "string" ? e : Object.assign({}, e, { value: String(e.value) }), { type: s } = e;
	s !== V.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) && (s = V.QUOTE_DOUBLE);
	let c = (e) => {
		switch (e) {
			case V.BLOCK_FOLDED:
			case V.BLOCK_LITERAL: return i || a ? At(o.value, t) : Mt(o, t, n, r);
			case V.QUOTE_DOUBLE: return Ot(o.value, t);
			case V.QUOTE_SINGLE: return kt(o.value, t);
			case V.PLAIN: return Nt(o, t, n, r);
			default: return null;
		}
	}, l = c(s);
	if (l === null) {
		let { defaultKeyType: e, defaultStringType: n } = t.options, r = i && e || n;
		if (l = c(r), l === null) throw Error(`Unsupported default string type ${r}`);
	}
	return l;
}
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringify.js
function Ft(e, t) {
	let n = Object.assign({
		blockQuote: !0,
		commentString: yt,
		defaultKeyType: null,
		defaultStringType: "PLAIN",
		directives: null,
		doubleQuotedAsJSON: !1,
		doubleQuotedMinMultiLineLength: 40,
		falseStr: "false",
		flowCollectionPadding: !0,
		indentSeq: !0,
		lineWidth: 80,
		minContentWidth: 20,
		nullStr: "null",
		simpleKeys: !1,
		singleQuote: null,
		trailingComma: !1,
		trueStr: "true",
		verifyAliasOrder: !0
	}, e.schema.toStringOptions, t), r;
	switch (n.collectionStyle) {
		case "block":
			r = !1;
			break;
		case "flow":
			r = !0;
			break;
		default: r = null;
	}
	return {
		anchors: /* @__PURE__ */ new Set(),
		doc: e,
		flowCollectionPadding: n.flowCollectionPadding ? " " : "",
		indent: "",
		indentStep: typeof n.indent == "number" ? " ".repeat(n.indent) : "  ",
		inFlow: r,
		options: n
	};
}
function It(e, t) {
	if (t.tag) {
		let n = e.filter((e) => e.tag === t.tag);
		if (n.length > 0) return n.find((e) => e.format === t.format) ?? n[0];
	}
	let n, r;
	if (I(t)) {
		r = t.value;
		let i = e.filter((e) => e.identify?.(r));
		if (i.length > 1) {
			let e = i.filter((e) => e.test);
			e.length > 0 && (i = e);
		}
		n = i.find((e) => e.format === t.format) ?? i.find((e) => !e.format);
	} else r = t, n = e.find((e) => e.nodeClass && r instanceof e.nodeClass);
	if (!n) {
		let e = r?.constructor?.name ?? (r === null ? "null" : typeof r);
		throw Error(`Tag not resolved for ${e} value`);
	}
	return n;
}
function Lt(e, t, { anchors: n, doc: r }) {
	if (!r.directives) return "";
	let i = [], a = (I(e) || L(e)) && e.anchor;
	a && it(a) && (n.add(a), i.push(`&${a}`));
	let o = e.tag ?? (t.default ? null : t.tag);
	return o && i.push(r.directives.tagString(o)), i.join(" ");
}
function Rt(e, t, n, r) {
	if (F(e)) return e.toString(t, n, r);
	if (Ue(e)) {
		if (t.doc.directives) return e.toString(t);
		if (t.resolvedAliases?.has(e)) throw TypeError("Cannot stringify circular structure without alias nodes");
		t.resolvedAliases ? t.resolvedAliases.add(e) : t.resolvedAliases = /* @__PURE__ */ new Set([e]), e = e.resolve(t.doc);
	}
	let i, a = R(e) ? e : t.doc.createNode(e, { onTagObj: (e) => i = e });
	i ??= It(t.doc.schema.tags, a);
	let o = Lt(a, i, t);
	o.length > 0 && (t.indentAtStart = (t.indentAtStart ?? 0) + o.length + 1);
	let s = typeof i.stringify == "function" ? i.stringify(a, t, n, r) : I(a) ? Pt(a, t, n, r) : a.toString(t, n, r);
	return o ? I(a) || s[0] === "{" || s[0] === "[" ? `${o} ${s}` : `${o}\n${t.indent}${s}` : s;
}
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyPair.js
function zt({ key: e, value: t }, n, r, i) {
	let { allNullValues: a, doc: o, indent: s, indentStep: c, options: { commentString: l, indentSeq: u, simpleKeys: d } } = n, f = R(e) && e.comment || null;
	if (d) {
		if (f) throw Error("With simple keys, key nodes cannot have comments");
		if (L(e) || !R(e) && typeof e == "object") throw Error("With simple keys, collection cannot be used as a key value");
	}
	let p = !d && (!e || f && t == null && !n.inFlow || L(e) || (I(e) ? e.type === V.BLOCK_FOLDED || e.type === V.BLOCK_LITERAL : typeof e == "object"));
	n = Object.assign({}, n, {
		allNullValues: !1,
		implicitKey: !p && (d || !a),
		indent: s + c
	});
	let m = !1, h = !1, g = Rt(e, n, () => m = !0, () => h = !0);
	if (!p && !n.inFlow && g.length > 1024) {
		if (d) throw Error("With simple keys, single line scalar must not span more than 1024 characters");
		p = !0;
	}
	if (n.inFlow) {
		if (a || t == null) return m && r && r(), g === "" ? "?" : p ? `? ${g}` : g;
	} else if (a && !d || t == null && p) return g = `? ${g}`, f && !m ? g += U(g, n.indent, l(f)) : h && i && i(), g;
	m && (f = null), p ? (f && (g += U(g, n.indent, l(f))), g = `? ${g}\n${s}:`) : (g = `${g}:`, f && (g += U(g, n.indent, l(f))));
	let _, v, y;
	R(t) ? (_ = !!t.spaceBefore, v = t.commentBefore, y = t.comment) : (_ = !1, v = null, y = null, t && typeof t == "object" && (t = o.createNode(t))), n.implicitKey = !1, !p && !f && I(t) && (n.indentAtStart = g.length + 1), h = !1, !u && c.length >= 2 && !n.inFlow && !p && Ke(t) && !t.flow && !t.tag && !t.anchor && (n.indent = n.indent.substring(2));
	let b = !1, x = Rt(t, n, () => b = !0, () => h = !0), S = " ";
	if (f || _ || v) {
		if (S = _ ? "\n" : "", v) {
			let e = l(v);
			S += `\n${H(e, n.indent)}`;
		}
		x === "" && !n.inFlow ? S === "\n" && y && (S = "\n\n") : S += `\n${n.indent}`;
	} else if (!p && L(t)) {
		let e = x[0], r = x.indexOf("\n"), i = r !== -1, a = n.inFlow ?? t.flow ?? t.items.length === 0;
		if (i || !a) {
			let t = !1;
			if (i && (e === "&" || e === "!")) {
				let n = x.indexOf(" ");
				e === "&" && n !== -1 && n < r && x[n + 1] === "!" && (n = x.indexOf(" ", n + 1)), (n === -1 || r < n) && (t = !0);
			}
			t || (S = `\n${n.indent}`);
		}
	} else (x === "" || x[0] === "\n") && (S = "");
	return g += S + x, n.inFlow ? b && r && r() : y && !b ? g += U(g, n.indent, l(y)) : h && i && i(), g;
}
//#endregion
//#region node_modules/yaml/browser/dist/log.js
function Bt(e, t) {
	(e === "debug" || e === "warn") && console.warn(t);
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
var Vt = "<<", W = {
	identify: (e) => e === Vt || typeof e == "symbol" && e.description === Vt,
	default: "key",
	tag: "tag:yaml.org,2002:merge",
	test: /^<<$/,
	resolve: () => Object.assign(new V(Symbol(Vt)), { addToJSMap: Ut }),
	stringify: () => Vt
}, Ht = (e, t) => (W.identify(t) || I(t) && (!t.type || t.type === V.PLAIN) && W.identify(t.value)) && e?.doc.schema.tags.some((e) => e.tag === W.tag && e.default);
function Ut(e, t, n) {
	let r = Gt(e, n);
	if (Ke(r)) for (let n of r.items) Wt(e, t, n);
	else if (Array.isArray(r)) for (let n of r) Wt(e, t, n);
	else Wt(e, t, r);
}
function Wt(e, t, n) {
	let r = Gt(e, n);
	if (!Ge(r)) throw Error("Merge sources must be maps or map aliases");
	let i = r.toJSON(null, e, Map);
	for (let [e, n] of i) t instanceof Map ? t.has(e) || t.set(e, n) : t instanceof Set ? t.add(e) : Object.prototype.hasOwnProperty.call(t, e) || Object.defineProperty(t, e, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
	return t;
}
function Gt(e, t) {
	return e && Ue(t) ? t.resolve(e.doc, e) : t;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
function Kt(e, t, { key: n, value: r }) {
	if (R(n) && n.addToJSMap) n.addToJSMap(e, t, r);
	else if (Ht(e, n)) Ut(e, t, r);
	else {
		let i = B(n, "", e);
		if (t instanceof Map) t.set(i, B(r, i, e));
		else if (t instanceof Set) t.add(i);
		else {
			let a = qt(n, i, e), o = B(r, a, e);
			a in t ? Object.defineProperty(t, a, {
				value: o,
				writable: !0,
				enumerable: !0,
				configurable: !0
			}) : t[a] = o;
		}
	}
	return t;
}
function qt(e, t, n) {
	if (t === null) return "";
	if (typeof t != "object") return String(t);
	if (R(e) && n?.doc) {
		let t = Ft(n.doc, {});
		t.anchors = /* @__PURE__ */ new Set();
		for (let e of n.anchors.keys()) t.anchors.add(e.anchor);
		t.inFlow = !0, t.inStringifyKey = !0;
		let r = e.toString(t);
		if (!n.mapKeyWarned) {
			let e = JSON.stringify(r);
			e.length > 40 && (e = e.substring(0, 36) + "...\""), Bt(n.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${e}. Set mapAsMap: true to use object keys.`), n.mapKeyWarned = !0;
		}
		return r;
	}
	return JSON.stringify(t);
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Pair.js
function Jt(e, t, n) {
	return new G(ht(e, void 0, n), ht(t, void 0, n));
}
var G = class e {
	constructor(e, t = null) {
		Object.defineProperty(this, P, { value: Ve }), this.key = e, this.value = t;
	}
	clone(t) {
		let { key: n, value: r } = this;
		return R(n) && (n = n.clone(t)), R(r) && (r = r.clone(t)), new e(n, r);
	}
	toJSON(e, t) {
		return Kt(t, t?.mapAsMap ? /* @__PURE__ */ new Map() : {}, this);
	}
	toString(e, t, n) {
		return e?.doc ? zt(this, e, t, n) : JSON.stringify(this);
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyCollection.js
function Yt(e, t, n) {
	return (t.inFlow ?? e.flow ? Zt : Xt)(e, t, n);
}
function Xt({ comment: e, items: t }, n, { blockItemPrefix: r, flowChars: i, itemIndent: a, onChompKeep: o, onComment: s }) {
	let { indent: c, options: { commentString: l } } = n, u = Object.assign({}, n, {
		indent: a,
		type: null
	}), d = !1, f = [];
	for (let e = 0; e < t.length; ++e) {
		let i = t[e], o = null;
		if (R(i)) !d && i.spaceBefore && f.push(""), Qt(n, f, i.commentBefore, d), i.comment && (o = i.comment);
		else if (F(i)) {
			let e = R(i.key) ? i.key : null;
			e && (!d && e.spaceBefore && f.push(""), Qt(n, f, e.commentBefore, d));
		}
		d = !1;
		let s = Rt(i, u, () => o = null, () => d = !0);
		o && (s += U(s, a, l(o))), d && o && (d = !1), f.push(r + s);
	}
	let p;
	if (f.length === 0) p = i.start + i.end;
	else {
		p = f[0];
		for (let e = 1; e < f.length; ++e) {
			let t = f[e];
			p += t ? `\n${c}${t}` : "\n";
		}
	}
	return e ? (p += "\n" + H(l(e), c), s && s()) : d && o && o(), p;
}
function Zt({ items: e }, t, { flowChars: n, itemIndent: r }) {
	let { indent: i, indentStep: a, flowCollectionPadding: o, options: { commentString: s } } = t;
	r += a;
	let c = Object.assign({}, t, {
		indent: r,
		inFlow: !0,
		type: null
	}), l = !1, u = 0, d = [];
	for (let n = 0; n < e.length; ++n) {
		let i = e[n], a = null;
		if (R(i)) i.spaceBefore && d.push(""), Qt(t, d, i.commentBefore, !1), i.comment && (a = i.comment);
		else if (F(i)) {
			let e = R(i.key) ? i.key : null;
			e && (e.spaceBefore && d.push(""), Qt(t, d, e.commentBefore, !1), e.comment && (l = !0));
			let n = R(i.value) ? i.value : null;
			n ? (n.comment && (a = n.comment), n.commentBefore && (l = !0)) : i.value == null && e?.comment && (a = e.comment);
		}
		a && (l = !0);
		let o = Rt(i, c, () => a = null);
		l ||= d.length > u || o.includes("\n"), n < e.length - 1 ? o += "," : t.options.trailingComma && (t.options.lineWidth > 0 && (l ||= d.reduce((e, t) => e + t.length + 2, 2) + (o.length + 2) > t.options.lineWidth), l && (o += ",")), a && (o += U(o, r, s(a))), d.push(o), u = d.length;
	}
	let { start: f, end: p } = n;
	if (d.length === 0) return f + p;
	if (!l) {
		let e = d.reduce((e, t) => e + t.length + 2, 2);
		l = t.options.lineWidth > 0 && e > t.options.lineWidth;
	}
	if (l) {
		let e = f;
		for (let t of d) e += t ? `\n${a}${i}${t}` : "\n";
		return `${e}\n${i}${p}`;
	}
	return `${f}${o}${d.join(" ")}${o}${p}`;
}
function Qt({ indent: e, options: { commentString: t } }, n, r, i) {
	if (r && i && (r = r.replace(/^\n+/, "")), r) {
		let i = H(t(r), e);
		n.push(i.trimStart());
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/YAMLMap.js
function K(e, t) {
	let n = I(t) ? t.value : t;
	for (let r of e) if (F(r) && (r.key === t || r.key === n || I(r.key) && r.key.value === n)) return r;
}
var q = class extends vt {
	static get tagName() {
		return "tag:yaml.org,2002:map";
	}
	constructor(e) {
		super(M, e), this.items = [];
	}
	static from(e, t, n) {
		let { keepUndefined: r, replacer: i } = n, a = new this(e), o = (e, o) => {
			if (typeof i == "function") o = i.call(t, e, o);
			else if (Array.isArray(i) && !i.includes(e)) return;
			(o !== void 0 || r) && a.items.push(Jt(e, o, n));
		};
		if (t instanceof Map) for (let [e, n] of t) o(e, n);
		else if (t && typeof t == "object") for (let e of Object.keys(t)) o(e, t[e]);
		return typeof e.sortMapEntries == "function" && a.items.sort(e.sortMapEntries), a;
	}
	add(e, t) {
		let n;
		n = F(e) ? e : !e || typeof e != "object" || !("key" in e) ? new G(e, e?.value) : new G(e.key, e.value);
		let r = K(this.items, n.key), i = this.schema?.sortMapEntries;
		if (r) {
			if (!t) throw Error(`Key ${n.key} already set`);
			I(r.value) && ft(n.value) ? r.value.value = n.value : r.value = n.value;
		} else if (i) {
			let e = this.items.findIndex((e) => i(n, e) < 0);
			e === -1 ? this.items.push(n) : this.items.splice(e, 0, n);
		} else this.items.push(n);
	}
	delete(e) {
		let t = K(this.items, e);
		return t ? this.items.splice(this.items.indexOf(t), 1).length > 0 : !1;
	}
	get(e, t) {
		let n = K(this.items, e)?.value;
		return (!t && I(n) ? n.value : n) ?? void 0;
	}
	has(e) {
		return !!K(this.items, e);
	}
	set(e, t) {
		this.add(new G(e, t), !0);
	}
	toJSON(e, t, n) {
		let r = n ? new n() : t?.mapAsMap ? /* @__PURE__ */ new Map() : {};
		t?.onCreate && t.onCreate(r);
		for (let e of this.items) Kt(t, r, e);
		return r;
	}
	toString(e, t, n) {
		if (!e) return JSON.stringify(this);
		for (let e of this.items) if (!F(e)) throw Error(`Map items must all be pairs; found ${JSON.stringify(e)} instead`);
		return !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })), Yt(this, e, {
			blockItemPrefix: "",
			flowChars: {
				start: "{",
				end: "}"
			},
			itemIndent: e.indent || "",
			onChompKeep: n,
			onComment: t
		});
	}
}, $t = {
	collection: "map",
	default: !0,
	nodeClass: q,
	tag: "tag:yaml.org,2002:map",
	resolve(e, t) {
		return Ge(e) || t("Expected a mapping for this tag"), e;
	},
	createNode: (e, t, n) => q.from(e, t, n)
}, J = class extends vt {
	static get tagName() {
		return "tag:yaml.org,2002:seq";
	}
	constructor(e) {
		super(He, e), this.items = [];
	}
	add(e) {
		this.items.push(e);
	}
	delete(e) {
		let t = en(e);
		return typeof t == "number" && this.items.splice(t, 1).length > 0;
	}
	get(e, t) {
		let n = en(e);
		if (typeof n != "number") return;
		let r = this.items[n];
		return !t && I(r) ? r.value : r;
	}
	has(e) {
		let t = en(e);
		return typeof t == "number" && t < this.items.length;
	}
	set(e, t) {
		let n = en(e);
		if (typeof n != "number") throw Error(`Expected a valid index, not ${e}.`);
		let r = this.items[n];
		I(r) && ft(t) ? r.value = t : this.items[n] = t;
	}
	toJSON(e, t) {
		let n = [];
		t?.onCreate && t.onCreate(n);
		let r = 0;
		for (let e of this.items) n.push(B(e, String(r++), t));
		return n;
	}
	toString(e, t, n) {
		return e ? Yt(this, e, {
			blockItemPrefix: "- ",
			flowChars: {
				start: "[",
				end: "]"
			},
			itemIndent: (e.indent || "") + "  ",
			onChompKeep: n,
			onComment: t
		}) : JSON.stringify(this);
	}
	static from(e, t, n) {
		let { replacer: r } = n, i = new this(e);
		if (t && Symbol.iterator in Object(t)) {
			let e = 0;
			for (let a of t) {
				if (typeof r == "function") {
					let n = t instanceof Set ? a : String(e++);
					a = r.call(t, n, a);
				}
				i.items.push(ht(a, void 0, n));
			}
		}
		return i;
	}
};
function en(e) {
	let t = I(e) ? e.value : e;
	return t && typeof t == "string" && (t = Number(t)), typeof t == "number" && Number.isInteger(t) && t >= 0 ? t : null;
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/common/seq.js
var tn = {
	collection: "seq",
	default: !0,
	nodeClass: J,
	tag: "tag:yaml.org,2002:seq",
	resolve(e, t) {
		return Ke(e) || t("Expected a sequence for this tag"), e;
	},
	createNode: (e, t, n) => J.from(e, t, n)
}, nn = {
	identify: (e) => typeof e == "string",
	default: !0,
	tag: "tag:yaml.org,2002:str",
	resolve: (e) => e,
	stringify(e, t, n, r) {
		return t = Object.assign({ actualString: !0 }, t), Pt(e, t, n, r);
	}
}, rn = {
	identify: (e) => e == null,
	createNode: () => new V(null),
	default: !0,
	tag: "tag:yaml.org,2002:null",
	test: /^(?:~|[Nn]ull|NULL)?$/,
	resolve: () => new V(null),
	stringify: ({ source: e }, t) => typeof e == "string" && rn.test.test(e) ? e : t.options.nullStr
}, an = {
	identify: (e) => typeof e == "boolean",
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
	resolve: (e) => new V(e[0] === "t" || e[0] === "T"),
	stringify({ source: e, value: t }, n) {
		return e && an.test.test(e) && t === (e[0] === "t" || e[0] === "T") ? e : t ? n.options.trueStr : n.options.falseStr;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyNumber.js
function Y({ format: e, minFractionDigits: t, tag: n, value: r }) {
	if (typeof r == "bigint") return String(r);
	let i = typeof r == "number" ? r : Number(r);
	if (!isFinite(i)) return isNaN(i) ? ".nan" : i < 0 ? "-.inf" : ".inf";
	let a = Object.is(r, -0) ? "-0" : JSON.stringify(r);
	if (!e && t && (!n || n === "tag:yaml.org,2002:float") && /^-?\d/.test(a) && !a.includes("e")) {
		let e = a.indexOf(".");
		e < 0 && (e = a.length, a += ".");
		let n = t - (a.length - e - 1);
		for (; n-- > 0;) a += "0";
	}
	return a;
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/core/float.js
var on = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
	resolve: (e) => e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? -Infinity : Infinity,
	stringify: Y
}, sn = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "EXP",
	test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
	resolve: (e) => parseFloat(e),
	stringify(e) {
		let t = Number(e.value);
		return isFinite(t) ? t.toExponential() : Y(e);
	}
}, cn = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
	resolve(e) {
		let t = new V(parseFloat(e)), n = e.indexOf(".");
		return n !== -1 && e[e.length - 1] === "0" && (t.minFractionDigits = e.length - n - 1), t;
	},
	stringify: Y
}, ln = (e) => typeof e == "bigint" || Number.isInteger(e), un = (e, t, n, { intAsBigInt: r }) => r ? BigInt(e) : parseInt(e.substring(t), n);
function dn(e, t, n) {
	let { value: r } = e;
	return ln(r) && r >= 0 ? n + r.toString(t) : Y(e);
}
var fn = {
	identify: (e) => ln(e) && e >= 0,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "OCT",
	test: /^0o[0-7]+$/,
	resolve: (e, t, n) => un(e, 2, 8, n),
	stringify: (e) => dn(e, 8, "0o")
}, pn = {
	identify: ln,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	test: /^[-+]?[0-9]+$/,
	resolve: (e, t, n) => un(e, 0, 10, n),
	stringify: Y
}, mn = {
	identify: (e) => ln(e) && e >= 0,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "HEX",
	test: /^0x[0-9a-fA-F]+$/,
	resolve: (e, t, n) => un(e, 2, 16, n),
	stringify: (e) => dn(e, 16, "0x")
}, hn = [
	$t,
	tn,
	nn,
	rn,
	an,
	fn,
	pn,
	mn,
	on,
	sn,
	cn
];
//#endregion
//#region node_modules/yaml/browser/dist/schema/json/schema.js
function gn(e) {
	return typeof e == "bigint" || Number.isInteger(e);
}
var _n = ({ value: e }) => JSON.stringify(e), vn = [
	{
		identify: (e) => typeof e == "string",
		default: !0,
		tag: "tag:yaml.org,2002:str",
		resolve: (e) => e,
		stringify: _n
	},
	{
		identify: (e) => e == null,
		createNode: () => new V(null),
		default: !0,
		tag: "tag:yaml.org,2002:null",
		test: /^null$/,
		resolve: () => null,
		stringify: _n
	},
	{
		identify: (e) => typeof e == "boolean",
		default: !0,
		tag: "tag:yaml.org,2002:bool",
		test: /^true$|^false$/,
		resolve: (e) => e === "true",
		stringify: _n
	},
	{
		identify: gn,
		default: !0,
		tag: "tag:yaml.org,2002:int",
		test: /^-?(?:0|[1-9][0-9]*)$/,
		resolve: (e, t, { intAsBigInt: n }) => n ? BigInt(e) : parseInt(e, 10),
		stringify: ({ value: e }) => gn(e) ? e.toString() : JSON.stringify(e)
	},
	{
		identify: (e) => typeof e == "number",
		default: !0,
		tag: "tag:yaml.org,2002:float",
		test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
		resolve: (e) => parseFloat(e),
		stringify: _n
	}
], yn = [$t, tn].concat(vn, {
	default: !0,
	tag: "",
	test: /^/,
	resolve(e, t) {
		return t(`Unresolved plain scalar ${JSON.stringify(e)}`), e;
	}
}), bn = {
	identify: (e) => e instanceof Uint8Array,
	default: !1,
	tag: "tag:yaml.org,2002:binary",
	resolve(e, t) {
		if (typeof atob == "function") {
			let t = atob(e.replace(/[\n\r]/g, "")), n = new Uint8Array(t.length);
			for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
			return n;
		}
		return t("This environment does not support reading binary tags; either Buffer or atob is required"), e;
	},
	stringify({ comment: e, type: t, value: n }, r, i, a) {
		if (!n) return "";
		let o = n, s;
		if (typeof btoa == "function") {
			let e = "";
			for (let t = 0; t < o.length; ++t) e += String.fromCharCode(o[t]);
			s = btoa(e);
		} else throw Error("This environment does not support writing binary tags; either Buffer or btoa is required");
		if (t ??= V.BLOCK_LITERAL, t !== V.QUOTE_DOUBLE) {
			let e = Math.max(r.options.lineWidth - r.indent.length, r.options.minContentWidth), n = Math.ceil(s.length / e), i = Array(n);
			for (let t = 0, r = 0; t < n; ++t, r += e) i[t] = s.substr(r, e);
			s = i.join(t === V.BLOCK_LITERAL ? "\n" : " ");
		}
		return Pt({
			comment: e,
			type: t,
			value: s
		}, r, i, a);
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
function xn(e, t) {
	if (Ke(e)) for (let n = 0; n < e.items.length; ++n) {
		let r = e.items[n];
		if (!F(r)) {
			if (Ge(r)) {
				r.items.length > 1 && t("Each pair must have its own sequence indicator");
				let e = r.items[0] || new G(new V(null));
				if (r.commentBefore && (e.key.commentBefore = e.key.commentBefore ? `${r.commentBefore}\n${e.key.commentBefore}` : r.commentBefore), r.comment) {
					let t = e.value ?? e.key;
					t.comment = t.comment ? `${r.comment}\n${t.comment}` : r.comment;
				}
				r = e;
			}
			e.items[n] = F(r) ? r : new G(r);
		}
	}
	else t("Expected a sequence for this tag");
	return e;
}
function Sn(e, t, n) {
	let { replacer: r } = n, i = new J(e);
	i.tag = "tag:yaml.org,2002:pairs";
	let a = 0;
	if (t && Symbol.iterator in Object(t)) for (let e of t) {
		typeof r == "function" && (e = r.call(t, String(a++), e));
		let o, s;
		if (Array.isArray(e)) {
			if (e.length === 2) o = e[0], s = e[1];
			else throw TypeError(`Expected [key, value] tuple: ${e}`);
		} else if (e && e instanceof Object) {
			let t = Object.keys(e);
			if (t.length === 1) o = t[0], s = e[o];
			else throw TypeError(`Expected tuple with one key, not ${t.length} keys`);
		} else o = e;
		i.items.push(Jt(o, s, n));
	}
	return i;
}
var Cn = {
	collection: "seq",
	default: !1,
	tag: "tag:yaml.org,2002:pairs",
	resolve: xn,
	createNode: Sn
}, wn = class e extends J {
	constructor() {
		super(), this.add = q.prototype.add.bind(this), this.delete = q.prototype.delete.bind(this), this.get = q.prototype.get.bind(this), this.has = q.prototype.has.bind(this), this.set = q.prototype.set.bind(this), this.tag = e.tag;
	}
	toJSON(e, t) {
		if (!t) return super.toJSON(e);
		let n = /* @__PURE__ */ new Map();
		t?.onCreate && t.onCreate(n);
		for (let e of this.items) {
			let r, i;
			if (F(e) ? (r = B(e.key, "", t), i = B(e.value, r, t)) : r = B(e, "", t), n.has(r)) throw Error("Ordered maps must not include duplicate keys");
			n.set(r, i);
		}
		return n;
	}
	static from(e, t, n) {
		let r = Sn(e, t, n), i = new this();
		return i.items = r.items, i;
	}
};
wn.tag = "tag:yaml.org,2002:omap";
var Tn = {
	collection: "seq",
	identify: (e) => e instanceof Map,
	nodeClass: wn,
	default: !1,
	tag: "tag:yaml.org,2002:omap",
	resolve(e, t) {
		let n = xn(e, t), r = [];
		for (let { key: e } of n.items) I(e) && (r.includes(e.value) ? t(`Ordered maps must not include duplicate keys: ${e.value}`) : r.push(e.value));
		return Object.assign(new wn(), n);
	},
	createNode: (e, t, n) => wn.from(e, t, n)
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
function En({ value: e, source: t }, n) {
	return t && (e ? Dn : On).test.test(t) ? t : e ? n.options.trueStr : n.options.falseStr;
}
var Dn = {
	identify: (e) => e === !0,
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
	resolve: () => new V(!0),
	stringify: En
}, On = {
	identify: (e) => e === !1,
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
	resolve: () => new V(!1),
	stringify: En
}, kn = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
	resolve: (e) => e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? -Infinity : Infinity,
	stringify: Y
}, An = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "EXP",
	test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
	resolve: (e) => parseFloat(e.replace(/_/g, "")),
	stringify(e) {
		let t = Number(e.value);
		return isFinite(t) ? t.toExponential() : Y(e);
	}
}, jn = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
	resolve(e) {
		let t = new V(parseFloat(e.replace(/_/g, ""))), n = e.indexOf(".");
		if (n !== -1) {
			let r = e.substring(n + 1).replace(/_/g, "");
			r[r.length - 1] === "0" && (t.minFractionDigits = r.length);
		}
		return t;
	},
	stringify: Y
}, Mn = (e) => typeof e == "bigint" || Number.isInteger(e);
function Nn(e, t, n, { intAsBigInt: r }) {
	let i = e[0];
	if ((i === "-" || i === "+") && (t += 1), e = e.substring(t).replace(/_/g, ""), r) {
		switch (n) {
			case 2:
				e = `0b${e}`;
				break;
			case 8:
				e = `0o${e}`;
				break;
			case 16: e = `0x${e}`;
		}
		let t = BigInt(e);
		return i === "-" ? BigInt(-1) * t : t;
	}
	let a = parseInt(e, n);
	return i === "-" ? -1 * a : a;
}
function Pn(e, t, n) {
	let { value: r } = e;
	if (Mn(r)) {
		let e = r.toString(t);
		return r < 0 ? "-" + n + e.substr(1) : n + e;
	}
	return Y(e);
}
var Fn = {
	identify: Mn,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "BIN",
	test: /^[-+]?0b[0-1_]+$/,
	resolve: (e, t, n) => Nn(e, 2, 2, n),
	stringify: (e) => Pn(e, 2, "0b")
}, In = {
	identify: Mn,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "OCT",
	test: /^[-+]?0[0-7_]+$/,
	resolve: (e, t, n) => Nn(e, 1, 8, n),
	stringify: (e) => Pn(e, 8, "0")
}, Ln = {
	identify: Mn,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	test: /^[-+]?[0-9][0-9_]*$/,
	resolve: (e, t, n) => Nn(e, 0, 10, n),
	stringify: Y
}, Rn = {
	identify: Mn,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "HEX",
	test: /^[-+]?0x[0-9a-fA-F_]+$/,
	resolve: (e, t, n) => Nn(e, 2, 16, n),
	stringify: (e) => Pn(e, 16, "0x")
}, zn = class e extends q {
	constructor(t) {
		super(t), this.tag = e.tag;
	}
	add(e) {
		let t;
		t = F(e) ? e : e && typeof e == "object" && "key" in e && "value" in e && e.value === null ? new G(e.key, null) : new G(e, null), K(this.items, t.key) || this.items.push(t);
	}
	get(e, t) {
		let n = K(this.items, e);
		return !t && F(n) ? I(n.key) ? n.key.value : n.key : n;
	}
	set(e, t) {
		if (typeof t != "boolean") throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);
		let n = K(this.items, e);
		n && !t ? this.items.splice(this.items.indexOf(n), 1) : !n && t && this.items.push(new G(e));
	}
	toJSON(e, t) {
		return super.toJSON(e, t, Set);
	}
	toString(e, t, n) {
		if (!e) return JSON.stringify(this);
		if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, e, { allNullValues: !0 }), t, n);
		throw Error("Set items must all have null values");
	}
	static from(e, t, n) {
		let { replacer: r } = n, i = new this(e);
		if (t && Symbol.iterator in Object(t)) for (let e of t) typeof r == "function" && (e = r.call(t, e, e)), i.items.push(Jt(e, null, n));
		return i;
	}
};
zn.tag = "tag:yaml.org,2002:set";
var Bn = {
	collection: "map",
	identify: (e) => e instanceof Set,
	nodeClass: zn,
	default: !1,
	tag: "tag:yaml.org,2002:set",
	createNode: (e, t, n) => zn.from(e, t, n),
	resolve(e, t) {
		if (Ge(e)) {
			if (e.hasAllNullValues(!0)) return Object.assign(new zn(), e);
			t("Set items must all have null values");
		} else t("Expected a mapping for this tag");
		return e;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
function Vn(e, t) {
	let n = e[0], r = n === "-" || n === "+" ? e.substring(1) : e, i = (e) => t ? BigInt(e) : Number(e), a = r.replace(/_/g, "").split(":").reduce((e, t) => e * i(60) + i(t), i(0));
	return n === "-" ? i(-1) * a : a;
}
function Hn(e) {
	let { value: t } = e, n = (e) => e;
	if (typeof t == "bigint") n = (e) => BigInt(e);
	else if (isNaN(t) || !isFinite(t)) return Y(e);
	let r = "";
	t < 0 && (r = "-", t *= n(-1));
	let i = n(60), a = [t % i];
	return t < 60 ? a.unshift(0) : (t = (t - a[0]) / i, a.unshift(t % i), t >= 60 && (t = (t - a[0]) / i, a.unshift(t))), r + a.map((e) => String(e).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
var Un = {
	identify: (e) => typeof e == "bigint" || Number.isInteger(e),
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "TIME",
	test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
	resolve: (e, t, { intAsBigInt: n }) => Vn(e, n),
	stringify: Hn
}, Wn = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "TIME",
	test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
	resolve: (e) => Vn(e, !1),
	stringify: Hn
}, Gn = {
	identify: (e) => e instanceof Date,
	default: !0,
	tag: "tag:yaml.org,2002:timestamp",
	test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
	resolve(e) {
		let t = e.match(Gn.test);
		if (!t) throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");
		let [, n, r, i, a, o, s] = t.map(Number), c = t[7] ? Number((t[7] + "00").substr(1, 3)) : 0, l = Date.UTC(n, r - 1, i, a || 0, o || 0, s || 0, c), u = t[8];
		if (u && u !== "Z") {
			let e = Vn(u, !1);
			Math.abs(e) < 30 && (e *= 60), l -= 6e4 * e;
		}
		return new Date(l);
	},
	stringify: ({ value: e }) => e?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
}, Kn = [
	$t,
	tn,
	nn,
	rn,
	Dn,
	On,
	Fn,
	In,
	Ln,
	Rn,
	kn,
	An,
	jn,
	bn,
	W,
	Tn,
	Cn,
	Bn,
	Un,
	Wn,
	Gn
], qn = /* @__PURE__ */ new Map([
	["core", hn],
	["failsafe", [
		$t,
		tn,
		nn
	]],
	["json", yn],
	["yaml11", Kn],
	["yaml-1.1", Kn]
]), Jn = {
	binary: bn,
	bool: an,
	float: cn,
	floatExp: sn,
	floatNaN: on,
	floatTime: Wn,
	int: pn,
	intHex: mn,
	intOct: fn,
	intTime: Un,
	map: $t,
	merge: W,
	null: rn,
	omap: Tn,
	pairs: Cn,
	seq: tn,
	set: Bn,
	timestamp: Gn
}, Yn = {
	"tag:yaml.org,2002:binary": bn,
	"tag:yaml.org,2002:merge": W,
	"tag:yaml.org,2002:omap": Tn,
	"tag:yaml.org,2002:pairs": Cn,
	"tag:yaml.org,2002:set": Bn,
	"tag:yaml.org,2002:timestamp": Gn
};
function Xn(e, t, n) {
	let r = qn.get(t);
	if (r && !e) return n && !r.includes(W) ? r.concat(W) : r.slice();
	let i = r;
	if (!i) {
		if (Array.isArray(e)) i = [];
		else {
			let e = Array.from(qn.keys()).filter((e) => e !== "yaml11").map((e) => JSON.stringify(e)).join(", ");
			throw Error(`Unknown schema "${t}"; use one of ${e} or define customTags array`);
		}
	}
	if (Array.isArray(e)) for (let t of e) i = i.concat(t);
	else typeof e == "function" && (i = e(i.slice()));
	return n && (i = i.concat(W)), i.reduce((e, t) => {
		let n = typeof t == "string" ? Jn[t] : t;
		if (!n) {
			let e = JSON.stringify(t), n = Object.keys(Jn).map((e) => JSON.stringify(e)).join(", ");
			throw Error(`Unknown custom tag ${e}; use one of ${n}`);
		}
		return e.includes(n) || e.push(n), e;
	}, []);
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/Schema.js
var Zn = (e, t) => e.key < t.key ? -1 : +(e.key > t.key), Qn = class e {
	constructor({ compat: e, customTags: t, merge: n, resolveKnownTags: r, schema: i, sortMapEntries: a, toStringDefaults: o }) {
		this.compat = Array.isArray(e) ? Xn(e, "compat") : e ? Xn(null, e) : null, this.name = typeof i == "string" && i || "core", this.knownTags = r ? Yn : {}, this.tags = Xn(t, this.name, n), this.toStringOptions = o ?? null, Object.defineProperty(this, M, { value: $t }), Object.defineProperty(this, N, { value: nn }), Object.defineProperty(this, He, { value: tn }), this.sortMapEntries = typeof a == "function" ? a : a === !0 ? Zn : null;
	}
	clone() {
		let t = Object.create(e.prototype, Object.getOwnPropertyDescriptors(this));
		return t.tags = this.tags.slice(), t;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyDocument.js
function $n(e, t) {
	let n = [], r = t.directives === !0;
	if (t.directives !== !1 && e.directives) {
		let t = e.directives.toString(e);
		t ? (n.push(t), r = !0) : e.directives.docStart && (r = !0);
	}
	r && n.push("---");
	let i = Ft(e, t), { commentString: a } = i.options;
	if (e.commentBefore) {
		n.length !== 1 && n.unshift("");
		let t = a(e.commentBefore);
		n.unshift(H(t, ""));
	}
	let o = !1, s = null;
	if (e.contents) {
		if (R(e.contents)) {
			if (e.contents.spaceBefore && r && n.push(""), e.contents.commentBefore) {
				let t = a(e.contents.commentBefore);
				n.push(H(t, ""));
			}
			i.forceBlockIndent = !!e.comment, s = e.contents.comment;
		}
		let t = s ? void 0 : () => o = !0, c = Rt(e.contents, i, () => s = null, t);
		s && (c += U(c, "", a(s))), (c[0] === "|" || c[0] === ">") && n[n.length - 1] === "---" ? n[n.length - 1] = `--- ${c}` : n.push(c);
	} else n.push(Rt(e.contents, i));
	if (e.directives?.docEnd) {
		if (e.comment) {
			let t = a(e.comment);
			t.includes("\n") ? (n.push("..."), n.push(H(t, ""))) : n.push(`... ${t}`);
		} else n.push("...");
	} else {
		let t = e.comment;
		t && o && (t = t.replace(/^\n+/, "")), t && ((!o || s) && n[n.length - 1] !== "" && n.push(""), n.push(H(a(t), "")));
	}
	return n.join("\n") + "\n";
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/Document.js
var er = class e {
	constructor(e, t, n) {
		this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, P, { value: Be });
		let r = null;
		typeof t == "function" || Array.isArray(t) ? r = t : n === void 0 && t && (n = t, t = void 0);
		let i = Object.assign({
			intAsBigInt: !1,
			keepSourceTokens: !1,
			logLevel: "warn",
			prettyErrors: !0,
			strict: !0,
			stringKeys: !1,
			uniqueKeys: !0,
			version: "1.2"
		}, n);
		this.options = i;
		let { version: a } = i;
		n?._directives ? (this.directives = n._directives.atDocument(), this.directives.yaml.explicit && (a = this.directives.yaml.version)) : this.directives = new rt({ version: a }), this.setSchema(a, n), this.contents = e === void 0 ? null : this.createNode(e, r, n);
	}
	clone() {
		let t = Object.create(e.prototype, { [P]: { value: Be } });
		return t.commentBefore = this.commentBefore, t.comment = this.comment, t.errors = this.errors.slice(), t.warnings = this.warnings.slice(), t.options = Object.assign({}, this.options), this.directives && (t.directives = this.directives.clone()), t.schema = this.schema.clone(), t.contents = R(this.contents) ? this.contents.clone(t.schema) : this.contents, this.range && (t.range = this.range.slice()), t;
	}
	add(e) {
		tr(this.contents) && this.contents.add(e);
	}
	addIn(e, t) {
		tr(this.contents) && this.contents.addIn(e, t);
	}
	createAlias(e, t) {
		if (!e.anchor) {
			let n = at(this);
			e.anchor = !t || n.has(t) ? ot(t || "a", n) : t;
		}
		return new ut(e.anchor);
	}
	createNode(e, t, n) {
		let r;
		if (typeof t == "function") e = t.call({ "": e }, "", e), r = t;
		else if (Array.isArray(t)) {
			let e = t.filter((e) => typeof e == "number" || e instanceof String || e instanceof Number).map(String);
			e.length > 0 && (t = t.concat(e)), r = t;
		} else n === void 0 && t && (n = t, t = void 0);
		let { aliasDuplicateObjects: i, anchorPrefix: a, flow: o, keepUndefined: s, onTagObj: c, tag: l } = n ?? {}, { onAnchor: u, setAnchors: d, sourceObjects: f } = st(this, a || "a"), p = {
			aliasDuplicateObjects: i ?? !0,
			keepUndefined: s ?? !1,
			onAnchor: u,
			onTagObj: c,
			replacer: r,
			schema: this.schema,
			sourceObjects: f
		}, m = ht(e, l, p);
		return o && L(m) && (m.flow = !0), d(), m;
	}
	createPair(e, t, n = {}) {
		return new G(this.createNode(e, null, n), this.createNode(t, null, n));
	}
	delete(e) {
		return tr(this.contents) ? this.contents.delete(e) : !1;
	}
	deleteIn(e) {
		return _t(e) ? this.contents != null && (this.contents = null, !0) : tr(this.contents) ? this.contents.deleteIn(e) : !1;
	}
	get(e, t) {
		return L(this.contents) ? this.contents.get(e, t) : void 0;
	}
	getIn(e, t) {
		return _t(e) ? !t && I(this.contents) ? this.contents.value : this.contents : L(this.contents) ? this.contents.getIn(e, t) : void 0;
	}
	has(e) {
		return L(this.contents) ? this.contents.has(e) : !1;
	}
	hasIn(e) {
		return _t(e) ? this.contents !== void 0 : L(this.contents) ? this.contents.hasIn(e) : !1;
	}
	set(e, t) {
		this.contents == null ? this.contents = gt(this.schema, [e], t) : tr(this.contents) && this.contents.set(e, t);
	}
	setIn(e, t) {
		_t(e) ? this.contents = t : this.contents == null ? this.contents = gt(this.schema, Array.from(e), t) : tr(this.contents) && this.contents.setIn(e, t);
	}
	setSchema(e, t = {}) {
		typeof e == "number" && (e = String(e));
		let n;
		switch (e) {
			case "1.1":
				this.directives ? this.directives.yaml.version = "1.1" : this.directives = new rt({ version: "1.1" }), n = {
					resolveKnownTags: !1,
					schema: "yaml-1.1"
				};
				break;
			case "1.2":
			case "next":
				this.directives ? this.directives.yaml.version = e : this.directives = new rt({ version: e }), n = {
					resolveKnownTags: !0,
					schema: "core"
				};
				break;
			case null:
				this.directives && delete this.directives, n = null;
				break;
			default: {
				let t = JSON.stringify(e);
				throw Error(`Expected '1.1', '1.2' or null as first argument, but found: ${t}`);
			}
		}
		if (t.schema instanceof Object) this.schema = t.schema;
		else if (n) this.schema = new Qn(Object.assign(n, t));
		else throw Error("With a null YAML version, the { schema: Schema } option is required");
	}
	toJS({ json: e, jsonArg: t, mapAsMap: n, maxAliasCount: r, onAnchor: i, reviver: a } = {}) {
		let o = {
			anchors: /* @__PURE__ */ new Map(),
			doc: this,
			keep: !e,
			mapAsMap: n === !0,
			mapKeyWarned: !1,
			maxAliasCount: typeof r == "number" ? r : 100
		}, s = B(this.contents, t ?? "", o);
		if (typeof i == "function") for (let { count: e, res: t } of o.anchors.values()) i(t, e);
		return typeof a == "function" ? ct(a, { "": s }, "", s) : s;
	}
	toJSON(e, t) {
		return this.toJS({
			json: !0,
			jsonArg: e,
			mapAsMap: !1,
			onAnchor: t
		});
	}
	toString(e = {}) {
		if (this.errors.length > 0) throw Error("Document with errors cannot be stringified");
		if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
			let t = JSON.stringify(e.indent);
			throw Error(`"indent" option must be a positive integer, not ${t}`);
		}
		return $n(this, e);
	}
};
function tr(e) {
	if (L(e)) return !0;
	throw Error("Expected a YAML collection as document contents");
}
//#endregion
//#region node_modules/yaml/browser/dist/errors.js
var nr = class extends Error {
	constructor(e, t, n, r) {
		super(), this.name = e, this.code = n, this.message = r, this.pos = t;
	}
}, rr = class extends nr {
	constructor(e, t, n) {
		super("YAMLParseError", e, t, n);
	}
}, ir = class extends nr {
	constructor(e, t, n) {
		super("YAMLWarning", e, t, n);
	}
}, ar = (e, t) => (n) => {
	if (n.pos[0] === -1) return;
	n.linePos = n.pos.map((e) => t.linePos(e));
	let { line: r, col: i } = n.linePos[0];
	n.message += ` at line ${r}, column ${i}`;
	let a = i - 1, o = e.substring(t.lineStarts[r - 1], t.lineStarts[r]).replace(/[\n\r]+$/, "");
	if (a >= 60 && o.length > 80) {
		let e = Math.min(a - 39, o.length - 79);
		o = "…" + o.substring(e), a -= e - 1;
	}
	if (o.length > 80 && (o = o.substring(0, 79) + "…"), r > 1 && /^ *$/.test(o.substring(0, a))) {
		let n = e.substring(t.lineStarts[r - 2], t.lineStarts[r - 1]);
		n.length > 80 && (n = n.substring(0, 79) + "…\n"), o = n + o;
	}
	if (/[^ ]/.test(o)) {
		let e = 1, t = n.linePos[1];
		t?.line === r && t.col > i && (e = Math.max(1, Math.min(t.col - i, 80 - a)));
		let s = " ".repeat(a) + "^".repeat(e);
		n.message += `:\n\n${o}\n${s}\n`;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-props.js
function or(e, { flow: t, indicator: n, next: r, offset: i, onError: a, parentIndent: o, startOnNewline: s }) {
	let c = !1, l = s, u = s, d = "", f = "", p = !1, m = !1, h = null, g = null, _ = null, v = null, y = null, b = null, x = null;
	for (let i of e) switch (m &&= (i.type !== "space" && i.type !== "newline" && i.type !== "comma" && a(i.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), !1), h &&= (l && i.type !== "comment" && i.type !== "newline" && a(h, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), null), i.type) {
		case "space":
			!t && (n !== "doc-start" || r?.type !== "flow-collection") && i.source.includes("	") && (h = i), u = !0;
			break;
		case "comment": {
			u || a(i, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
			let e = i.source.substring(1) || " ";
			d ? d += f + e : d = e, f = "", l = !1;
			break;
		}
		case "newline":
			l ? d ? d += i.source : (!b || n !== "seq-item-ind") && (c = !0) : f += i.source, l = !0, p = !0, (g || _) && (v = i), u = !0;
			break;
		case "anchor":
			g && a(i, "MULTIPLE_ANCHORS", "A node can have at most one anchor"), i.source.endsWith(":") && a(i.offset + i.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0), g = i, x ??= i.offset, l = !1, u = !1, m = !0;
			break;
		case "tag":
			_ && a(i, "MULTIPLE_TAGS", "A node can have at most one tag"), _ = i, x ??= i.offset, l = !1, u = !1, m = !0;
			break;
		case n:
			(g || _) && a(i, "BAD_PROP_ORDER", `Anchors and tags must be after the ${i.source} indicator`), b && a(i, "UNEXPECTED_TOKEN", `Unexpected ${i.source} in ${t ?? "collection"}`), b = i, l = n === "seq-item-ind" || n === "explicit-key-ind", u = !1;
			break;
		case "comma": if (t) {
			y && a(i, "UNEXPECTED_TOKEN", `Unexpected , in ${t}`), y = i, l = !1, u = !1;
			break;
		}
		default: a(i, "UNEXPECTED_TOKEN", `Unexpected ${i.type} token`), l = !1, u = !1;
	}
	let S = e[e.length - 1], C = S ? S.offset + S.source.length : i;
	return m && r && r.type !== "space" && r.type !== "newline" && r.type !== "comma" && (r.type !== "scalar" || r.source !== "") && a(r.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), h && (l && h.indent <= o || r?.type === "block-map" || r?.type === "block-seq") && a(h, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), {
		comma: y,
		found: b,
		spaceBefore: c,
		comment: d,
		hasNewline: p,
		anchor: g,
		tag: _,
		newlineAfterProp: v,
		end: C,
		start: x ?? C
	};
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-contains-newline.js
function sr(e) {
	if (!e) return null;
	switch (e.type) {
		case "alias":
		case "scalar":
		case "double-quoted-scalar":
		case "single-quoted-scalar":
			if (e.source.includes("\n")) return !0;
			if (e.end) {
				for (let t of e.end) if (t.type === "newline") return !0;
			}
			return !1;
		case "flow-collection":
			for (let t of e.items) {
				for (let e of t.start) if (e.type === "newline") return !0;
				if (t.sep) {
					for (let e of t.sep) if (e.type === "newline") return !0;
				}
				if (sr(t.key) || sr(t.value)) return !0;
			}
			return !1;
		default: return !0;
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-flow-indent-check.js
function cr(e, t, n) {
	if (t?.type === "flow-collection") {
		let r = t.end[0];
		r.indent === e && (r.source === "]" || r.source === "}") && sr(t) && n(r, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-map-includes.js
function lr(e, t, n) {
	let { uniqueKeys: r } = e.options;
	if (r === !1) return !1;
	let i = typeof r == "function" ? r : (e, t) => e === t || I(e) && I(t) && e.value === t.value;
	return t.some((e) => i(e.key, n));
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-block-map.js
var ur = "All mapping items must start at the same column";
function dr({ composeNode: e, composeEmptyNode: t }, n, r, i, a) {
	let o = new ((a?.nodeClass) ?? q)(n.schema);
	n.atRoot &&= !1;
	let s = r.offset, c = null;
	for (let a of r.items) {
		let { start: l, key: u, sep: d, value: f } = a, p = or(l, {
			indicator: "explicit-key-ind",
			next: u ?? d?.[0],
			offset: s,
			onError: i,
			parentIndent: r.indent,
			startOnNewline: !0
		}), m = !p.found;
		if (m) {
			if (u && (u.type === "block-seq" ? i(s, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key") : "indent" in u && u.indent !== r.indent && i(s, "BAD_INDENT", ur)), !p.anchor && !p.tag && !d) {
				c = p.end, p.comment && (o.comment ? o.comment += "\n" + p.comment : o.comment = p.comment);
				continue;
			}
			(p.newlineAfterProp || sr(u)) && i(u ?? l[l.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
		} else p.found?.indent !== r.indent && i(s, "BAD_INDENT", ur);
		n.atKey = !0;
		let h = p.end, g = u ? e(n, u, p, i) : t(n, h, l, null, p, i);
		n.schema.compat && cr(r.indent, u, i), n.atKey = !1, lr(n, o.items, g) && i(h, "DUPLICATE_KEY", "Map keys must be unique");
		let _ = or(d ?? [], {
			indicator: "map-value-ind",
			next: f,
			offset: g.range[2],
			onError: i,
			parentIndent: r.indent,
			startOnNewline: !u || u.type === "block-scalar"
		});
		if (s = _.end, _.found) {
			m && (f?.type === "block-map" && !_.hasNewline && i(s, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"), n.options.strict && p.start < _.found.offset - 1024 && i(g.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));
			let c = f ? e(n, f, _, i) : t(n, s, d, null, _, i);
			n.schema.compat && cr(r.indent, f, i), s = c.range[2];
			let l = new G(g, c);
			n.options.keepSourceTokens && (l.srcToken = a), o.items.push(l);
		} else {
			m && i(g.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"), _.comment && (g.comment ? g.comment += "\n" + _.comment : g.comment = _.comment);
			let e = new G(g);
			n.options.keepSourceTokens && (e.srcToken = a), o.items.push(e);
		}
	}
	return c && c < s && i(c, "IMPOSSIBLE", "Map comment with trailing content"), o.range = [
		r.offset,
		s,
		c ?? s
	], o;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-block-seq.js
function fr({ composeNode: e, composeEmptyNode: t }, n, r, i, a) {
	let o = new ((a?.nodeClass) ?? J)(n.schema);
	n.atRoot &&= !1, n.atKey &&= !1;
	let s = r.offset, c = null;
	for (let { start: a, value: l } of r.items) {
		let u = or(a, {
			indicator: "seq-item-ind",
			next: l,
			offset: s,
			onError: i,
			parentIndent: r.indent,
			startOnNewline: !0
		});
		if (!u.found) {
			if (u.anchor || u.tag || l) l?.type === "block-seq" ? i(u.end, "BAD_INDENT", "All sequence items must start at the same column") : i(s, "MISSING_CHAR", "Sequence item without - indicator");
			else {
				c = u.end, u.comment && (o.comment = u.comment);
				continue;
			}
		}
		let d = l ? e(n, l, u, i) : t(n, u.end, a, null, u, i);
		n.schema.compat && cr(r.indent, l, i), s = d.range[2], o.items.push(d);
	}
	return o.range = [
		r.offset,
		s,
		c ?? s
	], o;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-end.js
function pr(e, t, n, r) {
	let i = "";
	if (e) {
		let a = !1, o = "";
		for (let s of e) {
			let { source: e, type: c } = s;
			switch (c) {
				case "space":
					a = !0;
					break;
				case "comment": {
					n && !a && r(s, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
					let t = e.substring(1) || " ";
					i ? i += o + t : i = t, o = "";
					break;
				}
				case "newline":
					i && (o += e), a = !0;
					break;
				default: r(s, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
			}
			t += e.length;
		}
	}
	return {
		comment: i,
		offset: t
	};
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-flow-collection.js
var mr = "Block collections are not allowed within flow collections", hr = (e) => e && (e.type === "block-map" || e.type === "block-seq");
function gr({ composeNode: e, composeEmptyNode: t }, n, r, i, a) {
	let o = r.start.source === "{", s = o ? "flow map" : "flow sequence", c = new ((a?.nodeClass) ?? (o ? q : J))(n.schema);
	c.flow = !0;
	let l = n.atRoot;
	l && (n.atRoot = !1), n.atKey &&= !1;
	let u = r.offset + r.start.source.length;
	for (let a = 0; a < r.items.length; ++a) {
		let l = r.items[a], { start: d, key: f, sep: p, value: m } = l, h = or(d, {
			flow: s,
			indicator: "explicit-key-ind",
			next: f ?? p?.[0],
			offset: u,
			onError: i,
			parentIndent: r.indent,
			startOnNewline: !1
		});
		if (!h.found) {
			if (!h.anchor && !h.tag && !p && !m) {
				a === 0 && h.comma ? i(h.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${s}`) : a < r.items.length - 1 && i(h.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${s}`), h.comment && (c.comment ? c.comment += "\n" + h.comment : c.comment = h.comment), u = h.end;
				continue;
			}
			!o && n.options.strict && sr(f) && i(f, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
		}
		if (a === 0) h.comma && i(h.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${s}`);
		else if (h.comma || i(h.start, "MISSING_CHAR", `Missing , between ${s} items`), h.comment) {
			let e = "";
			loop: for (let t of d) switch (t.type) {
				case "comma":
				case "space": break;
				case "comment":
					e = t.source.substring(1);
					break loop;
				default: break loop;
			}
			if (e) {
				let t = c.items[c.items.length - 1];
				F(t) && (t = t.value ?? t.key), t.comment ? t.comment += "\n" + e : t.comment = e, h.comment = h.comment.substring(e.length + 1);
			}
		}
		if (!o && !p && !h.found) {
			let r = m ? e(n, m, h, i) : t(n, h.end, p, null, h, i);
			c.items.push(r), u = r.range[2], hr(m) && i(r.range, "BLOCK_IN_FLOW", mr);
		} else {
			n.atKey = !0;
			let a = h.end, g = f ? e(n, f, h, i) : t(n, a, d, null, h, i);
			hr(f) && i(g.range, "BLOCK_IN_FLOW", mr), n.atKey = !1;
			let _ = or(p ?? [], {
				flow: s,
				indicator: "map-value-ind",
				next: m,
				offset: g.range[2],
				onError: i,
				parentIndent: r.indent,
				startOnNewline: !1
			});
			if (_.found) {
				if (!o && !h.found && n.options.strict) {
					if (p) for (let e of p) {
						if (e === _.found) break;
						if (e.type === "newline") {
							i(e, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
							break;
						}
					}
					h.start < _.found.offset - 1024 && i(_.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
				}
			} else m && ("source" in m && m.source?.[0] === ":" ? i(m, "MISSING_CHAR", `Missing space after : in ${s}`) : i(_.start, "MISSING_CHAR", `Missing , or : between ${s} items`));
			let v = m ? e(n, m, _, i) : _.found ? t(n, _.end, p, null, _, i) : null;
			v ? hr(m) && i(v.range, "BLOCK_IN_FLOW", mr) : _.comment && (g.comment ? g.comment += "\n" + _.comment : g.comment = _.comment);
			let y = new G(g, v);
			if (n.options.keepSourceTokens && (y.srcToken = l), o) {
				let e = c;
				lr(n, e.items, g) && i(a, "DUPLICATE_KEY", "Map keys must be unique"), e.items.push(y);
			} else {
				let e = new q(n.schema);
				e.flow = !0, e.items.push(y);
				let t = (v ?? g).range;
				e.range = [
					g.range[0],
					t[1],
					t[2]
				], c.items.push(e);
			}
			u = v ? v.range[2] : _.end;
		}
	}
	let d = o ? "}" : "]", [f, ...p] = r.end, m = u;
	if (f?.source === d) m = f.offset + f.source.length;
	else {
		let e = s[0].toUpperCase() + s.substring(1), t = l ? `${e} must end with a ${d}` : `${e} in block collection must be sufficiently indented and end with a ${d}`;
		i(u, l ? "MISSING_CHAR" : "BAD_INDENT", t), f && f.source.length !== 1 && p.unshift(f);
	}
	if (p.length > 0) {
		let e = pr(p, m, n.options.strict, i);
		e.comment && (c.comment ? c.comment += "\n" + e.comment : c.comment = e.comment), c.range = [
			r.offset,
			m,
			e.offset
		];
	} else c.range = [
		r.offset,
		m,
		m
	];
	return c;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/compose-collection.js
function _r(e, t, n, r, i, a) {
	let o = n.type === "block-map" ? dr(e, t, n, r, a) : n.type === "block-seq" ? fr(e, t, n, r, a) : gr(e, t, n, r, a), s = o.constructor;
	return i === "!" || i === s.tagName ? (o.tag = s.tagName, o) : (i && (o.tag = i), o);
}
function vr(e, t, n, r, i) {
	let a = r.tag, o = a ? t.directives.tagName(a.source, (e) => i(a, "TAG_RESOLVE_FAILED", e)) : null;
	if (n.type === "block-seq") {
		let { anchor: e, newlineAfterProp: t } = r, n = e && a ? e.offset > a.offset ? e : a : e ?? a;
		n && (!t || t.offset < n.offset) && i(n, "MISSING_CHAR", "Missing newline after block sequence props");
	}
	let s = n.type === "block-map" ? "map" : n.type === "block-seq" ? "seq" : n.start.source === "{" ? "map" : "seq";
	if (!a || !o || o === "!" || o === q.tagName && s === "map" || o === J.tagName && s === "seq") return _r(e, t, n, i, o);
	let c = t.schema.tags.find((e) => e.tag === o && e.collection === s);
	if (!c) {
		let r = t.schema.knownTags[o];
		if (r?.collection === s) t.schema.tags.push(Object.assign({}, r, { default: !1 })), c = r;
		else return r ? i(a, "BAD_COLLECTION_TYPE", `${r.tag} used for ${s} collection, but expects ${r.collection ?? "scalar"}`, !0) : i(a, "TAG_RESOLVE_FAILED", `Unresolved tag: ${o}`, !0), _r(e, t, n, i, o);
	}
	let l = _r(e, t, n, i, o, c), u = c.resolve?.(l, (e) => i(a, "TAG_RESOLVE_FAILED", e), t.options) ?? l, d = R(u) ? u : new V(u);
	return d.range = l.range, d.tag = o, c?.format && (d.format = c.format), d;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
function yr(e, t, n) {
	let r = t.offset, i = br(t, e.options.strict, n);
	if (!i) return {
		value: "",
		type: null,
		comment: "",
		range: [
			r,
			r,
			r
		]
	};
	let a = i.mode === ">" ? V.BLOCK_FOLDED : V.BLOCK_LITERAL, o = t.source ? xr(t.source) : [], s = o.length;
	for (let e = o.length - 1; e >= 0; --e) {
		let t = o[e][1];
		if (t === "" || t === "\r") s = e;
		else break;
	}
	if (s === 0) {
		let e = i.chomp === "+" && o.length > 0 ? "\n".repeat(Math.max(1, o.length - 1)) : "", n = r + i.length;
		return t.source && (n += t.source.length), {
			value: e,
			type: a,
			comment: i.comment,
			range: [
				r,
				n,
				n
			]
		};
	}
	let c = t.indent + i.indent, l = t.offset + i.length, u = 0;
	for (let t = 0; t < s; ++t) {
		let [r, a] = o[t];
		if (a === "" || a === "\r") i.indent === 0 && r.length > c && (c = r.length);
		else {
			r.length < c && n(l + r.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator"), i.indent === 0 && (c = r.length), u = t, c === 0 && !e.atRoot && n(l, "BAD_INDENT", "Block scalar values in collections must be indented");
			break;
		}
		l += r.length + a.length + 1;
	}
	for (let e = o.length - 1; e >= s; --e) o[e][0].length > c && (s = e + 1);
	let d = "", f = "", p = !1;
	for (let e = 0; e < u; ++e) d += o[e][0].slice(c) + "\n";
	for (let e = u; e < s; ++e) {
		let [t, r] = o[e];
		l += t.length + r.length + 1;
		let s = r[r.length - 1] === "\r";
		/* istanbul ignore if already caught in lexer */
		if (s && (r = r.slice(0, -1)), r && t.length < c) {
			let e = `Block scalar lines must not be less indented than their ${i.indent ? "explicit indentation indicator" : "first line"}`;
			n(l - r.length - (s ? 2 : 1), "BAD_INDENT", e), t = "";
		}
		a === V.BLOCK_LITERAL ? (d += f + t.slice(c) + r, f = "\n") : t.length > c || r[0] === "	" ? (f === " " ? f = "\n" : !p && f === "\n" && (f = "\n\n"), d += f + t.slice(c) + r, f = "\n", p = !0) : r === "" ? f === "\n" ? d += "\n" : f = "\n" : (d += f + r, f = " ", p = !1);
	}
	switch (i.chomp) {
		case "-": break;
		case "+":
			for (let e = s; e < o.length; ++e) d += "\n" + o[e][0].slice(c);
			d[d.length - 1] !== "\n" && (d += "\n");
			break;
		default: d += "\n";
	}
	let m = r + i.length + t.source.length;
	return {
		value: d,
		type: a,
		comment: i.comment,
		range: [
			r,
			m,
			m
		]
	};
}
function br({ offset: e, props: t }, n, r) {
	/* istanbul ignore if should not happen */
	if (t[0].type !== "block-scalar-header") return r(t[0], "IMPOSSIBLE", "Block scalar header not found"), null;
	let { source: i } = t[0], a = i[0], o = 0, s = "", c = -1;
	for (let t = 1; t < i.length; ++t) {
		let n = i[t];
		if (!s && (n === "-" || n === "+")) s = n;
		else {
			let r = Number(n);
			!o && r ? o = r : c === -1 && (c = e + t);
		}
	}
	c !== -1 && r(c, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${i}`);
	let l = !1, u = "", d = i.length;
	for (let e = 1; e < t.length; ++e) {
		let i = t[e];
		switch (i.type) {
			case "space": l = !0;
			case "newline":
				d += i.source.length;
				break;
			case "comment":
				n && !l && r(i, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"), d += i.source.length, u = i.source.substring(1);
				break;
			case "error":
				r(i, "UNEXPECTED_TOKEN", i.message), d += i.source.length;
				break;
			/* istanbul ignore next should not happen */
			default: {
				r(i, "UNEXPECTED_TOKEN", `Unexpected token in block scalar header: ${i.type}`);
				let e = i.source;
				e && typeof e == "string" && (d += e.length);
			}
		}
	}
	return {
		mode: a,
		indent: o,
		chomp: s,
		comment: u,
		length: d
	};
}
function xr(e) {
	let t = e.split(/\n( *)/), n = t[0], r = n.match(/^( *)/), i = [r?.[1] ? [r[1], n.slice(r[1].length)] : ["", n]];
	for (let e = 1; e < t.length; e += 2) i.push([t[e], t[e + 1]]);
	return i;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
function Sr(e, t, n) {
	let { offset: r, type: i, source: a, end: o } = e, s, c, l = (e, t, i) => n(r + e, t, i);
	switch (i) {
		case "scalar":
			s = V.PLAIN, c = Cr(a, l);
			break;
		case "single-quoted-scalar":
			s = V.QUOTE_SINGLE, c = wr(a, l);
			break;
		case "double-quoted-scalar":
			s = V.QUOTE_DOUBLE, c = Er(a, l);
			break;
		/* istanbul ignore next should not happen */
		default: return n(e, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${i}`), {
			value: "",
			type: null,
			comment: "",
			range: [
				r,
				r + a.length,
				r + a.length
			]
		};
	}
	let u = r + a.length, d = pr(o, u, t, n);
	return {
		value: c,
		type: s,
		comment: d.comment,
		range: [
			r,
			u,
			d.offset
		]
	};
}
function Cr(e, t) {
	let n = "";
	switch (e[0]) {
		/* istanbul ignore next should not happen */
		case "	":
			n = "a tab character";
			break;
		case ",":
			n = "flow indicator character ,";
			break;
		case "%":
			n = "directive indicator character %";
			break;
		case "|":
		case ">":
			n = `block scalar indicator ${e[0]}`;
			break;
		case "@":
		case "`": n = `reserved character ${e[0]}`;
	}
	return n && t(0, "BAD_SCALAR_START", `Plain value cannot start with ${n}`), Tr(e);
}
function wr(e, t) {
	return (e[e.length - 1] !== "'" || e.length === 1) && t(e.length, "MISSING_CHAR", "Missing closing 'quote"), Tr(e.slice(1, -1)).replace(/''/g, "'");
}
function Tr(e) {
	let t = /(.*?)\r?\n/sy, n = t.exec(e);
	if (!n) return e;
	let r, i;
	try {
		r = /* @__PURE__ */ RegExp("(?<![ 	])[ 	]+$"), i = /* @__PURE__ */ RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
	} catch {
		r = /[ \t]+$/, i = /^[ \t]+|[ \t]+$/g;
	}
	let a = n[1].replace(r, ""), o = " ", s = t.lastIndex;
	for (; n = t.exec(e);) {
		let e = n[1].replace(i, "");
		e === "" ? o === "\n" ? a += o : o = "\n" : (a += o + e, o = " "), s = t.lastIndex;
	}
	let c = /[ \t]*(.*)/sy;
	return c.lastIndex = s, n = c.exec(e), a + o + (n?.[1] ?? "");
}
function Er(e, t) {
	let n = "";
	for (let r = 1; r < e.length - 1; ++r) {
		let i = e[r];
		if (i !== "\r" || e[r + 1] !== "\n") {
			if (i === "\n") {
				let { fold: t, offset: i } = Dr(e, r);
				n += t, r = i;
			} else if (i === "\\") {
				let i = e[++r], a = Or[i];
				if (a) n += a;
				else if (i === "\n") for (i = e[r + 1]; i === " " || i === "	";) i = e[++r + 1];
				else if (i === "\r" && e[r + 1] === "\n") for (i = e[++r + 1]; i === " " || i === "	";) i = e[++r + 1];
				else if (i === "x" || i === "u" || i === "U") {
					let a = i === "x" ? 2 : i === "u" ? 4 : 8;
					n += kr(e, r + 1, a, t), r += a;
				} else {
					let i = e.substr(r - 1, 2);
					t(r - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${i}`), n += i;
				}
			} else if (i === " " || i === "	") {
				let t = r, a = e[r + 1];
				for (; a === " " || a === "	";) a = e[++r + 1];
				a !== "\n" && (a !== "\r" || e[r + 2] !== "\n") && (n += r > t ? e.slice(t, r + 1) : i);
			} else n += i;
		}
	}
	return (e[e.length - 1] !== "\"" || e.length === 1) && t(e.length, "MISSING_CHAR", "Missing closing \"quote"), n;
}
function Dr(e, t) {
	let n = "", r = e[t + 1];
	for (; (r === " " || r === "	" || r === "\n" || r === "\r") && (r !== "\r" || e[t + 2] === "\n");) r === "\n" && (n += "\n"), t += 1, r = e[t + 1];
	return n ||= " ", {
		fold: n,
		offset: t
	};
}
var Or = {
	0: "\0",
	a: "\x07",
	b: "\b",
	e: "\x1B",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	",
	v: "\v",
	N: "",
	_: "\xA0",
	L: "\u2028",
	P: "\u2029",
	" ": " ",
	"\"": "\"",
	"/": "/",
	"\\": "\\",
	"	": "	"
};
function kr(e, t, n, r) {
	let i = e.substr(t, n), a = i.length === n && /^[0-9a-fA-F]+$/.test(i) ? parseInt(i, 16) : NaN;
	try {
		return String.fromCodePoint(a);
	} catch {
		let i = e.substr(t - 2, n + 2);
		return r(t - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${i}`), i;
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/compose-scalar.js
function Ar(e, t, n, r) {
	let { value: i, type: a, comment: o, range: s } = t.type === "block-scalar" ? yr(e, t, r) : Sr(t, e.options.strict, r), c = n ? e.directives.tagName(n.source, (e) => r(n, "TAG_RESOLVE_FAILED", e)) : null, l;
	l = e.options.stringKeys && e.atKey ? e.schema[N] : c ? jr(e.schema, i, c, n, r) : t.type === "scalar" ? Mr(e, i, t, r) : e.schema[N];
	let u;
	try {
		let a = l.resolve(i, (e) => r(n ?? t, "TAG_RESOLVE_FAILED", e), e.options);
		u = I(a) ? a : new V(a);
	} catch (e) {
		let a = e instanceof Error ? e.message : String(e);
		r(n ?? t, "TAG_RESOLVE_FAILED", a), u = new V(i);
	}
	return u.range = s, u.source = i, a && (u.type = a), c && (u.tag = c), l.format && (u.format = l.format), o && (u.comment = o), u;
}
function jr(e, t, n, r, i) {
	if (n === "!") return e[N];
	let a = [];
	for (let t of e.tags) if (!t.collection && t.tag === n) {
		if (t.default && t.test) a.push(t);
		else return t;
	}
	for (let e of a) if (e.test?.test(t)) return e;
	let o = e.knownTags[n];
	return o && !o.collection ? (e.tags.push(Object.assign({}, o, {
		default: !1,
		test: void 0
	})), o) : (i(r, "TAG_RESOLVE_FAILED", `Unresolved tag: ${n}`, n !== "tag:yaml.org,2002:str"), e[N]);
}
function Mr({ atKey: e, directives: t, schema: n }, r, i, a) {
	let o = n.tags.find((t) => (t.default === !0 || e && t.default === "key") && t.test?.test(r)) || n[N];
	if (n.compat) {
		let e = n.compat.find((e) => e.default && e.test?.test(r)) ?? n[N];
		o.tag !== e.tag && a(i, "TAG_RESOLVE_FAILED", `Value may be parsed as either ${t.tagString(o.tag)} or ${t.tagString(e.tag)}`, !0);
	}
	return o;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js
function Nr(e, t, n) {
	if (t) {
		n ??= t.length;
		for (let r = n - 1; r >= 0; --r) {
			let n = t[r];
			switch (n.type) {
				case "space":
				case "comment":
				case "newline":
					e -= n.source.length;
					continue;
			}
			for (n = t[++r]; n?.type === "space";) e += n.source.length, n = t[++r];
			break;
		}
	}
	return e;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/compose-node.js
var Pr = {
	composeNode: Fr,
	composeEmptyNode: Ir
};
function Fr(e, t, n, r) {
	let i = e.atKey, { spaceBefore: a, comment: o, anchor: s, tag: c } = n, l, u = !0;
	switch (t.type) {
		case "alias":
			l = Lr(e, t, r), (s || c) && r(t, "ALIAS_PROPS", "An alias node must not specify any properties");
			break;
		case "scalar":
		case "single-quoted-scalar":
		case "double-quoted-scalar":
		case "block-scalar":
			l = Ar(e, t, c, r), s && (l.anchor = s.source.substring(1));
			break;
		case "block-map":
		case "block-seq":
		case "flow-collection":
			try {
				l = vr(Pr, e, t, n, r), s && (l.anchor = s.source.substring(1));
			} catch (e) {
				r(t, "RESOURCE_EXHAUSTION", e instanceof Error ? e.message : String(e));
			}
			break;
		default: r(t, "UNEXPECTED_TOKEN", t.type === "error" ? t.message : `Unsupported token (type: ${t.type})`), u = !1;
	}
	return l ??= Ir(e, t.offset, void 0, null, n, r), s && l.anchor === "" && r(s, "BAD_ALIAS", "Anchor cannot be an empty string"), i && e.options.stringKeys && (!I(l) || typeof l.value != "string" || l.tag && l.tag !== "tag:yaml.org,2002:str") && r(c ?? t, "NON_STRING_KEY", "With stringKeys, all keys must be strings"), a && (l.spaceBefore = !0), o && (t.type === "scalar" && t.source === "" ? l.comment = o : l.commentBefore = o), e.options.keepSourceTokens && u && (l.srcToken = t), l;
}
function Ir(e, t, n, r, { spaceBefore: i, comment: a, anchor: o, tag: s, end: c }, l) {
	let u = Ar(e, {
		type: "scalar",
		offset: Nr(t, n, r),
		indent: -1,
		source: ""
	}, s, l);
	return o && (u.anchor = o.source.substring(1), u.anchor === "" && l(o, "BAD_ALIAS", "Anchor cannot be an empty string")), i && (u.spaceBefore = !0), a && (u.comment = a, u.range[2] = c), u;
}
function Lr({ options: e }, { offset: t, source: n, end: r }, i) {
	let a = new ut(n.substring(1));
	a.source === "" && i(t, "BAD_ALIAS", "Alias cannot be an empty string"), a.source.endsWith(":") && i(t + n.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
	let o = t + n.length, s = pr(r, o, e.strict, i);
	return a.range = [
		t,
		o,
		s.offset
	], s.comment && (a.comment = s.comment), a;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/compose-doc.js
function Rr(e, t, { offset: n, start: r, value: i, end: a }, o) {
	let s = new er(void 0, Object.assign({ _directives: t }, e)), c = {
		atKey: !1,
		atRoot: !0,
		directives: s.directives,
		options: s.options,
		schema: s.schema
	}, l = or(r, {
		indicator: "doc-start",
		next: i ?? a?.[0],
		offset: n,
		onError: o,
		parentIndent: 0,
		startOnNewline: !0
	});
	l.found && (s.directives.docStart = !0, i && (i.type === "block-map" || i.type === "block-seq") && !l.hasNewline && o(l.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")), s.contents = i ? Fr(c, i, l, o) : Ir(c, l.end, r, null, l, o);
	let u = s.contents.range[2], d = pr(a, u, !1, o);
	return d.comment && (s.comment = d.comment), s.range = [
		n,
		u,
		d.offset
	], s;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/composer.js
function zr(e) {
	if (typeof e == "number") return [e, e + 1];
	if (Array.isArray(e)) return e.length === 2 ? e : [e[0], e[1]];
	let { offset: t, source: n } = e;
	return [t, t + (typeof n == "string" ? n.length : 1)];
}
function Br(e) {
	let t = "", n = !1, r = !1;
	for (let i = 0; i < e.length; ++i) {
		let a = e[i];
		switch (a[0]) {
			case "#":
				t += (t === "" ? "" : r ? "\n\n" : "\n") + (a.substring(1) || " "), n = !0, r = !1;
				break;
			case "%":
				e[i + 1]?.[0] !== "#" && (i += 1), n = !1;
				break;
			default: n || (r = !0), n = !1;
		}
	}
	return {
		comment: t,
		afterEmptyLine: r
	};
}
var Vr = class {
	constructor(e = {}) {
		this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (e, t, n, r) => {
			let i = zr(e);
			r ? this.warnings.push(new ir(i, t, n)) : this.errors.push(new rr(i, t, n));
		}, this.directives = new rt({ version: e.version || "1.2" }), this.options = e;
	}
	decorate(e, t) {
		let { comment: n, afterEmptyLine: r } = Br(this.prelude);
		if (n) {
			let i = e.contents;
			if (t) e.comment = e.comment ? `${e.comment}\n${n}` : n;
			else if (r || e.directives.docStart || !i) e.commentBefore = n;
			else if (L(i) && !i.flow && i.items.length > 0) {
				let e = i.items[0];
				F(e) && (e = e.key);
				let t = e.commentBefore;
				e.commentBefore = t ? `${n}\n${t}` : n;
			} else {
				let e = i.commentBefore;
				i.commentBefore = e ? `${n}\n${e}` : n;
			}
		}
		if (t) {
			for (let t = 0; t < this.errors.length; ++t) e.errors.push(this.errors[t]);
			for (let t = 0; t < this.warnings.length; ++t) e.warnings.push(this.warnings[t]);
		} else e.errors = this.errors, e.warnings = this.warnings;
		this.prelude = [], this.errors = [], this.warnings = [];
	}
	streamInfo() {
		return {
			comment: Br(this.prelude).comment,
			directives: this.directives,
			errors: this.errors,
			warnings: this.warnings
		};
	}
	*compose(e, t = !1, n = -1) {
		for (let t of e) yield* this.next(t);
		yield* this.end(t, n);
	}
	*next(e) {
		switch (e.type) {
			case "directive":
				this.directives.add(e.source, (t, n, r) => {
					let i = zr(e);
					i[0] += t, this.onError(i, "BAD_DIRECTIVE", n, r);
				}), this.prelude.push(e.source), this.atDirectives = !0;
				break;
			case "document": {
				let t = Rr(this.options, this.directives, e, this.onError);
				this.atDirectives && !t.directives.docStart && this.onError(e, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"), this.decorate(t, !1), this.doc && (yield this.doc), this.doc = t, this.atDirectives = !1;
				break;
			}
			case "byte-order-mark":
			case "space": break;
			case "comment":
			case "newline":
				this.prelude.push(e.source);
				break;
			case "error": {
				let t = e.source ? `${e.message}: ${JSON.stringify(e.source)}` : e.message, n = new rr(zr(e), "UNEXPECTED_TOKEN", t);
				this.atDirectives || !this.doc ? this.errors.push(n) : this.doc.errors.push(n);
				break;
			}
			case "doc-end": {
				if (!this.doc) {
					this.errors.push(new rr(zr(e), "UNEXPECTED_TOKEN", "Unexpected doc-end without preceding document"));
					break;
				}
				this.doc.directives.docEnd = !0;
				let t = pr(e.end, e.offset + e.source.length, this.doc.options.strict, this.onError);
				if (this.decorate(this.doc, !0), t.comment) {
					let e = this.doc.comment;
					this.doc.comment = e ? `${e}\n${t.comment}` : t.comment;
				}
				this.doc.range[2] = t.offset;
				break;
			}
			default: this.errors.push(new rr(zr(e), "UNEXPECTED_TOKEN", `Unsupported token ${e.type}`));
		}
	}
	*end(e = !1, t = -1) {
		if (this.doc) this.decorate(this.doc, !0), yield this.doc, this.doc = null;
		else if (e) {
			let e = new er(void 0, Object.assign({ _directives: this.directives }, this.options));
			this.atDirectives && this.onError(t, "MISSING_CHAR", "Missing directives-end indicator line"), e.range = [
				0,
				t,
				t
			], this.decorate(e, !1), yield e;
		}
	}
}, Hr = Symbol("break visit"), Ur = Symbol("skip children"), Wr = Symbol("remove item");
function Gr(e, t) {
	"type" in e && e.type === "document" && (e = {
		start: e.start,
		value: e.value
	}), Kr(Object.freeze([]), e, t);
}
Gr.BREAK = Hr, Gr.SKIP = Ur, Gr.REMOVE = Wr, Gr.itemAtPath = (e, t) => {
	let n = e;
	for (let [e, r] of t) {
		let t = n?.[e];
		if (t && "items" in t) n = t.items[r];
		else return;
	}
	return n;
}, Gr.parentCollection = (e, t) => {
	let n = Gr.itemAtPath(e, t.slice(0, -1)), r = t[t.length - 1][0], i = n?.[r];
	if (i && "items" in i) return i;
	throw Error("Parent collection not found");
};
function Kr(e, t, n) {
	let r = n(t, e);
	if (typeof r == "symbol") return r;
	for (let i of ["key", "value"]) {
		let a = t[i];
		if (a && "items" in a) {
			for (let t = 0; t < a.items.length; ++t) {
				let r = Kr(Object.freeze(e.concat([[i, t]])), a.items[t], n);
				if (typeof r == "number") t = r - 1;
				else if (r === Hr) return Hr;
				else r === Wr && (a.items.splice(t, 1), --t);
			}
			typeof r == "function" && i === "key" && (r = r(t, e));
		}
	}
	return typeof r == "function" ? r(t, e) : r;
}
function qr(e) {
	switch (e) {
		case "﻿": return "byte-order-mark";
		case "": return "doc-mode";
		case "": return "flow-error-end";
		case "": return "scalar";
		case "---": return "doc-start";
		case "...": return "doc-end";
		case "":
		case "\n":
		case "\r\n": return "newline";
		case "-": return "seq-item-ind";
		case "?": return "explicit-key-ind";
		case ":": return "map-value-ind";
		case "{": return "flow-map-start";
		case "}": return "flow-map-end";
		case "[": return "flow-seq-start";
		case "]": return "flow-seq-end";
		case ",": return "comma";
	}
	switch (e[0]) {
		case " ":
		case "	": return "space";
		case "#": return "comment";
		case "%": return "directive-line";
		case "*": return "alias";
		case "&": return "anchor";
		case "!": return "tag";
		case "'": return "single-quoted-scalar";
		case "\"": return "double-quoted-scalar";
		case "|":
		case ">": return "block-scalar-header";
	}
	return null;
}
//#endregion
//#region node_modules/yaml/browser/dist/parse/lexer.js
function X(e) {
	switch (e) {
		case void 0:
		case " ":
		case "\n":
		case "\r":
		case "	": return !0;
		default: return !1;
	}
}
var Jr = /* @__PURE__ */ new Set("0123456789ABCDEFabcdef"), Yr = /* @__PURE__ */ new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), Xr = /* @__PURE__ */ new Set(",[]{}"), Zr = /* @__PURE__ */ new Set(" ,[]{}\n\r	"), Qr = (e) => !e || Zr.has(e), $r = class {
	constructor() {
		this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0;
	}
	*lex(e, t = !1) {
		if (e) {
			if (typeof e != "string") throw TypeError("source is not a string");
			this.buffer = this.buffer ? this.buffer + e : e, this.lineEndPos = null;
		}
		this.atEnd = !t;
		let n = this.next ?? "stream";
		for (; n && (t || this.hasChars(1));) n = yield* this.parseNext(n);
	}
	atLineEnd() {
		let e = this.pos, t = this.buffer[e];
		for (; t === " " || t === "	";) t = this.buffer[++e];
		return !t || t === "#" || t === "\n" || t === "\r" && this.buffer[e + 1] === "\n";
	}
	charAt(e) {
		return this.buffer[this.pos + e];
	}
	continueScalar(e) {
		let t = this.buffer[e];
		if (this.indentNext > 0) {
			let n = 0;
			for (; t === " ";) t = this.buffer[++n + e];
			if (t === "\r") {
				let t = this.buffer[n + e + 1];
				if (t === "\n" || !t && !this.atEnd) return e + n + 1;
			}
			return t === "\n" || n >= this.indentNext || !t && !this.atEnd ? e + n : -1;
		}
		if (t === "-" || t === ".") {
			let t = this.buffer.substr(e, 3);
			if ((t === "---" || t === "...") && X(this.buffer[e + 3])) return -1;
		}
		return e;
	}
	getLine() {
		let e = this.lineEndPos;
		return (typeof e != "number" || e !== -1 && e < this.pos) && (e = this.buffer.indexOf("\n", this.pos), this.lineEndPos = e), e === -1 ? this.atEnd ? this.buffer.substring(this.pos) : null : (this.buffer[e - 1] === "\r" && --e, this.buffer.substring(this.pos, e));
	}
	hasChars(e) {
		return this.pos + e <= this.buffer.length;
	}
	setNext(e) {
		return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = e, null;
	}
	peek(e) {
		return this.buffer.substr(this.pos, e);
	}
	*parseNext(e) {
		switch (e) {
			case "stream": return yield* this.parseStream();
			case "line-start": return yield* this.parseLineStart();
			case "block-start": return yield* this.parseBlockStart();
			case "doc": return yield* this.parseDocument();
			case "flow": return yield* this.parseFlowCollection();
			case "quoted-scalar": return yield* this.parseQuotedScalar();
			case "block-scalar": return yield* this.parseBlockScalar();
			case "plain-scalar": return yield* this.parsePlainScalar();
		}
	}
	*parseStream() {
		let e = this.getLine();
		if (e === null) return this.setNext("stream");
		if (e[0] === "﻿" && (yield* this.pushCount(1), e = e.substring(1)), e[0] === "%") {
			let t = e.length, n = e.indexOf("#");
			for (; n !== -1;) {
				let r = e[n - 1];
				if (r === " " || r === "	") {
					t = n - 1;
					break;
				}
				n = e.indexOf("#", n + 1);
			}
			for (;;) {
				let n = e[t - 1];
				if (n === " " || n === "	") --t;
				else break;
			}
			let r = (yield* this.pushCount(t)) + (yield* this.pushSpaces(!0));
			return yield* this.pushCount(e.length - r), this.pushNewline(), "stream";
		}
		if (this.atLineEnd()) {
			let t = yield* this.pushSpaces(!0);
			return yield* this.pushCount(e.length - t), yield* this.pushNewline(), "stream";
		}
		return yield "", yield* this.parseLineStart();
	}
	*parseLineStart() {
		let e = this.charAt(0);
		if (!e && !this.atEnd) return this.setNext("line-start");
		if (e === "-" || e === ".") {
			if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
			let e = this.peek(3);
			if ((e === "---" || e === "...") && X(this.charAt(3))) return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, e === "---" ? "doc" : "stream";
		}
		return this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !X(this.charAt(1)) && (this.indentNext = this.indentValue), yield* this.parseBlockStart();
	}
	*parseBlockStart() {
		let [e, t] = this.peek(2);
		if (!t && !this.atEnd) return this.setNext("block-start");
		if ((e === "-" || e === "?" || e === ":") && X(t)) {
			let e = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
			return this.indentNext = this.indentValue + 1, this.indentValue += e, "block-start";
		}
		return "doc";
	}
	*parseDocument() {
		yield* this.pushSpaces(!0);
		let e = this.getLine();
		if (e === null) return this.setNext("doc");
		let t = yield* this.pushIndicators();
		switch (e[t]) {
			case "#": yield* this.pushCount(e.length - t);
			case void 0: return yield* this.pushNewline(), yield* this.parseLineStart();
			case "{":
			case "[": return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
			case "}":
			case "]": return yield* this.pushCount(1), "doc";
			case "*": return yield* this.pushUntil(Qr), "doc";
			case "\"":
			case "'": return yield* this.parseQuotedScalar();
			case "|":
			case ">": return t += yield* this.parseBlockScalarHeader(), t += yield* this.pushSpaces(!0), yield* this.pushCount(e.length - t), yield* this.pushNewline(), yield* this.parseBlockScalar();
			default: return yield* this.parsePlainScalar();
		}
	}
	*parseFlowCollection() {
		let e, t, n = -1;
		do
			e = yield* this.pushNewline(), e > 0 ? (t = yield* this.pushSpaces(!1), this.indentValue = n = t) : t = 0, t += yield* this.pushSpaces(!0);
		while (e + t > 0);
		let r = this.getLine();
		if (r === null) return this.setNext("flow");
		if ((n !== -1 && n < this.indentNext && r[0] !== "#" || n === 0 && (r.startsWith("---") || r.startsWith("...")) && X(r[3])) && (n !== this.indentNext - 1 || this.flowLevel !== 1 || r[0] !== "]" && r[0] !== "}")) return this.flowLevel = 0, yield "", yield* this.parseLineStart();
		let i = 0;
		for (; r[i] === ",";) i += yield* this.pushCount(1), i += yield* this.pushSpaces(!0), this.flowKey = !1;
		switch (i += yield* this.pushIndicators(), r[i]) {
			case void 0: return "flow";
			case "#": return yield* this.pushCount(r.length - i), "flow";
			case "{":
			case "[": return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
			case "}":
			case "]": return yield* this.pushCount(1), this.flowKey = !0, --this.flowLevel, this.flowLevel ? "flow" : "doc";
			case "*": return yield* this.pushUntil(Qr), "flow";
			case "\"":
			case "'": return this.flowKey = !0, yield* this.parseQuotedScalar();
			case ":": {
				let e = this.charAt(1);
				if (this.flowKey || X(e) || e === ",") return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
			}
			default: return this.flowKey = !1, yield* this.parsePlainScalar();
		}
	}
	*parseQuotedScalar() {
		let e = this.charAt(0), t = this.buffer.indexOf(e, this.pos + 1);
		if (e === "'") for (; t !== -1 && this.buffer[t + 1] === "'";) t = this.buffer.indexOf("'", t + 2);
		else for (; t !== -1;) {
			let e = 0;
			for (; this.buffer[t - 1 - e] === "\\";) e += 1;
			if (e % 2 == 0) break;
			t = this.buffer.indexOf("\"", t + 1);
		}
		let n = this.buffer.substring(0, t), r = n.indexOf("\n", this.pos);
		if (r !== -1) {
			for (; r !== -1;) {
				let e = this.continueScalar(r + 1);
				if (e === -1) break;
				r = n.indexOf("\n", e);
			}
			r !== -1 && (t = r - (n[r - 1] === "\r" ? 2 : 1));
		}
		if (t === -1) {
			if (!this.atEnd) return this.setNext("quoted-scalar");
			t = this.buffer.length;
		}
		return yield* this.pushToIndex(t + 1, !1), this.flowLevel ? "flow" : "doc";
	}
	*parseBlockScalarHeader() {
		this.blockScalarIndent = -1, this.blockScalarKeep = !1;
		let e = this.pos;
		for (;;) {
			let t = this.buffer[++e];
			if (t === "+") this.blockScalarKeep = !0;
			else if (t > "0" && t <= "9") this.blockScalarIndent = Number(t) - 1;
			else if (t !== "-") break;
		}
		return yield* this.pushUntil((e) => X(e) || e === "#");
	}
	*parseBlockScalar() {
		let e = this.pos - 1, t = 0, n;
		loop: for (let r = this.pos; n = this.buffer[r]; ++r) switch (n) {
			case " ":
				t += 1;
				break;
			case "\n":
				e = r, t = 0;
				break;
			case "\r": {
				let e = this.buffer[r + 1];
				if (!e && !this.atEnd) return this.setNext("block-scalar");
				if (e === "\n") break;
			}
			default: break loop;
		}
		if (!n && !this.atEnd) return this.setNext("block-scalar");
		if (t >= this.indentNext) {
			this.indentNext = this.blockScalarIndent === -1 ? t : this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
			do {
				let t = this.continueScalar(e + 1);
				if (t === -1) break;
				e = this.buffer.indexOf("\n", t);
			} while (e !== -1);
			if (e === -1) {
				if (!this.atEnd) return this.setNext("block-scalar");
				e = this.buffer.length;
			}
		}
		let r = e + 1;
		for (n = this.buffer[r]; n === " ";) n = this.buffer[++r];
		if (n === "	") {
			for (; n === "	" || n === " " || n === "\r" || n === "\n";) n = this.buffer[++r];
			e = r - 1;
		} else if (!this.blockScalarKeep) do {
			let n = e - 1, r = this.buffer[n];
			r === "\r" && (r = this.buffer[--n]);
			let i = n;
			for (; r === " ";) r = this.buffer[--n];
			if (r === "\n" && n >= this.pos && n + 1 + t > i) e = n;
			else break;
		} while (1);
		return yield "", yield* this.pushToIndex(e + 1, !0), yield* this.parseLineStart();
	}
	*parsePlainScalar() {
		let e = this.flowLevel > 0, t = this.pos - 1, n = this.pos - 1, r;
		for (; r = this.buffer[++n];) if (r === ":") {
			let r = this.buffer[n + 1];
			if (X(r) || e && Xr.has(r)) break;
			t = n;
		} else if (X(r)) {
			let i = this.buffer[n + 1];
			if (r === "\r" && (i === "\n" ? (n += 1, r = "\n", i = this.buffer[n + 1]) : t = n), i === "#" || e && Xr.has(i)) break;
			if (r === "\n") {
				let e = this.continueScalar(n + 1);
				if (e === -1) break;
				n = Math.max(n, e - 2);
			}
		} else {
			if (e && Xr.has(r)) break;
			t = n;
		}
		return !r && !this.atEnd ? this.setNext("plain-scalar") : (yield "", yield* this.pushToIndex(t + 1, !0), e ? "flow" : "doc");
	}
	*pushCount(e) {
		return e > 0 ? (yield this.buffer.substr(this.pos, e), this.pos += e, e) : 0;
	}
	*pushToIndex(e, t) {
		let n = this.buffer.slice(this.pos, e);
		return n ? (yield n, this.pos += n.length, n.length) : (t && (yield ""), 0);
	}
	*pushIndicators() {
		let e = 0;
		loop: for (;;) {
			switch (this.charAt(0)) {
				case "!":
					e += yield* this.pushTag(), e += yield* this.pushSpaces(!0);
					continue loop;
				case "&":
					e += yield* this.pushUntil(Qr), e += yield* this.pushSpaces(!0);
					continue loop;
				case "-":
				case "?":
				case ":": {
					let t = this.flowLevel > 0, n = this.charAt(1);
					if (X(n) || t && Xr.has(n)) {
						t ? this.flowKey &&= !1 : this.indentNext = this.indentValue + 1, e += yield* this.pushCount(1), e += yield* this.pushSpaces(!0);
						continue loop;
					}
				}
			}
			break loop;
		}
		return e;
	}
	*pushTag() {
		if (this.charAt(1) === "<") {
			let e = this.pos + 2, t = this.buffer[e];
			for (; !X(t) && t !== ">";) t = this.buffer[++e];
			return yield* this.pushToIndex(t === ">" ? e + 1 : e, !1);
		}
		{
			let e = this.pos + 1, t = this.buffer[e];
			for (; t;) if (Yr.has(t)) t = this.buffer[++e];
			else if (t === "%" && Jr.has(this.buffer[e + 1]) && Jr.has(this.buffer[e + 2])) t = this.buffer[e += 3];
			else break;
			return yield* this.pushToIndex(e, !1);
		}
	}
	*pushNewline() {
		let e = this.buffer[this.pos];
		return e === "\n" ? yield* this.pushCount(1) : e === "\r" && this.charAt(1) === "\n" ? yield* this.pushCount(2) : 0;
	}
	*pushSpaces(e) {
		let t = this.pos - 1, n;
		do
			n = this.buffer[++t];
		while (n === " " || e && n === "	");
		let r = t - this.pos;
		return r > 0 && (yield this.buffer.substr(this.pos, r), this.pos = t), r;
	}
	*pushUntil(e) {
		let t = this.pos, n = this.buffer[t];
		for (; !e(n);) n = this.buffer[++t];
		return yield* this.pushToIndex(t, !1);
	}
}, ei = class {
	constructor() {
		this.lineStarts = [], this.addNewLine = (e) => this.lineStarts.push(e), this.linePos = (e) => {
			let t = 0, n = this.lineStarts.length;
			for (; t < n;) {
				let r = t + n >> 1;
				this.lineStarts[r] < e ? t = r + 1 : n = r;
			}
			if (this.lineStarts[t] === e) return {
				line: t + 1,
				col: 1
			};
			if (t === 0) return {
				line: 0,
				col: e
			};
			let r = this.lineStarts[t - 1];
			return {
				line: t,
				col: e - r + 1
			};
		};
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/parse/parser.js
function Z(e, t) {
	for (let n = 0; n < e.length; ++n) if (e[n].type === t) return !0;
	return !1;
}
function ti(e) {
	for (let t = 0; t < e.length; ++t) switch (e[t].type) {
		case "space":
		case "comment":
		case "newline": break;
		default: return t;
	}
	return -1;
}
function ni(e) {
	switch (e?.type) {
		case "alias":
		case "scalar":
		case "single-quoted-scalar":
		case "double-quoted-scalar":
		case "flow-collection": return !0;
		default: return !1;
	}
}
function ri(e) {
	switch (e.type) {
		case "document": return e.start;
		case "block-map": {
			let t = e.items[e.items.length - 1];
			return t.sep ?? t.start;
		}
		case "block-seq": return e.items[e.items.length - 1].start;
		/* istanbul ignore next should not happen */
		default: return [];
	}
}
function ii(e) {
	if (e.length === 0) return [];
	let t = e.length;
	loop: for (; --t >= 0;) switch (e[t].type) {
		case "doc-start":
		case "explicit-key-ind":
		case "map-value-ind":
		case "seq-item-ind":
		case "newline": break loop;
	}
	for (; e[++t]?.type === "space";);
	return e.splice(t, e.length);
}
function ai(e, t) {
	if (t.length < 1e5) Array.prototype.push.apply(e, t);
	else for (let n = 0; n < t.length; ++n) e.push(t[n]);
}
function oi(e) {
	if (e.start.type === "flow-seq-start") for (let t of e.items) t.sep && !t.value && !Z(t.start, "explicit-key-ind") && !Z(t.sep, "map-value-ind") && (t.key && (t.value = t.key), delete t.key, ni(t.value) ? t.value.end ? ai(t.value.end, t.sep) : t.value.end = t.sep : ai(t.start, t.sep), delete t.sep);
}
var si = class {
	constructor(e) {
		this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new $r(), this.onNewLine = e;
	}
	*parse(e, t = !1) {
		this.onNewLine && this.offset === 0 && this.onNewLine(0);
		for (let n of this.lexer.lex(e, t)) yield* this.next(n);
		t || (yield* this.end());
	}
	*next(e) {
		if (this.source = e, this.atScalar) {
			this.atScalar = !1, yield* this.step(), this.offset += e.length;
			return;
		}
		let t = qr(e);
		if (!t) {
			let t = `Not a YAML token: ${e}`;
			yield* this.pop({
				type: "error",
				offset: this.offset,
				message: t,
				source: e
			}), this.offset += e.length;
		} else if (t === "scalar") this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
		else {
			switch (this.type = t, yield* this.step(), t) {
				case "newline":
					this.atNewLine = !0, this.indent = 0, this.onNewLine && this.onNewLine(this.offset + e.length);
					break;
				case "space":
					this.atNewLine && e[0] === " " && (this.indent += e.length);
					break;
				case "explicit-key-ind":
				case "map-value-ind":
				case "seq-item-ind":
					this.atNewLine && (this.indent += e.length);
					break;
				case "doc-mode":
				case "flow-error-end": return;
				default: this.atNewLine = !1;
			}
			this.offset += e.length;
		}
	}
	*end() {
		for (; this.stack.length > 0;) yield* this.pop();
	}
	get sourceToken() {
		return {
			type: this.type,
			offset: this.offset,
			indent: this.indent,
			source: this.source
		};
	}
	*step() {
		let e = this.peek(1);
		if (this.type === "doc-end" && e?.type !== "doc-end") {
			for (; this.stack.length > 0;) yield* this.pop();
			this.stack.push({
				type: "doc-end",
				offset: this.offset,
				source: this.source
			});
			return;
		}
		if (!e) return yield* this.stream();
		switch (e.type) {
			case "document": return yield* this.document(e);
			case "alias":
			case "scalar":
			case "single-quoted-scalar":
			case "double-quoted-scalar": return yield* this.scalar(e);
			case "block-scalar": return yield* this.blockScalar(e);
			case "block-map": return yield* this.blockMap(e);
			case "block-seq": return yield* this.blockSequence(e);
			case "flow-collection": return yield* this.flowCollection(e);
			case "doc-end": return yield* this.documentEnd(e);
		}
		/* istanbul ignore next should not happen */
		yield* this.pop();
	}
	peek(e) {
		return this.stack[this.stack.length - e];
	}
	*pop(e) {
		let t = e ?? this.stack.pop();
		/* istanbul ignore if should not happen */
		if (!t) yield {
			type: "error",
			offset: this.offset,
			source: "",
			message: "Tried to pop an empty stack"
		};
		else if (this.stack.length === 0) yield t;
		else {
			let e = this.peek(1);
			switch (t.type === "block-scalar" ? t.indent = "indent" in e ? e.indent : 0 : t.type === "flow-collection" && e.type === "document" && (t.indent = 0), t.type === "flow-collection" && oi(t), e.type) {
				case "document":
					e.value = t;
					break;
				case "block-scalar":
					e.props.push(t);
					break;
				case "block-map": {
					let n = e.items[e.items.length - 1];
					if (n.value) {
						e.items.push({
							start: [],
							key: t,
							sep: []
						}), this.onKeyLine = !0;
						return;
					}
					if (n.sep) n.value = t;
					else {
						Object.assign(n, {
							key: t,
							sep: []
						}), this.onKeyLine = !n.explicitKey;
						return;
					}
					break;
				}
				case "block-seq": {
					let n = e.items[e.items.length - 1];
					n.value ? e.items.push({
						start: [],
						value: t
					}) : n.value = t;
					break;
				}
				case "flow-collection": {
					let n = e.items[e.items.length - 1];
					!n || n.value ? e.items.push({
						start: [],
						key: t,
						sep: []
					}) : n.sep ? n.value = t : Object.assign(n, {
						key: t,
						sep: []
					});
					return;
				}
				/* istanbul ignore next should not happen */
				default: yield* this.pop(), yield* this.pop(t);
			}
			if ((e.type === "document" || e.type === "block-map" || e.type === "block-seq") && (t.type === "block-map" || t.type === "block-seq")) {
				let n = t.items[t.items.length - 1];
				n && !n.sep && !n.value && n.start.length > 0 && ti(n.start) === -1 && (t.indent === 0 || n.start.every((e) => e.type !== "comment" || e.indent < t.indent)) && (e.type === "document" ? e.end = n.start : e.items.push({ start: n.start }), t.items.splice(-1, 1));
			}
		}
	}
	*stream() {
		switch (this.type) {
			case "directive-line":
				yield {
					type: "directive",
					offset: this.offset,
					source: this.source
				};
				return;
			case "byte-order-mark":
			case "space":
			case "comment":
			case "newline":
				yield this.sourceToken;
				return;
			case "doc-mode":
			case "doc-start": {
				let e = {
					type: "document",
					offset: this.offset,
					start: []
				};
				this.type === "doc-start" && e.start.push(this.sourceToken), this.stack.push(e);
				return;
			}
		}
		yield {
			type: "error",
			offset: this.offset,
			message: `Unexpected ${this.type} token in YAML stream`,
			source: this.source
		};
	}
	*document(e) {
		if (e.value) return yield* this.lineEnd(e);
		switch (this.type) {
			case "doc-start":
				ti(e.start) === -1 ? e.start.push(this.sourceToken) : (yield* this.pop(), yield* this.step());
				return;
			case "anchor":
			case "tag":
			case "space":
			case "comment":
			case "newline":
				e.start.push(this.sourceToken);
				return;
		}
		let t = this.startBlockValue(e);
		t ? this.stack.push(t) : yield {
			type: "error",
			offset: this.offset,
			message: `Unexpected ${this.type} token in YAML document`,
			source: this.source
		};
	}
	*scalar(e) {
		if (this.type === "map-value-ind") {
			let t = ii(ri(this.peek(2))), n;
			e.end ? (n = e.end, n.push(this.sourceToken), delete e.end) : n = [this.sourceToken];
			let r = {
				type: "block-map",
				offset: e.offset,
				indent: e.indent,
				items: [{
					start: t,
					key: e,
					sep: n
				}]
			};
			this.onKeyLine = !0, this.stack[this.stack.length - 1] = r;
		} else yield* this.lineEnd(e);
	}
	*blockScalar(e) {
		switch (this.type) {
			case "space":
			case "comment":
			case "newline":
				e.props.push(this.sourceToken);
				return;
			case "scalar":
				if (e.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
					let e = this.source.indexOf("\n") + 1;
					for (; e !== 0;) this.onNewLine(this.offset + e), e = this.source.indexOf("\n", e) + 1;
				}
				yield* this.pop();
				break;
			/* istanbul ignore next should not happen */
			default: yield* this.pop(), yield* this.step();
		}
	}
	*blockMap(e) {
		let t = e.items[e.items.length - 1];
		switch (this.type) {
			case "newline":
				if (this.onKeyLine = !1, t.value) {
					let n = "end" in t.value ? t.value.end : void 0;
					(Array.isArray(n) ? n[n.length - 1] : void 0)?.type === "comment" ? n?.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
				} else t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
				return;
			case "space":
			case "comment":
				if (t.value) e.items.push({ start: [this.sourceToken] });
				else if (t.sep) t.sep.push(this.sourceToken);
				else {
					if (this.atIndentedComment(t.start, e.indent)) {
						let n = e.items[e.items.length - 2]?.value?.end;
						if (Array.isArray(n)) {
							ai(n, t.start), n.push(this.sourceToken), e.items.pop();
							return;
						}
					}
					t.start.push(this.sourceToken);
				}
				return;
		}
		if (this.indent >= e.indent) {
			let n = !this.onKeyLine && this.indent === e.indent, r = n && (t.sep || t.explicitKey) && this.type !== "seq-item-ind", i = [];
			if (r && t.sep && !t.value) {
				let n = [];
				for (let r = 0; r < t.sep.length; ++r) {
					let i = t.sep[r];
					switch (i.type) {
						case "newline":
							n.push(r);
							break;
						case "space": break;
						case "comment":
							i.indent > e.indent && (n.length = 0);
							break;
						default: n.length = 0;
					}
				}
				n.length >= 2 && (i = t.sep.splice(n[1]));
			}
			switch (this.type) {
				case "anchor":
				case "tag":
					r || t.value ? (i.push(this.sourceToken), e.items.push({ start: i }), this.onKeyLine = !0) : t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
					return;
				case "explicit-key-ind":
					!t.sep && !t.explicitKey ? (t.start.push(this.sourceToken), t.explicitKey = !0) : r || t.value ? (i.push(this.sourceToken), e.items.push({
						start: i,
						explicitKey: !0
					})) : this.stack.push({
						type: "block-map",
						offset: this.offset,
						indent: this.indent,
						items: [{
							start: [this.sourceToken],
							explicitKey: !0
						}]
					}), this.onKeyLine = !0;
					return;
				case "map-value-ind":
					if (t.explicitKey) {
						if (!t.sep) {
							if (Z(t.start, "newline")) Object.assign(t, {
								key: null,
								sep: [this.sourceToken]
							});
							else {
								let e = ii(t.start);
								this.stack.push({
									type: "block-map",
									offset: this.offset,
									indent: this.indent,
									items: [{
										start: e,
										key: null,
										sep: [this.sourceToken]
									}]
								});
							}
						} else if (t.value) e.items.push({
							start: [],
							key: null,
							sep: [this.sourceToken]
						});
						else if (Z(t.sep, "map-value-ind")) this.stack.push({
							type: "block-map",
							offset: this.offset,
							indent: this.indent,
							items: [{
								start: i,
								key: null,
								sep: [this.sourceToken]
							}]
						});
						else if (ni(t.key) && !Z(t.sep, "newline")) {
							let e = ii(t.start), n = t.key, r = t.sep;
							r.push(this.sourceToken), delete t.key, delete t.sep, this.stack.push({
								type: "block-map",
								offset: this.offset,
								indent: this.indent,
								items: [{
									start: e,
									key: n,
									sep: r
								}]
							});
						} else i.length > 0 ? t.sep = t.sep.concat(i, this.sourceToken) : t.sep.push(this.sourceToken);
					} else t.sep ? t.value || r ? e.items.push({
						start: i,
						key: null,
						sep: [this.sourceToken]
					}) : Z(t.sep, "map-value-ind") ? this.stack.push({
						type: "block-map",
						offset: this.offset,
						indent: this.indent,
						items: [{
							start: [],
							key: null,
							sep: [this.sourceToken]
						}]
					}) : t.sep.push(this.sourceToken) : Object.assign(t, {
						key: null,
						sep: [this.sourceToken]
					});
					this.onKeyLine = !0;
					return;
				case "alias":
				case "scalar":
				case "single-quoted-scalar":
				case "double-quoted-scalar": {
					let n = this.flowScalar(this.type);
					r || t.value ? (e.items.push({
						start: i,
						key: n,
						sep: []
					}), this.onKeyLine = !0) : t.sep ? this.stack.push(n) : (Object.assign(t, {
						key: n,
						sep: []
					}), this.onKeyLine = !0);
					return;
				}
				default: {
					let r = this.startBlockValue(e);
					if (r) {
						if (r.type === "block-seq") {
							if (!t.explicitKey && t.sep && !Z(t.sep, "newline")) {
								yield* this.pop({
									type: "error",
									offset: this.offset,
									message: "Unexpected block-seq-ind on same line with key",
									source: this.source
								});
								return;
							}
						} else n && e.items.push({ start: i });
						this.stack.push(r);
						return;
					}
				}
			}
		}
		yield* this.pop(), yield* this.step();
	}
	*blockSequence(e) {
		let t = e.items[e.items.length - 1];
		switch (this.type) {
			case "newline":
				if (t.value) {
					let n = "end" in t.value ? t.value.end : void 0;
					(Array.isArray(n) ? n[n.length - 1] : void 0)?.type === "comment" ? n?.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
				} else t.start.push(this.sourceToken);
				return;
			case "space":
			case "comment":
				if (t.value) e.items.push({ start: [this.sourceToken] });
				else {
					if (this.atIndentedComment(t.start, e.indent)) {
						let n = e.items[e.items.length - 2]?.value?.end;
						if (Array.isArray(n)) {
							ai(n, t.start), n.push(this.sourceToken), e.items.pop();
							return;
						}
					}
					t.start.push(this.sourceToken);
				}
				return;
			case "anchor":
			case "tag":
				if (t.value || this.indent <= e.indent) break;
				t.start.push(this.sourceToken);
				return;
			case "seq-item-ind":
				if (this.indent !== e.indent) break;
				t.value || Z(t.start, "seq-item-ind") ? e.items.push({ start: [this.sourceToken] }) : t.start.push(this.sourceToken);
				return;
		}
		if (this.indent > e.indent) {
			let t = this.startBlockValue(e);
			if (t) {
				this.stack.push(t);
				return;
			}
		}
		yield* this.pop(), yield* this.step();
	}
	*flowCollection(e) {
		let t = e.items[e.items.length - 1];
		if (this.type === "flow-error-end") {
			let e;
			do
				yield* this.pop(), e = this.peek(1);
			while (e?.type === "flow-collection");
		} else if (e.end.length === 0) {
			switch (this.type) {
				case "comma":
				case "explicit-key-ind":
					!t || t.sep ? e.items.push({ start: [this.sourceToken] }) : t.start.push(this.sourceToken);
					return;
				case "map-value-ind":
					!t || t.value ? e.items.push({
						start: [],
						key: null,
						sep: [this.sourceToken]
					}) : t.sep ? t.sep.push(this.sourceToken) : Object.assign(t, {
						key: null,
						sep: [this.sourceToken]
					});
					return;
				case "space":
				case "comment":
				case "newline":
				case "anchor":
				case "tag":
					!t || t.value ? e.items.push({ start: [this.sourceToken] }) : t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
					return;
				case "alias":
				case "scalar":
				case "single-quoted-scalar":
				case "double-quoted-scalar": {
					let n = this.flowScalar(this.type);
					!t || t.value ? e.items.push({
						start: [],
						key: n,
						sep: []
					}) : t.sep ? this.stack.push(n) : Object.assign(t, {
						key: n,
						sep: []
					});
					return;
				}
				case "flow-map-end":
				case "flow-seq-end":
					e.end.push(this.sourceToken);
					return;
			}
			let n = this.startBlockValue(e);
			/* istanbul ignore else should not happen */
			n ? this.stack.push(n) : (yield* this.pop(), yield* this.step());
		} else {
			let t = this.peek(2);
			if (t.type === "block-map" && (this.type === "map-value-ind" && t.indent === e.indent || this.type === "newline" && !t.items[t.items.length - 1].sep)) yield* this.pop(), yield* this.step();
			else if (this.type === "map-value-ind" && t.type !== "flow-collection") {
				let n = ii(ri(t));
				oi(e);
				let r = e.end.splice(1, e.end.length);
				r.push(this.sourceToken);
				let i = {
					type: "block-map",
					offset: e.offset,
					indent: e.indent,
					items: [{
						start: n,
						key: e,
						sep: r
					}]
				};
				this.onKeyLine = !0, this.stack[this.stack.length - 1] = i;
			} else yield* this.lineEnd(e);
		}
	}
	flowScalar(e) {
		if (this.onNewLine) {
			let e = this.source.indexOf("\n") + 1;
			for (; e !== 0;) this.onNewLine(this.offset + e), e = this.source.indexOf("\n", e) + 1;
		}
		return {
			type: e,
			offset: this.offset,
			indent: this.indent,
			source: this.source
		};
	}
	startBlockValue(e) {
		switch (this.type) {
			case "alias":
			case "scalar":
			case "single-quoted-scalar":
			case "double-quoted-scalar": return this.flowScalar(this.type);
			case "block-scalar-header": return {
				type: "block-scalar",
				offset: this.offset,
				indent: this.indent,
				props: [this.sourceToken],
				source: ""
			};
			case "flow-map-start":
			case "flow-seq-start": return {
				type: "flow-collection",
				offset: this.offset,
				indent: this.indent,
				start: this.sourceToken,
				items: [],
				end: []
			};
			case "seq-item-ind": return {
				type: "block-seq",
				offset: this.offset,
				indent: this.indent,
				items: [{ start: [this.sourceToken] }]
			};
			case "explicit-key-ind": {
				this.onKeyLine = !0;
				let t = ii(ri(e));
				return t.push(this.sourceToken), {
					type: "block-map",
					offset: this.offset,
					indent: this.indent,
					items: [{
						start: t,
						explicitKey: !0
					}]
				};
			}
			case "map-value-ind": {
				this.onKeyLine = !0;
				let t = ii(ri(e));
				return {
					type: "block-map",
					offset: this.offset,
					indent: this.indent,
					items: [{
						start: t,
						key: null,
						sep: [this.sourceToken]
					}]
				};
			}
		}
		return null;
	}
	atIndentedComment(e, t) {
		return this.type !== "comment" || this.indent <= t ? !1 : e.every((e) => e.type === "newline" || e.type === "space");
	}
	*documentEnd(e) {
		this.type !== "doc-mode" && (e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop()));
	}
	*lineEnd(e) {
		switch (this.type) {
			case "comma":
			case "doc-start":
			case "doc-end":
			case "flow-seq-end":
			case "flow-map-end":
			case "map-value-ind":
				yield* this.pop(), yield* this.step();
				break;
			case "newline": this.onKeyLine = !1;
			default: e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop());
		}
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/public-api.js
function ci(e) {
	let t = e.prettyErrors !== !1;
	return {
		lineCounter: e.lineCounter || t && new ei() || null,
		prettyErrors: t
	};
}
function li(e, t = {}) {
	let { lineCounter: n, prettyErrors: r } = ci(t), i = new si(n?.addNewLine), a = new Vr(t), o = null;
	for (let t of a.compose(i.parse(e), !0, e.length)) if (!o) o = t;
	else if (o.options.logLevel !== "silent") {
		o.errors.push(new rr(t.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
		break;
	}
	return r && n && (o.errors.forEach(ar(e, n)), o.warnings.forEach(ar(e, n))), o;
}
function ui(e, t, n) {
	let r;
	typeof t == "function" ? r = t : n === void 0 && t && typeof t == "object" && (n = t);
	let i = li(e, n);
	if (!i) return null;
	if (i.warnings.forEach((e) => Bt(i.options.logLevel, e)), i.errors.length > 0) {
		if (i.options.logLevel !== "silent") throw i.errors[0];
		i.errors = [];
	}
	return i.toJS(Object.assign({ reviver: r }, n));
}
//#endregion
//#region \0@oxc-project+runtime@0.150.0/helpers/esm/decorate.js
function Q(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region frontend/haos-ai-panel.ts
var di = [
	"Already handled",
	"Wrong entity or evidence",
	"Not useful for this home",
	"Too intrusive",
	"Maybe later"
], fi = [
	"weekday.monday",
	"weekday.tuesday",
	"weekday.wednesday",
	"weekday.thursday",
	"weekday.friday",
	"weekday.saturday",
	"weekday.sunday"
], pi = {
	"weekday.monday": "Monday",
	"weekday.tuesday": "Tuesday",
	"weekday.wednesday": "Wednesday",
	"weekday.thursday": "Thursday",
	"weekday.friday": "Friday",
	"weekday.saturday": "Saturday",
	"weekday.sunday": "Sunday",
	"budget.title": "Monthly token budget",
	"budget.description": "Cap what HAOS AI may spend with your provider each calendar month.",
	"budget.field": "Token budget per month",
	"budget.unlimited": "0 means no cap",
	"budget.used": "Used this month",
	"budget.remaining": "Remaining",
	"budget.requests": "Provider requests",
	"budget.no_cap": "No cap set",
	"budget.warning": "This month's token budget is nearly spent. Scans and chat stop when it runs out.",
	"budget.exceeded": "This month's token budget is spent. Scans and chat are paused until you raise it.",
	"evidence.unverified": "Not found in this installation",
	"scan_profile.title": "Separate model for scans",
	"scan_profile.description": "Scans are long and tool-heavy. Run them on a cheaper model and keep chat on a strong one.",
	"scan_profile.enable": "Use a separate provider for scans",
	"scan_profile.enable_help": "When off, scans and chat both use the connection above.",
	"scan_profile.provider": "Scan provider",
	"scan_profile.model": "Scan model",
	"scan_profile.api_key": "Scan API key",
	"scan_profile.base_url": "Scan API base URL",
	"scan_profile.active": "Scans run on this profile",
	"scan_profile.inactive": "Scans use the main connection",
	"ignore.entities": "Ignored entities",
	"ignore.entities_help": "Search by name or entity ID. You can also paste comma-, space-, or line-separated IDs.",
	"ignore.domains": "Ignored domains",
	"ignore.domains_help": "Every entity in these domains is withheld before the request is built.",
	"ignore.areas": "Ignored areas",
	"ignore.areas_help": "Entities and devices in these areas are never sent, including their history.",
	"ignore.labels": "Ignored labels",
	"ignore.labels_help": "Anything carrying one of these labels is withheld from every request.",
	"ignore.enforced": "These exclusions are applied locally before anything is sent. They are not requests to the model.",
	"ignore.not_found": "Not currently found",
	"ignore.stop": "Stop ignoring",
	"applied.title": "Applied changes",
	"applied.description": "What happened to the changes you approved, checked automatically after a few days.",
	"applied.empty": "No approved changes yet.",
	"applied.outcome.pending": "Checking soon",
	"applied.outcome.kept": "Kept",
	"applied.outcome.disabled": "Turned off",
	"applied.outcome.reverted": "Reverted",
	"applied.outcome.unknown": "Unknown",
	"diff.title": "Changes to this automation",
	"diff.current": "Currently in Home Assistant",
	"diff.proposed": "Proposed",
	"diff.identical": "The draft matches the stored automation exactly.",
	"diff.unavailable": "The stored automation could not be read for comparison.",
	"diff.loading": "Loading the stored automation…",
	"action.cancel": "Cancel"
};
function mi(e, t) {
	let n = `component.haos_ai.common.${t.replaceAll(".", "_")}`, r = e?.localize?.(n);
	return r && r !== n ? r : pi[t] ?? t;
}
function hi(e, t) {
	let n = e.replace(/\s+$/, "").split("\n"), r = t.replace(/\s+$/, "").split("\n"), i = Array.from({ length: n.length + 1 }, () => Array(r.length + 1).fill(0));
	for (let e = n.length - 1; e >= 0; e--) for (let t = r.length - 1; t >= 0; t--) i[e][t] = n[e] === r[t] ? i[e + 1][t + 1] + 1 : Math.max(i[e + 1][t], i[e][t + 1]);
	let a = [], o = 0, s = 0;
	for (; o < n.length && s < r.length;) n[o] === r[s] ? (a.push({
		type: "same",
		text: n[o]
	}), o++, s++) : i[o + 1][s] >= i[o][s + 1] ? (a.push({
		type: "removed",
		text: n[o]
	}), o++) : (a.push({
		type: "added",
		text: r[s]
	}), s++);
	for (; o < n.length; o++) a.push({
		type: "removed",
		text: n[o]
	});
	for (; s < r.length; s++) a.push({
		type: "added",
		text: r[s]
	});
	return a;
}
var $ = class extends Ne {
	constructor(...e) {
		super(...e), this.tab = "inbox", this.filter = "new", this.loading = !0, this.busy = !1, this.dialogPending = !1, this.entityHighlight = -1, this.error = "", this.chat = [], this.chatText = "", this.threadId = "main", this.threads = [], this.selectedGoals = [], this.ignoredEntities = [], this.ignoredEntityQuery = "", this.ignoredEntityError = "", this.ignoredDomains = [], this.ignoredAreas = [], this.ignoredLabels = [], this.ignoredDomainQuery = "", this.ignoredAreaQuery = "", this.ignoredLabelQuery = "", this.monthlyTokenBudget = 0, this.advisorMode = "balanced", this.scanDepth = "standard", this.automationComplexity = "normal", this.fixExistingFirst = !0, this.avoidNewHardware = !0, this.changePermissions = {
			create_automations: !1,
			update_automations: !1,
			remove_entities: !1,
			remove_devices: !1
		}, this.quietStart = "22:00", this.quietEnd = "07:00", this.providerDraft = "", this.modelDraft = "", this.baseUrlDraft = "", this.apiKeyDraft = "", this.showConnectionAdvanced = !1, this.historyDays = 30, this.includeExactLocation = !1, this.schedule = "manual", this.scheduleTime = "03:00", this.scheduleWeekday = 0, this.notifyNewSuggestions = !0, this.settingsNotice = "", this.copied = !1, this.draftYaml = "", this.draftError = "", this.dialog = null, this.feedbackReason = "", this.feedbackNote = "", this.renameText = "", this.scanProfileEnabled = !1, this.scanProviderDraft = "", this.scanModelDraft = "", this.scanBaseUrlDraft = "", this.scanApiKeyDraft = "", this.diffError = "", this.diffLoading = !1, this.started = !1, this.overviewRequest = 0, this.draftDirty = !1;
	}
	connectedCallback() {
		super.connectedCallback(), this.start();
	}
	disconnectedCallback() {
		this.unsubscribeProgress?.(), this.progressTimer && window.clearTimeout(this.progressTimer), super.disconnectedCallback();
	}
	willUpdate(e) {
		if (e.has("hass") && this.start(), e.has("selectedId")) {
			let e = this.selected?.automation?.yaml ?? "";
			this.draftYaml = e, this.draftValidation = this.selected?.automation?.validation, this.draftError = "", this.draftDirty = !1;
		}
	}
	start() {
		this.hass && !this.started && (this.started = !0, this.subscribeToProgress(), this.loadOverview());
	}
	async subscribeToProgress() {
		this.hass?.connection.subscribeEvents && (this.unsubscribeProgress = await this.hass.connection.subscribeEvents((e) => {
			this.progress = e.data, this.busy = e.data.stage !== "complete", e.data.stage === "complete" && (this.progressTimer && window.clearTimeout(this.progressTimer), this.progressTimer = window.setTimeout(() => {
				this.progress = void 0, this.busy = !1;
			}, 1400));
		}, "haos_ai_progress"));
	}
	async call(e, t = {}) {
		if (!this.hass) throw Error("Home Assistant is not ready");
		return this.hass.connection.sendMessagePromise({
			type: e,
			...t
		});
	}
	t(e) {
		return mi(this.hass, e);
	}
	describeError(e) {
		return e instanceof Error ? e.message : typeof e == "object" && e && "message" in e ? String(e.message) : "Something went wrong. Check Home Assistant logs for details.";
	}
	async loadOverview() {
		if (!this.hass) return;
		let e = this.overview !== void 0, t = ++this.overviewRequest;
		e || (this.loading = !0);
		try {
			let n = await this.call("haos_ai/overview");
			if (t !== this.overviewRequest) return;
			this.overview = n, e || this.hydrateSettings(n), this.syncDraft(n), this.threads = Array.isArray(n.threads) ? n.threads : [], this.selectedId && !n.suggestions.some((e) => e.id === this.selectedId) && (this.selectedId = void 0, this.filter !== "all" && !n.suggestions.some((e) => e.status === this.filter) && (this.filter = "all")), this.error = "";
		} catch (e) {
			this.error = this.describeError(e);
		} finally {
			e || (this.loading = !1);
		}
	}
	syncDraft(e) {
		if (!this.selectedId || this.draftDirty) return;
		let t = e.suggestions.find((e) => e.id === this.selectedId);
		t?.automation && (this.draftYaml = t.automation.yaml ?? "", this.draftValidation = t.automation.validation, this.draftError = "");
	}
	hydrateSettings(e) {
		let t = e.preferences;
		this.selectedGoals = [...t.goals ?? []], this.ignoredEntities = [...t.ignored_entities ?? []], this.ignoredDomains = [...t.ignored_domains ?? []], this.ignoredAreas = [...t.ignored_areas ?? []], this.ignoredLabels = [...t.ignored_labels ?? []], this.monthlyTokenBudget = t.monthly_token_budget ?? 0, this.advisorMode = t.advisor_mode ?? "balanced", this.scanDepth = t.scan_depth ?? "standard", this.automationComplexity = t.automation_complexity ?? "normal", this.fixExistingFirst = t.fix_existing_first !== !1, this.avoidNewHardware = t.avoid_new_hardware !== !1, this.changePermissions = {
			create_automations: t.change_permissions?.create_automations === !0,
			update_automations: t.change_permissions?.update_automations === !0,
			remove_entities: t.change_permissions?.remove_entities === !0,
			remove_devices: t.change_permissions?.remove_devices === !0
		}, this.quietStart = t.quiet_hours?.start ?? "22:00", this.quietEnd = t.quiet_hours?.end ?? "07:00", this.providerDraft = this.resolveProvider(e), this.modelDraft = e.model, this.baseUrlDraft = e.base_url, this.apiKeyDraft = "";
		let n = e.scan_profile;
		this.scanProfileEnabled = n?.enabled === !0;
		let r = e.provider_options[0]?.id ?? this.providerDraft;
		this.scanProviderDraft = n?.provider ?? r, this.scanModelDraft = n?.model ?? "", this.scanBaseUrlDraft = n?.base_url ?? "", this.scanApiKeyDraft = "", this.historyDays = e.options.history_days ?? 30, this.includeExactLocation = e.options.include_exact_location === !0, this.schedule = e.options.schedule ?? "manual", this.scheduleTime = (e.options.schedule_time ?? "03:00:00").slice(0, 5), this.scheduleWeekday = e.options.schedule_weekday ?? 0, this.notifyNewSuggestions = e.options.notify_new_suggestions !== !1;
	}
	resolveProvider(e) {
		let t = e.base_url.toLocaleLowerCase(), n = e.model.toLocaleLowerCase(), r = e.provider_options.find((e) => e.id !== "openai_compatible" && e.default_base_url && t.startsWith(e.default_base_url.toLocaleLowerCase()) ? !0 : e.id === "deepseek" && n.startsWith("deepseek"));
		return r ? r.id : e.provider_options.find((t) => t.id === e.provider)?.id ?? e.provider_options[0]?.id ?? "openai";
	}
	get filteredSuggestions() {
		let e = this.overview?.suggestions ?? [];
		return this.filter === "all" ? e : e.filter((e) => e.status === this.filter);
	}
	get selected() {
		return this.overview?.suggestions.find((e) => e.id === this.selectedId);
	}
	async openPreview() {
		this.busy = !0, this.error = "";
		try {
			this.preview = await this.call("haos_ai/context_preview");
		} catch (e) {
			this.error = this.describeError(e);
		} finally {
			this.busy = !1;
		}
	}
	async runScan() {
		this.preview = void 0, this.busy = !0, this.progress = {
			stage: "context",
			progress: .05
		}, this.error = "";
		try {
			await this.call("haos_ai/scan", { confirm_context: !0 }), await this.loadOverview(), this.filter = "new", this.tab === "activity" && await this.loadActivity();
		} catch (e) {
			this.error = this.describeError(e), this.progress = void 0;
		} finally {
			this.busy = !1;
		}
	}
	async updateSuggestion(e, t, n) {
		this.busy = !0;
		try {
			await this.call("haos_ai/suggestion/update", {
				suggestion_id: e,
				status: t,
				...n ? { reason: n } : {}
			}), await this.loadOverview(), t === "dismissed" && (this.selectedId = void 0);
		} catch (e) {
			this.error = this.describeError(e);
		} finally {
			this.busy = !1;
		}
	}
	openFeedback(e) {
		this.selectedId = e.id, this.feedbackReason = "", this.feedbackNote = "", this.dialog = "feedback";
	}
	async submitFeedback() {
		let e = this.selected;
		if (!e || !this.feedbackReason) return;
		let t = [this.feedbackReason, this.feedbackNote.trim()].filter(Boolean).join(": ");
		this.dialog = null, await this.updateSuggestion(e.id, "dismissed", t);
	}
	async loadThreads() {
		try {
			let e = await this.call("haos_ai/chat/threads");
			this.threads = Array.isArray(e) ? e : [];
		} catch (e) {
			this.error = this.describeError(e);
		}
	}
	async loadThread() {
		try {
			let e = await this.call("haos_ai/chat/thread", { thread_id: this.threadId });
			this.chat = Array.isArray(e) ? e : [];
		} catch (e) {
			this.error = this.describeError(e);
		}
	}
	async selectThread(e) {
		this.threadId = e, this.chat = [], await this.loadThread();
	}
	newThread() {
		this.threadId = crypto.randomUUID().replaceAll("-", "").slice(0, 40), this.chat = [], this.chatText = "";
	}
	openRenameThread() {
		let e = this.threads.find((e) => e.id === this.threadId);
		this.renameText = e?.title ?? "Conversation", this.dialog = "rename";
	}
	async renameThread() {
		let e = this.renameText.trim();
		if (e) {
			this.dialog = null;
			try {
				await this.call("haos_ai/chat/thread/rename", {
					thread_id: this.threadId,
					title: e
				}), await this.loadThreads();
			} catch (e) {
				this.error = this.describeError(e);
			}
		}
	}
	async deleteThread() {
		this.dialogPending = !0;
		try {
			await this.call("haos_ai/chat/thread/delete", { thread_id: this.threadId }), this.newThread(), await this.loadThreads();
		} catch (e) {
			this.error = this.describeError(e);
		} finally {
			this.dialogPending = !1, this.dialog = null;
		}
	}
	async sendChat() {
		let e = this.chatText.trim();
		if (e && !this.busy) {
			this.chatText = "", this.chat = [...this.chat, {
				id: `pending-${Date.now()}`,
				role: "user",
				content: e,
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			}], this.busy = !0, this.progress = { stage: "provider" }, this.error = "";
			try {
				let t = await this.call("haos_ai/chat", {
					thread_id: this.threadId,
					text: e
				});
				this.chat = [...this.chat, t.message], await this.loadThreads();
			} catch (e) {
				this.error = this.describeError(e), await this.loadThread();
			} finally {
				this.busy = !1, this.progress = void 0;
			}
		}
	}
	async loadActivity() {
		try {
			this.activity = await this.call("haos_ai/activity");
		} catch (e) {
			this.error = this.describeError(e);
		}
	}
	async openReceipt(e) {
		this.selectedReceiptId = e, this.receipt = void 0;
		try {
			this.receipt = await this.call("haos_ai/privacy_receipt", { receipt_id: e });
		} catch (e) {
			this.error = this.describeError(e);
		}
	}
	async savePreferences() {
		if (this.overview) {
			this.busy = !0, this.settingsNotice = "";
			try {
				await this.call("haos_ai/preferences/update", { preferences: {
					...this.overview.preferences,
					goals: this.selectedGoals,
					ignored_entities: this.ignoredEntities,
					ignored_domains: this.ignoredDomains,
					ignored_areas: this.ignoredAreas,
					ignored_labels: this.ignoredLabels,
					monthly_token_budget: this.monthlyTokenBudget,
					advisor_mode: this.advisorMode,
					scan_depth: this.scanDepth,
					automation_complexity: this.automationComplexity,
					fix_existing_first: this.fixExistingFirst,
					avoid_new_hardware: this.avoidNewHardware,
					change_permissions: this.changePermissions,
					quiet_hours: {
						start: this.quietStart,
						end: this.quietEnd
					}
				} }), await this.loadOverview(), this.settingsNotice = "Advisor preferences saved.";
			} catch (e) {
				this.error = this.describeError(e);
			} finally {
				this.busy = !1;
			}
		}
	}
	connectionOptions() {
		return {
			history_days: this.historyDays,
			include_exact_location: this.includeExactLocation,
			schedule: this.schedule,
			schedule_time: `${this.scheduleTime}:00`,
			schedule_weekday: this.scheduleWeekday,
			notify_new_suggestions: this.notifyNewSuggestions
		};
	}
	async saveConnection() {
		if (this.overview) {
			this.busy = !0, this.settingsNotice = "";
			try {
				await this.call("haos_ai/config/update", {
					connection: {
						provider: this.providerDraft,
						model: this.modelDraft.trim(),
						base_url: this.baseUrlDraft.trim(),
						api_key: this.apiKeyDraft
					},
					scan_profile: this.scanProfileEnabled ? {
						enabled: !0,
						provider: this.scanProviderDraft,
						model: this.scanModelDraft.trim(),
						base_url: this.scanBaseUrlDraft.trim(),
						api_key: this.scanApiKeyDraft
					} : { enabled: !1 },
					options: this.connectionOptions()
				}), this.apiKeyDraft = "", this.scanApiKeyDraft = "", this.settingsNotice = "Connection verified and saved. HAOS AI is reloading…", window.setTimeout(() => void this.loadOverview(), 1600);
			} catch (e) {
				this.error = this.describeError(e);
			} finally {
				this.busy = !1;
			}
		}
	}
	async saveOptions() {
		this.busy = !0, this.settingsNotice = "";
		try {
			await this.call("haos_ai/options/update", { options: this.connectionOptions() }), this.settingsNotice = "Privacy and schedule settings saved.", window.setTimeout(() => void this.loadOverview(), 1200);
		} catch (e) {
			this.error = this.describeError(e);
		} finally {
			this.busy = !1;
		}
	}
	toggleGoal(e) {
		this.selectedGoals = this.selectedGoals.includes(e) ? this.selectedGoals.filter((t) => t !== e) : [...this.selectedGoals, e], this.settingsNotice = "";
	}
	providerChanged(e) {
		let t = this.overview?.provider_options.find((e) => e.id === this.providerDraft), n = this.overview?.provider_options.find((t) => t.id === e), r = !this.modelDraft || this.modelDraft === t?.default_model, i = !this.baseUrlDraft || this.baseUrlDraft === t?.default_base_url;
		this.providerDraft = e, n && r && (this.modelDraft = n.default_model), n && i && (this.baseUrlDraft = n.default_base_url), this.apiKeyDraft = "", this.settingsNotice = "";
	}
	openClearInbox() {
		this.filteredSuggestions.length !== 0 && (this.dialog = "clear-inbox");
	}
	async clearInbox() {
		let e = this.filter === "all" ? void 0 : this.filter;
		this.dialog = null, this.busy = !0;
		try {
			await this.call("haos_ai/suggestions/clear", { ...e ? { status: e } : {} }), this.selectedId = void 0, await this.loadOverview();
		} catch (e) {
			this.error = this.describeError(e);
		} finally {
			this.busy = !1;
		}
	}
	changeFor(e) {
		if (e.automation) return {
			kind: e.automation.target_id ? "update_automation" : "create_automation",
			suggestionId: e.id,
			targetId: e.automation.target_id ?? "new automation",
			label: e.title
		};
		if (e.operation) return {
			kind: e.operation.type,
			suggestionId: e.id,
			targetId: e.operation.target_id,
			label: e.operation.label,
			configEntryId: e.operation.config_entry_id ?? void 0
		};
	}
	canApply(e) {
		return {
			create_automation: this.changePermissions.create_automations,
			update_automation: this.changePermissions.update_automations,
			remove_entity: this.changePermissions.remove_entities,
			remove_device: this.changePermissions.remove_devices
		}[e.kind];
	}
	openChangeApproval(e) {
		let t = this.changeFor(e);
		t && this.canApply(t) && (this.pendingChange = t, this.diffLines = void 0, this.diffError = "", this.dialog = "approve-change", t.kind === "update_automation" && this.loadDiff(t.targetId));
	}
	async loadDiff(e) {
		this.diffLoading = !0, this.diffError = "";
		try {
			let t = await this.call("haos_ai/automation/current", { automation_id: e });
			if (!t.found) {
				this.diffError = this.t("diff.unavailable");
				return;
			}
			this.diffLines = hi(t.yaml, this.draftYaml);
		} catch (e) {
			this.diffError = this.describeError(e);
		} finally {
			this.diffLoading = !1;
		}
	}
	async approveChange() {
		let e = this.pendingChange;
		if (!e || !this.canApply(e) || !this.hass) return;
		let t = e.kind === "create_automation" || e.kind === "update_automation";
		this.dialogPending = !0, this.busy = !0, this.error = "";
		try {
			let n;
			if (t) {
				if (!this.draftValidation?.valid) throw Error("Validate the current automation draft before approval.");
				if (n = ui(this.draftYaml), !n || typeof n != "object" || Array.isArray(n)) throw Error("Automation YAML must contain one object.");
			} else if (e.kind === "remove_device" && !e.configEntryId) throw Error("The device's integration reference is missing.");
			await this.call("haos_ai/change/apply", {
				suggestion_id: e.suggestionId,
				confirm: !0,
				operation: e.kind,
				...t ? { config: n } : {}
			}), this.pendingChange = void 0, this.diffLines = void 0, this.draftDirty = !1, this.dialog = null, this.settingsNotice = "Approved change applied by Home Assistant.", await this.loadOverview(), this.tab === "activity" && await this.loadActivity();
		} catch (e) {
			this.error = this.describeError(e), this.dialog = null;
		} finally {
			this.busy = !1, this.dialogPending = !1;
		}
	}
	get matchingEntities() {
		let e = this.ignoredEntityQuery.trim().toLocaleLowerCase();
		return e ? Object.values(this.hass?.states ?? {}).filter((e) => !this.ignoredEntities.includes(e.entity_id)).filter((t) => {
			let n = t.attributes.friendly_name ?? "";
			return `${t.entity_id} ${n}`.toLocaleLowerCase().includes(e);
		}).slice(0, 8) : [];
	}
	addIgnoredEntities(e) {
		let t = [], n = [];
		for (let r of e) {
			let e = r.trim().replace(/^['"]|['"]$/g, "");
			e && (/^[a-z0-9_]+\.[a-z0-9_]+$/.test(e) ? t.push(e) : n.push(e));
		}
		this.ignoredEntities = [...this.ignoredEntities, ...t.filter((e) => !this.ignoredEntities.includes(e))], this.ignoredEntityError = n.length ? `Could not add: ${n.slice(0, 3).join(", ")}` : "", this.ignoredEntityQuery = "", this.settingsNotice = "";
	}
	get availableDomains() {
		let e = /* @__PURE__ */ new Set();
		for (let t of Object.keys(this.hass?.states ?? {})) {
			let n = t.split(".", 1)[0];
			n && !this.ignoredDomains.includes(n) && e.add(n);
		}
		return [...e].sort();
	}
	get availableAreas() {
		return Object.values(this.hass?.areas ?? {}).filter((e) => !this.ignoredAreas.includes(e.area_id)).sort((e, t) => e.name.localeCompare(t.name));
	}
	get availableLabels() {
		let e = /* @__PURE__ */ new Set();
		for (let t of Object.values(this.hass?.entities ?? {})) for (let n of t.labels ?? []) this.ignoredLabels.includes(n) || e.add(n);
		return [...e].sort();
	}
	areaName(e) {
		return this.hass?.areas?.[e]?.name ?? e;
	}
	addIgnoredScope(e, t) {
		let n = t.trim();
		n && (e === "domains" ? (this.ignoredDomains.includes(n) || (this.ignoredDomains = [...this.ignoredDomains, n]), this.ignoredDomainQuery = "") : e === "areas" ? (this.ignoredAreas.includes(n) || (this.ignoredAreas = [...this.ignoredAreas, n]), this.ignoredAreaQuery = "") : (this.ignoredLabels.includes(n) || (this.ignoredLabels = [...this.ignoredLabels, n]), this.ignoredLabelQuery = ""), this.settingsNotice = "");
	}
	removeIgnoredScope(e, t) {
		e === "domains" ? this.ignoredDomains = this.ignoredDomains.filter((e) => e !== t) : e === "areas" ? this.ignoredAreas = this.ignoredAreas.filter((e) => e !== t) : this.ignoredLabels = this.ignoredLabels.filter((e) => e !== t), this.settingsNotice = "";
	}
	handleEntityKeydown(e) {
		let t = this.matchingEntities;
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			if (!t.length) return;
			e.preventDefault();
			let n = e.key === "ArrowDown" ? 1 : -1, r = this.entityHighlight + n;
			this.entityHighlight = (r + t.length) % t.length;
			return;
		}
		if (e.key === "Escape") {
			this.entityHighlight = -1;
			return;
		}
		if (e.key !== "Enter" && e.key !== ",") return;
		e.preventDefault();
		let n = this.entityHighlight >= 0 ? t[this.entityHighlight] : t[0];
		this.addIgnoredEntities([n?.entity_id ?? this.ignoredEntityQuery.trim()]);
	}
	handleEntityPaste(e) {
		let t = (e.clipboardData?.getData("text") ?? "").split(/[\s,;]+/).filter(Boolean);
		t.some((e) => e.includes(".")) && (e.preventDefault(), this.addIgnoredEntities(t));
	}
	async validateDraft() {
		this.draftError = "";
		let e;
		try {
			e = ui(this.draftYaml);
		} catch (e) {
			this.draftError = `YAML syntax: ${this.describeError(e)}`;
			return;
		}
		if (!e || typeof e != "object" || Array.isArray(e)) {
			this.draftError = "Automation YAML must contain one object.";
			return;
		}
		this.busy = !0;
		try {
			let t = await this.call("haos_ai/automation/validate", { config: e });
			this.draftYaml = t.yaml, this.draftValidation = t.validation, this.draftDirty = !0;
		} catch (e) {
			this.draftError = this.describeError(e);
		} finally {
			this.busy = !1;
		}
	}
	async copyYaml(e = this.draftYaml) {
		await navigator.clipboard.writeText(e), this.copied = !0, window.setTimeout(() => this.copied = !1, 1600);
	}
	downloadYaml(e) {
		if (!this.draftYaml) return;
		let t = new Blob([this.draftYaml], { type: "application/x-yaml" }), n = URL.createObjectURL(t), r = document.createElement("a");
		r.href = n, r.download = `${e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "automation"}.yaml`, r.click(), URL.revokeObjectURL(n);
	}
	async copyAndOpenEditor() {
		await this.copyYaml(), this.navigate("/config/automation/new");
	}
	reviseInChat(e) {
		this.newThread(), this.chatText = `Help me revise this proposed automation. Keep it read only, explain the changes, and return one complete Home Assistant YAML block.\n\nTitle: ${e.title}\n\nCurrent YAML:\n\`\`\`yaml\n${this.draftYaml}\n\`\`\``, this.changeTab("chat");
	}
	extractYaml(e) {
		return e.match(/```(?:yaml|yml)?\s*\n([\s\S]*?)```/i)?.[1].trim();
	}
	useChatYaml(e) {
		let t = this.extractYaml(e);
		t && this.selected && (this.draftYaml = t, this.draftValidation = void 0, this.draftError = "", this.draftDirty = !0, this.tab = "inbox");
	}
	navigate(e) {
		window.history.pushState(null, "", e), window.dispatchEvent(new Event("location-changed"));
	}
	evidencePath(e) {
		let t = e.source_id;
		if (e.source_type === "history" && t.includes(".")) return `/history?entity_id=${encodeURIComponent(t)}`;
		if ([
			"entity",
			"registry",
			"automation"
		].includes(e.source_type) && t.includes(".")) return `/config/entities/entity/${encodeURIComponent(t)}`;
		if (e.source_type === "integration" && t) return `/config/integrations/integration/${encodeURIComponent(t)}`;
	}
	firstUpdated() {
		this.tab === "chat" && this.loadThread();
	}
	changeTab(e) {
		this.tab = e, e === "chat" && (this.loadThreads(), this.chat.length === 0 && this.loadThread()), e === "activity" && this.loadActivity();
	}
	render() {
		return D`
      <div class="shell">
        ${this.renderHeader()}
        ${this.progress ? this.renderProgress() : O}
        ${this.renderBudgetBanner()}
        <main>
          ${this.error ? this.renderAlert() : O}
          ${this.loading ? this.renderLoading() : this.tab === "inbox" ? this.renderInbox() : this.tab === "chat" ? this.renderChat() : this.tab === "activity" ? this.renderActivity() : this.renderSettings()}
        </main>
      </div>
      ${this.preview ? this.renderPreviewDialog() : O}
      ${this.dialog ? this.renderActionDialog() : O}
    `;
	}
	renderHeader() {
		return D`
      <header class="app-header">
        <div class="title-lockup">
          ${this.renderLogo()}
          <h1>HAOS AI</h1>
        </div>
        <nav class="tabs" aria-label="HAOS AI sections" role="tablist">
          ${this.navButton("inbox", "Inbox", this.overview?.counts.new)}
          ${this.navButton("chat", "Chat")}
          ${this.navButton("activity", "Activity")}
          ${this.navButton("settings", "Settings")}
        </nav>
        <ha-button
          class="scan-action"
          appearance="accent"
          ?disabled=${this.busy || this.loading}
          @click=${this.openPreview}
        >
          <ha-icon icon="mdi:creation-outline" slot="start"></ha-icon>
          Run scan
        </ha-button>
      </header>
    `;
	}
	get budget() {
		return this.activity?.budget ?? this.overview?.budget;
	}
	renderBudgetBanner() {
		let e = this.budget;
		return !e?.budget || !e.warning && !e.exceeded ? O : D`
      <div
        class="budget-banner ${e.exceeded ? "exceeded" : "warning"}"
        role=${e.exceeded ? "alert" : "status"}
      >
        <ha-icon
          icon=${e.exceeded ? "mdi:alert-octagon-outline" : "mdi:gauge-low"}
        ></ha-icon>
        <span>
          ${e.exceeded ? this.t("budget.exceeded") : this.t("budget.warning")}
          <small>
            ${e.total_tokens.toLocaleString()} /
            ${e.budget.toLocaleString()}
          </small>
        </span>
        <ha-button appearance="plain" @click=${() => this.changeTab("settings")}>
          ${this.t("budget.title")}
        </ha-button>
      </div>
    `;
	}
	renderLogo() {
		return D`
      <span class="logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img">
          <path class="logo-house" d="M3.5 10.1 12 3.5l8.5 6.6v9.1H3.5z" />
          <path
            class="logo-spark"
            d="m12 7.25.85 2.35 2.4.9-2.4.9L12 13.75l-.85-2.35-2.4-.9 2.4-.9z"
          />
          <circle cx="7.2" cy="16.6" r="1" />
          <circle cx="16.8" cy="16.6" r="1" />
          <path class="logo-link" d="M8.2 16.6h7.6" />
        </svg>
      </span>
    `;
	}
	navButton(e, t, n) {
		return D`
      <button
        role="tab"
        class=${this.tab === e ? "active" : ""}
        aria-selected=${this.tab === e ? "true" : "false"}
        @click=${() => this.changeTab(e)}
      >
        ${t}${n ? D`<span class="count">${n}</span>` : O}
      </button>
    `;
	}
	renderProgress() {
		let e = Math.max(0, Math.min(1, this.progress?.progress ?? .5));
		return D`
      <div class="progress-panel" role="status" aria-live="polite">
        <div class="progress-copy">
          <strong>${this.progressLabel(this.progress)}</strong>
          <span>${this.progressDetail(this.progress)}</span>
        </div>
        <div
          class="progress-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${Math.round(e * 100)}
        >
          <span style=${`--progress: ${e * 100}%`}></span>
        </div>
      </div>
    `;
	}
	progressLabel(e) {
		return {
			context: "Collecting local context",
			provider: "Asking the advisor",
			tool: "Inspecting your setup",
			validate: "Validating suggestions",
			complete: "Advisor request complete"
		}[e.stage];
	}
	progressDetail(e) {
		return e.tool ? e.tool.replaceAll("_", " ") : e.stage === "provider" ? "This can take a few minutes." : e.stage === "complete" ? "The local inbox is up to date." : "Read-only operation";
	}
	renderAlert() {
		return D`
      <div class="alert" role="alert">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
        <span>${this.error}</span>
        <ha-icon-button
          label="Dismiss error"
          @click=${() => this.error = ""}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </ha-icon-button>
      </div>
    `;
	}
	renderLoading() {
		return D`
      <section class="loading-state" aria-busy="true">
        ${this.renderLogo()}
        <p>Loading HAOS AI…</p>
      </section>
    `;
	}
	renderInbox() {
		let e = this.filteredSuggestions;
		return D`
      <section class="inbox-layout ${this.selected ? "has-selection" : ""}">
        <aside class="list-pane">
          <div class="pane-heading">
            <div>
              <h2>Suggestions</h2>
              <p>Nothing is applied automatically.</p>
            </div>
            <div class="inbox-heading-actions">
              <span class="total">${e.length}</span>
              <ha-icon-button
                label=${this.filter === "all" ? "Clear entire inbox" : `Clear ${this.filter} suggestions`}
                ?disabled=${this.busy || e.length === 0}
                @click=${this.openClearInbox}
              >
                <ha-icon icon="mdi:inbox-remove-outline"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div class="filters" aria-label="Suggestion filters">
            ${[
			"new",
			"saved",
			"dismissed",
			"all"
		].map((e) => D`
                <button
                  class=${this.filter === e ? "active" : ""}
                  aria-pressed=${this.filter === e ? "true" : "false"}
                  @click=${() => {
			this.filter = e, this.selectedId = void 0;
		}}
                >
                  ${e}
                  <span>
                    ${e === "all" ? this.overview?.suggestions.length ?? 0 : this.overview?.counts[e] ?? 0}
                  </span>
                </button>
              `)}
          </div>
          <div class="suggestion-list">
            ${e.length === 0 ? D`
                  <div class="empty compact">
                    <ha-icon icon="mdi:inbox-outline"></ha-icon>
                    <h3>No ${this.filter === "all" ? "" : this.filter} suggestions</h3>
                    <p>
                      ${this.filter === "new" ? "Run a scan when you want the advisor to look for useful routines and setup issues." : "Items you organise here remain local to Home Assistant."}
                    </p>
                  </div>
                ` : e.map((e) => this.renderSuggestionRow(e))}
          </div>
        </aside>
        <article class="detail-pane">
          ${this.selected ? this.renderSuggestionDetail(this.selected) : D`
                <div class="empty">
                  ${this.renderLogo()}
                  <h2>Select a suggestion</h2>
                  <p>
                    Review the evidence, validation result, and automation draft
                    before deciding what to keep.
                  </p>
                </div>
              `}
        </article>
      </section>
    `;
	}
	renderSuggestionRow(e) {
		return D`
      <button
        class="suggestion-row ${this.selectedId === e.id ? "selected" : ""}"
        aria-pressed=${this.selectedId === e.id ? "true" : "false"}
        @click=${() => this.selectedId = e.id}
      >
        <ha-icon
          icon=${e.kind === "automation" ? "mdi:robot-outline" : "mdi:wrench-check-outline"}
        ></ha-icon>
        <span class="row-content">
          <strong>${e.title}</strong>
          <span class="summary">${e.summary}</span>
          <span class="meta">
            ${e.impact} impact · ${this.relativeDate(e.last_seen_at ?? e.created_at)}
            ${(e.occurrences ?? 1) > 1 ? ` · seen in ${e.occurrences} scans` : ""}
          </span>
        </span>
        <span class="confidence" title="Model confidence">
          ${Math.round(e.confidence * 100)}%
        </span>
      </button>
    `;
	}
	renderSuggestionDetail(e) {
		let t = this.draftValidation ?? e.automation?.validation, n = this.changeFor(e), r = n ? this.canApply(n) : !1, i = e.automation?.explanation ?? e.automation?.config?.description ?? e.summary;
		return D`
      <div class="detail-content">
        <ha-button
          class="mobile-back"
          appearance="plain"
          @click=${() => this.selectedId = void 0}
        >
          <ha-icon icon="mdi:arrow-left" slot="start"></ha-icon>
          Suggestions
        </ha-button>

        <header class="detail-heading">
          <div class="detail-title">
            <div class="detail-icon ${e.kind}">
              <ha-icon
                icon=${e.kind === "automation" ? "mdi:robot-outline" : "mdi:wrench-check-outline"}
              ></ha-icon>
            </div>
            <div>
              <h2>${e.title}</h2>
              <p>${e.summary}</p>
            </div>
          </div>
          <span class="status-badge ${e.impact}">${e.impact} impact</span>
        </header>

        <section class="detail-section">
          <h3>Why this surfaced</h3>
          <p>${e.rationale}</p>
          <div class="evidence-list">
            ${e.evidence.map((e) => this.renderEvidence(e))}
          </div>
        </section>

        ${e.automation ? D`
              <section class="detail-section">
                <h3>What the automation does</h3>
                <p>${i}</p>
              </section>
              <section class="detail-section yaml-section">
                <div class="section-heading">
                  <div>
                    <h3>Automation draft</h3>
                    <p>Edit locally and validate again before copying.</p>
                  </div>
                  <span
                    class="status-badge ${t?.valid ? "valid" : "invalid"}"
                  >
                    ${t?.valid ? "Validated" : "Check YAML"}
                  </span>
                </div>
                ${this.draftError ? D`<div class="inline-error" role="alert">${this.draftError}</div>` : O}
                ${t && !t.valid ? D`
                      <div class="validation-errors">
                        ${Object.entries(t.errors).map(([e, t]) => D`<p><strong>${e}:</strong> ${t}</p>`)}
                      </div>
                    ` : O}
                <textarea
                  class="yaml-editor"
                  aria-label="Automation YAML"
                  spellcheck="false"
                  .value=${this.draftYaml}
                  @input=${(e) => {
			this.draftYaml = e.target.value, this.draftValidation = void 0, this.draftDirty = !0;
		}}
                ></textarea>
                <div class="yaml-actions">
                  <ha-button appearance="outlined" @click=${this.validateDraft}>
                    <ha-icon icon="mdi:check-decagram-outline" slot="start"></ha-icon>
                    Validate
                  </ha-button>
                  <ha-button appearance="plain" @click=${() => this.copyYaml()}>
                    <ha-icon icon="mdi:content-copy" slot="start"></ha-icon>
                    ${this.copied ? "Copied" : "Copy"}
                  </ha-button>
                  <ha-button appearance="plain" @click=${() => this.downloadYaml(e)}>
                    <ha-icon icon="mdi:download-outline" slot="start"></ha-icon>
                    Download
                  </ha-button>
                  <ha-button appearance="plain" @click=${this.copyAndOpenEditor}>
                    <ha-icon icon="mdi:open-in-new" slot="start"></ha-icon>
                    Copy & open editor
                  </ha-button>
                  <ha-button appearance="plain" @click=${() => this.reviseInChat(e)}>
                    <ha-icon icon="mdi:message-processing-outline" slot="start"></ha-icon>
                    Revise in chat
                  </ha-button>
                </div>
              </section>
            ` : O}

        <footer class="decision-bar">
          <span>
            <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
            ${n && r ? "No automatic writes. Every change requires your approval." : "HAOS AI is read-only unless you enable an approval capability."}
          </span>
          <div class="decision-actions">
            ${e.status === "dismissed" ? D`
                  <ha-button
                    appearance="plain"
                    @click=${() => this.updateSuggestion(e.id, "new")}
                  >
                    Restore
                  </ha-button>
                ` : D`
                  <ha-button appearance="plain" @click=${() => this.openFeedback(e)}>
                    Dismiss
                  </ha-button>
                `}
            ${n && r && e.status !== "dismissed" ? D`
                  <ha-button
                    appearance="accent"
                    ?disabled=${this.busy || (n.kind === "create_automation" || n.kind === "update_automation") && !t?.valid}
                    @click=${() => this.openChangeApproval(e)}
                  >
                    <ha-icon icon="mdi:shield-check-outline" slot="start"></ha-icon>
                    ${n.kind === "create_automation" ? "Review & create" : n.kind === "update_automation" ? "Review & update" : "Review removal"}
                  </ha-button>
                ` : O}
            ${e.status === "saved" ? D`<span class="saved-label">
                  <ha-icon icon="mdi:bookmark-check"></ha-icon> Saved
                </span>` : D`
                  <ha-button
                    appearance="accent"
                    @click=${() => this.updateSuggestion(e.id, "saved")}
                  >
                    <ha-icon icon="mdi:bookmark-outline" slot="start"></ha-icon>
                    Save
                  </ha-button>
                `}
          </div>
        </footer>
      </div>
    `;
	}
	renderEvidence(e) {
		let t = this.evidencePath(e);
		return D`
      <div class="evidence-row">
        <ha-icon
          icon=${e.source_type === "history" ? "mdi:chart-timeline-variant" : e.source_type === "integration" ? "mdi:puzzle-outline" : "mdi:information-outline"}
        ></ha-icon>
        <div>
          <strong>${e.source_id}</strong>
          <p>${e.observation}</p>
          ${e.period ? D`<small>${e.period}</small>` : O}
          ${e.verified ? O : D`<small class="evidence-unverified"
                >${this.t("evidence.unverified")}</small
              >`}
        </div>
        ${t ? D`
              <ha-icon-button
                label="Open in Home Assistant"
                @click=${() => this.navigate(t)}
              >
                <ha-icon icon="mdi:open-in-new"></ha-icon>
              </ha-icon-button>
            ` : O}
      </div>
    `;
	}
	renderChat() {
		let e = this.threads.find((e) => e.id === this.threadId);
		return D`
      <section class="chat-layout">
        <aside class="thread-pane">
          <div class="pane-heading thread-heading">
            <h2>Conversations</h2>
            <ha-icon-button
              label="New conversation"
              @click=${this.newThread}
            >
              <ha-icon icon="mdi:plus"></ha-icon>
            </ha-icon-button>
          </div>
          <div class="thread-list">
            ${this.threads.length ? this.threads.map((e) => D`
                    <button
                      class=${e.id === this.threadId ? "selected" : ""}
                      @click=${() => this.selectThread(e.id)}
                    >
                      <ha-icon icon="mdi:message-text-outline"></ha-icon>
                      <span>
                        <strong>${e.title}</strong>
                        <small>${e.message_count} messages</small>
                      </span>
                    </button>
                  `) : D`<p class="thread-empty">No saved conversations yet.</p>`}
          </div>
        </aside>
        <div class="conversation-pane">
          <header class="conversation-header">
            <div>
              <h2>${e?.title ?? "New conversation"}</h2>
              <p>Read-only answers grounded in your Home Assistant setup.</p>
            </div>
            <div class="conversation-actions">
              <span class="read-only-badge">
                <ha-icon icon="mdi:shield-check-outline"></ha-icon> Read only
              </span>
              ${e ? D`
                    <ha-icon-button
                      label="Rename conversation"
                      @click=${this.openRenameThread}
                    >
                      <ha-icon icon="mdi:pencil-outline"></ha-icon>
                    </ha-icon-button>
                    <ha-icon-button
                      label="Delete conversation"
                      @click=${() => this.dialog = "delete-thread"}
                    >
                      <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </ha-icon-button>
                  ` : O}
            </div>
          </header>
          <div class="messages" aria-live="polite">
            ${this.chat.length === 0 ? D`
                  <div class="empty chat-empty">
                    <ha-icon icon="mdi:message-question-outline"></ha-icon>
                    <h3>Ask a question about your home</h3>
                    <p>
                      Try “Which lights are missing areas?” or “Help me design a
                      reliable bedtime routine.”
                    </p>
                  </div>
                ` : this.chat.map((e) => {
			let t = e.role === "assistant" ? this.extractYaml(e.content) : void 0;
			return D`
                    <div class="message ${e.role}">
                      <div class="message-avatar">
                        ${e.role === "assistant" ? this.renderLogo() : D`<ha-icon icon="mdi:account-outline"></ha-icon>`}
                      </div>
                      <div>
                        <strong>${e.role === "user" ? "You" : "HAOS AI"}</strong>
                        <p>${e.content}</p>
                        ${t ? D`
                              <div class="message-actions">
                                ${this.selected?.automation ? D`
                                      <ha-button
                                        appearance="outlined"
                                        @click=${() => this.useChatYaml(e.content)}
                                      >
                                        <ha-icon icon="mdi:file-replace-outline" slot="start"></ha-icon>
                                        Use as automation draft
                                      </ha-button>
                                    ` : D`
                                      <ha-button
                                        appearance="outlined"
                                        @click=${() => void this.copyYaml(t)}
                                      >
                                        <ha-icon icon="mdi:content-copy" slot="start"></ha-icon>
                                        Copy YAML
                                      </ha-button>
                                      <small class="message-hint">
                                        A draft is validated and approved against a
                                        suggestion, so select an automation suggestion
                                        in the inbox to use this one.
                                      </small>
                                    `}
                              </div>
                            ` : O}
                      </div>
                    </div>
                  `;
		})}
            ${this.busy && this.tab === "chat" ? D`
                  <div class="message assistant pending">
                    <div class="message-avatar">${this.renderLogo()}</div>
                    <div><strong>HAOS AI</strong><p>Inspecting your setup…</p></div>
                  </div>
                ` : O}
          </div>
          <form
            class="composer"
            @submit=${(e) => {
			e.preventDefault(), this.sendChat();
		}}
          >
            <textarea
              .value=${this.chatText}
              placeholder="Ask about devices, routines, integrations, or an automation idea…"
              aria-label="Message"
              @input=${(e) => this.chatText = e.target.value}
              @keydown=${(e) => {
			e.key === "Enter" && !e.shiftKey && (e.preventDefault(), this.sendChat());
		}}
            ></textarea>
            <ha-button
              appearance="accent"
              type="button"
              ?disabled=${this.busy || !this.chatText.trim()}
              @click=${this.sendChat}
            >
              <ha-icon icon="mdi:send" slot="start"></ha-icon>
              Send
            </ha-button>
          </form>
        </div>
      </section>
    `;
	}
	renderActivity() {
		let e = this.activity?.receipts ?? [];
		return D`
      <section class="activity-layout ${this.selectedReceiptId ? "has-selection" : ""}">
        <aside class="list-pane activity-list">
          <div class="pane-heading">
            <div>
              <h2>Activity</h2>
              <p>Provider requests stored locally for 90 days.</p>
            </div>
            <ha-icon-button
              label="Refresh activity"
              @click=${this.loadActivity}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </ha-icon-button>
          </div>
          ${e.length ? e.map((e) => this.renderReceiptRow(e)) : D`
                <div class="empty compact">
                  <ha-icon icon="mdi:history"></ha-icon>
                  <h3>No advisor activity yet</h3>
                  <p>Receipts appear after a scan or conversation request.</p>
                </div>
              `}
        </aside>
        <article class="detail-pane activity-detail">
          ${this.receipt ? this.renderReceiptDetail(this.receipt) : this.renderActivityOverview()}
        </article>
      </section>
    `;
	}
	renderReceiptRow(e) {
		return D`
      <button
        class="receipt-row ${e.id === this.selectedReceiptId ? "selected" : ""}"
        @click=${() => this.openReceipt(e.id)}
      >
        <ha-icon
          icon=${e.purpose === "scan" ? "mdi:radar" : "mdi:message-outline"}
        ></ha-icon>
        <span>
          <strong>${e.purpose === "scan" ? "Advisor scan" : "Conversation"}</strong>
          <small>${e.provider} · ${e.model}</small>
          <small>${this.formatUsage(e.usage)} · ${this.relativeDate(e.created_at)}</small>
        </span>
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>
    `;
	}
	renderActivityOverview() {
		let e = this.activity?.scan_runs ?? this.overview?.scan_runs ?? [], t = e[0], n = e.reduce((e, t) => e + t.recommendation_count, 0);
		return D`
      <div class="detail-content activity-overview">
        <header class="detail-heading">
          <div class="detail-title">
            <div class="detail-icon activity"><ha-icon icon="mdi:shield-search"></ha-icon></div>
            <div>
              <h2>Privacy ledger</h2>
              <p>Every provider request leaves a local, inspectable receipt.</p>
            </div>
          </div>
        </header>
        <dl class="stats-list">
          <div><dt>Recorded scans</dt><dd>${e.length}</dd></div>
          <div><dt>New suggestions recorded</dt><dd>${n}</dd></div>
          <div>
            <dt>Last scan</dt>
            <dd>${t ? this.relativeDate(t.created_at) : "Never"}</dd>
          </div>
          <div>
            <dt>Retention</dt>
            <dd>90 days</dd>
          </div>
        </dl>
        ${this.renderBudgetStats()}
        ${this.renderAppliedChanges()}
        <section class="detail-section">
          <h3>What a receipt records</h3>
          <p>
            Provider, model, token usage, redactions, context categories, and the
            exact bounded read-only tool results sent for that request.
          </p>
        </section>
      </div>
    `;
	}
	renderBudgetStats() {
		let e = this.budget;
		return e ? D`
      <section class="detail-section">
        <h3>${this.t("budget.title")}</h3>
        <dl class="stats-list compact-stats">
          <div>
            <dt>${this.t("budget.used")}</dt>
            <dd>${e.total_tokens.toLocaleString()}</dd>
          </div>
          <div>
            <dt>${this.t("budget.remaining")}</dt>
            <dd>
              ${e.budget ? (e.remaining ?? 0).toLocaleString() : this.t("budget.no_cap")}
            </dd>
          </div>
          <div>
            <dt>${this.t("budget.requests")}</dt>
            <dd>${e.requests}</dd>
          </div>
        </dl>
        ${e.budget ? D`<div
              class="budget-meter ${e.exceeded ? "exceeded" : e.warning ? "warning" : ""}"
              role="img"
              aria-label=${`${Math.round(e.ratio * 100)}%`}
            >
              <span style=${`width:${Math.min(100, e.ratio * 100)}%`}></span>
            </div>` : O}
      </section>
    ` : O;
	}
	renderAppliedChanges() {
		let e = this.activity?.applied_changes ?? this.overview?.applied_changes ?? [];
		return D`
      <section class="detail-section applied-section">
        <h3>${this.t("applied.title")}</h3>
        <p>${this.t("applied.description")}</p>
        ${e.length ? D`<ul class="applied-list">
              ${e.map((e) => D`
                  <li>
                    <span class="applied-outcome ${e.outcome}">
                      ${this.t(`applied.outcome.${e.outcome}`)}
                    </span>
                    <span class="applied-body">
                      <strong>${e.suggestion_title || e.label}</strong>
                      <small>
                        ${e.kind.replaceAll("_", " ")} ·
                        <code>${e.target_id}</code> ·
                        ${this.relativeDate(e.applied_at)}
                      </small>
                      ${e.outcome_detail ? D`<small>${e.outcome_detail}</small>` : O}
                    </span>
                  </li>
                `)}
            </ul>` : D`<p class="muted">${this.t("applied.empty")}</p>`}
      </section>
    `;
	}
	renderReceiptDetail(e) {
		return D`
      <div class="detail-content receipt-content">
        <ha-button
          class="mobile-back"
          appearance="plain"
          @click=${() => {
			this.selectedReceiptId = void 0, this.receipt = void 0;
		}}
        >
          <ha-icon icon="mdi:arrow-left" slot="start"></ha-icon>
          Activity
        </ha-button>
        <header class="detail-heading">
          <div class="detail-title">
            <div class="detail-icon activity">
              <ha-icon icon=${e.purpose === "scan" ? "mdi:radar" : "mdi:message-outline"}></ha-icon>
            </div>
            <div>
              <h2>${e.purpose === "scan" ? "Advisor scan" : "Conversation"}</h2>
              <p>${new Date(e.created_at).toLocaleString()}</p>
            </div>
          </div>
          <span class="status-badge valid">Stored locally</span>
        </header>
        <dl class="stats-list compact-stats">
          <div><dt>Provider</dt><dd>${e.provider}</dd></div>
          <div><dt>Model</dt><dd>${e.model}</dd></div>
          <div><dt>Token usage</dt><dd>${this.formatUsage(e.usage)}</dd></div>
          <div><dt>Redactions</dt><dd>${e.redactions.length}</dd></div>
        </dl>
        <section class="detail-section">
          <h3>Context categories</h3>
          <div class="chip-list">
            ${e.categories.map((e) => D`<span>${e.replaceAll("_", " ")}</span>`)}
          </div>
        </section>
        <section class="detail-section">
          <h3>Redacted fields</h3>
          ${e.redactions.length ? D`<ul>${e.redactions.map((e) => D`<li>${e}</li>`)}</ul>` : D`<p>No sensitive fields were present in this request.</p>`}
        </section>
        <section class="detail-section payload-section">
          <details>
            <summary>Inspect the exact sanitized payload</summary>
            <pre><code>${JSON.stringify(e.payload_preview, null, 2)}</code></pre>
          </details>
        </section>
      </div>
    `;
	}
	renderSettings() {
		if (!this.overview) return O;
		let e = new Set(this.overview.goal_presets.map((e) => e.id)), t = this.selectedGoals.filter((t) => !e.has(t)), n = this.overview.provider_options.find((e) => e.id === this.providerDraft);
		return D`
      <section class="settings-layout">
        <header class="settings-heading">
          <div>
            <h2>HAOS AI settings</h2>
            <p>Connection, advisor behavior, privacy, and scheduled scans.</p>
          </div>
          <span class="version-badge">v${this.overview.version}</span>
        </header>
        ${this.settingsNotice ? D`<div class="settings-notice" role="status">
              <ha-icon icon="mdi:check-circle-outline"></ha-icon>
              ${this.settingsNotice}
            </div>` : O}

        <ha-card class="settings-section">
          <div class="settings-section-title">
            <ha-icon icon="mdi:connection"></ha-icon>
            <div>
              <h3>AI connection</h3>
              <p>Change provider or model without leaving HAOS AI.</p>
            </div>
          </div>
          <div class="settings-fields two-column">
            <label>
              <span>Provider</span>
              <select
                .value=${this.providerDraft}
                @change=${(e) => this.providerChanged(e.target.value)}
              >
                ${this.overview.provider_options.map((e) => D`
                    <option
                      value=${e.id}
                      ?selected=${e.id === this.providerDraft}
                    >${e.label}</option>
                  `)}
              </select>
            </label>
            <label>
              <span>Model</span>
              <input
                .value=${this.modelDraft}
                @input=${(e) => this.modelDraft = e.target.value}
                placeholder=${n?.default_model || "Model identifier"}
                autocomplete="off"
              />
              <small>Use the recommended default or paste any supported model ID.</small>
            </label>
          </div>
          <button
            class="advanced-toggle"
            aria-expanded=${this.showConnectionAdvanced ? "true" : "false"}
            @click=${() => this.showConnectionAdvanced = !this.showConnectionAdvanced}
          >
            <ha-icon
              icon=${this.showConnectionAdvanced ? "mdi:chevron-up" : "mdi:chevron-down"}
            ></ha-icon>
            API key and endpoint
          </button>
          ${this.showConnectionAdvanced ? D`
                <div class="settings-fields two-column advanced-fields">
                  <label>
                    <span>New API key</span>
                    <input
                      type="password"
                      .value=${this.apiKeyDraft}
                      @input=${(e) => this.apiKeyDraft = e.target.value}
                      placeholder="Stored key remains unchanged"
                      autocomplete="new-password"
                    />
                    <small>Required when changing providers; otherwise leave blank.</small>
                  </label>
                  <label>
                    <span>API base URL</span>
                    <input
                      type="url"
                      .value=${this.baseUrlDraft}
                      @input=${(e) => this.baseUrlDraft = e.target.value}
                      placeholder=${n?.default_base_url || "https://…"}
                      autocomplete="url"
                    />
                    <small>Advanced: HAOS AI appends the provider route.</small>
                  </label>
                </div>
              ` : O}
          ${this.renderScanProfile()}
          <div class="settings-action">
            <span>Saving performs a small provider connection test.</span>
            <ha-button appearance="accent" ?disabled=${this.busy || !this.modelDraft.trim()} @click=${this.saveConnection}>
              <ha-icon icon="mdi:connection" slot="start"></ha-icon>
              Verify and save
            </ha-button>
          </div>
        </ha-card>

        <ha-card class="settings-section preferences">
          <div class="settings-section-title">
            <ha-icon icon="mdi:target"></ha-icon>
            <div>
              <h3>Advisor focus</h3>
              <p>Select everything you want HAOS AI to prioritize.</p>
            </div>
          </div>
          <div class="goal-grid">
            ${this.overview.goal_presets.map((e) => D`
                <label class="choice-card">
                  <input
                    type="checkbox"
                    .checked=${this.selectedGoals.includes(e.id)}
                    @change=${() => this.toggleGoal(e.id)}
                  />
                  <span class="choice-control">
                    <ha-icon
                      icon=${this.selectedGoals.includes(e.id) ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}
                    ></ha-icon>
                    ${e.label}
                  </span>
                </label>
              `)}
          </div>
          ${t.length ? D`
                <div class="imported-goals">
                  <span>Imported preferences</span>
                  ${t.map((e) => D`
                      <button @click=${() => this.toggleGoal(e)}>
                        ${e}<ha-icon icon="mdi:close"></ha-icon>
                      </button>
                    `)}
                </div>
              ` : O}

          <div class="settings-subsection">
            <h4>How the advisor should think</h4>
            <div class="settings-fields three-column">
              <label>
                <span>Recommendation style</span>
                <select .value=${this.advisorMode} @change=${(e) => this.advisorMode = e.target.value}>
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="ambitious">Ambitious</option>
                  <option value="automation_hell">I WANT AUTOMATION HELL</option>
                </select>
              </label>
              <label>
                <span>Scan depth</span>
                <select .value=${this.scanDepth} @change=${(e) => this.scanDepth = e.target.value}>
                  <option value="focused">Focused · up to 4 ideas</option>
                  <option value="standard">Standard · up to 8 ideas</option>
                  <option value="thorough">Thorough · up to 10 ideas</option>
                </select>
              </label>
              <label>
                <span>Automation complexity</span>
                <select .value=${this.automationComplexity} @change=${(e) => this.automationComplexity = e.target.value}>
                  <option value="simple">Simple only</option>
                  <option value="normal">Normal</option>
                  <option value="advanced">Advanced allowed</option>
                </select>
              </label>
            </div>
            <div class="toggle-list">
              <label>
                <input type="checkbox" .checked=${this.fixExistingFirst} @change=${(e) => this.fixExistingFirst = e.target.checked} />
                <span><strong>Fix existing automations first</strong><small>Prefer simplifying or repairing what already exists.</small></span>
              </label>
              <label>
                <input type="checkbox" .checked=${this.avoidNewHardware} @change=${(e) => this.avoidNewHardware = e.target.checked} />
                <span><strong>Avoid new hardware</strong><small>Only suggest ideas using devices already in Home Assistant.</small></span>
              </label>
            </div>
          </div>

          <div class="settings-subsection">
            <h4>Quiet hours for suggested automations</h4>
            <p class="field-help">The advisor will avoid noisy or disruptive actions during this window.</p>
            <div class="settings-fields two-column compact-fields">
              <label><span>From</span><input type="time" .value=${this.quietStart} @input=${(e) => this.quietStart = e.target.value} /></label>
              <label><span>Until</span><input type="time" .value=${this.quietEnd} @input=${(e) => this.quietEnd = e.target.value} /></label>
            </div>
          </div>

          <div class="settings-subsection entity-exclusions">
            <h4>${this.t("ignore.entities")}</h4>
            <p class="field-help">${this.t("ignore.entities_help")}</p>
            <div class="entity-picker">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input
                .value=${this.ignoredEntityQuery}
                @input=${(e) => {
			this.ignoredEntityQuery = e.target.value, this.ignoredEntityError = "", this.entityHighlight = -1;
		}}
                @keydown=${this.handleEntityKeydown}
                @paste=${this.handleEntityPaste}
                placeholder="Search or paste: light.kitchen, sensor.hallway…"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded=${this.matchingEntities.length ? "true" : "false"}
                aria-invalid=${this.ignoredEntityError ? "true" : "false"}
                aria-controls="ignored-entity-results"
                aria-activedescendant=${this.entityHighlight >= 0 ? `ignored-entity-option-${this.entityHighlight}` : O}
              />
              ${this.matchingEntities.length ? D`
                    <div
                      class="entity-results"
                      role="listbox"
                      id="ignored-entity-results"
                    >
                      ${this.matchingEntities.map((e, t) => D`
                          <button
                            role="option"
                            id=${`ignored-entity-option-${t}`}
                            aria-selected=${t === this.entityHighlight ? "true" : "false"}
                            class=${t === this.entityHighlight ? "active" : ""}
                            @click=${() => this.addIgnoredEntities([e.entity_id])}
                          >
                            <span>
                              <strong>${e.attributes.friendly_name ?? e.entity_id}</strong>
                              <small>${e.entity_id}</small>
                            </span>
                            <em>${e.state}</em>
                          </button>
                        `)}
                    </div>
                  ` : O}
            </div>
            <p class="field-error" role="alert">${this.ignoredEntityError}</p>
            <div class="entity-chips" aria-label="Ignored entities">
              ${this.ignoredEntities.map((e) => {
			let t = this.hass?.states?.[e];
			return D`
                  <span class=${t ? "" : "unavailable"}>
                    <span>
                      <strong>${t?.attributes.friendly_name ?? e}</strong>
                      ${t ? D`<small>${e}</small>` : D`<small>${this.t("ignore.not_found")}</small>`}
                    </span>
                    <button
                      aria-label=${`${this.t("ignore.stop")} ${e}`}
                      @click=${() => this.ignoredEntities = this.ignoredEntities.filter((t) => t !== e)}
                    ><ha-icon icon="mdi:close"></ha-icon></button>
                  </span>
                `;
		})}
            </div>
          </div>
          ${this.renderIgnoreScopes()}
          ${this.renderBudgetSettings()}
          <div class="settings-action">
            <span>Used by future scans and conversations.</span>
            <ha-button appearance="accent" ?disabled=${this.busy} @click=${this.savePreferences}>
              <ha-icon icon="mdi:content-save-outline" slot="start"></ha-icon>
              Save advisor preferences
            </ha-button>
          </div>
        </ha-card>

        <ha-card class="settings-section approval-settings">
          <div class="settings-section-title">
            <ha-icon icon="mdi:shield-key-outline"></ha-icon>
            <div>
              <h3>Approval-only changes</h3>
              <p>Let HAOS AI prepare changes, then review every one before Home Assistant applies it.</p>
            </div>
          </div>
          <div class="approval-banner">
            <ha-icon icon="mdi:account-check-outline"></ha-icon>
            <span>
              <strong>Approval is always required.</strong>
              Scheduled scans and chat can only prepare requests. They can never approve them.
            </span>
          </div>
          <div class="toggle-list divided-toggles capability-list">
            <label>
              <input type="checkbox" .checked=${this.changePermissions.create_automations} @change=${(e) => this.changePermissions = {
			...this.changePermissions,
			create_automations: e.target.checked
		}} />
              <span><strong>Create validated automations</strong><small>Shows an approval button only after the current YAML passes Home Assistant validation.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.update_automations} @change=${(e) => this.changePermissions = {
			...this.changePermissions,
			update_automations: e.target.checked
		}} />
              <span><strong>Update existing automations</strong><small>Only exact, existing automation config IDs can be proposed and replaced after review.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.remove_entities} @change=${(e) => this.changePermissions = {
			...this.changePermissions,
			remove_entities: e.target.checked
		}} />
              <span><strong>Remove orphaned entities</strong><small>Only exact registry entries missing from the current state machine can be proposed.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.remove_devices} @change=${(e) => this.changePermissions = {
			...this.changePermissions,
			remove_devices: e.target.checked
		}} />
              <span><strong>Remove stale devices</strong><small>Only when the owning integration supports removal and all registered entities are orphaned.</small></span>
            </label>
          </div>
          <div class="settings-action">
            <span>These permissions expose approval actions; they do not enable autonomy.</span>
            <ha-button appearance="accent" ?disabled=${this.busy} @click=${this.savePreferences}>
              <ha-icon icon="mdi:content-save-outline" slot="start"></ha-icon>
              Save approval permissions
            </ha-button>
          </div>
        </ha-card>

        <ha-card class="settings-section">
          <div class="settings-section-title">
            <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
            <div><h3>Privacy and scheduled scans</h3><p>Control context depth and when HAOS AI runs.</p></div>
          </div>
          <div class="settings-fields three-column">
            <label>
              <span>History window</span>
              <select .value=${String(this.historyDays)} @change=${(e) => this.historyDays = Number(e.target.value)}>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </label>
            <label>
              <span>Automatic scans</span>
              <select .value=${this.schedule} @change=${(e) => this.schedule = e.target.value}>
                <option value="manual">Manual only</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label class=${this.schedule === "manual" ? "disabled-field" : ""}>
              <span>Scan time</span>
              <input type="time" .value=${this.scheduleTime} ?disabled=${this.schedule === "manual"} @input=${(e) => this.scheduleTime = e.target.value} />
            </label>
            ${this.schedule === "weekly" ? D`<label>
                  <span>Scan day</span>
                  <select .value=${String(this.scheduleWeekday)} @change=${(e) => this.scheduleWeekday = Number(e.target.value)}>
                    ${fi.map((e, t) => D`<option value=${t}>${this.t(e)}</option>`)}
                  </select>
                </label>` : O}
          </div>
          <div class="toggle-list divided-toggles">
            <label>
              <input type="checkbox" .checked=${this.notifyNewSuggestions} ?disabled=${this.schedule === "manual"} @change=${(e) => this.notifyNewSuggestions = e.target.checked} />
              <span><strong>Notify about new scheduled suggestions</strong><small>Manual scans never create this notification.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.includeExactLocation} @change=${(e) => this.includeExactLocation = e.target.checked} />
              <span><strong>Allow exact location context</strong><small>Off by default. Coordinates remain redacted when disabled.</small></span>
            </label>
          </div>
          <div class="settings-action">
            <ha-button appearance="outlined" @click=${this.openPreview}>
              <ha-icon icon="mdi:eye-outline" slot="start"></ha-icon>
              Preview context
            </ha-button>
            <ha-button appearance="accent" ?disabled=${this.busy} @click=${this.saveOptions}>
              <ha-icon icon="mdi:content-save-outline" slot="start"></ha-icon>
              Save privacy and schedule
            </ha-button>
          </div>
        </ha-card>

        <ha-card class="settings-section about-section">
          <div class="settings-section-title">
            <ha-icon icon="mdi:information-outline"></ha-icon>
            <div><h3>About and updates</h3><p>HAOS AI ${this.overview.version} · Assist agent ready.</p></div>
          </div>
          <div class="about-actions">
            <a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=Bronxk&repository=haos-ai&category=integration" target="_blank" rel="noreferrer">
              <ha-icon icon="mdi:update"></ha-icon><span>Open in HACS</span>
            </a>
            <a href="https://github.com/Bronxk/haos-ai/releases" target="_blank" rel="noreferrer">
              <ha-icon icon="mdi:text-box-outline"></ha-icon><span>Release notes</span>
            </a>
            <a href="https://github.com/Bronxk/haos-ai/issues" target="_blank" rel="noreferrer">
              <ha-icon icon="mdi:bug-outline"></ha-icon><span>Report a problem</span>
            </a>
          </div>
        </ha-card>
      </section>
    `;
	}
	renderScanProfile() {
		let e = this.overview?.provider_options ?? [], t = e.find((e) => e.id === this.scanProviderDraft);
		return D`
      <div class="settings-subsection scan-profile">
        <h4>${this.t("scan_profile.title")}</h4>
        <p class="field-help">${this.t("scan_profile.description")}</p>
        <div class="toggle-list">
          <label>
            <input
              type="checkbox"
              .checked=${this.scanProfileEnabled}
              @change=${(e) => {
			this.scanProfileEnabled = e.target.checked, this.settingsNotice = "";
		}}
            />
            <span>
              <strong>${this.t("scan_profile.enable")}</strong>
              <small>${this.t("scan_profile.enable_help")}</small>
            </span>
          </label>
        </div>
        ${this.scanProfileEnabled ? D`
              <div class="settings-fields two-column">
                <label>
                  <span>${this.t("scan_profile.provider")}</span>
                  <select
                    .value=${this.scanProviderDraft}
                    @change=${(t) => {
			let n = t.target.value, r = e.find((e) => e.id === n);
			this.scanProviderDraft = n, r && (this.scanModelDraft ||= r.default_model, this.scanBaseUrlDraft ||= r.default_base_url), this.scanApiKeyDraft = "", this.settingsNotice = "";
		}}
                  >
                    ${e.map((e) => D`
                        <option
                          value=${e.id}
                          ?selected=${e.id === this.scanProviderDraft}
                        >${e.label}</option>
                      `)}
                  </select>
                </label>
                <label>
                  <span>${this.t("scan_profile.model")}</span>
                  <input
                    .value=${this.scanModelDraft}
                    @input=${(e) => this.scanModelDraft = e.target.value}
                    placeholder=${t?.default_model || "Model identifier"}
                    autocomplete="off"
                  />
                </label>
                <label>
                  <span>${this.t("scan_profile.api_key")}</span>
                  <input
                    type="password"
                    .value=${this.scanApiKeyDraft}
                    @input=${(e) => this.scanApiKeyDraft = e.target.value}
                    placeholder="Stored key remains unchanged"
                    autocomplete="new-password"
                  />
                </label>
                <label>
                  <span>${this.t("scan_profile.base_url")}</span>
                  <input
                    type="url"
                    .value=${this.scanBaseUrlDraft}
                    @input=${(e) => this.scanBaseUrlDraft = e.target.value}
                    placeholder=${t?.default_base_url || "https://…"}
                    autocomplete="url"
                  />
                </label>
              </div>
              <p class="field-help">
                ${this.overview?.scan_profile?.active ? this.t("scan_profile.active") : this.t("scan_profile.inactive")}
              </p>
            ` : O}
      </div>
    `;
	}
	renderScopePicker(e, t, n, r, i, a, o) {
		let s = r ? a.filter((e) => `${e.id} ${e.label}`.toLocaleLowerCase().includes(r.trim().toLocaleLowerCase())).slice(0, 8) : [];
		return D`
      <div class="settings-subsection entity-exclusions">
        <h4>${this.t(t)}</h4>
        <p class="field-help">${this.t(n)}</p>
        <div class="entity-picker">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            .value=${r}
            @input=${(e) => i(e.target.value)}
            @keydown=${(t) => {
			t.key === "Enter" && (t.preventDefault(), this.addIgnoredScope(e, s[0]?.id ?? r));
		}}
            placeholder=${this.t(t)}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded=${s.length ? "true" : "false"}
          />
          ${s.length ? D`
                <div class="entity-results" role="listbox">
                  ${s.map((t) => D`
                      <button
                        role="option"
                        @click=${() => this.addIgnoredScope(e, t.id)}
                      >
                        <span>
                          <strong>${t.label}</strong>
                          ${t.label === t.id ? O : D`<small>${t.id}</small>`}
                        </span>
                      </button>
                    `)}
                </div>
              ` : O}
        </div>
        <div class="entity-chips" aria-label=${this.t(t)}>
          ${o.map((t) => D`
              <span>
                <span><strong>${t.label}</strong></span>
                <button
                  aria-label=${`${this.t("ignore.stop")} ${t.label}`}
                  @click=${() => this.removeIgnoredScope(e, t.id)}
                ><ha-icon icon="mdi:close"></ha-icon></button>
              </span>
            `)}
        </div>
      </div>
    `;
	}
	renderIgnoreScopes() {
		return D`
      ${this.renderScopePicker("domains", "ignore.domains", "ignore.domains_help", this.ignoredDomainQuery, (e) => this.ignoredDomainQuery = e, this.availableDomains.map((e) => ({
			id: e,
			label: e
		})), this.ignoredDomains.map((e) => ({
			id: e,
			label: e
		})))}
      ${this.renderScopePicker("areas", "ignore.areas", "ignore.areas_help", this.ignoredAreaQuery, (e) => this.ignoredAreaQuery = e, this.availableAreas.map((e) => ({
			id: e.area_id,
			label: e.name
		})), this.ignoredAreas.map((e) => ({
			id: e,
			label: this.areaName(e)
		})))}
      ${this.renderScopePicker("labels", "ignore.labels", "ignore.labels_help", this.ignoredLabelQuery, (e) => this.ignoredLabelQuery = e, this.availableLabels.map((e) => ({
			id: e,
			label: e
		})), this.ignoredLabels.map((e) => ({
			id: e,
			label: e
		})))}
      <p class="field-help enforced-note">
        <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
        ${this.t("ignore.enforced")}
      </p>
    `;
	}
	renderBudgetSettings() {
		let e = this.budget;
		return D`
      <div class="settings-subsection">
        <h4>${this.t("budget.title")}</h4>
        <p class="field-help">${this.t("budget.description")}</p>
        <div class="settings-fields two-column compact-fields">
          <label>
            <span>${this.t("budget.field")}</span>
            <input
              type="number"
              min="0"
              step="1000"
              .value=${String(this.monthlyTokenBudget)}
              @input=${(e) => {
			this.monthlyTokenBudget = Math.max(0, Number(e.target.value) || 0), this.settingsNotice = "";
		}}
            />
            <small>${this.t("budget.unlimited")}</small>
          </label>
          ${e ? D`<label class="readonly-field">
                <span>${this.t("budget.used")}</span>
                <output>${e.total_tokens.toLocaleString()}</output>
                <small>
                  ${e.budget ? `${this.t("budget.remaining")}: ${(e.remaining ?? 0).toLocaleString()}` : this.t("budget.no_cap")}
                </small>
              </label>` : O}
        </div>
      </div>
    `;
	}
	renderPreviewDialog() {
		let e = this.preview.payload, t = Object.keys(e).filter((t) => e[t] !== null);
		return D`
      <ha-adaptive-dialog
        open
        allow-mode-change
        header-title="Review context before sending"
        header-subtitle="Privacy preflight"
        @closed=${() => this.preview = void 0}
      >
        <div class="dialog-content">
          <p>
            This baseline will go to <strong>${this.preview.provider}</strong>.
            The model can request additional bounded, read-only details during the scan.
          </p>
          <div class="category-list">
            ${t.map((e) => D`
                <div><ha-icon icon="mdi:check-circle-outline"></ha-icon>${e.replaceAll("_", " ")}</div>
              `)}
          </div>
          <details>
            <summary>Inspect sanitized baseline</summary>
            <pre><code>${JSON.stringify(e, null, 2)}</code></pre>
          </details>
          <div class="privacy-note">
            <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
            <span>
              <strong>${this.preview.redactions.length}</strong> sensitive or bounded
              fields redacted. Camera media and secrets are never sent.
            </span>
          </div>
        </div>
        <div slot="footer">
          <ha-button appearance="plain" @click=${() => this.preview = void 0}>Cancel</ha-button>
          <ha-button appearance="accent" ?disabled=${this.busy} @click=${this.runScan}>
            Confirm and scan
          </ha-button>
        </div>
      </ha-adaptive-dialog>
    `;
	}
	renderActionDialog() {
		if (this.dialog === "feedback") return D`
        <ha-adaptive-dialog
          open
          allow-mode-change
          header-title="Why are you dismissing this?"
          header-subtitle="This helps future scans"
          @closed=${() => this.dialog = null}
        >
          <div class="dialog-content feedback-options">
            ${di.map((e) => D`
                <button
                  class=${this.feedbackReason === e ? "selected" : ""}
                  @click=${() => this.feedbackReason = e}
                >
                  <ha-icon
                    icon=${this.feedbackReason === e ? "mdi:radiobox-marked" : "mdi:radiobox-blank"}
                  ></ha-icon>
                  ${e}
                </button>
              `)}
            <label>
              Optional note
              <textarea
                .value=${this.feedbackNote}
                @input=${(e) => this.feedbackNote = e.target.value}
              ></textarea>
            </label>
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => this.dialog = null}>Cancel</ha-button>
            <ha-button
              variant="danger"
              appearance="filled"
              ?disabled=${!this.feedbackReason}
              @click=${this.submitFeedback}
            >Dismiss suggestion</ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
		if (this.dialog === "rename") return D`
        <ha-adaptive-dialog
          open
          allow-mode-change
          header-title="Rename conversation"
          @closed=${() => this.dialog = null}
        >
          <div class="dialog-content">
            <label>
              Conversation name
              <input
                autofocus
                .value=${this.renameText}
                @input=${(e) => this.renameText = e.target.value}
              />
            </label>
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => this.dialog = null}>Cancel</ha-button>
            <ha-button appearance="accent" ?disabled=${!this.renameText.trim()} @click=${this.renameThread}>
              Rename
            </ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
		if (this.dialog === "clear-inbox") {
			let e = this.filteredSuggestions.length;
			return D`
        <ha-adaptive-dialog
          open
          type="alert"
          header-title=${this.filter === "all" ? "Clear the entire inbox?" : `Clear ${this.filter} suggestions?`}
          header-subtitle="Local suggestions only"
          @closed=${() => this.dialog = null}
        >
          <div class="dialog-content">
            <p>
              This permanently removes ${e} ${e === 1 ? "suggestion" : "suggestions"}
              from Home Assistant. It does not change devices or automations.
            </p>
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => this.dialog = null}>Cancel</ha-button>
            <ha-button variant="danger" appearance="filled" @click=${this.clearInbox}>
              Clear ${e}
            </ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
		}
		if (this.dialog === "approve-change" && this.pendingChange) {
			let e = this.pendingChange, t = !["create_automation", "update_automation"].includes(e.kind);
			return D`
        <ha-adaptive-dialog
          open
          type=${t ? "alert" : O}
          header-title=${t ? "Approve removal?" : e.kind === "update_automation" ? "Approve automation update?" : "Approve automation creation?"}
          header-subtitle="Manual approval · one change"
          @closed=${() => {
				this.dialog = null, this.pendingChange = void 0, this.diffLines = void 0, this.diffError = "";
			}}
        >
          <div class="dialog-content approval-review">
            <div class="approval-banner">
              <ha-icon icon="mdi:shield-check-outline"></ha-icon>
              <span>
                <strong>HAOS AI cannot approve this.</strong>
                Home Assistant applies it only after you press the button below.
              </span>
            </div>
            <dl>
              <div><dt>Action</dt><dd>${e.kind.replaceAll("_", " ")}</dd></div>
              <div><dt>Target</dt><dd>${e.label}</dd></div>
              <div><dt>Identifier</dt><dd><code>${e.targetId}</code></dd></div>
            </dl>
            ${e.kind === "update_automation" ? this.renderDiff() : O}
            ${e.kind === "create_automation" || e.kind === "update_automation" ? D`
                  <details>
                    <summary>Inspect validated YAML</summary>
                    <pre><code>${this.draftYaml}</code></pre>
                  </details>
                ` : D`<p class="danger-copy">Removal may be irreversible. A future scan cannot restore registry data.</p>`}
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => {
				this.dialog = null, this.pendingChange = void 0, this.diffLines = void 0, this.diffError = "";
			}}>${this.t("action.cancel")}</ha-button>
            <ha-button
              variant=${t ? "danger" : O}
              appearance=${t ? "filled" : "accent"}
              ?disabled=${this.busy || e.kind === "update_automation" && (this.diffLoading || !!this.diffError)}
              @click=${this.approveChange}
            >${t ? "Approve & remove" : e.kind === "update_automation" ? "Approve & update" : "Approve & create"}</ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
		}
		return D`
      <ha-adaptive-dialog
        open
        type="alert"
        header-title="Delete this conversation?"
        header-subtitle="Messages are stored only in Home Assistant"
        @closed=${() => this.dialog = null}
      >
        <div class="dialog-content">
          <p>This removes the local thread immediately. It cannot be recovered.</p>
        </div>
        <div slot="footer">
          <ha-button appearance="plain" @click=${() => this.dialog = null}>Cancel</ha-button>
          <ha-button variant="danger" appearance="filled" @click=${this.deleteThread}>Delete</ha-button>
        </div>
      </ha-adaptive-dialog>
    `;
	}
	renderDiff() {
		return this.diffLoading ? D`<p class="muted">${this.t("diff.loading")}</p>` : this.diffError ? D`<p class="danger-copy">${this.diffError}</p>` : this.diffLines ? this.diffLines.some((e) => e.type !== "same") ? D`
      <section class="diff-section">
        <h3>${this.t("diff.title")}</h3>
        <div class="diff-legend">
          <span class="removed">${this.t("diff.current")}</span>
          <span class="added">${this.t("diff.proposed")}</span>
        </div>
        <pre class="diff"><code>${this.diffLines.map((e) => D`<span class="diff-line ${e.type}"
            >${e.type === "added" ? "+" : e.type === "removed" ? "-" : " "} ${e.text}
</span>`)}</code></pre>
      </section>
    ` : D`<p class="muted">${this.t("diff.identical")}</p>` : O;
	}
	relativeDate(e) {
		let t = new Date(e).getTime(), n = Math.round((Date.now() - t) / 6e4);
		if (n < 60) return `${Math.max(1, n)}m ago`;
		let r = Math.round(n / 60);
		if (r < 24) return `${r}h ago`;
		let i = Math.round(r / 24);
		return i < 30 ? `${i}d ago` : new Date(e).toLocaleDateString();
	}
	formatUsage(e) {
		let t = (e?.input_tokens ?? 0) + (e?.output_tokens ?? 0);
		return t ? `${t.toLocaleString()} tokens` : "Usage unavailable";
	}
	static {
		this.styles = o`
    /* Hallmark · genre: native-admin · macrostructure: Workbench split view
     * tone: utilitarian · design authority: Home Assistant 2026.7
     * logo: code-native house + advisor spark · enrichment: none
     * pre-emit critique: P5 H5 E5 S5 R5 V4 · contrast: pass (46–50)
     * slop: pass (51–60) · mobile: pass (36, 59, 61–69)
     */
    :host {
      --haos-surface: var(
        --card-background-color,
        var(--ha-color-surface-default, #ffffff)
      );
      --haos-surface-low: var(
        --primary-background-color,
        var(--ha-color-surface-low, #f5f5f5)
      );
      --haos-surface-lower: var(
        --secondary-background-color,
        var(--ha-color-surface-lower, #eeeeee)
      );
      --haos-text: var(--primary-text-color, #212121);
      --haos-muted: var(--secondary-text-color, #727272);
      --haos-divider: var(--divider-color, #e0e0e0);
      --haos-primary: var(--primary-color, #03a9f4);
      --haos-on-primary: var(--text-primary-color, #ffffff);
      --haos-success: var(--success-color, #2e7d32);
      --haos-warning: var(--warning-color, #ed6c02);
      --haos-error: var(--error-color, #d32f2f);
      --haos-code-surface: #171c20;
      --haos-code-text: #eef2f5;
      --haos-selected: color-mix(
        in srgb,
        var(--haos-primary) 10%,
        var(--haos-surface)
      );
      --haos-success-soft: color-mix(
        in srgb,
        var(--haos-success) 12%,
        var(--haos-surface)
      );
      --haos-warning-soft: color-mix(
        in srgb,
        var(--haos-warning) 12%,
        var(--haos-surface)
      );
      --haos-error-soft: color-mix(
        in srgb,
        var(--haos-error) 10%,
        var(--haos-surface)
      );
      display: block;
      height: 100%;
      overflow-x: clip;
      color: var(--haos-text);
      background: var(--haos-surface-low);
      font-family: var(
        --ha-font-family-body,
        var(--paper-font-body1_-_font-family, Roboto, sans-serif)
      );
    }

    * {
      box-sizing: border-box;
    }

    button,
    input,
    textarea,
    select {
      font: inherit;
    }

    button {
      color: inherit;
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    h1,
    h2,
    h3 {
      min-width: 0;
      overflow-wrap: anywhere;
      color: var(--haos-text);
      line-height: var(--ha-line-height-condensed, 1.25);
    }

    h1 {
      font-size: var(--ha-font-size-xl, 20px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    h2 {
      font-size: var(--ha-font-size-2xl, 24px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    h3 {
      font-size: var(--ha-font-size-l, 16px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    ha-icon {
      flex: 0 0 auto;
    }

    ha-button,
    ha-icon-button,
    button,
    summary {
      -webkit-tap-highlight-color: transparent;
    }

    ha-button {
      white-space: nowrap;
    }

    button:active,
    summary:active {
      background: var(--haos-selected);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }

    input:disabled,
    select:disabled {
      cursor: not-allowed;
      opacity: 0.55;
      background: var(--haos-surface-lower);
    }

    input:hover:not(:disabled),
    textarea:hover:not(:disabled),
    select:hover:not(:disabled) {
      border-color: var(--haos-muted);
    }

    input:active:not(:disabled),
    textarea:active:not(:disabled),
    select:active:not(:disabled) {
      background: var(--haos-selected);
    }

    input[aria-invalid="true"],
    textarea[aria-invalid="true"],
    select[aria-invalid="true"] {
      border-color: var(--haos-error);
    }

    button:focus-visible,
    input:focus-visible,
    textarea:focus-visible,
    select:focus-visible,
    summary:focus-visible {
      outline: 2px solid var(--haos-primary);
      outline-offset: 2px;
    }

    textarea,
    input,
    select {
      width: 100%;
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-lg, 10px);
      outline: 2px solid transparent;
      color: var(--haos-text);
      background: var(--haos-surface-low);
    }

    textarea:hover,
    input:hover {
      background: var(--haos-surface-lower);
    }

    .shell {
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      min-height: var(--ha-top-app-bar-height, 64px);
      padding: 0 var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: minmax(150px, auto) minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--ha-space-6, 24px);
      background: var(--app-header-background-color, var(--haos-surface));
      color: var(--app-header-text-color, var(--haos-text));
      border-bottom: 1px solid var(--haos-divider);
      z-index: 4;
    }

    .title-lockup {
      min-width: 0;
      display: flex;
      align-items: center;
      gap: var(--ha-space-3, 12px);
    }

    .logo {
      width: 36px;
      height: 36px;
      display: inline-grid;
      place-items: center;
      flex: 0 0 36px;
      color: var(--haos-primary);
    }

    .logo svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    .logo-house,
    .logo-link {
      fill: none;
      stroke: currentColor;
      stroke-width: 1.55;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .logo-spark,
    .logo circle {
      fill: currentColor;
    }

    .tabs {
      min-width: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: var(--ha-space-1, 4px);
    }

    .tabs button {
      position: relative;
      min-width: 72px;
      padding: 0 var(--ha-space-3, 12px);
      border: 0;
      background: transparent;
      color: var(--haos-muted);
      cursor: pointer;
      white-space: nowrap;
      font-size: var(--ha-font-size-m, 14px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    .tabs button:hover {
      background: var(--haos-surface-lower);
    }

    .tabs button.active {
      color: var(--haos-primary);
    }

    .tabs button.active::after {
      content: "";
      position: absolute;
      inset-inline: var(--ha-space-3, 12px);
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--haos-primary);
    }

    .count {
      min-width: 18px;
      height: 18px;
      margin-inline-start: var(--ha-space-1, 4px);
      padding: 0 var(--ha-space-1, 4px);
      display: inline-grid;
      place-items: center;
      border-radius: var(--ha-border-radius-pill, 999px);
      background: var(--haos-selected);
      font-size: var(--ha-font-size-xs, 11px);
      font-variant-numeric: tabular-nums;
    }

    main {
      flex: 1;
      min-height: 0;
    }

    .progress-panel {
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: minmax(190px, 320px) minmax(0, 1fr);
      align-items: center;
      gap: var(--ha-space-4, 16px);
      border-bottom: 1px solid var(--haos-divider);
      background: var(--haos-surface);
    }

    .progress-copy {
      display: grid;
      gap: 2px;
      font-size: var(--ha-font-size-s, 13px);
    }

    .progress-copy span {
      color: var(--haos-muted);
      text-transform: capitalize;
    }

    .progress-track {
      height: 4px;
      overflow: hidden;
      border-radius: var(--ha-border-radius-pill, 999px);
      background: var(--haos-surface-lower);
    }

    .progress-track span {
      width: var(--progress);
      height: 100%;
      display: block;
      border-radius: inherit;
      background: var(--haos-primary);
      transition: width 180ms cubic-bezier(0.2, 0, 0, 1);
    }

    .alert {
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      color: var(--haos-error);
      background: var(--haos-error-soft);
      border-bottom: 1px solid var(--haos-divider);
      font-size: var(--ha-font-size-m, 14px);
    }

    .inbox-layout,
    .activity-layout {
      height: calc(100dvh - var(--ha-top-app-bar-height, 64px));
      min-height: 520px;
      display: grid;
      grid-template-columns: minmax(320px, 400px) minmax(0, 1fr);
    }

    .list-pane,
    .thread-pane {
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
      background: var(--haos-surface);
      border-inline-end: 1px solid var(--haos-divider);
    }

    .pane-heading {
      min-height: 80px;
      padding: var(--ha-space-4, 16px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      border-bottom: 1px solid var(--haos-divider);
    }

    .pane-heading h2 {
      font-size: var(--ha-font-size-xl, 20px);
    }

    .pane-heading p,
    .settings-heading p,
    .conversation-header p {
      margin-top: var(--ha-space-1, 4px);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      line-height: var(--ha-line-height-normal, 1.5);
    }

    .total {
      color: var(--haos-muted);
      font-variant-numeric: tabular-nums;
    }

    .inbox-heading-actions {
      display: flex;
      align-items: center;
      gap: var(--ha-space-1, 4px);
    }

    .filters {
      padding: var(--ha-space-2, 8px);
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: var(--ha-space-1, 4px);
      border-bottom: 1px solid var(--haos-divider);
    }

    .filters button {
      min-width: 0;
      min-height: 36px;
      padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: var(--ha-space-1, 4px);
      border: 0;
      border-radius: var(--ha-border-radius-lg, 10px);
      background: transparent;
      color: var(--haos-muted);
      cursor: pointer;
      text-transform: capitalize;
      white-space: nowrap;
      font-size: var(--ha-font-size-s, 13px);
    }

    .filters button:hover {
      background: var(--haos-surface-low);
    }

    .filters button.active {
      color: var(--haos-primary);
      background: var(--haos-selected);
    }

    .filters button span {
      font-variant-numeric: tabular-nums;
    }

    .suggestion-list,
    .activity-list {
      overflow: auto;
    }

    .suggestion-row,
    .receipt-row {
      width: 100%;
      padding: var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: start;
      gap: var(--ha-space-3, 12px);
      border: 0;
      border-bottom: 1px solid var(--haos-divider);
      text-align: start;
      background: var(--haos-surface);
      cursor: pointer;
    }

    .suggestion-row > ha-icon,
    .receipt-row > ha-icon:first-child {
      width: 24px;
      height: 24px;
      color: var(--haos-muted);
    }

    .suggestion-row:hover,
    .receipt-row:hover {
      background: var(--haos-surface-low);
    }

    .suggestion-row.selected,
    .receipt-row.selected {
      background: var(--haos-selected);
    }

    .suggestion-row.selected > ha-icon,
    .receipt-row.selected > ha-icon:first-child {
      color: var(--haos-primary);
    }

    .row-content,
    .receipt-row > span {
      min-width: 0;
      display: grid;
      gap: var(--ha-space-1, 4px);
    }

    .row-content strong,
    .receipt-row strong {
      line-height: var(--ha-line-height-condensed, 1.3);
      overflow-wrap: anywhere;
    }

    .summary {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      line-height: var(--ha-line-height-normal, 1.5);
    }

    .meta,
    .receipt-row small {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-xs, 11px);
      line-height: var(--ha-line-height-normal, 1.4);
      font-variant-numeric: tabular-nums;
    }

    .confidence {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-xs, 11px);
      font-variant-numeric: tabular-nums;
    }

    .detail-pane,
    .conversation-pane {
      min-width: 0;
      min-height: 0;
      overflow: auto;
      background: var(--haos-surface-low);
    }

    .detail-content {
      width: min(900px, calc(100% - var(--ha-space-12, 48px)));
      margin: 0 auto;
      padding: var(--ha-space-8, 32px) 0 var(--ha-space-16, 64px);
    }

    .mobile-back {
      display: none;
      margin-bottom: var(--ha-space-2, 8px);
    }

    .detail-heading {
      padding-bottom: var(--ha-space-6, 24px);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--ha-space-6, 24px);
    }

    .detail-title {
      min-width: 0;
      display: flex;
      align-items: flex-start;
      gap: var(--ha-space-4, 16px);
    }

    .detail-title p {
      max-width: 65ch;
      margin-top: var(--ha-space-2, 8px);
      color: var(--haos-muted);
      line-height: var(--ha-line-height-normal, 1.55);
    }

    .detail-icon {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      flex: 0 0 44px;
      border-radius: var(--ha-border-radius-xl, 12px);
      background: var(--haos-surface);
      color: var(--haos-muted);
      border: 1px solid var(--haos-divider);
    }

    .detail-icon.automation,
    .detail-icon.activity {
      color: var(--haos-primary);
      background: var(--haos-selected);
    }

    .status-badge,
    .read-only-badge,
    .saved-label {
      min-height: 28px;
      padding: 0 var(--ha-space-2, 8px);
      display: inline-flex;
      align-items: center;
      gap: var(--ha-space-1, 4px);
      border-radius: var(--ha-border-radius-pill, 999px);
      color: var(--haos-muted);
      background: var(--haos-surface-lower);
      white-space: nowrap;
      font-size: var(--ha-font-size-s, 13px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    .status-badge.high {
      color: var(--haos-warning);
      background: var(--haos-warning-soft);
    }

    .status-badge.valid,
    .saved-label,
    .read-only-badge {
      color: var(--haos-success);
      background: var(--haos-success-soft);
    }

    .status-badge.invalid {
      color: var(--haos-error);
      background: var(--haos-error-soft);
    }

    .detail-section {
      padding: var(--ha-space-6, 24px) 0;
      border-top: 1px solid var(--haos-divider);
    }

    .detail-section > p,
    .section-heading p {
      max-width: 72ch;
      margin-top: var(--ha-space-2, 8px);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-m, 14px);
      line-height: var(--ha-line-height-normal, 1.55);
    }

    .evidence-list {
      margin-top: var(--ha-space-4, 16px);
      border-top: 1px solid var(--haos-divider);
    }

    .evidence-row {
      padding: var(--ha-space-3, 12px) 0;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: start;
      gap: var(--ha-space-3, 12px);
      border-bottom: 1px solid var(--haos-divider);
    }

    .evidence-row > ha-icon {
      margin-top: 2px;
      color: var(--haos-muted);
    }

    .evidence-row strong {
      overflow-wrap: anywhere;
    }

    .evidence-row p,
    .evidence-row small {
      margin-top: var(--ha-space-1, 4px);
      display: block;
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      line-height: var(--ha-line-height-normal, 1.45);
    }

    .evidence-row small.evidence-unverified {
      color: var(--haos-warning, #c77700);
      font-style: italic;
    }

    .section-heading {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--ha-space-4, 16px);
    }

    .inline-error,
    .validation-errors {
      margin-top: var(--ha-space-3, 12px);
      padding: var(--ha-space-3, 12px);
      color: var(--haos-error);
      background: var(--haos-error-soft);
      border-radius: var(--ha-border-radius-lg, 10px);
      font-size: var(--ha-font-size-s, 13px);
    }

    .validation-errors p + p {
      margin-top: var(--ha-space-1, 4px);
    }

    .yaml-editor {
      min-height: 360px;
      margin-top: var(--ha-space-4, 16px);
      padding: var(--ha-space-4, 16px);
      resize: vertical;
      border-color: transparent;
      border-radius: var(--ha-border-radius-lg, 10px);
      color: var(--haos-code-text);
      background: var(--haos-code-surface);
      font-family: var(--ha-font-family-code, ui-monospace, monospace);
      font-size: var(--ha-font-size-s, 13px);
      line-height: 1.55;
      tab-size: 2;
      white-space: pre;
    }

    .yaml-editor:hover {
      background: var(--haos-code-surface);
    }

    .yaml-actions,
    .decision-actions,
    .conversation-actions {
      margin-top: var(--ha-space-3, 12px);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      flex-wrap: wrap;
    }

    .decision-bar {
      position: sticky;
      bottom: 0;
      margin-top: var(--ha-space-4, 16px);
      padding: var(--ha-space-3, 12px) 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ha-space-4, 16px);
      border-top: 1px solid var(--haos-divider);
      background: var(--haos-surface-low);
    }

    .decision-bar > span {
      display: inline-flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
    }

    .decision-actions {
      margin: 0;
    }

    .empty,
    .loading-state {
      height: 100%;
      min-height: 280px;
      padding: var(--ha-space-8, 32px);
      display: grid;
      place-content: center;
      justify-items: center;
      text-align: center;
      color: var(--haos-muted);
    }

    .empty > ha-icon,
    .chat-empty > ha-icon {
      width: 36px;
      height: 36px;
      margin-bottom: var(--ha-space-3, 12px);
      color: var(--haos-muted);
    }

    .empty .logo,
    .loading-state .logo {
      width: 54px;
      height: 54px;
      margin-bottom: var(--ha-space-3, 12px);
      opacity: 0.7;
    }

    .empty p,
    .loading-state p {
      max-width: 460px;
      margin-top: var(--ha-space-2, 8px);
      font-size: var(--ha-font-size-m, 14px);
      line-height: var(--ha-line-height-normal, 1.55);
    }

    .empty.compact {
      min-height: 240px;
      height: auto;
    }

    .chat-layout {
      height: calc(100dvh - var(--ha-top-app-bar-height, 64px));
      min-height: 520px;
      display: grid;
      grid-template-columns: minmax(240px, 300px) minmax(0, 1fr);
    }

    .thread-heading {
      min-height: 72px;
    }

    .thread-list {
      overflow: auto;
    }

    .thread-list button {
      width: 100%;
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: var(--ha-space-3, 12px);
      border: 0;
      background: transparent;
      text-align: start;
      cursor: pointer;
    }

    .thread-list button:hover {
      background: var(--haos-surface-low);
    }

    .thread-list button.selected {
      color: var(--haos-primary);
      background: var(--haos-selected);
    }

    .thread-list button span {
      min-width: 0;
      display: grid;
      gap: 2px;
    }

    .thread-list button strong {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .thread-list button small,
    .thread-empty {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-xs, 11px);
    }

    .thread-empty {
      padding: var(--ha-space-4, 16px);
    }

    .conversation-pane {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      overflow: hidden;
    }

    .conversation-header {
      min-height: 72px;
      padding: var(--ha-space-3, 12px) var(--ha-space-5, 20px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ha-space-4, 16px);
      border-bottom: 1px solid var(--haos-divider);
      background: var(--haos-surface);
    }

    .conversation-header h2 {
      font-size: var(--ha-font-size-l, 16px);
    }

    .conversation-actions {
      margin: 0;
      flex-wrap: nowrap;
    }

    .messages {
      padding: var(--ha-space-6, 24px);
      overflow: auto;
    }

    .message {
      width: min(760px, 92%);
      margin-bottom: var(--ha-space-5, 20px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: var(--ha-space-3, 12px);
    }

    .message.user {
      margin-inline-start: auto;
    }

    .message-avatar,
    .message-avatar .logo {
      width: 32px;
      height: 32px;
    }

    .message-avatar {
      display: grid;
      place-items: center;
      color: var(--haos-muted);
    }

    .message strong {
      font-size: var(--ha-font-size-s, 13px);
    }

    .message p {
      margin-top: var(--ha-space-1, 4px);
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      border-radius: var(--ha-border-radius-xl, 12px);
      background: var(--haos-surface);
      line-height: var(--ha-line-height-normal, 1.6);
      white-space: pre-wrap;
    }

    .message.user p {
      background: var(--haos-selected);
    }

    .message.pending {
      opacity: 0.7;
    }

    .message-actions {
      margin-top: var(--ha-space-2, 8px);
    }

    .message-hint {
      margin-top: var(--ha-space-1, 4px);
      display: block;
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
    }

    .composer {
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      gap: var(--ha-space-3, 12px);
      border-top: 1px solid var(--haos-divider);
      background: var(--haos-surface);
    }

    .composer textarea {
      min-height: 48px;
      max-height: 180px;
      padding: var(--ha-space-3, 12px);
      resize: vertical;
      line-height: var(--ha-line-height-normal, 1.45);
    }

    .activity-list {
      display: block;
    }

    .receipt-row > ha-icon:last-child {
      color: var(--haos-muted);
    }

    .stats-list,
    .settings-list {
      margin: 0;
      border-top: 1px solid var(--haos-divider);
    }

    .stats-list > div,
    .settings-list > div {
      padding: var(--ha-space-3, 12px) 0;
      display: flex;
      justify-content: space-between;
      gap: var(--ha-space-4, 16px);
      border-bottom: 1px solid var(--haos-divider);
    }

    dt {
      color: var(--haos-muted);
    }

    dd {
      margin: 0;
      text-align: end;
      overflow-wrap: anywhere;
      font-variant-numeric: tabular-nums;
    }

    .compact-stats {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .compact-stats > div:nth-child(odd) {
      padding-inline-end: var(--ha-space-4, 16px);
      border-inline-end: 1px solid var(--haos-divider);
    }

    .compact-stats > div:nth-child(even) {
      padding-inline-start: var(--ha-space-4, 16px);
    }

    .chip-list {
      margin-top: var(--ha-space-3, 12px);
      display: flex;
      flex-wrap: wrap;
      gap: var(--ha-space-2, 8px);
    }

    .chip-list span {
      padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
      border-radius: var(--ha-border-radius-pill, 999px);
      background: var(--haos-surface-lower);
      font-size: var(--ha-font-size-s, 13px);
      text-transform: capitalize;
    }

    .detail-section ul {
      margin: var(--ha-space-3, 12px) 0 0;
      padding-inline-start: var(--ha-space-5, 20px);
      color: var(--haos-muted);
    }

    details {
      margin-top: var(--ha-space-3, 12px);
    }

    summary {
      cursor: pointer;
      color: var(--haos-primary);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    pre {
      max-height: 480px;
      margin: var(--ha-space-3, 12px) 0 0;
      padding: var(--ha-space-4, 16px);
      overflow: auto;
      border-radius: var(--ha-border-radius-lg, 10px);
      color: var(--haos-code-text);
      background: var(--haos-code-surface);
      font-family: var(--ha-font-family-code, ui-monospace, monospace);
      font-size: var(--ha-font-size-s, 13px);
      line-height: 1.55;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .settings-layout {
      width: min(980px, calc(100% - var(--ha-space-8, 32px)));
      margin: 0 auto;
      padding: var(--ha-space-8, 32px) 0 var(--ha-space-16, 64px);
    }

    .settings-heading {
      margin-bottom: var(--ha-space-6, 24px);
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: var(--ha-space-4, 16px);
    }

    .settings-heading p {
      margin-top: var(--ha-space-1, 4px);
      color: var(--haos-muted);
    }

    .version-badge {
      padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
      border-radius: var(--ha-border-radius-pill, 999px);
      background: var(--haos-surface-lower);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      white-space: nowrap;
    }

    .settings-notice {
      margin-bottom: var(--ha-space-4, 16px);
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      border: 1px solid color-mix(in srgb, var(--haos-success) 30%, var(--haos-divider));
      border-radius: var(--ha-border-radius-lg, 10px);
      background: var(--haos-success-soft);
      color: var(--haos-success);
      font-size: var(--ha-font-size-s, 13px);
    }

    .settings-section {
      display: block;
      margin-bottom: var(--ha-space-4, 16px);
      overflow: hidden;
    }

    .settings-section-title {
      padding: var(--ha-space-5, 20px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      gap: var(--ha-space-3, 12px);
      border-bottom: 1px solid var(--haos-divider);
    }

    .settings-section-title > ha-icon {
      color: var(--haos-primary);
    }

    .settings-section-title p {
      margin-top: var(--ha-space-1, 4px);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
    }

    .approval-banner {
      padding: var(--ha-space-3, 12px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      gap: var(--ha-space-3, 12px);
      border: 1px solid color-mix(in srgb, var(--haos-primary) 30%, var(--haos-divider));
      border-radius: var(--ha-border-radius-lg, 10px);
      color: var(--haos-text);
      background: var(--haos-selected);
      line-height: var(--ha-line-height-normal, 1.5);
      font-size: var(--ha-font-size-s, 13px);
    }

    .approval-settings > .approval-banner {
      margin: var(--ha-space-5, 20px);
    }

    .approval-banner > ha-icon {
      color: var(--haos-primary);
    }

    .approval-banner span {
      display: grid;
      gap: 2px;
    }

    .capability-list {
      margin-top: 0;
      border-top: 0;
    }

    .settings-fields,
    .goal-grid,
    .settings-subsection,
    .toggle-list,
    .settings-action,
    .about-actions,
    .advanced-toggle {
      margin-inline: var(--ha-space-5, 20px);
    }

    .settings-fields {
      padding-top: var(--ha-space-5, 20px);
      display: grid;
      gap: var(--ha-space-4, 16px);
    }

    .settings-fields.two-column {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .settings-fields.three-column {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .settings-fields.compact-fields {
      max-width: 420px;
    }

    .settings-fields label,
    .dialog-content label {
      min-width: 0;
      display: grid;
      align-content: start;
      gap: var(--ha-space-2, 8px);
      font-weight: var(--ha-font-weight-medium, 500);
    }

    .settings-fields input,
    .settings-fields select {
      min-width: 0;
      min-height: 44px;
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      color: var(--haos-text);
      background: var(--haos-surface);
    }

    .settings-fields small,
    .field-help,
    .settings-action > span {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      font-weight: var(--ha-font-weight-normal, 400);
      line-height: var(--ha-line-height-normal, 1.45);
    }

    .disabled-field {
      opacity: 0.55;
    }

    .advanced-toggle {
      min-height: 40px;
      margin-top: var(--ha-space-3, 12px);
      padding: var(--ha-space-2, 8px) 0;
      display: flex;
      align-items: center;
      gap: var(--ha-space-1, 4px);
      border: 0;
      background: transparent;
      color: var(--haos-primary);
      cursor: pointer;
    }

    .advanced-fields {
      padding-top: var(--ha-space-2, 8px);
    }

    .settings-action {
      padding: var(--ha-space-4, 16px) 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--ha-space-3, 12px);
      border-top: 1px solid var(--haos-divider);
    }

    .settings-action > span {
      margin-inline-end: auto;
    }

    .goal-grid {
      padding: var(--ha-space-5, 20px) 0;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--ha-space-2, 8px);
    }

    .choice-card {
      margin: 0;
      min-width: 0;
    }

    .choice-card > input {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      opacity: 0;
      pointer-events: none;
    }

    .choice-control {
      min-height: 48px;
      padding: var(--ha-space-3, 12px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-lg, 10px);
      background: var(--haos-surface);
      cursor: pointer;
      line-height: var(--ha-line-height-normal, 1.35);
    }

    .choice-card > input:checked + .choice-control {
      border-color: color-mix(in srgb, var(--haos-primary) 55%, var(--haos-divider));
      background: var(--haos-selected);
      color: var(--haos-primary);
    }

    .choice-card > input:focus-visible + .choice-control {
      outline: 2px solid var(--haos-primary);
      outline-offset: 2px;
    }

    .imported-goals,
    .entity-chips {
      margin: 0 var(--ha-space-5, 20px) var(--ha-space-4, 16px);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ha-space-2, 8px);
    }

    .imported-goals > span {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
    }

    .imported-goals button {
      min-height: 32px;
      padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-1, 4px);
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-pill, 999px);
      background: var(--haos-surface);
      cursor: pointer;
    }

    .imported-goals ha-icon {
      --mdc-icon-size: 16px;
    }

    .settings-subsection {
      padding: var(--ha-space-5, 20px) 0;
      border-top: 1px solid var(--haos-divider);
    }

    .settings-subsection h4 {
      margin: 0;
      font-size: var(--ha-font-size-m, 14px);
    }

    .settings-subsection > .settings-fields {
      margin-inline: 0;
    }

    .field-help {
      margin-top: var(--ha-space-1, 4px);
    }

    .toggle-list {
      padding: var(--ha-space-4, 16px) 0;
      display: grid;
      gap: var(--ha-space-3, 12px);
    }

    .toggle-list label {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      gap: var(--ha-space-3, 12px);
      cursor: pointer;
    }

    .toggle-list input {
      width: 20px;
      height: 20px;
      margin: 1px 0 0;
      accent-color: var(--haos-primary);
    }

    .toggle-list label > span {
      display: grid;
      gap: 2px;
    }

    .toggle-list small {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      font-weight: var(--ha-font-weight-normal, 400);
    }

    .divided-toggles {
      margin-top: var(--ha-space-4, 16px);
      border-top: 1px solid var(--haos-divider);
    }

    .entity-picker {
      position: relative;
      margin-top: var(--ha-space-3, 12px);
    }

    .entity-picker > ha-icon {
      position: absolute;
      z-index: 1;
      inset: 12px auto auto 12px;
      color: var(--haos-muted);
      pointer-events: none;
    }

    .entity-picker > input {
      min-height: 48px;
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px) var(--ha-space-2, 8px) 44px;
      background: var(--haos-surface);
    }

    .entity-results {
      position: absolute;
      z-index: 5;
      inset: calc(100% + 4px) 0 auto;
      max-height: 320px;
      overflow: auto;
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-lg, 10px);
      background: var(--haos-surface);
      box-shadow: var(--ha-card-box-shadow, 0 4px 14px color-mix(in srgb, var(--haos-text) 16%, transparent));
    }

    .entity-results button {
      width: 100%;
      min-height: 52px;
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      border: 0;
      border-bottom: 1px solid var(--haos-divider);
      background: transparent;
      text-align: start;
      cursor: pointer;
    }

    .entity-results button:last-child {
      border-bottom: 0;
    }

    .entity-results button.active {
      background: var(--haos-selected);
    }

    .entity-results button:hover {
      background: var(--haos-selected);
    }

    .entity-results button > span,
    .entity-chips > span > span {
      min-width: 0;
      display: grid;
      gap: 2px;
    }

    .entity-results small,
    .entity-results em,
    .entity-chips small {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-xs, 11px);
      font-style: normal;
      overflow-wrap: anywhere;
    }

    .field-error {
      margin: var(--ha-space-2, 8px) 0 0;
      min-height: 1lh;
      color: var(--haos-error);
      font-size: var(--ha-font-size-s, 13px);
    }

    .field-error:empty {
      visibility: hidden;
    }

    .entity-chips {
      margin-inline: 0;
      margin-top: var(--ha-space-3, 12px);
      margin-bottom: 0;
    }

    .entity-chips > span {
      max-width: 100%;
      padding: var(--ha-space-2, 8px) var(--ha-space-2, 8px) var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-lg, 10px);
      background: var(--haos-surface);
    }

    .entity-chips > span.unavailable {
      border-style: dashed;
    }

    .entity-chips button {
      width: 28px;
      height: 28px;
      padding: 0;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: 50%;
      background: transparent;
      cursor: pointer;
    }

    .entity-chips button:hover {
      background: var(--haos-surface-lower);
    }

    .entity-chips button ha-icon {
      --mdc-icon-size: 18px;
    }

    .about-actions {
      padding: var(--ha-space-4, 16px) 0;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--ha-space-2, 8px);
    }

    .about-actions a {
      min-height: 44px;
      padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      border: 1px solid var(--haos-divider);
      border-radius: var(--ha-border-radius-lg, 10px);
      color: var(--haos-text);
      text-decoration: none;
      white-space: nowrap;
    }

    .about-actions a:hover {
      background: var(--haos-selected);
      color: var(--haos-primary);
    }

    .dialog-content {
      color: var(--haos-text);
    }

    .dialog-content > p {
      color: var(--haos-muted);
      line-height: var(--ha-line-height-normal, 1.55);
    }

    .approval-review {
      display: grid;
      gap: var(--ha-space-4, 16px);
    }

    .approval-review dl {
      margin: 0;
      border-top: 1px solid var(--haos-divider);
    }

    .approval-review dl > div {
      padding: var(--ha-space-3, 12px) 0;
      display: grid;
      grid-template-columns: minmax(100px, 0.35fr) minmax(0, 1fr);
      gap: var(--ha-space-3, 12px);
      border-bottom: 1px solid var(--haos-divider);
    }

    .approval-review dt {
      color: var(--haos-muted);
    }

    .approval-review dd {
      min-width: 0;
      margin: 0;
      overflow-wrap: anywhere;
    }

    .danger-copy {
      color: var(--haos-error) !important;
    }

    .muted {
      color: var(--haos-muted);
      font-size: var(--ha-font-size-m, 14px);
    }

    /* Budget · F2 */
    .budget-banner {
      display: flex;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      padding: var(--ha-space-3, 12px) var(--ha-space-4, 16px);
      border-bottom: 1px solid var(--haos-divider);
      background: var(--haos-warning-soft);
      color: var(--haos-text);
      font-size: var(--ha-font-size-m, 14px);
    }

    .budget-banner.exceeded {
      background: var(--haos-error-soft);
    }

    .budget-banner ha-icon {
      flex: none;
      color: var(--haos-warning);
    }

    .budget-banner.exceeded ha-icon {
      color: var(--haos-error);
    }

    .budget-banner span {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .budget-banner small {
      color: var(--haos-muted);
      font-variant-numeric: tabular-nums;
    }

    .budget-meter {
      margin-top: var(--ha-space-3, 12px);
      height: 8px;
      border-radius: 999px;
      background: var(--haos-surface-lower);
      overflow: hidden;
    }

    .budget-meter > span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--haos-primary);
    }

    .budget-meter.warning > span {
      background: var(--haos-warning);
    }

    .budget-meter.exceeded > span {
      background: var(--haos-error);
    }

    .readonly-field output {
      display: block;
      padding: var(--ha-space-2, 8px) 0;
      font-size: var(--ha-font-size-l, 16px);
      font-variant-numeric: tabular-nums;
    }

    /* Applied-change outcomes · F6 */
    .applied-list {
      list-style: none;
      margin: var(--ha-space-3, 12px) 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .applied-list li {
      display: flex;
      gap: var(--ha-space-3, 12px);
      padding: var(--ha-space-3, 12px) 0;
      border-top: 1px solid var(--haos-divider);
    }

    .applied-body {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .applied-body small {
      color: var(--haos-muted);
      overflow-wrap: anywhere;
    }

    .applied-outcome {
      flex: none;
      align-self: flex-start;
      padding: 2px var(--ha-space-2, 8px);
      border-radius: var(--ha-border-radius-sm, 4px);
      background: var(--haos-surface-lower);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 12px);
      white-space: nowrap;
    }

    .applied-outcome.kept {
      background: var(--haos-success-soft);
      color: var(--haos-success);
    }

    .applied-outcome.disabled,
    .applied-outcome.reverted {
      background: var(--haos-warning-soft);
      color: var(--haos-warning);
    }

    /* Automation diff · F5 */
    .diff-section {
      margin-top: var(--ha-space-4, 16px);
    }

    .diff-legend {
      display: flex;
      gap: var(--ha-space-3, 12px);
      margin-bottom: var(--ha-space-2, 8px);
      font-size: var(--ha-font-size-s, 12px);
      color: var(--haos-muted);
    }

    .diff-legend .removed::before,
    .diff-legend .added::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: var(--ha-space-1, 4px);
      border-radius: 2px;
      vertical-align: middle;
    }

    .diff-legend .removed::before {
      background: var(--haos-error);
    }

    .diff-legend .added::before {
      background: var(--haos-success);
    }

    pre.diff {
      max-height: 320px;
      overflow: auto;
      margin: 0;
      padding: 0;
      background: var(--haos-code-surface);
      color: var(--haos-code-text);
      border-radius: var(--ha-border-radius-md, 8px);
    }

    .diff-line {
      display: block;
      padding: 0 var(--ha-space-3, 12px);
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .diff-line.added {
      background: color-mix(in srgb, var(--haos-success) 26%, transparent);
    }

    .diff-line.removed {
      background: color-mix(in srgb, var(--haos-error) 26%, transparent);
    }

    /* Ignore scopes · F8 */
    .enforced-note {
      display: flex;
      align-items: flex-start;
      gap: var(--ha-space-2, 8px);
    }

    .enforced-note ha-icon {
      flex: none;
      --mdc-icon-size: 18px;
      color: var(--haos-success);
    }

    .category-list {
      margin-top: var(--ha-space-4, 16px);
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      border-top: 1px solid var(--haos-divider);
    }

    .category-list > div {
      padding: var(--ha-space-3, 12px) 0;
      display: flex;
      align-items: center;
      gap: var(--ha-space-2, 8px);
      border-bottom: 1px solid var(--haos-divider);
      text-transform: capitalize;
      font-size: var(--ha-font-size-m, 14px);
    }

    .category-list > div:nth-child(odd) {
      padding-inline-end: var(--ha-space-3, 12px);
    }

    .category-list > div:nth-child(even) {
      padding-inline-start: var(--ha-space-3, 12px);
    }

    .category-list ha-icon,
    .privacy-note > ha-icon {
      color: var(--haos-success);
    }

    .privacy-note {
      margin-top: var(--ha-space-4, 16px);
      padding: var(--ha-space-3, 12px);
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: var(--ha-space-3, 12px);
      align-items: start;
      border-radius: var(--ha-border-radius-lg, 10px);
      background: var(--haos-success-soft);
      color: var(--haos-muted);
      font-size: var(--ha-font-size-s, 13px);
      line-height: var(--ha-line-height-normal, 1.5);
    }

    .feedback-options {
      display: grid;
      gap: var(--ha-space-1, 4px);
    }

    .feedback-options > button {
      min-height: 44px;
      padding: var(--ha-space-2, 8px);
      display: flex;
      align-items: center;
      gap: var(--ha-space-3, 12px);
      border: 0;
      border-radius: var(--ha-border-radius-lg, 10px);
      background: transparent;
      text-align: start;
      cursor: pointer;
    }

    .feedback-options > button:hover,
    .feedback-options > button.selected {
      background: var(--haos-selected);
    }

    .feedback-options label textarea {
      min-height: 84px;
      margin-top: var(--ha-space-2, 8px);
      padding: var(--ha-space-3, 12px);
      resize: vertical;
    }

    .dialog-content input {
      height: 44px;
      margin-top: var(--ha-space-2, 8px);
      padding: 0 var(--ha-space-3, 12px);
    }

    @media (max-width: 900px) {
      .app-header {
        min-height: auto;
        padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px) 0;
        grid-template-columns: minmax(0, 1fr) auto;
        grid-template-areas:
          "title scan"
          "tabs tabs";
        gap: 0 var(--ha-space-2, 8px);
      }

      .title-lockup {
        grid-area: title;
      }

      .title-lockup .logo {
        width: 32px;
        height: 32px;
        flex-basis: 32px;
      }

      .scan-action {
        grid-area: scan;
      }

      .tabs {
        grid-area: tabs;
        height: 44px;
        justify-content: flex-start;
        overflow-x: auto;
        scrollbar-width: none;
      }

      .tabs::-webkit-scrollbar {
        display: none;
      }

      .tabs button {
        min-width: auto;
        flex: 1 0 auto;
      }

      .progress-panel {
        grid-template-columns: 1fr;
        gap: var(--ha-space-2, 8px);
      }

      .inbox-layout,
      .activity-layout,
      .chat-layout {
        height: auto;
        min-height: calc(100dvh - 100px);
        grid-template-columns: 1fr;
      }

      .inbox-layout .detail-pane,
      .activity-layout .detail-pane {
        display: none;
      }

      .inbox-layout.has-selection .list-pane,
      .activity-layout.has-selection .list-pane {
        display: none;
      }

      .inbox-layout.has-selection .detail-pane,
      .activity-layout.has-selection .detail-pane {
        display: block;
      }

      .list-pane,
      .thread-pane {
        border-inline-end: 0;
      }

      .detail-content {
        width: calc(100% - var(--ha-space-6, 24px));
        padding-top: var(--ha-space-4, 16px);
      }

      .mobile-back {
        display: inline-flex;
      }

      .detail-heading,
      .section-heading {
        flex-direction: column;
      }

      .detail-title {
        align-items: flex-start;
      }

      .decision-bar {
        position: static;
        flex-direction: column;
        align-items: stretch;
      }

      .decision-actions {
        justify-content: stretch;
      }

      .decision-actions ha-button[appearance="accent"] {
        flex: 1 1 auto;
      }

      .thread-pane {
        max-height: 150px;
        display: block;
        border-bottom: 1px solid var(--haos-divider);
      }

      .thread-heading {
        min-height: 52px;
        padding-block: var(--ha-space-2, 8px);
      }

      .thread-list {
        display: flex;
        overflow-x: auto;
      }

      .thread-list button {
        width: 220px;
        flex: 0 0 220px;
        border-inline-end: 1px solid var(--haos-divider);
      }

      .conversation-pane {
        min-height: calc(100dvh - 250px);
      }

      .conversation-header {
        align-items: flex-start;
      }

      .read-only-badge {
        display: none;
      }

      .messages {
        padding: var(--ha-space-4, 16px) var(--ha-space-3, 12px);
      }

      .message {
        width: 100%;
      }

      .composer {
        position: sticky;
        bottom: 0;
      }

      .compact-stats {
        grid-template-columns: 1fr;
      }

      .compact-stats > div:nth-child(n) {
        padding-inline: 0;
        border-inline-end: 0;
      }

      .category-list {
        grid-template-columns: 1fr;
      }

      .category-list > div:nth-child(n) {
        padding-inline: 0;
      }

      .yaml-actions {
        justify-content: flex-start;
      }

      .settings-layout {
        width: calc(100% - var(--ha-space-6, 24px));
        padding-top: var(--ha-space-4, 16px);
      }

      .settings-fields.three-column {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .about-actions {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 700px) {
      .settings-heading {
        align-items: start;
      }

      .settings-fields.two-column,
      .settings-fields.three-column,
      .goal-grid {
        grid-template-columns: 1fr;
      }

      .settings-action {
        align-items: stretch;
        flex-direction: column;
      }

      .settings-action > span {
        margin-inline-end: 0;
      }

      .settings-action ha-button {
        align-self: stretch;
      }
    }

    @media (max-width: 420px) {
      .app-header h1 {
        font-size: var(--ha-font-size-l, 16px);
      }

      .tabs button {
        padding-inline: var(--ha-space-2, 8px);
      }

      .filters {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .detail-title {
        gap: var(--ha-space-3, 12px);
      }

      .detail-icon {
        width: 38px;
        height: 38px;
        flex-basis: 38px;
      }

      .composer {
        grid-template-columns: 1fr;
      }

      .composer ha-button {
        justify-self: stretch;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
      }
    }
  `;
	}
};
Q([Re({ attribute: !1 })], $.prototype, "hass", void 0), Q([Re({ attribute: !1 })], $.prototype, "panel", void 0), Q([j()], $.prototype, "overview", void 0), Q([j()], $.prototype, "tab", void 0), Q([j()], $.prototype, "filter", void 0), Q([j()], $.prototype, "selectedId", void 0), Q([j()], $.prototype, "loading", void 0), Q([j()], $.prototype, "busy", void 0), Q([j()], $.prototype, "dialogPending", void 0), Q([j()], $.prototype, "entityHighlight", void 0), Q([j()], $.prototype, "error", void 0), Q([j()], $.prototype, "preview", void 0), Q([j()], $.prototype, "progress", void 0), Q([j()], $.prototype, "chat", void 0), Q([j()], $.prototype, "chatText", void 0), Q([j()], $.prototype, "threadId", void 0), Q([j()], $.prototype, "threads", void 0), Q([j()], $.prototype, "activity", void 0), Q([j()], $.prototype, "receipt", void 0), Q([j()], $.prototype, "selectedReceiptId", void 0), Q([j()], $.prototype, "selectedGoals", void 0), Q([j()], $.prototype, "ignoredEntities", void 0), Q([j()], $.prototype, "ignoredEntityQuery", void 0), Q([j()], $.prototype, "ignoredEntityError", void 0), Q([j()], $.prototype, "ignoredDomains", void 0), Q([j()], $.prototype, "ignoredAreas", void 0), Q([j()], $.prototype, "ignoredLabels", void 0), Q([j()], $.prototype, "ignoredDomainQuery", void 0), Q([j()], $.prototype, "ignoredAreaQuery", void 0), Q([j()], $.prototype, "ignoredLabelQuery", void 0), Q([j()], $.prototype, "monthlyTokenBudget", void 0), Q([j()], $.prototype, "advisorMode", void 0), Q([j()], $.prototype, "scanDepth", void 0), Q([j()], $.prototype, "automationComplexity", void 0), Q([j()], $.prototype, "fixExistingFirst", void 0), Q([j()], $.prototype, "avoidNewHardware", void 0), Q([j()], $.prototype, "changePermissions", void 0), Q([j()], $.prototype, "quietStart", void 0), Q([j()], $.prototype, "quietEnd", void 0), Q([j()], $.prototype, "providerDraft", void 0), Q([j()], $.prototype, "modelDraft", void 0), Q([j()], $.prototype, "baseUrlDraft", void 0), Q([j()], $.prototype, "apiKeyDraft", void 0), Q([j()], $.prototype, "showConnectionAdvanced", void 0), Q([j()], $.prototype, "historyDays", void 0), Q([j()], $.prototype, "includeExactLocation", void 0), Q([j()], $.prototype, "schedule", void 0), Q([j()], $.prototype, "scheduleTime", void 0), Q([j()], $.prototype, "scheduleWeekday", void 0), Q([j()], $.prototype, "notifyNewSuggestions", void 0), Q([j()], $.prototype, "settingsNotice", void 0), Q([j()], $.prototype, "copied", void 0), Q([j()], $.prototype, "draftYaml", void 0), Q([j()], $.prototype, "draftValidation", void 0), Q([j()], $.prototype, "draftError", void 0), Q([j()], $.prototype, "dialog", void 0), Q([j()], $.prototype, "feedbackReason", void 0), Q([j()], $.prototype, "feedbackNote", void 0), Q([j()], $.prototype, "renameText", void 0), Q([j()], $.prototype, "pendingChange", void 0), Q([j()], $.prototype, "scanProfileEnabled", void 0), Q([j()], $.prototype, "scanProviderDraft", void 0), Q([j()], $.prototype, "scanModelDraft", void 0), Q([j()], $.prototype, "scanBaseUrlDraft", void 0), Q([j()], $.prototype, "scanApiKeyDraft", void 0), Q([j()], $.prototype, "diffLines", void 0), Q([j()], $.prototype, "diffError", void 0), Q([j()], $.prototype, "diffLoading", void 0), $ = Q([Fe("haos-ai-panel")], $);
//#endregion
export { $ as HaosAiPanel };
