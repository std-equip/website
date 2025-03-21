! function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define("vue-slider-component", [], e) : "object" == typeof exports ? exports["vue-slider-component"] = e() : t["vue-slider-component"] = e()
}(this, function() {
    return function(t) {
        function e(s) {
            if (i[s]) return i[s].exports;
            var r = i[s] = {
                i: s,
                l: !1,
                exports: {}
            };
            return t[s].call(r.exports, r, r.exports, e), r.l = !0, r.exports
        }
        var i = {};
        return e.m = t, e.c = i, e.i = function(t) {
            return t
        }, e.d = function(t, i, s) {
            e.o(t, i) || Object.defineProperty(t, i, {
                configurable: !1,
                enumerable: !0,
                get: s
            })
        }, e.n = function(t) {
            var i = t && t.__esModule ? function() {
                return t.default
            } : function() {
                return t
            };
            return e.d(i, "a", i), i
        }, e.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, e.p = "", e(e.s = 2)
    }([function(t, e, i) {
        i(7);
        var s = i(5)(i(1), i(6), null, null);
        t.exports = s.exports
    }, function(t, e, i) {
        "use strict";
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var s = function() {
            var t = "undefined" != typeof window ? window.devicePixelRatio || 1 : 1;
            return function(e) {
                return Math.round(e * t) / t
            }
        }();
        e.default = {
            name: "VueSliderComponent",
            props: {
                width: {
                    type: [Number, String],
                    default: "auto"
                },
                height: {
                    type: [Number, String],
                    default: 6
                },
                data: {
                    type: Array,
                    default: null
                },
                dotSize: {
                    type: Number,
                    default: 16
                },
                dotWidth: {
                    type: Number,
                    required: !1
                },
                dotHeight: {
                    type: Number,
                    required: !1
                },
                min: {
                    type: Number,
                    default: 0
                },
                max: {
                    type: Number,
                    default: 100
                },
                interval: {
                    type: Number,
                    default: 1
                },
                show: {
                    type: Boolean,
                    default: !0
                },
                disabled: {
                    type: Boolean,
                    default: !1
                },
                piecewise: {
                    type: Boolean,
                    default: !1
                },
                tooltip: {
                    type: [String, Boolean],
                    default: "always"
                },
                eventType: {
                    type: String,
                    default: "auto"
                },
                direction: {
                    type: String,
                    default: "horizontal"
                },
                reverse: {
                    type: Boolean,
                    default: !1
                },
                lazy: {
                    type: Boolean,
                    default: !1
                },
                clickable: {
                    type: Boolean,
                    default: !0
                },
                speed: {
                    type: Number,
                    default: .5
                },
                realTime: {
                    type: Boolean,
                    default: !1
                },
                stopPropagation: {
                    type: Boolean,
                    default: !1
                },
                value: {
                    type: [String, Number, Array, Object],
                    default: 0
                },
                piecewiseLabel: {
                    type: Boolean,
                    default: !1
                },
                debug: {
                    type: Boolean,
                    default: !0
                },
                fixed: {
                    type: Boolean,
                    default: !1
                },
                processDragable: {
                    type: Boolean,
                    default: !1
                },
                useKeyboard: {
                    type: Boolean,
                    default: !1
                },
                actionsKeyboard: {
                    type: Array,
                    default: function() {
                        return [function(t) {
                            return t - 1
                        }, function(t) {
                            return t + 1
                        }]
                    }
                },
                tooltipMerge: {
                    type: Boolean,
                    default: !0
                },
                sliderStyle: [Array, Object, Function],
                focusStyle: [Array, Object, Function],
                tooltipDir: [Array, String],
                formatter: [String, Function],
                mergeFormatter: [String, Function],
                piecewiseStyle: Object,
                piecewiseActiveStyle: Object,
                processStyle: Object,
                bgStyle: Object,
                tooltipStyle: [Array, Object, Function],
                labelStyle: Object,
                labelActiveStyle: Object
            },
            data: function() {
                return {
                    flag: !1,
                    keydownFlag: null,
                    focusFlag: !1,
                    processFlag: !1,
                    processSign: null,
                    size: 0,
                    fixedValue: 0,
                    focusSlider: 0,
                    currentValue: 0,
                    currentSlider: 0,
                    isComponentExists: !0,
                    isMounted: !1
                }
            },
            computed: {
                dotWidthVal: function() {
                    return "number" == typeof this.dotWidth ? this.dotWidth : this.dotSize
                },
                dotHeightVal: function() {
                    return "number" == typeof this.dotHeight ? this.dotHeight : this.dotSize
                },
                flowDirection: function() {
                    return "vue-slider-" + this.direction + (this.reverse ? "-reverse" : "")
                },
                tooltipMergedPosition: function() {
                    if (!this.isMounted) return {};
                    var t = this.tooltipDirection[0];
                    if (this.$refs.dot0) {
                        if ("vertical" === this.direction) {
                            var e = {};
                            return e[t] = "-" + (this.dotHeightVal / 2 - this.width / 2 + 9) + "px", e
                        }
                        var i = {};
                        return i[t] = "-" + (this.dotWidthVal / 2 - this.height / 2 + 9) + "px", i.left = "50%", i
                    }
                },
                tooltipDirection: function() {
                    var t = this.tooltipDir || ("vertical" === this.direction ? "left" : "top");
                    return Array.isArray(t) ? this.isRange ? t : t[1] : this.isRange ? [t, t] : t
                },
                tooltipStatus: function() {
                    return "hover" === this.tooltip && this.flag ? "vue-slider-always" : this.tooltip ? "vue-slider-" + this.tooltip : ""
                },
                tooltipClass: function() {
                    return ["vue-slider-tooltip-" + this.tooltipDirection, "vue-slider-tooltip"]
                },
                isDisabled: function() {
                    return "none" === this.eventType || this.disabled
                },
                disabledClass: function() {
                    return this.disabled ? "vue-slider-disabled" : ""
                },
                stateClass: function() {
                    return {
                        "vue-slider-state-process-drag": this.processFlag,
                        "vue-slider-state-drag": this.flag && !this.processFlag && !this.keydownFlag,
                        "vue-slider-state-focus": this.focusFlag
                    }
                },
                isRange: function() {
                    return Array.isArray(this.value)
                },
                slider: function() {
                    return this.isRange ? [this.$refs.dot0, this.$refs.dot1] : this.$refs.dot
                },
                minimum: function() {
                    return this.data ? 0 : this.min
                },
                val: {
                    get: function() {
                        return this.data ? this.isRange ? [this.data[this.currentValue[0]], this.data[this.currentValue[1]]] : this.data[this.currentValue] : this.currentValue
                    },
                    set: function(t) {
                        if (this.data)
                            if (this.isRange) {
                                var e = this.data.indexOf(t[0]),
                                    i = this.data.indexOf(t[1]);
                                e > -1 && i > -1 && (this.currentValue = [e, i])
                            } else {
                                var s = this.data.indexOf(t);
                                s > -1 && (this.currentValue = s)
                            }
                        else this.currentValue = t
                    }
                },
                currentIndex: function() {
                    return this.isRange ? this.data ? this.currentValue : [this.getIndexByValue(this.currentValue[0]), this.getIndexByValue(this.currentValue[1])] : this.getIndexByValue(this.currentValue)
                },
                indexRange: function() {
                    return this.isRange ? this.currentIndex : [0, this.currentIndex]
                },
                maximum: function() {
                    return this.data ? this.data.length - 1 : this.max
                },
                multiple: function() {
                    var t = ("" + this.interval).split(".")[1];
                    return t ? Math.pow(10, t.length) : 1
                },
                spacing: function() {
                    return this.data ? 1 : this.interval
                },
                total: function() {
                    return this.data ? this.data.length - 1 : (Math.floor((this.maximum - this.minimum) * this.multiple) % (this.interval * this.multiple) != 0 && this.printError("Prop[interval] is illegal, Please make sure that the interval can be divisible"), (this.maximum - this.minimum) / this.interval)
                },
                gap: function() {
                    return this.total > 0 ? this.size / this.total : 0;
                },
                position: function() {
                    return this.isRange ? [(this.currentValue[0] - this.minimum) / this.spacing * this.gap, (this.currentValue[1] - this.minimum) / this.spacing * this.gap] : (this.currentValue - this.minimum) / this.spacing * this.gap
                },
                limit: function() {
                    return this.isRange ? this.fixed ? [
                        [0, (this.maximum - this.fixedValue * this.spacing) / this.spacing * this.gap],
                        [(this.minimum + this.fixedValue * this.spacing) / this.spacing * this.gap, this.size]
                    ] : [
                        [0, this.position[1]],
                        [this.position[0], this.size]
                    ] : [0, this.size]
                },
                valueLimit: function() {
                    return this.isRange ? this.fixed ? [
                        [this.minimum, this.maximum - this.fixedValue * this.spacing],
                        [this.minimum + this.fixedValue * this.spacing, this.maximum]
                    ] : [
                        [this.minimum, this.currentValue[1]],
                        [this.currentValue[0], this.maximum]
                    ] : [this.minimum, this.maximum]
                },
                idleSlider: function() {
                    return 0 === this.currentSlider ? 1 : 0
                },
                wrapStyles: function() {
                    return "vertical" === this.direction ? {
                        height: "number" == typeof this.height ? this.height + "px" : this.height,
                        padding: this.dotHeightVal / 2 + "px " + this.dotWidthVal / 2 + "px"
                    } : {
                        width: "number" == typeof this.width ? this.width + "px" : this.width,
                        padding: this.dotHeightVal / 2 + "px " + this.dotWidthVal / 2 + "px"
                    }
                },
                sliderStyles: function() {
                    return Array.isArray(this.sliderStyle) ? this.isRange ? this.sliderStyle : this.sliderStyle[1] : "function" == typeof this.sliderStyle ? this.sliderStyle(this.val, this.currentIndex) : this.isRange ? [this.sliderStyle, this.sliderStyle] : this.sliderStyle
                },
                focusStyles: function() {
                    return Array.isArray(this.focusStyle) ? this.isRange ? this.focusStyle : this.focusStyle[1] : "function" == typeof this.focusStyle ? this.focusStyle(this.val, this.currentIndex) : this.isRange ? [this.focusStyle, this.focusStyle] : this.focusStyle
                },
                tooltipStyles: function() {
                    return Array.isArray(this.tooltipStyle) ? this.isRange ? this.tooltipStyle : this.tooltipStyle[1] : "function" == typeof this.tooltipStyle ? this.tooltipStyle(this.val, this.currentIndex) : this.isRange ? [this.tooltipStyle, this.tooltipStyle] : this.tooltipStyle
                },
                elemStyles: function() {
                    return "vertical" === this.direction ? {
                        width: this.width + "px",
                        height: "100%"
                    } : {
                        height: this.height + "px"
                    }
                },
                dotStyles: function() {
                    return "vertical" === this.direction ? {
                        width: this.dotWidthVal + "px",
                        height: this.dotHeightVal + "px",
                        left: -(this.dotWidthVal - this.width) / 2 + "px"
                    } : {
                        width: this.dotWidthVal + "px",
                        height: this.dotHeightVal + "px",
                        top: -(this.dotHeightVal - this.height) / 2 + "px"
                    }
                },
                piecewiseDotStyle: function() {
                    return "vertical" === this.direction ? {
                        width: this.width + "px",
                        height: this.width + "px"
                    } : {
                        width: this.height + "px",
                        height: this.height + "px"
                    }
                },
                piecewiseDotWrap: function() {
                    if (!this.piecewise && !this.piecewiseLabel) return !1;
                    for (var t = [], e = 0; e <= this.total; e++) {
                        var i = "vertical" === this.direction ? {
                                bottom: this.gap * e - this.width / 2 + "px",
                                left: 0
                            } : {
                                left: this.gap * e - this.height / 2 + "px",
                                top: 0
                            },
                            s = this.reverse ? this.total - e : e,
                            r = this.data ? this.data[s] : this.spacing * s + this.min;
                        t.push({
                            style: i,
                            label: this.formatter ? this.formatting(r) : r,
                            inRange: s >= this.indexRange[0] && s <= this.indexRange[1]
                        })
                    }
                    return t
                }
            },
            watch: {
                value: function(t) {
                    this.flag || this.setValue(t, !0)
                },
                max: function(t) {
                    if (t < this.min) return this.printError("The maximum value can not be less than the minimum value.");
                    var e = this.limitValue(this.val);
                    this.setValue(e), this.refresh()
                },
                min: function(t) {
                    if (t > this.max) return this.printError("The minimum value can not be greater than the maximum value.");
                    var e = this.limitValue(this.val);
                    this.setValue(e), this.refresh()
                },
                show: function(t) {
                    var e = this;
                    t && !this.size && this.$nextTick(function() {
                        e.refresh()
                    })
                },
                fixed: function() {
                    this.computedFixedValue()
                }
            },
            methods: {
                bindEvents: function() {
                    document.addEventListener("touchmove", this.moving, {
                        passive: !1
                    }), document.addEventListener("touchend", this.moveEnd, {
                        passive: !1
                    }), document.addEventListener("mousedown", this.blurSlider), document.addEventListener("mousemove", this.moving), document.addEventListener("mouseup", this.moveEnd), document.addEventListener("mouseleave", this.moveEnd), document.addEventListener("keydown", this.handleKeydown), document.addEventListener("keyup", this.handleKeyup), window.addEventListener("resize", this.refresh), this.isRange && this.tooltipMerge && (this.$refs.dot0.addEventListener("transitionend", this.handleOverlapTooltip), this.$refs.dot1.addEventListener("transitionend", this.handleOverlapTooltip))
                },
                unbindEvents: function() {
                    document.removeEventListener("touchmove", this.moving), document.removeEventListener("touchend", this.moveEnd), document.removeEventListener("mousedown", this.blurSlider), document.removeEventListener("mousemove", this.moving), document.removeEventListener("mouseup", this.moveEnd), document.removeEventListener("mouseleave", this.moveEnd), document.removeEventListener("keydown", this.handleKeydown), document.removeEventListener("keyup", this.handleKeyup), window.removeEventListener("resize", this.refresh), this.isRange && this.tooltipMerge && (this.$refs.dot0.removeEventListener("transitionend", this.handleOverlapTooltip), this.$refs.dot1.removeEventListener("transitionend", this.handleOverlapTooltip))
                },
                handleKeydown: function(t) {
                    if (!this.useKeyboard || !this.focusFlag) return !1;
                    switch (t.keyCode) {
                        case 37:
                        case 40:
                            t.preventDefault(), this.keydownFlag = !0, this.flag = !0, this.changeFocusSlider(this.actionsKeyboard[0]);
                            break;
                        case 38:
                        case 39:
                            t.preventDefault(), this.keydownFlag = !0, this.flag = !0, this.changeFocusSlider(this.actionsKeyboard[1])
                    }
                },
                handleKeyup: function() {
                    this.keydownFlag && (this.keydownFlag = !1, this.flag = !1)
                },
                changeFocusSlider: function(t) {
                    var e = this;
                    if (this.isRange) {
                        var i = this.currentIndex.map(function(i, s) {
                            if (s === e.focusSlider || e.fixed) {
                                var r = t(i),
                                    o = e.fixed ? e.valueLimit[s] : [0, e.total];
                                if (r <= o[1] && r >= o[0]) return r
                            }
                            return i
                        });
                        i[0] > i[1] && (this.focusSlider = 0 === this.focusSlider ? 1 : 0, i = i.reverse()), this.setIndex(i)
                    } else this.setIndex(t(this.currentIndex))
                },
                blurSlider: function(t) {
                    var e = this.isRange ? this.$refs["dot" + this.focusSlider] : this.$refs.dot;
                    if (!e || e === t.target) return !1;
                    this.focusFlag = !1
                },
                formatting: function(t) {
                    return "string" == typeof this.formatter ? this.formatter.replace(/\{value\}/, t) : this.formatter(t)
                },
                mergeFormatting: function(t, e) {
                    return "string" == typeof this.mergeFormatter ? this.mergeFormatter.replace(/\{(value1|value2)\}/g, function(i, s) {
                        return "value1" === s ? t : e
                    }) : this.mergeFormatter(t, e)
                },
                getPos: function(t) {
                    return this.realTime && this.getStaticData(), "vertical" === this.direction ? this.reverse ? t.pageY - this.offset : this.size - (t.pageY - this.offset) : this.reverse ? this.size - (t.clientX - this.offset) : t.clientX - this.offset
                },
                processClick: function(t) {
                    this.fixed && t.stopPropagation()
                },
                wrapClick: function(t) {
                    if (this.isDisabled || !this.clickable || this.processFlag) return !1;
                    var e = this.getPos(t);
                    this.isRange && (this.currentSlider = e > (this.position[1] - this.position[0]) / 2 + this.position[0] ? 1 : 0), this.setValueOnPos(e)
                },
                moveStart: function(t) {
                    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                        i = arguments[2];
                    if (this.isDisabled) return !1;
                    if (this.stopPropagation && t.stopPropagation(), this.isRange && (this.currentSlider = e, i)) {
                        if (!this.processDragable) return !1;
                        this.processFlag = !0, this.processSign = {
                            pos: this.position,
                            start: this.getPos(t.targetTouches && t.targetTouches[0] ? t.targetTouches[0] : t)
                        }
                    }!i && this.useKeyboard && (this.focusFlag = !0, this.focusSlider = e), this.flag = !0, this.$emit("drag-start", this)
                },
                moving: function(t) {
                    if (this.stopPropagation && t.stopPropagation(), !this.flag) return !1;
                    t.preventDefault(), t.targetTouches && t.targetTouches[0] && (t = t.targetTouches[0]), this.processFlag ? (this.currentSlider = 0, this.setValueOnPos(this.processSign.pos[0] + this.getPos(t) - this.processSign.start, !0), this.currentSlider = 1, this.setValueOnPos(this.processSign.pos[1] + this.getPos(t) - this.processSign.start, !0)) : this.setValueOnPos(this.getPos(t), !0), this.isRange && this.tooltipMerge && this.handleOverlapTooltip()
                },
                moveEnd: function(t) {
                    var e = this;
                    if (this.stopPropagation && t.stopPropagation(), !this.flag) return !1;
                    this.$emit("drag-end", this), this.lazy && this.isDiff(this.val, this.value) && this.syncValue(), this.flag = !1, window.setTimeout(function() {
                        e.processFlag = !1
                    }, 0), this.setPosition()
                },
                setValueOnPos: function(t, e) {
                    var i = this.isRange ? this.limit[this.currentSlider] : this.limit,
                        s = this.isRange ? this.valueLimit[this.currentSlider] : this.valueLimit;
                    if (t >= i[0] && t <= i[1]) {
                        this.setTransform(t);
                        var r = this.getValueByIndex(Math.round(t / this.gap));
                        this.setCurrentValue(r, e), this.isRange && this.fixed && (this.setTransform(t + this.fixedValue * this.gap * (0 === this.currentSlider ? 1 : -1), !0), this.setCurrentValue(r + this.fixedValue * this.spacing * (0 === this.currentSlider ? 1 : -1), e, !0))
                    } else t < i[0] ? (this.setTransform(i[0]), this.setCurrentValue(s[0]), this.isRange && this.fixed ? (this.setTransform(this.limit[this.idleSlider][0], !0), this.setCurrentValue(this.valueLimit[this.idleSlider][0], e, !0)) : this.fixed || 1 !== this.currentSlider || (this.focusSlider = 0, this.currentSlider = 0)) : (this.setTransform(i[1]), this.setCurrentValue(s[1]), this.isRange && this.fixed ? (this.setTransform(this.limit[this.idleSlider][1], !0), this.setCurrentValue(this.valueLimit[this.idleSlider][1], e, !0)) : this.fixed || 0 !== this.currentSlider || (this.focusSlider = 1, this.currentSlider = 1))
                },
                isDiff: function(t, e) {
                    return Object.prototype.toString.call(t) !== Object.prototype.toString.call(e) || (Array.isArray(t) && t.length === e.length ? t.some(function(t, i) {
                        return t !== e[i]
                    }) : t !== e)
                },
                setCurrentValue: function(t, e, i) {
                    var s = i ? this.idleSlider : this.currentSlider;
                    if (t < this.minimum || t > this.maximum) return !1;
                    this.isRange ? this.isDiff(this.currentValue[s], t) && (this.currentValue.splice(s, 1, t), this.lazy && this.flag || this.syncValue()) : this.isDiff(this.currentValue, t) && (this.currentValue = t, this.lazy && this.flag || this.syncValue()), e || this.setPosition()
                },
                getValueByIndex: function(t) {
                    return (this.spacing * this.multiple * t + this.minimum * this.multiple) / this.multiple
                },
                getIndexByValue: function(t) {
                    return Math.round((t - this.minimum) * this.multiple) / (this.spacing * this.multiple)
                },
                setIndex: function(t) {
                    if (Array.isArray(t) && this.isRange) {
                        var e = void 0;
                        e = this.data ? [this.data[t[0]], this.data[t[1]]] : [this.getValueByIndex(t[0]), this.getValueByIndex(t[1])], this.setValue(e)
                    } else t = this.getValueByIndex(t), this.isRange && (this.currentSlider = t > (this.currentValue[1] - this.currentValue[0]) / 2 + this.currentValue[0] ? 1 : 0), this.setCurrentValue(t)
                },
                setValue: function(t, e, i) {
                    var s = this;
                    if (this.isDiff(this.val, t)) {
                        var r = this.limitValue(t);
                        this.val = this.isRange ? r.concat() : r, this.computedFixedValue(), this.syncValue(e)
                    }
                    this.$nextTick(function() {
                        return s.setPosition(i)
                    })
                },
                computedFixedValue: function() {
                    if (!this.fixed) return this.fixedValue = 0, !1;
                    this.fixedValue = this.currentIndex[1] - this.currentIndex[0]
                },
                setPosition: function(t) {
                    this.flag || this.setTransitionTime(void 0 === t ? this.speed : t), this.isRange ? (this.setTransform(this.position[0], 1 === this.currentSlider), this.setTransform(this.position[1], 0 === this.currentSlider)) : this.setTransform(this.position), this.flag || this.setTransitionTime(0)
                },
                setTransform: function(t, e) {
                    var i = e ? this.idleSlider : this.currentSlider,
                        r = s(("vertical" === this.direction ? this.dotHeightVal / 2 - t : t - this.dotWidthVal / 2) * (this.reverse ? -1 : 1)),
                        o = "vertical" === this.direction ? "translateY(" + r + "px)" : "translateX(" + r + "px)",
                        n = this.fixed ? this.fixedValue * this.gap + "px" : (0 === i ? this.position[1] - t : t - this.position[0]) + "px",
                        l = this.fixed ? (0 === i ? t : t - this.fixedValue * this.gap) + "px" : (0 === i ? t : this.position[0]) + "px";
                    this.isRange ? (this.slider[i].style.transform = o, this.slider[i].style.WebkitTransform = o, this.slider[i].style.msTransform = o, "vertical" === this.direction ? (this.$refs.process.style.height = n, this.$refs.process.style[this.reverse ? "top" : "bottom"] = l) : (this.$refs.process.style.width = n, this.$refs.process.style[this.reverse ? "right" : "left"] = l)) : (this.slider.style.transform = o, this.slider.style.WebkitTransform = o, this.slider.style.msTransform = o, "vertical" === this.direction ? (this.$refs.process.style.height = t + "px", this.$refs.process.style[this.reverse ? "top" : "bottom"] = 0) : (this.$refs.process.style.width = t + "px", this.$refs.process.style[this.reverse ? "right" : "left"] = 0))
                },
                setTransitionTime: function(t) {
                    if (t || this.$refs.process.offsetWidth, this.isRange) {
                        for (var e = 0; e < this.slider.length; e++) this.slider[e].style.transitionDuration = t + "s", this.slider[e].style.WebkitTransitionDuration = t + "s";
                        this.$refs.process.style.transitionDuration = t + "s", this.$refs.process.style.WebkitTransitionDuration = t + "s"
                    } else this.slider.style.transitionDuration = t + "s", this.slider.style.WebkitTransitionDuration = t + "s", this.$refs.process.style.transitionDuration = t + "s", this.$refs.process.style.WebkitTransitionDuration = t + "s"
                },
                limitValue: function(t) {
                    var e = this;
                    if (this.data) return t;
                    var i = function(i) {
                        return i < e.min ? (e.printError("The value of the slider is " + t + ", the minimum value is " + e.min + ", the value of this slider can not be less than the minimum value"), e.min) : i > e.max ? (e.printError("The value of the slider is " + t + ", the maximum value is " + e.max + ", the value of this slider can not be greater than the maximum value"), e.max) : i
                    };
                    return this.isRange ? t.map(function(t) {
                        return i(t)
                    }) : i(t)
                },
                syncValue: function(t) {
                    var e = this.isRange ? this.val.concat() : this.val;
                    this.$emit("input", e), t || this.$emit("callback", e)
                },
                getValue: function() {
                    return this.val
                },
                getIndex: function() {
                    return this.currentIndex
                },
                getStaticData: function() {
                    this.$refs.elem && (this.size = "vertical" === this.direction ? this.$refs.elem.offsetHeight : this.$refs.elem.offsetWidth, this.offset = "vertical" === this.direction ? this.$refs.elem.getBoundingClientRect().top + window.pageYOffset || document.documentElement.scrollTop : this.$refs.elem.getBoundingClientRect().left)
                },
                refresh: function() {
                    this.$refs.elem && (this.getStaticData(), this.computedFixedValue(), this.setPosition())
                },
                printError: function(t) {
                    this.debug && console.error("[VueSlider error]: " + t)
                },
                handleOverlapTooltip: function() {
                    var t = this.tooltipDirection[0] === this.tooltipDirection[1];
                    if (this.isRange && t) {
                        var e = this.$refs.tooltip0,
                            i = this.$refs.tooltip1,
                            s = e.getBoundingClientRect().right,
                            r = i.getBoundingClientRect().left,
                            o = e.getBoundingClientRect().y,
                            n = i.getBoundingClientRect().y + i.getBoundingClientRect().height,
                            l = "horizontal" === this.direction && s > r,
                            a = "vertical" === this.direction && n > o;
                        l || a ? this.handleDisplayMergedTooltip(!0) : this.handleDisplayMergedTooltip(!1)
                    }
                },
                handleDisplayMergedTooltip: function(t) {
                    var e = this.$refs.tooltip0,
                        i = this.$refs.tooltip1,
                        s = this.$refs.process.getElementsByClassName("vue-merged-tooltip")[0];
                    t ? (e.style.visibility = "hidden", i.style.visibility = "hidden", s.style.visibility = "visible") : (e.style.visibility = "visible", i.style.visibility = "visible", s.style.visibility = "hidden")
                }
            },
            mounted: function() {
                var t = this;
                if (this.isComponentExists = !0, "undefined" == typeof window || "undefined" == typeof document) return this.printError("window or document is undefined, can not be initialization.");
                this.$nextTick(function() {
                    t.isComponentExists && (t.getStaticData(), t.setValue(t.limitValue(t.value), !0, 0), t.bindEvents())
                }), this.isMounted = !0
            },
            beforeDestroy: function() {
                this.isComponentExists = !1, this.unbindEvents()
            }
        }
    }, function(t, e, i) {
        "use strict";
        var s = i(0);
        t.exports = s
    }, function(t, e, i) {
        e = t.exports = i(4)(), e.push([t.i, '.vue-slider-component{position:relative;box-sizing:border-box;-ms-user-select:none;user-select:none;-webkit-user-select:none;-moz-user-select:none;-o-user-select:none}.vue-slider-component.vue-slider-disabled{opacity:.5;cursor:not-allowed}.vue-slider-component.vue-slider-has-label{margin-bottom:15px}.vue-slider-component.vue-slider-disabled .vue-slider-dot{cursor:not-allowed}.vue-slider-component .vue-slider{position:relative;display:block;border-radius:15px;background-color:#ccc}.vue-slider-component .vue-slider:after{content:"";position:absolute;left:0;top:0;width:100%;height:100%;z-index:2}.vue-slider-component .vue-slider-process{position:absolute;border-radius:15px;background-color:#3498db;transition:all 0s;z-index:1}.vue-slider-component .vue-slider-process.vue-slider-process-dragable{cursor:pointer;z-index:3}.vue-slider-component.vue-slider-horizontal .vue-slider-process{width:0;height:100%;top:0;left:0;will-change:width}.vue-slider-component.vue-slider-vertical .vue-slider-process{width:100%;height:0;bottom:0;left:0;will-change:height}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-process{width:0;height:100%;top:0;right:0}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-process{width:100%;height:0;top:0;left:0}.vue-slider-component .vue-slider-dot{position:absolute;border-radius:50%;background-color:#fff;box-shadow:.5px .5px 2px 1px rgba(0,0,0,.32);transition:all 0s;will-change:transform;cursor:pointer;z-index:4}.vue-slider-component .vue-slider-dot.vue-slider-dot-focus{box-shadow:0 0 2px 1px #3498db}.vue-slider-component .vue-slider-dot.vue-slider-dot-dragging{z-index:5}.vue-slider-component.vue-slider-horizontal .vue-slider-dot{left:0}.vue-slider-component.vue-slider-vertical .vue-slider-dot{bottom:0}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-dot{right:0}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-dot{top:0}.vue-slider-component .vue-slider-tooltip-wrap{display:none;position:absolute;z-index:9}.vue-slider-component .vue-slider-tooltip{display:block;font-size:14px;white-space:nowrap;padding:2px 5px;min-width:20px;text-align:center;color:#fff;border-radius:5px;border:1px solid #3498db;background-color:#3498db}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top{top:-9px;left:50%;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom{bottom:-9px;left:50%;-webkit-transform:translate(-50%,100%);transform:translate(-50%,100%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-left{top:50%;left:-9px;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-right{top:50%;right:-9px;-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}.vue-slider-component .vue-slider-tooltip-top .vue-merged-tooltip .vue-slider-tooltip:before,.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top .vue-slider-tooltip:before{content:"";position:absolute;bottom:-10px;left:50%;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-top-color:inherit;-webkit-transform:translate(-50%);transform:translate(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-merged-tooltip{display:block;visibility:hidden}.vue-slider-component .vue-slider-tooltip-bottom .vue-merged-tooltip .vue-slider-tooltip:before,.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom .vue-slider-tooltip:before{content:"";position:absolute;top:-10px;left:50%;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-bottom-color:inherit;-webkit-transform:translate(-50%);transform:translate(-50%)}.vue-slider-component .vue-slider-tooltip-left .vue-merged-tooltip .vue-slider-tooltip:before,.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-left .vue-slider-tooltip:before{content:"";position:absolute;top:50%;right:-10px;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-left-color:inherit;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-component .vue-slider-tooltip-right .vue-merged-tooltip .vue-slider-tooltip:before,.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-right .vue-slider-tooltip:before{content:"";position:absolute;top:50%;left:-10px;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-right-color:inherit;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-component .vue-slider-dot.vue-slider-hover:hover .vue-slider-tooltip-wrap{display:block}.vue-slider-component .vue-slider-dot.vue-slider-always .vue-slider-tooltip-wrap{display:block!important}.vue-slider-component .vue-slider-piecewise{position:absolute;width:100%;padding:0;margin:0;left:0;top:0;height:100%;list-style:none}.vue-slider-component .vue-slider-piecewise-item{position:absolute;width:8px;height:8px}.vue-slider-component .vue-slider-piecewise-dot{position:absolute;left:50%;top:50%;width:100%;height:100%;display:inline-block;background-color:rgba(0,0,0,.16);border-radius:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);z-index:2;transition:all .3s}.vue-slider-component .vue-slider-piecewise-item:first-child .vue-slider-piecewise-dot,.vue-slider-component .vue-slider-piecewise-item:last-child .vue-slider-piecewise-dot{visibility:hidden}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-piecewise-label,.vue-slider-component.vue-slider-horizontal .vue-slider-piecewise-label{position:absolute;display:inline-block;top:100%;left:50%;white-space:nowrap;font-size:12px;color:#333;-webkit-transform:translate(-50%,8px);transform:translate(-50%,8px);visibility:visible}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-piecewise-label,.vue-slider-component.vue-slider-vertical .vue-slider-piecewise-label{position:absolute;display:inline-block;top:50%;left:100%;white-space:nowrap;font-size:12px;color:#333;-webkit-transform:translate(8px,-50%);transform:translate(8px,-50%);visibility:visible}.vue-slider-component .vue-slider-sr-only{clip:rect(1px,1px,1px,1px);height:1px;width:1px;overflow:hidden;position:absolute!important}', ""])
    }, function(t, e) {
        t.exports = function() {
            var t = [];
            return t.toString = function() {
                for (var t = [], e = 0; e < this.length; e++) {
                    var i = this[e];
                    i[2] ? t.push("@media " + i[2] + "{" + i[1] + "}") : t.push(i[1])
                }
                return t.join("")
            }, t.i = function(e, i) {
                "string" == typeof e && (e = [
                    [null, e, ""]
                ]);
                for (var s = {}, r = 0; r < this.length; r++) {
                    var o = this[r][0];
                    "number" == typeof o && (s[o] = !0)
                }
                for (r = 0; r < e.length; r++) {
                    var n = e[r];
                    "number" == typeof n[0] && s[n[0]] || (i && !n[2] ? n[2] = i : i && (n[2] = "(" + n[2] + ") and (" + i + ")"), t.push(n))
                }
            }, t
        }
    }, function(t, e) {
        t.exports = function(t, e, i, s) {
            var r, o = t = t || {},
                n = typeof t.default;
            "object" !== n && "function" !== n || (r = t, o = t.default);
            var l = "function" == typeof o ? o.options : o;
            if (e && (l.render = e.render, l.staticRenderFns = e.staticRenderFns), i && (l._scopeId = i), s) {
                var a = Object.create(l.computed || null);
                Object.keys(s).forEach(function(t) {
                    var e = s[t];
                    a[t] = function() {
                        return e
                    }
                }), l.computed = a
            }
            return {
                esModule: r,
                exports: o,
                options: l
            }
        }
    }, function(t, e) {
        t.exports = {
            render: function() {
                var t = this,
                    e = t.$createElement,
                    i = t._self._c || e;
                return i("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: t.show,
                        expression: "show"
                    }],
                    ref: "wrap",
                    class: ["vue-slider-component", t.flowDirection, t.disabledClass, t.stateClass, {
                        "vue-slider-has-label": t.piecewiseLabel
                    }],
                    style: t.wrapStyles,
                    on: {
                        click: t.wrapClick
                    }
                }, [i("div", {
                    ref: "elem",
                    staticClass: "vue-slider",
                    style: [t.elemStyles, t.bgStyle],
                    attrs: {
                        "aria-hidden": "true"
                    }
                }, [t.isRange ? [i("div", {
                    ref: "dot0",
                    class: [t.tooltipStatus, "vue-slider-dot", {
                        "vue-slider-dot-focus": t.focusFlag && 0 === t.focusSlider,
                        "vue-slider-dot-dragging": t.flag && 0 === t.currentSlider
                    }],
                    style: [t.dotStyles, t.sliderStyles[0], t.focusFlag && 0 === t.focusSlider ? t.focusStyles[0] : null],
                    on: {
                        mousedown: function(e) {
                            t.moveStart(e, 0)
                        },
                        touchstart: function(e) {
                            t.moveStart(e, 0)
                        }
                    }
                }, [i("div", {
                    ref: "tooltip0",
                    class: ["vue-slider-tooltip-" + t.tooltipDirection[0], "vue-slider-tooltip-wrap"]
                }, [t._t("tooltip", [i("span", {
                    staticClass: "vue-slider-tooltip",
                    style: t.tooltipStyles[0]
                }, [t._v(t._s(t.formatter ? t.formatting(t.val[0]) : t.val[0]))])], {
                    value: t.val[0],
                    index: 0
                })], 2)]), t._v(" "), i("div", {
                    ref: "dot1",
                    class: [t.tooltipStatus, "vue-slider-dot", {
                        "vue-slider-dot-focus": t.focusFlag && 1 === t.focusSlider,
                        "vue-slider-dot-dragging": t.flag && 1 === t.currentSlider
                    }],
                    style: [t.dotStyles, t.sliderStyles[1], t.focusFlag && 1 === t.focusSlider ? t.focusStyles[1] : null],
                    on: {
                        mousedown: function(e) {
                            t.moveStart(e, 1)
                        },
                        touchstart: function(e) {
                            t.moveStart(e, 1)
                        }
                    }
                }, [i("div", {
                    ref: "tooltip1",
                    class: ["vue-slider-tooltip-" + t.tooltipDirection[1], "vue-slider-tooltip-wrap"]
                }, [t._t("tooltip", [i("span", {
                    staticClass: "vue-slider-tooltip",
                    style: t.tooltipStyles[1]
                }, [t._v(t._s(t.formatter ? t.formatting(t.val[1]) : t.val[1]))])], {
                    value: t.val[1],
                    index: 1
                })], 2)])] : [i("div", {
                    ref: "dot",
                    class: [t.tooltipStatus, "vue-slider-dot", {
                        "vue-slider-dot-focus": t.focusFlag && 0 === t.focusSlider,
                        "vue-slider-dot-dragging": t.flag && 0 === t.currentSlider
                    }],
                    style: [t.dotStyles, t.sliderStyles, t.focusFlag && 0 === t.focusSlider ? t.focusStyles : null],
                    on: {
                        mousedown: t.moveStart,
                        touchstart: t.moveStart
                    }
                }, [i("div", {
                    class: ["vue-slider-tooltip-" + t.tooltipDirection, "vue-slider-tooltip-wrap"]
                }, [t._t("tooltip", [i("span", {
                    staticClass: "vue-slider-tooltip",
                    style: t.tooltipStyles
                }, [t._v(t._s(t.formatter ? t.formatting(t.val) : t.val))])], {
                    value: t.val
                })], 2)])], t._v(" "), i("ul", {
                    staticClass: "vue-slider-piecewise"
                }, t._l(t.piecewiseDotWrap, function(e, s) {
                    return i("li", {
                        key: s,
                        staticClass: "vue-slider-piecewise-item",
                        style: [t.piecewiseDotStyle, e.style]
                    }, [t._t("piecewise", [t.piecewise ? i("span", {
                        staticClass: "vue-slider-piecewise-dot",
                        style: [t.piecewiseStyle, e.inRange ? t.piecewiseActiveStyle : null]
                    }) : t._e()], {
                        label: e.label,
                        index: s,
                        first: 0 === s,
                        last: s === t.piecewiseDotWrap.length - 1,
                        active: e.inRange
                    }), t._v(" "), t._t("label", [t.piecewiseLabel ? i("span", {
                        staticClass: "vue-slider-piecewise-label",
                        style: [t.labelStyle, e.inRange ? t.labelActiveStyle : null]
                    }, [t._v("\n            " + t._s(e.label) + "\n          ")]) : t._e()], {
                        label: e.label,
                        index: s,
                        first: 0 === s,
                        last: s === t.piecewiseDotWrap.length - 1,
                        active: e.inRange
                    })], 2)
                })), t._v(" "), i("div", {
                    ref: "process",
                    class: ["vue-slider-process", {
                        "vue-slider-process-dragable": t.isRange && t.processDragable
                    }],
                    style: t.processStyle,
                    on: {
                        click: t.processClick,
                        mousedown: function(e) {
                            t.moveStart(e, 0, !0)
                        },
                        touchstart: function(e) {
                            t.moveStart(e, 0, !0)
                        }
                    }
                }, [i("div", {
                    ref: "mergedTooltip",
                    staticClass: "vue-merged-tooltip",
                    class: ["vue-slider-tooltip-" + t.tooltipDirection[0], "vue-slider-tooltip-wrap"],
                    style: t.tooltipMergedPosition
                }, [t._t("tooltip", [i("span", {
                    staticClass: "vue-slider-tooltip",
                    style: t.tooltipStyles
                }, [t._v("\n            " + t._s(t.mergeFormatter ? t.mergeFormatting(t.val[0], t.val[1]) : t.formatter ? t.formatting(t.val[0]) + " - " + t.formatting(t.val[1]) : t.val[0] + " - " + t.val[1]) + "\n          ")])])], 2)]), t._v(" "), t.isRange || t.data ? t._e() : i("input", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: t.val,
                        expression: "val"
                    }],
                    staticClass: "vue-slider-sr-only",
                    attrs: {
                        type: "range",
                        min: t.min,
                        max: t.max
                    },
                    domProps: {
                        value: t.val
                    },
                    on: {
                        __r: function(e) {
                            t.val = e.target.value
                        }
                    }
                })], 2)])
            },
            staticRenderFns: []
        }
    }, function(t, e, i) {
        var s = i(3);
        "string" == typeof s && (s = [
            [t.i, s, ""]
        ]), s.locals && (t.exports = s.locals);
        i(8)("743d98f5", s, !0)
    }, function(t, e, i) {
        function s(t) {
            for (var e = 0; e < t.length; e++) {
                var i = t[e],
                    s = d[i.id];
                if (s) {
                    s.refs++;
                    for (var r = 0; r < s.parts.length; r++) s.parts[r](i.parts[r]);
                    for (; r < i.parts.length; r++) s.parts.push(o(i.parts[r]));
                    s.parts.length > i.parts.length && (s.parts.length = i.parts.length)
                } else {
                    for (var n = [], r = 0; r < i.parts.length; r++) n.push(o(i.parts[r]));
                    d[i.id] = {
                        id: i.id,
                        refs: 1,
                        parts: n
                    }
                }
            }
        }

        function r() {
            var t = document.createElement("style");
            return t.type = "text/css", h.appendChild(t), t
        }

        function o(t) {
            var e, i, s = document.querySelector('style[data-vue-ssr-id~="' + t.id + '"]');
            if (s) {
                if (f) return v;
                s.parentNode.removeChild(s)
            }
            if (m) {
                var o = p++;
                s = c || (c = r()), e = n.bind(null, s, o, !1), i = n.bind(null, s, o, !0)
            } else s = r(), e = l.bind(null, s), i = function() {
                s.parentNode.removeChild(s)
            };
            return e(t),
                function(s) {
                    if (s) {
                        if (s.css === t.css && s.media === t.media && s.sourceMap === t.sourceMap) return;
                        e(t = s)
                    } else i()
                }
        }

        function n(t, e, i, s) {
            var r = i ? "" : s.css;
            if (t.styleSheet) t.styleSheet.cssText = g(e, r);
            else {
                var o = document.createTextNode(r),
                    n = t.childNodes;
                n[e] && t.removeChild(n[e]), n.length ? t.insertBefore(o, n[e]) : t.appendChild(o)
            }
        }

        function l(t, e) {
            var i = e.css,
                s = e.media,
                r = e.sourceMap;
            if (s && t.setAttribute("media", s), r && (i += "\n/*# sourceURL=" + r.sources[0] + " */", i += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(r)))) + " */"), t.styleSheet) t.styleSheet.cssText = i;
            else {
                for (; t.firstChild;) t.removeChild(t.firstChild);
                t.appendChild(document.createTextNode(i))
            }
        }
        var a = "undefined" != typeof document;
        if ("undefined" != typeof DEBUG && DEBUG && !a) throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");
        var u = i(9),
            d = {},
            h = a && (document.head || document.getElementsByTagName("head")[0]),
            c = null,
            p = 0,
            f = !1,
            v = function() {},
            m = "undefined" != typeof navigator && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
        t.exports = function(t, e, i) {
            f = i;
            var r = u(t, e);
            return s(r),
                function(e) {
                    for (var i = [], o = 0; o < r.length; o++) {
                        var n = r[o],
                            l = d[n.id];
                        l.refs--, i.push(l)
                    }
                    e ? (r = u(t, e), s(r)) : r = [];
                    for (var o = 0; o < i.length; o++) {
                        var l = i[o];
                        if (0 === l.refs) {
                            for (var a = 0; a < l.parts.length; a++) l.parts[a]();
                            delete d[l.id]
                        }
                    }
                }
        };
        var g = function() {
            var t = [];
            return function(e, i) {
                return t[e] = i, t.filter(Boolean).join("\n")
            }
        }()
    }, function(t, e) {
        t.exports = function(t, e) {
            for (var i = [], s = {}, r = 0; r < e.length; r++) {
                var o = e[r],
                    n = o[0],
                    l = o[1],
                    a = o[2],
                    u = o[3],
                    d = {
                        id: t + ":" + r,
                        css: l,
                        media: a,
                        sourceMap: u
                    };
                s[n] ? s[n].parts.push(d) : i.push(s[n] = {
                    id: n,
                    parts: [d]
                })
            }
            return i
        }
    }])
});