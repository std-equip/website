(function(t, e) {
	"object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.VAutocomplete = e() : t.VAutocomplete = e()
}
)(this, function() {
	return function(t) {
		function e(i) {
			if (n[i])
				return n[i].exports;
			var s = n[i] = {
				i: i,
				l: !1,
				exports: {}
			};
			return t[i].call(s.exports, s, s.exports, e),
			s.l = !0,
			s.exports
		}
		var n = {};
		return e.m = t,
		e.c = n,
		e.d = function(t, n, i) {
			e.o(t, n) || Object.defineProperty(t, n, {
				configurable: !1,
				enumerable: !0,
				get: i
			})
		}
		,
		e.n = function(t) {
			var n = t && t.__esModule ? function() {
				return t.default
			}
			: function() {
				return t
			}
			;
			return e.d(n, "a", n),
			n
		}
		,
		e.o = function(t, e) {
			return Object.prototype.hasOwnProperty.call(t, e)
		}
		,
		e.p = "/",
		e(e.s = 1)
	}([function(t, e) {
		t.exports = function(t, e, n, i, s, o) {
			var r, u = t = t || {}, a = typeof t.default;
			"object" !== a && "function" !== a || (r = t,
			u = t.default);
			var c = "function" == typeof u ? u.options : u;
			e && (c.render = e.render,
			c.staticRenderFns = e.staticRenderFns,
			c._compiled = !0),
			n && (c.functional = !0),
			s && (c._scopeId = s);
			var l;
			if (o ? (l = function(t) {
				t = t || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext,
				t || "undefined" == typeof __VUE_SSR_CONTEXT__ || (t = __VUE_SSR_CONTEXT__),
				i && i.call(this, t),
				t && t._registeredComponents && t._registeredComponents.add(o)
			}
			,
			c._ssrRegister = l) : i && (l = i),
			l) {
				var h = c.functional
				  , m = h ? c.render : c.beforeCreate;
				h ? (c._injectStyles = l,
				c.render = function(t, e) {
					return l.call(e),
					m(t, e)
				}
				) : c.beforeCreate = m ? [].concat(m, l) : [l]
			}
			return {
				esModule: r,
				exports: u,
				options: c
			}
		}
	}
	, function(t, e, n) {
		t.exports = n(2)
	}
	, function(t, e, n) {
		"use strict";
		Object.defineProperty(e, "__esModule", {
			value: !0
		});
		var i = n(3);
		e.default = Object.assign({}, i.a, {
			install: function(t) {
				return t.component(i.a.name, i.a)
			}
		})
	}
	, function(t, e, n) {
		"use strict";
		function i(t) {
			n(4)
		}
		var s = n(5)
		  , o = n(10)
		  , r = n(0)
		  , u = i
		  , a = r(s.a, o.a, !1, u, null, null);
		e.a = a.exports
	}
	, function(t, e) {}
	, function(t, e, n) {
		"use strict";
		var i = n(6)
		  , s = n(9);
		e.a = {
			name: "v-autocomplete",
			props: {
				componentItem: {
					default: function() {
						return i.a
					}
				},
				minLen: {
					type: Number,
					default: s.a.minLen
				},
				wait: {
					type: Number,
					default: s.a.wait
				},
				value: null,
				getLabel: {
					type: Function,
					default: function(t) {
						return t
					}
				},
				items: Array,
				autoSelectOneItem: {
					type: Boolean,
					default: !0
				},
				placeholder: String,
				inputClass: {
					type: String,
					default: "v-autocomplete-input"
				},
				disabled: {
					type: Boolean,
					default: !1
				},
				inputAttrs: {
					type: Object,
					default: function() {
						return {}
					}
				},
				keepOpen: {
					type: Boolean,
					default: !1
				}
			},
			data: function() {
				return {
					searchText: "",
					showList: !1,
					cursor: -1,
					internalItems: this.items || []
				}
			},
			computed: {
				hasItems: function() {
					return !!this.internalItems.length
				},
				show: function() {
					return this.showList && this.hasItems || this.keepOpen
				}
			},
			methods: {
				inputChange: function() {
					this.showList = !0,
					this.cursor = -1,
					//this.onSelectItem(null, "inputChange"),
					s.a.callUpdateItems(this.searchText, this.updateItems),
					this.$emit("change", this.searchText)
				},
				updateItems: function() {
					this.$emit("update-items", this.searchText)
				},
				focus: function() {
					this.$emit("focus", this.searchText),
					this.showList = !0
				},
				blur: function() {
					var t = this;
					this.$emit("blur", this.searchText),
					setTimeout(function() {
						return t.showList = !1
					}, 200)
				},
				keyPressFunct: function(){
					this.$emit("keypress")
				},
				onClickItem: function(t) {
					this.onSelectItem(t),
					this.$emit("item-clicked", t)
				},
				onSelectItem: function(t) {
					t ? (this.internalItems = [t],
					this.searchText = this.getLabel(t),
					this.$emit("item-selected", t)) : this.setItems(this.items),
					this.$emit("input", t)
				},
				setItems: function(t) {
					this.internalItems = t || []
				},
				isSelecteValue: function(t) {
					return 1 == this.internalItems.length && t == this.internalItems[0]
				},
				keyUp: function(t) {
					this.cursor > -1 && (this.cursor--,
					this.itemView(this.$el.getElementsByClassName("v-autocomplete-list-item")[this.cursor]))
				},
				keyDown: function(t) {
					this.cursor < this.internalItems.length && (this.cursor++,
					this.itemView(this.$el.getElementsByClassName("v-autocomplete-list-item")[this.cursor]))
					
				},
				itemView: function(t) {
					t && t.scrollIntoView && t.scrollIntoView(!1)
				},
				keyEnter: function(t) {
					this.showList && this.internalItems[this.cursor] && (this.onSelectItem(this.internalItems[this.cursor]),
					this.showList = !1)
				},
				keyPressFunct: function(){
					this.$emit("keypress")
				},
			},
			created: function() {
				s.a.minLen = this.minLen,
				s.a.wait = this.wait,
				this.onSelectItem(this.value)
			},
			watch: {
				items: function(t) {
					this.setItems(t);
					var e = s.a.findItem(this.items, this.searchText, this.autoSelectOneItem);
					e && (this.onSelectItem(e),
					this.showList = !1)
				},
				value: function(t) {
					this.isSelecteValue(t) || (this.onSelectItem(t),
					this.searchText = this.getLabel(t))
				}
			}
		}
	}
	, function(t, e, n) {
		"use strict";
		var i = n(7)
		  , s = n(8)
		  , o = n(0)
		  , r = o(i.a, s.a, !1, null, null, null);
		e.a = r.exports
	}
	, function(t, e, n) {
		"use strict";
		e.a = {
			props: {
				item: {
					required: !0
				}
			}
		}
	}
	, function(t, e, n) {
		"use strict";
		var i = function() {
			var t = this
			  , e = t.$createElement;
			return (t._self._c || e)("div", [t._v(t._s(t.item))])
		}
		  , s = []
		  , o = {
			render: i,
			staticRenderFns: s
		};
		e.a = o
	}
	, function(t, e, n) {
		"use strict";
		e.a = {
			minLen: 3,
			wait: 500,
			timeout: null,
			isUpdateItems: function(t) {
				if (t.length >= this.minLen)
					return !0
			},
			callUpdateItems: function(t, e) {
				clearTimeout(this.timeout),
				this.isUpdateItems(t) && (this.timeout = setTimeout(e, this.wait))
			},
			findItem: function(t, e, n) {
				if (e)
					return n && 1 == t.length ? t[0] : void 0
			}
		}
	}
	, function(t, e, n) {
		"use strict";
		var i = function() {
			var t = this
			  , e = t.$createElement
			  , n = t._self._c || e;
			return n("div", {
				staticClass: "v-autocomplete"
			}, [n("div", {
				staticClass: "v-autocomplete-input-group",
				class: {
					"v-autocomplete-selected": t.value
				}
			}, [n("input", t._b({
				directives: [{
					name: "model",
					rawName: "v-model",
					value: t.searchText,
					expression: "searchText"
				}],
				class: t.inputAttrs.class || t.inputClass,
				attrs: {
					type: "search",
					placeholder: t.inputAttrs.placeholder || t.placeholder,
					disabled: t.inputAttrs.disabled || t.disabled
				},
				domProps: {
					value: t.searchText
				},
				on: {
					blur: t.blur,
					focus: t.focus,
					input: [function(e) {
						e.target.composing || (t.searchText = e.target.value)
					}
					, t.inputChange],
					keyup: function(e) {
						if (!("button"in e) && t._k(e.keyCode, "enter", 13, e.key))
							return null;
						t.keyEnter(e)
					},
					keydown: [function(e) {
						if (!("button"in e) && t._k(e.keyCode, "tab", 9, e.key)){
							if (!("button"in e) && t._k(e.keyCode, "enter", 13, e.key)){
								t.keyPressFunct();
							}
							
							return null;
						}
						t.keyEnter(e)
					}
					, function(e) {
						if (!("button"in e) && t._k(e.keyCode, "up", 38, e.key))
							return null;
						t.keyUp(e)
					}
					, function(e) {
						if (!("button"in e) && t._k(e.keyCode, "down", 40, e.key))
							return null;
						t.keyDown(e)
					}
					]
				}
			}, "input", t.inputAttrs, !1))]), t._v(" "), t.show ? n("div", {
				staticClass: "v-autocomplete-list"
			}, t._l(t.internalItems, function(e, i) {
				return n("div", {
					staticClass: "v-autocomplete-list-item",
					class: {
						"v-autocomplete-item-active": i === t.cursor
					},
					on: {
						click: function(n) {
							t.onClickItem(e)
						},
						mouseover: function(e) {
							t.cursor = i
						}
					}
				}, [n(t.componentItem, {
					tag: "div",
					attrs: {
						item: e,
						searchText: t.searchText
					}
				})])
			})) : t._e()])
		}
		  , s = []
		  , o = {
			render: i,
			staticRenderFns: s
		};
		e.a = o
	}
	])
});
