const Fe = globalThis, _t = Fe.ShadowRoot && (Fe.ShadyCSS === void 0 || Fe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, St = /* @__PURE__ */ Symbol(), Vt = /* @__PURE__ */ new WeakMap();
let ms = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== St) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (_t && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = Vt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Vt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const oi = (s) => new ms(typeof s == "string" ? s : s + "", void 0, St), li = (s, ...e) => {
  const t = s.length === 1 ? s[0] : e.reduce((i, a, n) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + s[n + 1], s[0]);
  return new ms(t, s, St);
}, ci = (s, e) => {
  if (_t) s.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), a = Fe.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = t.cssText, s.appendChild(i);
  }
}, Wt = _t ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return oi(t);
})(s) : s;
const { is: di, defineProperty: hi, getOwnPropertyDescriptor: pi, getOwnPropertyNames: ui, getOwnPropertySymbols: fi, getPrototypeOf: gi } = Object, et = globalThis, Gt = et.trustedTypes, mi = Gt ? Gt.emptyScript : "", yi = et.reactiveElementPolyfillSupport, Ae = (s, e) => s, Ge = { toAttribute(s, e) {
  switch (e) {
    case Boolean:
      s = s ? mi : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, e) {
  let t = s;
  switch (e) {
    case Boolean:
      t = s !== null;
      break;
    case Number:
      t = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(s);
      } catch {
        t = null;
      }
  }
  return t;
} }, At = (s, e) => !di(s, e), Qt = { attribute: !0, type: String, converter: Ge, reflect: !1, useDefault: !1, hasChanged: At };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), et.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let oe = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Qt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), a = this.getPropertyDescriptor(e, i, t);
      a !== void 0 && hi(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: a, set: n } = pi(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: a, set(r) {
      const o = a?.call(this);
      n?.call(this, r), this.requestUpdate(e, o, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Qt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ae("elementProperties"))) return;
    const e = gi(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ae("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ae("properties"))) {
      const t = this.properties, i = [...ui(t), ...fi(t)];
      for (const a of i) this.createProperty(a, t[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, a] of t) this.elementProperties.set(i, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const a = this._$Eu(t, i);
      a !== void 0 && this._$Eh.set(a, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const a of i) t.unshift(Wt(a));
    } else e !== void 0 && t.push(Wt(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
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
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ci(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    const i = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, i);
    if (a !== void 0 && i.reflect === !0) {
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : Ge).toAttribute(t, i.type);
      this._$Em = e, n == null ? this.removeAttribute(a) : this.setAttribute(a, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, a = i._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const n = i.getPropertyOptions(a), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : Ge;
      this._$Em = a;
      const o = r.fromAttribute(t, n.type);
      this[a] = o ?? this._$Ej?.get(a) ?? o, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, a = !1, n) {
    if (e !== void 0) {
      const r = this.constructor;
      if (a === !1 && (n = this[e]), i ??= r.getPropertyOptions(e), !((i.hasChanged ?? At)(n, t) || i.useDefault && i.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(r._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: a, wrapped: n }, r) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), n !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), a === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [a, n] of this._$Ep) this[a] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, n] of i) {
        const { wrapped: r } = n, o = this[a];
        r !== !0 || this._$AL.has(a) || o === void 0 || this.C(a, void 0, n, o);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
oe.elementStyles = [], oe.shadowRootOptions = { mode: "open" }, oe[Ae("elementProperties")] = /* @__PURE__ */ new Map(), oe[Ae("finalized")] = /* @__PURE__ */ new Map(), yi?.({ ReactiveElement: oe }), (et.reactiveElementVersions ??= []).push("2.1.2");
const Et = globalThis, Jt = (s) => s, Qe = Et.trustedTypes, Xt = Qe ? Qe.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, ys = "$lit$", G = `lit$${Math.random().toFixed(9).slice(2)}$`, vs = "?" + G, vi = `<${vs}>`, se = document, Oe = () => se.createComment(""), Ie = (s) => s === null || typeof s != "object" && typeof s != "function", Nt = Array.isArray, bi = (s) => Nt(s) || typeof s?.[Symbol.iterator] == "function", ht = `[ 	
\f\r]`, xe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Zt = /-->/g, es = />/g, J = RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ts = /'/g, ss = /"/g, bs = /^(?:script|style|textarea|title)$/i, wi = (s) => (e, ...t) => ({ _$litType$: s, strings: e, values: t }), m = wi(1), ue = /* @__PURE__ */ Symbol.for("lit-noChange"), _ = /* @__PURE__ */ Symbol.for("lit-nothing"), is = /* @__PURE__ */ new WeakMap(), Z = se.createTreeWalker(se, 129);
function ws(s, e) {
  if (!Nt(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Xt !== void 0 ? Xt.createHTML(e) : e;
}
const $i = (s, e) => {
  const t = s.length - 1, i = [];
  let a, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = xe;
  for (let o = 0; o < t; o++) {
    const l = s[o];
    let c, u, d = -1, h = 0;
    for (; h < l.length && (r.lastIndex = h, u = r.exec(l), u !== null); ) h = r.lastIndex, r === xe ? u[1] === "!--" ? r = Zt : u[1] !== void 0 ? r = es : u[2] !== void 0 ? (bs.test(u[2]) && (a = RegExp("</" + u[2], "g")), r = J) : u[3] !== void 0 && (r = J) : r === J ? u[0] === ">" ? (r = a ?? xe, d = -1) : u[1] === void 0 ? d = -2 : (d = r.lastIndex - u[2].length, c = u[1], r = u[3] === void 0 ? J : u[3] === '"' ? ss : ts) : r === ss || r === ts ? r = J : r === Zt || r === es ? r = xe : (r = J, a = void 0);
    const f = r === J && s[o + 1].startsWith("/>") ? " " : "";
    n += r === xe ? l + vi : d >= 0 ? (i.push(c), l.slice(0, d) + ys + l.slice(d) + G + f) : l + G + (d === -2 ? o : f);
  }
  return [ws(s, n + (s[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Ce {
  constructor({ strings: e, _$litType$: t }, i) {
    let a;
    this.parts = [];
    let n = 0, r = 0;
    const o = e.length - 1, l = this.parts, [c, u] = $i(e, t);
    if (this.el = Ce.createElement(c, i), Z.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (a = Z.nextNode()) !== null && l.length < o; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const d of a.getAttributeNames()) if (d.endsWith(ys)) {
          const h = u[r++], f = a.getAttribute(d).split(G), v = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: n, name: v[2], strings: f, ctor: v[1] === "." ? ki : v[1] === "?" ? _i : v[1] === "@" ? Si : tt }), a.removeAttribute(d);
        } else d.startsWith(G) && (l.push({ type: 6, index: n }), a.removeAttribute(d));
        if (bs.test(a.tagName)) {
          const d = a.textContent.split(G), h = d.length - 1;
          if (h > 0) {
            a.textContent = Qe ? Qe.emptyScript : "";
            for (let f = 0; f < h; f++) a.append(d[f], Oe()), Z.nextNode(), l.push({ type: 2, index: ++n });
            a.append(d[h], Oe());
          }
        }
      } else if (a.nodeType === 8) if (a.data === vs) l.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = a.data.indexOf(G, d + 1)) !== -1; ) l.push({ type: 7, index: n }), d += G.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const i = se.createElement("template");
    return i.innerHTML = e, i;
  }
}
function fe(s, e, t = s, i) {
  if (e === ue) return e;
  let a = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const n = Ie(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== n && (a?._$AO?.(!1), n === void 0 ? a = void 0 : (a = new n(s), a._$AT(s, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = a : t._$Cl = a), a !== void 0 && (e = fe(s, a._$AS(s, e.values), a, i)), e;
}
class xi {
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
    const { el: { content: t }, parts: i } = this._$AD, a = (e?.creationScope ?? se).importNode(t, !0);
    Z.currentNode = a;
    let n = Z.nextNode(), r = 0, o = 0, l = i[0];
    for (; l !== void 0; ) {
      if (r === l.index) {
        let c;
        l.type === 2 ? c = new Pe(n, n.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(n, l.name, l.strings, this, e) : l.type === 6 && (c = new Ai(n, this, e)), this._$AV.push(c), l = i[++o];
      }
      r !== l?.index && (n = Z.nextNode(), r++);
    }
    return Z.currentNode = se, a;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class Pe {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, a) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = fe(this, e, t), Ie(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== ue && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : bi(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && Ie(this._$AH) ? this._$AA.nextSibling.data = e : this.T(se.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, a = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Ce.createElement(ws(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === a) this._$AH.p(t);
    else {
      const n = new xi(a, this), r = n.u(this.options);
      n.p(t), this.T(r), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = is.get(e.strings);
    return t === void 0 && is.set(e.strings, t = new Ce(e)), t;
  }
  k(e) {
    Nt(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, a = 0;
    for (const n of e) a === t.length ? t.push(i = new Pe(this.O(Oe()), this.O(Oe()), this, this.options)) : i = t[a], i._$AI(n), a++;
    a < t.length && (this._$AR(i && i._$AB.nextSibling, a), t.length = a);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = Jt(e).nextSibling;
      Jt(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class tt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, a, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = t, this._$AM = a, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(e, t = this, i, a) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = fe(this, e, t, 0), r = !Ie(e) || e !== this._$AH && e !== ue, r && (this._$AH = e);
    else {
      const o = e;
      let l, c;
      for (e = n[0], l = 0; l < n.length - 1; l++) c = fe(this, o[i + l], t, l), c === ue && (c = this._$AH[l]), r ||= !Ie(c) || c !== this._$AH[l], c === _ ? e = _ : e !== _ && (e += (c ?? "") + n[l + 1]), this._$AH[l] = c;
    }
    r && !a && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ki extends tt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class _i extends tt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class Si extends tt {
  constructor(e, t, i, a, n) {
    super(e, t, i, a, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = fe(this, e, t, 0) ?? _) === ue) return;
    const i = this._$AH, a = e === _ && i !== _ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, n = e !== _ && (i === _ || a);
    a && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ai {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    fe(this, e);
  }
}
const Ei = Et.litHtmlPolyfillSupport;
Ei?.(Ce, Pe), (Et.litHtmlVersions ??= []).push("3.3.3");
const Ni = (s, e, t) => {
  const i = t?.renderBefore ?? e;
  let a = i._$litPart$;
  if (a === void 0) {
    const n = t?.renderBefore ?? null;
    i._$litPart$ = a = new Pe(e.insertBefore(Oe(), n), n, void 0, t ?? {});
  }
  return a._$AI(s), a;
};
const Tt = globalThis;
class Ee extends oe {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ni(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ue;
  }
}
Ee._$litElement$ = !0, Ee.finalized = !0, Tt.litElementHydrateSupport?.({ LitElement: Ee });
const Ti = Tt.litElementPolyfillSupport;
Ti?.({ LitElement: Ee });
(Tt.litElementVersions ??= []).push("4.2.2");
const Oi = (s) => (e, t) => {
  t !== void 0 ? t.addInitializer(() => {
    customElements.define(s, e);
  }) : customElements.define(s, e);
};
const Ii = { attribute: !0, type: String, converter: Ge, reflect: !1, hasChanged: At }, Ci = (s = Ii, e, t) => {
  const { kind: i, metadata: a } = t;
  let n = globalThis.litPropertyMetadata.get(a);
  if (n === void 0 && globalThis.litPropertyMetadata.set(a, n = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(t.name, s), i === "accessor") {
    const { name: r } = t;
    return { set(o) {
      const l = e.get.call(this);
      e.set.call(this, o), this.requestUpdate(r, l, s, !0, o);
    }, init(o) {
      return o !== void 0 && this.C(r, void 0, s, o), o;
    } };
  }
  if (i === "setter") {
    const { name: r } = t;
    return function(o) {
      const l = this[r];
      e.call(this, o), this.requestUpdate(r, l, s, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Ot(s) {
  return (e, t) => typeof t == "object" ? Ci(s, e, t) : ((i, a, n) => {
    const r = a.hasOwnProperty(n);
    return a.constructor.createProperty(n, i), r ? Object.getOwnPropertyDescriptor(a, n) : void 0;
  })(s, e, t);
}
function w(s) {
  return Ot({ ...s, state: !0, attribute: !1 });
}
const It = /* @__PURE__ */ Symbol.for("yaml.alias"), vt = /* @__PURE__ */ Symbol.for("yaml.document"), Q = /* @__PURE__ */ Symbol.for("yaml.map"), $s = /* @__PURE__ */ Symbol.for("yaml.pair"), H = /* @__PURE__ */ Symbol.for("yaml.scalar"), ye = /* @__PURE__ */ Symbol.for("yaml.seq"), K = /* @__PURE__ */ Symbol.for("yaml.node.type"), ve = (s) => !!s && typeof s == "object" && s[K] === It, st = (s) => !!s && typeof s == "object" && s[K] === vt, Me = (s) => !!s && typeof s == "object" && s[K] === Q, D = (s) => !!s && typeof s == "object" && s[K] === $s, I = (s) => !!s && typeof s == "object" && s[K] === H, Re = (s) => !!s && typeof s == "object" && s[K] === ye;
function C(s) {
  if (s && typeof s == "object")
    switch (s[K]) {
      case Q:
      case ye:
        return !0;
    }
  return !1;
}
function L(s) {
  if (s && typeof s == "object")
    switch (s[K]) {
      case It:
      case Q:
      case H:
      case ye:
        return !0;
    }
  return !1;
}
const xs = (s) => (I(s) || C(s)) && !!s.anchor, X = /* @__PURE__ */ Symbol("break visit"), Li = /* @__PURE__ */ Symbol("skip children"), Ne = /* @__PURE__ */ Symbol("remove node");
function be(s, e) {
  const t = Di(e);
  st(s) ? le(null, s.contents, t, Object.freeze([s])) === Ne && (s.contents = null) : le(null, s, t, Object.freeze([]));
}
be.BREAK = X;
be.SKIP = Li;
be.REMOVE = Ne;
function le(s, e, t, i) {
  const a = Pi(s, e, t, i);
  if (L(a) || D(a))
    return Mi(s, i, a), le(s, a, t, i);
  if (typeof a != "symbol") {
    if (C(e)) {
      i = Object.freeze(i.concat(e));
      for (let n = 0; n < e.items.length; ++n) {
        const r = le(n, e.items[n], t, i);
        if (typeof r == "number")
          n = r - 1;
        else {
          if (r === X)
            return X;
          r === Ne && (e.items.splice(n, 1), n -= 1);
        }
      }
    } else if (D(e)) {
      i = Object.freeze(i.concat(e));
      const n = le("key", e.key, t, i);
      if (n === X)
        return X;
      n === Ne && (e.key = null);
      const r = le("value", e.value, t, i);
      if (r === X)
        return X;
      r === Ne && (e.value = null);
    }
  }
  return a;
}
function Di(s) {
  return typeof s == "object" && (s.Collection || s.Node || s.Value) ? Object.assign({
    Alias: s.Node,
    Map: s.Node,
    Scalar: s.Node,
    Seq: s.Node
  }, s.Value && {
    Map: s.Value,
    Scalar: s.Value,
    Seq: s.Value
  }, s.Collection && {
    Map: s.Collection,
    Seq: s.Collection
  }, s) : s;
}
function Pi(s, e, t, i) {
  if (typeof t == "function")
    return t(s, e, i);
  if (Me(e))
    return t.Map?.(s, e, i);
  if (Re(e))
    return t.Seq?.(s, e, i);
  if (D(e))
    return t.Pair?.(s, e, i);
  if (I(e))
    return t.Scalar?.(s, e, i);
  if (ve(e))
    return t.Alias?.(s, e, i);
}
function Mi(s, e, t) {
  const i = e[e.length - 1];
  if (C(i))
    i.items[s] = t;
  else if (D(i))
    s === "key" ? i.key = t : i.value = t;
  else if (st(i))
    i.contents = t;
  else {
    const a = ve(i) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${a} parent`);
  }
}
const Ri = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
}, Bi = (s) => s.replace(/[!,[\]{}]/g, (e) => Ri[e]);
class R {
  constructor(e, t) {
    this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, R.defaultYaml, e), this.tags = Object.assign({}, R.defaultTags, t);
  }
  clone() {
    const e = new R(this.yaml, this.tags);
    return e.docStart = this.docStart, e;
  }
  /**
   * During parsing, get a Directives instance for the current document and
   * update the stream state according to the current version's spec.
   */
  atDocument() {
    const e = new R(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = !0;
        break;
      case "1.2":
        this.atNextDocument = !1, this.yaml = {
          explicit: R.defaultYaml.explicit,
          version: "1.2"
        }, this.tags = Object.assign({}, R.defaultTags);
        break;
    }
    return e;
  }
  /**
   * @param onError - May be called even if the action was successful
   * @returns `true` on success
   */
  add(e, t) {
    this.atNextDocument && (this.yaml = { explicit: R.defaultYaml.explicit, version: "1.1" }, this.tags = Object.assign({}, R.defaultTags), this.atNextDocument = !1);
    const i = e.trim().split(/[ \t]+/), a = i.shift();
    switch (a) {
      case "%TAG": {
        if (i.length !== 2 && (t(0, "%TAG directive should contain exactly two parts"), i.length < 2))
          return !1;
        const [n, r] = i;
        return this.tags[n] = r, !0;
      }
      case "%YAML": {
        if (this.yaml.explicit = !0, i.length !== 1)
          return t(0, "%YAML directive should contain exactly one part"), !1;
        const [n] = i;
        if (n === "1.1" || n === "1.2")
          return this.yaml.version = n, !0;
        {
          const r = /^\d+\.\d+$/.test(n);
          return t(6, `Unsupported YAML version ${n}`, r), !1;
        }
      }
      default:
        return t(0, `Unknown directive ${a}`, !0), !1;
    }
  }
  /**
   * Resolves a tag, matching handles to those defined in %TAG directives.
   *
   * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
   *   `'!local'` tag, or `null` if unresolvable.
   */
  tagName(e, t) {
    if (e === "!")
      return "!";
    if (e[0] !== "!")
      return t(`Not a valid tag: ${e}`), null;
    if (e[1] === "<") {
      const r = e.slice(2, -1);
      return r === "!" || r === "!!" ? (t(`Verbatim tags aren't resolved, so ${e} is invalid.`), null) : (e[e.length - 1] !== ">" && t("Verbatim tags must end with a >"), r);
    }
    const [, i, a] = e.match(/^(.*!)([^!]*)$/s);
    a || t(`The ${e} tag has no suffix`);
    const n = this.tags[i];
    if (n)
      try {
        return n + decodeURIComponent(a);
      } catch (r) {
        return t(String(r)), null;
      }
    return i === "!" ? e : (t(`Could not resolve tag: ${e}`), null);
  }
  /**
   * Given a fully resolved tag, returns its printable string form,
   * taking into account current tag prefixes and defaults.
   */
  tagString(e) {
    for (const [t, i] of Object.entries(this.tags))
      if (e.startsWith(i))
        return t + Bi(e.substring(i.length));
    return e[0] === "!" ? e : `!<${e}>`;
  }
  toString(e) {
    const t = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], i = Object.entries(this.tags);
    let a;
    if (e && i.length > 0 && L(e.contents)) {
      const n = {};
      be(e.contents, (r, o) => {
        L(o) && o.tag && (n[o.tag] = !0);
      }), a = Object.keys(n);
    } else
      a = [];
    for (const [n, r] of i)
      n === "!!" && r === "tag:yaml.org,2002:" || (!e || a.some((o) => o.startsWith(r))) && t.push(`%TAG ${n} ${r}`);
    return t.join(`
`);
  }
}
R.defaultYaml = { explicit: !1, version: "1.2" };
R.defaultTags = { "!!": "tag:yaml.org,2002:" };
function ks(s) {
  if (/[\x00-\x19\s,[\]{}]/.test(s)) {
    const t = `Anchor must not contain whitespace or control characters: ${JSON.stringify(s)}`;
    throw new Error(t);
  }
  return !0;
}
function _s(s) {
  const e = /* @__PURE__ */ new Set();
  return be(s, {
    Value(t, i) {
      i.anchor && e.add(i.anchor);
    }
  }), e;
}
function Ss(s, e) {
  for (let t = 1; ; ++t) {
    const i = `${s}${t}`;
    if (!e.has(i))
      return i;
  }
}
function Ui(s, e) {
  const t = [], i = /* @__PURE__ */ new Map();
  let a = null;
  return {
    onAnchor: (n) => {
      t.push(n), a ?? (a = _s(s));
      const r = Ss(e, a);
      return a.add(r), r;
    },
    /**
     * With circular references, the source node is only resolved after all
     * of its child nodes are. This is why anchors are set only after all of
     * the nodes have been created.
     */
    setAnchors: () => {
      for (const n of t) {
        const r = i.get(n);
        if (typeof r == "object" && r.anchor && (I(r.node) || C(r.node)))
          r.node.anchor = r.anchor;
        else {
          const o = new Error("Failed to resolve repeated object (this should not happen)");
          throw o.source = n, o;
        }
      }
    },
    sourceObjects: i
  };
}
function ce(s, e, t, i) {
  if (i && typeof i == "object")
    if (Array.isArray(i))
      for (let a = 0, n = i.length; a < n; ++a) {
        const r = i[a], o = ce(s, i, String(a), r);
        o === void 0 ? delete i[a] : o !== r && (i[a] = o);
      }
    else if (i instanceof Map)
      for (const a of Array.from(i.keys())) {
        const n = i.get(a), r = ce(s, i, a, n);
        r === void 0 ? i.delete(a) : r !== n && i.set(a, r);
      }
    else if (i instanceof Set)
      for (const a of Array.from(i)) {
        const n = ce(s, i, a, a);
        n === void 0 ? i.delete(a) : n !== a && (i.delete(a), i.add(n));
      }
    else
      for (const [a, n] of Object.entries(i)) {
        const r = ce(s, i, a, n);
        r === void 0 ? delete i[a] : r !== n && (i[a] = r);
      }
  return s.call(e, t, i);
}
function j(s, e, t) {
  if (Array.isArray(s))
    return s.map((i, a) => j(i, String(a), t));
  if (s && typeof s.toJSON == "function") {
    if (!t || !xs(s))
      return s.toJSON(e, t);
    const i = { aliasCount: 0, count: 1, res: void 0 };
    t.anchors.set(s, i), t.onCreate = (n) => {
      i.res = n, delete t.onCreate;
    };
    const a = s.toJSON(e, t);
    return t.onCreate && t.onCreate(a), a;
  }
  return typeof s == "bigint" && !t?.keep ? Number(s) : s;
}
class Ct {
  constructor(e) {
    Object.defineProperty(this, K, { value: e });
  }
  /** Create a copy of this node.  */
  clone() {
    const e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return this.range && (e.range = this.range.slice()), e;
  }
  /** A plain JavaScript representation of this node. */
  toJS(e, { mapAsMap: t, maxAliasCount: i, onAnchor: a, reviver: n } = {}) {
    if (!st(e))
      throw new TypeError("A document argument is required");
    const r = {
      anchors: /* @__PURE__ */ new Map(),
      doc: e,
      keep: !0,
      mapAsMap: t === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof i == "number" ? i : 100
    }, o = j(this, "", r);
    if (typeof a == "function")
      for (const { count: l, res: c } of r.anchors.values())
        a(c, l);
    return typeof n == "function" ? ce(n, { "": o }, "", o) : o;
  }
}
class Lt extends Ct {
  constructor(e) {
    super(It), this.source = e, Object.defineProperty(this, "tag", {
      set() {
        throw new Error("Alias nodes cannot have tags");
      }
    });
  }
  /**
   * Resolve the value of this alias within `doc`, finding the last
   * instance of the `source` anchor before this node.
   */
  resolve(e, t) {
    if (t?.maxAliasCount === 0)
      throw new ReferenceError("Alias resolution is disabled");
    let i;
    t?.aliasResolveCache ? i = t.aliasResolveCache : (i = [], be(e, {
      Node: (n, r) => {
        (ve(r) || xs(r)) && i.push(r);
      }
    }), t && (t.aliasResolveCache = i));
    let a;
    for (const n of i) {
      if (n === this)
        break;
      n.anchor === this.source && (a = n);
    }
    return a;
  }
  toJSON(e, t) {
    if (!t)
      return { source: this.source };
    const { anchors: i, doc: a, maxAliasCount: n } = t, r = this.resolve(a, t);
    if (!r) {
      const l = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(l);
    }
    let o = i.get(r);
    if (o || (j(r, null, t), o = i.get(r)), o?.res === void 0) {
      const l = "This should not happen: Alias anchor was not resolved?";
      throw new ReferenceError(l);
    }
    if (n >= 0 && (o.count += 1, o.aliasCount === 0 && (o.aliasCount = Ye(a, r, i)), o.count * o.aliasCount > n)) {
      const l = "Excessive alias count indicates a resource exhaustion attack";
      throw new ReferenceError(l);
    }
    return o.res;
  }
  toString(e, t, i) {
    const a = `*${this.source}`;
    if (e) {
      if (ks(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source)) {
        const n = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(n);
      }
      if (e.implicitKey)
        return `${a} `;
    }
    return a;
  }
}
function Ye(s, e, t) {
  if (ve(e)) {
    const i = e.resolve(s), a = t && i && t.get(i);
    return a ? a.count * a.aliasCount : 0;
  } else if (C(e)) {
    let i = 0;
    for (const a of e.items) {
      const n = Ye(s, a, t);
      n > i && (i = n);
    }
    return i;
  } else if (D(e)) {
    const i = Ye(s, e.key, t), a = Ye(s, e.value, t);
    return Math.max(i, a);
  }
  return 1;
}
const As = (s) => !s || typeof s != "function" && typeof s != "object";
class N extends Ct {
  constructor(e) {
    super(H), this.value = e;
  }
  toJSON(e, t) {
    return t?.keep ? this.value : j(this.value, e, t);
  }
  toString() {
    return String(this.value);
  }
}
N.BLOCK_FOLDED = "BLOCK_FOLDED";
N.BLOCK_LITERAL = "BLOCK_LITERAL";
N.PLAIN = "PLAIN";
N.QUOTE_DOUBLE = "QUOTE_DOUBLE";
N.QUOTE_SINGLE = "QUOTE_SINGLE";
const ji = "tag:yaml.org,2002:";
function Ki(s, e, t) {
  if (e) {
    const i = t.filter((n) => n.tag === e), a = i.find((n) => !n.format) ?? i[0];
    if (!a)
      throw new Error(`Tag ${e} not found`);
    return a;
  }
  return t.find((i) => i.identify?.(s) && !i.format);
}
function Le(s, e, t) {
  if (st(s) && (s = s.contents), L(s))
    return s;
  if (D(s)) {
    const d = t.schema[Q].createNode?.(t.schema, null, t);
    return d.items.push(s), d;
  }
  (s instanceof String || s instanceof Number || s instanceof Boolean || typeof BigInt < "u" && s instanceof BigInt) && (s = s.valueOf());
  const { aliasDuplicateObjects: i, onAnchor: a, onTagObj: n, schema: r, sourceObjects: o } = t;
  let l;
  if (i && s && typeof s == "object") {
    if (l = o.get(s), l)
      return l.anchor ?? (l.anchor = a(s)), new Lt(l.anchor);
    l = { anchor: null, node: null }, o.set(s, l);
  }
  e?.startsWith("!!") && (e = ji + e.slice(2));
  let c = Ki(s, e, r.tags);
  if (!c) {
    if (s && typeof s.toJSON == "function" && (s = s.toJSON()), !s || typeof s != "object") {
      const d = new N(s);
      return l && (l.node = d), d;
    }
    c = s instanceof Map ? r[Q] : Symbol.iterator in Object(s) ? r[ye] : r[Q];
  }
  n && (n(c), delete t.onTagObj);
  const u = c?.createNode ? c.createNode(t.schema, s, t) : typeof c?.nodeClass?.from == "function" ? c.nodeClass.from(t.schema, s, t) : new N(s);
  return e ? u.tag = e : c.default || (u.tag = c.tag), l && (l.node = u), u;
}
function Je(s, e, t) {
  let i = t;
  for (let a = e.length - 1; a >= 0; --a) {
    const n = e[a];
    if (typeof n == "number" && Number.isInteger(n) && n >= 0) {
      const r = [];
      r[n] = i, i = r;
    } else
      i = /* @__PURE__ */ new Map([[n, i]]);
  }
  return Le(i, void 0, {
    aliasDuplicateObjects: !1,
    keepUndefined: !1,
    onAnchor: () => {
      throw new Error("This should not happen, please report a bug.");
    },
    schema: s,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
const _e = (s) => s == null || typeof s == "object" && !!s[Symbol.iterator]().next().done;
class Es extends Ct {
  constructor(e, t) {
    super(e), Object.defineProperty(this, "schema", {
      value: t,
      configurable: !0,
      enumerable: !1,
      writable: !0
    });
  }
  /**
   * Create a copy of this collection.
   *
   * @param schema - If defined, overwrites the original's schema
   */
  clone(e) {
    const t = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return e && (t.schema = e), t.items = t.items.map((i) => L(i) || D(i) ? i.clone(e) : i), this.range && (t.range = this.range.slice()), t;
  }
  /**
   * Adds a value to the collection. For `!!map` and `!!omap` the value must
   * be a Pair instance or a `{ key, value }` object, which may not have a key
   * that already exists in the map.
   */
  addIn(e, t) {
    if (_e(e))
      this.add(t);
    else {
      const [i, ...a] = e, n = this.get(i, !0);
      if (C(n))
        n.addIn(a, t);
      else if (n === void 0 && this.schema)
        this.set(i, Je(this.schema, a, t));
      else
        throw new Error(`Expected YAML collection at ${i}. Remaining path: ${a}`);
    }
  }
  /**
   * Removes a value from the collection.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(e) {
    const [t, ...i] = e;
    if (i.length === 0)
      return this.delete(t);
    const a = this.get(t, !0);
    if (C(a))
      return a.deleteIn(i);
    throw new Error(`Expected YAML collection at ${t}. Remaining path: ${i}`);
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(e, t) {
    const [i, ...a] = e, n = this.get(i, !0);
    return a.length === 0 ? !t && I(n) ? n.value : n : C(n) ? n.getIn(a, t) : void 0;
  }
  hasAllNullValues(e) {
    return this.items.every((t) => {
      if (!D(t))
        return !1;
      const i = t.value;
      return i == null || e && I(i) && i.value == null && !i.commentBefore && !i.comment && !i.tag;
    });
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   */
  hasIn(e) {
    const [t, ...i] = e;
    if (i.length === 0)
      return this.has(t);
    const a = this.get(t, !0);
    return C(a) ? a.hasIn(i) : !1;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(e, t) {
    const [i, ...a] = e;
    if (a.length === 0)
      this.set(i, t);
    else {
      const n = this.get(i, !0);
      if (C(n))
        n.setIn(a, t);
      else if (n === void 0 && this.schema)
        this.set(i, Je(this.schema, a, t));
      else
        throw new Error(`Expected YAML collection at ${i}. Remaining path: ${a}`);
    }
  }
}
const zi = (s) => s.replace(/^(?!$)(?: $)?/gm, "#");
function F(s, e) {
  return /^\n+$/.test(s) ? s.substring(1) : e ? s.replace(/^(?! *$)/gm, e) : s;
}
const ee = (s, e, t) => s.endsWith(`
`) ? F(t, e) : t.includes(`
`) ? `
` + F(t, e) : (s.endsWith(" ") ? "" : " ") + t, Ns = "flow", bt = "block", Ve = "quoted";
function it(s, e, t = "flow", { indentAtStart: i, lineWidth: a = 80, minContentWidth: n = 20, onFold: r, onOverflow: o } = {}) {
  if (!a || a < 0)
    return s;
  a < n && (n = 0);
  const l = Math.max(1 + n, 1 + a - e.length);
  if (s.length <= l)
    return s;
  const c = [], u = {};
  let d = a - e.length;
  typeof i == "number" && (i > a - Math.max(2, n) ? c.push(0) : d = a - i);
  let h, f, v = !1, p = -1, g = -1, x = -1;
  t === bt && (p = as(s, p, e.length), p !== -1 && (d = p + l));
  for (let S; S = s[p += 1]; ) {
    if (t === Ve && S === "\\") {
      switch (g = p, s[p + 1]) {
        case "x":
          p += 3;
          break;
        case "u":
          p += 5;
          break;
        case "U":
          p += 9;
          break;
        default:
          p += 1;
      }
      x = p;
    }
    if (S === `
`)
      t === bt && (p = as(s, p, e.length)), d = p + e.length + l, h = void 0;
    else {
      if (S === " " && f && f !== " " && f !== `
` && f !== "	") {
        const A = s[p + 1];
        A && A !== " " && A !== `
` && A !== "	" && (h = p);
      }
      if (p >= d)
        if (h)
          c.push(h), d = h + l, h = void 0;
        else if (t === Ve) {
          for (; f === " " || f === "	"; )
            f = S, S = s[p += 1], v = !0;
          const A = p > x + 1 ? p - 2 : g - 1;
          if (u[A])
            return s;
          c.push(A), u[A] = !0, d = A + l, h = void 0;
        } else
          v = !0;
    }
    f = S;
  }
  if (v && o && o(), c.length === 0)
    return s;
  r && r();
  let k = s.slice(0, c[0]);
  for (let S = 0; S < c.length; ++S) {
    const A = c[S], E = c[S + 1] || s.length;
    A === 0 ? k = `
${e}${s.slice(0, E)}` : (t === Ve && u[A] && (k += `${s[A]}\\`), k += `
${e}${s.slice(A + 1, E)}`);
  }
  return k;
}
function as(s, e, t) {
  let i = e, a = e + 1, n = s[a];
  for (; n === " " || n === "	"; )
    if (e < a + t)
      n = s[++e];
    else {
      do
        n = s[++e];
      while (n && n !== `
`);
      i = e, a = e + 1, n = s[a];
    }
  return i;
}
const at = (s, e) => ({
  indentAtStart: e ? s.indent.length : s.indentAtStart,
  lineWidth: s.options.lineWidth,
  minContentWidth: s.options.minContentWidth
}), nt = (s) => /^(%|---|\.\.\.)/m.test(s);
function qi(s, e, t) {
  if (!e || e < 0)
    return !1;
  const i = e - t, a = s.length;
  if (a <= i)
    return !1;
  for (let n = 0, r = 0; n < a; ++n)
    if (s[n] === `
`) {
      if (n - r > i)
        return !0;
      if (r = n + 1, a - r <= i)
        return !1;
    }
  return !0;
}
function Te(s, e) {
  const t = JSON.stringify(s);
  if (e.options.doubleQuotedAsJSON)
    return t;
  const { implicitKey: i } = e, a = e.options.doubleQuotedMinMultiLineLength, n = e.indent || (nt(s) ? "  " : "");
  let r = "", o = 0;
  for (let l = 0, c = t[l]; c; c = t[++l])
    if (c === " " && t[l + 1] === "\\" && t[l + 2] === "n" && (r += t.slice(o, l) + "\\ ", l += 1, o = l, c = "\\"), c === "\\")
      switch (t[l + 1]) {
        case "u":
          {
            r += t.slice(o, l);
            const u = t.substr(l + 2, 4);
            switch (u) {
              case "0000":
                r += "\\0";
                break;
              case "0007":
                r += "\\a";
                break;
              case "000b":
                r += "\\v";
                break;
              case "001b":
                r += "\\e";
                break;
              case "0085":
                r += "\\N";
                break;
              case "00a0":
                r += "\\_";
                break;
              case "2028":
                r += "\\L";
                break;
              case "2029":
                r += "\\P";
                break;
              default:
                u.substr(0, 2) === "00" ? r += "\\x" + u.substr(2) : r += t.substr(l, 6);
            }
            l += 5, o = l + 1;
          }
          break;
        case "n":
          if (i || t[l + 2] === '"' || t.length < a)
            l += 1;
          else {
            for (r += t.slice(o, l) + `

`; t[l + 2] === "\\" && t[l + 3] === "n" && t[l + 4] !== '"'; )
              r += `
`, l += 2;
            r += n, t[l + 2] === " " && (r += "\\"), l += 1, o = l + 1;
          }
          break;
        default:
          l += 1;
      }
  return r = o ? r + t.slice(o) : t, i ? r : it(r, n, Ve, at(e, !1));
}
function wt(s, e) {
  if (e.options.singleQuote === !1 || e.implicitKey && s.includes(`
`) || /[ \t]\n|\n[ \t]/.test(s))
    return Te(s, e);
  const t = e.indent || (nt(s) ? "  " : ""), i = "'" + s.replace(/'/g, "''").replace(/\n+/g, `$&
${t}`) + "'";
  return e.implicitKey ? i : it(i, t, Ns, at(e, !1));
}
function de(s, e) {
  const { singleQuote: t } = e.options;
  let i;
  if (t === !1)
    i = Te;
  else {
    const a = s.includes('"'), n = s.includes("'");
    a && !n ? i = wt : n && !a ? i = Te : i = t ? wt : Te;
  }
  return i(s, e);
}
let $t;
try {
  $t = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g");
} catch {
  $t = /\n+(?!\n|$)/g;
}
function We({ comment: s, type: e, value: t }, i, a, n) {
  const { blockQuote: r, commentString: o, lineWidth: l } = i.options;
  if (!r || /\n[\t ]+$/.test(t))
    return de(t, i);
  const c = i.indent || (i.forceBlockIndent || nt(t) ? "  " : ""), u = r === "literal" ? !0 : r === "folded" || e === N.BLOCK_FOLDED ? !1 : e === N.BLOCK_LITERAL ? !0 : !qi(t, l, c.length);
  if (!t)
    return u ? `|
` : `>
`;
  let d, h;
  for (h = t.length; h > 0; --h) {
    const E = t[h - 1];
    if (E !== `
` && E !== "	" && E !== " ")
      break;
  }
  let f = t.substring(h);
  const v = f.indexOf(`
`);
  v === -1 ? d = "-" : t === f || v !== f.length - 1 ? (d = "+", n && n()) : d = "", f && (t = t.slice(0, -f.length), f[f.length - 1] === `
` && (f = f.slice(0, -1)), f = f.replace($t, `$&${c}`));
  let p = !1, g, x = -1;
  for (g = 0; g < t.length; ++g) {
    const E = t[g];
    if (E === " ")
      p = !0;
    else if (E === `
`)
      x = g;
    else
      break;
  }
  let k = t.substring(0, x < g ? x + 1 : g);
  k && (t = t.substring(k.length), k = k.replace(/\n+/g, `$&${c}`));
  let A = (p ? c ? "2" : "1" : "") + d;
  if (s && (A += " " + o(s.replace(/ ?[\r\n]+/g, " ")), a && a()), !u) {
    const E = t.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${c}`);
    let T = !1;
    const O = at(i, !0);
    r !== "folded" && e !== N.BLOCK_FOLDED && (O.onOverflow = () => {
      T = !0;
    });
    const $ = it(`${k}${E}${f}`, c, bt, O);
    if (!T)
      return `>${A}
${c}${$}`;
  }
  return t = t.replace(/\n+/g, `$&${c}`), `|${A}
${c}${k}${t}${f}`;
}
function Hi(s, e, t, i) {
  const { type: a, value: n } = s, { actualString: r, implicitKey: o, indent: l, indentStep: c, inFlow: u } = e;
  if (o && n.includes(`
`) || u && /[[\]{},]/.test(n))
    return de(n, e);
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(n))
    return o || u || !n.includes(`
`) ? de(n, e) : We(s, e, t, i);
  if (!o && !u && a !== N.PLAIN && n.includes(`
`))
    return We(s, e, t, i);
  if (nt(n)) {
    if (l === "")
      return e.forceBlockIndent = !0, We(s, e, t, i);
    if (o && l === c)
      return de(n, e);
  }
  const d = n.replace(/\n+/g, `$&
${l}`);
  if (r) {
    const h = (p) => p.default && p.tag !== "tag:yaml.org,2002:str" && p.test?.test(d), { compat: f, tags: v } = e.doc.schema;
    if (v.some(h) || f?.some(h))
      return de(n, e);
  }
  return o ? d : it(d, l, Ns, at(e, !1));
}
function Dt(s, e, t, i) {
  const { implicitKey: a, inFlow: n } = e, r = typeof s.value == "string" ? s : Object.assign({}, s, { value: String(s.value) });
  let { type: o } = s;
  o !== N.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(r.value) && (o = N.QUOTE_DOUBLE);
  const l = (u) => {
    switch (u) {
      case N.BLOCK_FOLDED:
      case N.BLOCK_LITERAL:
        return a || n ? de(r.value, e) : We(r, e, t, i);
      case N.QUOTE_DOUBLE:
        return Te(r.value, e);
      case N.QUOTE_SINGLE:
        return wt(r.value, e);
      case N.PLAIN:
        return Hi(r, e, t, i);
      default:
        return null;
    }
  };
  let c = l(o);
  if (c === null) {
    const { defaultKeyType: u, defaultStringType: d } = e.options, h = a && u || d;
    if (c = l(h), c === null)
      throw new Error(`Unsupported default string type ${h}`);
  }
  return c;
}
function Ts(s, e) {
  const t = Object.assign({
    blockQuote: !0,
    commentString: zi,
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
  }, s.schema.toStringOptions, e);
  let i;
  switch (t.collectionStyle) {
    case "block":
      i = !1;
      break;
    case "flow":
      i = !0;
      break;
    default:
      i = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc: s,
    flowCollectionPadding: t.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof t.indent == "number" ? " ".repeat(t.indent) : "  ",
    inFlow: i,
    options: t
  };
}
function Fi(s, e) {
  if (e.tag) {
    const a = s.filter((n) => n.tag === e.tag);
    if (a.length > 0)
      return a.find((n) => n.format === e.format) ?? a[0];
  }
  let t, i;
  if (I(e)) {
    i = e.value;
    let a = s.filter((n) => n.identify?.(i));
    if (a.length > 1) {
      const n = a.filter((r) => r.test);
      n.length > 0 && (a = n);
    }
    t = a.find((n) => n.format === e.format) ?? a.find((n) => !n.format);
  } else
    i = e, t = s.find((a) => a.nodeClass && i instanceof a.nodeClass);
  if (!t) {
    const a = i?.constructor?.name ?? (i === null ? "null" : typeof i);
    throw new Error(`Tag not resolved for ${a} value`);
  }
  return t;
}
function Yi(s, e, { anchors: t, doc: i }) {
  if (!i.directives)
    return "";
  const a = [], n = (I(s) || C(s)) && s.anchor;
  n && ks(n) && (t.add(n), a.push(`&${n}`));
  const r = s.tag ?? (e.default ? null : e.tag);
  return r && a.push(i.directives.tagString(r)), a.join(" ");
}
function ge(s, e, t, i) {
  if (D(s))
    return s.toString(e, t, i);
  if (ve(s)) {
    if (e.doc.directives)
      return s.toString(e);
    if (e.resolvedAliases?.has(s))
      throw new TypeError("Cannot stringify circular structure without alias nodes");
    e.resolvedAliases ? e.resolvedAliases.add(s) : e.resolvedAliases = /* @__PURE__ */ new Set([s]), s = s.resolve(e.doc);
  }
  let a;
  const n = L(s) ? s : e.doc.createNode(s, { onTagObj: (l) => a = l });
  a ?? (a = Fi(e.doc.schema.tags, n));
  const r = Yi(n, a, e);
  r.length > 0 && (e.indentAtStart = (e.indentAtStart ?? 0) + r.length + 1);
  const o = typeof a.stringify == "function" ? a.stringify(n, e, t, i) : I(n) ? Dt(n, e, t, i) : n.toString(e, t, i);
  return r ? I(n) || o[0] === "{" || o[0] === "[" ? `${r} ${o}` : `${r}
${e.indent}${o}` : o;
}
function Vi({ key: s, value: e }, t, i, a) {
  const { allNullValues: n, doc: r, indent: o, indentStep: l, options: { commentString: c, indentSeq: u, simpleKeys: d } } = t;
  let h = L(s) && s.comment || null;
  if (d) {
    if (h)
      throw new Error("With simple keys, key nodes cannot have comments");
    if (C(s) || !L(s) && typeof s == "object") {
      const O = "With simple keys, collection cannot be used as a key value";
      throw new Error(O);
    }
  }
  let f = !d && (!s || h && e == null && !t.inFlow || C(s) || (I(s) ? s.type === N.BLOCK_FOLDED || s.type === N.BLOCK_LITERAL : typeof s == "object"));
  t = Object.assign({}, t, {
    allNullValues: !1,
    implicitKey: !f && (d || !n),
    indent: o + l
  });
  let v = !1, p = !1, g = ge(s, t, () => v = !0, () => p = !0);
  if (!f && !t.inFlow && g.length > 1024) {
    if (d)
      throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    f = !0;
  }
  if (t.inFlow) {
    if (n || e == null)
      return v && i && i(), g === "" ? "?" : f ? `? ${g}` : g;
  } else if (n && !d || e == null && f)
    return g = `? ${g}`, h && !v ? g += ee(g, t.indent, c(h)) : p && a && a(), g;
  v && (h = null), f ? (h && (g += ee(g, t.indent, c(h))), g = `? ${g}
${o}:`) : (g = `${g}:`, h && (g += ee(g, t.indent, c(h))));
  let x, k, S;
  L(e) ? (x = !!e.spaceBefore, k = e.commentBefore, S = e.comment) : (x = !1, k = null, S = null, e && typeof e == "object" && (e = r.createNode(e))), t.implicitKey = !1, !f && !h && I(e) && (t.indentAtStart = g.length + 1), p = !1, !u && l.length >= 2 && !t.inFlow && !f && Re(e) && !e.flow && !e.tag && !e.anchor && (t.indent = t.indent.substring(2));
  let A = !1;
  const E = ge(e, t, () => A = !0, () => p = !0);
  let T = " ";
  if (h || x || k) {
    if (T = x ? `
` : "", k) {
      const O = c(k);
      T += `
${F(O, t.indent)}`;
    }
    E === "" && !t.inFlow ? T === `
` && S && (T = `

`) : T += `
${t.indent}`;
  } else if (!f && C(e)) {
    const O = E[0], $ = E.indexOf(`
`), P = $ !== -1, V = t.inFlow ?? e.flow ?? e.items.length === 0;
    if (P || !V) {
      let ae = !1;
      if (P && (O === "&" || O === "!")) {
        let M = E.indexOf(" ");
        O === "&" && M !== -1 && M < $ && E[M + 1] === "!" && (M = E.indexOf(" ", M + 1)), (M === -1 || $ < M) && (ae = !0);
      }
      ae || (T = `
${t.indent}`);
    }
  } else (E === "" || E[0] === `
`) && (T = "");
  return g += T + E, t.inFlow ? A && i && i() : S && !A ? g += ee(g, t.indent, c(S)) : p && a && a(), g;
}
function Os(s, e) {
  (s === "debug" || s === "warn") && console.warn(e);
}
const je = "<<", Y = {
  identify: (s) => s === je || typeof s == "symbol" && s.description === je,
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: () => Object.assign(new N(Symbol(je)), {
    addToJSMap: Is
  }),
  stringify: () => je
}, Wi = (s, e) => (Y.identify(e) || I(e) && (!e.type || e.type === N.PLAIN) && Y.identify(e.value)) && s?.doc.schema.tags.some((t) => t.tag === Y.tag && t.default);
function Is(s, e, t) {
  const i = Cs(s, t);
  if (Re(i))
    for (const a of i.items)
      pt(s, e, a);
  else if (Array.isArray(i))
    for (const a of i)
      pt(s, e, a);
  else
    pt(s, e, i);
}
function pt(s, e, t) {
  const i = Cs(s, t);
  if (!Me(i))
    throw new Error("Merge sources must be maps or map aliases");
  const a = i.toJSON(null, s, Map);
  for (const [n, r] of a)
    e instanceof Map ? e.has(n) || e.set(n, r) : e instanceof Set ? e.add(n) : Object.prototype.hasOwnProperty.call(e, n) || Object.defineProperty(e, n, {
      value: r,
      writable: !0,
      enumerable: !0,
      configurable: !0
    });
  return e;
}
function Cs(s, e) {
  return s && ve(e) ? e.resolve(s.doc, s) : e;
}
function Ls(s, e, { key: t, value: i }) {
  if (L(t) && t.addToJSMap)
    t.addToJSMap(s, e, i);
  else if (Wi(s, t))
    Is(s, e, i);
  else {
    const a = j(t, "", s);
    if (e instanceof Map)
      e.set(a, j(i, a, s));
    else if (e instanceof Set)
      e.add(a);
    else {
      const n = Gi(t, a, s), r = j(i, n, s);
      n in e ? Object.defineProperty(e, n, {
        value: r,
        writable: !0,
        enumerable: !0,
        configurable: !0
      }) : e[n] = r;
    }
  }
  return e;
}
function Gi(s, e, t) {
  if (e === null)
    return "";
  if (typeof e != "object")
    return String(e);
  if (L(s) && t?.doc) {
    const i = Ts(t.doc, {});
    i.anchors = /* @__PURE__ */ new Set();
    for (const n of t.anchors.keys())
      i.anchors.add(n.anchor);
    i.inFlow = !0, i.inStringifyKey = !0;
    const a = s.toString(i);
    if (!t.mapKeyWarned) {
      let n = JSON.stringify(a);
      n.length > 40 && (n = n.substring(0, 36) + '..."'), Os(t.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${n}. Set mapAsMap: true to use object keys.`), t.mapKeyWarned = !0;
    }
    return a;
  }
  return JSON.stringify(e);
}
function Pt(s, e, t) {
  const i = Le(s, void 0, t), a = Le(e, void 0, t);
  return new B(i, a);
}
class B {
  constructor(e, t = null) {
    Object.defineProperty(this, K, { value: $s }), this.key = e, this.value = t;
  }
  clone(e) {
    let { key: t, value: i } = this;
    return L(t) && (t = t.clone(e)), L(i) && (i = i.clone(e)), new B(t, i);
  }
  toJSON(e, t) {
    const i = t?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    return Ls(t, i, this);
  }
  toString(e, t, i) {
    return e?.doc ? Vi(this, e, t, i) : JSON.stringify(this);
  }
}
function Ds(s, e, t) {
  return (e.inFlow ?? s.flow ? Ji : Qi)(s, e, t);
}
function Qi({ comment: s, items: e }, t, { blockItemPrefix: i, flowChars: a, itemIndent: n, onChompKeep: r, onComment: o }) {
  const { indent: l, options: { commentString: c } } = t, u = Object.assign({}, t, { indent: n, type: null });
  let d = !1;
  const h = [];
  for (let v = 0; v < e.length; ++v) {
    const p = e[v];
    let g = null;
    if (L(p))
      !d && p.spaceBefore && h.push(""), Xe(t, h, p.commentBefore, d), p.comment && (g = p.comment);
    else if (D(p)) {
      const k = L(p.key) ? p.key : null;
      k && (!d && k.spaceBefore && h.push(""), Xe(t, h, k.commentBefore, d));
    }
    d = !1;
    let x = ge(p, u, () => g = null, () => d = !0);
    g && (x += ee(x, n, c(g))), d && g && (d = !1), h.push(i + x);
  }
  let f;
  if (h.length === 0)
    f = a.start + a.end;
  else {
    f = h[0];
    for (let v = 1; v < h.length; ++v) {
      const p = h[v];
      f += p ? `
${l}${p}` : `
`;
    }
  }
  return s ? (f += `
` + F(c(s), l), o && o()) : d && r && r(), f;
}
function Ji({ items: s }, e, { flowChars: t, itemIndent: i }) {
  const { indent: a, indentStep: n, flowCollectionPadding: r, options: { commentString: o } } = e;
  i += n;
  const l = Object.assign({}, e, {
    indent: i,
    inFlow: !0,
    type: null
  });
  let c = !1, u = 0;
  const d = [];
  for (let v = 0; v < s.length; ++v) {
    const p = s[v];
    let g = null;
    if (L(p))
      p.spaceBefore && d.push(""), Xe(e, d, p.commentBefore, !1), p.comment && (g = p.comment);
    else if (D(p)) {
      const k = L(p.key) ? p.key : null;
      k && (k.spaceBefore && d.push(""), Xe(e, d, k.commentBefore, !1), k.comment && (c = !0));
      const S = L(p.value) ? p.value : null;
      S ? (S.comment && (g = S.comment), S.commentBefore && (c = !0)) : p.value == null && k?.comment && (g = k.comment);
    }
    g && (c = !0);
    let x = ge(p, l, () => g = null);
    c || (c = d.length > u || x.includes(`
`)), v < s.length - 1 ? x += "," : e.options.trailingComma && (e.options.lineWidth > 0 && (c || (c = d.reduce((k, S) => k + S.length + 2, 2) + (x.length + 2) > e.options.lineWidth)), c && (x += ",")), g && (x += ee(x, i, o(g))), d.push(x), u = d.length;
  }
  const { start: h, end: f } = t;
  if (d.length === 0)
    return h + f;
  if (!c) {
    const v = d.reduce((p, g) => p + g.length + 2, 2);
    c = e.options.lineWidth > 0 && v > e.options.lineWidth;
  }
  if (c) {
    let v = h;
    for (const p of d)
      v += p ? `
${n}${a}${p}` : `
`;
    return `${v}
${a}${f}`;
  } else
    return `${h}${r}${d.join(" ")}${r}${f}`;
}
function Xe({ indent: s, options: { commentString: e } }, t, i, a) {
  if (i && a && (i = i.replace(/^\n+/, "")), i) {
    const n = F(e(i), s);
    t.push(n.trimStart());
  }
}
function te(s, e) {
  const t = I(e) ? e.value : e;
  for (const i of s)
    if (D(i) && (i.key === e || i.key === t || I(i.key) && i.key.value === t))
      return i;
}
class U extends Es {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(e) {
    super(Q, e), this.items = [];
  }
  /**
   * A generic collection parsing method that can be extended
   * to other node classes that inherit from YAMLMap
   */
  static from(e, t, i) {
    const { keepUndefined: a, replacer: n } = i, r = new this(e), o = (l, c) => {
      if (typeof n == "function")
        c = n.call(t, l, c);
      else if (Array.isArray(n) && !n.includes(l))
        return;
      (c !== void 0 || a) && r.items.push(Pt(l, c, i));
    };
    if (t instanceof Map)
      for (const [l, c] of t)
        o(l, c);
    else if (t && typeof t == "object")
      for (const l of Object.keys(t))
        o(l, t[l]);
    return typeof e.sortMapEntries == "function" && r.items.sort(e.sortMapEntries), r;
  }
  /**
   * Adds a value to the collection.
   *
   * @param overwrite - If not set `true`, using a key that is already in the
   *   collection will throw. Otherwise, overwrites the previous value.
   */
  add(e, t) {
    let i;
    D(e) ? i = e : !e || typeof e != "object" || !("key" in e) ? i = new B(e, e?.value) : i = new B(e.key, e.value);
    const a = te(this.items, i.key), n = this.schema?.sortMapEntries;
    if (a) {
      if (!t)
        throw new Error(`Key ${i.key} already set`);
      I(a.value) && As(i.value) ? a.value.value = i.value : a.value = i.value;
    } else if (n) {
      const r = this.items.findIndex((o) => n(i, o) < 0);
      r === -1 ? this.items.push(i) : this.items.splice(r, 0, i);
    } else
      this.items.push(i);
  }
  delete(e) {
    const t = te(this.items, e);
    return t ? this.items.splice(this.items.indexOf(t), 1).length > 0 : !1;
  }
  get(e, t) {
    const a = te(this.items, e)?.value;
    return (!t && I(a) ? a.value : a) ?? void 0;
  }
  has(e) {
    return !!te(this.items, e);
  }
  set(e, t) {
    this.add(new B(e, t), !0);
  }
  /**
   * @param ctx - Conversion context, originally set in Document#toJS()
   * @param {Class} Type - If set, forces the returned collection type
   * @returns Instance of Type, Map, or Object
   */
  toJSON(e, t, i) {
    const a = i ? new i() : t?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    t?.onCreate && t.onCreate(a);
    for (const n of this.items)
      Ls(t, a, n);
    return a;
  }
  toString(e, t, i) {
    if (!e)
      return JSON.stringify(this);
    for (const a of this.items)
      if (!D(a))
        throw new Error(`Map items must all be pairs; found ${JSON.stringify(a)} instead`);
    return !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })), Ds(this, e, {
      blockItemPrefix: "",
      flowChars: { start: "{", end: "}" },
      itemIndent: e.indent || "",
      onChompKeep: i,
      onComment: t
    });
  }
}
const we = {
  collection: "map",
  default: !0,
  nodeClass: U,
  tag: "tag:yaml.org,2002:map",
  resolve(s, e) {
    return Me(s) || e("Expected a mapping for this tag"), s;
  },
  createNode: (s, e, t) => U.from(s, e, t)
};
class ie extends Es {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(e) {
    super(ye, e), this.items = [];
  }
  add(e) {
    this.items.push(e);
  }
  /**
   * Removes a value from the collection.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   *
   * @returns `true` if the item was found and removed.
   */
  delete(e) {
    const t = Ke(e);
    return typeof t != "number" ? !1 : this.items.splice(t, 1).length > 0;
  }
  get(e, t) {
    const i = Ke(e);
    if (typeof i != "number")
      return;
    const a = this.items[i];
    return !t && I(a) ? a.value : a;
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   */
  has(e) {
    const t = Ke(e);
    return typeof t == "number" && t < this.items.length;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   *
   * If `key` does not contain a representation of an integer, this will throw.
   * It may be wrapped in a `Scalar`.
   */
  set(e, t) {
    const i = Ke(e);
    if (typeof i != "number")
      throw new Error(`Expected a valid index, not ${e}.`);
    const a = this.items[i];
    I(a) && As(t) ? a.value = t : this.items[i] = t;
  }
  toJSON(e, t) {
    const i = [];
    t?.onCreate && t.onCreate(i);
    let a = 0;
    for (const n of this.items)
      i.push(j(n, String(a++), t));
    return i;
  }
  toString(e, t, i) {
    return e ? Ds(this, e, {
      blockItemPrefix: "- ",
      flowChars: { start: "[", end: "]" },
      itemIndent: (e.indent || "") + "  ",
      onChompKeep: i,
      onComment: t
    }) : JSON.stringify(this);
  }
  static from(e, t, i) {
    const { replacer: a } = i, n = new this(e);
    if (t && Symbol.iterator in Object(t)) {
      let r = 0;
      for (let o of t) {
        if (typeof a == "function") {
          const l = t instanceof Set ? o : String(r++);
          o = a.call(t, l, o);
        }
        n.items.push(Le(o, void 0, i));
      }
    }
    return n;
  }
}
function Ke(s) {
  let e = I(s) ? s.value : s;
  return e && typeof e == "string" && (e = Number(e)), typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : null;
}
const $e = {
  collection: "seq",
  default: !0,
  nodeClass: ie,
  tag: "tag:yaml.org,2002:seq",
  resolve(s, e) {
    return Re(s) || e("Expected a sequence for this tag"), s;
  },
  createNode: (s, e, t) => ie.from(s, e, t)
}, rt = {
  identify: (s) => typeof s == "string",
  default: !0,
  tag: "tag:yaml.org,2002:str",
  resolve: (s) => s,
  stringify(s, e, t, i) {
    return e = Object.assign({ actualString: !0 }, e), Dt(s, e, t, i);
  }
}, ot = {
  identify: (s) => s == null,
  createNode: () => new N(null),
  default: !0,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => new N(null),
  stringify: ({ source: s }, e) => typeof s == "string" && ot.test.test(s) ? s : e.options.nullStr
}, Mt = {
  identify: (s) => typeof s == "boolean",
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: (s) => new N(s[0] === "t" || s[0] === "T"),
  stringify({ source: s, value: e }, t) {
    if (s && Mt.test.test(s)) {
      const i = s[0] === "t" || s[0] === "T";
      if (e === i)
        return s;
    }
    return e ? t.options.trueStr : t.options.falseStr;
  }
};
function q({ format: s, minFractionDigits: e, tag: t, value: i }) {
  if (typeof i == "bigint")
    return String(i);
  const a = typeof i == "number" ? i : Number(i);
  if (!isFinite(a))
    return isNaN(a) ? ".nan" : a < 0 ? "-.inf" : ".inf";
  let n = Object.is(i, -0) ? "-0" : JSON.stringify(i);
  if (!s && e && (!t || t === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
    let r = n.indexOf(".");
    r < 0 && (r = n.length, n += ".");
    let o = e - (n.length - r - 1);
    for (; o-- > 0; )
      n += "0";
  }
  return n;
}
const Ps = {
  identify: (s) => typeof s == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (s) => s.slice(-3).toLowerCase() === "nan" ? NaN : s[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: q
}, Ms = {
  identify: (s) => typeof s == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: (s) => parseFloat(s),
  stringify(s) {
    const e = Number(s.value);
    return isFinite(e) ? e.toExponential() : q(s);
  }
}, Rs = {
  identify: (s) => typeof s == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(s) {
    const e = new N(parseFloat(s)), t = s.indexOf(".");
    return t !== -1 && s[s.length - 1] === "0" && (e.minFractionDigits = s.length - t - 1), e;
  },
  stringify: q
}, lt = (s) => typeof s == "bigint" || Number.isInteger(s), Rt = (s, e, t, { intAsBigInt: i }) => i ? BigInt(s) : parseInt(s.substring(e), t);
function Bs(s, e, t) {
  const { value: i } = s;
  return lt(i) && i >= 0 ? t + i.toString(e) : q(s);
}
const Us = {
  identify: (s) => lt(s) && s >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: (s, e, t) => Rt(s, 2, 8, t),
  stringify: (s) => Bs(s, 8, "0o")
}, js = {
  identify: lt,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: (s, e, t) => Rt(s, 0, 10, t),
  stringify: q
}, Ks = {
  identify: (s) => lt(s) && s >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: (s, e, t) => Rt(s, 2, 16, t),
  stringify: (s) => Bs(s, 16, "0x")
}, Xi = [
  we,
  $e,
  rt,
  ot,
  Mt,
  Us,
  js,
  Ks,
  Ps,
  Ms,
  Rs
];
function ns(s) {
  return typeof s == "bigint" || Number.isInteger(s);
}
const ze = ({ value: s }) => JSON.stringify(s), Zi = [
  {
    identify: (s) => typeof s == "string",
    default: !0,
    tag: "tag:yaml.org,2002:str",
    resolve: (s) => s,
    stringify: ze
  },
  {
    identify: (s) => s == null,
    createNode: () => new N(null),
    default: !0,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: ze
  },
  {
    identify: (s) => typeof s == "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: (s) => s === "true",
    stringify: ze
  },
  {
    identify: ns,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (s, e, { intAsBigInt: t }) => t ? BigInt(s) : parseInt(s, 10),
    stringify: ({ value: s }) => ns(s) ? s.toString() : JSON.stringify(s)
  },
  {
    identify: (s) => typeof s == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (s) => parseFloat(s),
    stringify: ze
  }
], ea = {
  default: !0,
  tag: "",
  test: /^/,
  resolve(s, e) {
    return e(`Unresolved plain scalar ${JSON.stringify(s)}`), s;
  }
}, ta = [we, $e].concat(Zi, ea), Bt = {
  identify: (s) => s instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: !1,
  tag: "tag:yaml.org,2002:binary",
  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve(s, e) {
    if (typeof atob == "function") {
      const t = atob(s.replace(/[\n\r]/g, "")), i = new Uint8Array(t.length);
      for (let a = 0; a < t.length; ++a)
        i[a] = t.charCodeAt(a);
      return i;
    } else
      return e("This environment does not support reading binary tags; either Buffer or atob is required"), s;
  },
  stringify({ comment: s, type: e, value: t }, i, a, n) {
    if (!t)
      return "";
    const r = t;
    let o;
    if (typeof btoa == "function") {
      let l = "";
      for (let c = 0; c < r.length; ++c)
        l += String.fromCharCode(r[c]);
      o = btoa(l);
    } else
      throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    if (e ?? (e = N.BLOCK_LITERAL), e !== N.QUOTE_DOUBLE) {
      const l = Math.max(i.options.lineWidth - i.indent.length, i.options.minContentWidth), c = Math.ceil(o.length / l), u = new Array(c);
      for (let d = 0, h = 0; d < c; ++d, h += l)
        u[d] = o.substr(h, l);
      o = u.join(e === N.BLOCK_LITERAL ? `
` : " ");
    }
    return Dt({ comment: s, type: e, value: o }, i, a, n);
  }
};
function zs(s, e) {
  if (Re(s))
    for (let t = 0; t < s.items.length; ++t) {
      let i = s.items[t];
      if (!D(i)) {
        if (Me(i)) {
          i.items.length > 1 && e("Each pair must have its own sequence indicator");
          const a = i.items[0] || new B(new N(null));
          if (i.commentBefore && (a.key.commentBefore = a.key.commentBefore ? `${i.commentBefore}
${a.key.commentBefore}` : i.commentBefore), i.comment) {
            const n = a.value ?? a.key;
            n.comment = n.comment ? `${i.comment}
${n.comment}` : i.comment;
          }
          i = a;
        }
        s.items[t] = D(i) ? i : new B(i);
      }
    }
  else
    e("Expected a sequence for this tag");
  return s;
}
function qs(s, e, t) {
  const { replacer: i } = t, a = new ie(s);
  a.tag = "tag:yaml.org,2002:pairs";
  let n = 0;
  if (e && Symbol.iterator in Object(e))
    for (let r of e) {
      typeof i == "function" && (r = i.call(e, String(n++), r));
      let o, l;
      if (Array.isArray(r))
        if (r.length === 2)
          o = r[0], l = r[1];
        else
          throw new TypeError(`Expected [key, value] tuple: ${r}`);
      else if (r && r instanceof Object) {
        const c = Object.keys(r);
        if (c.length === 1)
          o = c[0], l = r[o];
        else
          throw new TypeError(`Expected tuple with one key, not ${c.length} keys`);
      } else
        o = r;
      a.items.push(Pt(o, l, t));
    }
  return a;
}
const Ut = {
  collection: "seq",
  default: !1,
  tag: "tag:yaml.org,2002:pairs",
  resolve: zs,
  createNode: qs
};
class he extends ie {
  constructor() {
    super(), this.add = U.prototype.add.bind(this), this.delete = U.prototype.delete.bind(this), this.get = U.prototype.get.bind(this), this.has = U.prototype.has.bind(this), this.set = U.prototype.set.bind(this), this.tag = he.tag;
  }
  /**
   * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
   * but TypeScript won't allow widening the signature of a child method.
   */
  toJSON(e, t) {
    if (!t)
      return super.toJSON(e);
    const i = /* @__PURE__ */ new Map();
    t?.onCreate && t.onCreate(i);
    for (const a of this.items) {
      let n, r;
      if (D(a) ? (n = j(a.key, "", t), r = j(a.value, n, t)) : n = j(a, "", t), i.has(n))
        throw new Error("Ordered maps must not include duplicate keys");
      i.set(n, r);
    }
    return i;
  }
  static from(e, t, i) {
    const a = qs(e, t, i), n = new this();
    return n.items = a.items, n;
  }
}
he.tag = "tag:yaml.org,2002:omap";
const jt = {
  collection: "seq",
  identify: (s) => s instanceof Map,
  nodeClass: he,
  default: !1,
  tag: "tag:yaml.org,2002:omap",
  resolve(s, e) {
    const t = zs(s, e), i = [];
    for (const { key: a } of t.items)
      I(a) && (i.includes(a.value) ? e(`Ordered maps must not include duplicate keys: ${a.value}`) : i.push(a.value));
    return Object.assign(new he(), t);
  },
  createNode: (s, e, t) => he.from(s, e, t)
};
function Hs({ value: s, source: e }, t) {
  return e && (s ? Fs : Ys).test.test(e) ? e : s ? t.options.trueStr : t.options.falseStr;
}
const Fs = {
  identify: (s) => s === !0,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => new N(!0),
  stringify: Hs
}, Ys = {
  identify: (s) => s === !1,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: () => new N(!1),
  stringify: Hs
}, sa = {
  identify: (s) => typeof s == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (s) => s.slice(-3).toLowerCase() === "nan" ? NaN : s[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: q
}, ia = {
  identify: (s) => typeof s == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: (s) => parseFloat(s.replace(/_/g, "")),
  stringify(s) {
    const e = Number(s.value);
    return isFinite(e) ? e.toExponential() : q(s);
  }
}, aa = {
  identify: (s) => typeof s == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(s) {
    const e = new N(parseFloat(s.replace(/_/g, ""))), t = s.indexOf(".");
    if (t !== -1) {
      const i = s.substring(t + 1).replace(/_/g, "");
      i[i.length - 1] === "0" && (e.minFractionDigits = i.length);
    }
    return e;
  },
  stringify: q
}, Be = (s) => typeof s == "bigint" || Number.isInteger(s);
function ct(s, e, t, { intAsBigInt: i }) {
  const a = s[0];
  if ((a === "-" || a === "+") && (e += 1), s = s.substring(e).replace(/_/g, ""), i) {
    switch (t) {
      case 2:
        s = `0b${s}`;
        break;
      case 8:
        s = `0o${s}`;
        break;
      case 16:
        s = `0x${s}`;
        break;
    }
    const r = BigInt(s);
    return a === "-" ? BigInt(-1) * r : r;
  }
  const n = parseInt(s, t);
  return a === "-" ? -1 * n : n;
}
function Kt(s, e, t) {
  const { value: i } = s;
  if (Be(i)) {
    const a = i.toString(e);
    return i < 0 ? "-" + t + a.substr(1) : t + a;
  }
  return q(s);
}
const na = {
  identify: Be,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: (s, e, t) => ct(s, 2, 2, t),
  stringify: (s) => Kt(s, 2, "0b")
}, ra = {
  identify: Be,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: (s, e, t) => ct(s, 1, 8, t),
  stringify: (s) => Kt(s, 8, "0")
}, oa = {
  identify: Be,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: (s, e, t) => ct(s, 0, 10, t),
  stringify: q
}, la = {
  identify: Be,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: (s, e, t) => ct(s, 2, 16, t),
  stringify: (s) => Kt(s, 16, "0x")
};
class pe extends U {
  constructor(e) {
    super(e), this.tag = pe.tag;
  }
  add(e) {
    let t;
    D(e) ? t = e : e && typeof e == "object" && "key" in e && "value" in e && e.value === null ? t = new B(e.key, null) : t = new B(e, null), te(this.items, t.key) || this.items.push(t);
  }
  /**
   * If `keepPair` is `true`, returns the Pair matching `key`.
   * Otherwise, returns the value of that Pair's key.
   */
  get(e, t) {
    const i = te(this.items, e);
    return !t && D(i) ? I(i.key) ? i.key.value : i.key : i;
  }
  set(e, t) {
    if (typeof t != "boolean")
      throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);
    const i = te(this.items, e);
    i && !t ? this.items.splice(this.items.indexOf(i), 1) : !i && t && this.items.push(new B(e));
  }
  toJSON(e, t) {
    return super.toJSON(e, t, Set);
  }
  toString(e, t, i) {
    if (!e)
      return JSON.stringify(this);
    if (this.hasAllNullValues(!0))
      return super.toString(Object.assign({}, e, { allNullValues: !0 }), t, i);
    throw new Error("Set items must all have null values");
  }
  static from(e, t, i) {
    const { replacer: a } = i, n = new this(e);
    if (t && Symbol.iterator in Object(t))
      for (let r of t)
        typeof a == "function" && (r = a.call(t, r, r)), n.items.push(Pt(r, null, i));
    return n;
  }
}
pe.tag = "tag:yaml.org,2002:set";
const zt = {
  collection: "map",
  identify: (s) => s instanceof Set,
  nodeClass: pe,
  default: !1,
  tag: "tag:yaml.org,2002:set",
  createNode: (s, e, t) => pe.from(s, e, t),
  resolve(s, e) {
    if (Me(s)) {
      if (s.hasAllNullValues(!0))
        return Object.assign(new pe(), s);
      e("Set items must all have null values");
    } else
      e("Expected a mapping for this tag");
    return s;
  }
};
function qt(s, e) {
  const t = s[0], i = t === "-" || t === "+" ? s.substring(1) : s, a = (r) => e ? BigInt(r) : Number(r), n = i.replace(/_/g, "").split(":").reduce((r, o) => r * a(60) + a(o), a(0));
  return t === "-" ? a(-1) * n : n;
}
function Vs(s) {
  let { value: e } = s, t = (r) => r;
  if (typeof e == "bigint")
    t = (r) => BigInt(r);
  else if (isNaN(e) || !isFinite(e))
    return q(s);
  let i = "";
  e < 0 && (i = "-", e *= t(-1));
  const a = t(60), n = [e % a];
  return e < 60 ? n.unshift(0) : (e = (e - n[0]) / a, n.unshift(e % a), e >= 60 && (e = (e - n[0]) / a, n.unshift(e))), i + n.map((r) => String(r).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
const Ws = {
  identify: (s) => typeof s == "bigint" || Number.isInteger(s),
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: (s, e, { intAsBigInt: t }) => qt(s, t),
  stringify: Vs
}, Gs = {
  identify: (s) => typeof s == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: (s) => qt(s, !1),
  stringify: Vs
}, dt = {
  identify: (s) => s instanceof Date,
  default: !0,
  tag: "tag:yaml.org,2002:timestamp",
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(s) {
    const e = s.match(dt.test);
    if (!e)
      throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, t, i, a, n, r, o] = e.map(Number), l = e[7] ? Number((e[7] + "00").substr(1, 3)) : 0;
    let c = Date.UTC(t, i - 1, a, n || 0, r || 0, o || 0, l);
    const u = e[8];
    if (u && u !== "Z") {
      let d = qt(u, !1);
      Math.abs(d) < 30 && (d *= 60), c -= 6e4 * d;
    }
    return new Date(c);
  },
  stringify: ({ value: s }) => s?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
}, rs = [
  we,
  $e,
  rt,
  ot,
  Fs,
  Ys,
  na,
  ra,
  oa,
  la,
  sa,
  ia,
  aa,
  Bt,
  Y,
  jt,
  Ut,
  zt,
  Ws,
  Gs,
  dt
], os = /* @__PURE__ */ new Map([
  ["core", Xi],
  ["failsafe", [we, $e, rt]],
  ["json", ta],
  ["yaml11", rs],
  ["yaml-1.1", rs]
]), ls = {
  binary: Bt,
  bool: Mt,
  float: Rs,
  floatExp: Ms,
  floatNaN: Ps,
  floatTime: Gs,
  int: js,
  intHex: Ks,
  intOct: Us,
  intTime: Ws,
  map: we,
  merge: Y,
  null: ot,
  omap: jt,
  pairs: Ut,
  seq: $e,
  set: zt,
  timestamp: dt
}, ca = {
  "tag:yaml.org,2002:binary": Bt,
  "tag:yaml.org,2002:merge": Y,
  "tag:yaml.org,2002:omap": jt,
  "tag:yaml.org,2002:pairs": Ut,
  "tag:yaml.org,2002:set": zt,
  "tag:yaml.org,2002:timestamp": dt
};
function ut(s, e, t) {
  const i = os.get(e);
  if (i && !s)
    return t && !i.includes(Y) ? i.concat(Y) : i.slice();
  let a = i;
  if (!a)
    if (Array.isArray(s))
      a = [];
    else {
      const n = Array.from(os.keys()).filter((r) => r !== "yaml11").map((r) => JSON.stringify(r)).join(", ");
      throw new Error(`Unknown schema "${e}"; use one of ${n} or define customTags array`);
    }
  if (Array.isArray(s))
    for (const n of s)
      a = a.concat(n);
  else typeof s == "function" && (a = s(a.slice()));
  return t && (a = a.concat(Y)), a.reduce((n, r) => {
    const o = typeof r == "string" ? ls[r] : r;
    if (!o) {
      const l = JSON.stringify(r), c = Object.keys(ls).map((u) => JSON.stringify(u)).join(", ");
      throw new Error(`Unknown custom tag ${l}; use one of ${c}`);
    }
    return n.includes(o) || n.push(o), n;
  }, []);
}
const da = (s, e) => s.key < e.key ? -1 : s.key > e.key ? 1 : 0;
class Ht {
  constructor({ compat: e, customTags: t, merge: i, resolveKnownTags: a, schema: n, sortMapEntries: r, toStringDefaults: o }) {
    this.compat = Array.isArray(e) ? ut(e, "compat") : e ? ut(null, e) : null, this.name = typeof n == "string" && n || "core", this.knownTags = a ? ca : {}, this.tags = ut(t, this.name, i), this.toStringOptions = o ?? null, Object.defineProperty(this, Q, { value: we }), Object.defineProperty(this, H, { value: rt }), Object.defineProperty(this, ye, { value: $e }), this.sortMapEntries = typeof r == "function" ? r : r === !0 ? da : null;
  }
  clone() {
    const e = Object.create(Ht.prototype, Object.getOwnPropertyDescriptors(this));
    return e.tags = this.tags.slice(), e;
  }
}
function ha(s, e) {
  const t = [];
  let i = e.directives === !0;
  if (e.directives !== !1 && s.directives) {
    const l = s.directives.toString(s);
    l ? (t.push(l), i = !0) : s.directives.docStart && (i = !0);
  }
  i && t.push("---");
  const a = Ts(s, e), { commentString: n } = a.options;
  if (s.commentBefore) {
    t.length !== 1 && t.unshift("");
    const l = n(s.commentBefore);
    t.unshift(F(l, ""));
  }
  let r = !1, o = null;
  if (s.contents) {
    if (L(s.contents)) {
      if (s.contents.spaceBefore && i && t.push(""), s.contents.commentBefore) {
        const u = n(s.contents.commentBefore);
        t.push(F(u, ""));
      }
      a.forceBlockIndent = !!s.comment, o = s.contents.comment;
    }
    const l = o ? void 0 : () => r = !0;
    let c = ge(s.contents, a, () => o = null, l);
    o && (c += ee(c, "", n(o))), (c[0] === "|" || c[0] === ">") && t[t.length - 1] === "---" ? t[t.length - 1] = `--- ${c}` : t.push(c);
  } else
    t.push(ge(s.contents, a));
  if (s.directives?.docEnd)
    if (s.comment) {
      const l = n(s.comment);
      l.includes(`
`) ? (t.push("..."), t.push(F(l, ""))) : t.push(`... ${l}`);
    } else
      t.push("...");
  else {
    let l = s.comment;
    l && r && (l = l.replace(/^\n+/, "")), l && ((!r || o) && t[t.length - 1] !== "" && t.push(""), t.push(F(n(l), "")));
  }
  return t.join(`
`) + `
`;
}
let Qs = class Js {
  constructor(e, t, i) {
    this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, K, { value: vt });
    let a = null;
    typeof t == "function" || Array.isArray(t) ? a = t : i === void 0 && t && (i = t, t = void 0);
    const n = Object.assign({
      intAsBigInt: !1,
      keepSourceTokens: !1,
      logLevel: "warn",
      prettyErrors: !0,
      strict: !0,
      stringKeys: !1,
      uniqueKeys: !0,
      version: "1.2"
    }, i);
    this.options = n;
    let { version: r } = n;
    i?._directives ? (this.directives = i._directives.atDocument(), this.directives.yaml.explicit && (r = this.directives.yaml.version)) : this.directives = new R({ version: r }), this.setSchema(r, i), this.contents = e === void 0 ? null : this.createNode(e, a, i);
  }
  /**
   * Create a deep copy of this Document and its contents.
   *
   * Custom Node values that inherit from `Object` still refer to their original instances.
   */
  clone() {
    const e = Object.create(Js.prototype, {
      [K]: { value: vt }
    });
    return e.commentBefore = this.commentBefore, e.comment = this.comment, e.errors = this.errors.slice(), e.warnings = this.warnings.slice(), e.options = Object.assign({}, this.options), this.directives && (e.directives = this.directives.clone()), e.schema = this.schema.clone(), e.contents = L(this.contents) ? this.contents.clone(e.schema) : this.contents, this.range && (e.range = this.range.slice()), e;
  }
  /** Adds a value to the document. */
  add(e) {
    ne(this.contents) && this.contents.add(e);
  }
  /** Adds a value to the document. */
  addIn(e, t) {
    ne(this.contents) && this.contents.addIn(e, t);
  }
  /**
   * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
   *
   * If `node` already has an anchor, `name` is ignored.
   * Otherwise, the `node.anchor` value will be set to `name`,
   * or if an anchor with that name is already present in the document,
   * `name` will be used as a prefix for a new unique anchor.
   * If `name` is undefined, the generated anchor will use 'a' as a prefix.
   */
  createAlias(e, t) {
    if (!e.anchor) {
      const i = _s(this);
      e.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !t || i.has(t) ? Ss(t || "a", i) : t;
    }
    return new Lt(e.anchor);
  }
  createNode(e, t, i) {
    let a;
    if (typeof t == "function")
      e = t.call({ "": e }, "", e), a = t;
    else if (Array.isArray(t)) {
      const g = (k) => typeof k == "number" || k instanceof String || k instanceof Number, x = t.filter(g).map(String);
      x.length > 0 && (t = t.concat(x)), a = t;
    } else i === void 0 && t && (i = t, t = void 0);
    const { aliasDuplicateObjects: n, anchorPrefix: r, flow: o, keepUndefined: l, onTagObj: c, tag: u } = i ?? {}, { onAnchor: d, setAnchors: h, sourceObjects: f } = Ui(
      this,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      r || "a"
    ), v = {
      aliasDuplicateObjects: n ?? !0,
      keepUndefined: l ?? !1,
      onAnchor: d,
      onTagObj: c,
      replacer: a,
      schema: this.schema,
      sourceObjects: f
    }, p = Le(e, u, v);
    return o && C(p) && (p.flow = !0), h(), p;
  }
  /**
   * Convert a key and a value into a `Pair` using the current schema,
   * recursively wrapping all values as `Scalar` or `Collection` nodes.
   */
  createPair(e, t, i = {}) {
    const a = this.createNode(e, null, i), n = this.createNode(t, null, i);
    return new B(a, n);
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  delete(e) {
    return ne(this.contents) ? this.contents.delete(e) : !1;
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(e) {
    return _e(e) ? this.contents == null ? !1 : (this.contents = null, !0) : ne(this.contents) ? this.contents.deleteIn(e) : !1;
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  get(e, t) {
    return C(this.contents) ? this.contents.get(e, t) : void 0;
  }
  /**
   * Returns item at `path`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(e, t) {
    return _e(e) ? !t && I(this.contents) ? this.contents.value : this.contents : C(this.contents) ? this.contents.getIn(e, t) : void 0;
  }
  /**
   * Checks if the document includes a value with the key `key`.
   */
  has(e) {
    return C(this.contents) ? this.contents.has(e) : !1;
  }
  /**
   * Checks if the document includes a value at `path`.
   */
  hasIn(e) {
    return _e(e) ? this.contents !== void 0 : C(this.contents) ? this.contents.hasIn(e) : !1;
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  set(e, t) {
    this.contents == null ? this.contents = Je(this.schema, [e], t) : ne(this.contents) && this.contents.set(e, t);
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(e, t) {
    _e(e) ? this.contents = t : this.contents == null ? this.contents = Je(this.schema, Array.from(e), t) : ne(this.contents) && this.contents.setIn(e, t);
  }
  /**
   * Change the YAML version and schema used by the document.
   * A `null` version disables support for directives, explicit tags, anchors, and aliases.
   * It also requires the `schema` option to be given as a `Schema` instance value.
   *
   * Overrides all previously set schema options.
   */
  setSchema(e, t = {}) {
    typeof e == "number" && (e = String(e));
    let i;
    switch (e) {
      case "1.1":
        this.directives ? this.directives.yaml.version = "1.1" : this.directives = new R({ version: "1.1" }), i = { resolveKnownTags: !1, schema: "yaml-1.1" };
        break;
      case "1.2":
      case "next":
        this.directives ? this.directives.yaml.version = e : this.directives = new R({ version: e }), i = { resolveKnownTags: !0, schema: "core" };
        break;
      case null:
        this.directives && delete this.directives, i = null;
        break;
      default: {
        const a = JSON.stringify(e);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${a}`);
      }
    }
    if (t.schema instanceof Object)
      this.schema = t.schema;
    else if (i)
      this.schema = new Ht(Object.assign(i, t));
    else
      throw new Error("With a null YAML version, the { schema: Schema } option is required");
  }
  // json & jsonArg are only used from toJSON()
  toJS({ json: e, jsonArg: t, mapAsMap: i, maxAliasCount: a, onAnchor: n, reviver: r } = {}) {
    const o = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !e,
      mapAsMap: i === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof a == "number" ? a : 100
    }, l = j(this.contents, t ?? "", o);
    if (typeof n == "function")
      for (const { count: c, res: u } of o.anchors.values())
        n(u, c);
    return typeof r == "function" ? ce(r, { "": l }, "", l) : l;
  }
  /**
   * A JSON representation of the document `contents`.
   *
   * @param jsonArg Used by `JSON.stringify` to indicate the array index or
   *   property name.
   */
  toJSON(e, t) {
    return this.toJS({ json: !0, jsonArg: e, mapAsMap: !1, onAnchor: t });
  }
  /** A YAML representation of the document. */
  toString(e = {}) {
    if (this.errors.length > 0)
      throw new Error("Document with errors cannot be stringified");
    if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
      const t = JSON.stringify(e.indent);
      throw new Error(`"indent" option must be a positive integer, not ${t}`);
    }
    return ha(this, e);
  }
};
function ne(s) {
  if (C(s))
    return !0;
  throw new Error("Expected a YAML collection as document contents");
}
class Xs extends Error {
  constructor(e, t, i, a) {
    super(), this.name = e, this.code = i, this.message = a, this.pos = t;
  }
}
class Se extends Xs {
  constructor(e, t, i) {
    super("YAMLParseError", e, t, i);
  }
}
class pa extends Xs {
  constructor(e, t, i) {
    super("YAMLWarning", e, t, i);
  }
}
const cs = (s, e) => (t) => {
  if (t.pos[0] === -1)
    return;
  t.linePos = t.pos.map((o) => e.linePos(o));
  const { line: i, col: a } = t.linePos[0];
  t.message += ` at line ${i}, column ${a}`;
  let n = a - 1, r = s.substring(e.lineStarts[i - 1], e.lineStarts[i]).replace(/[\n\r]+$/, "");
  if (n >= 60 && r.length > 80) {
    const o = Math.min(n - 39, r.length - 79);
    r = "…" + r.substring(o), n -= o - 1;
  }
  if (r.length > 80 && (r = r.substring(0, 79) + "…"), i > 1 && /^ *$/.test(r.substring(0, n))) {
    let o = s.substring(e.lineStarts[i - 2], e.lineStarts[i - 1]);
    o.length > 80 && (o = o.substring(0, 79) + `…
`), r = o + r;
  }
  if (/[^ ]/.test(r)) {
    let o = 1;
    const l = t.linePos[1];
    l?.line === i && l.col > a && (o = Math.max(1, Math.min(l.col - a, 80 - n)));
    const c = " ".repeat(n) + "^".repeat(o);
    t.message += `:

${r}
${c}
`;
  }
};
function me(s, { flow: e, indicator: t, next: i, offset: a, onError: n, parentIndent: r, startOnNewline: o }) {
  let l = !1, c = o, u = o, d = "", h = "", f = !1, v = !1, p = null, g = null, x = null, k = null, S = null, A = null, E = null;
  for (const $ of s)
    switch (v && ($.type !== "space" && $.type !== "newline" && $.type !== "comma" && n($.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), v = !1), p && (c && $.type !== "comment" && $.type !== "newline" && n(p, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), p = null), $.type) {
      case "space":
        !e && (t !== "doc-start" || i?.type !== "flow-collection") && $.source.includes("	") && (p = $), u = !0;
        break;
      case "comment": {
        u || n($, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
        const P = $.source.substring(1) || " ";
        d ? d += h + P : d = P, h = "", c = !1;
        break;
      }
      case "newline":
        c ? d ? d += $.source : (!A || t !== "seq-item-ind") && (l = !0) : h += $.source, c = !0, f = !0, (g || x) && (k = $), u = !0;
        break;
      case "anchor":
        g && n($, "MULTIPLE_ANCHORS", "A node can have at most one anchor"), $.source.endsWith(":") && n($.offset + $.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0), g = $, E ?? (E = $.offset), c = !1, u = !1, v = !0;
        break;
      case "tag": {
        x && n($, "MULTIPLE_TAGS", "A node can have at most one tag"), x = $, E ?? (E = $.offset), c = !1, u = !1, v = !0;
        break;
      }
      case t:
        (g || x) && n($, "BAD_PROP_ORDER", `Anchors and tags must be after the ${$.source} indicator`), A && n($, "UNEXPECTED_TOKEN", `Unexpected ${$.source} in ${e ?? "collection"}`), A = $, c = t === "seq-item-ind" || t === "explicit-key-ind", u = !1;
        break;
      case "comma":
        if (e) {
          S && n($, "UNEXPECTED_TOKEN", `Unexpected , in ${e}`), S = $, c = !1, u = !1;
          break;
        }
      // else fallthrough
      default:
        n($, "UNEXPECTED_TOKEN", `Unexpected ${$.type} token`), c = !1, u = !1;
    }
  const T = s[s.length - 1], O = T ? T.offset + T.source.length : a;
  return v && i && i.type !== "space" && i.type !== "newline" && i.type !== "comma" && (i.type !== "scalar" || i.source !== "") && n(i.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), p && (c && p.indent <= r || i?.type === "block-map" || i?.type === "block-seq") && n(p, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), {
    comma: S,
    found: A,
    spaceBefore: l,
    comment: d,
    hasNewline: f,
    anchor: g,
    tag: x,
    newlineAfterProp: k,
    end: O,
    start: E ?? O
  };
}
function De(s) {
  if (!s)
    return null;
  switch (s.type) {
    case "alias":
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      if (s.source.includes(`
`))
        return !0;
      if (s.end) {
        for (const e of s.end)
          if (e.type === "newline")
            return !0;
      }
      return !1;
    case "flow-collection":
      for (const e of s.items) {
        for (const t of e.start)
          if (t.type === "newline")
            return !0;
        if (e.sep) {
          for (const t of e.sep)
            if (t.type === "newline")
              return !0;
        }
        if (De(e.key) || De(e.value))
          return !0;
      }
      return !1;
    default:
      return !0;
  }
}
function xt(s, e, t) {
  if (e?.type === "flow-collection") {
    const i = e.end[0];
    i.indent === s && (i.source === "]" || i.source === "}") && De(e) && t(i, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
  }
}
function Zs(s, e, t) {
  const { uniqueKeys: i } = s.options;
  if (i === !1)
    return !1;
  const a = typeof i == "function" ? i : (n, r) => n === r || I(n) && I(r) && n.value === r.value;
  return e.some((n) => a(n.key, t));
}
const ds = "All mapping items must start at the same column";
function ua({ composeNode: s, composeEmptyNode: e }, t, i, a, n) {
  const r = n?.nodeClass ?? U, o = new r(t.schema);
  t.atRoot && (t.atRoot = !1);
  let l = i.offset, c = null;
  for (const u of i.items) {
    const { start: d, key: h, sep: f, value: v } = u, p = me(d, {
      indicator: "explicit-key-ind",
      next: h ?? f?.[0],
      offset: l,
      onError: a,
      parentIndent: i.indent,
      startOnNewline: !0
    }), g = !p.found;
    if (g) {
      if (h && (h.type === "block-seq" ? a(l, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key") : "indent" in h && h.indent !== i.indent && a(l, "BAD_INDENT", ds)), !p.anchor && !p.tag && !f) {
        c = p.end, p.comment && (o.comment ? o.comment += `
` + p.comment : o.comment = p.comment);
        continue;
      }
      (p.newlineAfterProp || De(h)) && a(h ?? d[d.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
    } else p.found?.indent !== i.indent && a(l, "BAD_INDENT", ds);
    t.atKey = !0;
    const x = p.end, k = h ? s(t, h, p, a) : e(t, x, d, null, p, a);
    t.schema.compat && xt(i.indent, h, a), t.atKey = !1, Zs(t, o.items, k) && a(x, "DUPLICATE_KEY", "Map keys must be unique");
    const S = me(f ?? [], {
      indicator: "map-value-ind",
      next: v,
      offset: k.range[2],
      onError: a,
      parentIndent: i.indent,
      startOnNewline: !h || h.type === "block-scalar"
    });
    if (l = S.end, S.found) {
      g && (v?.type === "block-map" && !S.hasNewline && a(l, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"), t.options.strict && p.start < S.found.offset - 1024 && a(k.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));
      const A = v ? s(t, v, S, a) : e(t, l, f, null, S, a);
      t.schema.compat && xt(i.indent, v, a), l = A.range[2];
      const E = new B(k, A);
      t.options.keepSourceTokens && (E.srcToken = u), o.items.push(E);
    } else {
      g && a(k.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"), S.comment && (k.comment ? k.comment += `
` + S.comment : k.comment = S.comment);
      const A = new B(k);
      t.options.keepSourceTokens && (A.srcToken = u), o.items.push(A);
    }
  }
  return c && c < l && a(c, "IMPOSSIBLE", "Map comment with trailing content"), o.range = [i.offset, l, c ?? l], o;
}
function fa({ composeNode: s, composeEmptyNode: e }, t, i, a, n) {
  const r = n?.nodeClass ?? ie, o = new r(t.schema);
  t.atRoot && (t.atRoot = !1), t.atKey && (t.atKey = !1);
  let l = i.offset, c = null;
  for (const { start: u, value: d } of i.items) {
    const h = me(u, {
      indicator: "seq-item-ind",
      next: d,
      offset: l,
      onError: a,
      parentIndent: i.indent,
      startOnNewline: !0
    });
    if (!h.found)
      if (h.anchor || h.tag || d)
        d?.type === "block-seq" ? a(h.end, "BAD_INDENT", "All sequence items must start at the same column") : a(l, "MISSING_CHAR", "Sequence item without - indicator");
      else {
        c = h.end, h.comment && (o.comment = h.comment);
        continue;
      }
    const f = d ? s(t, d, h, a) : e(t, h.end, u, null, h, a);
    t.schema.compat && xt(i.indent, d, a), l = f.range[2], o.items.push(f);
  }
  return o.range = [i.offset, l, c ?? l], o;
}
function Ue(s, e, t, i) {
  let a = "";
  if (s) {
    let n = !1, r = "";
    for (const o of s) {
      const { source: l, type: c } = o;
      switch (c) {
        case "space":
          n = !0;
          break;
        case "comment": {
          t && !n && i(o, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const u = l.substring(1) || " ";
          a ? a += r + u : a = u, r = "";
          break;
        }
        case "newline":
          a && (r += l), n = !0;
          break;
        default:
          i(o, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
      }
      e += l.length;
    }
  }
  return { comment: a, offset: e };
}
const ft = "Block collections are not allowed within flow collections", gt = (s) => s && (s.type === "block-map" || s.type === "block-seq");
function ga({ composeNode: s, composeEmptyNode: e }, t, i, a, n) {
  const r = i.start.source === "{", o = r ? "flow map" : "flow sequence", l = n?.nodeClass ?? (r ? U : ie), c = new l(t.schema);
  c.flow = !0;
  const u = t.atRoot;
  u && (t.atRoot = !1), t.atKey && (t.atKey = !1);
  let d = i.offset + i.start.source.length;
  for (let g = 0; g < i.items.length; ++g) {
    const x = i.items[g], { start: k, key: S, sep: A, value: E } = x, T = me(k, {
      flow: o,
      indicator: "explicit-key-ind",
      next: S ?? A?.[0],
      offset: d,
      onError: a,
      parentIndent: i.indent,
      startOnNewline: !1
    });
    if (!T.found) {
      if (!T.anchor && !T.tag && !A && !E) {
        g === 0 && T.comma ? a(T.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${o}`) : g < i.items.length - 1 && a(T.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${o}`), T.comment && (c.comment ? c.comment += `
` + T.comment : c.comment = T.comment), d = T.end;
        continue;
      }
      !r && t.options.strict && De(S) && a(
        S,
        // checked by containsNewline()
        "MULTILINE_IMPLICIT_KEY",
        "Implicit keys of flow sequence pairs need to be on a single line"
      );
    }
    if (g === 0)
      T.comma && a(T.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${o}`);
    else if (T.comma || a(T.start, "MISSING_CHAR", `Missing , between ${o} items`), T.comment) {
      let O = "";
      e: for (const $ of k)
        switch ($.type) {
          case "comma":
          case "space":
            break;
          case "comment":
            O = $.source.substring(1);
            break e;
          default:
            break e;
        }
      if (O) {
        let $ = c.items[c.items.length - 1];
        D($) && ($ = $.value ?? $.key), $.comment ? $.comment += `
` + O : $.comment = O, T.comment = T.comment.substring(O.length + 1);
      }
    }
    if (!r && !A && !T.found) {
      const O = E ? s(t, E, T, a) : e(t, T.end, A, null, T, a);
      c.items.push(O), d = O.range[2], gt(E) && a(O.range, "BLOCK_IN_FLOW", ft);
    } else {
      t.atKey = !0;
      const O = T.end, $ = S ? s(t, S, T, a) : e(t, O, k, null, T, a);
      gt(S) && a($.range, "BLOCK_IN_FLOW", ft), t.atKey = !1;
      const P = me(A ?? [], {
        flow: o,
        indicator: "map-value-ind",
        next: E,
        offset: $.range[2],
        onError: a,
        parentIndent: i.indent,
        startOnNewline: !1
      });
      if (P.found) {
        if (!r && !T.found && t.options.strict) {
          if (A)
            for (const M of A) {
              if (M === P.found)
                break;
              if (M.type === "newline") {
                a(M, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                break;
              }
            }
          T.start < P.found.offset - 1024 && a(P.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
        }
      } else E && ("source" in E && E.source?.[0] === ":" ? a(E, "MISSING_CHAR", `Missing space after : in ${o}`) : a(P.start, "MISSING_CHAR", `Missing , or : between ${o} items`));
      const V = E ? s(t, E, P, a) : P.found ? e(t, P.end, A, null, P, a) : null;
      V ? gt(E) && a(V.range, "BLOCK_IN_FLOW", ft) : P.comment && ($.comment ? $.comment += `
` + P.comment : $.comment = P.comment);
      const ae = new B($, V);
      if (t.options.keepSourceTokens && (ae.srcToken = x), r) {
        const M = c;
        Zs(t, M.items, $) && a(O, "DUPLICATE_KEY", "Map keys must be unique"), M.items.push(ae);
      } else {
        const M = new U(t.schema);
        M.flow = !0, M.items.push(ae);
        const Yt = (V ?? $).range;
        M.range = [$.range[0], Yt[1], Yt[2]], c.items.push(M);
      }
      d = V ? V.range[2] : P.end;
    }
  }
  const h = r ? "}" : "]", [f, ...v] = i.end;
  let p = d;
  if (f?.source === h)
    p = f.offset + f.source.length;
  else {
    const g = o[0].toUpperCase() + o.substring(1), x = u ? `${g} must end with a ${h}` : `${g} in block collection must be sufficiently indented and end with a ${h}`;
    a(d, u ? "MISSING_CHAR" : "BAD_INDENT", x), f && f.source.length !== 1 && v.unshift(f);
  }
  if (v.length > 0) {
    const g = Ue(v, p, t.options.strict, a);
    g.comment && (c.comment ? c.comment += `
` + g.comment : c.comment = g.comment), c.range = [i.offset, p, g.offset];
  } else
    c.range = [i.offset, p, p];
  return c;
}
function mt(s, e, t, i, a, n) {
  const r = t.type === "block-map" ? ua(s, e, t, i, n) : t.type === "block-seq" ? fa(s, e, t, i, n) : ga(s, e, t, i, n), o = r.constructor;
  return a === "!" || a === o.tagName ? (r.tag = o.tagName, r) : (a && (r.tag = a), r);
}
function ma(s, e, t, i, a) {
  const n = i.tag, r = n ? e.directives.tagName(n.source, (h) => a(n, "TAG_RESOLVE_FAILED", h)) : null;
  if (t.type === "block-seq") {
    const { anchor: h, newlineAfterProp: f } = i, v = h && n ? h.offset > n.offset ? h : n : h ?? n;
    v && (!f || f.offset < v.offset) && a(v, "MISSING_CHAR", "Missing newline after block sequence props");
  }
  const o = t.type === "block-map" ? "map" : t.type === "block-seq" ? "seq" : t.start.source === "{" ? "map" : "seq";
  if (!n || !r || r === "!" || r === U.tagName && o === "map" || r === ie.tagName && o === "seq")
    return mt(s, e, t, a, r);
  let l = e.schema.tags.find((h) => h.tag === r && h.collection === o);
  if (!l) {
    const h = e.schema.knownTags[r];
    if (h?.collection === o)
      e.schema.tags.push(Object.assign({}, h, { default: !1 })), l = h;
    else
      return h ? a(n, "BAD_COLLECTION_TYPE", `${h.tag} used for ${o} collection, but expects ${h.collection ?? "scalar"}`, !0) : a(n, "TAG_RESOLVE_FAILED", `Unresolved tag: ${r}`, !0), mt(s, e, t, a, r);
  }
  const c = mt(s, e, t, a, r, l), u = l.resolve?.(c, (h) => a(n, "TAG_RESOLVE_FAILED", h), e.options) ?? c, d = L(u) ? u : new N(u);
  return d.range = c.range, d.tag = r, l?.format && (d.format = l.format), d;
}
function ya(s, e, t) {
  const i = e.offset, a = va(e, s.options.strict, t);
  if (!a)
    return { value: "", type: null, comment: "", range: [i, i, i] };
  const n = a.mode === ">" ? N.BLOCK_FOLDED : N.BLOCK_LITERAL, r = e.source ? ba(e.source) : [];
  let o = r.length;
  for (let p = r.length - 1; p >= 0; --p) {
    const g = r[p][1];
    if (g === "" || g === "\r")
      o = p;
    else
      break;
  }
  if (o === 0) {
    const p = a.chomp === "+" && r.length > 0 ? `
`.repeat(Math.max(1, r.length - 1)) : "";
    let g = i + a.length;
    return e.source && (g += e.source.length), { value: p, type: n, comment: a.comment, range: [i, g, g] };
  }
  let l = e.indent + a.indent, c = e.offset + a.length, u = 0;
  for (let p = 0; p < o; ++p) {
    const [g, x] = r[p];
    if (x === "" || x === "\r")
      a.indent === 0 && g.length > l && (l = g.length);
    else {
      g.length < l && t(c + g.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator"), a.indent === 0 && (l = g.length), u = p, l === 0 && !s.atRoot && t(c, "BAD_INDENT", "Block scalar values in collections must be indented");
      break;
    }
    c += g.length + x.length + 1;
  }
  for (let p = r.length - 1; p >= o; --p)
    r[p][0].length > l && (o = p + 1);
  let d = "", h = "", f = !1;
  for (let p = 0; p < u; ++p)
    d += r[p][0].slice(l) + `
`;
  for (let p = u; p < o; ++p) {
    let [g, x] = r[p];
    c += g.length + x.length + 1;
    const k = x[x.length - 1] === "\r";
    if (k && (x = x.slice(0, -1)), x && g.length < l) {
      const A = `Block scalar lines must not be less indented than their ${a.indent ? "explicit indentation indicator" : "first line"}`;
      t(c - x.length - (k ? 2 : 1), "BAD_INDENT", A), g = "";
    }
    n === N.BLOCK_LITERAL ? (d += h + g.slice(l) + x, h = `
`) : g.length > l || x[0] === "	" ? (h === " " ? h = `
` : !f && h === `
` && (h = `

`), d += h + g.slice(l) + x, h = `
`, f = !0) : x === "" ? h === `
` ? d += `
` : h = `
` : (d += h + x, h = " ", f = !1);
  }
  switch (a.chomp) {
    case "-":
      break;
    case "+":
      for (let p = o; p < r.length; ++p)
        d += `
` + r[p][0].slice(l);
      d[d.length - 1] !== `
` && (d += `
`);
      break;
    default:
      d += `
`;
  }
  const v = i + a.length + e.source.length;
  return { value: d, type: n, comment: a.comment, range: [i, v, v] };
}
function va({ offset: s, props: e }, t, i) {
  if (e[0].type !== "block-scalar-header")
    return i(e[0], "IMPOSSIBLE", "Block scalar header not found"), null;
  const { source: a } = e[0], n = a[0];
  let r = 0, o = "", l = -1;
  for (let h = 1; h < a.length; ++h) {
    const f = a[h];
    if (!o && (f === "-" || f === "+"))
      o = f;
    else {
      const v = Number(f);
      !r && v ? r = v : l === -1 && (l = s + h);
    }
  }
  l !== -1 && i(l, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${a}`);
  let c = !1, u = "", d = a.length;
  for (let h = 1; h < e.length; ++h) {
    const f = e[h];
    switch (f.type) {
      case "space":
        c = !0;
      // fallthrough
      case "newline":
        d += f.source.length;
        break;
      case "comment":
        t && !c && i(f, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"), d += f.source.length, u = f.source.substring(1);
        break;
      case "error":
        i(f, "UNEXPECTED_TOKEN", f.message), d += f.source.length;
        break;
      /* istanbul ignore next should not happen */
      default: {
        const v = `Unexpected token in block scalar header: ${f.type}`;
        i(f, "UNEXPECTED_TOKEN", v);
        const p = f.source;
        p && typeof p == "string" && (d += p.length);
      }
    }
  }
  return { mode: n, indent: r, chomp: o, comment: u, length: d };
}
function ba(s) {
  const e = s.split(/\n( *)/), t = e[0], i = t.match(/^( *)/), n = [i?.[1] ? [i[1], t.slice(i[1].length)] : ["", t]];
  for (let r = 1; r < e.length; r += 2)
    n.push([e[r], e[r + 1]]);
  return n;
}
function wa(s, e, t) {
  const { offset: i, type: a, source: n, end: r } = s;
  let o, l;
  const c = (h, f, v) => t(i + h, f, v);
  switch (a) {
    case "scalar":
      o = N.PLAIN, l = $a(n, c);
      break;
    case "single-quoted-scalar":
      o = N.QUOTE_SINGLE, l = xa(n, c);
      break;
    case "double-quoted-scalar":
      o = N.QUOTE_DOUBLE, l = ka(n, c);
      break;
    /* istanbul ignore next should not happen */
    default:
      return t(s, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${a}`), {
        value: "",
        type: null,
        comment: "",
        range: [i, i + n.length, i + n.length]
      };
  }
  const u = i + n.length, d = Ue(r, u, e, t);
  return {
    value: l,
    type: o,
    comment: d.comment,
    range: [i, u, d.offset]
  };
}
function $a(s, e) {
  let t = "";
  switch (s[0]) {
    /* istanbul ignore next should not happen */
    case "	":
      t = "a tab character";
      break;
    case ",":
      t = "flow indicator character ,";
      break;
    case "%":
      t = "directive indicator character %";
      break;
    case "|":
    case ">": {
      t = `block scalar indicator ${s[0]}`;
      break;
    }
    case "@":
    case "`": {
      t = `reserved character ${s[0]}`;
      break;
    }
  }
  return t && e(0, "BAD_SCALAR_START", `Plain value cannot start with ${t}`), ei(s);
}
function xa(s, e) {
  return (s[s.length - 1] !== "'" || s.length === 1) && e(s.length, "MISSING_CHAR", "Missing closing 'quote"), ei(s.slice(1, -1)).replace(/''/g, "'");
}
function ei(s) {
  let e, t;
  try {
    e = new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`, "sy"), t = new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`, "sy");
  } catch {
    e = /(.*?)[ \t]*\r?\n/sy, t = /[ \t]*(.*?)[ \t]*\r?\n/sy;
  }
  let i = e.exec(s);
  if (!i)
    return s;
  let a = i[1], n = " ", r = e.lastIndex;
  for (t.lastIndex = r; i = t.exec(s); )
    i[1] === "" ? n === `
` ? a += n : n = `
` : (a += n + i[1], n = " "), r = t.lastIndex;
  const o = /[ \t]*(.*)/sy;
  return o.lastIndex = r, i = o.exec(s), a + n + (i?.[1] ?? "");
}
function ka(s, e) {
  let t = "";
  for (let i = 1; i < s.length - 1; ++i) {
    const a = s[i];
    if (!(a === "\r" && s[i + 1] === `
`))
      if (a === `
`) {
        const { fold: n, offset: r } = _a(s, i);
        t += n, i = r;
      } else if (a === "\\") {
        let n = s[++i];
        const r = Sa[n];
        if (r)
          t += r;
        else if (n === `
`)
          for (n = s[i + 1]; n === " " || n === "	"; )
            n = s[++i + 1];
        else if (n === "\r" && s[i + 1] === `
`)
          for (n = s[++i + 1]; n === " " || n === "	"; )
            n = s[++i + 1];
        else if (n === "x" || n === "u" || n === "U") {
          const o = n === "x" ? 2 : n === "u" ? 4 : 8;
          t += Aa(s, i + 1, o, e), i += o;
        } else {
          const o = s.substr(i - 1, 2);
          e(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${o}`), t += o;
        }
      } else if (a === " " || a === "	") {
        const n = i;
        let r = s[i + 1];
        for (; r === " " || r === "	"; )
          r = s[++i + 1];
        r !== `
` && !(r === "\r" && s[i + 2] === `
`) && (t += i > n ? s.slice(n, i + 1) : a);
      } else
        t += a;
  }
  return (s[s.length - 1] !== '"' || s.length === 1) && e(s.length, "MISSING_CHAR", 'Missing closing "quote'), t;
}
function _a(s, e) {
  let t = "", i = s[e + 1];
  for (; (i === " " || i === "	" || i === `
` || i === "\r") && !(i === "\r" && s[e + 2] !== `
`); )
    i === `
` && (t += `
`), e += 1, i = s[e + 1];
  return t || (t = " "), { fold: t, offset: e };
}
const Sa = {
  0: "\0",
  // null character
  a: "\x07",
  // bell character
  b: "\b",
  // backspace
  e: "\x1B",
  // escape character
  f: "\f",
  // form feed
  n: `
`,
  // line feed
  r: "\r",
  // carriage return
  t: "	",
  // horizontal tab
  v: "\v",
  // vertical tab
  N: "",
  // Unicode next line
  _: " ",
  // Unicode non-breaking space
  L: "\u2028",
  // Unicode line separator
  P: "\u2029",
  // Unicode paragraph separator
  " ": " ",
  '"': '"',
  "/": "/",
  "\\": "\\",
  "	": "	"
};
function Aa(s, e, t, i) {
  const a = s.substr(e, t), r = a.length === t && /^[0-9a-fA-F]+$/.test(a) ? parseInt(a, 16) : NaN;
  try {
    return String.fromCodePoint(r);
  } catch {
    const o = s.substr(e - 2, t + 2);
    return i(e - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${o}`), o;
  }
}
function ti(s, e, t, i) {
  const { value: a, type: n, comment: r, range: o } = e.type === "block-scalar" ? ya(s, e, i) : wa(e, s.options.strict, i), l = t ? s.directives.tagName(t.source, (d) => i(t, "TAG_RESOLVE_FAILED", d)) : null;
  let c;
  s.options.stringKeys && s.atKey ? c = s.schema[H] : l ? c = Ea(s.schema, a, l, t, i) : e.type === "scalar" ? c = Na(s, a, e, i) : c = s.schema[H];
  let u;
  try {
    const d = c.resolve(a, (h) => i(t ?? e, "TAG_RESOLVE_FAILED", h), s.options);
    u = I(d) ? d : new N(d);
  } catch (d) {
    const h = d instanceof Error ? d.message : String(d);
    i(t ?? e, "TAG_RESOLVE_FAILED", h), u = new N(a);
  }
  return u.range = o, u.source = a, n && (u.type = n), l && (u.tag = l), c.format && (u.format = c.format), r && (u.comment = r), u;
}
function Ea(s, e, t, i, a) {
  if (t === "!")
    return s[H];
  const n = [];
  for (const o of s.tags)
    if (!o.collection && o.tag === t)
      if (o.default && o.test)
        n.push(o);
      else
        return o;
  for (const o of n)
    if (o.test?.test(e))
      return o;
  const r = s.knownTags[t];
  return r && !r.collection ? (s.tags.push(Object.assign({}, r, { default: !1, test: void 0 })), r) : (a(i, "TAG_RESOLVE_FAILED", `Unresolved tag: ${t}`, t !== "tag:yaml.org,2002:str"), s[H]);
}
function Na({ atKey: s, directives: e, schema: t }, i, a, n) {
  const r = t.tags.find((o) => (o.default === !0 || s && o.default === "key") && o.test?.test(i)) || t[H];
  if (t.compat) {
    const o = t.compat.find((l) => l.default && l.test?.test(i)) ?? t[H];
    if (r.tag !== o.tag) {
      const l = e.tagString(r.tag), c = e.tagString(o.tag), u = `Value may be parsed as either ${l} or ${c}`;
      n(a, "TAG_RESOLVE_FAILED", u, !0);
    }
  }
  return r;
}
function Ta(s, e, t) {
  if (e) {
    t ?? (t = e.length);
    for (let i = t - 1; i >= 0; --i) {
      let a = e[i];
      switch (a.type) {
        case "space":
        case "comment":
        case "newline":
          s -= a.source.length;
          continue;
      }
      for (a = e[++i]; a?.type === "space"; )
        s += a.source.length, a = e[++i];
      break;
    }
  }
  return s;
}
const Oa = { composeNode: si, composeEmptyNode: Ft };
function si(s, e, t, i) {
  const a = s.atKey, { spaceBefore: n, comment: r, anchor: o, tag: l } = t;
  let c, u = !0;
  switch (e.type) {
    case "alias":
      c = Ia(s, e, i), (o || l) && i(e, "ALIAS_PROPS", "An alias node must not specify any properties");
      break;
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "block-scalar":
      c = ti(s, e, l, i), o && (c.anchor = o.source.substring(1));
      break;
    case "block-map":
    case "block-seq":
    case "flow-collection":
      try {
        c = ma(Oa, s, e, t, i), o && (c.anchor = o.source.substring(1));
      } catch (d) {
        const h = d instanceof Error ? d.message : String(d);
        i(e, "RESOURCE_EXHAUSTION", h);
      }
      break;
    default: {
      const d = e.type === "error" ? e.message : `Unsupported token (type: ${e.type})`;
      i(e, "UNEXPECTED_TOKEN", d), u = !1;
    }
  }
  return c ?? (c = Ft(s, e.offset, void 0, null, t, i)), o && c.anchor === "" && i(o, "BAD_ALIAS", "Anchor cannot be an empty string"), a && s.options.stringKeys && (!I(c) || typeof c.value != "string" || c.tag && c.tag !== "tag:yaml.org,2002:str") && i(l ?? e, "NON_STRING_KEY", "With stringKeys, all keys must be strings"), n && (c.spaceBefore = !0), r && (e.type === "scalar" && e.source === "" ? c.comment = r : c.commentBefore = r), s.options.keepSourceTokens && u && (c.srcToken = e), c;
}
function Ft(s, e, t, i, { spaceBefore: a, comment: n, anchor: r, tag: o, end: l }, c) {
  const u = {
    type: "scalar",
    offset: Ta(e, t, i),
    indent: -1,
    source: ""
  }, d = ti(s, u, o, c);
  return r && (d.anchor = r.source.substring(1), d.anchor === "" && c(r, "BAD_ALIAS", "Anchor cannot be an empty string")), a && (d.spaceBefore = !0), n && (d.comment = n, d.range[2] = l), d;
}
function Ia({ options: s }, { offset: e, source: t, end: i }, a) {
  const n = new Lt(t.substring(1));
  n.source === "" && a(e, "BAD_ALIAS", "Alias cannot be an empty string"), n.source.endsWith(":") && a(e + t.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
  const r = e + t.length, o = Ue(i, r, s.strict, a);
  return n.range = [e, r, o.offset], o.comment && (n.comment = o.comment), n;
}
function Ca(s, e, { offset: t, start: i, value: a, end: n }, r) {
  const o = Object.assign({ _directives: e }, s), l = new Qs(void 0, o), c = {
    atKey: !1,
    atRoot: !0,
    directives: l.directives,
    options: l.options,
    schema: l.schema
  }, u = me(i, {
    indicator: "doc-start",
    next: a ?? n?.[0],
    offset: t,
    onError: r,
    parentIndent: 0,
    startOnNewline: !0
  });
  u.found && (l.directives.docStart = !0, a && (a.type === "block-map" || a.type === "block-seq") && !u.hasNewline && r(u.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")), l.contents = a ? si(c, a, u, r) : Ft(c, u.end, i, null, u, r);
  const d = l.contents.range[2], h = Ue(n, d, !1, r);
  return h.comment && (l.comment = h.comment), l.range = [t, d, h.offset], l;
}
function ke(s) {
  if (typeof s == "number")
    return [s, s + 1];
  if (Array.isArray(s))
    return s.length === 2 ? s : [s[0], s[1]];
  const { offset: e, source: t } = s;
  return [e, e + (typeof t == "string" ? t.length : 1)];
}
function hs(s) {
  let e = "", t = !1, i = !1;
  for (let a = 0; a < s.length; ++a) {
    const n = s[a];
    switch (n[0]) {
      case "#":
        e += (e === "" ? "" : i ? `

` : `
`) + (n.substring(1) || " "), t = !0, i = !1;
        break;
      case "%":
        s[a + 1]?.[0] !== "#" && (a += 1), t = !1;
        break;
      default:
        t || (i = !0), t = !1;
    }
  }
  return { comment: e, afterEmptyLine: i };
}
class La {
  constructor(e = {}) {
    this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (t, i, a, n) => {
      const r = ke(t);
      n ? this.warnings.push(new pa(r, i, a)) : this.errors.push(new Se(r, i, a));
    }, this.directives = new R({ version: e.version || "1.2" }), this.options = e;
  }
  decorate(e, t) {
    const { comment: i, afterEmptyLine: a } = hs(this.prelude);
    if (i) {
      const n = e.contents;
      if (t)
        e.comment = e.comment ? `${e.comment}
${i}` : i;
      else if (a || e.directives.docStart || !n)
        e.commentBefore = i;
      else if (C(n) && !n.flow && n.items.length > 0) {
        let r = n.items[0];
        D(r) && (r = r.key);
        const o = r.commentBefore;
        r.commentBefore = o ? `${i}
${o}` : i;
      } else {
        const r = n.commentBefore;
        n.commentBefore = r ? `${i}
${r}` : i;
      }
    }
    if (t) {
      for (let n = 0; n < this.errors.length; ++n)
        e.errors.push(this.errors[n]);
      for (let n = 0; n < this.warnings.length; ++n)
        e.warnings.push(this.warnings[n]);
    } else
      e.errors = this.errors, e.warnings = this.warnings;
    this.prelude = [], this.errors = [], this.warnings = [];
  }
  /**
   * Current stream status information.
   *
   * Mostly useful at the end of input for an empty stream.
   */
  streamInfo() {
    return {
      comment: hs(this.prelude).comment,
      directives: this.directives,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  /**
   * Compose tokens into documents.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *compose(e, t = !1, i = -1) {
    for (const a of e)
      yield* this.next(a);
    yield* this.end(t, i);
  }
  /** Advance the composer by one CST token. */
  *next(e) {
    switch (e.type) {
      case "directive":
        this.directives.add(e.source, (t, i, a) => {
          const n = ke(e);
          n[0] += t, this.onError(n, "BAD_DIRECTIVE", i, a);
        }), this.prelude.push(e.source), this.atDirectives = !0;
        break;
      case "document": {
        const t = Ca(this.options, this.directives, e, this.onError);
        this.atDirectives && !t.directives.docStart && this.onError(e, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"), this.decorate(t, !1), this.doc && (yield this.doc), this.doc = t, this.atDirectives = !1;
        break;
      }
      case "byte-order-mark":
      case "space":
        break;
      case "comment":
      case "newline":
        this.prelude.push(e.source);
        break;
      case "error": {
        const t = e.source ? `${e.message}: ${JSON.stringify(e.source)}` : e.message, i = new Se(ke(e), "UNEXPECTED_TOKEN", t);
        this.atDirectives || !this.doc ? this.errors.push(i) : this.doc.errors.push(i);
        break;
      }
      case "doc-end": {
        if (!this.doc) {
          const i = "Unexpected doc-end without preceding document";
          this.errors.push(new Se(ke(e), "UNEXPECTED_TOKEN", i));
          break;
        }
        this.doc.directives.docEnd = !0;
        const t = Ue(e.end, e.offset + e.source.length, this.doc.options.strict, this.onError);
        if (this.decorate(this.doc, !0), t.comment) {
          const i = this.doc.comment;
          this.doc.comment = i ? `${i}
${t.comment}` : t.comment;
        }
        this.doc.range[2] = t.offset;
        break;
      }
      default:
        this.errors.push(new Se(ke(e), "UNEXPECTED_TOKEN", `Unsupported token ${e.type}`));
    }
  }
  /**
   * Call at end of input to yield any remaining document.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *end(e = !1, t = -1) {
    if (this.doc)
      this.decorate(this.doc, !0), yield this.doc, this.doc = null;
    else if (e) {
      const i = Object.assign({ _directives: this.directives }, this.options), a = new Qs(void 0, i);
      this.atDirectives && this.onError(t, "MISSING_CHAR", "Missing directives-end indicator line"), a.range = [0, t, t], this.decorate(a, !1), yield a;
    }
  }
}
const ii = "\uFEFF", ai = "", ni = "", kt = "";
function Da(s) {
  switch (s) {
    case ii:
      return "byte-order-mark";
    case ai:
      return "doc-mode";
    case ni:
      return "flow-error-end";
    case kt:
      return "scalar";
    case "---":
      return "doc-start";
    case "...":
      return "doc-end";
    case "":
    case `
`:
    case `\r
`:
      return "newline";
    case "-":
      return "seq-item-ind";
    case "?":
      return "explicit-key-ind";
    case ":":
      return "map-value-ind";
    case "{":
      return "flow-map-start";
    case "}":
      return "flow-map-end";
    case "[":
      return "flow-seq-start";
    case "]":
      return "flow-seq-end";
    case ",":
      return "comma";
  }
  switch (s[0]) {
    case " ":
    case "	":
      return "space";
    case "#":
      return "comment";
    case "%":
      return "directive-line";
    case "*":
      return "alias";
    case "&":
      return "anchor";
    case "!":
      return "tag";
    case "'":
      return "single-quoted-scalar";
    case '"':
      return "double-quoted-scalar";
    case "|":
    case ">":
      return "block-scalar-header";
  }
  return null;
}
function z(s) {
  switch (s) {
    case void 0:
    case " ":
    case `
`:
    case "\r":
    case "	":
      return !0;
    default:
      return !1;
  }
}
const ps = new Set("0123456789ABCDEFabcdef"), Pa = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), qe = new Set(",[]{}"), Ma = new Set(` ,[]{}
\r	`), yt = (s) => !s || Ma.has(s);
class Ra {
  constructor() {
    this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0;
  }
  /**
   * Generate YAML tokens from the `source` string. If `incomplete`,
   * a part of the last line may be left as a buffer for the next call.
   *
   * @returns A generator of lexical tokens
   */
  *lex(e, t = !1) {
    if (e) {
      if (typeof e != "string")
        throw TypeError("source is not a string");
      this.buffer = this.buffer ? this.buffer + e : e, this.lineEndPos = null;
    }
    this.atEnd = !t;
    let i = this.next ?? "stream";
    for (; i && (t || this.hasChars(1)); )
      i = yield* this.parseNext(i);
  }
  atLineEnd() {
    let e = this.pos, t = this.buffer[e];
    for (; t === " " || t === "	"; )
      t = this.buffer[++e];
    return !t || t === "#" || t === `
` ? !0 : t === "\r" ? this.buffer[e + 1] === `
` : !1;
  }
  charAt(e) {
    return this.buffer[this.pos + e];
  }
  continueScalar(e) {
    let t = this.buffer[e];
    if (this.indentNext > 0) {
      let i = 0;
      for (; t === " "; )
        t = this.buffer[++i + e];
      if (t === "\r") {
        const a = this.buffer[i + e + 1];
        if (a === `
` || !a && !this.atEnd)
          return e + i + 1;
      }
      return t === `
` || i >= this.indentNext || !t && !this.atEnd ? e + i : -1;
    }
    if (t === "-" || t === ".") {
      const i = this.buffer.substr(e, 3);
      if ((i === "---" || i === "...") && z(this.buffer[e + 3]))
        return -1;
    }
    return e;
  }
  getLine() {
    let e = this.lineEndPos;
    return (typeof e != "number" || e !== -1 && e < this.pos) && (e = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = e), e === -1 ? this.atEnd ? this.buffer.substring(this.pos) : null : (this.buffer[e - 1] === "\r" && (e -= 1), this.buffer.substring(this.pos, e));
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
      case "stream":
        return yield* this.parseStream();
      case "line-start":
        return yield* this.parseLineStart();
      case "block-start":
        return yield* this.parseBlockStart();
      case "doc":
        return yield* this.parseDocument();
      case "flow":
        return yield* this.parseFlowCollection();
      case "quoted-scalar":
        return yield* this.parseQuotedScalar();
      case "block-scalar":
        return yield* this.parseBlockScalar();
      case "plain-scalar":
        return yield* this.parsePlainScalar();
    }
  }
  *parseStream() {
    let e = this.getLine();
    if (e === null)
      return this.setNext("stream");
    if (e[0] === ii && (yield* this.pushCount(1), e = e.substring(1)), e[0] === "%") {
      let t = e.length, i = e.indexOf("#");
      for (; i !== -1; ) {
        const n = e[i - 1];
        if (n === " " || n === "	") {
          t = i - 1;
          break;
        } else
          i = e.indexOf("#", i + 1);
      }
      for (; ; ) {
        const n = e[t - 1];
        if (n === " " || n === "	")
          t -= 1;
        else
          break;
      }
      const a = (yield* this.pushCount(t)) + (yield* this.pushSpaces(!0));
      return yield* this.pushCount(e.length - a), this.pushNewline(), "stream";
    }
    if (this.atLineEnd()) {
      const t = yield* this.pushSpaces(!0);
      return yield* this.pushCount(e.length - t), yield* this.pushNewline(), "stream";
    }
    return yield ai, yield* this.parseLineStart();
  }
  *parseLineStart() {
    const e = this.charAt(0);
    if (!e && !this.atEnd)
      return this.setNext("line-start");
    if (e === "-" || e === ".") {
      if (!this.atEnd && !this.hasChars(4))
        return this.setNext("line-start");
      const t = this.peek(3);
      if ((t === "---" || t === "...") && z(this.charAt(3)))
        return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, t === "---" ? "doc" : "stream";
    }
    return this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !z(this.charAt(1)) && (this.indentNext = this.indentValue), yield* this.parseBlockStart();
  }
  *parseBlockStart() {
    const [e, t] = this.peek(2);
    if (!t && !this.atEnd)
      return this.setNext("block-start");
    if ((e === "-" || e === "?" || e === ":") && z(t)) {
      const i = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
      return this.indentNext = this.indentValue + 1, this.indentValue += i, "block-start";
    }
    return "doc";
  }
  *parseDocument() {
    yield* this.pushSpaces(!0);
    const e = this.getLine();
    if (e === null)
      return this.setNext("doc");
    let t = yield* this.pushIndicators();
    switch (e[t]) {
      case "#":
        yield* this.pushCount(e.length - t);
      // fallthrough
      case void 0:
        return yield* this.pushNewline(), yield* this.parseLineStart();
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), "doc";
      case "*":
        return yield* this.pushUntil(yt), "doc";
      case '"':
      case "'":
        return yield* this.parseQuotedScalar();
      case "|":
      case ">":
        return t += yield* this.parseBlockScalarHeader(), t += yield* this.pushSpaces(!0), yield* this.pushCount(e.length - t), yield* this.pushNewline(), yield* this.parseBlockScalar();
      default:
        return yield* this.parsePlainScalar();
    }
  }
  *parseFlowCollection() {
    let e, t, i = -1;
    do
      e = yield* this.pushNewline(), e > 0 ? (t = yield* this.pushSpaces(!1), this.indentValue = i = t) : t = 0, t += yield* this.pushSpaces(!0);
    while (e + t > 0);
    const a = this.getLine();
    if (a === null)
      return this.setNext("flow");
    if ((i !== -1 && i < this.indentNext && a[0] !== "#" || i === 0 && (a.startsWith("---") || a.startsWith("...")) && z(a[3])) && !(i === this.indentNext - 1 && this.flowLevel === 1 && (a[0] === "]" || a[0] === "}")))
      return this.flowLevel = 0, yield ni, yield* this.parseLineStart();
    let n = 0;
    for (; a[n] === ","; )
      n += yield* this.pushCount(1), n += yield* this.pushSpaces(!0), this.flowKey = !1;
    switch (n += yield* this.pushIndicators(), a[n]) {
      case void 0:
        return "flow";
      case "#":
        return yield* this.pushCount(a.length - n), "flow";
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
      case "*":
        return yield* this.pushUntil(yt), "flow";
      case '"':
      case "'":
        return this.flowKey = !0, yield* this.parseQuotedScalar();
      case ":": {
        const r = this.charAt(1);
        if (this.flowKey || z(r) || r === ",")
          return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
      }
      // fallthrough
      default:
        return this.flowKey = !1, yield* this.parsePlainScalar();
    }
  }
  *parseQuotedScalar() {
    const e = this.charAt(0);
    let t = this.buffer.indexOf(e, this.pos + 1);
    if (e === "'")
      for (; t !== -1 && this.buffer[t + 1] === "'"; )
        t = this.buffer.indexOf("'", t + 2);
    else
      for (; t !== -1; ) {
        let n = 0;
        for (; this.buffer[t - 1 - n] === "\\"; )
          n += 1;
        if (n % 2 === 0)
          break;
        t = this.buffer.indexOf('"', t + 1);
      }
    const i = this.buffer.substring(0, t);
    let a = i.indexOf(`
`, this.pos);
    if (a !== -1) {
      for (; a !== -1; ) {
        const n = this.continueScalar(a + 1);
        if (n === -1)
          break;
        a = i.indexOf(`
`, n);
      }
      a !== -1 && (t = a - (i[a - 1] === "\r" ? 2 : 1));
    }
    if (t === -1) {
      if (!this.atEnd)
        return this.setNext("quoted-scalar");
      t = this.buffer.length;
    }
    return yield* this.pushToIndex(t + 1, !1), this.flowLevel ? "flow" : "doc";
  }
  *parseBlockScalarHeader() {
    this.blockScalarIndent = -1, this.blockScalarKeep = !1;
    let e = this.pos;
    for (; ; ) {
      const t = this.buffer[++e];
      if (t === "+")
        this.blockScalarKeep = !0;
      else if (t > "0" && t <= "9")
        this.blockScalarIndent = Number(t) - 1;
      else if (t !== "-")
        break;
    }
    return yield* this.pushUntil((t) => z(t) || t === "#");
  }
  *parseBlockScalar() {
    let e = this.pos - 1, t = 0, i;
    e: for (let n = this.pos; i = this.buffer[n]; ++n)
      switch (i) {
        case " ":
          t += 1;
          break;
        case `
`:
          e = n, t = 0;
          break;
        case "\r": {
          const r = this.buffer[n + 1];
          if (!r && !this.atEnd)
            return this.setNext("block-scalar");
          if (r === `
`)
            break;
        }
        // fallthrough
        default:
          break e;
      }
    if (!i && !this.atEnd)
      return this.setNext("block-scalar");
    if (t >= this.indentNext) {
      this.blockScalarIndent === -1 ? this.indentNext = t : this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
      do {
        const n = this.continueScalar(e + 1);
        if (n === -1)
          break;
        e = this.buffer.indexOf(`
`, n);
      } while (e !== -1);
      if (e === -1) {
        if (!this.atEnd)
          return this.setNext("block-scalar");
        e = this.buffer.length;
      }
    }
    let a = e + 1;
    for (i = this.buffer[a]; i === " "; )
      i = this.buffer[++a];
    if (i === "	") {
      for (; i === "	" || i === " " || i === "\r" || i === `
`; )
        i = this.buffer[++a];
      e = a - 1;
    } else if (!this.blockScalarKeep)
      do {
        let n = e - 1, r = this.buffer[n];
        r === "\r" && (r = this.buffer[--n]);
        const o = n;
        for (; r === " "; )
          r = this.buffer[--n];
        if (r === `
` && n >= this.pos && n + 1 + t > o)
          e = n;
        else
          break;
      } while (!0);
    return yield kt, yield* this.pushToIndex(e + 1, !0), yield* this.parseLineStart();
  }
  *parsePlainScalar() {
    const e = this.flowLevel > 0;
    let t = this.pos - 1, i = this.pos - 1, a;
    for (; a = this.buffer[++i]; )
      if (a === ":") {
        const n = this.buffer[i + 1];
        if (z(n) || e && qe.has(n))
          break;
        t = i;
      } else if (z(a)) {
        let n = this.buffer[i + 1];
        if (a === "\r" && (n === `
` ? (i += 1, a = `
`, n = this.buffer[i + 1]) : t = i), n === "#" || e && qe.has(n))
          break;
        if (a === `
`) {
          const r = this.continueScalar(i + 1);
          if (r === -1)
            break;
          i = Math.max(i, r - 2);
        }
      } else {
        if (e && qe.has(a))
          break;
        t = i;
      }
    return !a && !this.atEnd ? this.setNext("plain-scalar") : (yield kt, yield* this.pushToIndex(t + 1, !0), e ? "flow" : "doc");
  }
  *pushCount(e) {
    return e > 0 ? (yield this.buffer.substr(this.pos, e), this.pos += e, e) : 0;
  }
  *pushToIndex(e, t) {
    const i = this.buffer.slice(this.pos, e);
    return i ? (yield i, this.pos += i.length, i.length) : (t && (yield ""), 0);
  }
  *pushIndicators() {
    let e = 0;
    e: for (; ; ) {
      switch (this.charAt(0)) {
        case "!":
          e += yield* this.pushTag(), e += yield* this.pushSpaces(!0);
          continue e;
        case "&":
          e += yield* this.pushUntil(yt), e += yield* this.pushSpaces(!0);
          continue e;
        case "-":
        // this is an error
        case "?":
        // this is an error outside flow collections
        case ":": {
          const t = this.flowLevel > 0, i = this.charAt(1);
          if (z(i) || t && qe.has(i)) {
            t ? this.flowKey && (this.flowKey = !1) : this.indentNext = this.indentValue + 1, e += yield* this.pushCount(1), e += yield* this.pushSpaces(!0);
            continue e;
          }
        }
      }
      break e;
    }
    return e;
  }
  *pushTag() {
    if (this.charAt(1) === "<") {
      let e = this.pos + 2, t = this.buffer[e];
      for (; !z(t) && t !== ">"; )
        t = this.buffer[++e];
      return yield* this.pushToIndex(t === ">" ? e + 1 : e, !1);
    } else {
      let e = this.pos + 1, t = this.buffer[e];
      for (; t; )
        if (Pa.has(t))
          t = this.buffer[++e];
        else if (t === "%" && ps.has(this.buffer[e + 1]) && ps.has(this.buffer[e + 2]))
          t = this.buffer[e += 3];
        else
          break;
      return yield* this.pushToIndex(e, !1);
    }
  }
  *pushNewline() {
    const e = this.buffer[this.pos];
    return e === `
` ? yield* this.pushCount(1) : e === "\r" && this.charAt(1) === `
` ? yield* this.pushCount(2) : 0;
  }
  *pushSpaces(e) {
    let t = this.pos - 1, i;
    do
      i = this.buffer[++t];
    while (i === " " || e && i === "	");
    const a = t - this.pos;
    return a > 0 && (yield this.buffer.substr(this.pos, a), this.pos = t), a;
  }
  *pushUntil(e) {
    let t = this.pos, i = this.buffer[t];
    for (; !e(i); )
      i = this.buffer[++t];
    return yield* this.pushToIndex(t, !1);
  }
}
class Ba {
  constructor() {
    this.lineStarts = [], this.addNewLine = (e) => this.lineStarts.push(e), this.linePos = (e) => {
      let t = 0, i = this.lineStarts.length;
      for (; t < i; ) {
        const n = t + i >> 1;
        this.lineStarts[n] < e ? t = n + 1 : i = n;
      }
      if (this.lineStarts[t] === e)
        return { line: t + 1, col: 1 };
      if (t === 0)
        return { line: 0, col: e };
      const a = this.lineStarts[t - 1];
      return { line: t, col: e - a + 1 };
    };
  }
}
function W(s, e) {
  for (let t = 0; t < s.length; ++t)
    if (s[t].type === e)
      return !0;
  return !1;
}
function us(s) {
  for (let e = 0; e < s.length; ++e)
    switch (s[e].type) {
      case "space":
      case "comment":
      case "newline":
        break;
      default:
        return e;
    }
  return -1;
}
function ri(s) {
  switch (s?.type) {
    case "alias":
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "flow-collection":
      return !0;
    default:
      return !1;
  }
}
function He(s) {
  switch (s.type) {
    case "document":
      return s.start;
    case "block-map": {
      const e = s.items[s.items.length - 1];
      return e.sep ?? e.start;
    }
    case "block-seq":
      return s.items[s.items.length - 1].start;
    /* istanbul ignore next should not happen */
    default:
      return [];
  }
}
function re(s) {
  if (s.length === 0)
    return [];
  let e = s.length;
  e: for (; --e >= 0; )
    switch (s[e].type) {
      case "doc-start":
      case "explicit-key-ind":
      case "map-value-ind":
      case "seq-item-ind":
      case "newline":
        break e;
    }
  for (; s[++e]?.type === "space"; )
    ;
  return s.splice(e, s.length);
}
function Ze(s, e) {
  if (e.length < 1e5)
    Array.prototype.push.apply(s, e);
  else
    for (let t = 0; t < e.length; ++t)
      s.push(e[t]);
}
function fs(s) {
  if (s.start.type === "flow-seq-start")
    for (const e of s.items)
      e.sep && !e.value && !W(e.start, "explicit-key-ind") && !W(e.sep, "map-value-ind") && (e.key && (e.value = e.key), delete e.key, ri(e.value) ? e.value.end ? Ze(e.value.end, e.sep) : e.value.end = e.sep : Ze(e.start, e.sep), delete e.sep);
}
class Ua {
  /**
   * @param onNewLine - If defined, called separately with the start position of
   *   each new line (in `parse()`, including the start of input).
   */
  constructor(e) {
    this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new Ra(), this.onNewLine = e;
  }
  /**
   * Parse `source` as a YAML stream.
   * If `incomplete`, a part of the last line may be left as a buffer for the next call.
   *
   * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
   *
   * @returns A generator of tokens representing each directive, document, and other structure.
   */
  *parse(e, t = !1) {
    this.onNewLine && this.offset === 0 && this.onNewLine(0);
    for (const i of this.lexer.lex(e, t))
      yield* this.next(i);
    t || (yield* this.end());
  }
  /**
   * Advance the parser by the `source` of one lexical token.
   */
  *next(e) {
    if (this.source = e, this.atScalar) {
      this.atScalar = !1, yield* this.step(), this.offset += e.length;
      return;
    }
    const t = Da(e);
    if (t)
      if (t === "scalar")
        this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
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
          case "flow-error-end":
            return;
          default:
            this.atNewLine = !1;
        }
        this.offset += e.length;
      }
    else {
      const i = `Not a YAML token: ${e}`;
      yield* this.pop({ type: "error", offset: this.offset, message: i, source: e }), this.offset += e.length;
    }
  }
  /** Call at end of input to push out any remaining constructions */
  *end() {
    for (; this.stack.length > 0; )
      yield* this.pop();
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
    const e = this.peek(1);
    if (this.type === "doc-end" && e?.type !== "doc-end") {
      for (; this.stack.length > 0; )
        yield* this.pop();
      this.stack.push({
        type: "doc-end",
        offset: this.offset,
        source: this.source
      });
      return;
    }
    if (!e)
      return yield* this.stream();
    switch (e.type) {
      case "document":
        return yield* this.document(e);
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return yield* this.scalar(e);
      case "block-scalar":
        return yield* this.blockScalar(e);
      case "block-map":
        return yield* this.blockMap(e);
      case "block-seq":
        return yield* this.blockSequence(e);
      case "flow-collection":
        return yield* this.flowCollection(e);
      case "doc-end":
        return yield* this.documentEnd(e);
    }
    yield* this.pop();
  }
  peek(e) {
    return this.stack[this.stack.length - e];
  }
  *pop(e) {
    const t = e ?? this.stack.pop();
    if (!t)
      yield { type: "error", offset: this.offset, source: "", message: "Tried to pop an empty stack" };
    else if (this.stack.length === 0)
      yield t;
    else {
      const i = this.peek(1);
      switch (t.type === "block-scalar" ? t.indent = "indent" in i ? i.indent : 0 : t.type === "flow-collection" && i.type === "document" && (t.indent = 0), t.type === "flow-collection" && fs(t), i.type) {
        case "document":
          i.value = t;
          break;
        case "block-scalar":
          i.props.push(t);
          break;
        case "block-map": {
          const a = i.items[i.items.length - 1];
          if (a.value) {
            i.items.push({ start: [], key: t, sep: [] }), this.onKeyLine = !0;
            return;
          } else if (a.sep)
            a.value = t;
          else {
            Object.assign(a, { key: t, sep: [] }), this.onKeyLine = !a.explicitKey;
            return;
          }
          break;
        }
        case "block-seq": {
          const a = i.items[i.items.length - 1];
          a.value ? i.items.push({ start: [], value: t }) : a.value = t;
          break;
        }
        case "flow-collection": {
          const a = i.items[i.items.length - 1];
          !a || a.value ? i.items.push({ start: [], key: t, sep: [] }) : a.sep ? a.value = t : Object.assign(a, { key: t, sep: [] });
          return;
        }
        /* istanbul ignore next should not happen */
        default:
          yield* this.pop(), yield* this.pop(t);
      }
      if ((i.type === "document" || i.type === "block-map" || i.type === "block-seq") && (t.type === "block-map" || t.type === "block-seq")) {
        const a = t.items[t.items.length - 1];
        a && !a.sep && !a.value && a.start.length > 0 && us(a.start) === -1 && (t.indent === 0 || a.start.every((n) => n.type !== "comment" || n.indent < t.indent)) && (i.type === "document" ? i.end = a.start : i.items.push({ start: a.start }), t.items.splice(-1, 1));
      }
    }
  }
  *stream() {
    switch (this.type) {
      case "directive-line":
        yield { type: "directive", offset: this.offset, source: this.source };
        return;
      case "byte-order-mark":
      case "space":
      case "comment":
      case "newline":
        yield this.sourceToken;
        return;
      case "doc-mode":
      case "doc-start": {
        const e = {
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
    if (e.value)
      return yield* this.lineEnd(e);
    switch (this.type) {
      case "doc-start": {
        us(e.start) !== -1 ? (yield* this.pop(), yield* this.step()) : e.start.push(this.sourceToken);
        return;
      }
      case "anchor":
      case "tag":
      case "space":
      case "comment":
      case "newline":
        e.start.push(this.sourceToken);
        return;
    }
    const t = this.startBlockValue(e);
    t ? this.stack.push(t) : yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML document`,
      source: this.source
    };
  }
  *scalar(e) {
    if (this.type === "map-value-ind") {
      const t = He(this.peek(2)), i = re(t);
      let a;
      e.end ? (a = e.end, a.push(this.sourceToken), delete e.end) : a = [this.sourceToken];
      const n = {
        type: "block-map",
        offset: e.offset,
        indent: e.indent,
        items: [{ start: i, key: e, sep: a }]
      };
      this.onKeyLine = !0, this.stack[this.stack.length - 1] = n;
    } else
      yield* this.lineEnd(e);
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
          let t = this.source.indexOf(`
`) + 1;
          for (; t !== 0; )
            this.onNewLine(this.offset + t), t = this.source.indexOf(`
`, t) + 1;
        }
        yield* this.pop();
        break;
      /* istanbul ignore next should not happen */
      default:
        yield* this.pop(), yield* this.step();
    }
  }
  *blockMap(e) {
    const t = e.items[e.items.length - 1];
    switch (this.type) {
      case "newline":
        if (this.onKeyLine = !1, t.value) {
          const i = "end" in t.value ? t.value.end : void 0;
          (Array.isArray(i) ? i[i.length - 1] : void 0)?.type === "comment" ? i?.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
        } else t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (t.value)
          e.items.push({ start: [this.sourceToken] });
        else if (t.sep)
          t.sep.push(this.sourceToken);
        else {
          if (this.atIndentedComment(t.start, e.indent)) {
            const a = e.items[e.items.length - 2]?.value?.end;
            if (Array.isArray(a)) {
              Ze(a, t.start), a.push(this.sourceToken), e.items.pop();
              return;
            }
          }
          t.start.push(this.sourceToken);
        }
        return;
    }
    if (this.indent >= e.indent) {
      const i = !this.onKeyLine && this.indent === e.indent, a = i && (t.sep || t.explicitKey) && this.type !== "seq-item-ind";
      let n = [];
      if (a && t.sep && !t.value) {
        const r = [];
        for (let o = 0; o < t.sep.length; ++o) {
          const l = t.sep[o];
          switch (l.type) {
            case "newline":
              r.push(o);
              break;
            case "space":
              break;
            case "comment":
              l.indent > e.indent && (r.length = 0);
              break;
            default:
              r.length = 0;
          }
        }
        r.length >= 2 && (n = t.sep.splice(r[1]));
      }
      switch (this.type) {
        case "anchor":
        case "tag":
          a || t.value ? (n.push(this.sourceToken), e.items.push({ start: n }), this.onKeyLine = !0) : t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
          return;
        case "explicit-key-ind":
          !t.sep && !t.explicitKey ? (t.start.push(this.sourceToken), t.explicitKey = !0) : a || t.value ? (n.push(this.sourceToken), e.items.push({ start: n, explicitKey: !0 })) : this.stack.push({
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken], explicitKey: !0 }]
          }), this.onKeyLine = !0;
          return;
        case "map-value-ind":
          if (t.explicitKey)
            if (t.sep)
              if (t.value)
                e.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (W(t.sep, "map-value-ind"))
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: n, key: null, sep: [this.sourceToken] }]
                });
              else if (ri(t.key) && !W(t.sep, "newline")) {
                const r = re(t.start), o = t.key, l = t.sep;
                l.push(this.sourceToken), delete t.key, delete t.sep, this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: r, key: o, sep: l }]
                });
              } else n.length > 0 ? t.sep = t.sep.concat(n, this.sourceToken) : t.sep.push(this.sourceToken);
            else if (W(t.start, "newline"))
              Object.assign(t, { key: null, sep: [this.sourceToken] });
            else {
              const r = re(t.start);
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: r, key: null, sep: [this.sourceToken] }]
              });
            }
          else
            t.sep ? t.value || a ? e.items.push({ start: n, key: null, sep: [this.sourceToken] }) : W(t.sep, "map-value-ind") ? this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [], key: null, sep: [this.sourceToken] }]
            }) : t.sep.push(this.sourceToken) : Object.assign(t, { key: null, sep: [this.sourceToken] });
          this.onKeyLine = !0;
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const r = this.flowScalar(this.type);
          a || t.value ? (e.items.push({ start: n, key: r, sep: [] }), this.onKeyLine = !0) : t.sep ? this.stack.push(r) : (Object.assign(t, { key: r, sep: [] }), this.onKeyLine = !0);
          return;
        }
        default: {
          const r = this.startBlockValue(e);
          if (r) {
            if (r.type === "block-seq") {
              if (!t.explicitKey && t.sep && !W(t.sep, "newline")) {
                yield* this.pop({
                  type: "error",
                  offset: this.offset,
                  message: "Unexpected block-seq-ind on same line with key",
                  source: this.source
                });
                return;
              }
            } else i && e.items.push({ start: n });
            this.stack.push(r);
            return;
          }
        }
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *blockSequence(e) {
    const t = e.items[e.items.length - 1];
    switch (this.type) {
      case "newline":
        if (t.value) {
          const i = "end" in t.value ? t.value.end : void 0;
          (Array.isArray(i) ? i[i.length - 1] : void 0)?.type === "comment" ? i?.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
        } else
          t.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (t.value)
          e.items.push({ start: [this.sourceToken] });
        else {
          if (this.atIndentedComment(t.start, e.indent)) {
            const a = e.items[e.items.length - 2]?.value?.end;
            if (Array.isArray(a)) {
              Ze(a, t.start), a.push(this.sourceToken), e.items.pop();
              return;
            }
          }
          t.start.push(this.sourceToken);
        }
        return;
      case "anchor":
      case "tag":
        if (t.value || this.indent <= e.indent)
          break;
        t.start.push(this.sourceToken);
        return;
      case "seq-item-ind":
        if (this.indent !== e.indent)
          break;
        t.value || W(t.start, "seq-item-ind") ? e.items.push({ start: [this.sourceToken] }) : t.start.push(this.sourceToken);
        return;
    }
    if (this.indent > e.indent) {
      const i = this.startBlockValue(e);
      if (i) {
        this.stack.push(i);
        return;
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *flowCollection(e) {
    const t = e.items[e.items.length - 1];
    if (this.type === "flow-error-end") {
      let i;
      do
        yield* this.pop(), i = this.peek(1);
      while (i?.type === "flow-collection");
    } else if (e.end.length === 0) {
      switch (this.type) {
        case "comma":
        case "explicit-key-ind":
          !t || t.sep ? e.items.push({ start: [this.sourceToken] }) : t.start.push(this.sourceToken);
          return;
        case "map-value-ind":
          !t || t.value ? e.items.push({ start: [], key: null, sep: [this.sourceToken] }) : t.sep ? t.sep.push(this.sourceToken) : Object.assign(t, { key: null, sep: [this.sourceToken] });
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
          const a = this.flowScalar(this.type);
          !t || t.value ? e.items.push({ start: [], key: a, sep: [] }) : t.sep ? this.stack.push(a) : Object.assign(t, { key: a, sep: [] });
          return;
        }
        case "flow-map-end":
        case "flow-seq-end":
          e.end.push(this.sourceToken);
          return;
      }
      const i = this.startBlockValue(e);
      i ? this.stack.push(i) : (yield* this.pop(), yield* this.step());
    } else {
      const i = this.peek(2);
      if (i.type === "block-map" && (this.type === "map-value-ind" && i.indent === e.indent || this.type === "newline" && !i.items[i.items.length - 1].sep))
        yield* this.pop(), yield* this.step();
      else if (this.type === "map-value-ind" && i.type !== "flow-collection") {
        const a = He(i), n = re(a);
        fs(e);
        const r = e.end.splice(1, e.end.length);
        r.push(this.sourceToken);
        const o = {
          type: "block-map",
          offset: e.offset,
          indent: e.indent,
          items: [{ start: n, key: e, sep: r }]
        };
        this.onKeyLine = !0, this.stack[this.stack.length - 1] = o;
      } else
        yield* this.lineEnd(e);
    }
  }
  flowScalar(e) {
    if (this.onNewLine) {
      let t = this.source.indexOf(`
`) + 1;
      for (; t !== 0; )
        this.onNewLine(this.offset + t), t = this.source.indexOf(`
`, t) + 1;
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
      case "double-quoted-scalar":
        return this.flowScalar(this.type);
      case "block-scalar-header":
        return {
          type: "block-scalar",
          offset: this.offset,
          indent: this.indent,
          props: [this.sourceToken],
          source: ""
        };
      case "flow-map-start":
      case "flow-seq-start":
        return {
          type: "flow-collection",
          offset: this.offset,
          indent: this.indent,
          start: this.sourceToken,
          items: [],
          end: []
        };
      case "seq-item-ind":
        return {
          type: "block-seq",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: [this.sourceToken] }]
        };
      case "explicit-key-ind": {
        this.onKeyLine = !0;
        const t = He(e), i = re(t);
        return i.push(this.sourceToken), {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: i, explicitKey: !0 }]
        };
      }
      case "map-value-ind": {
        this.onKeyLine = !0;
        const t = He(e), i = re(t);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: i, key: null, sep: [this.sourceToken] }]
        };
      }
    }
    return null;
  }
  atIndentedComment(e, t) {
    return this.type !== "comment" || this.indent <= t ? !1 : e.every((i) => i.type === "newline" || i.type === "space");
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
      case "newline":
        this.onKeyLine = !1;
      default:
        e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop());
    }
  }
}
function ja(s) {
  const e = s.prettyErrors !== !1;
  return { lineCounter: s.lineCounter || e && new Ba() || null, prettyErrors: e };
}
function Ka(s, e = {}) {
  const { lineCounter: t, prettyErrors: i } = ja(e), a = new Ua(t?.addNewLine), n = new La(e);
  let r = null;
  for (const o of n.compose(a.parse(s), !0, s.length))
    if (!r)
      r = o;
    else if (r.options.logLevel !== "silent") {
      r.errors.push(new Se(o.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
      break;
    }
  return i && t && (r.errors.forEach(cs(s, t)), r.warnings.forEach(cs(s, t))), r;
}
function gs(s, e, t) {
  let i;
  const a = Ka(s, t);
  if (!a)
    return null;
  if (a.warnings.forEach((n) => Os(a.options.logLevel, n)), a.errors.length > 0) {
    if (a.options.logLevel !== "silent")
      throw a.errors[0];
    a.errors = [];
  }
  return a.toJS(Object.assign({ reviver: i }, t));
}
var za = Object.defineProperty, qa = Object.getOwnPropertyDescriptor, b = (s, e, t, i) => {
  for (var a = i > 1 ? void 0 : i ? qa(e, t) : e, n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (a = (i ? r(e, t, a) : r(a)) || a);
  return i && a && za(e, t, a), a;
};
const Ha = [
  "Already handled",
  "Wrong entity or evidence",
  "Not useful for this home",
  "Too intrusive",
  "Maybe later"
], Fa = [
  "weekday.monday",
  "weekday.tuesday",
  "weekday.wednesday",
  "weekday.thursday",
  "weekday.friday",
  "weekday.saturday",
  "weekday.sunday"
], Ya = {
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
function Va(s, e) {
  const t = `component.haos_ai.common.${e.replaceAll(".", "_")}`, i = s?.localize?.(t);
  return i && i !== t ? i : Ya[e] ?? e;
}
function Wa(s, e) {
  const t = s.replace(/\s+$/, "").split(`
`), i = e.replace(/\s+$/, "").split(`
`), a = Array.from(
    { length: t.length + 1 },
    () => new Array(i.length + 1).fill(0)
  );
  for (let l = t.length - 1; l >= 0; l--)
    for (let c = i.length - 1; c >= 0; c--)
      a[l][c] = t[l] === i[c] ? a[l + 1][c + 1] + 1 : Math.max(a[l + 1][c], a[l][c + 1]);
  const n = [];
  let r = 0, o = 0;
  for (; r < t.length && o < i.length; )
    t[r] === i[o] ? (n.push({ type: "same", text: t[r] }), r++, o++) : a[r + 1][o] >= a[r][o + 1] ? (n.push({ type: "removed", text: t[r] }), r++) : (n.push({ type: "added", text: i[o] }), o++);
  for (; r < t.length; r++) n.push({ type: "removed", text: t[r] });
  for (; o < i.length; o++) n.push({ type: "added", text: i[o] });
  return n;
}
let y = class extends Ee {
  constructor() {
    super(...arguments), this.tab = "inbox", this.filter = "new", this.loading = !0, this.busy = !1, this.dialogPending = !1, this.entityHighlight = -1, this.error = "", this.chat = [], this.chatText = "", this.threadId = "main", this.threads = [], this.selectedGoals = [], this.ignoredEntities = [], this.ignoredEntityQuery = "", this.ignoredEntityError = "", this.ignoredDomains = [], this.ignoredAreas = [], this.ignoredLabels = [], this.ignoredDomainQuery = "", this.ignoredAreaQuery = "", this.ignoredLabelQuery = "", this.monthlyTokenBudget = 0, this.advisorMode = "balanced", this.scanDepth = "standard", this.automationComplexity = "normal", this.fixExistingFirst = !0, this.avoidNewHardware = !0, this.changePermissions = {
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
  willUpdate(s) {
    if (s.has("hass") && this.start(), s.has("selectedId")) {
      const e = this.selected?.automation?.yaml ?? "";
      this.draftYaml = e, this.draftValidation = this.selected?.automation?.validation, this.draftError = "", this.draftDirty = !1;
    }
  }
  start() {
    !this.hass || this.started || (this.started = !0, this.subscribeToProgress(), this.loadOverview());
  }
  async subscribeToProgress() {
    this.hass?.connection.subscribeEvents && (this.unsubscribeProgress = await this.hass.connection.subscribeEvents(
      (s) => {
        this.progress = s.data, this.busy = s.data.stage !== "complete", s.data.stage === "complete" && (this.progressTimer && window.clearTimeout(this.progressTimer), this.progressTimer = window.setTimeout(() => {
          this.progress = void 0, this.busy = !1;
        }, 1400));
      },
      "haos_ai_progress"
    ));
  }
  async call(s, e = {}) {
    if (!this.hass) throw new Error("Home Assistant is not ready");
    return this.hass.connection.sendMessagePromise({ type: s, ...e });
  }
  /** Resolve one panel string for the active Home Assistant language. */
  t(s) {
    return Va(this.hass, s);
  }
  describeError(s) {
    return s instanceof Error ? s.message : typeof s == "object" && s && "message" in s ? String(s.message) : "Something went wrong. Check Home Assistant logs for details.";
  }
  async loadOverview() {
    if (!this.hass) return;
    const s = this.overview !== void 0, e = ++this.overviewRequest;
    s || (this.loading = !0);
    try {
      const t = await this.call("haos_ai/overview");
      if (e !== this.overviewRequest) return;
      this.overview = t, s || this.hydrateSettings(t), this.syncDraft(t), this.threads = Array.isArray(t.threads) ? t.threads : [], this.selectedId && !t.suggestions.some((a) => a.id === this.selectedId) && (this.selectedId = void 0, this.filter !== "all" && !t.suggestions.some((a) => a.status === this.filter) && (this.filter = "all")), this.error = "";
    } catch (t) {
      this.error = this.describeError(t);
    } finally {
      s || (this.loading = !1);
    }
  }
  /** Resync the selected draft unless the user has edited it locally. */
  syncDraft(s) {
    if (!this.selectedId || this.draftDirty) return;
    const e = s.suggestions.find(
      (t) => t.id === this.selectedId
    );
    e?.automation && (this.draftYaml = e.automation.yaml ?? "", this.draftValidation = e.automation.validation, this.draftError = "");
  }
  hydrateSettings(s) {
    const e = s.preferences;
    this.selectedGoals = [...e.goals ?? []], this.ignoredEntities = [...e.ignored_entities ?? []], this.ignoredDomains = [...e.ignored_domains ?? []], this.ignoredAreas = [...e.ignored_areas ?? []], this.ignoredLabels = [...e.ignored_labels ?? []], this.monthlyTokenBudget = e.monthly_token_budget ?? 0, this.advisorMode = e.advisor_mode ?? "balanced", this.scanDepth = e.scan_depth ?? "standard", this.automationComplexity = e.automation_complexity ?? "normal", this.fixExistingFirst = e.fix_existing_first !== !1, this.avoidNewHardware = e.avoid_new_hardware !== !1, this.changePermissions = {
      create_automations: e.change_permissions?.create_automations === !0,
      update_automations: e.change_permissions?.update_automations === !0,
      remove_entities: e.change_permissions?.remove_entities === !0,
      remove_devices: e.change_permissions?.remove_devices === !0
    }, this.quietStart = e.quiet_hours?.start ?? "22:00", this.quietEnd = e.quiet_hours?.end ?? "07:00", this.providerDraft = this.resolveProvider(s), this.modelDraft = s.model, this.baseUrlDraft = s.base_url, this.apiKeyDraft = "";
    const t = s.scan_profile;
    this.scanProfileEnabled = t?.enabled === !0;
    const i = s.provider_options[0]?.id ?? this.providerDraft;
    this.scanProviderDraft = t?.provider ?? i, this.scanModelDraft = t?.model ?? "", this.scanBaseUrlDraft = t?.base_url ?? "", this.scanApiKeyDraft = "", this.historyDays = s.options.history_days ?? 30, this.includeExactLocation = s.options.include_exact_location === !0, this.schedule = s.options.schedule ?? "manual", this.scheduleTime = (s.options.schedule_time ?? "03:00:00").slice(
      0,
      5
    ), this.scheduleWeekday = s.options.schedule_weekday ?? 0, this.notifyNewSuggestions = s.options.notify_new_suggestions !== !1;
  }
  resolveProvider(s) {
    const e = s.base_url.toLocaleLowerCase(), t = s.model.toLocaleLowerCase(), i = s.provider_options.find((n) => n.id !== "openai_compatible" && n.default_base_url && e.startsWith(n.default_base_url.toLocaleLowerCase()) ? !0 : n.id === "deepseek" && t.startsWith("deepseek"));
    return i ? i.id : s.provider_options.find(
      (n) => n.id === s.provider
    )?.id ?? s.provider_options[0]?.id ?? "openai";
  }
  get filteredSuggestions() {
    const s = this.overview?.suggestions ?? [];
    return this.filter === "all" ? s : s.filter((e) => e.status === this.filter);
  }
  get selected() {
    return this.overview?.suggestions.find(
      (s) => s.id === this.selectedId
    );
  }
  async openPreview() {
    this.busy = !0, this.error = "";
    try {
      this.preview = await this.call("haos_ai/context_preview");
    } catch (s) {
      this.error = this.describeError(s);
    } finally {
      this.busy = !1;
    }
  }
  async runScan() {
    this.preview = void 0, this.busy = !0, this.progress = { stage: "context", progress: 0.05 }, this.error = "";
    try {
      await this.call("haos_ai/scan", { confirm_context: !0 }), await this.loadOverview(), this.filter = "new", this.tab === "activity" && await this.loadActivity();
    } catch (s) {
      this.error = this.describeError(s), this.progress = void 0;
    } finally {
      this.busy = !1;
    }
  }
  async updateSuggestion(s, e, t) {
    this.busy = !0;
    try {
      await this.call("haos_ai/suggestion/update", {
        suggestion_id: s,
        status: e,
        ...t ? { reason: t } : {}
      }), await this.loadOverview(), e === "dismissed" && (this.selectedId = void 0);
    } catch (i) {
      this.error = this.describeError(i);
    } finally {
      this.busy = !1;
    }
  }
  openFeedback(s) {
    this.selectedId = s.id, this.feedbackReason = "", this.feedbackNote = "", this.dialog = "feedback";
  }
  async submitFeedback() {
    const s = this.selected;
    if (!s || !this.feedbackReason) return;
    const e = [this.feedbackReason, this.feedbackNote.trim()].filter(Boolean).join(": ");
    this.dialog = null, await this.updateSuggestion(s.id, "dismissed", e);
  }
  async loadThreads() {
    try {
      const s = await this.call("haos_ai/chat/threads");
      this.threads = Array.isArray(s) ? s : [];
    } catch (s) {
      this.error = this.describeError(s);
    }
  }
  async loadThread() {
    try {
      const s = await this.call("haos_ai/chat/thread", {
        thread_id: this.threadId
      });
      this.chat = Array.isArray(s) ? s : [];
    } catch (s) {
      this.error = this.describeError(s);
    }
  }
  async selectThread(s) {
    this.threadId = s, this.chat = [], await this.loadThread();
  }
  newThread() {
    this.threadId = crypto.randomUUID().replaceAll("-", "").slice(0, 40), this.chat = [], this.chatText = "";
  }
  openRenameThread() {
    const s = this.threads.find((e) => e.id === this.threadId);
    this.renameText = s?.title ?? "Conversation", this.dialog = "rename";
  }
  async renameThread() {
    const s = this.renameText.trim();
    if (s) {
      this.dialog = null;
      try {
        await this.call("haos_ai/chat/thread/rename", {
          thread_id: this.threadId,
          title: s
        }), await this.loadThreads();
      } catch (e) {
        this.error = this.describeError(e);
      }
    }
  }
  async deleteThread() {
    this.dialogPending = !0;
    try {
      await this.call("haos_ai/chat/thread/delete", {
        thread_id: this.threadId
      }), this.newThread(), await this.loadThreads();
    } catch (s) {
      this.error = this.describeError(s);
    } finally {
      this.dialogPending = !1, this.dialog = null;
    }
  }
  async sendChat() {
    const s = this.chatText.trim();
    if (!(!s || this.busy)) {
      this.chatText = "", this.chat = [
        ...this.chat,
        {
          id: `pending-${Date.now()}`,
          role: "user",
          content: s,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      ], this.busy = !0, this.progress = { stage: "provider" }, this.error = "";
      try {
        const e = await this.call("haos_ai/chat", {
          thread_id: this.threadId,
          text: s
        });
        this.chat = [...this.chat, e.message], await this.loadThreads();
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
    } catch (s) {
      this.error = this.describeError(s);
    }
  }
  async openReceipt(s) {
    this.selectedReceiptId = s, this.receipt = void 0;
    try {
      this.receipt = await this.call("haos_ai/privacy_receipt", {
        receipt_id: s
      });
    } catch (e) {
      this.error = this.describeError(e);
    }
  }
  async savePreferences() {
    if (this.overview) {
      this.busy = !0, this.settingsNotice = "";
      try {
        await this.call("haos_ai/preferences/update", {
          preferences: {
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
            quiet_hours: { start: this.quietStart, end: this.quietEnd }
          }
        }), await this.loadOverview(), this.settingsNotice = "Advisor preferences saved.";
      } catch (s) {
        this.error = this.describeError(s);
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
        }), this.apiKeyDraft = "", this.scanApiKeyDraft = "", this.settingsNotice = "Connection verified and saved. HAOS AI is reloading…", window.setTimeout(() => {
          this.loadOverview();
        }, 1600);
      } catch (s) {
        this.error = this.describeError(s);
      } finally {
        this.busy = !1;
      }
    }
  }
  async saveOptions() {
    this.busy = !0, this.settingsNotice = "";
    try {
      await this.call("haos_ai/options/update", {
        options: this.connectionOptions()
      }), this.settingsNotice = "Privacy and schedule settings saved.", window.setTimeout(() => {
        this.loadOverview();
      }, 1200);
    } catch (s) {
      this.error = this.describeError(s);
    } finally {
      this.busy = !1;
    }
  }
  toggleGoal(s) {
    this.selectedGoals = this.selectedGoals.includes(s) ? this.selectedGoals.filter((e) => e !== s) : [...this.selectedGoals, s], this.settingsNotice = "";
  }
  providerChanged(s) {
    const e = this.overview?.provider_options.find(
      (n) => n.id === this.providerDraft
    ), t = this.overview?.provider_options.find(
      (n) => n.id === s
    ), i = !this.modelDraft || this.modelDraft === e?.default_model, a = !this.baseUrlDraft || this.baseUrlDraft === e?.default_base_url;
    this.providerDraft = s, t && i && (this.modelDraft = t.default_model), t && a && (this.baseUrlDraft = t.default_base_url), this.apiKeyDraft = "", this.settingsNotice = "";
  }
  openClearInbox() {
    this.filteredSuggestions.length !== 0 && (this.dialog = "clear-inbox");
  }
  async clearInbox() {
    const s = this.filter === "all" ? void 0 : this.filter;
    this.dialog = null, this.busy = !0;
    try {
      await this.call("haos_ai/suggestions/clear", {
        ...s ? { status: s } : {}
      }), this.selectedId = void 0, await this.loadOverview();
    } catch (e) {
      this.error = this.describeError(e);
    } finally {
      this.busy = !1;
    }
  }
  changeFor(s) {
    if (s.automation)
      return {
        kind: s.automation.target_id ? "update_automation" : "create_automation",
        suggestionId: s.id,
        targetId: s.automation.target_id ?? "new automation",
        label: s.title
      };
    if (s.operation)
      return {
        kind: s.operation.type,
        suggestionId: s.id,
        targetId: s.operation.target_id,
        label: s.operation.label,
        configEntryId: s.operation.config_entry_id ?? void 0
      };
  }
  canApply(s) {
    return {
      create_automation: this.changePermissions.create_automations,
      update_automation: this.changePermissions.update_automations,
      remove_entity: this.changePermissions.remove_entities,
      remove_device: this.changePermissions.remove_devices
    }[s.kind];
  }
  openChangeApproval(s) {
    const e = this.changeFor(s);
    !e || !this.canApply(e) || (this.pendingChange = e, this.diffLines = void 0, this.diffError = "", this.dialog = "approve-change", e.kind === "update_automation" && this.loadDiff(e.targetId));
  }
  /** Fetch the stored automation so the approval dialog can show a real diff. */
  async loadDiff(s) {
    this.diffLoading = !0, this.diffError = "";
    try {
      const e = await this.call(
        "haos_ai/automation/current",
        { automation_id: s }
      );
      if (!e.found) {
        this.diffError = this.t("diff.unavailable");
        return;
      }
      this.diffLines = Wa(e.yaml, this.draftYaml);
    } catch (e) {
      this.diffError = this.describeError(e);
    } finally {
      this.diffLoading = !1;
    }
  }
  async approveChange() {
    const s = this.pendingChange;
    if (!s || !this.canApply(s) || !this.hass) return;
    const e = s.kind === "create_automation" || s.kind === "update_automation";
    this.dialogPending = !0, this.busy = !0, this.error = "";
    try {
      let t;
      if (e) {
        if (!this.draftValidation?.valid)
          throw new Error("Validate the current automation draft before approval.");
        if (t = gs(this.draftYaml), !t || typeof t != "object" || Array.isArray(t))
          throw new Error("Automation YAML must contain one object.");
      } else if (s.kind === "remove_device" && !s.configEntryId)
        throw new Error("The device's integration reference is missing.");
      await this.call("haos_ai/change/apply", {
        suggestion_id: s.suggestionId,
        confirm: !0,
        operation: s.kind,
        ...e ? { config: t } : {}
      }), this.pendingChange = void 0, this.diffLines = void 0, this.draftDirty = !1, this.dialog = null, this.settingsNotice = "Approved change applied by Home Assistant.", await this.loadOverview(), this.tab === "activity" && await this.loadActivity();
    } catch (t) {
      this.error = this.describeError(t), this.dialog = null;
    } finally {
      this.busy = !1, this.dialogPending = !1;
    }
  }
  get matchingEntities() {
    const s = this.ignoredEntityQuery.trim().toLocaleLowerCase();
    return s ? Object.values(this.hass?.states ?? {}).filter((e) => !this.ignoredEntities.includes(e.entity_id)).filter((e) => {
      const t = e.attributes.friendly_name ?? "";
      return `${e.entity_id} ${t}`.toLocaleLowerCase().includes(s);
    }).slice(0, 8) : [];
  }
  addIgnoredEntities(s) {
    const e = [], t = [];
    for (const i of s) {
      const a = i.trim().replace(/^['"]|['"]$/g, "");
      a && (/^[a-z0-9_]+\.[a-z0-9_]+$/.test(a) ? e.push(a) : t.push(a));
    }
    this.ignoredEntities = [
      ...this.ignoredEntities,
      ...e.filter((i) => !this.ignoredEntities.includes(i))
    ], this.ignoredEntityError = t.length ? `Could not add: ${t.slice(0, 3).join(", ")}` : "", this.ignoredEntityQuery = "", this.settingsNotice = "";
  }
  /** Domains present in this installation, minus the ones already ignored. */
  get availableDomains() {
    const s = /* @__PURE__ */ new Set();
    for (const e of Object.keys(this.hass?.states ?? {})) {
      const t = e.split(".", 1)[0];
      t && !this.ignoredDomains.includes(t) && s.add(t);
    }
    return [...s].sort();
  }
  get availableAreas() {
    return Object.values(this.hass?.areas ?? {}).filter((s) => !this.ignoredAreas.includes(s.area_id)).sort((s, e) => s.name.localeCompare(e.name));
  }
  get availableLabels() {
    const s = /* @__PURE__ */ new Set();
    for (const e of Object.values(this.hass?.entities ?? {}))
      for (const t of e.labels ?? [])
        this.ignoredLabels.includes(t) || s.add(t);
    return [...s].sort();
  }
  areaName(s) {
    return this.hass?.areas?.[s]?.name ?? s;
  }
  addIgnoredScope(s, e) {
    const t = e.trim();
    t && (s === "domains" ? (this.ignoredDomains.includes(t) || (this.ignoredDomains = [...this.ignoredDomains, t]), this.ignoredDomainQuery = "") : s === "areas" ? (this.ignoredAreas.includes(t) || (this.ignoredAreas = [...this.ignoredAreas, t]), this.ignoredAreaQuery = "") : (this.ignoredLabels.includes(t) || (this.ignoredLabels = [...this.ignoredLabels, t]), this.ignoredLabelQuery = ""), this.settingsNotice = "");
  }
  removeIgnoredScope(s, e) {
    s === "domains" ? this.ignoredDomains = this.ignoredDomains.filter((t) => t !== e) : s === "areas" ? this.ignoredAreas = this.ignoredAreas.filter((t) => t !== e) : this.ignoredLabels = this.ignoredLabels.filter((t) => t !== e), this.settingsNotice = "";
  }
  handleEntityKeydown(s) {
    const e = this.matchingEntities;
    if (s.key === "ArrowDown" || s.key === "ArrowUp") {
      if (!e.length) return;
      s.preventDefault();
      const i = s.key === "ArrowDown" ? 1 : -1, a = this.entityHighlight + i;
      this.entityHighlight = (a + e.length) % e.length;
      return;
    }
    if (s.key === "Escape") {
      this.entityHighlight = -1;
      return;
    }
    if (s.key !== "Enter" && s.key !== ",") return;
    s.preventDefault();
    const t = this.entityHighlight >= 0 ? e[this.entityHighlight] : e[0];
    this.addIgnoredEntities([
      t?.entity_id ?? this.ignoredEntityQuery.trim()
    ]);
  }
  handleEntityPaste(s) {
    const t = (s.clipboardData?.getData("text") ?? "").split(/[\s,;]+/).filter(Boolean);
    t.some((i) => i.includes(".")) && (s.preventDefault(), this.addIgnoredEntities(t));
  }
  async validateDraft() {
    this.draftError = "";
    let s;
    try {
      s = gs(this.draftYaml);
    } catch (e) {
      this.draftError = `YAML syntax: ${this.describeError(e)}`;
      return;
    }
    if (!s || typeof s != "object" || Array.isArray(s)) {
      this.draftError = "Automation YAML must contain one object.";
      return;
    }
    this.busy = !0;
    try {
      const e = await this.call("haos_ai/automation/validate", { config: s });
      this.draftYaml = e.yaml, this.draftValidation = e.validation, this.draftDirty = !0;
    } catch (e) {
      this.draftError = this.describeError(e);
    } finally {
      this.busy = !1;
    }
  }
  async copyYaml(s = this.draftYaml) {
    await navigator.clipboard.writeText(s), this.copied = !0, window.setTimeout(() => this.copied = !1, 1600);
  }
  downloadYaml(s) {
    if (!this.draftYaml) return;
    const e = new Blob([this.draftYaml], { type: "application/x-yaml" }), t = URL.createObjectURL(e), i = document.createElement("a");
    i.href = t, i.download = `${s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "automation"}.yaml`, i.click(), URL.revokeObjectURL(t);
  }
  async copyAndOpenEditor() {
    await this.copyYaml(), this.navigate("/config/automation/new");
  }
  reviseInChat(s) {
    this.newThread(), this.chatText = `Help me revise this proposed automation. Keep it read only, explain the changes, and return one complete Home Assistant YAML block.

Title: ${s.title}

Current YAML:
\`\`\`yaml
${this.draftYaml}
\`\`\``, this.changeTab("chat");
  }
  extractYaml(s) {
    return s.match(/```(?:yaml|yml)?\s*\n([\s\S]*?)```/i)?.[1].trim();
  }
  useChatYaml(s) {
    const e = this.extractYaml(s);
    !e || !this.selected || (this.draftYaml = e, this.draftValidation = void 0, this.draftError = "", this.draftDirty = !0, this.tab = "inbox");
  }
  navigate(s) {
    window.history.pushState(null, "", s), window.dispatchEvent(new Event("location-changed"));
  }
  evidencePath(s) {
    const e = s.source_id;
    if (s.source_type === "history" && e.includes("."))
      return `/history?entity_id=${encodeURIComponent(e)}`;
    if (["entity", "registry", "automation"].includes(s.source_type) && e.includes("."))
      return `/config/entities/entity/${encodeURIComponent(e)}`;
    if (s.source_type === "integration" && e)
      return `/config/integrations/integration/${encodeURIComponent(e)}`;
  }
  firstUpdated() {
    this.tab === "chat" && this.loadThread();
  }
  changeTab(s) {
    this.tab = s, s === "chat" && (this.loadThreads(), this.chat.length === 0 && this.loadThread()), s === "activity" && this.loadActivity();
  }
  render() {
    return m`
      <div class="shell">
        ${this.renderHeader()}
        ${this.progress ? this.renderProgress() : _}
        ${this.renderBudgetBanner()}
        <main>
          ${this.error ? this.renderAlert() : _}
          ${this.loading ? this.renderLoading() : this.tab === "inbox" ? this.renderInbox() : this.tab === "chat" ? this.renderChat() : this.tab === "activity" ? this.renderActivity() : this.renderSettings()}
        </main>
      </div>
      ${this.preview ? this.renderPreviewDialog() : _}
      ${this.dialog ? this.renderActionDialog() : _}
    `;
  }
  renderHeader() {
    return m`
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
    const s = this.budget;
    return !s?.budget || !s.warning && !s.exceeded ? _ : m`
      <div
        class="budget-banner ${s.exceeded ? "exceeded" : "warning"}"
        role=${s.exceeded ? "alert" : "status"}
      >
        <ha-icon
          icon=${s.exceeded ? "mdi:alert-octagon-outline" : "mdi:gauge-low"}
        ></ha-icon>
        <span>
          ${s.exceeded ? this.t("budget.exceeded") : this.t("budget.warning")}
          <small>
            ${s.total_tokens.toLocaleString()} /
            ${s.budget.toLocaleString()}
          </small>
        </span>
        <ha-button appearance="plain" @click=${() => this.changeTab("settings")}>
          ${this.t("budget.title")}
        </ha-button>
      </div>
    `;
  }
  renderLogo() {
    return m`
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
  navButton(s, e, t) {
    return m`
      <button
        role="tab"
        class=${this.tab === s ? "active" : ""}
        aria-selected=${this.tab === s ? "true" : "false"}
        @click=${() => this.changeTab(s)}
      >
        ${e}${t ? m`<span class="count">${t}</span>` : _}
      </button>
    `;
  }
  renderProgress() {
    const s = Math.max(0, Math.min(1, this.progress?.progress ?? 0.5));
    return m`
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
          aria-valuenow=${Math.round(s * 100)}
        >
          <span style=${`--progress: ${s * 100}%`}></span>
        </div>
      </div>
    `;
  }
  progressLabel(s) {
    return {
      context: "Collecting local context",
      provider: "Asking the advisor",
      tool: "Inspecting your setup",
      validate: "Validating suggestions",
      complete: "Advisor request complete"
    }[s.stage];
  }
  progressDetail(s) {
    return s.tool ? s.tool.replaceAll("_", " ") : s.stage === "provider" ? "This can take a few minutes." : s.stage === "complete" ? "The local inbox is up to date." : "Read-only operation";
  }
  renderAlert() {
    return m`
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
    return m`
      <section class="loading-state" aria-busy="true">
        ${this.renderLogo()}
        <p>Loading HAOS AI…</p>
      </section>
    `;
  }
  renderInbox() {
    const s = this.filteredSuggestions;
    return m`
      <section class="inbox-layout ${this.selected ? "has-selection" : ""}">
        <aside class="list-pane">
          <div class="pane-heading">
            <div>
              <h2>Suggestions</h2>
              <p>Nothing is applied automatically.</p>
            </div>
            <div class="inbox-heading-actions">
              <span class="total">${s.length}</span>
              <ha-icon-button
                label=${this.filter === "all" ? "Clear entire inbox" : `Clear ${this.filter} suggestions`}
                ?disabled=${this.busy || s.length === 0}
                @click=${this.openClearInbox}
              >
                <ha-icon icon="mdi:inbox-remove-outline"></ha-icon>
              </ha-icon-button>
            </div>
          </div>
          <div class="filters" aria-label="Suggestion filters">
            ${["new", "saved", "dismissed", "all"].map(
      (e) => m`
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
              `
    )}
          </div>
          <div class="suggestion-list">
            ${s.length === 0 ? m`
                  <div class="empty compact">
                    <ha-icon icon="mdi:inbox-outline"></ha-icon>
                    <h3>No ${this.filter === "all" ? "" : this.filter} suggestions</h3>
                    <p>
                      ${this.filter === "new" ? "Run a scan when you want the advisor to look for useful routines and setup issues." : "Items you organise here remain local to Home Assistant."}
                    </p>
                  </div>
                ` : s.map((e) => this.renderSuggestionRow(e))}
          </div>
        </aside>
        <article class="detail-pane">
          ${this.selected ? this.renderSuggestionDetail(this.selected) : m`
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
  renderSuggestionRow(s) {
    return m`
      <button
        class="suggestion-row ${this.selectedId === s.id ? "selected" : ""}"
        aria-pressed=${this.selectedId === s.id ? "true" : "false"}
        @click=${() => this.selectedId = s.id}
      >
        <ha-icon
          icon=${s.kind === "automation" ? "mdi:robot-outline" : "mdi:wrench-check-outline"}
        ></ha-icon>
        <span class="row-content">
          <strong>${s.title}</strong>
          <span class="summary">${s.summary}</span>
          <span class="meta">
            ${s.impact} impact · ${this.relativeDate(s.last_seen_at ?? s.created_at)}
            ${(s.occurrences ?? 1) > 1 ? ` · seen in ${s.occurrences} scans` : ""}
          </span>
        </span>
        <span class="confidence" title="Model confidence">
          ${Math.round(s.confidence * 100)}%
        </span>
      </button>
    `;
  }
  renderSuggestionDetail(s) {
    const e = this.draftValidation ?? s.automation?.validation, t = this.changeFor(s), i = t ? this.canApply(t) : !1, a = s.automation?.explanation ?? s.automation?.config?.description ?? s.summary;
    return m`
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
            <div class="detail-icon ${s.kind}">
              <ha-icon
                icon=${s.kind === "automation" ? "mdi:robot-outline" : "mdi:wrench-check-outline"}
              ></ha-icon>
            </div>
            <div>
              <h2>${s.title}</h2>
              <p>${s.summary}</p>
            </div>
          </div>
          <span class="status-badge ${s.impact}">${s.impact} impact</span>
        </header>

        <section class="detail-section">
          <h3>Why this surfaced</h3>
          <p>${s.rationale}</p>
          <div class="evidence-list">
            ${s.evidence.map((n) => this.renderEvidence(n))}
          </div>
        </section>

        ${s.automation ? m`
              <section class="detail-section">
                <h3>What the automation does</h3>
                <p>${a}</p>
              </section>
              <section class="detail-section yaml-section">
                <div class="section-heading">
                  <div>
                    <h3>Automation draft</h3>
                    <p>Edit locally and validate again before copying.</p>
                  </div>
                  <span
                    class="status-badge ${e?.valid ? "valid" : "invalid"}"
                  >
                    ${e?.valid ? "Validated" : "Check YAML"}
                  </span>
                </div>
                ${this.draftError ? m`<div class="inline-error" role="alert">${this.draftError}</div>` : _}
                ${e && !e.valid ? m`
                      <div class="validation-errors">
                        ${Object.entries(e.errors).map(
      ([n, r]) => m`<p><strong>${n}:</strong> ${r}</p>`
    )}
                      </div>
                    ` : _}
                <textarea
                  class="yaml-editor"
                  aria-label="Automation YAML"
                  spellcheck="false"
                  .value=${this.draftYaml}
                  @input=${(n) => {
      this.draftYaml = n.target.value, this.draftValidation = void 0, this.draftDirty = !0;
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
                  <ha-button appearance="plain" @click=${() => this.downloadYaml(s)}>
                    <ha-icon icon="mdi:download-outline" slot="start"></ha-icon>
                    Download
                  </ha-button>
                  <ha-button appearance="plain" @click=${this.copyAndOpenEditor}>
                    <ha-icon icon="mdi:open-in-new" slot="start"></ha-icon>
                    Copy & open editor
                  </ha-button>
                  <ha-button appearance="plain" @click=${() => this.reviseInChat(s)}>
                    <ha-icon icon="mdi:message-processing-outline" slot="start"></ha-icon>
                    Revise in chat
                  </ha-button>
                </div>
              </section>
            ` : _}

        <footer class="decision-bar">
          <span>
            <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
            ${t && i ? "No automatic writes. Every change requires your approval." : "HAOS AI is read-only unless you enable an approval capability."}
          </span>
          <div class="decision-actions">
            ${s.status !== "dismissed" ? m`
                  <ha-button appearance="plain" @click=${() => this.openFeedback(s)}>
                    Dismiss
                  </ha-button>
                ` : m`
                  <ha-button
                    appearance="plain"
                    @click=${() => this.updateSuggestion(s.id, "new")}
                  >
                    Restore
                  </ha-button>
                `}
            ${t && i && s.status !== "dismissed" ? m`
                  <ha-button
                    appearance="accent"
                    ?disabled=${this.busy || (t.kind === "create_automation" || t.kind === "update_automation") && !e?.valid}
                    @click=${() => this.openChangeApproval(s)}
                  >
                    <ha-icon icon="mdi:shield-check-outline" slot="start"></ha-icon>
                    ${t.kind === "create_automation" ? "Review & create" : t.kind === "update_automation" ? "Review & update" : "Review removal"}
                  </ha-button>
                ` : _}
            ${s.status !== "saved" ? m`
                  <ha-button
                    appearance="accent"
                    @click=${() => this.updateSuggestion(s.id, "saved")}
                  >
                    <ha-icon icon="mdi:bookmark-outline" slot="start"></ha-icon>
                    Save
                  </ha-button>
                ` : m`<span class="saved-label">
                  <ha-icon icon="mdi:bookmark-check"></ha-icon> Saved
                </span>`}
          </div>
        </footer>
      </div>
    `;
  }
  renderEvidence(s) {
    const e = this.evidencePath(s);
    return m`
      <div class="evidence-row">
        <ha-icon
          icon=${s.source_type === "history" ? "mdi:chart-timeline-variant" : s.source_type === "integration" ? "mdi:puzzle-outline" : "mdi:information-outline"}
        ></ha-icon>
        <div>
          <strong>${s.source_id}</strong>
          <p>${s.observation}</p>
          ${s.period ? m`<small>${s.period}</small>` : _}
          ${s.verified ? _ : m`<small class="evidence-unverified"
                >${this.t("evidence.unverified")}</small
              >`}
        </div>
        ${e ? m`
              <ha-icon-button
                label="Open in Home Assistant"
                @click=${() => this.navigate(e)}
              >
                <ha-icon icon="mdi:open-in-new"></ha-icon>
              </ha-icon-button>
            ` : _}
      </div>
    `;
  }
  renderChat() {
    const s = this.threads.find((e) => e.id === this.threadId);
    return m`
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
            ${this.threads.length ? this.threads.map(
      (e) => m`
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
                  `
    ) : m`<p class="thread-empty">No saved conversations yet.</p>`}
          </div>
        </aside>
        <div class="conversation-pane">
          <header class="conversation-header">
            <div>
              <h2>${s?.title ?? "New conversation"}</h2>
              <p>Read-only answers grounded in your Home Assistant setup.</p>
            </div>
            <div class="conversation-actions">
              <span class="read-only-badge">
                <ha-icon icon="mdi:shield-check-outline"></ha-icon> Read only
              </span>
              ${s ? m`
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
                  ` : _}
            </div>
          </header>
          <div class="messages" aria-live="polite">
            ${this.chat.length === 0 ? m`
                  <div class="empty chat-empty">
                    <ha-icon icon="mdi:message-question-outline"></ha-icon>
                    <h3>Ask a question about your home</h3>
                    <p>
                      Try “Which lights are missing areas?” or “Help me design a
                      reliable bedtime routine.”
                    </p>
                  </div>
                ` : this.chat.map((e) => {
      const t = e.role === "assistant" ? this.extractYaml(e.content) : void 0;
      return m`
                    <div class="message ${e.role}">
                      <div class="message-avatar">
                        ${e.role === "assistant" ? this.renderLogo() : m`<ha-icon icon="mdi:account-outline"></ha-icon>`}
                      </div>
                      <div>
                        <strong>${e.role === "user" ? "You" : "HAOS AI"}</strong>
                        <p>${e.content}</p>
                        ${t ? m`
                              <div class="message-actions">
                                ${this.selected?.automation ? m`
                                      <ha-button
                                        appearance="outlined"
                                        @click=${() => this.useChatYaml(e.content)}
                                      >
                                        <ha-icon icon="mdi:file-replace-outline" slot="start"></ha-icon>
                                        Use as automation draft
                                      </ha-button>
                                    ` : m`
                                      <ha-button
                                        appearance="outlined"
                                        @click=${() => {
        this.copyYaml(t);
      }}
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
                            ` : _}
                      </div>
                    </div>
                  `;
    })}
            ${this.busy && this.tab === "chat" ? m`
                  <div class="message assistant pending">
                    <div class="message-avatar">${this.renderLogo()}</div>
                    <div><strong>HAOS AI</strong><p>Inspecting your setup…</p></div>
                  </div>
                ` : _}
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
    const s = this.activity?.receipts ?? [];
    return m`
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
          ${s.length ? s.map((e) => this.renderReceiptRow(e)) : m`
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
  renderReceiptRow(s) {
    return m`
      <button
        class="receipt-row ${s.id === this.selectedReceiptId ? "selected" : ""}"
        @click=${() => this.openReceipt(s.id)}
      >
        <ha-icon
          icon=${s.purpose === "scan" ? "mdi:radar" : "mdi:message-outline"}
        ></ha-icon>
        <span>
          <strong>${s.purpose === "scan" ? "Advisor scan" : "Conversation"}</strong>
          <small>${s.provider} · ${s.model}</small>
          <small>${this.formatUsage(s.usage)} · ${this.relativeDate(s.created_at)}</small>
        </span>
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>
    `;
  }
  renderActivityOverview() {
    const s = this.activity?.scan_runs ?? this.overview?.scan_runs ?? [], e = s[0], t = s.reduce(
      (i, a) => i + a.recommendation_count,
      0
    );
    return m`
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
          <div><dt>Recorded scans</dt><dd>${s.length}</dd></div>
          <div><dt>New suggestions recorded</dt><dd>${t}</dd></div>
          <div>
            <dt>Last scan</dt>
            <dd>${e ? this.relativeDate(e.created_at) : "Never"}</dd>
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
    const s = this.budget;
    return s ? m`
      <section class="detail-section">
        <h3>${this.t("budget.title")}</h3>
        <dl class="stats-list compact-stats">
          <div>
            <dt>${this.t("budget.used")}</dt>
            <dd>${s.total_tokens.toLocaleString()}</dd>
          </div>
          <div>
            <dt>${this.t("budget.remaining")}</dt>
            <dd>
              ${s.budget ? (s.remaining ?? 0).toLocaleString() : this.t("budget.no_cap")}
            </dd>
          </div>
          <div>
            <dt>${this.t("budget.requests")}</dt>
            <dd>${s.requests}</dd>
          </div>
        </dl>
        ${s.budget ? m`<div
              class="budget-meter ${s.exceeded ? "exceeded" : s.warning ? "warning" : ""}"
              role="img"
              aria-label=${`${Math.round(s.ratio * 100)}%`}
            >
              <span style=${`width:${Math.min(100, s.ratio * 100)}%`}></span>
            </div>` : _}
      </section>
    ` : _;
  }
  renderAppliedChanges() {
    const s = this.activity?.applied_changes ?? this.overview?.applied_changes ?? [];
    return m`
      <section class="detail-section applied-section">
        <h3>${this.t("applied.title")}</h3>
        <p>${this.t("applied.description")}</p>
        ${s.length ? m`<ul class="applied-list">
              ${s.map(
      (e) => m`
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
                      ${e.outcome_detail ? m`<small>${e.outcome_detail}</small>` : _}
                    </span>
                  </li>
                `
    )}
            </ul>` : m`<p class="muted">${this.t("applied.empty")}</p>`}
      </section>
    `;
  }
  renderReceiptDetail(s) {
    return m`
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
              <ha-icon icon=${s.purpose === "scan" ? "mdi:radar" : "mdi:message-outline"}></ha-icon>
            </div>
            <div>
              <h2>${s.purpose === "scan" ? "Advisor scan" : "Conversation"}</h2>
              <p>${new Date(s.created_at).toLocaleString()}</p>
            </div>
          </div>
          <span class="status-badge valid">Stored locally</span>
        </header>
        <dl class="stats-list compact-stats">
          <div><dt>Provider</dt><dd>${s.provider}</dd></div>
          <div><dt>Model</dt><dd>${s.model}</dd></div>
          <div><dt>Token usage</dt><dd>${this.formatUsage(s.usage)}</dd></div>
          <div><dt>Redactions</dt><dd>${s.redactions.length}</dd></div>
        </dl>
        <section class="detail-section">
          <h3>Context categories</h3>
          <div class="chip-list">
            ${s.categories.map(
      (e) => m`<span>${e.replaceAll("_", " ")}</span>`
    )}
          </div>
        </section>
        <section class="detail-section">
          <h3>Redacted fields</h3>
          ${s.redactions.length ? m`<ul>${s.redactions.map((e) => m`<li>${e}</li>`)}</ul>` : m`<p>No sensitive fields were present in this request.</p>`}
        </section>
        <section class="detail-section payload-section">
          <details>
            <summary>Inspect the exact sanitized payload</summary>
            <pre><code>${JSON.stringify(s.payload_preview, null, 2)}</code></pre>
          </details>
        </section>
      </div>
    `;
  }
  renderSettings() {
    if (!this.overview) return _;
    const s = new Set(
      this.overview.goal_presets.map((i) => i.id)
    ), e = this.selectedGoals.filter(
      (i) => !s.has(i)
    ), t = this.overview.provider_options.find(
      (i) => i.id === this.providerDraft
    );
    return m`
      <section class="settings-layout">
        <header class="settings-heading">
          <div>
            <h2>HAOS AI settings</h2>
            <p>Connection, advisor behavior, privacy, and scheduled scans.</p>
          </div>
          <span class="version-badge">v${this.overview.version}</span>
        </header>
        ${this.settingsNotice ? m`<div class="settings-notice" role="status">
              <ha-icon icon="mdi:check-circle-outline"></ha-icon>
              ${this.settingsNotice}
            </div>` : _}

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
                @change=${(i) => this.providerChanged(i.target.value)}
              >
                ${this.overview.provider_options.map(
      (i) => m`
                    <option
                      value=${i.id}
                      ?selected=${i.id === this.providerDraft}
                    >${i.label}</option>
                  `
    )}
              </select>
            </label>
            <label>
              <span>Model</span>
              <input
                .value=${this.modelDraft}
                @input=${(i) => this.modelDraft = i.target.value}
                placeholder=${t?.default_model || "Model identifier"}
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
          ${this.showConnectionAdvanced ? m`
                <div class="settings-fields two-column advanced-fields">
                  <label>
                    <span>New API key</span>
                    <input
                      type="password"
                      .value=${this.apiKeyDraft}
                      @input=${(i) => this.apiKeyDraft = i.target.value}
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
                      @input=${(i) => this.baseUrlDraft = i.target.value}
                      placeholder=${t?.default_base_url || "https://…"}
                      autocomplete="url"
                    />
                    <small>Advanced: HAOS AI appends the provider route.</small>
                  </label>
                </div>
              ` : _}
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
            ${this.overview.goal_presets.map(
      (i) => m`
                <label class="choice-card">
                  <input
                    type="checkbox"
                    .checked=${this.selectedGoals.includes(i.id)}
                    @change=${() => this.toggleGoal(i.id)}
                  />
                  <span class="choice-control">
                    <ha-icon
                      icon=${this.selectedGoals.includes(i.id) ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}
                    ></ha-icon>
                    ${i.label}
                  </span>
                </label>
              `
    )}
          </div>
          ${e.length ? m`
                <div class="imported-goals">
                  <span>Imported preferences</span>
                  ${e.map(
      (i) => m`
                      <button @click=${() => this.toggleGoal(i)}>
                        ${i}<ha-icon icon="mdi:close"></ha-icon>
                      </button>
                    `
    )}
                </div>
              ` : _}

          <div class="settings-subsection">
            <h4>How the advisor should think</h4>
            <div class="settings-fields three-column">
              <label>
                <span>Recommendation style</span>
                <select .value=${this.advisorMode} @change=${(i) => this.advisorMode = i.target.value}>
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="ambitious">Ambitious</option>
                  <option value="automation_hell">I WANT AUTOMATION HELL</option>
                </select>
              </label>
              <label>
                <span>Scan depth</span>
                <select .value=${this.scanDepth} @change=${(i) => this.scanDepth = i.target.value}>
                  <option value="focused">Focused · up to 4 ideas</option>
                  <option value="standard">Standard · up to 8 ideas</option>
                  <option value="thorough">Thorough · up to 10 ideas</option>
                </select>
              </label>
              <label>
                <span>Automation complexity</span>
                <select .value=${this.automationComplexity} @change=${(i) => this.automationComplexity = i.target.value}>
                  <option value="simple">Simple only</option>
                  <option value="normal">Normal</option>
                  <option value="advanced">Advanced allowed</option>
                </select>
              </label>
            </div>
            <div class="toggle-list">
              <label>
                <input type="checkbox" .checked=${this.fixExistingFirst} @change=${(i) => this.fixExistingFirst = i.target.checked} />
                <span><strong>Fix existing automations first</strong><small>Prefer simplifying or repairing what already exists.</small></span>
              </label>
              <label>
                <input type="checkbox" .checked=${this.avoidNewHardware} @change=${(i) => this.avoidNewHardware = i.target.checked} />
                <span><strong>Avoid new hardware</strong><small>Only suggest ideas using devices already in Home Assistant.</small></span>
              </label>
            </div>
          </div>

          <div class="settings-subsection">
            <h4>Quiet hours for suggested automations</h4>
            <p class="field-help">The advisor will avoid noisy or disruptive actions during this window.</p>
            <div class="settings-fields two-column compact-fields">
              <label><span>From</span><input type="time" .value=${this.quietStart} @input=${(i) => this.quietStart = i.target.value} /></label>
              <label><span>Until</span><input type="time" .value=${this.quietEnd} @input=${(i) => this.quietEnd = i.target.value} /></label>
            </div>
          </div>

          <div class="settings-subsection entity-exclusions">
            <h4>${this.t("ignore.entities")}</h4>
            <p class="field-help">${this.t("ignore.entities_help")}</p>
            <div class="entity-picker">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input
                .value=${this.ignoredEntityQuery}
                @input=${(i) => {
      this.ignoredEntityQuery = i.target.value, this.ignoredEntityError = "", this.entityHighlight = -1;
    }}
                @keydown=${this.handleEntityKeydown}
                @paste=${this.handleEntityPaste}
                placeholder="Search or paste: light.kitchen, sensor.hallway…"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded=${this.matchingEntities.length ? "true" : "false"}
                aria-invalid=${this.ignoredEntityError ? "true" : "false"}
                aria-controls="ignored-entity-results"
                aria-activedescendant=${this.entityHighlight >= 0 ? `ignored-entity-option-${this.entityHighlight}` : _}
              />
              ${this.matchingEntities.length ? m`
                    <div
                      class="entity-results"
                      role="listbox"
                      id="ignored-entity-results"
                    >
                      ${this.matchingEntities.map(
      (i, a) => m`
                          <button
                            role="option"
                            id=${`ignored-entity-option-${a}`}
                            aria-selected=${a === this.entityHighlight ? "true" : "false"}
                            class=${a === this.entityHighlight ? "active" : ""}
                            @click=${() => this.addIgnoredEntities([i.entity_id])}
                          >
                            <span>
                              <strong>${i.attributes.friendly_name ?? i.entity_id}</strong>
                              <small>${i.entity_id}</small>
                            </span>
                            <em>${i.state}</em>
                          </button>
                        `
    )}
                    </div>
                  ` : _}
            </div>
            <p class="field-error" role="alert">${this.ignoredEntityError}</p>
            <div class="entity-chips" aria-label="Ignored entities">
              ${this.ignoredEntities.map((i) => {
      const a = this.hass?.states?.[i];
      return m`
                  <span class=${a ? "" : "unavailable"}>
                    <span>
                      <strong>${a?.attributes.friendly_name ?? i}</strong>
                      ${a ? m`<small>${i}</small>` : m`<small>${this.t("ignore.not_found")}</small>`}
                    </span>
                    <button
                      aria-label=${`${this.t("ignore.stop")} ${i}`}
                      @click=${() => this.ignoredEntities = this.ignoredEntities.filter(
        (n) => n !== i
      )}
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
              <input type="checkbox" .checked=${this.changePermissions.create_automations} @change=${(i) => this.changePermissions = { ...this.changePermissions, create_automations: i.target.checked }} />
              <span><strong>Create validated automations</strong><small>Shows an approval button only after the current YAML passes Home Assistant validation.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.update_automations} @change=${(i) => this.changePermissions = { ...this.changePermissions, update_automations: i.target.checked }} />
              <span><strong>Update existing automations</strong><small>Only exact, existing automation config IDs can be proposed and replaced after review.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.remove_entities} @change=${(i) => this.changePermissions = { ...this.changePermissions, remove_entities: i.target.checked }} />
              <span><strong>Remove orphaned entities</strong><small>Only exact registry entries missing from the current state machine can be proposed.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.remove_devices} @change=${(i) => this.changePermissions = { ...this.changePermissions, remove_devices: i.target.checked }} />
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
              <select .value=${String(this.historyDays)} @change=${(i) => this.historyDays = Number(i.target.value)}>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </label>
            <label>
              <span>Automatic scans</span>
              <select .value=${this.schedule} @change=${(i) => this.schedule = i.target.value}>
                <option value="manual">Manual only</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label class=${this.schedule === "manual" ? "disabled-field" : ""}>
              <span>Scan time</span>
              <input type="time" .value=${this.scheduleTime} ?disabled=${this.schedule === "manual"} @input=${(i) => this.scheduleTime = i.target.value} />
            </label>
            ${this.schedule === "weekly" ? m`<label>
                  <span>Scan day</span>
                  <select .value=${String(this.scheduleWeekday)} @change=${(i) => this.scheduleWeekday = Number(i.target.value)}>
                    ${Fa.map(
      (i, a) => m`<option value=${a}>${this.t(i)}</option>`
    )}
                  </select>
                </label>` : _}
          </div>
          <div class="toggle-list divided-toggles">
            <label>
              <input type="checkbox" .checked=${this.notifyNewSuggestions} ?disabled=${this.schedule === "manual"} @change=${(i) => this.notifyNewSuggestions = i.target.checked} />
              <span><strong>Notify about new scheduled suggestions</strong><small>Manual scans never create this notification.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.includeExactLocation} @change=${(i) => this.includeExactLocation = i.target.checked} />
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
    const s = this.overview?.provider_options ?? [], e = s.find((t) => t.id === this.scanProviderDraft);
    return m`
      <div class="settings-subsection scan-profile">
        <h4>${this.t("scan_profile.title")}</h4>
        <p class="field-help">${this.t("scan_profile.description")}</p>
        <div class="toggle-list">
          <label>
            <input
              type="checkbox"
              .checked=${this.scanProfileEnabled}
              @change=${(t) => {
      this.scanProfileEnabled = t.target.checked, this.settingsNotice = "";
    }}
            />
            <span>
              <strong>${this.t("scan_profile.enable")}</strong>
              <small>${this.t("scan_profile.enable_help")}</small>
            </span>
          </label>
        </div>
        ${this.scanProfileEnabled ? m`
              <div class="settings-fields two-column">
                <label>
                  <span>${this.t("scan_profile.provider")}</span>
                  <select
                    .value=${this.scanProviderDraft}
                    @change=${(t) => {
      const i = t.target.value, a = s.find((n) => n.id === i);
      this.scanProviderDraft = i, a && (this.scanModelDraft || (this.scanModelDraft = a.default_model), this.scanBaseUrlDraft || (this.scanBaseUrlDraft = a.default_base_url)), this.scanApiKeyDraft = "", this.settingsNotice = "";
    }}
                  >
                    ${s.map(
      (t) => m`
                        <option
                          value=${t.id}
                          ?selected=${t.id === this.scanProviderDraft}
                        >${t.label}</option>
                      `
    )}
                  </select>
                </label>
                <label>
                  <span>${this.t("scan_profile.model")}</span>
                  <input
                    .value=${this.scanModelDraft}
                    @input=${(t) => this.scanModelDraft = t.target.value}
                    placeholder=${e?.default_model || "Model identifier"}
                    autocomplete="off"
                  />
                </label>
                <label>
                  <span>${this.t("scan_profile.api_key")}</span>
                  <input
                    type="password"
                    .value=${this.scanApiKeyDraft}
                    @input=${(t) => this.scanApiKeyDraft = t.target.value}
                    placeholder="Stored key remains unchanged"
                    autocomplete="new-password"
                  />
                </label>
                <label>
                  <span>${this.t("scan_profile.base_url")}</span>
                  <input
                    type="url"
                    .value=${this.scanBaseUrlDraft}
                    @input=${(t) => this.scanBaseUrlDraft = t.target.value}
                    placeholder=${e?.default_base_url || "https://…"}
                    autocomplete="url"
                  />
                </label>
              </div>
              <p class="field-help">
                ${this.overview?.scan_profile?.active ? this.t("scan_profile.active") : this.t("scan_profile.inactive")}
              </p>
            ` : _}
      </div>
    `;
  }
  renderScopePicker(s, e, t, i, a, n, r) {
    const o = i ? n.filter(
      (l) => `${l.id} ${l.label}`.toLocaleLowerCase().includes(i.trim().toLocaleLowerCase())
    ).slice(0, 8) : [];
    return m`
      <div class="settings-subsection entity-exclusions">
        <h4>${this.t(e)}</h4>
        <p class="field-help">${this.t(t)}</p>
        <div class="entity-picker">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            .value=${i}
            @input=${(l) => a(l.target.value)}
            @keydown=${(l) => {
      l.key === "Enter" && (l.preventDefault(), this.addIgnoredScope(s, o[0]?.id ?? i));
    }}
            placeholder=${this.t(e)}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded=${o.length ? "true" : "false"}
          />
          ${o.length ? m`
                <div class="entity-results" role="listbox">
                  ${o.map(
      (l) => m`
                      <button
                        role="option"
                        @click=${() => this.addIgnoredScope(s, l.id)}
                      >
                        <span>
                          <strong>${l.label}</strong>
                          ${l.label === l.id ? _ : m`<small>${l.id}</small>`}
                        </span>
                      </button>
                    `
    )}
                </div>
              ` : _}
        </div>
        <div class="entity-chips" aria-label=${this.t(e)}>
          ${r.map(
      (l) => m`
              <span>
                <span><strong>${l.label}</strong></span>
                <button
                  aria-label=${`${this.t("ignore.stop")} ${l.label}`}
                  @click=${() => this.removeIgnoredScope(s, l.id)}
                ><ha-icon icon="mdi:close"></ha-icon></button>
              </span>
            `
    )}
        </div>
      </div>
    `;
  }
  renderIgnoreScopes() {
    return m`
      ${this.renderScopePicker(
      "domains",
      "ignore.domains",
      "ignore.domains_help",
      this.ignoredDomainQuery,
      (s) => this.ignoredDomainQuery = s,
      this.availableDomains.map((s) => ({ id: s, label: s })),
      this.ignoredDomains.map((s) => ({ id: s, label: s }))
    )}
      ${this.renderScopePicker(
      "areas",
      "ignore.areas",
      "ignore.areas_help",
      this.ignoredAreaQuery,
      (s) => this.ignoredAreaQuery = s,
      this.availableAreas.map((s) => ({
        id: s.area_id,
        label: s.name
      })),
      this.ignoredAreas.map((s) => ({
        id: s,
        label: this.areaName(s)
      }))
    )}
      ${this.renderScopePicker(
      "labels",
      "ignore.labels",
      "ignore.labels_help",
      this.ignoredLabelQuery,
      (s) => this.ignoredLabelQuery = s,
      this.availableLabels.map((s) => ({ id: s, label: s })),
      this.ignoredLabels.map((s) => ({ id: s, label: s }))
    )}
      <p class="field-help enforced-note">
        <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
        ${this.t("ignore.enforced")}
      </p>
    `;
  }
  renderBudgetSettings() {
    const s = this.budget;
    return m`
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
      this.monthlyTokenBudget = Math.max(
        0,
        Number(e.target.value) || 0
      ), this.settingsNotice = "";
    }}
            />
            <small>${this.t("budget.unlimited")}</small>
          </label>
          ${s ? m`<label class="readonly-field">
                <span>${this.t("budget.used")}</span>
                <output>${s.total_tokens.toLocaleString()}</output>
                <small>
                  ${s.budget ? `${this.t("budget.remaining")}: ${(s.remaining ?? 0).toLocaleString()}` : this.t("budget.no_cap")}
                </small>
              </label>` : _}
        </div>
      </div>
    `;
  }
  renderPreviewDialog() {
    const s = this.preview.payload, e = Object.keys(s).filter((t) => s[t] !== null);
    return m`
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
            ${e.map(
      (t) => m`
                <div><ha-icon icon="mdi:check-circle-outline"></ha-icon>${t.replaceAll("_", " ")}</div>
              `
    )}
          </div>
          <details>
            <summary>Inspect sanitized baseline</summary>
            <pre><code>${JSON.stringify(s, null, 2)}</code></pre>
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
    if (this.dialog === "feedback")
      return m`
        <ha-adaptive-dialog
          open
          allow-mode-change
          header-title="Why are you dismissing this?"
          header-subtitle="This helps future scans"
          @closed=${() => this.dialog = null}
        >
          <div class="dialog-content feedback-options">
            ${Ha.map(
        (s) => m`
                <button
                  class=${this.feedbackReason === s ? "selected" : ""}
                  @click=${() => this.feedbackReason = s}
                >
                  <ha-icon
                    icon=${this.feedbackReason === s ? "mdi:radiobox-marked" : "mdi:radiobox-blank"}
                  ></ha-icon>
                  ${s}
                </button>
              `
      )}
            <label>
              Optional note
              <textarea
                .value=${this.feedbackNote}
                @input=${(s) => this.feedbackNote = s.target.value}
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
    if (this.dialog === "rename")
      return m`
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
                @input=${(s) => this.renameText = s.target.value}
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
      const s = this.filteredSuggestions.length;
      return m`
        <ha-adaptive-dialog
          open
          type="alert"
          header-title=${this.filter === "all" ? "Clear the entire inbox?" : `Clear ${this.filter} suggestions?`}
          header-subtitle="Local suggestions only"
          @closed=${() => this.dialog = null}
        >
          <div class="dialog-content">
            <p>
              This permanently removes ${s} ${s === 1 ? "suggestion" : "suggestions"}
              from Home Assistant. It does not change devices or automations.
            </p>
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => this.dialog = null}>Cancel</ha-button>
            <ha-button variant="danger" appearance="filled" @click=${this.clearInbox}>
              Clear ${s}
            </ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
    }
    if (this.dialog === "approve-change" && this.pendingChange) {
      const s = this.pendingChange, e = !["create_automation", "update_automation"].includes(
        s.kind
      );
      return m`
        <ha-adaptive-dialog
          open
          type=${e ? "alert" : _}
          header-title=${e ? "Approve removal?" : s.kind === "update_automation" ? "Approve automation update?" : "Approve automation creation?"}
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
              <div><dt>Action</dt><dd>${s.kind.replaceAll("_", " ")}</dd></div>
              <div><dt>Target</dt><dd>${s.label}</dd></div>
              <div><dt>Identifier</dt><dd><code>${s.targetId}</code></dd></div>
            </dl>
            ${s.kind === "update_automation" ? this.renderDiff() : _}
            ${s.kind === "create_automation" || s.kind === "update_automation" ? m`
                  <details>
                    <summary>Inspect validated YAML</summary>
                    <pre><code>${this.draftYaml}</code></pre>
                  </details>
                ` : m`<p class="danger-copy">Removal may be irreversible. A future scan cannot restore registry data.</p>`}
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => {
        this.dialog = null, this.pendingChange = void 0, this.diffLines = void 0, this.diffError = "";
      }}>${this.t("action.cancel")}</ha-button>
            <ha-button
              variant=${e ? "danger" : _}
              appearance=${e ? "filled" : "accent"}
              ?disabled=${this.busy || s.kind === "update_automation" && (this.diffLoading || !!this.diffError)}
              @click=${this.approveChange}
            >${e ? "Approve & remove" : s.kind === "update_automation" ? "Approve & update" : "Approve & create"}</ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
    }
    return m`
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
    return this.diffLoading ? m`<p class="muted">${this.t("diff.loading")}</p>` : this.diffError ? m`<p class="danger-copy">${this.diffError}</p>` : this.diffLines ? this.diffLines.some((e) => e.type !== "same") ? m`
      <section class="diff-section">
        <h3>${this.t("diff.title")}</h3>
        <div class="diff-legend">
          <span class="removed">${this.t("diff.current")}</span>
          <span class="added">${this.t("diff.proposed")}</span>
        </div>
        <pre class="diff"><code>${this.diffLines.map(
      (e) => m`<span class="diff-line ${e.type}"
            >${e.type === "added" ? "+" : e.type === "removed" ? "-" : " "} ${e.text}
</span>`
    )}</code></pre>
      </section>
    ` : m`<p class="muted">${this.t("diff.identical")}</p>` : _;
  }
  relativeDate(s) {
    const e = new Date(s).getTime(), t = Math.round((Date.now() - e) / 6e4);
    if (t < 60) return `${Math.max(1, t)}m ago`;
    const i = Math.round(t / 60);
    if (i < 24) return `${i}h ago`;
    const a = Math.round(i / 24);
    return a < 30 ? `${a}d ago` : new Date(s).toLocaleDateString();
  }
  formatUsage(s) {
    const e = s?.input_tokens ?? 0, t = s?.output_tokens ?? 0, i = e + t;
    return i ? `${i.toLocaleString()} tokens` : "Usage unavailable";
  }
};
y.styles = li`
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
b([
  Ot({ attribute: !1 })
], y.prototype, "hass", 2);
b([
  Ot({ attribute: !1 })
], y.prototype, "panel", 2);
b([
  w()
], y.prototype, "overview", 2);
b([
  w()
], y.prototype, "tab", 2);
b([
  w()
], y.prototype, "filter", 2);
b([
  w()
], y.prototype, "selectedId", 2);
b([
  w()
], y.prototype, "loading", 2);
b([
  w()
], y.prototype, "busy", 2);
b([
  w()
], y.prototype, "dialogPending", 2);
b([
  w()
], y.prototype, "entityHighlight", 2);
b([
  w()
], y.prototype, "error", 2);
b([
  w()
], y.prototype, "preview", 2);
b([
  w()
], y.prototype, "progress", 2);
b([
  w()
], y.prototype, "chat", 2);
b([
  w()
], y.prototype, "chatText", 2);
b([
  w()
], y.prototype, "threadId", 2);
b([
  w()
], y.prototype, "threads", 2);
b([
  w()
], y.prototype, "activity", 2);
b([
  w()
], y.prototype, "receipt", 2);
b([
  w()
], y.prototype, "selectedReceiptId", 2);
b([
  w()
], y.prototype, "selectedGoals", 2);
b([
  w()
], y.prototype, "ignoredEntities", 2);
b([
  w()
], y.prototype, "ignoredEntityQuery", 2);
b([
  w()
], y.prototype, "ignoredEntityError", 2);
b([
  w()
], y.prototype, "ignoredDomains", 2);
b([
  w()
], y.prototype, "ignoredAreas", 2);
b([
  w()
], y.prototype, "ignoredLabels", 2);
b([
  w()
], y.prototype, "ignoredDomainQuery", 2);
b([
  w()
], y.prototype, "ignoredAreaQuery", 2);
b([
  w()
], y.prototype, "ignoredLabelQuery", 2);
b([
  w()
], y.prototype, "monthlyTokenBudget", 2);
b([
  w()
], y.prototype, "advisorMode", 2);
b([
  w()
], y.prototype, "scanDepth", 2);
b([
  w()
], y.prototype, "automationComplexity", 2);
b([
  w()
], y.prototype, "fixExistingFirst", 2);
b([
  w()
], y.prototype, "avoidNewHardware", 2);
b([
  w()
], y.prototype, "changePermissions", 2);
b([
  w()
], y.prototype, "quietStart", 2);
b([
  w()
], y.prototype, "quietEnd", 2);
b([
  w()
], y.prototype, "providerDraft", 2);
b([
  w()
], y.prototype, "modelDraft", 2);
b([
  w()
], y.prototype, "baseUrlDraft", 2);
b([
  w()
], y.prototype, "apiKeyDraft", 2);
b([
  w()
], y.prototype, "showConnectionAdvanced", 2);
b([
  w()
], y.prototype, "historyDays", 2);
b([
  w()
], y.prototype, "includeExactLocation", 2);
b([
  w()
], y.prototype, "schedule", 2);
b([
  w()
], y.prototype, "scheduleTime", 2);
b([
  w()
], y.prototype, "scheduleWeekday", 2);
b([
  w()
], y.prototype, "notifyNewSuggestions", 2);
b([
  w()
], y.prototype, "settingsNotice", 2);
b([
  w()
], y.prototype, "copied", 2);
b([
  w()
], y.prototype, "draftYaml", 2);
b([
  w()
], y.prototype, "draftValidation", 2);
b([
  w()
], y.prototype, "draftError", 2);
b([
  w()
], y.prototype, "dialog", 2);
b([
  w()
], y.prototype, "feedbackReason", 2);
b([
  w()
], y.prototype, "feedbackNote", 2);
b([
  w()
], y.prototype, "renameText", 2);
b([
  w()
], y.prototype, "pendingChange", 2);
b([
  w()
], y.prototype, "scanProfileEnabled", 2);
b([
  w()
], y.prototype, "scanProviderDraft", 2);
b([
  w()
], y.prototype, "scanModelDraft", 2);
b([
  w()
], y.prototype, "scanBaseUrlDraft", 2);
b([
  w()
], y.prototype, "scanApiKeyDraft", 2);
b([
  w()
], y.prototype, "diffLines", 2);
b([
  w()
], y.prototype, "diffError", 2);
b([
  w()
], y.prototype, "diffLoading", 2);
y = b([
  Oi("haos-ai-panel")
], y);
export {
  y as HaosAiPanel
};
