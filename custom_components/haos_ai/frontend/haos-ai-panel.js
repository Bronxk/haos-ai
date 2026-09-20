var Fe = globalThis, _t = Fe.ShadowRoot && (Fe.ShadyCSS === void 0 || Fe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, St = /* @__PURE__ */ Symbol(), Wt = /* @__PURE__ */ new WeakMap(), vi = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== St) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (_t && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Wt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Wt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
}, vs = (t) => new vi(typeof t == "string" ? t : t + "", void 0, St), ys = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, a, n) => s + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + t[n + 1], t[0]);
  return new vi(i, t, St);
}, bs = (t, e) => {
  if (_t) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), a = Fe.litNonce;
    a !== void 0 && s.setAttribute("nonce", a), s.textContent = i.cssText, t.appendChild(s);
  }
}, Gt = _t ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return vs(i);
})(t) : t, { is: ws, defineProperty: $s, getOwnPropertyDescriptor: ks, getOwnPropertyNames: xs, getOwnPropertySymbols: _s, getPrototypeOf: Ss } = Object, tt = globalThis, Qt = tt.trustedTypes, As = Qt ? Qt.emptyScript : "", Es = tt.reactiveElementPolyfillSupport, Ne = (t, e) => t, Qe = {
  toAttribute(t, e) {
    switch (e) {
      case Boolean:
        t = t ? As : null;
        break;
      case Object:
      case Array:
        t = t == null ? t : JSON.stringify(t);
    }
    return t;
  },
  fromAttribute(t, e) {
    let i = t;
    switch (e) {
      case Boolean:
        i = t !== null;
        break;
      case Number:
        i = t === null ? null : Number(t);
        break;
      case Object:
      case Array:
        try {
          i = JSON.parse(t);
        } catch {
          i = null;
        }
    }
    return i;
  }
}, At = (t, e) => !ws(t, e), Jt = {
  attribute: !0,
  type: String,
  converter: Qe,
  reflect: !1,
  useDefault: !1,
  hasChanged: At
};
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), tt.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var oe = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Jt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && $s(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: a } = ks(this.prototype, t) ?? {
      get() {
        return this[e];
      },
      set(n) {
        this[e] = n;
      }
    };
    return {
      get: s,
      set(n) {
        const r = s?.call(this);
        a?.call(this, n), this.requestUpdate(t, r, i);
      },
      configurable: !0,
      enumerable: !0
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Jt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ne("elementProperties"))) return;
    const t = Ss(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ne("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ne("properties"))) {
      const e = this.properties, i = [...xs(e), ..._s(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(Gt(s));
    } else t !== void 0 && e.push(Gt(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return bs(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : Qe).toAttribute(e, i.type);
      this._$Em = t, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), n = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : Qe;
      this._$Em = s;
      const r = n.fromAttribute(e, a.type);
      this[s] = r ?? this._$Ej?.get(s) ?? r, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, a) {
    if (t !== void 0) {
      const n = this.constructor;
      if (s === !1 && (a = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? At)(a, e) || i.useDefault && i.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: a }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), a !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, a] of this._$Ep) this[s] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, a] of i) {
        const { wrapped: n } = a, r = this[s];
        n !== !0 || this._$AL.has(s) || r === void 0 || this.C(s, void 0, a, r);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
oe.elementStyles = [], oe.shadowRootOptions = { mode: "open" }, oe[Ne("elementProperties")] = /* @__PURE__ */ new Map(), oe[Ne("finalized")] = /* @__PURE__ */ new Map(), Es?.({ ReactiveElement: oe }), (tt.reactiveElementVersions ??= []).push("2.1.2");
var Et = globalThis, Xt = (t) => t, Je = Et.trustedTypes, Zt = Je ? Je.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, yi = "$lit$", J = `lit$${Math.random().toFixed(9).slice(2)}$`, bi = "?" + J, Ns = `<${bi}>`, se = document, Ie = () => se.createComment(""), Ce = (t) => t === null || typeof t != "object" && typeof t != "function", Nt = Array.isArray, Os = (t) => Nt(t) || typeof t?.[Symbol.iterator] == "function", ht = `[ 	
\f\r]`, _e = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ei = /-->/g, ti = />/g, Z = RegExp(`>|${ht}(?:([^\\s"'>=/]+)(${ht}*=${ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ii = /'/g, si = /"/g, wi = /^(?:script|style|textarea|title)$/i, Ot = (t) => (e, ...i) => ({
  _$litType$: t,
  strings: e,
  values: i
}), f = Ot(1), tn = Ot(2), sn = Ot(3), ue = /* @__PURE__ */ Symbol.for("lit-noChange"), x = /* @__PURE__ */ Symbol.for("lit-nothing"), ai = /* @__PURE__ */ new WeakMap(), ee = se.createTreeWalker(se, 129);
function $i(t, e) {
  if (!Nt(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Zt !== void 0 ? Zt.createHTML(e) : e;
}
var Ts = (t, e) => {
  const i = t.length - 1, s = [];
  let a, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = _e;
  for (let o = 0; o < i; o++) {
    const l = t[o];
    let c, p, d = -1, h = 0;
    for (; h < l.length && (r.lastIndex = h, p = r.exec(l), p !== null); ) h = r.lastIndex, r === _e ? p[1] === "!--" ? r = ei : p[1] !== void 0 ? r = ti : p[2] !== void 0 ? (wi.test(p[2]) && (a = RegExp("</" + p[2], "g")), r = Z) : p[3] !== void 0 && (r = Z) : r === Z ? p[0] === ">" ? (r = a ?? _e, d = -1) : p[1] === void 0 ? d = -2 : (d = r.lastIndex - p[2].length, c = p[1], r = p[3] === void 0 ? Z : p[3] === '"' ? si : ii) : r === si || r === ii ? r = Z : r === ei || r === ti ? r = _e : (r = Z, a = void 0);
    const g = r === Z && t[o + 1].startsWith("/>") ? " " : "";
    n += r === _e ? l + Ns : d >= 0 ? (s.push(c), l.slice(0, d) + yi + l.slice(d) + J + g) : l + J + (d === -2 ? o : g);
  }
  return [$i(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
}, yt = class ki {
  constructor({ strings: e, _$litType$: i }, s) {
    let a;
    this.parts = [];
    let n = 0, r = 0;
    const o = e.length - 1, l = this.parts, [c, p] = Ts(e, i);
    if (this.el = ki.createElement(c, s), ee.currentNode = this.el.content, i === 2 || i === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (a = ee.nextNode()) !== null && l.length < o; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const d of a.getAttributeNames()) if (d.endsWith(yi)) {
          const h = p[r++], g = a.getAttribute(d).split(J), v = /([.?@])?(.*)/.exec(h);
          l.push({
            type: 1,
            index: n,
            name: v[2],
            strings: g,
            ctor: v[1] === "." ? Cs : v[1] === "?" ? Ls : v[1] === "@" ? Ds : it
          }), a.removeAttribute(d);
        } else d.startsWith(J) && (l.push({
          type: 6,
          index: n
        }), a.removeAttribute(d));
        if (wi.test(a.tagName)) {
          const d = a.textContent.split(J), h = d.length - 1;
          if (h > 0) {
            a.textContent = Je ? Je.emptyScript : "";
            for (let g = 0; g < h; g++) a.append(d[g], Ie()), ee.nextNode(), l.push({
              type: 2,
              index: ++n
            });
            a.append(d[h], Ie());
          }
        }
      } else if (a.nodeType === 8) if (a.data === bi) l.push({
        type: 2,
        index: n
      });
      else {
        let d = -1;
        for (; (d = a.data.indexOf(J, d + 1)) !== -1; ) l.push({
          type: 7,
          index: n
        }), d += J.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const s = se.createElement("template");
    return s.innerHTML = e, s;
  }
};
function fe(t, e, i = t, s) {
  if (e === ue) return e;
  let a = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const n = Ce(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== n && (a?._$AO?.(!1), n === void 0 ? a = void 0 : (a = new n(t), a._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = a : i._$Cl = a), a !== void 0 && (e = fe(t, a._$AS(t, e.values), a, s)), e;
}
var Is = class {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? se).importNode(e, !0);
    ee.currentNode = s;
    let a = ee.nextNode(), n = 0, r = 0, o = i[0];
    for (; o !== void 0; ) {
      if (n === o.index) {
        let l;
        o.type === 2 ? l = new Tt(a, a.nextSibling, this, t) : o.type === 1 ? l = new o.ctor(a, o.name, o.strings, this, t) : o.type === 6 && (l = new Ps(a, this, t)), this._$AV.push(l), o = i[++r];
      }
      n !== o?.index && (a = ee.nextNode(), n++);
    }
    return ee.currentNode = se, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}, Tt = class xi {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, s, a) {
    this.type = 2, this._$AH = x, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = a, this._$Cv = a?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = fe(this, e, i), Ce(e) ? e === x || e == null || e === "" ? (this._$AH !== x && this._$AR(), this._$AH = x) : e !== this._$AH && e !== ue && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Os(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== x && Ce(this._$AH) ? this._$AA.nextSibling.data = e : this.T(se.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, a = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = yt.createElement($i(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === a) this._$AH.p(i);
    else {
      const n = new Is(a, this), r = n.u(this.options);
      n.p(i), this.T(r), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = ai.get(e.strings);
    return i === void 0 && ai.set(e.strings, i = new yt(e)), i;
  }
  k(e) {
    Nt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, a = 0;
    for (const n of e) a === i.length ? i.push(s = new xi(this.O(Ie()), this.O(Ie()), this, this.options)) : s = i[a], s._$AI(n), a++;
    a < i.length && (this._$AR(s && s._$AB.nextSibling, a), i.length = a);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const s = Xt(e).nextSibling;
      Xt(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}, it = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, a) {
    this.type = 1, this._$AH = x, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(/* @__PURE__ */ new String()), this.strings = i) : this._$AH = x;
  }
  _$AI(t, e = this, i, s) {
    const a = this.strings;
    let n = !1;
    if (a === void 0) t = fe(this, t, e, 0), n = !Ce(t) || t !== this._$AH && t !== ue, n && (this._$AH = t);
    else {
      const r = t;
      let o, l;
      for (t = a[0], o = 0; o < a.length - 1; o++) l = fe(this, r[i + o], e, o), l === ue && (l = this._$AH[o]), n ||= !Ce(l) || l !== this._$AH[o], l === x ? t = x : t !== x && (t += (l ?? "") + a[o + 1]), this._$AH[o] = l;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === x ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}, Cs = class extends it {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === x ? void 0 : t;
  }
}, Ls = class extends it {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== x);
  }
}, Ds = class extends it {
  constructor(t, e, i, s, a) {
    super(t, e, i, s, a), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = fe(this, t, e, 0) ?? x) === ue) return;
    const i = this._$AH, s = t === x && i !== x || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== x && (i === x || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}, Ps = class {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    fe(this, t);
  }
}, Ms = Et.litHtmlPolyfillSupport;
Ms?.(yt, Tt), (Et.litHtmlVersions ??= []).push("3.3.3");
var Rs = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let a = s._$litPart$;
  if (a === void 0) {
    const n = i?.renderBefore ?? null;
    s._$litPart$ = a = new Tt(e.insertBefore(Ie(), n), n, void 0, i ?? {});
  }
  return a._$AI(t), a;
}, It = globalThis, Oe = class extends oe {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Rs(e, this.renderRoot, this.renderOptions);
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
};
Oe._$litElement$ = !0, Oe.finalized = !0, It.litElementHydrateSupport?.({ LitElement: Oe });
var Bs = It.litElementPolyfillSupport;
Bs?.({ LitElement: Oe });
(It.litElementVersions ??= []).push("4.2.2");
var js = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
}, Us = {
  attribute: !0,
  type: String,
  converter: Qe,
  reflect: !1,
  hasChanged: At
}, Ks = (t = Us, e, i) => {
  const { kind: s, metadata: a } = i;
  let n = globalThis.litPropertyMetadata.get(a);
  if (n === void 0 && globalThis.litPropertyMetadata.set(a, n = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(i.name, t), s === "accessor") {
    const { name: r } = i;
    return {
      set(o) {
        const l = e.get.call(this);
        e.set.call(this, o), this.requestUpdate(r, l, t, !0, o);
      },
      init(o) {
        return o !== void 0 && this.C(r, void 0, t, o), o;
      }
    };
  }
  if (s === "setter") {
    const { name: r } = i;
    return function(o) {
      const l = this[r];
      e.call(this, o), this.requestUpdate(r, l, t, !0, o);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Ct(t) {
  return (e, i) => typeof i == "object" ? Ks(t, e, i) : ((s, a, n) => {
    const r = a.hasOwnProperty(n);
    return a.constructor.createProperty(n, s), r ? Object.getOwnPropertyDescriptor(a, n) : void 0;
  })(t, e, i);
}
function w(t) {
  return Ct({
    ...t,
    state: !0,
    attribute: !1
  });
}
var Lt = /* @__PURE__ */ Symbol.for("yaml.alias"), bt = /* @__PURE__ */ Symbol.for("yaml.document"), X = /* @__PURE__ */ Symbol.for("yaml.map"), _i = /* @__PURE__ */ Symbol.for("yaml.pair"), Y = /* @__PURE__ */ Symbol.for("yaml.scalar"), ye = /* @__PURE__ */ Symbol.for("yaml.seq"), K = /* @__PURE__ */ Symbol.for("yaml.node.type"), be = (t) => !!t && typeof t == "object" && t[K] === Lt, Pe = (t) => !!t && typeof t == "object" && t[K] === bt, Me = (t) => !!t && typeof t == "object" && t[K] === X, C = (t) => !!t && typeof t == "object" && t[K] === _i, I = (t) => !!t && typeof t == "object" && t[K] === Y, Re = (t) => !!t && typeof t == "object" && t[K] === ye;
function L(t) {
  if (t && typeof t == "object") switch (t[K]) {
    case X:
    case ye:
      return !0;
  }
  return !1;
}
function D(t) {
  if (t && typeof t == "object") switch (t[K]) {
    case Lt:
    case X:
    case Y:
    case ye:
      return !0;
  }
  return !1;
}
var Si = (t) => (I(t) || L(t)) && !!t.anchor, M = /* @__PURE__ */ Symbol("break visit"), Ai = /* @__PURE__ */ Symbol("skip children"), F = /* @__PURE__ */ Symbol("remove node");
function we(t, e) {
  const i = Ei(e);
  Pe(t) ? le(null, t.contents, i, Object.freeze([t])) === F && (t.contents = null) : le(null, t, i, Object.freeze([]));
}
we.BREAK = M;
we.SKIP = Ai;
we.REMOVE = F;
function le(t, e, i, s) {
  const a = Ni(t, e, i, s);
  if (D(a) || C(a))
    return Oi(t, s, a), le(t, a, i, s);
  if (typeof a != "symbol") {
    if (L(e)) {
      s = Object.freeze(s.concat(e));
      for (let n = 0; n < e.items.length; ++n) {
        const r = le(n, e.items[n], i, s);
        if (typeof r == "number") n = r - 1;
        else {
          if (r === M) return M;
          r === F && (e.items.splice(n, 1), n -= 1);
        }
      }
    } else if (C(e)) {
      s = Object.freeze(s.concat(e));
      const n = le("key", e.key, i, s);
      if (n === M) return M;
      n === F && (e.key = null);
      const r = le("value", e.value, i, s);
      if (r === M) return M;
      r === F && (e.value = null);
    }
  }
  return a;
}
async function Dt(t, e) {
  const i = Ei(e);
  Pe(t) ? await ce(null, t.contents, i, Object.freeze([t])) === F && (t.contents = null) : await ce(null, t, i, Object.freeze([]));
}
Dt.BREAK = M;
Dt.SKIP = Ai;
Dt.REMOVE = F;
async function ce(t, e, i, s) {
  const a = await Ni(t, e, i, s);
  if (D(a) || C(a))
    return Oi(t, s, a), ce(t, a, i, s);
  if (typeof a != "symbol") {
    if (L(e)) {
      s = Object.freeze(s.concat(e));
      for (let n = 0; n < e.items.length; ++n) {
        const r = await ce(n, e.items[n], i, s);
        if (typeof r == "number") n = r - 1;
        else {
          if (r === M) return M;
          r === F && (e.items.splice(n, 1), n -= 1);
        }
      }
    } else if (C(e)) {
      s = Object.freeze(s.concat(e));
      const n = await ce("key", e.key, i, s);
      if (n === M) return M;
      n === F && (e.key = null);
      const r = await ce("value", e.value, i, s);
      if (r === M) return M;
      r === F && (e.value = null);
    }
  }
  return a;
}
function Ei(t) {
  return typeof t == "object" && (t.Collection || t.Node || t.Value) ? Object.assign({
    Alias: t.Node,
    Map: t.Node,
    Scalar: t.Node,
    Seq: t.Node
  }, t.Value && {
    Map: t.Value,
    Scalar: t.Value,
    Seq: t.Value
  }, t.Collection && {
    Map: t.Collection,
    Seq: t.Collection
  }, t) : t;
}
function Ni(t, e, i, s) {
  if (typeof i == "function") return i(t, e, s);
  if (Me(e)) return i.Map?.(t, e, s);
  if (Re(e)) return i.Seq?.(t, e, s);
  if (C(e)) return i.Pair?.(t, e, s);
  if (I(e)) return i.Scalar?.(t, e, s);
  if (be(e)) return i.Alias?.(t, e, s);
}
function Oi(t, e, i) {
  const s = e[e.length - 1];
  if (L(s)) s.items[t] = i;
  else if (C(s))
    t === "key" ? s.key = i : s.value = i;
  else if (Pe(s)) s.contents = i;
  else {
    const a = be(s) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${a} parent`);
  }
}
var zs = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
}, qs = (t) => t.replace(/[!,[\]{}]/g, (e) => zs[e]), pe = class V {
  constructor(e, i) {
    this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, V.defaultYaml, e), this.tags = Object.assign({}, V.defaultTags, i);
  }
  clone() {
    const e = new V(this.yaml, this.tags);
    return e.docStart = this.docStart, e;
  }
  atDocument() {
    const e = new V(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = !0;
        break;
      case "1.2":
        this.atNextDocument = !1, this.yaml = {
          explicit: V.defaultYaml.explicit,
          version: "1.2"
        }, this.tags = Object.assign({}, V.defaultTags);
    }
    return e;
  }
  add(e, i) {
    this.atNextDocument && (this.yaml = {
      explicit: V.defaultYaml.explicit,
      version: "1.1"
    }, this.tags = Object.assign({}, V.defaultTags), this.atNextDocument = !1);
    const s = e.trim().split(/[ \t]+/), a = s.shift();
    switch (a) {
      case "%TAG": {
        if (s.length !== 2 && (i(0, "%TAG directive should contain exactly two parts"), s.length < 2))
          return !1;
        const [n, r] = s;
        return this.tags[n] = r, !0;
      }
      case "%YAML": {
        if (this.yaml.explicit = !0, s.length !== 1)
          return i(0, "%YAML directive should contain exactly one part"), !1;
        const [n] = s;
        if (n === "1.1" || n === "1.2")
          return this.yaml.version = n, !0;
        {
          const r = /^\d+\.\d+$/.test(n);
          return i(6, `Unsupported YAML version ${n}`, r), !1;
        }
      }
      default:
        return i(0, `Unknown directive ${a}`, !0), !1;
    }
  }
  tagName(e, i) {
    if (e === "!") return "!";
    if (e[0] !== "!")
      return i(`Not a valid tag: ${e}`), null;
    if (e[1] === "<") {
      const r = e.slice(2, -1);
      return r === "!" || r === "!!" ? (i(`Verbatim tags aren't resolved, so ${e} is invalid.`), null) : (e[e.length - 1] !== ">" && i("Verbatim tags must end with a >"), r);
    }
    const [, s, a] = e.match(/^(.*!)([^!]*)$/s);
    a || i(`The ${e} tag has no suffix`);
    const n = this.tags[s];
    if (n) try {
      return n + decodeURIComponent(a);
    } catch (r) {
      return i(String(r)), null;
    }
    return s === "!" ? e : (i(`Could not resolve tag: ${e}`), null);
  }
  tagString(e) {
    for (const [i, s] of Object.entries(this.tags)) if (e.startsWith(s)) return i + qs(e.substring(s.length));
    return e[0] === "!" ? e : `!<${e}>`;
  }
  toString(e) {
    const i = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], s = Object.entries(this.tags);
    let a;
    if (e && s.length > 0 && D(e.contents)) {
      const n = {};
      we(e.contents, (r, o) => {
        D(o) && o.tag && (n[o.tag] = !0);
      }), a = Object.keys(n);
    } else a = [];
    for (const [n, r] of s)
      n === "!!" && r === "tag:yaml.org,2002:" || (!e || a.some((o) => o.startsWith(r))) && i.push(`%TAG ${n} ${r}`);
    return i.join(`
`);
  }
};
pe.defaultYaml = {
  explicit: !1,
  version: "1.2"
};
pe.defaultTags = { "!!": "tag:yaml.org,2002:" };
function Ti(t) {
  if (/[\x00-\x19\s,[\]{}]/.test(t)) {
    const e = `Anchor must not contain whitespace or control characters: ${JSON.stringify(t)}`;
    throw new Error(e);
  }
  return !0;
}
function Ii(t) {
  const e = /* @__PURE__ */ new Set();
  return we(t, { Value(i, s) {
    s.anchor && e.add(s.anchor);
  } }), e;
}
function Ci(t, e) {
  for (let i = 1; ; ++i) {
    const s = `${t}${i}`;
    if (!e.has(s)) return s;
  }
}
function Hs(t, e) {
  const i = [], s = /* @__PURE__ */ new Map();
  let a = null;
  return {
    onAnchor: (n) => {
      i.push(n), a ?? (a = Ii(t));
      const r = Ci(e, a);
      return a.add(r), r;
    },
    setAnchors: () => {
      for (const n of i) {
        const r = s.get(n);
        if (typeof r == "object" && r.anchor && (I(r.node) || L(r.node))) r.node.anchor = r.anchor;
        else {
          const o = /* @__PURE__ */ new Error("Failed to resolve repeated object (this should not happen)");
          throw o.source = n, o;
        }
      }
    },
    sourceObjects: s
  };
}
function de(t, e, i, s) {
  if (s && typeof s == "object")
    if (Array.isArray(s)) for (let a = 0, n = s.length; a < n; ++a) {
      const r = s[a], o = de(t, s, String(a), r);
      o === void 0 ? delete s[a] : o !== r && (s[a] = o);
    }
    else if (s instanceof Map) for (const a of Array.from(s.keys())) {
      const n = s.get(a), r = de(t, s, a, n);
      r === void 0 ? s.delete(a) : r !== n && s.set(a, r);
    }
    else if (s instanceof Set) for (const a of Array.from(s)) {
      const n = de(t, s, a, a);
      n === void 0 ? s.delete(a) : n !== a && (s.delete(a), s.add(n));
    }
    else for (const [a, n] of Object.entries(s)) {
      const r = de(t, s, a, n);
      r === void 0 ? delete s[a] : r !== n && (s[a] = r);
    }
  return t.call(e, i, s);
}
function U(t, e, i) {
  if (Array.isArray(t)) return t.map((s, a) => U(s, String(a), i));
  if (t && typeof t.toJSON == "function") {
    if (!i || !Si(t)) return t.toJSON(e, i);
    const s = {
      aliasCount: 0,
      count: 1,
      res: void 0
    };
    i.anchors.set(t, s), i.onCreate = (n) => {
      s.res = n, delete i.onCreate;
    };
    const a = t.toJSON(e, i);
    return i.onCreate && i.onCreate(a), a;
  }
  return typeof t == "bigint" && !i?.keep ? Number(t) : t;
}
var Pt = class {
  constructor(t) {
    Object.defineProperty(this, K, { value: t });
  }
  clone() {
    const t = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return this.range && (t.range = this.range.slice()), t;
  }
  toJS(t, { mapAsMap: e, maxAliasCount: i, onAnchor: s, reviver: a } = {}) {
    if (!Pe(t)) throw new TypeError("A document argument is required");
    const n = {
      anchors: /* @__PURE__ */ new Map(),
      doc: t,
      keep: !0,
      mapAsMap: e === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof i == "number" ? i : 100
    }, r = U(this, "", n);
    if (typeof s == "function") for (const { count: o, res: l } of n.anchors.values()) s(l, o);
    return typeof a == "function" ? de(a, { "": r }, "", r) : r;
  }
}, Mt = class extends Pt {
  constructor(t) {
    super(Lt), this.source = t, Object.defineProperty(this, "tag", { set() {
      throw new Error("Alias nodes cannot have tags");
    } });
  }
  resolve(t, e) {
    if (e?.maxAliasCount === 0) throw new ReferenceError("Alias resolution is disabled");
    let i;
    e?.aliasResolveCache ? i = e.aliasResolveCache : (i = [], we(t, { Node: (a, n) => {
      (be(n) || Si(n)) && i.push(n);
    } }), e && (e.aliasResolveCache = i));
    let s;
    for (const a of i) {
      if (a === this) break;
      a.anchor === this.source && (s = a);
    }
    if (s && e) {
      const { anchors: a, doc: n, maxAliasCount: r } = e;
      let o = a.get(s);
      if (o || (U(s, null, e), o = a.get(s)), o?.res === void 0) throw new ReferenceError("This should not happen: Alias anchor was not resolved?");
      if (r >= 0 && (o.count += 1, o.aliasCount === 0 && (o.aliasCount = Ye(n, s, a)), o.count * o.aliasCount > r))
        throw new ReferenceError("Excessive alias count indicates a resource exhaustion attack");
    }
    return s;
  }
  toJSON(t, e) {
    if (!e) return { source: this.source };
    const i = this.resolve(e.doc, e);
    if (!i) {
      const s = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(s);
    }
    return e.anchors.get(i).res;
  }
  toString(t, e, i) {
    const s = `*${this.source}`;
    if (t) {
      if (Ti(this.source), t.options.verifyAliasOrder && !t.anchors.has(this.source)) {
        const a = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(a);
      }
      if (t.implicitKey) return `${s} `;
    }
    return s;
  }
};
function Ye(t, e, i) {
  if (be(e)) {
    const s = e.resolve(t), a = i && s && i.get(s);
    return a ? a.count * a.aliasCount : 0;
  } else if (L(e)) {
    let s = 0;
    for (const a of e.items) {
      const n = Ye(t, a, i);
      n > s && (s = n);
    }
    return s;
  } else if (C(e)) {
    const s = Ye(t, e.key, i), a = Ye(t, e.value, i);
    return Math.max(s, a);
  }
  return 1;
}
var Li = (t) => !t || typeof t != "function" && typeof t != "object", N = class extends Pt {
  constructor(t) {
    super(Y), this.value = t;
  }
  toJSON(t, e) {
    return e?.keep ? this.value : U(this.value, t, e);
  }
  toString() {
    return String(this.value);
  }
};
N.BLOCK_FOLDED = "BLOCK_FOLDED";
N.BLOCK_LITERAL = "BLOCK_LITERAL";
N.PLAIN = "PLAIN";
N.QUOTE_DOUBLE = "QUOTE_DOUBLE";
N.QUOTE_SINGLE = "QUOTE_SINGLE";
var Fs = "tag:yaml.org,2002:";
function Ys(t, e, i) {
  if (e) {
    const s = i.filter((n) => n.tag === e), a = s.find((n) => !n.format) ?? s[0];
    if (!a) throw new Error(`Tag ${e} not found`);
    return a;
  }
  return i.find((s) => s.identify?.(t) && !s.format);
}
function Le(t, e, i) {
  if (Pe(t) && (t = t.contents), D(t)) return t;
  if (C(t)) {
    const d = i.schema[X].createNode?.(i.schema, null, i);
    return d.items.push(t), d;
  }
  (t instanceof String || t instanceof Number || t instanceof Boolean || typeof BigInt < "u" && t instanceof BigInt) && (t = t.valueOf());
  const { aliasDuplicateObjects: s, onAnchor: a, onTagObj: n, schema: r, sourceObjects: o } = i;
  let l;
  if (s && t && typeof t == "object") {
    if (l = o.get(t), l)
      return l.anchor ?? (l.anchor = a(t)), new Mt(l.anchor);
    l = {
      anchor: null,
      node: null
    }, o.set(t, l);
  }
  e?.startsWith("!!") && (e = Fs + e.slice(2));
  let c = Ys(t, e, r.tags);
  if (!c) {
    if (t && typeof t.toJSON == "function" && (t = t.toJSON()), !t || typeof t != "object") {
      const d = new N(t);
      return l && (l.node = d), d;
    }
    c = t instanceof Map ? r[X] : Symbol.iterator in Object(t) ? r[ye] : r[X];
  }
  n && (n(c), delete i.onTagObj);
  const p = c?.createNode ? c.createNode(i.schema, t, i) : typeof c?.nodeClass?.from == "function" ? c.nodeClass.from(i.schema, t, i) : new N(t);
  return e ? p.tag = e : c.default || (p.tag = c.tag), l && (l.node = p), p;
}
function Xe(t, e, i) {
  let s = i;
  for (let a = e.length - 1; a >= 0; --a) {
    const n = e[a];
    if (typeof n == "number" && Number.isInteger(n) && n >= 0) {
      const r = [];
      r[n] = s, s = r;
    } else s = /* @__PURE__ */ new Map([[n, s]]);
  }
  return Le(s, void 0, {
    aliasDuplicateObjects: !1,
    keepUndefined: !1,
    onAnchor: () => {
      throw new Error("This should not happen, please report a bug.");
    },
    schema: t,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
var Ae = (t) => t == null || typeof t == "object" && !!t[Symbol.iterator]().next().done, Di = class extends Pt {
  constructor(t, e) {
    super(t), Object.defineProperty(this, "schema", {
      value: e,
      configurable: !0,
      enumerable: !1,
      writable: !0
    });
  }
  clone(t) {
    const e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    return t && (e.schema = t), e.items = e.items.map((i) => D(i) || C(i) ? i.clone(t) : i), this.range && (e.range = this.range.slice()), e;
  }
  addIn(t, e) {
    if (Ae(t)) this.add(e);
    else {
      const [i, ...s] = t, a = this.get(i, !0);
      if (L(a)) a.addIn(s, e);
      else if (a === void 0 && this.schema) this.set(i, Xe(this.schema, s, e));
      else throw new Error(`Expected YAML collection at ${i}. Remaining path: ${s}`);
    }
  }
  deleteIn(t) {
    const [e, ...i] = t;
    if (i.length === 0) return this.delete(e);
    const s = this.get(e, !0);
    if (L(s)) return s.deleteIn(i);
    throw new Error(`Expected YAML collection at ${e}. Remaining path: ${i}`);
  }
  getIn(t, e) {
    const [i, ...s] = t, a = this.get(i, !0);
    return s.length === 0 ? !e && I(a) ? a.value : a : L(a) ? a.getIn(s, e) : void 0;
  }
  hasAllNullValues(t) {
    return this.items.every((e) => {
      if (!C(e)) return !1;
      const i = e.value;
      return i == null || t && I(i) && i.value == null && !i.commentBefore && !i.comment && !i.tag;
    });
  }
  hasIn(t) {
    const [e, ...i] = t;
    if (i.length === 0) return this.has(e);
    const s = this.get(e, !0);
    return L(s) ? s.hasIn(i) : !1;
  }
  setIn(t, e) {
    const [i, ...s] = t;
    if (s.length === 0) this.set(i, e);
    else {
      const a = this.get(i, !0);
      if (L(a)) a.setIn(s, e);
      else if (a === void 0 && this.schema) this.set(i, Xe(this.schema, s, e));
      else throw new Error(`Expected YAML collection at ${i}. Remaining path: ${s}`);
    }
  }
}, Vs = (t) => t.replace(/^(?!$)(?: $)?/gm, "#");
function W(t, e) {
  return /^\n+$/.test(t) ? t.substring(1) : e ? t.replace(/^(?! *$)/gm, e) : t;
}
var te = (t, e, i) => t.endsWith(`
`) ? W(i, e) : i.includes(`
`) ? `
` + W(i, e) : (t.endsWith(" ") ? "" : " ") + i, Pi = "flow", Ws = "block", Gs = "quoted";
function st(t, e, i = "flow", { indentAtStart: s, lineWidth: a = 80, minContentWidth: n = 20, onFold: r, onOverflow: o } = {}) {
  if (!a || a < 0) return t;
  a < n && (n = 0);
  const l = Math.max(1 + n, 1 + a - e.length);
  if (t.length <= l) return t;
  const c = [], p = {};
  let d = a - e.length;
  typeof s == "number" && (s > a - Math.max(2, n) ? c.push(0) : d = a - s);
  let h, g, v = !1, u = -1, m = -1, $ = -1;
  i === "block" && (u = ni(t, u, e.length), u !== -1 && (d = u + l));
  for (let _; _ = t[u += 1]; ) {
    if (i === "quoted" && _ === "\\") {
      switch (m = u, t[u + 1]) {
        case "x":
          u += 3;
          break;
        case "u":
          u += 5;
          break;
        case "U":
          u += 9;
          break;
        default:
          u += 1;
      }
      $ = u;
    }
    if (_ === `
`)
      i === "block" && (u = ni(t, u, e.length)), d = u + e.length + l, h = void 0;
    else {
      if (_ === " " && g && g !== " " && g !== `
` && g !== "	") {
        const A = t[u + 1];
        A && A !== " " && A !== `
` && A !== "	" && (h = u);
      }
      if (u >= d)
        if (h)
          c.push(h), d = h + l, h = void 0;
        else if (i === "quoted") {
          for (; g === " " || g === "	"; )
            g = _, _ = t[u += 1], v = !0;
          const A = u > $ + 1 ? u - 2 : m - 1;
          if (p[A]) return t;
          c.push(A), p[A] = !0, d = A + l, h = void 0;
        } else v = !0;
    }
    g = _;
  }
  if (v && o && o(), c.length === 0) return t;
  r && r();
  let k = t.slice(0, c[0]);
  for (let _ = 0; _ < c.length; ++_) {
    const A = c[_], E = c[_ + 1] || t.length;
    A === 0 ? k = `
${e}${t.slice(0, E)}` : (i === "quoted" && p[A] && (k += `${t[A]}\\`), k += `
${e}${t.slice(A + 1, E)}`);
  }
  return k;
}
function ni(t, e, i) {
  let s = e, a = e + 1, n = t[a];
  for (; n === " " || n === "	"; ) if (e < a + i) n = t[++e];
  else {
    do
      n = t[++e];
    while (n && n !== `
`);
    s = e, a = e + 1, n = t[a];
  }
  return s;
}
var at = (t, e) => ({
  indentAtStart: e ? t.indent.length : t.indentAtStart,
  lineWidth: t.options.lineWidth,
  minContentWidth: t.options.minContentWidth
}), nt = (t) => /^(%|---|\.\.\.)/m.test(t);
function Qs(t, e, i) {
  if (!e || e < 0) return !1;
  const s = e - i, a = t.length;
  if (a <= s) return !1;
  for (let n = 0, r = 0; n < a; ++n) if (t[n] === `
`) {
    if (n - r > s) return !0;
    if (r = n + 1, a - r <= s) return !1;
  }
  return !0;
}
function Te(t, e) {
  const i = JSON.stringify(t);
  if (e.options.doubleQuotedAsJSON) return i;
  const { implicitKey: s } = e, a = e.options.doubleQuotedMinMultiLineLength, n = e.indent || (nt(t) ? "  " : "");
  let r = "", o = 0;
  for (let l = 0, c = i[l]; c; c = i[++l])
    if (c === " " && i[l + 1] === "\\" && i[l + 2] === "n" && (r += i.slice(o, l) + "\\ ", l += 1, o = l, c = "\\"), c === "\\") switch (i[l + 1]) {
      case "u":
        {
          r += i.slice(o, l);
          const p = i.substr(l + 2, 4);
          switch (p) {
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
              p.substr(0, 2) === "00" ? r += "\\x" + p.substr(2) : r += i.substr(l, 6);
          }
          l += 5, o = l + 1;
        }
        break;
      case "n":
        if (s || i[l + 2] === '"' || i.length < a) l += 1;
        else {
          for (r += i.slice(o, l) + `

`; i[l + 2] === "\\" && i[l + 3] === "n" && i[l + 4] !== '"'; )
            r += `
`, l += 2;
          r += n, i[l + 2] === " " && (r += "\\"), l += 1, o = l + 1;
        }
        break;
      default:
        l += 1;
    }
  return r = o ? r + i.slice(o) : i, s ? r : st(r, n, Gs, at(e, !1));
}
function wt(t, e) {
  if (e.options.singleQuote === !1 || e.implicitKey && t.includes(`
`) || /[ \t]\n|\n[ \t]/.test(t)) return Te(t, e);
  const i = e.indent || (nt(t) ? "  " : ""), s = "'" + t.replace(/'/g, "''").replace(/\n+/g, `$&
${i}`) + "'";
  return e.implicitKey ? s : st(s, i, Pi, at(e, !1));
}
function he(t, e) {
  const { singleQuote: i } = e.options;
  let s;
  if (i === !1) s = Te;
  else {
    const a = t.includes('"'), n = t.includes("'");
    a && !n ? s = wt : n && !a ? s = Te : s = i ? wt : Te;
  }
  return s(t, e);
}
var $t;
try {
  $t = /* @__PURE__ */ new RegExp(`(^|(?<!
))
+(?!
|$)`, "g");
} catch {
  $t = /\n+(?!\n|$)/g;
}
function Ve({ comment: t, type: e, value: i }, s, a, n) {
  const { blockQuote: r, commentString: o, lineWidth: l } = s.options;
  if (!r || /\n[\t ]+$/.test(i)) return he(i, s);
  const c = s.indent || (s.forceBlockIndent || nt(i) ? "  " : ""), p = r === "literal" ? !0 : r === "folded" || e === N.BLOCK_FOLDED ? !1 : e === N.BLOCK_LITERAL ? !0 : !Qs(i, l, c.length);
  if (!i) return p ? `|
` : `>
`;
  let d, h;
  for (h = i.length; h > 0; --h) {
    const A = i[h - 1];
    if (A !== `
` && A !== "	" && A !== " ") break;
  }
  let g = i.substring(h);
  const v = g.indexOf(`
`);
  v === -1 ? d = "-" : i === g || v !== g.length - 1 ? (d = "+", n && n()) : d = "", g && (i = i.slice(0, -g.length), g[g.length - 1] === `
` && (g = g.slice(0, -1)), g = g.replace($t, `$&${c}`));
  let u = !1, m, $ = -1;
  for (m = 0; m < i.length; ++m) {
    const A = i[m];
    if (A === " ") u = !0;
    else if (A === `
`) $ = m;
    else break;
  }
  let k = i.substring(0, $ < m ? $ + 1 : m);
  k && (i = i.substring(k.length), k = k.replace(/\n+/g, `$&${c}`));
  let _ = (u ? c ? "2" : "1" : "") + d;
  if (t && (_ += " " + o(t.replace(/ ?[\r\n]+/g, " ")), a && a()), !p) {
    const A = i.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${c}`);
    let E = !1;
    const T = at(s, !0);
    r !== "folded" && e !== N.BLOCK_FOLDED && (T.onOverflow = () => {
      E = !0;
    });
    const O = st(`${k}${A}${g}`, c, Ws, T);
    if (!E) return `>${_}
${c}${O}`;
  }
  return i = i.replace(/\n+/g, `$&${c}`), `|${_}
${c}${k}${i}${g}`;
}
function Js(t, e, i, s) {
  const { type: a, value: n } = t, { actualString: r, implicitKey: o, indent: l, indentStep: c, inFlow: p } = e;
  if (o && n.includes(`
`) || p && /[[\]{},]/.test(n)) return he(n, e);
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(n)) return o || p || !n.includes(`
`) ? he(n, e) : Ve(t, e, i, s);
  if (!o && !p && a !== N.PLAIN && n.includes(`
`)) return Ve(t, e, i, s);
  if (nt(n)) {
    if (l === "")
      return e.forceBlockIndent = !0, Ve(t, e, i, s);
    if (o && l === c) return he(n, e);
  }
  const d = n.replace(/\n+/g, `$&
${l}`);
  if (r) {
    const h = (u) => u.default && u.tag !== "tag:yaml.org,2002:str" && u.test?.test(d), { compat: g, tags: v } = e.doc.schema;
    if (v.some(h) || g?.some(h)) return he(n, e);
  }
  return o ? d : st(d, l, Pi, at(e, !1));
}
function Rt(t, e, i, s) {
  const { implicitKey: a, inFlow: n } = e, r = typeof t.value == "string" ? t : Object.assign({}, t, { value: String(t.value) });
  let { type: o } = t;
  o !== N.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(r.value) && (o = N.QUOTE_DOUBLE);
  const l = (p) => {
    switch (p) {
      case N.BLOCK_FOLDED:
      case N.BLOCK_LITERAL:
        return a || n ? he(r.value, e) : Ve(r, e, i, s);
      case N.QUOTE_DOUBLE:
        return Te(r.value, e);
      case N.QUOTE_SINGLE:
        return wt(r.value, e);
      case N.PLAIN:
        return Js(r, e, i, s);
      default:
        return null;
    }
  };
  let c = l(o);
  if (c === null) {
    const { defaultKeyType: p, defaultStringType: d } = e.options, h = a && p || d;
    if (c = l(h), c === null) throw new Error(`Unsupported default string type ${h}`);
  }
  return c;
}
function Mi(t, e) {
  const i = Object.assign({
    blockQuote: !0,
    commentString: Vs,
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
  }, t.schema.toStringOptions, e);
  let s;
  switch (i.collectionStyle) {
    case "block":
      s = !1;
      break;
    case "flow":
      s = !0;
      break;
    default:
      s = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc: t,
    flowCollectionPadding: i.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof i.indent == "number" ? " ".repeat(i.indent) : "  ",
    inFlow: s,
    options: i
  };
}
function Xs(t, e) {
  if (e.tag) {
    const a = t.filter((n) => n.tag === e.tag);
    if (a.length > 0) return a.find((n) => n.format === e.format) ?? a[0];
  }
  let i, s;
  if (I(e)) {
    s = e.value;
    let a = t.filter((n) => n.identify?.(s));
    if (a.length > 1) {
      const n = a.filter((r) => r.test);
      n.length > 0 && (a = n);
    }
    i = a.find((n) => n.format === e.format) ?? a.find((n) => !n.format);
  } else
    s = e, i = t.find((a) => a.nodeClass && s instanceof a.nodeClass);
  if (!i) {
    const a = s?.constructor?.name ?? (s === null ? "null" : typeof s);
    throw new Error(`Tag not resolved for ${a} value`);
  }
  return i;
}
function Zs(t, e, { anchors: i, doc: s }) {
  if (!s.directives) return "";
  const a = [], n = (I(t) || L(t)) && t.anchor;
  n && Ti(n) && (i.add(n), a.push(`&${n}`));
  const r = t.tag ?? (e.default ? null : e.tag);
  return r && a.push(s.directives.tagString(r)), a.join(" ");
}
function ge(t, e, i, s) {
  if (C(t)) return t.toString(e, i, s);
  if (be(t)) {
    if (e.doc.directives) return t.toString(e);
    if (e.resolvedAliases?.has(t)) throw new TypeError("Cannot stringify circular structure without alias nodes");
    e.resolvedAliases ? e.resolvedAliases.add(t) : e.resolvedAliases = /* @__PURE__ */ new Set([t]), t = t.resolve(e.doc);
  }
  let a;
  const n = D(t) ? t : e.doc.createNode(t, { onTagObj: (l) => a = l });
  a ?? (a = Xs(e.doc.schema.tags, n));
  const r = Zs(n, a, e);
  r.length > 0 && (e.indentAtStart = (e.indentAtStart ?? 0) + r.length + 1);
  const o = typeof a.stringify == "function" ? a.stringify(n, e, i, s) : I(n) ? Rt(n, e, i, s) : n.toString(e, i, s);
  return r ? I(n) || o[0] === "{" || o[0] === "[" ? `${r} ${o}` : `${r}
${e.indent}${o}` : o;
}
function ea({ key: t, value: e }, i, s, a) {
  const { allNullValues: n, doc: r, indent: o, indentStep: l, options: { commentString: c, indentSeq: p, simpleKeys: d } } = i;
  let h = D(t) && t.comment || null;
  if (d) {
    if (h) throw new Error("With simple keys, key nodes cannot have comments");
    if (L(t) || !D(t) && typeof t == "object") throw new Error("With simple keys, collection cannot be used as a key value");
  }
  let g = !d && (!t || h && e == null && !i.inFlow || L(t) || (I(t) ? t.type === N.BLOCK_FOLDED || t.type === N.BLOCK_LITERAL : typeof t == "object"));
  i = Object.assign({}, i, {
    allNullValues: !1,
    implicitKey: !g && (d || !n),
    indent: o + l
  });
  let v = !1, u = !1, m = ge(t, i, () => v = !0, () => u = !0);
  if (!g && !i.inFlow && m.length > 1024) {
    if (d) throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    g = !0;
  }
  if (i.inFlow) {
    if (n || e == null)
      return v && s && s(), m === "" ? "?" : g ? `? ${m}` : m;
  } else if (n && !d || e == null && g)
    return m = `? ${m}`, h && !v ? m += te(m, i.indent, c(h)) : u && a && a(), m;
  v && (h = null), g ? (h && (m += te(m, i.indent, c(h))), m = `? ${m}
${o}:`) : (m = `${m}:`, h && (m += te(m, i.indent, c(h))));
  let $, k, _;
  D(e) ? ($ = !!e.spaceBefore, k = e.commentBefore, _ = e.comment) : ($ = !1, k = null, _ = null, e && typeof e == "object" && (e = r.createNode(e))), i.implicitKey = !1, !g && !h && I(e) && (i.indentAtStart = m.length + 1), u = !1, !p && l.length >= 2 && !i.inFlow && !g && Re(e) && !e.flow && !e.tag && !e.anchor && (i.indent = i.indent.substring(2));
  let A = !1;
  const E = ge(e, i, () => A = !0, () => u = !0);
  let T = " ";
  if (h || $ || k) {
    if (T = $ ? `
` : "", k) {
      const O = c(k);
      T += `
${W(O, i.indent)}`;
    }
    E === "" && !i.inFlow ? T === `
` && _ && (T = `

`) : T += `
${i.indent}`;
  } else if (!g && L(e)) {
    const O = E[0], S = E.indexOf(`
`), B = S !== -1, xe = i.inFlow ?? e.flow ?? e.items.length === 0;
    if (B || !xe) {
      let P = !1;
      if (B && (O === "&" || O === "!")) {
        let H = E.indexOf(" ");
        O === "&" && H !== -1 && H < S && E[H + 1] === "!" && (H = E.indexOf(" ", H + 1)), (H === -1 || S < H) && (P = !0);
      }
      P || (T = `
${i.indent}`);
    }
  } else (E === "" || E[0] === `
`) && (T = "");
  return m += T + E, i.inFlow ? A && s && s() : _ && !A ? m += te(m, i.indent, c(_)) : u && a && a(), m;
}
function Ri(t, e) {
  (t === "debug" || t === "warn") && console.warn(e);
}
var Ue = "<<", G = {
  identify: (t) => t === Ue || typeof t == "symbol" && t.description === Ue,
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: () => Object.assign(new N(Symbol(Ue)), { addToJSMap: Bi }),
  stringify: () => Ue
}, ta = (t, e) => (G.identify(e) || I(e) && (!e.type || e.type === N.PLAIN) && G.identify(e.value)) && t?.doc.schema.tags.some((i) => i.tag === G.tag && i.default);
function Bi(t, e, i) {
  const s = ji(t, i);
  if (Re(s)) for (const a of s.items) pt(t, e, a);
  else if (Array.isArray(s)) for (const a of s) pt(t, e, a);
  else pt(t, e, s);
}
function pt(t, e, i) {
  const s = ji(t, i);
  if (!Me(s)) throw new Error("Merge sources must be maps or map aliases");
  const a = s.toJSON(null, t, Map);
  for (const [n, r] of a) e instanceof Map ? e.has(n) || e.set(n, r) : e instanceof Set ? e.add(n) : Object.prototype.hasOwnProperty.call(e, n) || Object.defineProperty(e, n, {
    value: r,
    writable: !0,
    enumerable: !0,
    configurable: !0
  });
  return e;
}
function ji(t, e) {
  return t && be(e) ? e.resolve(t.doc, t) : e;
}
function Ui(t, e, { key: i, value: s }) {
  if (D(i) && i.addToJSMap) i.addToJSMap(t, e, s);
  else if (ta(t, i)) Bi(t, e, s);
  else {
    const a = U(i, "", t);
    if (e instanceof Map) e.set(a, U(s, a, t));
    else if (e instanceof Set) e.add(a);
    else {
      const n = ia(i, a, t), r = U(s, n, t);
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
function ia(t, e, i) {
  if (e === null) return "";
  if (typeof e != "object") return String(e);
  if (D(t) && i?.doc) {
    const s = Mi(i.doc, {});
    s.anchors = /* @__PURE__ */ new Set();
    for (const n of i.anchors.keys()) s.anchors.add(n.anchor);
    s.inFlow = !0, s.inStringifyKey = !0;
    const a = t.toString(s);
    if (!i.mapKeyWarned) {
      let n = JSON.stringify(a);
      n.length > 40 && (n = n.substring(0, 36) + '..."'), Ri(i.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${n}. Set mapAsMap: true to use object keys.`), i.mapKeyWarned = !0;
    }
    return a;
  }
  return JSON.stringify(e);
}
function Bt(t, e, i) {
  const s = Le(t, void 0, i), a = Le(e, void 0, i);
  return new R(s, a);
}
var R = class Ki {
  constructor(e, i = null) {
    Object.defineProperty(this, K, { value: _i }), this.key = e, this.value = i;
  }
  clone(e) {
    let { key: i, value: s } = this;
    return D(i) && (i = i.clone(e)), D(s) && (s = s.clone(e)), new Ki(i, s);
  }
  toJSON(e, i) {
    const s = i?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    return Ui(i, s, this);
  }
  toString(e, i, s) {
    return e?.doc ? ea(this, e, i, s) : JSON.stringify(this);
  }
};
function zi(t, e, i) {
  return (e.inFlow ?? t.flow ? aa : sa)(t, e, i);
}
function sa({ comment: t, items: e }, i, { blockItemPrefix: s, flowChars: a, itemIndent: n, onChompKeep: r, onComment: o }) {
  const { indent: l, options: { commentString: c } } = i, p = Object.assign({}, i, {
    indent: n,
    type: null
  });
  let d = !1;
  const h = [];
  for (let v = 0; v < e.length; ++v) {
    const u = e[v];
    let m = null;
    if (D(u))
      !d && u.spaceBefore && h.push(""), Ze(i, h, u.commentBefore, d), u.comment && (m = u.comment);
    else if (C(u)) {
      const k = D(u.key) ? u.key : null;
      k && (!d && k.spaceBefore && h.push(""), Ze(i, h, k.commentBefore, d));
    }
    d = !1;
    let $ = ge(u, p, () => m = null, () => d = !0);
    m && ($ += te($, n, c(m))), d && m && (d = !1), h.push(s + $);
  }
  let g;
  if (h.length === 0) g = a.start + a.end;
  else {
    g = h[0];
    for (let v = 1; v < h.length; ++v) {
      const u = h[v];
      g += u ? `
${l}${u}` : `
`;
    }
  }
  return t ? (g += `
` + W(c(t), l), o && o()) : d && r && r(), g;
}
function aa({ items: t }, e, { flowChars: i, itemIndent: s }) {
  const { indent: a, indentStep: n, flowCollectionPadding: r, options: { commentString: o } } = e;
  s += n;
  const l = Object.assign({}, e, {
    indent: s,
    inFlow: !0,
    type: null
  });
  let c = !1, p = 0;
  const d = [];
  for (let v = 0; v < t.length; ++v) {
    const u = t[v];
    let m = null;
    if (D(u))
      u.spaceBefore && d.push(""), Ze(e, d, u.commentBefore, !1), u.comment && (m = u.comment);
    else if (C(u)) {
      const k = D(u.key) ? u.key : null;
      k && (k.spaceBefore && d.push(""), Ze(e, d, k.commentBefore, !1), k.comment && (c = !0));
      const _ = D(u.value) ? u.value : null;
      _ ? (_.comment && (m = _.comment), _.commentBefore && (c = !0)) : u.value == null && k?.comment && (m = k.comment);
    }
    m && (c = !0);
    let $ = ge(u, l, () => m = null);
    c || (c = d.length > p || $.includes(`
`)), v < t.length - 1 ? $ += "," : e.options.trailingComma && (e.options.lineWidth > 0 && (c || (c = d.reduce((k, _) => k + _.length + 2, 2) + ($.length + 2) > e.options.lineWidth)), c && ($ += ",")), m && ($ += te($, s, o(m))), d.push($), p = d.length;
  }
  const { start: h, end: g } = i;
  if (d.length === 0) return h + g;
  if (!c) {
    const v = d.reduce((u, m) => u + m.length + 2, 2);
    c = e.options.lineWidth > 0 && v > e.options.lineWidth;
  }
  if (c) {
    let v = h;
    for (const u of d) v += u ? `
${n}${a}${u}` : `
`;
    return `${v}
${a}${g}`;
  } else return `${h}${r}${d.join(" ")}${r}${g}`;
}
function Ze({ indent: t, options: { commentString: e } }, i, s, a) {
  if (s && a && (s = s.replace(/^\n+/, "")), s) {
    const n = W(e(s), t);
    i.push(n.trimStart());
  }
}
function ie(t, e) {
  const i = I(e) ? e.value : e;
  for (const s of t) if (C(s) && (s.key === e || s.key === i || I(s.key) && s.key.value === i))
    return s;
}
var j = class extends Di {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(t) {
    super(X, t), this.items = [];
  }
  static from(t, e, i) {
    const { keepUndefined: s, replacer: a } = i, n = new this(t), r = (o, l) => {
      if (typeof a == "function") l = a.call(e, o, l);
      else if (Array.isArray(a) && !a.includes(o)) return;
      (l !== void 0 || s) && n.items.push(Bt(o, l, i));
    };
    if (e instanceof Map) for (const [o, l] of e) r(o, l);
    else if (e && typeof e == "object") for (const o of Object.keys(e)) r(o, e[o]);
    return typeof t.sortMapEntries == "function" && n.items.sort(t.sortMapEntries), n;
  }
  add(t, e) {
    let i;
    C(t) ? i = t : !t || typeof t != "object" || !("key" in t) ? i = new R(t, t?.value) : i = new R(t.key, t.value);
    const s = ie(this.items, i.key), a = this.schema?.sortMapEntries;
    if (s) {
      if (!e) throw new Error(`Key ${i.key} already set`);
      I(s.value) && Li(i.value) ? s.value.value = i.value : s.value = i.value;
    } else if (a) {
      const n = this.items.findIndex((r) => a(i, r) < 0);
      n === -1 ? this.items.push(i) : this.items.splice(n, 0, i);
    } else this.items.push(i);
  }
  delete(t) {
    const e = ie(this.items, t);
    return e ? this.items.splice(this.items.indexOf(e), 1).length > 0 : !1;
  }
  get(t, e) {
    const i = ie(this.items, t)?.value;
    return (!e && I(i) ? i.value : i) ?? void 0;
  }
  has(t) {
    return !!ie(this.items, t);
  }
  set(t, e) {
    this.add(new R(t, e), !0);
  }
  toJSON(t, e, i) {
    const s = i ? new i() : e?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    e?.onCreate && e.onCreate(s);
    for (const a of this.items) Ui(e, s, a);
    return s;
  }
  toString(t, e, i) {
    if (!t) return JSON.stringify(this);
    for (const s of this.items) if (!C(s)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(s)} instead`);
    return !t.allNullValues && this.hasAllNullValues(!1) && (t = Object.assign({}, t, { allNullValues: !0 })), zi(this, t, {
      blockItemPrefix: "",
      flowChars: {
        start: "{",
        end: "}"
      },
      itemIndent: t.indent || "",
      onChompKeep: i,
      onComment: e
    });
  }
}, $e = {
  collection: "map",
  default: !0,
  nodeClass: j,
  tag: "tag:yaml.org,2002:map",
  resolve(t, e) {
    return Me(t) || e("Expected a mapping for this tag"), t;
  },
  createNode: (t, e, i) => j.from(t, e, i)
}, ae = class extends Di {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(t) {
    super(ye, t), this.items = [];
  }
  add(t) {
    this.items.push(t);
  }
  delete(t) {
    const e = Ke(t);
    return typeof e != "number" ? !1 : this.items.splice(e, 1).length > 0;
  }
  get(t, e) {
    const i = Ke(t);
    if (typeof i != "number") return;
    const s = this.items[i];
    return !e && I(s) ? s.value : s;
  }
  has(t) {
    const e = Ke(t);
    return typeof e == "number" && e < this.items.length;
  }
  set(t, e) {
    const i = Ke(t);
    if (typeof i != "number") throw new Error(`Expected a valid index, not ${t}.`);
    const s = this.items[i];
    I(s) && Li(e) ? s.value = e : this.items[i] = e;
  }
  toJSON(t, e) {
    const i = [];
    e?.onCreate && e.onCreate(i);
    let s = 0;
    for (const a of this.items) i.push(U(a, String(s++), e));
    return i;
  }
  toString(t, e, i) {
    return t ? zi(this, t, {
      blockItemPrefix: "- ",
      flowChars: {
        start: "[",
        end: "]"
      },
      itemIndent: (t.indent || "") + "  ",
      onChompKeep: i,
      onComment: e
    }) : JSON.stringify(this);
  }
  static from(t, e, i) {
    const { replacer: s } = i, a = new this(t);
    if (e && Symbol.iterator in Object(e)) {
      let n = 0;
      for (let r of e) {
        if (typeof s == "function") {
          const o = e instanceof Set ? r : String(n++);
          r = s.call(e, o, r);
        }
        a.items.push(Le(r, void 0, i));
      }
    }
    return a;
  }
};
function Ke(t) {
  let e = I(t) ? t.value : t;
  return e && typeof e == "string" && (e = Number(e)), typeof e == "number" && Number.isInteger(e) && e >= 0 ? e : null;
}
var ke = {
  collection: "seq",
  default: !0,
  nodeClass: ae,
  tag: "tag:yaml.org,2002:seq",
  resolve(t, e) {
    return Re(t) || e("Expected a sequence for this tag"), t;
  },
  createNode: (t, e, i) => ae.from(t, e, i)
}, rt = {
  identify: (t) => typeof t == "string",
  default: !0,
  tag: "tag:yaml.org,2002:str",
  resolve: (t) => t,
  stringify(t, e, i, s) {
    return e = Object.assign({ actualString: !0 }, e), Rt(t, e, i, s);
  }
}, ot = {
  identify: (t) => t == null,
  createNode: () => new N(null),
  default: !0,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => new N(null),
  stringify: ({ source: t }, e) => typeof t == "string" && ot.test.test(t) ? t : e.options.nullStr
}, jt = {
  identify: (t) => typeof t == "boolean",
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: (t) => new N(t[0] === "t" || t[0] === "T"),
  stringify({ source: t, value: e }, i) {
    return t && jt.test.test(t) && e === (t[0] === "t" || t[0] === "T") ? t : e ? i.options.trueStr : i.options.falseStr;
  }
};
function q({ format: t, minFractionDigits: e, tag: i, value: s }) {
  if (typeof s == "bigint") return String(s);
  const a = typeof s == "number" ? s : Number(s);
  if (!isFinite(a)) return isNaN(a) ? ".nan" : a < 0 ? "-.inf" : ".inf";
  let n = Object.is(s, -0) ? "-0" : JSON.stringify(s);
  if (!t && e && (!i || i === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
    let r = n.indexOf(".");
    r < 0 && (r = n.length, n += ".");
    let o = e - (n.length - r - 1);
    for (; o-- > 0; ) n += "0";
  }
  return n;
}
var qi = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (t) => t.slice(-3).toLowerCase() === "nan" ? NaN : t[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: q
}, Hi = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: (t) => parseFloat(t),
  stringify(t) {
    const e = Number(t.value);
    return isFinite(e) ? e.toExponential() : q(t);
  }
}, Fi = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(t) {
    const e = new N(parseFloat(t)), i = t.indexOf(".");
    return i !== -1 && t[t.length - 1] === "0" && (e.minFractionDigits = t.length - i - 1), e;
  },
  stringify: q
}, lt = (t) => typeof t == "bigint" || Number.isInteger(t), Ut = (t, e, i, { intAsBigInt: s }) => s ? BigInt(t) : parseInt(t.substring(e), i);
function Yi(t, e, i) {
  const { value: s } = t;
  return lt(s) && s >= 0 ? i + s.toString(e) : q(t);
}
var Vi = {
  identify: (t) => lt(t) && t >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: (t, e, i) => Ut(t, 2, 8, i),
  stringify: (t) => Yi(t, 8, "0o")
}, Wi = {
  identify: lt,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: (t, e, i) => Ut(t, 0, 10, i),
  stringify: q
}, Gi = {
  identify: (t) => lt(t) && t >= 0,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: (t, e, i) => Ut(t, 2, 16, i),
  stringify: (t) => Yi(t, 16, "0x")
}, na = [
  $e,
  ke,
  rt,
  ot,
  jt,
  Vi,
  Wi,
  Gi,
  qi,
  Hi,
  Fi
];
function ri(t) {
  return typeof t == "bigint" || Number.isInteger(t);
}
var ze = ({ value: t }) => JSON.stringify(t), ra = [
  {
    identify: (t) => typeof t == "string",
    default: !0,
    tag: "tag:yaml.org,2002:str",
    resolve: (t) => t,
    stringify: ze
  },
  {
    identify: (t) => t == null,
    createNode: () => new N(null),
    default: !0,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: ze
  },
  {
    identify: (t) => typeof t == "boolean",
    default: !0,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: (t) => t === "true",
    stringify: ze
  },
  {
    identify: ri,
    default: !0,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (t, e, { intAsBigInt: i }) => i ? BigInt(t) : parseInt(t, 10),
    stringify: ({ value: t }) => ri(t) ? t.toString() : JSON.stringify(t)
  },
  {
    identify: (t) => typeof t == "number",
    default: !0,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (t) => parseFloat(t),
    stringify: ze
  }
], oa = [$e, ke].concat(ra, {
  default: !0,
  tag: "",
  test: /^/,
  resolve(t, e) {
    return e(`Unresolved plain scalar ${JSON.stringify(t)}`), t;
  }
}), Kt = {
  identify: (t) => t instanceof Uint8Array,
  default: !1,
  tag: "tag:yaml.org,2002:binary",
  resolve(t, e) {
    if (typeof atob == "function") {
      const i = atob(t.replace(/[\n\r]/g, "")), s = new Uint8Array(i.length);
      for (let a = 0; a < i.length; ++a) s[a] = i.charCodeAt(a);
      return s;
    } else
      return e("This environment does not support reading binary tags; either Buffer or atob is required"), t;
  },
  stringify({ comment: t, type: e, value: i }, s, a, n) {
    if (!i) return "";
    const r = i;
    let o;
    if (typeof btoa == "function") {
      let l = "";
      for (let c = 0; c < r.length; ++c) l += String.fromCharCode(r[c]);
      o = btoa(l);
    } else throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    if (e ?? (e = N.BLOCK_LITERAL), e !== N.QUOTE_DOUBLE) {
      const l = Math.max(s.options.lineWidth - s.indent.length, s.options.minContentWidth), c = Math.ceil(o.length / l), p = new Array(c);
      for (let d = 0, h = 0; d < c; ++d, h += l) p[d] = o.substr(h, l);
      o = p.join(e === N.BLOCK_LITERAL ? `
` : " ");
    }
    return Rt({
      comment: t,
      type: e,
      value: o
    }, s, a, n);
  }
};
function Qi(t, e) {
  if (Re(t)) for (let i = 0; i < t.items.length; ++i) {
    let s = t.items[i];
    if (!C(s)) {
      if (Me(s)) {
        s.items.length > 1 && e("Each pair must have its own sequence indicator");
        const a = s.items[0] || new R(new N(null));
        if (s.commentBefore && (a.key.commentBefore = a.key.commentBefore ? `${s.commentBefore}
${a.key.commentBefore}` : s.commentBefore), s.comment) {
          const n = a.value ?? a.key;
          n.comment = n.comment ? `${s.comment}
${n.comment}` : s.comment;
        }
        s = a;
      }
      t.items[i] = C(s) ? s : new R(s);
    }
  }
  else e("Expected a sequence for this tag");
  return t;
}
function Ji(t, e, i) {
  const { replacer: s } = i, a = new ae(t);
  a.tag = "tag:yaml.org,2002:pairs";
  let n = 0;
  if (e && Symbol.iterator in Object(e)) for (let r of e) {
    typeof s == "function" && (r = s.call(e, String(n++), r));
    let o, l;
    if (Array.isArray(r))
      if (r.length === 2)
        o = r[0], l = r[1];
      else throw new TypeError(`Expected [key, value] tuple: ${r}`);
    else if (r && r instanceof Object) {
      const c = Object.keys(r);
      if (c.length === 1)
        o = c[0], l = r[o];
      else throw new TypeError(`Expected tuple with one key, not ${c.length} keys`);
    } else o = r;
    a.items.push(Bt(o, l, i));
  }
  return a;
}
var zt = {
  collection: "seq",
  default: !1,
  tag: "tag:yaml.org,2002:pairs",
  resolve: Qi,
  createNode: Ji
}, We = class Xi extends ae {
  constructor() {
    super(), this.add = j.prototype.add.bind(this), this.delete = j.prototype.delete.bind(this), this.get = j.prototype.get.bind(this), this.has = j.prototype.has.bind(this), this.set = j.prototype.set.bind(this), this.tag = Xi.tag;
  }
  toJSON(e, i) {
    if (!i) return super.toJSON(e);
    const s = /* @__PURE__ */ new Map();
    i?.onCreate && i.onCreate(s);
    for (const a of this.items) {
      let n, r;
      if (C(a) ? (n = U(a.key, "", i), r = U(a.value, n, i)) : n = U(a, "", i), s.has(n)) throw new Error("Ordered maps must not include duplicate keys");
      s.set(n, r);
    }
    return s;
  }
  static from(e, i, s) {
    const a = Ji(e, i, s), n = new this();
    return n.items = a.items, n;
  }
};
We.tag = "tag:yaml.org,2002:omap";
var qt = {
  collection: "seq",
  identify: (t) => t instanceof Map,
  nodeClass: We,
  default: !1,
  tag: "tag:yaml.org,2002:omap",
  resolve(t, e) {
    const i = Qi(t, e), s = [];
    for (const { key: a } of i.items) I(a) && (s.includes(a.value) ? e(`Ordered maps must not include duplicate keys: ${a.value}`) : s.push(a.value));
    return Object.assign(new We(), i);
  },
  createNode: (t, e, i) => We.from(t, e, i)
};
function Zi({ value: t, source: e }, i) {
  return e && (t ? es : ts).test.test(e) ? e : t ? i.options.trueStr : i.options.falseStr;
}
var es = {
  identify: (t) => t === !0,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => new N(!0),
  stringify: Zi
}, ts = {
  identify: (t) => t === !1,
  default: !0,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: () => new N(!1),
  stringify: Zi
}, la = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (t) => t.slice(-3).toLowerCase() === "nan" ? NaN : t[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: q
}, ca = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: (t) => parseFloat(t.replace(/_/g, "")),
  stringify(t) {
    const e = Number(t.value);
    return isFinite(e) ? e.toExponential() : q(t);
  }
}, da = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(t) {
    const e = new N(parseFloat(t.replace(/_/g, ""))), i = t.indexOf(".");
    if (i !== -1) {
      const s = t.substring(i + 1).replace(/_/g, "");
      s[s.length - 1] === "0" && (e.minFractionDigits = s.length);
    }
    return e;
  },
  stringify: q
}, Be = (t) => typeof t == "bigint" || Number.isInteger(t);
function ct(t, e, i, { intAsBigInt: s }) {
  const a = t[0];
  if ((a === "-" || a === "+") && (e += 1), t = t.substring(e).replace(/_/g, ""), s) {
    switch (i) {
      case 2:
        t = `0b${t}`;
        break;
      case 8:
        t = `0o${t}`;
        break;
      case 16:
        t = `0x${t}`;
    }
    const r = BigInt(t);
    return a === "-" ? BigInt(-1) * r : r;
  }
  const n = parseInt(t, i);
  return a === "-" ? -1 * n : n;
}
function Ht(t, e, i) {
  const { value: s } = t;
  if (Be(s)) {
    const a = s.toString(e);
    return s < 0 ? "-" + i + a.substr(1) : i + a;
  }
  return q(t);
}
var ha = {
  identify: Be,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: (t, e, i) => ct(t, 2, 2, i),
  stringify: (t) => Ht(t, 2, "0b")
}, pa = {
  identify: Be,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: (t, e, i) => ct(t, 1, 8, i),
  stringify: (t) => Ht(t, 8, "0")
}, ua = {
  identify: Be,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: (t, e, i) => ct(t, 0, 10, i),
  stringify: q
}, fa = {
  identify: Be,
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: (t, e, i) => ct(t, 2, 16, i),
  stringify: (t) => Ht(t, 16, "0x")
}, Ge = class is extends j {
  constructor(e) {
    super(e), this.tag = is.tag;
  }
  add(e) {
    let i;
    C(e) ? i = e : e && typeof e == "object" && "key" in e && "value" in e && e.value === null ? i = new R(e.key, null) : i = new R(e, null), ie(this.items, i.key) || this.items.push(i);
  }
  get(e, i) {
    const s = ie(this.items, e);
    return !i && C(s) ? I(s.key) ? s.key.value : s.key : s;
  }
  set(e, i) {
    if (typeof i != "boolean") throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof i}`);
    const s = ie(this.items, e);
    s && !i ? this.items.splice(this.items.indexOf(s), 1) : !s && i && this.items.push(new R(e));
  }
  toJSON(e, i) {
    return super.toJSON(e, i, Set);
  }
  toString(e, i, s) {
    if (!e) return JSON.stringify(this);
    if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, e, { allNullValues: !0 }), i, s);
    throw new Error("Set items must all have null values");
  }
  static from(e, i, s) {
    const { replacer: a } = s, n = new this(e);
    if (i && Symbol.iterator in Object(i)) for (let r of i)
      typeof a == "function" && (r = a.call(i, r, r)), n.items.push(Bt(r, null, s));
    return n;
  }
};
Ge.tag = "tag:yaml.org,2002:set";
var Ft = {
  collection: "map",
  identify: (t) => t instanceof Set,
  nodeClass: Ge,
  default: !1,
  tag: "tag:yaml.org,2002:set",
  createNode: (t, e, i) => Ge.from(t, e, i),
  resolve(t, e) {
    if (Me(t)) {
      if (t.hasAllNullValues(!0)) return Object.assign(new Ge(), t);
      e("Set items must all have null values");
    } else e("Expected a mapping for this tag");
    return t;
  }
};
function Yt(t, e) {
  const i = t[0], s = i === "-" || i === "+" ? t.substring(1) : t, a = (r) => e ? BigInt(r) : Number(r), n = s.replace(/_/g, "").split(":").reduce((r, o) => r * a(60) + a(o), a(0));
  return i === "-" ? a(-1) * n : n;
}
function ss(t) {
  let { value: e } = t, i = (r) => r;
  if (typeof e == "bigint") i = (r) => BigInt(r);
  else if (isNaN(e) || !isFinite(e)) return q(t);
  let s = "";
  e < 0 && (s = "-", e *= i(-1));
  const a = i(60), n = [e % a];
  return e < 60 ? n.unshift(0) : (e = (e - n[0]) / a, n.unshift(e % a), e >= 60 && (e = (e - n[0]) / a, n.unshift(e))), s + n.map((r) => String(r).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
var as = {
  identify: (t) => typeof t == "bigint" || Number.isInteger(t),
  default: !0,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: (t, e, { intAsBigInt: i }) => Yt(t, i),
  stringify: ss
}, ns = {
  identify: (t) => typeof t == "number",
  default: !0,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: (t) => Yt(t, !1),
  stringify: ss
}, dt = {
  identify: (t) => t instanceof Date,
  default: !0,
  tag: "tag:yaml.org,2002:timestamp",
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(t) {
    const e = t.match(dt.test);
    if (!e) throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, i, s, a, n, r, o] = e.map(Number), l = e[7] ? Number((e[7] + "00").substr(1, 3)) : 0;
    let c = Date.UTC(i, s - 1, a, n || 0, r || 0, o || 0, l);
    const p = e[8];
    if (p && p !== "Z") {
      let d = Yt(p, !1);
      Math.abs(d) < 30 && (d *= 60), c -= 6e4 * d;
    }
    return new Date(c);
  },
  stringify: ({ value: t }) => t?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
}, oi = [
  $e,
  ke,
  rt,
  ot,
  es,
  ts,
  ha,
  pa,
  ua,
  fa,
  la,
  ca,
  da,
  Kt,
  G,
  qt,
  zt,
  Ft,
  as,
  ns,
  dt
], li = /* @__PURE__ */ new Map([
  ["core", na],
  ["failsafe", [
    $e,
    ke,
    rt
  ]],
  ["json", oa],
  ["yaml11", oi],
  ["yaml-1.1", oi]
]), ci = {
  binary: Kt,
  bool: jt,
  float: Fi,
  floatExp: Hi,
  floatNaN: qi,
  floatTime: ns,
  int: Wi,
  intHex: Gi,
  intOct: Vi,
  intTime: as,
  map: $e,
  merge: G,
  null: ot,
  omap: qt,
  pairs: zt,
  seq: ke,
  set: Ft,
  timestamp: dt
}, ga = {
  "tag:yaml.org,2002:binary": Kt,
  "tag:yaml.org,2002:merge": G,
  "tag:yaml.org,2002:omap": qt,
  "tag:yaml.org,2002:pairs": zt,
  "tag:yaml.org,2002:set": Ft,
  "tag:yaml.org,2002:timestamp": dt
};
function ut(t, e, i) {
  const s = li.get(e);
  if (s && !t) return i && !s.includes(G) ? s.concat(G) : s.slice();
  let a = s;
  if (!a)
    if (Array.isArray(t)) a = [];
    else {
      const n = Array.from(li.keys()).filter((r) => r !== "yaml11").map((r) => JSON.stringify(r)).join(", ");
      throw new Error(`Unknown schema "${e}"; use one of ${n} or define customTags array`);
    }
  if (Array.isArray(t)) for (const n of t) a = a.concat(n);
  else typeof t == "function" && (a = t(a.slice()));
  return i && (a = a.concat(G)), a.reduce((n, r) => {
    const o = typeof r == "string" ? ci[r] : r;
    if (!o) {
      const l = JSON.stringify(r), c = Object.keys(ci).map((p) => JSON.stringify(p)).join(", ");
      throw new Error(`Unknown custom tag ${l}; use one of ${c}`);
    }
    return n.includes(o) || n.push(o), n;
  }, []);
}
var ma = (t, e) => t.key < e.key ? -1 : t.key > e.key ? 1 : 0, va = class rs {
  constructor({ compat: e, customTags: i, merge: s, resolveKnownTags: a, schema: n, sortMapEntries: r, toStringDefaults: o }) {
    this.compat = Array.isArray(e) ? ut(e, "compat") : e ? ut(null, e) : null, this.name = typeof n == "string" && n || "core", this.knownTags = a ? ga : {}, this.tags = ut(i, this.name, s), this.toStringOptions = o ?? null, Object.defineProperty(this, X, { value: $e }), Object.defineProperty(this, Y, { value: rt }), Object.defineProperty(this, ye, { value: ke }), this.sortMapEntries = typeof r == "function" ? r : r === !0 ? ma : null;
  }
  clone() {
    const e = Object.create(rs.prototype, Object.getOwnPropertyDescriptors(this));
    return e.tags = this.tags.slice(), e;
  }
};
function ya(t, e) {
  const i = [];
  let s = e.directives === !0;
  if (e.directives !== !1 && t.directives) {
    const l = t.directives.toString(t);
    l ? (i.push(l), s = !0) : t.directives.docStart && (s = !0);
  }
  s && i.push("---");
  const a = Mi(t, e), { commentString: n } = a.options;
  if (t.commentBefore) {
    i.length !== 1 && i.unshift("");
    const l = n(t.commentBefore);
    i.unshift(W(l, ""));
  }
  let r = !1, o = null;
  if (t.contents) {
    if (D(t.contents)) {
      if (t.contents.spaceBefore && s && i.push(""), t.contents.commentBefore) {
        const p = n(t.contents.commentBefore);
        i.push(W(p, ""));
      }
      a.forceBlockIndent = !!t.comment, o = t.contents.comment;
    }
    const l = o ? void 0 : () => r = !0;
    let c = ge(t.contents, a, () => o = null, l);
    o && (c += te(c, "", n(o))), (c[0] === "|" || c[0] === ">") && i[i.length - 1] === "---" ? i[i.length - 1] = `--- ${c}` : i.push(c);
  } else i.push(ge(t.contents, a));
  if (t.directives?.docEnd)
    if (t.comment) {
      const l = n(t.comment);
      l.includes(`
`) ? (i.push("..."), i.push(W(l, ""))) : i.push(`... ${l}`);
    } else i.push("...");
  else {
    let l = t.comment;
    l && r && (l = l.replace(/^\n+/, "")), l && ((!r || o) && i[i.length - 1] !== "" && i.push(""), i.push(W(n(l), "")));
  }
  return i.join(`
`) + `
`;
}
var os = class ls {
  constructor(e, i, s) {
    this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, K, { value: bt });
    let a = null;
    typeof i == "function" || Array.isArray(i) ? a = i : s === void 0 && i && (s = i, i = void 0);
    const n = Object.assign({
      intAsBigInt: !1,
      keepSourceTokens: !1,
      logLevel: "warn",
      prettyErrors: !0,
      strict: !0,
      stringKeys: !1,
      uniqueKeys: !0,
      version: "1.2"
    }, s);
    this.options = n;
    let { version: r } = n;
    s?._directives ? (this.directives = s._directives.atDocument(), this.directives.yaml.explicit && (r = this.directives.yaml.version)) : this.directives = new pe({ version: r }), this.setSchema(r, s), this.contents = e === void 0 ? null : this.createNode(e, a, s);
  }
  clone() {
    const e = Object.create(ls.prototype, { [K]: { value: bt } });
    return e.commentBefore = this.commentBefore, e.comment = this.comment, e.errors = this.errors.slice(), e.warnings = this.warnings.slice(), e.options = Object.assign({}, this.options), this.directives && (e.directives = this.directives.clone()), e.schema = this.schema.clone(), e.contents = D(this.contents) ? this.contents.clone(e.schema) : this.contents, this.range && (e.range = this.range.slice()), e;
  }
  add(e) {
    ne(this.contents) && this.contents.add(e);
  }
  addIn(e, i) {
    ne(this.contents) && this.contents.addIn(e, i);
  }
  createAlias(e, i) {
    if (!e.anchor) {
      const s = Ii(this);
      e.anchor = !i || s.has(i) ? Ci(i || "a", s) : i;
    }
    return new Mt(e.anchor);
  }
  createNode(e, i, s) {
    let a;
    if (typeof i == "function")
      e = i.call({ "": e }, "", e), a = i;
    else if (Array.isArray(i)) {
      const m = (k) => typeof k == "number" || k instanceof String || k instanceof Number, $ = i.filter(m).map(String);
      $.length > 0 && (i = i.concat($)), a = i;
    } else s === void 0 && i && (s = i, i = void 0);
    const { aliasDuplicateObjects: n, anchorPrefix: r, flow: o, keepUndefined: l, onTagObj: c, tag: p } = s ?? {}, { onAnchor: d, setAnchors: h, sourceObjects: g } = Hs(this, r || "a"), v = {
      aliasDuplicateObjects: n ?? !0,
      keepUndefined: l ?? !1,
      onAnchor: d,
      onTagObj: c,
      replacer: a,
      schema: this.schema,
      sourceObjects: g
    }, u = Le(e, p, v);
    return o && L(u) && (u.flow = !0), h(), u;
  }
  createPair(e, i, s = {}) {
    const a = this.createNode(e, null, s), n = this.createNode(i, null, s);
    return new R(a, n);
  }
  delete(e) {
    return ne(this.contents) ? this.contents.delete(e) : !1;
  }
  deleteIn(e) {
    return Ae(e) ? this.contents == null ? !1 : (this.contents = null, !0) : ne(this.contents) ? this.contents.deleteIn(e) : !1;
  }
  get(e, i) {
    return L(this.contents) ? this.contents.get(e, i) : void 0;
  }
  getIn(e, i) {
    return Ae(e) ? !i && I(this.contents) ? this.contents.value : this.contents : L(this.contents) ? this.contents.getIn(e, i) : void 0;
  }
  has(e) {
    return L(this.contents) ? this.contents.has(e) : !1;
  }
  hasIn(e) {
    return Ae(e) ? this.contents !== void 0 : L(this.contents) ? this.contents.hasIn(e) : !1;
  }
  set(e, i) {
    this.contents == null ? this.contents = Xe(this.schema, [e], i) : ne(this.contents) && this.contents.set(e, i);
  }
  setIn(e, i) {
    Ae(e) ? this.contents = i : this.contents == null ? this.contents = Xe(this.schema, Array.from(e), i) : ne(this.contents) && this.contents.setIn(e, i);
  }
  setSchema(e, i = {}) {
    typeof e == "number" && (e = String(e));
    let s;
    switch (e) {
      case "1.1":
        this.directives ? this.directives.yaml.version = "1.1" : this.directives = new pe({ version: "1.1" }), s = {
          resolveKnownTags: !1,
          schema: "yaml-1.1"
        };
        break;
      case "1.2":
      case "next":
        this.directives ? this.directives.yaml.version = e : this.directives = new pe({ version: e }), s = {
          resolveKnownTags: !0,
          schema: "core"
        };
        break;
      case null:
        this.directives && delete this.directives, s = null;
        break;
      default: {
        const a = JSON.stringify(e);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${a}`);
      }
    }
    if (i.schema instanceof Object) this.schema = i.schema;
    else if (s) this.schema = new va(Object.assign(s, i));
    else throw new Error("With a null YAML version, the { schema: Schema } option is required");
  }
  toJS({ json: e, jsonArg: i, mapAsMap: s, maxAliasCount: a, onAnchor: n, reviver: r } = {}) {
    const o = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !e,
      mapAsMap: s === !0,
      mapKeyWarned: !1,
      maxAliasCount: typeof a == "number" ? a : 100
    }, l = U(this.contents, i ?? "", o);
    if (typeof n == "function") for (const { count: c, res: p } of o.anchors.values()) n(p, c);
    return typeof r == "function" ? de(r, { "": l }, "", l) : l;
  }
  toJSON(e, i) {
    return this.toJS({
      json: !0,
      jsonArg: e,
      mapAsMap: !1,
      onAnchor: i
    });
  }
  toString(e = {}) {
    if (this.errors.length > 0) throw new Error("Document with errors cannot be stringified");
    if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
      const i = JSON.stringify(e.indent);
      throw new Error(`"indent" option must be a positive integer, not ${i}`);
    }
    return ya(this, e);
  }
};
function ne(t) {
  if (L(t)) return !0;
  throw new Error("Expected a YAML collection as document contents");
}
var cs = class extends Error {
  constructor(t, e, i, s) {
    super(), this.name = t, this.code = i, this.message = s, this.pos = e;
  }
}, Ee = class extends cs {
  constructor(t, e, i) {
    super("YAMLParseError", t, e, i);
  }
}, ba = class extends cs {
  constructor(t, e, i) {
    super("YAMLWarning", t, e, i);
  }
}, di = (t, e) => (i) => {
  if (i.pos[0] === -1) return;
  i.linePos = i.pos.map((o) => e.linePos(o));
  const { line: s, col: a } = i.linePos[0];
  i.message += ` at line ${s}, column ${a}`;
  let n = a - 1, r = t.substring(e.lineStarts[s - 1], e.lineStarts[s]).replace(/[\n\r]+$/, "");
  if (n >= 60 && r.length > 80) {
    const o = Math.min(n - 39, r.length - 79);
    r = "…" + r.substring(o), n -= o - 1;
  }
  if (r.length > 80 && (r = r.substring(0, 79) + "…"), s > 1 && /^ *$/.test(r.substring(0, n))) {
    let o = t.substring(e.lineStarts[s - 2], e.lineStarts[s - 1]);
    o.length > 80 && (o = o.substring(0, 79) + `…
`), r = o + r;
  }
  if (/[^ ]/.test(r)) {
    let o = 1;
    const l = i.linePos[1];
    l?.line === s && l.col > a && (o = Math.max(1, Math.min(l.col - a, 80 - n)));
    const c = " ".repeat(n) + "^".repeat(o);
    i.message += `:

${r}
${c}
`;
  }
};
function me(t, { flow: e, indicator: i, next: s, offset: a, onError: n, parentIndent: r, startOnNewline: o }) {
  let l = !1, c = o, p = o, d = "", h = "", g = !1, v = !1, u = null, m = null, $ = null, k = null, _ = null, A = null, E = null;
  for (const S of t)
    switch (v && (S.type !== "space" && S.type !== "newline" && S.type !== "comma" && n(S.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), v = !1), u && (c && S.type !== "comment" && S.type !== "newline" && n(u, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), u = null), S.type) {
      case "space":
        !e && (i !== "doc-start" || s?.type !== "flow-collection") && S.source.includes("	") && (u = S), p = !0;
        break;
      case "comment": {
        p || n(S, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
        const B = S.source.substring(1) || " ";
        d ? d += h + B : d = B, h = "", c = !1;
        break;
      }
      case "newline":
        c ? d ? d += S.source : (!A || i !== "seq-item-ind") && (l = !0) : h += S.source, c = !0, g = !0, (m || $) && (k = S), p = !0;
        break;
      case "anchor":
        m && n(S, "MULTIPLE_ANCHORS", "A node can have at most one anchor"), S.source.endsWith(":") && n(S.offset + S.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0), m = S, E ?? (E = S.offset), c = !1, p = !1, v = !0;
        break;
      case "tag":
        $ && n(S, "MULTIPLE_TAGS", "A node can have at most one tag"), $ = S, E ?? (E = S.offset), c = !1, p = !1, v = !0;
        break;
      case i:
        (m || $) && n(S, "BAD_PROP_ORDER", `Anchors and tags must be after the ${S.source} indicator`), A && n(S, "UNEXPECTED_TOKEN", `Unexpected ${S.source} in ${e ?? "collection"}`), A = S, c = i === "seq-item-ind" || i === "explicit-key-ind", p = !1;
        break;
      case "comma":
        if (e) {
          _ && n(S, "UNEXPECTED_TOKEN", `Unexpected , in ${e}`), _ = S, c = !1, p = !1;
          break;
        }
      default:
        n(S, "UNEXPECTED_TOKEN", `Unexpected ${S.type} token`), c = !1, p = !1;
    }
  const T = t[t.length - 1], O = T ? T.offset + T.source.length : a;
  return v && s && s.type !== "space" && s.type !== "newline" && s.type !== "comma" && (s.type !== "scalar" || s.source !== "") && n(s.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), u && (c && u.indent <= r || s?.type === "block-map" || s?.type === "block-seq") && n(u, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), {
    comma: _,
    found: A,
    spaceBefore: l,
    comment: d,
    hasNewline: g,
    anchor: m,
    tag: $,
    newlineAfterProp: k,
    end: O,
    start: E ?? O
  };
}
function De(t) {
  if (!t) return null;
  switch (t.type) {
    case "alias":
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      if (t.source.includes(`
`)) return !0;
      if (t.end) {
        for (const e of t.end) if (e.type === "newline") return !0;
      }
      return !1;
    case "flow-collection":
      for (const e of t.items) {
        for (const i of e.start) if (i.type === "newline") return !0;
        if (e.sep) {
          for (const i of e.sep) if (i.type === "newline") return !0;
        }
        if (De(e.key) || De(e.value)) return !0;
      }
      return !1;
    default:
      return !0;
  }
}
function kt(t, e, i) {
  if (e?.type === "flow-collection") {
    const s = e.end[0];
    s.indent === t && (s.source === "]" || s.source === "}") && De(e) && i(s, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
  }
}
function ds(t, e, i) {
  const { uniqueKeys: s } = t.options;
  if (s === !1) return !1;
  const a = typeof s == "function" ? s : (n, r) => n === r || I(n) && I(r) && n.value === r.value;
  return e.some((n) => a(n.key, i));
}
var hi = "All mapping items must start at the same column";
function wa({ composeNode: t, composeEmptyNode: e }, i, s, a, n) {
  const r = new (n?.nodeClass ?? j)(i.schema);
  i.atRoot && (i.atRoot = !1);
  let o = s.offset, l = null;
  for (const c of s.items) {
    const { start: p, key: d, sep: h, value: g } = c, v = me(p, {
      indicator: "explicit-key-ind",
      next: d ?? h?.[0],
      offset: o,
      onError: a,
      parentIndent: s.indent,
      startOnNewline: !0
    }), u = !v.found;
    if (u) {
      if (d && (d.type === "block-seq" ? a(o, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key") : "indent" in d && d.indent !== s.indent && a(o, "BAD_INDENT", hi)), !v.anchor && !v.tag && !h) {
        l = v.end, v.comment && (r.comment ? r.comment += `
` + v.comment : r.comment = v.comment);
        continue;
      }
      (v.newlineAfterProp || De(d)) && a(d ?? p[p.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
    } else v.found?.indent !== s.indent && a(o, "BAD_INDENT", hi);
    i.atKey = !0;
    const m = v.end, $ = d ? t(i, d, v, a) : e(i, m, p, null, v, a);
    i.schema.compat && kt(s.indent, d, a), i.atKey = !1, ds(i, r.items, $) && a(m, "DUPLICATE_KEY", "Map keys must be unique");
    const k = me(h ?? [], {
      indicator: "map-value-ind",
      next: g,
      offset: $.range[2],
      onError: a,
      parentIndent: s.indent,
      startOnNewline: !d || d.type === "block-scalar"
    });
    if (o = k.end, k.found) {
      u && (g?.type === "block-map" && !k.hasNewline && a(o, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"), i.options.strict && v.start < k.found.offset - 1024 && a($.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));
      const _ = g ? t(i, g, k, a) : e(i, o, h, null, k, a);
      i.schema.compat && kt(s.indent, g, a), o = _.range[2];
      const A = new R($, _);
      i.options.keepSourceTokens && (A.srcToken = c), r.items.push(A);
    } else {
      u && a($.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"), k.comment && ($.comment ? $.comment += `
` + k.comment : $.comment = k.comment);
      const _ = new R($);
      i.options.keepSourceTokens && (_.srcToken = c), r.items.push(_);
    }
  }
  return l && l < o && a(l, "IMPOSSIBLE", "Map comment with trailing content"), r.range = [
    s.offset,
    o,
    l ?? o
  ], r;
}
function $a({ composeNode: t, composeEmptyNode: e }, i, s, a, n) {
  const r = new (n?.nodeClass ?? ae)(i.schema);
  i.atRoot && (i.atRoot = !1), i.atKey && (i.atKey = !1);
  let o = s.offset, l = null;
  for (const { start: c, value: p } of s.items) {
    const d = me(c, {
      indicator: "seq-item-ind",
      next: p,
      offset: o,
      onError: a,
      parentIndent: s.indent,
      startOnNewline: !0
    });
    if (!d.found)
      if (d.anchor || d.tag || p)
        p?.type === "block-seq" ? a(d.end, "BAD_INDENT", "All sequence items must start at the same column") : a(o, "MISSING_CHAR", "Sequence item without - indicator");
      else {
        l = d.end, d.comment && (r.comment = d.comment);
        continue;
      }
    const h = p ? t(i, p, d, a) : e(i, d.end, c, null, d, a);
    i.schema.compat && kt(s.indent, p, a), o = h.range[2], r.items.push(h);
  }
  return r.range = [
    s.offset,
    o,
    l ?? o
  ], r;
}
function je(t, e, i, s) {
  let a = "";
  if (t) {
    let n = !1, r = "";
    for (const o of t) {
      const { source: l, type: c } = o;
      switch (c) {
        case "space":
          n = !0;
          break;
        case "comment": {
          i && !n && s(o, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const p = l.substring(1) || " ";
          a ? a += r + p : a = p, r = "";
          break;
        }
        case "newline":
          a && (r += l), n = !0;
          break;
        default:
          s(o, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
      }
      e += l.length;
    }
  }
  return {
    comment: a,
    offset: e
  };
}
var ft = "Block collections are not allowed within flow collections", gt = (t) => t && (t.type === "block-map" || t.type === "block-seq");
function ka({ composeNode: t, composeEmptyNode: e }, i, s, a, n) {
  const r = s.start.source === "{", o = r ? "flow map" : "flow sequence", l = new (n?.nodeClass ?? (r ? j : ae))(i.schema);
  l.flow = !0;
  const c = i.atRoot;
  c && (i.atRoot = !1), i.atKey && (i.atKey = !1);
  let p = s.offset + s.start.source.length;
  for (let u = 0; u < s.items.length; ++u) {
    const m = s.items[u], { start: $, key: k, sep: _, value: A } = m, E = me($, {
      flow: o,
      indicator: "explicit-key-ind",
      next: k ?? _?.[0],
      offset: p,
      onError: a,
      parentIndent: s.indent,
      startOnNewline: !1
    });
    if (!E.found) {
      if (!E.anchor && !E.tag && !_ && !A) {
        u === 0 && E.comma ? a(E.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${o}`) : u < s.items.length - 1 && a(E.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${o}`), E.comment && (l.comment ? l.comment += `
` + E.comment : l.comment = E.comment), p = E.end;
        continue;
      }
      !r && i.options.strict && De(k) && a(k, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
    }
    if (u === 0)
      E.comma && a(E.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${o}`);
    else if (E.comma || a(E.start, "MISSING_CHAR", `Missing , between ${o} items`), E.comment) {
      let T = "";
      e: for (const O of $) switch (O.type) {
        case "comma":
        case "space":
          break;
        case "comment":
          T = O.source.substring(1);
          break e;
        default:
          break e;
      }
      if (T) {
        let O = l.items[l.items.length - 1];
        C(O) && (O = O.value ?? O.key), O.comment ? O.comment += `
` + T : O.comment = T, E.comment = E.comment.substring(T.length + 1);
      }
    }
    if (!r && !_ && !E.found) {
      const T = A ? t(i, A, E, a) : e(i, E.end, _, null, E, a);
      l.items.push(T), p = T.range[2], gt(A) && a(T.range, "BLOCK_IN_FLOW", ft);
    } else {
      i.atKey = !0;
      const T = E.end, O = k ? t(i, k, E, a) : e(i, T, $, null, E, a);
      gt(k) && a(O.range, "BLOCK_IN_FLOW", ft), i.atKey = !1;
      const S = me(_ ?? [], {
        flow: o,
        indicator: "map-value-ind",
        next: A,
        offset: O.range[2],
        onError: a,
        parentIndent: s.indent,
        startOnNewline: !1
      });
      if (S.found) {
        if (!r && !E.found && i.options.strict) {
          if (_) for (const P of _) {
            if (P === S.found) break;
            if (P.type === "newline") {
              a(P, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
              break;
            }
          }
          E.start < S.found.offset - 1024 && a(S.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
        }
      } else A && ("source" in A && A.source?.[0] === ":" ? a(A, "MISSING_CHAR", `Missing space after : in ${o}`) : a(S.start, "MISSING_CHAR", `Missing , or : between ${o} items`));
      const B = A ? t(i, A, S, a) : S.found ? e(i, S.end, _, null, S, a) : null;
      B ? gt(A) && a(B.range, "BLOCK_IN_FLOW", ft) : S.comment && (O.comment ? O.comment += `
` + S.comment : O.comment = S.comment);
      const xe = new R(O, B);
      if (i.options.keepSourceTokens && (xe.srcToken = m), r) {
        const P = l;
        ds(i, P.items, O) && a(T, "DUPLICATE_KEY", "Map keys must be unique"), P.items.push(xe);
      } else {
        const P = new j(i.schema);
        P.flow = !0, P.items.push(xe);
        const H = (B ?? O).range;
        P.range = [
          O.range[0],
          H[1],
          H[2]
        ], l.items.push(P);
      }
      p = B ? B.range[2] : S.end;
    }
  }
  const d = r ? "}" : "]", [h, ...g] = s.end;
  let v = p;
  if (h?.source === d) v = h.offset + h.source.length;
  else {
    const u = o[0].toUpperCase() + o.substring(1), m = c ? `${u} must end with a ${d}` : `${u} in block collection must be sufficiently indented and end with a ${d}`;
    a(p, c ? "MISSING_CHAR" : "BAD_INDENT", m), h && h.source.length !== 1 && g.unshift(h);
  }
  if (g.length > 0) {
    const u = je(g, v, i.options.strict, a);
    u.comment && (l.comment ? l.comment += `
` + u.comment : l.comment = u.comment), l.range = [
      s.offset,
      v,
      u.offset
    ];
  } else l.range = [
    s.offset,
    v,
    v
  ];
  return l;
}
function mt(t, e, i, s, a, n) {
  const r = i.type === "block-map" ? wa(t, e, i, s, n) : i.type === "block-seq" ? $a(t, e, i, s, n) : ka(t, e, i, s, n), o = r.constructor;
  return a === "!" || a === o.tagName ? (r.tag = o.tagName, r) : (a && (r.tag = a), r);
}
function xa(t, e, i, s, a) {
  const n = s.tag, r = n ? e.directives.tagName(n.source, (h) => a(n, "TAG_RESOLVE_FAILED", h)) : null;
  if (i.type === "block-seq") {
    const { anchor: h, newlineAfterProp: g } = s, v = h && n ? h.offset > n.offset ? h : n : h ?? n;
    v && (!g || g.offset < v.offset) && a(v, "MISSING_CHAR", "Missing newline after block sequence props");
  }
  const o = i.type === "block-map" ? "map" : i.type === "block-seq" ? "seq" : i.start.source === "{" ? "map" : "seq";
  if (!n || !r || r === "!" || r === j.tagName && o === "map" || r === ae.tagName && o === "seq") return mt(t, e, i, a, r);
  let l = e.schema.tags.find((h) => h.tag === r && h.collection === o);
  if (!l) {
    const h = e.schema.knownTags[r];
    if (h?.collection === o)
      e.schema.tags.push(Object.assign({}, h, { default: !1 })), l = h;
    else
      return h ? a(n, "BAD_COLLECTION_TYPE", `${h.tag} used for ${o} collection, but expects ${h.collection ?? "scalar"}`, !0) : a(n, "TAG_RESOLVE_FAILED", `Unresolved tag: ${r}`, !0), mt(t, e, i, a, r);
  }
  const c = mt(t, e, i, a, r, l), p = l.resolve?.(c, (h) => a(n, "TAG_RESOLVE_FAILED", h), e.options) ?? c, d = D(p) ? p : new N(p);
  return d.range = c.range, d.tag = r, l?.format && (d.format = l.format), d;
}
function _a(t, e, i) {
  const s = e.offset, a = Sa(e, t.options.strict, i);
  if (!a) return {
    value: "",
    type: null,
    comment: "",
    range: [
      s,
      s,
      s
    ]
  };
  const n = a.mode === ">" ? N.BLOCK_FOLDED : N.BLOCK_LITERAL, r = e.source ? Aa(e.source) : [];
  let o = r.length;
  for (let u = r.length - 1; u >= 0; --u) {
    const m = r[u][1];
    if (m === "" || m === "\r") o = u;
    else break;
  }
  if (o === 0) {
    const u = a.chomp === "+" && r.length > 0 ? `
`.repeat(Math.max(1, r.length - 1)) : "";
    let m = s + a.length;
    return e.source && (m += e.source.length), {
      value: u,
      type: n,
      comment: a.comment,
      range: [
        s,
        m,
        m
      ]
    };
  }
  let l = e.indent + a.indent, c = e.offset + a.length, p = 0;
  for (let u = 0; u < o; ++u) {
    const [m, $] = r[u];
    if ($ === "" || $ === "\r")
      a.indent === 0 && m.length > l && (l = m.length);
    else {
      m.length < l && i(c + m.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator"), a.indent === 0 && (l = m.length), p = u, l === 0 && !t.atRoot && i(c, "BAD_INDENT", "Block scalar values in collections must be indented");
      break;
    }
    c += m.length + $.length + 1;
  }
  for (let u = r.length - 1; u >= o; --u) r[u][0].length > l && (o = u + 1);
  let d = "", h = "", g = !1;
  for (let u = 0; u < p; ++u) d += r[u][0].slice(l) + `
`;
  for (let u = p; u < o; ++u) {
    let [m, $] = r[u];
    c += m.length + $.length + 1;
    const k = $[$.length - 1] === "\r";
    if (k && ($ = $.slice(0, -1)), $ && m.length < l) {
      const _ = `Block scalar lines must not be less indented than their ${a.indent ? "explicit indentation indicator" : "first line"}`;
      i(c - $.length - (k ? 2 : 1), "BAD_INDENT", _), m = "";
    }
    n === N.BLOCK_LITERAL ? (d += h + m.slice(l) + $, h = `
`) : m.length > l || $[0] === "	" ? (h === " " ? h = `
` : !g && h === `
` && (h = `

`), d += h + m.slice(l) + $, h = `
`, g = !0) : $ === "" ? h === `
` ? d += `
` : h = `
` : (d += h + $, h = " ", g = !1);
  }
  switch (a.chomp) {
    case "-":
      break;
    case "+":
      for (let u = o; u < r.length; ++u) d += `
` + r[u][0].slice(l);
      d[d.length - 1] !== `
` && (d += `
`);
      break;
    default:
      d += `
`;
  }
  const v = s + a.length + e.source.length;
  return {
    value: d,
    type: n,
    comment: a.comment,
    range: [
      s,
      v,
      v
    ]
  };
}
function Sa({ offset: t, props: e }, i, s) {
  if (e[0].type !== "block-scalar-header")
    return s(e[0], "IMPOSSIBLE", "Block scalar header not found"), null;
  const { source: a } = e[0], n = a[0];
  let r = 0, o = "", l = -1;
  for (let h = 1; h < a.length; ++h) {
    const g = a[h];
    if (!o && (g === "-" || g === "+")) o = g;
    else {
      const v = Number(g);
      !r && v ? r = v : l === -1 && (l = t + h);
    }
  }
  l !== -1 && s(l, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${a}`);
  let c = !1, p = "", d = a.length;
  for (let h = 1; h < e.length; ++h) {
    const g = e[h];
    switch (g.type) {
      case "space":
        c = !0;
      case "newline":
        d += g.source.length;
        break;
      case "comment":
        i && !c && s(g, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"), d += g.source.length, p = g.source.substring(1);
        break;
      case "error":
        s(g, "UNEXPECTED_TOKEN", g.message), d += g.source.length;
        break;
      /* istanbul ignore next should not happen */
      default: {
        s(g, "UNEXPECTED_TOKEN", `Unexpected token in block scalar header: ${g.type}`);
        const v = g.source;
        v && typeof v == "string" && (d += v.length);
      }
    }
  }
  return {
    mode: n,
    indent: r,
    chomp: o,
    comment: p,
    length: d
  };
}
function Aa(t) {
  const e = t.split(/\n( *)/), i = e[0], s = i.match(/^( *)/), a = [s?.[1] ? [s[1], i.slice(s[1].length)] : ["", i]];
  for (let n = 1; n < e.length; n += 2) a.push([e[n], e[n + 1]]);
  return a;
}
function Ea(t, e, i) {
  const { offset: s, type: a, source: n, end: r } = t;
  let o, l;
  const c = (h, g, v) => i(s + h, g, v);
  switch (a) {
    case "scalar":
      o = N.PLAIN, l = Na(n, c);
      break;
    case "single-quoted-scalar":
      o = N.QUOTE_SINGLE, l = Oa(n, c);
      break;
    case "double-quoted-scalar":
      o = N.QUOTE_DOUBLE, l = Ta(n, c);
      break;
    /* istanbul ignore next should not happen */
    default:
      return i(t, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${a}`), {
        value: "",
        type: null,
        comment: "",
        range: [
          s,
          s + n.length,
          s + n.length
        ]
      };
  }
  const p = s + n.length, d = je(r, p, e, i);
  return {
    value: l,
    type: o,
    comment: d.comment,
    range: [
      s,
      p,
      d.offset
    ]
  };
}
function Na(t, e) {
  let i = "";
  switch (t[0]) {
    /* istanbul ignore next should not happen */
    case "	":
      i = "a tab character";
      break;
    case ",":
      i = "flow indicator character ,";
      break;
    case "%":
      i = "directive indicator character %";
      break;
    case "|":
    case ">":
      i = `block scalar indicator ${t[0]}`;
      break;
    case "@":
    case "`":
      i = `reserved character ${t[0]}`;
  }
  return i && e(0, "BAD_SCALAR_START", `Plain value cannot start with ${i}`), hs(t);
}
function Oa(t, e) {
  return (t[t.length - 1] !== "'" || t.length === 1) && e(t.length, "MISSING_CHAR", "Missing closing 'quote"), hs(t.slice(1, -1)).replace(/''/g, "'");
}
function hs(t) {
  const e = /(.*?)\r?\n/sy;
  let i = e.exec(t);
  if (!i) return t;
  let s, a;
  try {
    s = /* @__PURE__ */ new RegExp("(?<![ 	])[ 	]+$"), a = /* @__PURE__ */ new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
  } catch {
    s = /[ \t]+$/, a = /^[ \t]+|[ \t]+$/g;
  }
  let n = i[1].replace(s, ""), r = " ", o = e.lastIndex;
  for (; i = e.exec(t); ) {
    const c = i[1].replace(a, "");
    c === "" ? r === `
` ? n += r : r = `
` : (n += r + c, r = " "), o = e.lastIndex;
  }
  const l = /[ \t]*(.*)/sy;
  return l.lastIndex = o, i = l.exec(t), n + r + (i?.[1] ?? "");
}
function Ta(t, e) {
  let i = "";
  for (let s = 1; s < t.length - 1; ++s) {
    const a = t[s];
    if (!(a === "\r" && t[s + 1] === `
`))
      if (a === `
`) {
        const { fold: n, offset: r } = Ia(t, s);
        i += n, s = r;
      } else if (a === "\\") {
        let n = t[++s];
        const r = Ca[n];
        if (r) i += r;
        else if (n === `
`)
          for (n = t[s + 1]; n === " " || n === "	"; ) n = t[++s + 1];
        else if (n === "\r" && t[s + 1] === `
`)
          for (n = t[++s + 1]; n === " " || n === "	"; ) n = t[++s + 1];
        else if (n === "x" || n === "u" || n === "U") {
          const o = n === "x" ? 2 : n === "u" ? 4 : 8;
          i += La(t, s + 1, o, e), s += o;
        } else {
          const o = t.substr(s - 1, 2);
          e(s - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${o}`), i += o;
        }
      } else if (a === " " || a === "	") {
        const n = s;
        let r = t[s + 1];
        for (; r === " " || r === "	"; ) r = t[++s + 1];
        r !== `
` && !(r === "\r" && t[s + 2] === `
`) && (i += s > n ? t.slice(n, s + 1) : a);
      } else i += a;
  }
  return (t[t.length - 1] !== '"' || t.length === 1) && e(t.length, "MISSING_CHAR", 'Missing closing "quote'), i;
}
function Ia(t, e) {
  let i = "", s = t[e + 1];
  for (; (s === " " || s === "	" || s === `
` || s === "\r") && !(s === "\r" && t[e + 2] !== `
`); )
    s === `
` && (i += `
`), e += 1, s = t[e + 1];
  return i || (i = " "), {
    fold: i,
    offset: e
  };
}
var Ca = {
  0: "\0",
  a: "\x07",
  b: "\b",
  e: "\x1B",
  f: "\f",
  n: `
`,
  r: "\r",
  t: "	",
  v: "\v",
  N: "",
  _: " ",
  L: "\u2028",
  P: "\u2029",
  " ": " ",
  '"': '"',
  "/": "/",
  "\\": "\\",
  "	": "	"
};
function La(t, e, i, s) {
  const a = t.substr(e, i), n = a.length === i && /^[0-9a-fA-F]+$/.test(a) ? parseInt(a, 16) : NaN;
  try {
    return String.fromCodePoint(n);
  } catch {
    const r = t.substr(e - 2, i + 2);
    return s(e - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${r}`), r;
  }
}
function ps(t, e, i, s) {
  const { value: a, type: n, comment: r, range: o } = e.type === "block-scalar" ? _a(t, e, s) : Ea(e, t.options.strict, s), l = i ? t.directives.tagName(i.source, (d) => s(i, "TAG_RESOLVE_FAILED", d)) : null;
  let c;
  t.options.stringKeys && t.atKey ? c = t.schema[Y] : l ? c = Da(t.schema, a, l, i, s) : e.type === "scalar" ? c = Pa(t, a, e, s) : c = t.schema[Y];
  let p;
  try {
    const d = c.resolve(a, (h) => s(i ?? e, "TAG_RESOLVE_FAILED", h), t.options);
    p = I(d) ? d : new N(d);
  } catch (d) {
    const h = d instanceof Error ? d.message : String(d);
    s(i ?? e, "TAG_RESOLVE_FAILED", h), p = new N(a);
  }
  return p.range = o, p.source = a, n && (p.type = n), l && (p.tag = l), c.format && (p.format = c.format), r && (p.comment = r), p;
}
function Da(t, e, i, s, a) {
  if (i === "!") return t[Y];
  const n = [];
  for (const o of t.tags) if (!o.collection && o.tag === i)
    if (o.default && o.test) n.push(o);
    else return o;
  for (const o of n) if (o.test?.test(e)) return o;
  const r = t.knownTags[i];
  return r && !r.collection ? (t.tags.push(Object.assign({}, r, {
    default: !1,
    test: void 0
  })), r) : (a(s, "TAG_RESOLVE_FAILED", `Unresolved tag: ${i}`, i !== "tag:yaml.org,2002:str"), t[Y]);
}
function Pa({ atKey: t, directives: e, schema: i }, s, a, n) {
  const r = i.tags.find((o) => (o.default === !0 || t && o.default === "key") && o.test?.test(s)) || i[Y];
  if (i.compat) {
    const o = i.compat.find((l) => l.default && l.test?.test(s)) ?? i[Y];
    r.tag !== o.tag && n(a, "TAG_RESOLVE_FAILED", `Value may be parsed as either ${e.tagString(r.tag)} or ${e.tagString(o.tag)}`, !0);
  }
  return r;
}
function Ma(t, e, i) {
  if (e) {
    i ?? (i = e.length);
    for (let s = i - 1; s >= 0; --s) {
      let a = e[s];
      switch (a.type) {
        case "space":
        case "comment":
        case "newline":
          t -= a.source.length;
          continue;
      }
      for (a = e[++s]; a?.type === "space"; )
        t += a.source.length, a = e[++s];
      break;
    }
  }
  return t;
}
var Ra = {
  composeNode: us,
  composeEmptyNode: Vt
};
function us(t, e, i, s) {
  const a = t.atKey, { spaceBefore: n, comment: r, anchor: o, tag: l } = i;
  let c, p = !0;
  switch (e.type) {
    case "alias":
      c = Ba(t, e, s), (o || l) && s(e, "ALIAS_PROPS", "An alias node must not specify any properties");
      break;
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "block-scalar":
      c = ps(t, e, l, s), o && (c.anchor = o.source.substring(1));
      break;
    case "block-map":
    case "block-seq":
    case "flow-collection":
      try {
        c = xa(Ra, t, e, i, s), o && (c.anchor = o.source.substring(1));
      } catch (d) {
        s(e, "RESOURCE_EXHAUSTION", d instanceof Error ? d.message : String(d));
      }
      break;
    default:
      s(e, "UNEXPECTED_TOKEN", e.type === "error" ? e.message : `Unsupported token (type: ${e.type})`), p = !1;
  }
  return c ?? (c = Vt(t, e.offset, void 0, null, i, s)), o && c.anchor === "" && s(o, "BAD_ALIAS", "Anchor cannot be an empty string"), a && t.options.stringKeys && (!I(c) || typeof c.value != "string" || c.tag && c.tag !== "tag:yaml.org,2002:str") && s(l ?? e, "NON_STRING_KEY", "With stringKeys, all keys must be strings"), n && (c.spaceBefore = !0), r && (e.type === "scalar" && e.source === "" ? c.comment = r : c.commentBefore = r), t.options.keepSourceTokens && p && (c.srcToken = e), c;
}
function Vt(t, e, i, s, { spaceBefore: a, comment: n, anchor: r, tag: o, end: l }, c) {
  const p = {
    type: "scalar",
    offset: Ma(e, i, s),
    indent: -1,
    source: ""
  }, d = ps(t, p, o, c);
  return r && (d.anchor = r.source.substring(1), d.anchor === "" && c(r, "BAD_ALIAS", "Anchor cannot be an empty string")), a && (d.spaceBefore = !0), n && (d.comment = n, d.range[2] = l), d;
}
function Ba({ options: t }, { offset: e, source: i, end: s }, a) {
  const n = new Mt(i.substring(1));
  n.source === "" && a(e, "BAD_ALIAS", "Alias cannot be an empty string"), n.source.endsWith(":") && a(e + i.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
  const r = e + i.length, o = je(s, r, t.strict, a);
  return n.range = [
    e,
    r,
    o.offset
  ], o.comment && (n.comment = o.comment), n;
}
function ja(t, e, { offset: i, start: s, value: a, end: n }, r) {
  const o = Object.assign({ _directives: e }, t), l = new os(void 0, o), c = {
    atKey: !1,
    atRoot: !0,
    directives: l.directives,
    options: l.options,
    schema: l.schema
  }, p = me(s, {
    indicator: "doc-start",
    next: a ?? n?.[0],
    offset: i,
    onError: r,
    parentIndent: 0,
    startOnNewline: !0
  });
  p.found && (l.directives.docStart = !0, a && (a.type === "block-map" || a.type === "block-seq") && !p.hasNewline && r(p.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")), l.contents = a ? us(c, a, p, r) : Vt(c, p.end, s, null, p, r);
  const d = l.contents.range[2], h = je(n, d, !1, r);
  return h.comment && (l.comment = h.comment), l.range = [
    i,
    d,
    h.offset
  ], l;
}
function Se(t) {
  if (typeof t == "number") return [t, t + 1];
  if (Array.isArray(t)) return t.length === 2 ? t : [t[0], t[1]];
  const { offset: e, source: i } = t;
  return [e, e + (typeof i == "string" ? i.length : 1)];
}
function pi(t) {
  let e = "", i = !1, s = !1;
  for (let a = 0; a < t.length; ++a) {
    const n = t[a];
    switch (n[0]) {
      case "#":
        e += (e === "" ? "" : s ? `

` : `
`) + (n.substring(1) || " "), i = !0, s = !1;
        break;
      case "%":
        t[a + 1]?.[0] !== "#" && (a += 1), i = !1;
        break;
      default:
        i || (s = !0), i = !1;
    }
  }
  return {
    comment: e,
    afterEmptyLine: s
  };
}
var Ua = class {
  constructor(t = {}) {
    this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (e, i, s, a) => {
      const n = Se(e);
      a ? this.warnings.push(new ba(n, i, s)) : this.errors.push(new Ee(n, i, s));
    }, this.directives = new pe({ version: t.version || "1.2" }), this.options = t;
  }
  decorate(t, e) {
    const { comment: i, afterEmptyLine: s } = pi(this.prelude);
    if (i) {
      const a = t.contents;
      if (e) t.comment = t.comment ? `${t.comment}
${i}` : i;
      else if (s || t.directives.docStart || !a) t.commentBefore = i;
      else if (L(a) && !a.flow && a.items.length > 0) {
        let n = a.items[0];
        C(n) && (n = n.key);
        const r = n.commentBefore;
        n.commentBefore = r ? `${i}
${r}` : i;
      } else {
        const n = a.commentBefore;
        a.commentBefore = n ? `${i}
${n}` : i;
      }
    }
    if (e) {
      for (let a = 0; a < this.errors.length; ++a) t.errors.push(this.errors[a]);
      for (let a = 0; a < this.warnings.length; ++a) t.warnings.push(this.warnings[a]);
    } else
      t.errors = this.errors, t.warnings = this.warnings;
    this.prelude = [], this.errors = [], this.warnings = [];
  }
  streamInfo() {
    return {
      comment: pi(this.prelude).comment,
      directives: this.directives,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  *compose(t, e = !1, i = -1) {
    for (const s of t) yield* this.next(s);
    yield* this.end(e, i);
  }
  *next(t) {
    switch (t.type) {
      case "directive":
        this.directives.add(t.source, (e, i, s) => {
          const a = Se(t);
          a[0] += e, this.onError(a, "BAD_DIRECTIVE", i, s);
        }), this.prelude.push(t.source), this.atDirectives = !0;
        break;
      case "document": {
        const e = ja(this.options, this.directives, t, this.onError);
        this.atDirectives && !e.directives.docStart && this.onError(t, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"), this.decorate(e, !1), this.doc && (yield this.doc), this.doc = e, this.atDirectives = !1;
        break;
      }
      case "byte-order-mark":
      case "space":
        break;
      case "comment":
      case "newline":
        this.prelude.push(t.source);
        break;
      case "error": {
        const e = t.source ? `${t.message}: ${JSON.stringify(t.source)}` : t.message, i = new Ee(Se(t), "UNEXPECTED_TOKEN", e);
        this.atDirectives || !this.doc ? this.errors.push(i) : this.doc.errors.push(i);
        break;
      }
      case "doc-end": {
        if (!this.doc) {
          this.errors.push(new Ee(Se(t), "UNEXPECTED_TOKEN", "Unexpected doc-end without preceding document"));
          break;
        }
        this.doc.directives.docEnd = !0;
        const e = je(t.end, t.offset + t.source.length, this.doc.options.strict, this.onError);
        if (this.decorate(this.doc, !0), e.comment) {
          const i = this.doc.comment;
          this.doc.comment = i ? `${i}
${e.comment}` : e.comment;
        }
        this.doc.range[2] = e.offset;
        break;
      }
      default:
        this.errors.push(new Ee(Se(t), "UNEXPECTED_TOKEN", `Unsupported token ${t.type}`));
    }
  }
  *end(t = !1, e = -1) {
    if (this.doc)
      this.decorate(this.doc, !0), yield this.doc, this.doc = null;
    else if (t) {
      const i = Object.assign({ _directives: this.directives }, this.options), s = new os(void 0, i);
      this.atDirectives && this.onError(e, "MISSING_CHAR", "Missing directives-end indicator line"), s.range = [
        0,
        e,
        e
      ], this.decorate(s, !1), yield s;
    }
  }
}, xt = /* @__PURE__ */ Symbol("break visit"), Ka = /* @__PURE__ */ Symbol("skip children"), fs = /* @__PURE__ */ Symbol("remove item");
function ve(t, e) {
  "type" in t && t.type === "document" && (t = {
    start: t.start,
    value: t.value
  }), gs(Object.freeze([]), t, e);
}
ve.BREAK = xt;
ve.SKIP = Ka;
ve.REMOVE = fs;
ve.itemAtPath = (t, e) => {
  let i = t;
  for (const [s, a] of e) {
    const n = i?.[s];
    if (n && "items" in n) i = n.items[a];
    else return;
  }
  return i;
};
ve.parentCollection = (t, e) => {
  const i = ve.itemAtPath(t, e.slice(0, -1)), s = e[e.length - 1][0], a = i?.[s];
  if (a && "items" in a) return a;
  throw new Error("Parent collection not found");
};
function gs(t, e, i) {
  let s = i(e, t);
  if (typeof s == "symbol") return s;
  for (const a of ["key", "value"]) {
    const n = e[a];
    if (n && "items" in n) {
      for (let r = 0; r < n.items.length; ++r) {
        const o = gs(Object.freeze(t.concat([[a, r]])), n.items[r], i);
        if (typeof o == "number") r = o - 1;
        else {
          if (o === xt) return xt;
          o === fs && (n.items.splice(r, 1), r -= 1);
        }
      }
      typeof s == "function" && a === "key" && (s = s(e, t));
    }
  }
  return typeof s == "function" ? s(e, t) : s;
}
function za(t) {
  switch (t) {
    case "\uFEFF":
      return "byte-order-mark";
    case "":
      return "doc-mode";
    case "":
      return "flow-error-end";
    case "":
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
  switch (t[0]) {
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
function z(t) {
  switch (t) {
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
var ui = /* @__PURE__ */ new Set("0123456789ABCDEFabcdef"), qa = /* @__PURE__ */ new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), qe = /* @__PURE__ */ new Set(",[]{}"), Ha = /* @__PURE__ */ new Set(` ,[]{}
\r	`), vt = (t) => !t || Ha.has(t), Fa = class {
  constructor() {
    this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0;
  }
  *lex(t, e = !1) {
    if (t) {
      if (typeof t != "string") throw TypeError("source is not a string");
      this.buffer = this.buffer ? this.buffer + t : t, this.lineEndPos = null;
    }
    this.atEnd = !e;
    let i = this.next ?? "stream";
    for (; i && (e || this.hasChars(1)); ) i = yield* this.parseNext(i);
  }
  atLineEnd() {
    let t = this.pos, e = this.buffer[t];
    for (; e === " " || e === "	"; ) e = this.buffer[++t];
    return !e || e === "#" || e === `
` ? !0 : e === "\r" ? this.buffer[t + 1] === `
` : !1;
  }
  charAt(t) {
    return this.buffer[this.pos + t];
  }
  continueScalar(t) {
    let e = this.buffer[t];
    if (this.indentNext > 0) {
      let i = 0;
      for (; e === " "; ) e = this.buffer[++i + t];
      if (e === "\r") {
        const s = this.buffer[i + t + 1];
        if (s === `
` || !s && !this.atEnd) return t + i + 1;
      }
      return e === `
` || i >= this.indentNext || !e && !this.atEnd ? t + i : -1;
    }
    if (e === "-" || e === ".") {
      const i = this.buffer.substr(t, 3);
      if ((i === "---" || i === "...") && z(this.buffer[t + 3])) return -1;
    }
    return t;
  }
  getLine() {
    let t = this.lineEndPos;
    return (typeof t != "number" || t !== -1 && t < this.pos) && (t = this.buffer.indexOf(`
`, this.pos), this.lineEndPos = t), t === -1 ? this.atEnd ? this.buffer.substring(this.pos) : null : (this.buffer[t - 1] === "\r" && (t -= 1), this.buffer.substring(this.pos, t));
  }
  hasChars(t) {
    return this.pos + t <= this.buffer.length;
  }
  setNext(t) {
    return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = t, null;
  }
  peek(t) {
    return this.buffer.substr(this.pos, t);
  }
  *parseNext(t) {
    switch (t) {
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
    let t = this.getLine();
    if (t === null) return this.setNext("stream");
    if (t[0] === "\uFEFF" && (yield* this.pushCount(1), t = t.substring(1)), t[0] === "%") {
      let e = t.length, i = t.indexOf("#");
      for (; i !== -1; ) {
        const a = t[i - 1];
        if (a === " " || a === "	") {
          e = i - 1;
          break;
        } else i = t.indexOf("#", i + 1);
      }
      for (; ; ) {
        const a = t[e - 1];
        if (a === " " || a === "	") e -= 1;
        else break;
      }
      const s = (yield* this.pushCount(e)) + (yield* this.pushSpaces(!0));
      return yield* this.pushCount(t.length - s), this.pushNewline(), "stream";
    }
    if (this.atLineEnd()) {
      const e = yield* this.pushSpaces(!0);
      return yield* this.pushCount(t.length - e), yield* this.pushNewline(), "stream";
    }
    return yield "", yield* this.parseLineStart();
  }
  *parseLineStart() {
    const t = this.charAt(0);
    if (!t && !this.atEnd) return this.setNext("line-start");
    if (t === "-" || t === ".") {
      if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
      const e = this.peek(3);
      if ((e === "---" || e === "...") && z(this.charAt(3)))
        return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, e === "---" ? "doc" : "stream";
    }
    return this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !z(this.charAt(1)) && (this.indentNext = this.indentValue), yield* this.parseBlockStart();
  }
  *parseBlockStart() {
    const [t, e] = this.peek(2);
    if (!e && !this.atEnd) return this.setNext("block-start");
    if ((t === "-" || t === "?" || t === ":") && z(e)) {
      const i = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
      return this.indentNext = this.indentValue + 1, this.indentValue += i, "block-start";
    }
    return "doc";
  }
  *parseDocument() {
    yield* this.pushSpaces(!0);
    const t = this.getLine();
    if (t === null) return this.setNext("doc");
    let e = yield* this.pushIndicators();
    switch (t[e]) {
      case "#":
        yield* this.pushCount(t.length - e);
      case void 0:
        return yield* this.pushNewline(), yield* this.parseLineStart();
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), "doc";
      case "*":
        return yield* this.pushUntil(vt), "doc";
      case '"':
      case "'":
        return yield* this.parseQuotedScalar();
      case "|":
      case ">":
        return e += yield* this.parseBlockScalarHeader(), e += yield* this.pushSpaces(!0), yield* this.pushCount(t.length - e), yield* this.pushNewline(), yield* this.parseBlockScalar();
      default:
        return yield* this.parsePlainScalar();
    }
  }
  *parseFlowCollection() {
    let t, e, i = -1;
    do
      t = yield* this.pushNewline(), t > 0 ? (e = yield* this.pushSpaces(!1), this.indentValue = i = e) : e = 0, e += yield* this.pushSpaces(!0);
    while (t + e > 0);
    const s = this.getLine();
    if (s === null) return this.setNext("flow");
    if ((i !== -1 && i < this.indentNext && s[0] !== "#" || i === 0 && (s.startsWith("---") || s.startsWith("...")) && z(s[3])) && !(i === this.indentNext - 1 && this.flowLevel === 1 && (s[0] === "]" || s[0] === "}")))
      return this.flowLevel = 0, yield "", yield* this.parseLineStart();
    let a = 0;
    for (; s[a] === ","; )
      a += yield* this.pushCount(1), a += yield* this.pushSpaces(!0), this.flowKey = !1;
    switch (a += yield* this.pushIndicators(), s[a]) {
      case void 0:
        return "flow";
      case "#":
        return yield* this.pushCount(s.length - a), "flow";
      case "{":
      case "[":
        return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
      case "}":
      case "]":
        return yield* this.pushCount(1), this.flowKey = !0, this.flowLevel -= 1, this.flowLevel ? "flow" : "doc";
      case "*":
        return yield* this.pushUntil(vt), "flow";
      case '"':
      case "'":
        return this.flowKey = !0, yield* this.parseQuotedScalar();
      case ":": {
        const n = this.charAt(1);
        if (this.flowKey || z(n) || n === ",")
          return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
      }
      default:
        return this.flowKey = !1, yield* this.parsePlainScalar();
    }
  }
  *parseQuotedScalar() {
    const t = this.charAt(0);
    let e = this.buffer.indexOf(t, this.pos + 1);
    if (t === "'") for (; e !== -1 && this.buffer[e + 1] === "'"; ) e = this.buffer.indexOf("'", e + 2);
    else for (; e !== -1; ) {
      let a = 0;
      for (; this.buffer[e - 1 - a] === "\\"; ) a += 1;
      if (a % 2 === 0) break;
      e = this.buffer.indexOf('"', e + 1);
    }
    const i = this.buffer.substring(0, e);
    let s = i.indexOf(`
`, this.pos);
    if (s !== -1) {
      for (; s !== -1; ) {
        const a = this.continueScalar(s + 1);
        if (a === -1) break;
        s = i.indexOf(`
`, a);
      }
      s !== -1 && (e = s - (i[s - 1] === "\r" ? 2 : 1));
    }
    if (e === -1) {
      if (!this.atEnd) return this.setNext("quoted-scalar");
      e = this.buffer.length;
    }
    return yield* this.pushToIndex(e + 1, !1), this.flowLevel ? "flow" : "doc";
  }
  *parseBlockScalarHeader() {
    this.blockScalarIndent = -1, this.blockScalarKeep = !1;
    let t = this.pos;
    for (; ; ) {
      const e = this.buffer[++t];
      if (e === "+") this.blockScalarKeep = !0;
      else if (e > "0" && e <= "9") this.blockScalarIndent = Number(e) - 1;
      else if (e !== "-") break;
    }
    return yield* this.pushUntil((e) => z(e) || e === "#");
  }
  *parseBlockScalar() {
    let t = this.pos - 1, e = 0, i;
    e: for (let a = this.pos; i = this.buffer[a]; ++a) switch (i) {
      case " ":
        e += 1;
        break;
      case `
`:
        t = a, e = 0;
        break;
      case "\r": {
        const n = this.buffer[a + 1];
        if (!n && !this.atEnd) return this.setNext("block-scalar");
        if (n === `
`) break;
      }
      default:
        break e;
    }
    if (!i && !this.atEnd) return this.setNext("block-scalar");
    if (e >= this.indentNext) {
      this.blockScalarIndent === -1 ? this.indentNext = e : this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
      do {
        const a = this.continueScalar(t + 1);
        if (a === -1) break;
        t = this.buffer.indexOf(`
`, a);
      } while (t !== -1);
      if (t === -1) {
        if (!this.atEnd) return this.setNext("block-scalar");
        t = this.buffer.length;
      }
    }
    let s = t + 1;
    for (i = this.buffer[s]; i === " "; ) i = this.buffer[++s];
    if (i === "	") {
      for (; i === "	" || i === " " || i === "\r" || i === `
`; ) i = this.buffer[++s];
      t = s - 1;
    } else if (!this.blockScalarKeep) do {
      let a = t - 1, n = this.buffer[a];
      n === "\r" && (n = this.buffer[--a]);
      const r = a;
      for (; n === " "; ) n = this.buffer[--a];
      if (n === `
` && a >= this.pos && a + 1 + e > r) t = a;
      else break;
    } while (!0);
    return yield "", yield* this.pushToIndex(t + 1, !0), yield* this.parseLineStart();
  }
  *parsePlainScalar() {
    const t = this.flowLevel > 0;
    let e = this.pos - 1, i = this.pos - 1, s;
    for (; s = this.buffer[++i]; ) if (s === ":") {
      const a = this.buffer[i + 1];
      if (z(a) || t && qe.has(a)) break;
      e = i;
    } else if (z(s)) {
      let a = this.buffer[i + 1];
      if (s === "\r" && (a === `
` ? (i += 1, s = `
`, a = this.buffer[i + 1]) : e = i), a === "#" || t && qe.has(a)) break;
      if (s === `
`) {
        const n = this.continueScalar(i + 1);
        if (n === -1) break;
        i = Math.max(i, n - 2);
      }
    } else {
      if (t && qe.has(s)) break;
      e = i;
    }
    return !s && !this.atEnd ? this.setNext("plain-scalar") : (yield "", yield* this.pushToIndex(e + 1, !0), t ? "flow" : "doc");
  }
  *pushCount(t) {
    return t > 0 ? (yield this.buffer.substr(this.pos, t), this.pos += t, t) : 0;
  }
  *pushToIndex(t, e) {
    const i = this.buffer.slice(this.pos, t);
    return i ? (yield i, this.pos += i.length, i.length) : (e && (yield ""), 0);
  }
  *pushIndicators() {
    let t = 0;
    e: for (; ; ) {
      switch (this.charAt(0)) {
        case "!":
          t += yield* this.pushTag(), t += yield* this.pushSpaces(!0);
          continue e;
        case "&":
          t += yield* this.pushUntil(vt), t += yield* this.pushSpaces(!0);
          continue e;
        case "-":
        case "?":
        case ":": {
          const e = this.flowLevel > 0, i = this.charAt(1);
          if (z(i) || e && qe.has(i)) {
            e ? this.flowKey && (this.flowKey = !1) : this.indentNext = this.indentValue + 1, t += yield* this.pushCount(1), t += yield* this.pushSpaces(!0);
            continue e;
          }
        }
      }
      break e;
    }
    return t;
  }
  *pushTag() {
    if (this.charAt(1) === "<") {
      let t = this.pos + 2, e = this.buffer[t];
      for (; !z(e) && e !== ">"; ) e = this.buffer[++t];
      return yield* this.pushToIndex(e === ">" ? t + 1 : t, !1);
    } else {
      let t = this.pos + 1, e = this.buffer[t];
      for (; e; ) if (qa.has(e)) e = this.buffer[++t];
      else if (e === "%" && ui.has(this.buffer[t + 1]) && ui.has(this.buffer[t + 2])) e = this.buffer[t += 3];
      else break;
      return yield* this.pushToIndex(t, !1);
    }
  }
  *pushNewline() {
    const t = this.buffer[this.pos];
    return t === `
` ? yield* this.pushCount(1) : t === "\r" && this.charAt(1) === `
` ? yield* this.pushCount(2) : 0;
  }
  *pushSpaces(t) {
    let e = this.pos - 1, i;
    do
      i = this.buffer[++e];
    while (i === " " || t && i === "	");
    const s = e - this.pos;
    return s > 0 && (yield this.buffer.substr(this.pos, s), this.pos = e), s;
  }
  *pushUntil(t) {
    let e = this.pos, i = this.buffer[e];
    for (; !t(i); ) i = this.buffer[++e];
    return yield* this.pushToIndex(e, !1);
  }
}, Ya = class {
  constructor() {
    this.lineStarts = [], this.addNewLine = (t) => this.lineStarts.push(t), this.linePos = (t) => {
      let e = 0, i = this.lineStarts.length;
      for (; e < i; ) {
        const a = e + i >> 1;
        this.lineStarts[a] < t ? e = a + 1 : i = a;
      }
      if (this.lineStarts[e] === t) return {
        line: e + 1,
        col: 1
      };
      if (e === 0) return {
        line: 0,
        col: t
      };
      const s = this.lineStarts[e - 1];
      return {
        line: e,
        col: t - s + 1
      };
    };
  }
};
function Q(t, e) {
  for (let i = 0; i < t.length; ++i) if (t[i].type === e) return !0;
  return !1;
}
function fi(t) {
  for (let e = 0; e < t.length; ++e) switch (t[e].type) {
    case "space":
    case "comment":
    case "newline":
      break;
    default:
      return e;
  }
  return -1;
}
function ms(t) {
  switch (t?.type) {
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
function He(t) {
  switch (t.type) {
    case "document":
      return t.start;
    case "block-map": {
      const e = t.items[t.items.length - 1];
      return e.sep ?? e.start;
    }
    case "block-seq":
      return t.items[t.items.length - 1].start;
    /* istanbul ignore next should not happen */
    default:
      return [];
  }
}
function re(t) {
  if (t.length === 0) return [];
  let e = t.length;
  e: for (; --e >= 0; ) switch (t[e].type) {
    case "doc-start":
    case "explicit-key-ind":
    case "map-value-ind":
    case "seq-item-ind":
    case "newline":
      break e;
  }
  for (; t[++e]?.type === "space"; ) ;
  return t.splice(e, t.length);
}
function et(t, e) {
  if (e.length < 1e5) Array.prototype.push.apply(t, e);
  else for (let i = 0; i < e.length; ++i) t.push(e[i]);
}
function gi(t) {
  if (t.start.type === "flow-seq-start")
    for (const e of t.items) e.sep && !e.value && !Q(e.start, "explicit-key-ind") && !Q(e.sep, "map-value-ind") && (e.key && (e.value = e.key), delete e.key, ms(e.value) ? e.value.end ? et(e.value.end, e.sep) : e.value.end = e.sep : et(e.start, e.sep), delete e.sep);
}
var Va = class {
  constructor(t) {
    this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new Fa(), this.onNewLine = t;
  }
  *parse(t, e = !1) {
    this.onNewLine && this.offset === 0 && this.onNewLine(0);
    for (const i of this.lexer.lex(t, e)) yield* this.next(i);
    e || (yield* this.end());
  }
  *next(t) {
    if (this.source = t, this.atScalar) {
      this.atScalar = !1, yield* this.step(), this.offset += t.length;
      return;
    }
    const e = za(t);
    if (e)
      if (e === "scalar")
        this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
      else {
        switch (this.type = e, yield* this.step(), e) {
          case "newline":
            this.atNewLine = !0, this.indent = 0, this.onNewLine && this.onNewLine(this.offset + t.length);
            break;
          case "space":
            this.atNewLine && t[0] === " " && (this.indent += t.length);
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            this.atNewLine && (this.indent += t.length);
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = !1;
        }
        this.offset += t.length;
      }
    else {
      const i = `Not a YAML token: ${t}`;
      yield* this.pop({
        type: "error",
        offset: this.offset,
        message: i,
        source: t
      }), this.offset += t.length;
    }
  }
  *end() {
    for (; this.stack.length > 0; ) yield* this.pop();
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
    const t = this.peek(1);
    if (this.type === "doc-end" && t?.type !== "doc-end") {
      for (; this.stack.length > 0; ) yield* this.pop();
      this.stack.push({
        type: "doc-end",
        offset: this.offset,
        source: this.source
      });
      return;
    }
    if (!t) return yield* this.stream();
    switch (t.type) {
      case "document":
        return yield* this.document(t);
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return yield* this.scalar(t);
      case "block-scalar":
        return yield* this.blockScalar(t);
      case "block-map":
        return yield* this.blockMap(t);
      case "block-seq":
        return yield* this.blockSequence(t);
      case "flow-collection":
        return yield* this.flowCollection(t);
      case "doc-end":
        return yield* this.documentEnd(t);
    }
    yield* this.pop();
  }
  peek(t) {
    return this.stack[this.stack.length - t];
  }
  *pop(t) {
    const e = t ?? this.stack.pop();
    if (!e) yield {
      type: "error",
      offset: this.offset,
      source: "",
      message: "Tried to pop an empty stack"
    };
    else if (this.stack.length === 0) yield e;
    else {
      const i = this.peek(1);
      switch (e.type === "block-scalar" ? e.indent = "indent" in i ? i.indent : 0 : e.type === "flow-collection" && i.type === "document" && (e.indent = 0), e.type === "flow-collection" && gi(e), i.type) {
        case "document":
          i.value = e;
          break;
        case "block-scalar":
          i.props.push(e);
          break;
        case "block-map": {
          const s = i.items[i.items.length - 1];
          if (s.value) {
            i.items.push({
              start: [],
              key: e,
              sep: []
            }), this.onKeyLine = !0;
            return;
          } else if (s.sep) s.value = e;
          else {
            Object.assign(s, {
              key: e,
              sep: []
            }), this.onKeyLine = !s.explicitKey;
            return;
          }
          break;
        }
        case "block-seq": {
          const s = i.items[i.items.length - 1];
          s.value ? i.items.push({
            start: [],
            value: e
          }) : s.value = e;
          break;
        }
        case "flow-collection": {
          const s = i.items[i.items.length - 1];
          !s || s.value ? i.items.push({
            start: [],
            key: e,
            sep: []
          }) : s.sep ? s.value = e : Object.assign(s, {
            key: e,
            sep: []
          });
          return;
        }
        /* istanbul ignore next should not happen */
        default:
          yield* this.pop(), yield* this.pop(e);
      }
      if ((i.type === "document" || i.type === "block-map" || i.type === "block-seq") && (e.type === "block-map" || e.type === "block-seq")) {
        const s = e.items[e.items.length - 1];
        s && !s.sep && !s.value && s.start.length > 0 && fi(s.start) === -1 && (e.indent === 0 || s.start.every((a) => a.type !== "comment" || a.indent < e.indent)) && (i.type === "document" ? i.end = s.start : i.items.push({ start: s.start }), e.items.splice(-1, 1));
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
        const t = {
          type: "document",
          offset: this.offset,
          start: []
        };
        this.type === "doc-start" && t.start.push(this.sourceToken), this.stack.push(t);
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
  *document(t) {
    if (t.value) return yield* this.lineEnd(t);
    switch (this.type) {
      case "doc-start":
        fi(t.start) !== -1 ? (yield* this.pop(), yield* this.step()) : t.start.push(this.sourceToken);
        return;
      case "anchor":
      case "tag":
      case "space":
      case "comment":
      case "newline":
        t.start.push(this.sourceToken);
        return;
    }
    const e = this.startBlockValue(t);
    e ? this.stack.push(e) : yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML document`,
      source: this.source
    };
  }
  *scalar(t) {
    if (this.type === "map-value-ind") {
      const e = re(He(this.peek(2)));
      let i;
      t.end ? (i = t.end, i.push(this.sourceToken), delete t.end) : i = [this.sourceToken];
      const s = {
        type: "block-map",
        offset: t.offset,
        indent: t.indent,
        items: [{
          start: e,
          key: t,
          sep: i
        }]
      };
      this.onKeyLine = !0, this.stack[this.stack.length - 1] = s;
    } else yield* this.lineEnd(t);
  }
  *blockScalar(t) {
    switch (this.type) {
      case "space":
      case "comment":
      case "newline":
        t.props.push(this.sourceToken);
        return;
      case "scalar":
        if (t.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
          let e = this.source.indexOf(`
`) + 1;
          for (; e !== 0; )
            this.onNewLine(this.offset + e), e = this.source.indexOf(`
`, e) + 1;
        }
        yield* this.pop();
        break;
      /* istanbul ignore next should not happen */
      default:
        yield* this.pop(), yield* this.step();
    }
  }
  *blockMap(t) {
    const e = t.items[t.items.length - 1];
    switch (this.type) {
      case "newline":
        if (this.onKeyLine = !1, e.value) {
          const i = "end" in e.value ? e.value.end : void 0;
          (Array.isArray(i) ? i[i.length - 1] : void 0)?.type === "comment" ? i?.push(this.sourceToken) : t.items.push({ start: [this.sourceToken] });
        } else e.sep ? e.sep.push(this.sourceToken) : e.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (e.value) t.items.push({ start: [this.sourceToken] });
        else if (e.sep) e.sep.push(this.sourceToken);
        else {
          if (this.atIndentedComment(e.start, t.indent)) {
            const i = t.items[t.items.length - 2]?.value?.end;
            if (Array.isArray(i)) {
              et(i, e.start), i.push(this.sourceToken), t.items.pop();
              return;
            }
          }
          e.start.push(this.sourceToken);
        }
        return;
    }
    if (this.indent >= t.indent) {
      const i = !this.onKeyLine && this.indent === t.indent, s = i && (e.sep || e.explicitKey) && this.type !== "seq-item-ind";
      let a = [];
      if (s && e.sep && !e.value) {
        const n = [];
        for (let r = 0; r < e.sep.length; ++r) {
          const o = e.sep[r];
          switch (o.type) {
            case "newline":
              n.push(r);
              break;
            case "space":
              break;
            case "comment":
              o.indent > t.indent && (n.length = 0);
              break;
            default:
              n.length = 0;
          }
        }
        n.length >= 2 && (a = e.sep.splice(n[1]));
      }
      switch (this.type) {
        case "anchor":
        case "tag":
          s || e.value ? (a.push(this.sourceToken), t.items.push({ start: a }), this.onKeyLine = !0) : e.sep ? e.sep.push(this.sourceToken) : e.start.push(this.sourceToken);
          return;
        case "explicit-key-ind":
          !e.sep && !e.explicitKey ? (e.start.push(this.sourceToken), e.explicitKey = !0) : s || e.value ? (a.push(this.sourceToken), t.items.push({
            start: a,
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
          if (e.explicitKey)
            if (e.sep)
              if (e.value) t.items.push({
                start: [],
                key: null,
                sep: [this.sourceToken]
              });
              else if (Q(e.sep, "map-value-ind")) this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{
                  start: a,
                  key: null,
                  sep: [this.sourceToken]
                }]
              });
              else if (ms(e.key) && !Q(e.sep, "newline")) {
                const n = re(e.start), r = e.key, o = e.sep;
                o.push(this.sourceToken), delete e.key, delete e.sep, this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{
                    start: n,
                    key: r,
                    sep: o
                  }]
                });
              } else a.length > 0 ? e.sep = e.sep.concat(a, this.sourceToken) : e.sep.push(this.sourceToken);
            else if (Q(e.start, "newline")) Object.assign(e, {
              key: null,
              sep: [this.sourceToken]
            });
            else {
              const n = re(e.start);
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{
                  start: n,
                  key: null,
                  sep: [this.sourceToken]
                }]
              });
            }
          else e.sep ? e.value || s ? t.items.push({
            start: a,
            key: null,
            sep: [this.sourceToken]
          }) : Q(e.sep, "map-value-ind") ? this.stack.push({
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{
              start: [],
              key: null,
              sep: [this.sourceToken]
            }]
          }) : e.sep.push(this.sourceToken) : Object.assign(e, {
            key: null,
            sep: [this.sourceToken]
          });
          this.onKeyLine = !0;
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const n = this.flowScalar(this.type);
          s || e.value ? (t.items.push({
            start: a,
            key: n,
            sep: []
          }), this.onKeyLine = !0) : e.sep ? this.stack.push(n) : (Object.assign(e, {
            key: n,
            sep: []
          }), this.onKeyLine = !0);
          return;
        }
        default: {
          const n = this.startBlockValue(t);
          if (n) {
            if (n.type === "block-seq") {
              if (!e.explicitKey && e.sep && !Q(e.sep, "newline")) {
                yield* this.pop({
                  type: "error",
                  offset: this.offset,
                  message: "Unexpected block-seq-ind on same line with key",
                  source: this.source
                });
                return;
              }
            } else i && t.items.push({ start: a });
            this.stack.push(n);
            return;
          }
        }
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *blockSequence(t) {
    const e = t.items[t.items.length - 1];
    switch (this.type) {
      case "newline":
        if (e.value) {
          const i = "end" in e.value ? e.value.end : void 0;
          (Array.isArray(i) ? i[i.length - 1] : void 0)?.type === "comment" ? i?.push(this.sourceToken) : t.items.push({ start: [this.sourceToken] });
        } else e.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (e.value) t.items.push({ start: [this.sourceToken] });
        else {
          if (this.atIndentedComment(e.start, t.indent)) {
            const i = t.items[t.items.length - 2]?.value?.end;
            if (Array.isArray(i)) {
              et(i, e.start), i.push(this.sourceToken), t.items.pop();
              return;
            }
          }
          e.start.push(this.sourceToken);
        }
        return;
      case "anchor":
      case "tag":
        if (e.value || this.indent <= t.indent) break;
        e.start.push(this.sourceToken);
        return;
      case "seq-item-ind":
        if (this.indent !== t.indent) break;
        e.value || Q(e.start, "seq-item-ind") ? t.items.push({ start: [this.sourceToken] }) : e.start.push(this.sourceToken);
        return;
    }
    if (this.indent > t.indent) {
      const i = this.startBlockValue(t);
      if (i) {
        this.stack.push(i);
        return;
      }
    }
    yield* this.pop(), yield* this.step();
  }
  *flowCollection(t) {
    const e = t.items[t.items.length - 1];
    if (this.type === "flow-error-end") {
      let i;
      do
        yield* this.pop(), i = this.peek(1);
      while (i?.type === "flow-collection");
    } else if (t.end.length === 0) {
      switch (this.type) {
        case "comma":
        case "explicit-key-ind":
          !e || e.sep ? t.items.push({ start: [this.sourceToken] }) : e.start.push(this.sourceToken);
          return;
        case "map-value-ind":
          !e || e.value ? t.items.push({
            start: [],
            key: null,
            sep: [this.sourceToken]
          }) : e.sep ? e.sep.push(this.sourceToken) : Object.assign(e, {
            key: null,
            sep: [this.sourceToken]
          });
          return;
        case "space":
        case "comment":
        case "newline":
        case "anchor":
        case "tag":
          !e || e.value ? t.items.push({ start: [this.sourceToken] }) : e.sep ? e.sep.push(this.sourceToken) : e.start.push(this.sourceToken);
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const s = this.flowScalar(this.type);
          !e || e.value ? t.items.push({
            start: [],
            key: s,
            sep: []
          }) : e.sep ? this.stack.push(s) : Object.assign(e, {
            key: s,
            sep: []
          });
          return;
        }
        case "flow-map-end":
        case "flow-seq-end":
          t.end.push(this.sourceToken);
          return;
      }
      const i = this.startBlockValue(t);
      i ? this.stack.push(i) : (yield* this.pop(), yield* this.step());
    } else {
      const i = this.peek(2);
      if (i.type === "block-map" && (this.type === "map-value-ind" && i.indent === t.indent || this.type === "newline" && !i.items[i.items.length - 1].sep))
        yield* this.pop(), yield* this.step();
      else if (this.type === "map-value-ind" && i.type !== "flow-collection") {
        const s = re(He(i));
        gi(t);
        const a = t.end.splice(1, t.end.length);
        a.push(this.sourceToken);
        const n = {
          type: "block-map",
          offset: t.offset,
          indent: t.indent,
          items: [{
            start: s,
            key: t,
            sep: a
          }]
        };
        this.onKeyLine = !0, this.stack[this.stack.length - 1] = n;
      } else yield* this.lineEnd(t);
    }
  }
  flowScalar(t) {
    if (this.onNewLine) {
      let e = this.source.indexOf(`
`) + 1;
      for (; e !== 0; )
        this.onNewLine(this.offset + e), e = this.source.indexOf(`
`, e) + 1;
    }
    return {
      type: t,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  startBlockValue(t) {
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
        const e = re(He(t));
        return e.push(this.sourceToken), {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{
            start: e,
            explicitKey: !0
          }]
        };
      }
      case "map-value-ind": {
        this.onKeyLine = !0;
        const e = re(He(t));
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{
            start: e,
            key: null,
            sep: [this.sourceToken]
          }]
        };
      }
    }
    return null;
  }
  atIndentedComment(t, e) {
    return this.type !== "comment" || this.indent <= e ? !1 : t.every((i) => i.type === "newline" || i.type === "space");
  }
  *documentEnd(t) {
    this.type !== "doc-mode" && (t.end ? t.end.push(this.sourceToken) : t.end = [this.sourceToken], this.type === "newline" && (yield* this.pop()));
  }
  *lineEnd(t) {
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
        t.end ? t.end.push(this.sourceToken) : t.end = [this.sourceToken], this.type === "newline" && (yield* this.pop());
    }
  }
};
function Wa(t) {
  const e = t.prettyErrors !== !1;
  return {
    lineCounter: t.lineCounter || e && new Ya() || null,
    prettyErrors: e
  };
}
function Ga(t, e = {}) {
  const { lineCounter: i, prettyErrors: s } = Wa(e), a = new Va(i?.addNewLine), n = new Ua(e);
  let r = null;
  for (const o of n.compose(a.parse(t), !0, t.length)) if (!r) r = o;
  else if (r.options.logLevel !== "silent") {
    r.errors.push(new Ee(o.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
    break;
  }
  return s && i && (r.errors.forEach(di(t, i)), r.warnings.forEach(di(t, i))), r;
}
function mi(t, e, i) {
  let s;
  typeof e == "function" ? s = e : i === void 0 && e && typeof e == "object" && (i = e);
  const a = Ga(t, i);
  if (!a) return null;
  if (a.warnings.forEach((n) => Ri(a.options.logLevel, n)), a.errors.length > 0) {
    if (a.options.logLevel !== "silent") throw a.errors[0];
    a.errors = [];
  }
  return a.toJS(Object.assign({ reviver: s }, i));
}
function b(t, e, i, s) {
  var a = arguments.length, n = a < 3 ? e : s === null ? s = Object.getOwnPropertyDescriptor(e, i) : s, r;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") n = Reflect.decorate(t, e, i, s);
  else for (var o = t.length - 1; o >= 0; o--) (r = t[o]) && (n = (a < 3 ? r(n) : a > 3 ? r(e, i, n) : r(e, i)) || n);
  return a > 3 && n && Object.defineProperty(e, i, n), n;
}
var Qa = [
  "Already handled",
  "Wrong entity or evidence",
  "Not useful for this home",
  "Too intrusive",
  "Maybe later"
], Ja = [
  "weekday.monday",
  "weekday.tuesday",
  "weekday.wednesday",
  "weekday.thursday",
  "weekday.friday",
  "weekday.saturday",
  "weekday.sunday"
], Xa = {
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
function Za(t, e) {
  const i = `component.haos_ai.common.${e.replaceAll(".", "_")}`, s = t?.localize?.(i);
  return s && s !== i ? s : Xa[e] ?? e;
}
function en(t, e) {
  const i = t.replace(/\s+$/, "").split(`
`), s = e.replace(/\s+$/, "").split(`
`), a = Array.from({ length: i.length + 1 }, () => new Array(s.length + 1).fill(0));
  for (let l = i.length - 1; l >= 0; l--) for (let c = s.length - 1; c >= 0; c--) a[l][c] = i[l] === s[c] ? a[l + 1][c + 1] + 1 : Math.max(a[l + 1][c], a[l][c + 1]);
  const n = [];
  let r = 0, o = 0;
  for (; r < i.length && o < s.length; ) i[r] === s[o] ? (n.push({
    type: "same",
    text: i[r]
  }), r++, o++) : a[r + 1][o] >= a[r][o + 1] ? (n.push({
    type: "removed",
    text: i[r]
  }), r++) : (n.push({
    type: "added",
    text: s[o]
  }), o++);
  for (; r < i.length; r++) n.push({
    type: "removed",
    text: i[r]
  });
  for (; o < s.length; o++) n.push({
    type: "added",
    text: s[o]
  });
  return n;
}
var y = class extends Oe {
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
      const i = this.selected?.automation?.yaml ?? "";
      this.draftYaml = i, this.draftValidation = this.selected?.automation?.validation, this.draftError = "", this.draftDirty = !1;
    }
  }
  start() {
    !this.hass || this.started || (this.started = !0, this.subscribeToProgress(), this.loadOverview());
  }
  async subscribeToProgress() {
    this.hass?.connection.subscribeEvents && (this.unsubscribeProgress = await this.hass.connection.subscribeEvents((e) => {
      this.progress = e.data, this.busy = e.data.stage !== "complete", e.data.stage === "complete" && (this.progressTimer && window.clearTimeout(this.progressTimer), this.progressTimer = window.setTimeout(() => {
        this.progress = void 0, this.busy = !1;
      }, 1400));
    }, "haos_ai_progress"));
  }
  async call(e, i = {}) {
    if (!this.hass) throw new Error("Home Assistant is not ready");
    return this.hass.connection.sendMessagePromise({
      type: e,
      ...i
    });
  }
  t(e) {
    return Za(this.hass, e);
  }
  describeError(e) {
    return e instanceof Error ? e.message : typeof e == "object" && e && "message" in e ? String(e.message) : "Something went wrong. Check Home Assistant logs for details.";
  }
  async loadOverview() {
    if (!this.hass) return;
    const e = this.overview !== void 0, i = ++this.overviewRequest;
    e || (this.loading = !0);
    try {
      const s = await this.call("haos_ai/overview");
      if (i !== this.overviewRequest) return;
      this.overview = s, e || this.hydrateSettings(s), this.syncDraft(s), this.threads = Array.isArray(s.threads) ? s.threads : [], this.selectedId && !s.suggestions.some((a) => a.id === this.selectedId) && (this.selectedId = void 0, this.filter !== "all" && !s.suggestions.some((a) => a.status === this.filter) && (this.filter = "all")), this.error = "";
    } catch (s) {
      this.error = this.describeError(s);
    } finally {
      e || (this.loading = !1);
    }
  }
  syncDraft(e) {
    if (!this.selectedId || this.draftDirty) return;
    const i = e.suggestions.find((s) => s.id === this.selectedId);
    i?.automation && (this.draftYaml = i.automation.yaml ?? "", this.draftValidation = i.automation.validation, this.draftError = "");
  }
  hydrateSettings(e) {
    const i = e.preferences;
    this.selectedGoals = [...i.goals ?? []], this.ignoredEntities = [...i.ignored_entities ?? []], this.ignoredDomains = [...i.ignored_domains ?? []], this.ignoredAreas = [...i.ignored_areas ?? []], this.ignoredLabels = [...i.ignored_labels ?? []], this.monthlyTokenBudget = i.monthly_token_budget ?? 0, this.advisorMode = i.advisor_mode ?? "balanced", this.scanDepth = i.scan_depth ?? "standard", this.automationComplexity = i.automation_complexity ?? "normal", this.fixExistingFirst = i.fix_existing_first !== !1, this.avoidNewHardware = i.avoid_new_hardware !== !1, this.changePermissions = {
      create_automations: i.change_permissions?.create_automations === !0,
      update_automations: i.change_permissions?.update_automations === !0,
      remove_entities: i.change_permissions?.remove_entities === !0,
      remove_devices: i.change_permissions?.remove_devices === !0
    }, this.quietStart = i.quiet_hours?.start ?? "22:00", this.quietEnd = i.quiet_hours?.end ?? "07:00", this.providerDraft = this.resolveProvider(e), this.modelDraft = e.model, this.baseUrlDraft = e.base_url, this.apiKeyDraft = "";
    const s = e.scan_profile;
    this.scanProfileEnabled = s?.enabled === !0;
    const a = e.provider_options[0]?.id ?? this.providerDraft;
    this.scanProviderDraft = s?.provider ?? a, this.scanModelDraft = s?.model ?? "", this.scanBaseUrlDraft = s?.base_url ?? "", this.scanApiKeyDraft = "", this.historyDays = e.options.history_days ?? 30, this.includeExactLocation = e.options.include_exact_location === !0, this.schedule = e.options.schedule ?? "manual", this.scheduleTime = (e.options.schedule_time ?? "03:00:00").slice(0, 5), this.scheduleWeekday = e.options.schedule_weekday ?? 0, this.notifyNewSuggestions = e.options.notify_new_suggestions !== !1;
  }
  resolveProvider(e) {
    const i = e.base_url.toLocaleLowerCase(), s = e.model.toLocaleLowerCase(), a = e.provider_options.find((n) => n.id !== "openai_compatible" && n.default_base_url && i.startsWith(n.default_base_url.toLocaleLowerCase()) ? !0 : n.id === "deepseek" && s.startsWith("deepseek"));
    return a ? a.id : e.provider_options.find((n) => n.id === e.provider)?.id ?? e.provider_options[0]?.id ?? "openai";
  }
  get filteredSuggestions() {
    const e = this.overview?.suggestions ?? [];
    return this.filter === "all" ? e : e.filter((i) => i.status === this.filter);
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
      progress: 0.05
    }, this.error = "";
    try {
      await this.call("haos_ai/scan", { confirm_context: !0 }), await this.loadOverview(), this.filter = "new", this.tab === "activity" && await this.loadActivity();
    } catch (e) {
      this.error = this.describeError(e), this.progress = void 0;
    } finally {
      this.busy = !1;
    }
  }
  async updateSuggestion(e, i, s) {
    this.busy = !0;
    try {
      await this.call("haos_ai/suggestion/update", {
        suggestion_id: e,
        status: i,
        ...s ? { reason: s } : {}
      }), await this.loadOverview(), i === "dismissed" && (this.selectedId = void 0);
    } catch (a) {
      this.error = this.describeError(a);
    } finally {
      this.busy = !1;
    }
  }
  openFeedback(e) {
    this.selectedId = e.id, this.feedbackReason = "", this.feedbackNote = "", this.dialog = "feedback";
  }
  async submitFeedback() {
    const e = this.selected;
    if (!e || !this.feedbackReason) return;
    const i = [this.feedbackReason, this.feedbackNote.trim()].filter(Boolean).join(": ");
    this.dialog = null, await this.updateSuggestion(e.id, "dismissed", i);
  }
  async loadThreads() {
    try {
      const e = await this.call("haos_ai/chat/threads");
      this.threads = Array.isArray(e) ? e : [];
    } catch (e) {
      this.error = this.describeError(e);
    }
  }
  async loadThread() {
    try {
      const e = await this.call("haos_ai/chat/thread", { thread_id: this.threadId });
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
    const e = this.threads.find((i) => i.id === this.threadId);
    this.renameText = e?.title ?? "Conversation", this.dialog = "rename";
  }
  async renameThread() {
    const e = this.renameText.trim();
    if (e) {
      this.dialog = null;
      try {
        await this.call("haos_ai/chat/thread/rename", {
          thread_id: this.threadId,
          title: e
        }), await this.loadThreads();
      } catch (i) {
        this.error = this.describeError(i);
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
    const e = this.chatText.trim();
    if (!(!e || this.busy)) {
      this.chatText = "", this.chat = [...this.chat, {
        id: `pending-${Date.now()}`,
        role: "user",
        content: e,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }], this.busy = !0, this.progress = { stage: "provider" }, this.error = "";
      try {
        const i = await this.call("haos_ai/chat", {
          thread_id: this.threadId,
          text: e
        });
        this.chat = [...this.chat, i.message], await this.loadThreads();
      } catch (i) {
        this.error = this.describeError(i), await this.loadThread();
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
    } catch (i) {
      this.error = this.describeError(i);
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
        }), this.apiKeyDraft = "", this.scanApiKeyDraft = "", this.settingsNotice = "Connection verified and saved. HAOS AI is reloading…", window.setTimeout(() => {
          this.loadOverview();
        }, 1600);
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
      await this.call("haos_ai/options/update", { options: this.connectionOptions() }), this.settingsNotice = "Privacy and schedule settings saved.", window.setTimeout(() => {
        this.loadOverview();
      }, 1200);
    } catch (e) {
      this.error = this.describeError(e);
    } finally {
      this.busy = !1;
    }
  }
  toggleGoal(e) {
    this.selectedGoals = this.selectedGoals.includes(e) ? this.selectedGoals.filter((i) => i !== e) : [...this.selectedGoals, e], this.settingsNotice = "";
  }
  providerChanged(e) {
    const i = this.overview?.provider_options.find((r) => r.id === this.providerDraft), s = this.overview?.provider_options.find((r) => r.id === e), a = !this.modelDraft || this.modelDraft === i?.default_model, n = !this.baseUrlDraft || this.baseUrlDraft === i?.default_base_url;
    this.providerDraft = e, s && a && (this.modelDraft = s.default_model), s && n && (this.baseUrlDraft = s.default_base_url), this.apiKeyDraft = "", this.settingsNotice = "";
  }
  openClearInbox() {
    this.filteredSuggestions.length !== 0 && (this.dialog = "clear-inbox");
  }
  async clearInbox() {
    const e = this.filter === "all" ? void 0 : this.filter;
    this.dialog = null, this.busy = !0;
    try {
      await this.call("haos_ai/suggestions/clear", { ...e ? { status: e } : {} }), this.selectedId = void 0, await this.loadOverview();
    } catch (i) {
      this.error = this.describeError(i);
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
    if (e.operation)
      return {
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
    const i = this.changeFor(e);
    !i || !this.canApply(i) || (this.pendingChange = i, this.diffLines = void 0, this.diffError = "", this.dialog = "approve-change", i.kind === "update_automation" && this.loadDiff(i.targetId));
  }
  async loadDiff(e) {
    this.diffLoading = !0, this.diffError = "";
    try {
      const i = await this.call("haos_ai/automation/current", { automation_id: e });
      if (!i.found) {
        this.diffError = this.t("diff.unavailable");
        return;
      }
      this.diffLines = en(i.yaml, this.draftYaml);
    } catch (i) {
      this.diffError = this.describeError(i);
    } finally {
      this.diffLoading = !1;
    }
  }
  async approveChange() {
    const e = this.pendingChange;
    if (!e || !this.canApply(e) || !this.hass) return;
    const i = e.kind === "create_automation" || e.kind === "update_automation";
    this.dialogPending = !0, this.busy = !0, this.error = "";
    try {
      let s;
      if (i) {
        if (!this.draftValidation?.valid) throw new Error("Validate the current automation draft before approval.");
        if (s = mi(this.draftYaml), !s || typeof s != "object" || Array.isArray(s)) throw new Error("Automation YAML must contain one object.");
      } else if (e.kind === "remove_device" && !e.configEntryId) throw new Error("The device's integration reference is missing.");
      await this.call("haos_ai/change/apply", {
        suggestion_id: e.suggestionId,
        confirm: !0,
        operation: e.kind,
        ...i ? { config: s } : {}
      }), this.pendingChange = void 0, this.diffLines = void 0, this.draftDirty = !1, this.dialog = null, this.settingsNotice = "Approved change applied by Home Assistant.", await this.loadOverview(), this.tab === "activity" && await this.loadActivity();
    } catch (s) {
      this.error = this.describeError(s), this.dialog = null;
    } finally {
      this.busy = !1, this.dialogPending = !1;
    }
  }
  get matchingEntities() {
    const e = this.ignoredEntityQuery.trim().toLocaleLowerCase();
    return e ? Object.values(this.hass?.states ?? {}).filter((i) => !this.ignoredEntities.includes(i.entity_id)).filter((i) => {
      const s = i.attributes.friendly_name ?? "";
      return `${i.entity_id} ${s}`.toLocaleLowerCase().includes(e);
    }).slice(0, 8) : [];
  }
  addIgnoredEntities(e) {
    const i = [], s = [];
    for (const a of e) {
      const n = a.trim().replace(/^['"]|['"]$/g, "");
      n && (/^[a-z0-9_]+\.[a-z0-9_]+$/.test(n) ? i.push(n) : s.push(n));
    }
    this.ignoredEntities = [...this.ignoredEntities, ...i.filter((a) => !this.ignoredEntities.includes(a))], this.ignoredEntityError = s.length ? `Could not add: ${s.slice(0, 3).join(", ")}` : "", this.ignoredEntityQuery = "", this.settingsNotice = "";
  }
  get availableDomains() {
    const e = /* @__PURE__ */ new Set();
    for (const i of Object.keys(this.hass?.states ?? {})) {
      const s = i.split(".", 1)[0];
      s && !this.ignoredDomains.includes(s) && e.add(s);
    }
    return [...e].sort();
  }
  get availableAreas() {
    return Object.values(this.hass?.areas ?? {}).filter((e) => !this.ignoredAreas.includes(e.area_id)).sort((e, i) => e.name.localeCompare(i.name));
  }
  get availableLabels() {
    const e = /* @__PURE__ */ new Set();
    for (const i of Object.values(this.hass?.entities ?? {})) for (const s of i.labels ?? []) this.ignoredLabels.includes(s) || e.add(s);
    return [...e].sort();
  }
  areaName(e) {
    return this.hass?.areas?.[e]?.name ?? e;
  }
  addIgnoredScope(e, i) {
    const s = i.trim();
    s && (e === "domains" ? (this.ignoredDomains.includes(s) || (this.ignoredDomains = [...this.ignoredDomains, s]), this.ignoredDomainQuery = "") : e === "areas" ? (this.ignoredAreas.includes(s) || (this.ignoredAreas = [...this.ignoredAreas, s]), this.ignoredAreaQuery = "") : (this.ignoredLabels.includes(s) || (this.ignoredLabels = [...this.ignoredLabels, s]), this.ignoredLabelQuery = ""), this.settingsNotice = "");
  }
  removeIgnoredScope(e, i) {
    e === "domains" ? this.ignoredDomains = this.ignoredDomains.filter((s) => s !== i) : e === "areas" ? this.ignoredAreas = this.ignoredAreas.filter((s) => s !== i) : this.ignoredLabels = this.ignoredLabels.filter((s) => s !== i), this.settingsNotice = "";
  }
  handleEntityKeydown(e) {
    const i = this.matchingEntities;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!i.length) return;
      e.preventDefault();
      const a = e.key === "ArrowDown" ? 1 : -1, n = this.entityHighlight + a;
      this.entityHighlight = (n + i.length) % i.length;
      return;
    }
    if (e.key === "Escape") {
      this.entityHighlight = -1;
      return;
    }
    if (e.key !== "Enter" && e.key !== ",") return;
    e.preventDefault();
    const s = this.entityHighlight >= 0 ? i[this.entityHighlight] : i[0];
    this.addIgnoredEntities([s?.entity_id ?? this.ignoredEntityQuery.trim()]);
  }
  handleEntityPaste(e) {
    const i = (e.clipboardData?.getData("text") ?? "").split(/[\s,;]+/).filter(Boolean);
    i.some((s) => s.includes(".")) && (e.preventDefault(), this.addIgnoredEntities(i));
  }
  async validateDraft() {
    this.draftError = "";
    let e;
    try {
      e = mi(this.draftYaml);
    } catch (i) {
      this.draftError = `YAML syntax: ${this.describeError(i)}`;
      return;
    }
    if (!e || typeof e != "object" || Array.isArray(e)) {
      this.draftError = "Automation YAML must contain one object.";
      return;
    }
    this.busy = !0;
    try {
      const i = await this.call("haos_ai/automation/validate", { config: e });
      this.draftYaml = i.yaml, this.draftValidation = i.validation, this.draftDirty = !0;
    } catch (i) {
      this.draftError = this.describeError(i);
    } finally {
      this.busy = !1;
    }
  }
  async copyYaml(e = this.draftYaml) {
    await navigator.clipboard.writeText(e), this.copied = !0, window.setTimeout(() => this.copied = !1, 1600);
  }
  downloadYaml(e) {
    if (!this.draftYaml) return;
    const i = new Blob([this.draftYaml], { type: "application/x-yaml" }), s = URL.createObjectURL(i), a = document.createElement("a");
    a.href = s, a.download = `${e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "automation"}.yaml`, a.click(), URL.revokeObjectURL(s);
  }
  async copyAndOpenEditor() {
    await this.copyYaml(), this.navigate("/config/automation/new");
  }
  reviseInChat(e) {
    this.newThread(), this.chatText = `Help me revise this proposed automation. Keep it read only, explain the changes, and return one complete Home Assistant YAML block.

Title: ${e.title}

Current YAML:
\`\`\`yaml
${this.draftYaml}
\`\`\``, this.changeTab("chat");
  }
  extractYaml(e) {
    return e.match(/```(?:yaml|yml)?\s*\n([\s\S]*?)```/i)?.[1].trim();
  }
  useChatYaml(e) {
    const i = this.extractYaml(e);
    !i || !this.selected || (this.draftYaml = i, this.draftValidation = void 0, this.draftError = "", this.draftDirty = !0, this.tab = "inbox");
  }
  navigate(e) {
    window.history.pushState(null, "", e), window.dispatchEvent(new Event("location-changed"));
  }
  evidencePath(e) {
    const i = e.source_id;
    if (e.source_type === "history" && i.includes(".")) return `/history?entity_id=${encodeURIComponent(i)}`;
    if ([
      "entity",
      "registry",
      "automation"
    ].includes(e.source_type) && i.includes(".")) return `/config/entities/entity/${encodeURIComponent(i)}`;
    if (e.source_type === "integration" && i) return `/config/integrations/integration/${encodeURIComponent(i)}`;
  }
  firstUpdated() {
    this.tab === "chat" && this.loadThread();
  }
  changeTab(e) {
    this.tab = e, e === "chat" && (this.loadThreads(), this.chat.length === 0 && this.loadThread()), e === "activity" && this.loadActivity();
  }
  render() {
    return f`
      <div class="shell">
        ${this.renderHeader()}
        ${this.progress ? this.renderProgress() : x}
        ${this.renderBudgetBanner()}
        <main>
          ${this.error ? this.renderAlert() : x}
          ${this.loading ? this.renderLoading() : this.tab === "inbox" ? this.renderInbox() : this.tab === "chat" ? this.renderChat() : this.tab === "activity" ? this.renderActivity() : this.renderSettings()}
        </main>
      </div>
      ${this.preview ? this.renderPreviewDialog() : x}
      ${this.dialog ? this.renderActionDialog() : x}
    `;
  }
  renderHeader() {
    return f`
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
    const e = this.budget;
    return !e?.budget || !e.warning && !e.exceeded ? x : f`
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
    return f`
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
  navButton(e, i, s) {
    return f`
      <button
        role="tab"
        class=${this.tab === e ? "active" : ""}
        aria-selected=${this.tab === e ? "true" : "false"}
        @click=${() => this.changeTab(e)}
      >
        ${i}${s ? f`<span class="count">${s}</span>` : x}
      </button>
    `;
  }
  renderProgress() {
    const e = Math.max(0, Math.min(1, this.progress?.progress ?? 0.5));
    return f`
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
    return f`
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
    return f`
      <section class="loading-state" aria-busy="true">
        ${this.renderLogo()}
        <p>Loading HAOS AI…</p>
      </section>
    `;
  }
  renderInbox() {
    const e = this.filteredSuggestions;
    return f`
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
    ].map((i) => f`
                <button
                  class=${this.filter === i ? "active" : ""}
                  aria-pressed=${this.filter === i ? "true" : "false"}
                  @click=${() => {
      this.filter = i, this.selectedId = void 0;
    }}
                >
                  ${i}
                  <span>
                    ${i === "all" ? this.overview?.suggestions.length ?? 0 : this.overview?.counts[i] ?? 0}
                  </span>
                </button>
              `)}
          </div>
          <div class="suggestion-list">
            ${e.length === 0 ? f`
                  <div class="empty compact">
                    <ha-icon icon="mdi:inbox-outline"></ha-icon>
                    <h3>No ${this.filter === "all" ? "" : this.filter} suggestions</h3>
                    <p>
                      ${this.filter === "new" ? "Run a scan when you want the advisor to look for useful routines and setup issues." : "Items you organise here remain local to Home Assistant."}
                    </p>
                  </div>
                ` : e.map((i) => this.renderSuggestionRow(i))}
          </div>
        </aside>
        <article class="detail-pane">
          ${this.selected ? this.renderSuggestionDetail(this.selected) : f`
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
    return f`
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
    const i = this.draftValidation ?? e.automation?.validation, s = this.changeFor(e), a = s ? this.canApply(s) : !1, n = e.automation?.explanation ?? e.automation?.config?.description ?? e.summary;
    return f`
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
            ${e.evidence.map((r) => this.renderEvidence(r))}
          </div>
        </section>

        ${e.automation ? f`
              <section class="detail-section">
                <h3>What the automation does</h3>
                <p>${n}</p>
              </section>
              <section class="detail-section yaml-section">
                <div class="section-heading">
                  <div>
                    <h3>Automation draft</h3>
                    <p>Edit locally and validate again before copying.</p>
                  </div>
                  <span
                    class="status-badge ${i?.valid ? "valid" : "invalid"}"
                  >
                    ${i?.valid ? "Validated" : "Check YAML"}
                  </span>
                </div>
                ${this.draftError ? f`<div class="inline-error" role="alert">${this.draftError}</div>` : x}
                ${i && !i.valid ? f`
                      <div class="validation-errors">
                        ${Object.entries(i.errors).map(([r, o]) => f`<p><strong>${r}:</strong> ${o}</p>`)}
                      </div>
                    ` : x}
                <textarea
                  class="yaml-editor"
                  aria-label="Automation YAML"
                  spellcheck="false"
                  .value=${this.draftYaml}
                  @input=${(r) => {
      this.draftYaml = r.target.value, this.draftValidation = void 0, this.draftDirty = !0;
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
            ` : x}

        <footer class="decision-bar">
          <span>
            <ha-icon icon="mdi:shield-lock-outline"></ha-icon>
            ${s && a ? "No automatic writes. Every change requires your approval." : "HAOS AI is read-only unless you enable an approval capability."}
          </span>
          <div class="decision-actions">
            ${e.status !== "dismissed" ? f`
                  <ha-button appearance="plain" @click=${() => this.openFeedback(e)}>
                    Dismiss
                  </ha-button>
                ` : f`
                  <ha-button
                    appearance="plain"
                    @click=${() => this.updateSuggestion(e.id, "new")}
                  >
                    Restore
                  </ha-button>
                `}
            ${s && a && e.status !== "dismissed" ? f`
                  <ha-button
                    appearance="accent"
                    ?disabled=${this.busy || (s.kind === "create_automation" || s.kind === "update_automation") && !i?.valid}
                    @click=${() => this.openChangeApproval(e)}
                  >
                    <ha-icon icon="mdi:shield-check-outline" slot="start"></ha-icon>
                    ${s.kind === "create_automation" ? "Review & create" : s.kind === "update_automation" ? "Review & update" : "Review removal"}
                  </ha-button>
                ` : x}
            ${e.status !== "saved" ? f`
                  <ha-button
                    appearance="accent"
                    @click=${() => this.updateSuggestion(e.id, "saved")}
                  >
                    <ha-icon icon="mdi:bookmark-outline" slot="start"></ha-icon>
                    Save
                  </ha-button>
                ` : f`<span class="saved-label">
                  <ha-icon icon="mdi:bookmark-check"></ha-icon> Saved
                </span>`}
          </div>
        </footer>
      </div>
    `;
  }
  renderEvidence(e) {
    const i = this.evidencePath(e);
    return f`
      <div class="evidence-row">
        <ha-icon
          icon=${e.source_type === "history" ? "mdi:chart-timeline-variant" : e.source_type === "integration" ? "mdi:puzzle-outline" : "mdi:information-outline"}
        ></ha-icon>
        <div>
          <strong>${e.source_id}</strong>
          <p>${e.observation}</p>
          ${e.period ? f`<small>${e.period}</small>` : x}
          ${e.verified ? x : f`<small class="evidence-unverified"
                >${this.t("evidence.unverified")}</small
              >`}
        </div>
        ${i ? f`
              <ha-icon-button
                label="Open in Home Assistant"
                @click=${() => this.navigate(i)}
              >
                <ha-icon icon="mdi:open-in-new"></ha-icon>
              </ha-icon-button>
            ` : x}
      </div>
    `;
  }
  renderChat() {
    const e = this.threads.find((i) => i.id === this.threadId);
    return f`
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
            ${this.threads.length ? this.threads.map((i) => f`
                    <button
                      class=${i.id === this.threadId ? "selected" : ""}
                      @click=${() => this.selectThread(i.id)}
                    >
                      <ha-icon icon="mdi:message-text-outline"></ha-icon>
                      <span>
                        <strong>${i.title}</strong>
                        <small>${i.message_count} messages</small>
                      </span>
                    </button>
                  `) : f`<p class="thread-empty">No saved conversations yet.</p>`}
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
              ${e ? f`
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
                  ` : x}
            </div>
          </header>
          <div class="messages" aria-live="polite">
            ${this.chat.length === 0 ? f`
                  <div class="empty chat-empty">
                    <ha-icon icon="mdi:message-question-outline"></ha-icon>
                    <h3>Ask a question about your home</h3>
                    <p>
                      Try “Which lights are missing areas?” or “Help me design a
                      reliable bedtime routine.”
                    </p>
                  </div>
                ` : this.chat.map((i) => {
      const s = i.role === "assistant" ? this.extractYaml(i.content) : void 0;
      return f`
                    <div class="message ${i.role}">
                      <div class="message-avatar">
                        ${i.role === "assistant" ? this.renderLogo() : f`<ha-icon icon="mdi:account-outline"></ha-icon>`}
                      </div>
                      <div>
                        <strong>${i.role === "user" ? "You" : "HAOS AI"}</strong>
                        <p>${i.content}</p>
                        ${s ? f`
                              <div class="message-actions">
                                ${this.selected?.automation ? f`
                                      <ha-button
                                        appearance="outlined"
                                        @click=${() => this.useChatYaml(i.content)}
                                      >
                                        <ha-icon icon="mdi:file-replace-outline" slot="start"></ha-icon>
                                        Use as automation draft
                                      </ha-button>
                                    ` : f`
                                      <ha-button
                                        appearance="outlined"
                                        @click=${() => {
        this.copyYaml(s);
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
                            ` : x}
                      </div>
                    </div>
                  `;
    })}
            ${this.busy && this.tab === "chat" ? f`
                  <div class="message assistant pending">
                    <div class="message-avatar">${this.renderLogo()}</div>
                    <div><strong>HAOS AI</strong><p>Inspecting your setup…</p></div>
                  </div>
                ` : x}
          </div>
          <form
            class="composer"
            @submit=${(i) => {
      i.preventDefault(), this.sendChat();
    }}
          >
            <textarea
              .value=${this.chatText}
              placeholder="Ask about devices, routines, integrations, or an automation idea…"
              aria-label="Message"
              @input=${(i) => this.chatText = i.target.value}
              @keydown=${(i) => {
      i.key === "Enter" && !i.shiftKey && (i.preventDefault(), this.sendChat());
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
    const e = this.activity?.receipts ?? [];
    return f`
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
          ${e.length ? e.map((i) => this.renderReceiptRow(i)) : f`
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
    return f`
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
    const e = this.activity?.scan_runs ?? this.overview?.scan_runs ?? [], i = e[0], s = e.reduce((a, n) => a + n.recommendation_count, 0);
    return f`
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
          <div><dt>New suggestions recorded</dt><dd>${s}</dd></div>
          <div>
            <dt>Last scan</dt>
            <dd>${i ? this.relativeDate(i.created_at) : "Never"}</dd>
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
    const e = this.budget;
    return e ? f`
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
        ${e.budget ? f`<div
              class="budget-meter ${e.exceeded ? "exceeded" : e.warning ? "warning" : ""}"
              role="img"
              aria-label=${`${Math.round(e.ratio * 100)}%`}
            >
              <span style=${`width:${Math.min(100, e.ratio * 100)}%`}></span>
            </div>` : x}
      </section>
    ` : x;
  }
  renderAppliedChanges() {
    const e = this.activity?.applied_changes ?? this.overview?.applied_changes ?? [];
    return f`
      <section class="detail-section applied-section">
        <h3>${this.t("applied.title")}</h3>
        <p>${this.t("applied.description")}</p>
        ${e.length ? f`<ul class="applied-list">
              ${e.map((i) => f`
                  <li>
                    <span class="applied-outcome ${i.outcome}">
                      ${this.t(`applied.outcome.${i.outcome}`)}
                    </span>
                    <span class="applied-body">
                      <strong>${i.suggestion_title || i.label}</strong>
                      <small>
                        ${i.kind.replaceAll("_", " ")} ·
                        <code>${i.target_id}</code> ·
                        ${this.relativeDate(i.applied_at)}
                      </small>
                      ${i.outcome_detail ? f`<small>${i.outcome_detail}</small>` : x}
                    </span>
                  </li>
                `)}
            </ul>` : f`<p class="muted">${this.t("applied.empty")}</p>`}
      </section>
    `;
  }
  renderReceiptDetail(e) {
    return f`
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
            ${e.categories.map((i) => f`<span>${i.replaceAll("_", " ")}</span>`)}
          </div>
        </section>
        <section class="detail-section">
          <h3>Redacted fields</h3>
          ${e.redactions.length ? f`<ul>${e.redactions.map((i) => f`<li>${i}</li>`)}</ul>` : f`<p>No sensitive fields were present in this request.</p>`}
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
    if (!this.overview) return x;
    const e = new Set(this.overview.goal_presets.map((a) => a.id)), i = this.selectedGoals.filter((a) => !e.has(a)), s = this.overview.provider_options.find((a) => a.id === this.providerDraft);
    return f`
      <section class="settings-layout">
        <header class="settings-heading">
          <div>
            <h2>HAOS AI settings</h2>
            <p>Connection, advisor behavior, privacy, and scheduled scans.</p>
          </div>
          <span class="version-badge">v${this.overview.version}</span>
        </header>
        ${this.settingsNotice ? f`<div class="settings-notice" role="status">
              <ha-icon icon="mdi:check-circle-outline"></ha-icon>
              ${this.settingsNotice}
            </div>` : x}

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
                @change=${(a) => this.providerChanged(a.target.value)}
              >
                ${this.overview.provider_options.map((a) => f`
                    <option
                      value=${a.id}
                      ?selected=${a.id === this.providerDraft}
                    >${a.label}</option>
                  `)}
              </select>
            </label>
            <label>
              <span>Model</span>
              <input
                .value=${this.modelDraft}
                @input=${(a) => this.modelDraft = a.target.value}
                placeholder=${s?.default_model || "Model identifier"}
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
          ${this.showConnectionAdvanced ? f`
                <div class="settings-fields two-column advanced-fields">
                  <label>
                    <span>New API key</span>
                    <input
                      type="password"
                      .value=${this.apiKeyDraft}
                      @input=${(a) => this.apiKeyDraft = a.target.value}
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
                      @input=${(a) => this.baseUrlDraft = a.target.value}
                      placeholder=${s?.default_base_url || "https://…"}
                      autocomplete="url"
                    />
                    <small>Advanced: HAOS AI appends the provider route.</small>
                  </label>
                </div>
              ` : x}
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
            ${this.overview.goal_presets.map((a) => f`
                <label class="choice-card">
                  <input
                    type="checkbox"
                    .checked=${this.selectedGoals.includes(a.id)}
                    @change=${() => this.toggleGoal(a.id)}
                  />
                  <span class="choice-control">
                    <ha-icon
                      icon=${this.selectedGoals.includes(a.id) ? "mdi:checkbox-marked" : "mdi:checkbox-blank-outline"}
                    ></ha-icon>
                    ${a.label}
                  </span>
                </label>
              `)}
          </div>
          ${i.length ? f`
                <div class="imported-goals">
                  <span>Imported preferences</span>
                  ${i.map((a) => f`
                      <button @click=${() => this.toggleGoal(a)}>
                        ${a}<ha-icon icon="mdi:close"></ha-icon>
                      </button>
                    `)}
                </div>
              ` : x}

          <div class="settings-subsection">
            <h4>How the advisor should think</h4>
            <div class="settings-fields three-column">
              <label>
                <span>Recommendation style</span>
                <select .value=${this.advisorMode} @change=${(a) => this.advisorMode = a.target.value}>
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="ambitious">Ambitious</option>
                  <option value="automation_hell">I WANT AUTOMATION HELL</option>
                </select>
              </label>
              <label>
                <span>Scan depth</span>
                <select .value=${this.scanDepth} @change=${(a) => this.scanDepth = a.target.value}>
                  <option value="focused">Focused · up to 4 ideas</option>
                  <option value="standard">Standard · up to 8 ideas</option>
                  <option value="thorough">Thorough · up to 10 ideas</option>
                </select>
              </label>
              <label>
                <span>Automation complexity</span>
                <select .value=${this.automationComplexity} @change=${(a) => this.automationComplexity = a.target.value}>
                  <option value="simple">Simple only</option>
                  <option value="normal">Normal</option>
                  <option value="advanced">Advanced allowed</option>
                </select>
              </label>
            </div>
            <div class="toggle-list">
              <label>
                <input type="checkbox" .checked=${this.fixExistingFirst} @change=${(a) => this.fixExistingFirst = a.target.checked} />
                <span><strong>Fix existing automations first</strong><small>Prefer simplifying or repairing what already exists.</small></span>
              </label>
              <label>
                <input type="checkbox" .checked=${this.avoidNewHardware} @change=${(a) => this.avoidNewHardware = a.target.checked} />
                <span><strong>Avoid new hardware</strong><small>Only suggest ideas using devices already in Home Assistant.</small></span>
              </label>
            </div>
          </div>

          <div class="settings-subsection">
            <h4>Quiet hours for suggested automations</h4>
            <p class="field-help">The advisor will avoid noisy or disruptive actions during this window.</p>
            <div class="settings-fields two-column compact-fields">
              <label><span>From</span><input type="time" .value=${this.quietStart} @input=${(a) => this.quietStart = a.target.value} /></label>
              <label><span>Until</span><input type="time" .value=${this.quietEnd} @input=${(a) => this.quietEnd = a.target.value} /></label>
            </div>
          </div>

          <div class="settings-subsection entity-exclusions">
            <h4>${this.t("ignore.entities")}</h4>
            <p class="field-help">${this.t("ignore.entities_help")}</p>
            <div class="entity-picker">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input
                .value=${this.ignoredEntityQuery}
                @input=${(a) => {
      this.ignoredEntityQuery = a.target.value, this.ignoredEntityError = "", this.entityHighlight = -1;
    }}
                @keydown=${this.handleEntityKeydown}
                @paste=${this.handleEntityPaste}
                placeholder="Search or paste: light.kitchen, sensor.hallway…"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded=${this.matchingEntities.length ? "true" : "false"}
                aria-invalid=${this.ignoredEntityError ? "true" : "false"}
                aria-controls="ignored-entity-results"
                aria-activedescendant=${this.entityHighlight >= 0 ? `ignored-entity-option-${this.entityHighlight}` : x}
              />
              ${this.matchingEntities.length ? f`
                    <div
                      class="entity-results"
                      role="listbox"
                      id="ignored-entity-results"
                    >
                      ${this.matchingEntities.map((a, n) => f`
                          <button
                            role="option"
                            id=${`ignored-entity-option-${n}`}
                            aria-selected=${n === this.entityHighlight ? "true" : "false"}
                            class=${n === this.entityHighlight ? "active" : ""}
                            @click=${() => this.addIgnoredEntities([a.entity_id])}
                          >
                            <span>
                              <strong>${a.attributes.friendly_name ?? a.entity_id}</strong>
                              <small>${a.entity_id}</small>
                            </span>
                            <em>${a.state}</em>
                          </button>
                        `)}
                    </div>
                  ` : x}
            </div>
            <p class="field-error" role="alert">${this.ignoredEntityError}</p>
            <div class="entity-chips" aria-label="Ignored entities">
              ${this.ignoredEntities.map((a) => {
      const n = this.hass?.states?.[a];
      return f`
                  <span class=${n ? "" : "unavailable"}>
                    <span>
                      <strong>${n?.attributes.friendly_name ?? a}</strong>
                      ${n ? f`<small>${a}</small>` : f`<small>${this.t("ignore.not_found")}</small>`}
                    </span>
                    <button
                      aria-label=${`${this.t("ignore.stop")} ${a}`}
                      @click=${() => this.ignoredEntities = this.ignoredEntities.filter((r) => r !== a)}
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
              <input type="checkbox" .checked=${this.changePermissions.create_automations} @change=${(a) => this.changePermissions = {
      ...this.changePermissions,
      create_automations: a.target.checked
    }} />
              <span><strong>Create validated automations</strong><small>Shows an approval button only after the current YAML passes Home Assistant validation.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.update_automations} @change=${(a) => this.changePermissions = {
      ...this.changePermissions,
      update_automations: a.target.checked
    }} />
              <span><strong>Update existing automations</strong><small>Only exact, existing automation config IDs can be proposed and replaced after review.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.remove_entities} @change=${(a) => this.changePermissions = {
      ...this.changePermissions,
      remove_entities: a.target.checked
    }} />
              <span><strong>Remove orphaned entities</strong><small>Only exact registry entries missing from the current state machine can be proposed.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.changePermissions.remove_devices} @change=${(a) => this.changePermissions = {
      ...this.changePermissions,
      remove_devices: a.target.checked
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
              <select .value=${String(this.historyDays)} @change=${(a) => this.historyDays = Number(a.target.value)}>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </label>
            <label>
              <span>Automatic scans</span>
              <select .value=${this.schedule} @change=${(a) => this.schedule = a.target.value}>
                <option value="manual">Manual only</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </label>
            <label class=${this.schedule === "manual" ? "disabled-field" : ""}>
              <span>Scan time</span>
              <input type="time" .value=${this.scheduleTime} ?disabled=${this.schedule === "manual"} @input=${(a) => this.scheduleTime = a.target.value} />
            </label>
            ${this.schedule === "weekly" ? f`<label>
                  <span>Scan day</span>
                  <select .value=${String(this.scheduleWeekday)} @change=${(a) => this.scheduleWeekday = Number(a.target.value)}>
                    ${Ja.map((a, n) => f`<option value=${n}>${this.t(a)}</option>`)}
                  </select>
                </label>` : x}
          </div>
          <div class="toggle-list divided-toggles">
            <label>
              <input type="checkbox" .checked=${this.notifyNewSuggestions} ?disabled=${this.schedule === "manual"} @change=${(a) => this.notifyNewSuggestions = a.target.checked} />
              <span><strong>Notify about new scheduled suggestions</strong><small>Manual scans never create this notification.</small></span>
            </label>
            <label>
              <input type="checkbox" .checked=${this.includeExactLocation} @change=${(a) => this.includeExactLocation = a.target.checked} />
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
    const e = this.overview?.provider_options ?? [], i = e.find((s) => s.id === this.scanProviderDraft);
    return f`
      <div class="settings-subsection scan-profile">
        <h4>${this.t("scan_profile.title")}</h4>
        <p class="field-help">${this.t("scan_profile.description")}</p>
        <div class="toggle-list">
          <label>
            <input
              type="checkbox"
              .checked=${this.scanProfileEnabled}
              @change=${(s) => {
      this.scanProfileEnabled = s.target.checked, this.settingsNotice = "";
    }}
            />
            <span>
              <strong>${this.t("scan_profile.enable")}</strong>
              <small>${this.t("scan_profile.enable_help")}</small>
            </span>
          </label>
        </div>
        ${this.scanProfileEnabled ? f`
              <div class="settings-fields two-column">
                <label>
                  <span>${this.t("scan_profile.provider")}</span>
                  <select
                    .value=${this.scanProviderDraft}
                    @change=${(s) => {
      const a = s.target.value, n = e.find((r) => r.id === a);
      this.scanProviderDraft = a, n && (this.scanModelDraft || (this.scanModelDraft = n.default_model), this.scanBaseUrlDraft || (this.scanBaseUrlDraft = n.default_base_url)), this.scanApiKeyDraft = "", this.settingsNotice = "";
    }}
                  >
                    ${e.map((s) => f`
                        <option
                          value=${s.id}
                          ?selected=${s.id === this.scanProviderDraft}
                        >${s.label}</option>
                      `)}
                  </select>
                </label>
                <label>
                  <span>${this.t("scan_profile.model")}</span>
                  <input
                    .value=${this.scanModelDraft}
                    @input=${(s) => this.scanModelDraft = s.target.value}
                    placeholder=${i?.default_model || "Model identifier"}
                    autocomplete="off"
                  />
                </label>
                <label>
                  <span>${this.t("scan_profile.api_key")}</span>
                  <input
                    type="password"
                    .value=${this.scanApiKeyDraft}
                    @input=${(s) => this.scanApiKeyDraft = s.target.value}
                    placeholder="Stored key remains unchanged"
                    autocomplete="new-password"
                  />
                </label>
                <label>
                  <span>${this.t("scan_profile.base_url")}</span>
                  <input
                    type="url"
                    .value=${this.scanBaseUrlDraft}
                    @input=${(s) => this.scanBaseUrlDraft = s.target.value}
                    placeholder=${i?.default_base_url || "https://…"}
                    autocomplete="url"
                  />
                </label>
              </div>
              <p class="field-help">
                ${this.overview?.scan_profile?.active ? this.t("scan_profile.active") : this.t("scan_profile.inactive")}
              </p>
            ` : x}
      </div>
    `;
  }
  renderScopePicker(e, i, s, a, n, r, o) {
    const l = a ? r.filter((c) => `${c.id} ${c.label}`.toLocaleLowerCase().includes(a.trim().toLocaleLowerCase())).slice(0, 8) : [];
    return f`
      <div class="settings-subsection entity-exclusions">
        <h4>${this.t(i)}</h4>
        <p class="field-help">${this.t(s)}</p>
        <div class="entity-picker">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            .value=${a}
            @input=${(c) => n(c.target.value)}
            @keydown=${(c) => {
      c.key === "Enter" && (c.preventDefault(), this.addIgnoredScope(e, l[0]?.id ?? a));
    }}
            placeholder=${this.t(i)}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded=${l.length ? "true" : "false"}
          />
          ${l.length ? f`
                <div class="entity-results" role="listbox">
                  ${l.map((c) => f`
                      <button
                        role="option"
                        @click=${() => this.addIgnoredScope(e, c.id)}
                      >
                        <span>
                          <strong>${c.label}</strong>
                          ${c.label === c.id ? x : f`<small>${c.id}</small>`}
                        </span>
                      </button>
                    `)}
                </div>
              ` : x}
        </div>
        <div class="entity-chips" aria-label=${this.t(i)}>
          ${o.map((c) => f`
              <span>
                <span><strong>${c.label}</strong></span>
                <button
                  aria-label=${`${this.t("ignore.stop")} ${c.label}`}
                  @click=${() => this.removeIgnoredScope(e, c.id)}
                ><ha-icon icon="mdi:close"></ha-icon></button>
              </span>
            `)}
        </div>
      </div>
    `;
  }
  renderIgnoreScopes() {
    return f`
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
    const e = this.budget;
    return f`
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
              @input=${(i) => {
      this.monthlyTokenBudget = Math.max(0, Number(i.target.value) || 0), this.settingsNotice = "";
    }}
            />
            <small>${this.t("budget.unlimited")}</small>
          </label>
          ${e ? f`<label class="readonly-field">
                <span>${this.t("budget.used")}</span>
                <output>${e.total_tokens.toLocaleString()}</output>
                <small>
                  ${e.budget ? `${this.t("budget.remaining")}: ${(e.remaining ?? 0).toLocaleString()}` : this.t("budget.no_cap")}
                </small>
              </label>` : x}
        </div>
      </div>
    `;
  }
  renderPreviewDialog() {
    const e = this.preview.payload, i = Object.keys(e).filter((s) => e[s] !== null);
    return f`
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
            ${i.map((s) => f`
                <div><ha-icon icon="mdi:check-circle-outline"></ha-icon>${s.replaceAll("_", " ")}</div>
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
    if (this.dialog === "feedback") return f`
        <ha-adaptive-dialog
          open
          allow-mode-change
          header-title="Why are you dismissing this?"
          header-subtitle="This helps future scans"
          @closed=${() => this.dialog = null}
        >
          <div class="dialog-content feedback-options">
            ${Qa.map((e) => f`
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
    if (this.dialog === "rename") return f`
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
      const e = this.filteredSuggestions.length;
      return f`
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
      const e = this.pendingChange, i = !["create_automation", "update_automation"].includes(e.kind);
      return f`
        <ha-adaptive-dialog
          open
          type=${i ? "alert" : x}
          header-title=${i ? "Approve removal?" : e.kind === "update_automation" ? "Approve automation update?" : "Approve automation creation?"}
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
            ${e.kind === "update_automation" ? this.renderDiff() : x}
            ${e.kind === "create_automation" || e.kind === "update_automation" ? f`
                  <details>
                    <summary>Inspect validated YAML</summary>
                    <pre><code>${this.draftYaml}</code></pre>
                  </details>
                ` : f`<p class="danger-copy">Removal may be irreversible. A future scan cannot restore registry data.</p>`}
          </div>
          <div slot="footer">
            <ha-button appearance="plain" @click=${() => {
        this.dialog = null, this.pendingChange = void 0, this.diffLines = void 0, this.diffError = "";
      }}>${this.t("action.cancel")}</ha-button>
            <ha-button
              variant=${i ? "danger" : x}
              appearance=${i ? "filled" : "accent"}
              ?disabled=${this.busy || e.kind === "update_automation" && (this.diffLoading || !!this.diffError)}
              @click=${this.approveChange}
            >${i ? "Approve & remove" : e.kind === "update_automation" ? "Approve & update" : "Approve & create"}</ha-button>
          </div>
        </ha-adaptive-dialog>
      `;
    }
    return f`
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
    return this.diffLoading ? f`<p class="muted">${this.t("diff.loading")}</p>` : this.diffError ? f`<p class="danger-copy">${this.diffError}</p>` : this.diffLines ? this.diffLines.some((e) => e.type !== "same") ? f`
      <section class="diff-section">
        <h3>${this.t("diff.title")}</h3>
        <div class="diff-legend">
          <span class="removed">${this.t("diff.current")}</span>
          <span class="added">${this.t("diff.proposed")}</span>
        </div>
        <pre class="diff"><code>${this.diffLines.map((e) => f`<span class="diff-line ${e.type}"
            >${e.type === "added" ? "+" : e.type === "removed" ? "-" : " "} ${e.text}
</span>`)}</code></pre>
      </section>
    ` : f`<p class="muted">${this.t("diff.identical")}</p>` : x;
  }
  relativeDate(e) {
    const i = new Date(e).getTime(), s = Math.round((Date.now() - i) / 6e4);
    if (s < 60) return `${Math.max(1, s)}m ago`;
    const a = Math.round(s / 60);
    if (a < 24) return `${a}h ago`;
    const n = Math.round(a / 24);
    return n < 30 ? `${n}d ago` : new Date(e).toLocaleDateString();
  }
  formatUsage(e) {
    const i = (e?.input_tokens ?? 0) + (e?.output_tokens ?? 0);
    return i ? `${i.toLocaleString()} tokens` : "Usage unavailable";
  }
  static {
    this.styles = ys`
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
b([Ct({ attribute: !1 })], y.prototype, "hass", void 0);
b([Ct({ attribute: !1 })], y.prototype, "panel", void 0);
b([w()], y.prototype, "overview", void 0);
b([w()], y.prototype, "tab", void 0);
b([w()], y.prototype, "filter", void 0);
b([w()], y.prototype, "selectedId", void 0);
b([w()], y.prototype, "loading", void 0);
b([w()], y.prototype, "busy", void 0);
b([w()], y.prototype, "dialogPending", void 0);
b([w()], y.prototype, "entityHighlight", void 0);
b([w()], y.prototype, "error", void 0);
b([w()], y.prototype, "preview", void 0);
b([w()], y.prototype, "progress", void 0);
b([w()], y.prototype, "chat", void 0);
b([w()], y.prototype, "chatText", void 0);
b([w()], y.prototype, "threadId", void 0);
b([w()], y.prototype, "threads", void 0);
b([w()], y.prototype, "activity", void 0);
b([w()], y.prototype, "receipt", void 0);
b([w()], y.prototype, "selectedReceiptId", void 0);
b([w()], y.prototype, "selectedGoals", void 0);
b([w()], y.prototype, "ignoredEntities", void 0);
b([w()], y.prototype, "ignoredEntityQuery", void 0);
b([w()], y.prototype, "ignoredEntityError", void 0);
b([w()], y.prototype, "ignoredDomains", void 0);
b([w()], y.prototype, "ignoredAreas", void 0);
b([w()], y.prototype, "ignoredLabels", void 0);
b([w()], y.prototype, "ignoredDomainQuery", void 0);
b([w()], y.prototype, "ignoredAreaQuery", void 0);
b([w()], y.prototype, "ignoredLabelQuery", void 0);
b([w()], y.prototype, "monthlyTokenBudget", void 0);
b([w()], y.prototype, "advisorMode", void 0);
b([w()], y.prototype, "scanDepth", void 0);
b([w()], y.prototype, "automationComplexity", void 0);
b([w()], y.prototype, "fixExistingFirst", void 0);
b([w()], y.prototype, "avoidNewHardware", void 0);
b([w()], y.prototype, "changePermissions", void 0);
b([w()], y.prototype, "quietStart", void 0);
b([w()], y.prototype, "quietEnd", void 0);
b([w()], y.prototype, "providerDraft", void 0);
b([w()], y.prototype, "modelDraft", void 0);
b([w()], y.prototype, "baseUrlDraft", void 0);
b([w()], y.prototype, "apiKeyDraft", void 0);
b([w()], y.prototype, "showConnectionAdvanced", void 0);
b([w()], y.prototype, "historyDays", void 0);
b([w()], y.prototype, "includeExactLocation", void 0);
b([w()], y.prototype, "schedule", void 0);
b([w()], y.prototype, "scheduleTime", void 0);
b([w()], y.prototype, "scheduleWeekday", void 0);
b([w()], y.prototype, "notifyNewSuggestions", void 0);
b([w()], y.prototype, "settingsNotice", void 0);
b([w()], y.prototype, "copied", void 0);
b([w()], y.prototype, "draftYaml", void 0);
b([w()], y.prototype, "draftValidation", void 0);
b([w()], y.prototype, "draftError", void 0);
b([w()], y.prototype, "dialog", void 0);
b([w()], y.prototype, "feedbackReason", void 0);
b([w()], y.prototype, "feedbackNote", void 0);
b([w()], y.prototype, "renameText", void 0);
b([w()], y.prototype, "pendingChange", void 0);
b([w()], y.prototype, "scanProfileEnabled", void 0);
b([w()], y.prototype, "scanProviderDraft", void 0);
b([w()], y.prototype, "scanModelDraft", void 0);
b([w()], y.prototype, "scanBaseUrlDraft", void 0);
b([w()], y.prototype, "scanApiKeyDraft", void 0);
b([w()], y.prototype, "diffLines", void 0);
b([w()], y.prototype, "diffError", void 0);
b([w()], y.prototype, "diffLoading", void 0);
y = b([js("haos-ai-panel")], y);
export {
  y as HaosAiPanel
};
