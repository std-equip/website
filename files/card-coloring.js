const vue_card_color = {
	_inited: false,
	create(references) {
		if (!vue_card_color._inited) {
			vue_card_color._inited = true;
			return vue_card_color._goods_colors(references);
		}
	},
	colors2names(brands) {
		const names = {};
		for (let i in brands) {
			const brand = brands[i];
			for (let j in brand.groups) {
				const group = brand.groups[j];
				for (let k in group.colors) {
					const color = group.colors[k];
					color.brand_id = brand.id;
					color.brand_name = brand.name;
					color.group_id = group.id;
					color.group_name = group.name;
					color.color_bg = group.color_bg;
					color.color_text = group.color_text;
					color.name_lower = color.name.toLowerCase();

					names[color.id] = color;
				}
			}
		}
		return names;
	},
	optimize_colors(goods_colors) {
		return Array.isArray(goods_colors) ? {} : goods_colors;
	},

	_goods_colors(references) {
		return Vue.component("cart-goods-colors", {
			props: [
				"goods",
				"colors_in_cart",
				"quantity",
				"references",
				"ajax_cart",
				"startde",
				"is_mobile",
				"is_company",
			],
			template: "#cart-goods-colors",
			data() {
				return {
					current_brand: null,
					current_group: null,
					current_color: null,
					showListColor: false,
					borderColor: null,
					filter: "",
					colors: [],
					current_color_quantity: 1,
				};
			},
			created() {
				this.initializeData();
			},
			watch: {
				visible_colors(new_value, old_value) {
					if (new_value !== old_value)
						this.current_color =
							new_value.length > 0 ? new_value[0] : null;
				},
				current_brand(new_value) {
					// this.current_group =
					// 	new_value != null && new_value.groups.length > 0
					// 		? new_value.groups[0]
					// 		: null;
					this.current_group = null;
				},
				// colors(new_value) {
				// 	let quantity = this.quantity;
				// 	console.log(new_value);
				// 	for (let i in new_value) {
				// 		if (new_value[i].quantity > quantity) {
				// 			new_value[i].quantity = quantity;
				// 		}
				// 		quantity -= new_value[i].quantity;
				// 	}
				// },
				current_color(new_value) {
					this.borderColor = this.changeBorderColor(new_value.color);
					this.current_color_quantity = 1;
				},
				quantity_colored(new_value) {
					const n = this.quantity - new_value;
					this.current_color_quantity = 1;
				},
			},
			mounted: function () {
				const self = this;
				$(document).mouseup(function (e) {
					// событие клика по веб-документу
					var div = $(".select");
					if (!div.is(e.target) && div.has(e.target).length === 0) {
						self.showListColor = false;
					}
				});
				// let heightContentBlock=$(window).height()- 64 - 40 - $('.shopping_cart_color_popup .cart_popup_head').height();
				// $('.color_popup_content').css('height',heightContentBlock+'px');
			},
			computed: {
				filtered_colors() {
					const result = [];

					for (let i in references.colors) {
						const brand = references.colors[i];
						const colors = this._filterColors(
							this.brands2colors[brand.id],
							this.filter
						);
						if (colors.length > 0) {
							result.push({
								brand: brand,
								colors: colors,
							});
						}
					}

					return result;
				},
				filtered_colors_length() {
					let result = 0;

					for (let k in this.filtered_colors) {
						result += this.filtered_colors[k].colors.length;
					}

					return result;
				},
				brands() {
					return references.colors;
				},
				quantity_colored() {
					let quantity = 0;
					for (let i in this.colors) {
						if (this.colors[i].quantity == 0) {
							this.colors.splice(i, 1);
						}
						quantity += parseInt(this.colors[i].quantity);
					}

					return quantity;
				},
				all_groups() {
					let colors = [];
					for (let i in references.colors) {
						const brand = references.colors[i];
						for (let j in brand.groups) {
							const group = brand.groups[j];
							colors = colors.concat(group);
						}
					}

					const result = {};
					for (let color of colors) {
						if (!(color.name in result)) {
							result[color.name] = color;
						} else {
							let new_colors = result[color.name].colors.concat(
								color.colors.filter(
									(item) =>
										result[color.name].colors.indexOf(
											item
										) < 0
								)
							);
							result[color.name].colors = new_colors;
						}
					}

					return result;
				},
				brands2colors() {
					const result = {};
					for (let i in references.colors) {
						const brand = references.colors[i];
						let colors = [];
						for (let j in brand.groups) {
							const group = brand.groups[j];
							colors = colors.concat(group.colors);
						}

						result[brand.id] = colors;
					}

					return result;
				},

				fullColorPallete() {
					return $.merge(
						$.merge(
							$.merge([], this.brands2colors[1]),
							this.brands2colors[2]
						),
						this.brands2colors[3]
					);
				},
				visible_colors() {
					let unfiltered_result = [];
					if (this.current_brand != null) {
						unfiltered_result =
							this.current_group != null
								? this.current_group.colors
								: this.brands2colors[this.current_brand.id];
					} else {
						if (this.current_group === null) {
							//this.current_group = this.brands[0].groups[0];
							// if (this.current_color === null) {
							// 	//this.current_color = this.fullColorPallete[0];
							// } else {
							// 	this.borderColor = this.changeBorderColor(
							// 		this.current_color.color
							// 	);
							// }

							unfiltered_result = this.fullColorPallete;
						} else {
							unfiltered_result = this.current_group.colors;
						}
					}

					if (this.filter === "") {
						return unfiltered_result;
					}

					return this._filterColors(unfiltered_result, this.filter);
				},
				// current_color_quantity(){
				// 	if(this.quantity-this.quantity_colored === 0 ){
				// 		return 0;
				// 	} else {
				// 		return 1;
				// 	}
				// }
			},
			methods: {
				initializeData() {
					const self = this;
					if (self.colors_in_cart.length > 0) {
						self.colors=[];
						self.colors_in_cart.forEach(function (color_in_cart) {
							self.colors.push({ ...color_in_cart });
						});
					} else {
						self.colors = [];
					}
					self.validateColors(self.colors);
				},
				nf_price(price, decimals) {
					return nf_price(price, decimals);
				},
				validateColors(colorsArr) {
					// const g_colors = colorsArr;
					// let quantity = this.quantity;
					// for (let i in g_colors) {
					// 	if (g_colors[i].quantity > quantity) {
					// 		g_colors[i].quantity = quantity;
					// 		if (quantity == 0) {
					// 			g_colors.splice(i, 1);
					// 		}
					// 	}

					// 	quantity -= g_colors[i].quantity;
					// }
				},
				_filterColors(colors, search) {
					const lower = search.toLowerCase();
					const result = [];

					for (let i in colors) {
						const color = colors[i];
						if (color.name_lower.includes(lower)) {
							result.push(color);
						}
					}

					return result;
				},
				colorMain(color_id) {
					const color = references.colors2names[color_id];
					return color.color;
				},
				colorText(color_id) {
					var bgColor = references.colors2names[color_id].color; // .color_bg
					var color =
						bgColor.charAt(0) === "#"
							? bgColor.substring(1, 7)
							: bgColor;
					var r = parseInt(color.substring(0, 2), 16); // hexToR
					var g = parseInt(color.substring(2, 4), 16); // hexToG
					var b = parseInt(color.substring(4, 6), 16); // hexToB
					return r * 0.299 + g * 0.587 + b * 0.114 > 186
						? "#000"
						: "#FFF";
				},
				colorName(color_id) {
					const color = references.colors2names[color_id];
					return (
						"<span class='cart_popup_sidebar_item_name_brand'>" +
						color.brand_name +
						"</span><span class='cart_popup_sidebar_item_name_color'>" +
						color.name +
						"</span>"
					);
				},
				change(color, delta, index) {
					let q = parseInt(color.quantity) + delta;
					if (q <= 0) {
						this.colors.splice(index, 1);
					}
					color.quantity = q;
				},
				checkMaxCountColoring(color) {
					return this.colors.reduce(function (total, colorItem) {
						// Суммируем только те продукты, которые не равны переданному продукту по id
						return colorItem.id !== color.id
							? total + colorItem.quantity
							: total;
					}, 0);
				},
				changeValueInput(color) {
					// let val = this.quantity - this.checkMaxCountColoring(color);
					// if (color.quantity > val) {
					// 	color.quantity = val;
					// }
				},

				deleteColorPop(index) {
					const self = this;
					popups.confirm(
						'Данный цвет будет удален. Удалить цвет?',
						function() {
							self.colors.splice(index, 1);;
						},
						'Да',
						'Нет'
					);
				},
				close() {
					$("body").css("overflow-y", "auto");
					this.$emit("close");
				},

				_indexOf(color_id) {
					for (let i = 0; i < this.colors.length; i++) {
						if (this.colors[i].id === color_id) {
							return i;
						}
					}

					return -1;
				},
				add() {
					if (this.current_color === null) {
						return;
					}
					if (this.current_color_quantity == 0) {
						return;
					}
					// if (
					// 	this.quantity <
					// 	this.quantity_colored + this.current_color_quantity
					// ) {
					// 	return;
					// }

					const index = this._indexOf(this.current_color.id);
					if (index === -1) {
						this.colors.push({
							id: this.current_color.id,
							quantity: this.current_color_quantity,
						});
					} else {
						this.change(
							this.colors[index],
							+this.current_color_quantity, index
						);
					}
				},
				changeBorderColor(bgColor) {
					var color =
						bgColor.charAt(0) === "#"
							? bgColor.substring(1, 7)
							: bgColor;
					var r = parseInt(color.substring(0, 2), 16); // hexToR
					var g = parseInt(color.substring(2, 4), 16); // hexToG
					var b = parseInt(color.substring(4, 6), 16); // hexToB
					return r * 0.299 + g * 0.587 + b * 0.114 > 186
						? "#DAE0E8"
						: bgColor;
				},
				changeCount(value) {
					let q = this.current_color_quantity + value;
					if (q <= 0) {
						q = 1;
					}
					// const n = this.quantity - this.quantity_colored;
					// if (q > n) {
					// 	q = n;
					// }
					this.current_color_quantity = q;
				},
				colorNamePage(color_id) {
					const color = this.references.colors2names[color_id];
					return (
						"<span class='cart_popup_sidebar_item_name_brand'>" +
						color.brand_name +
						" " +
						color.name +
						"</span>"
					);
				},
				colorsPriceOpenModalText() {
					if (this.goods.price_per_coloring < 0 || this.is_company) {
						return '<span class="color-value">Уточним цену</span>';
					}
					var price = 0;

					for (let indexItem in this.colors) {
						price += Math.ceil(
							this.goods.price_per_coloring *
								this.colors[indexItem].quantity
						);
					}
					//var price =  Math.ceil(this.goods.price_per_coloring * this.quantity_colored)
					if (price === 0) {
						return '<span class="color-value">Бесплатно</span>';
					}
					return (
						this.nf_price(price) +
						` <svg
						width="10"
						height="11"
						viewBox="0 0 10 12"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M2.2395 12V9.824H0.8475V8.784H2.2395V7.36H0.8475V6.144H2.2395V0.575999H5.2475C6.64483 0.575999 7.6795 0.858666 8.3515 1.424C9.03417 1.98933 9.3755 2.81067 9.3755 3.888C9.3755 4.976 9.0075 5.82933 8.2715 6.448C7.5355 7.056 6.45283 7.36 5.0235 7.36H3.6795V8.784H6.3195V9.824H3.6795V12H2.2395ZM4.8155 6.144C5.78617 6.144 6.53817 5.984 7.0715 5.664C7.6155 5.344 7.8875 4.768 7.8875 3.936C7.8875 3.21067 7.6635 2.672 7.2155 2.32C6.7675 1.968 6.06883 1.792 5.1195 1.792H3.6795V6.144H4.8155Z"
							fill="#000c2c"></path>
					</svg>`
					);
				},
				saveColorsClose() {
					let self = this;
					let saveC = this.colors;
					if(self.quantity<self.quantity_colored){
						$('.js-addCart-btn').click();
						$('.catalog__goods__param__form__add_block__form__group__input').val(self.quantity_colored).change();

						setTimeout(function () {
							self.$emit("save_color", saveC);
							//self.saveColors(saveC);
							self.close();
						}, 400);
					} else {
						self.$emit("save_color", saveC);
						self.close();
					}
				},
			},
		});
	},
};
const vue_card_cutting = {
	_inited: false,
	create() {
		if (!vue_card_color._inited) {
			vue_card_color._inited = true;
			return vue_card_cutting._goods_cutting();
		}
	},
	_goods_cutting() {
		return Vue.component("cart-goods-cutting", {
			props: [
				"goods",
				"cutting_in_cart",
				"quantity",
				"ajax_cart",
				"startde",
				"is_mobile",
				"is_company",
			],
			template: "#cart-goods-cutting",
			data() {
				return {
					min: 50,
					step: 5,
					sizeRatio: 0.05,

					slice: 0,
					show_add: true,
					_sizes: [],
					size: -1,
					sub_size: -1,
					current_cut: {
						quantity: 1,
						free_quantity: 0,
						slices: [],
					},
					cutting_direction: false,
					viewArea: [0, 0],
					range_style: null,
					sliceInput: 0,
					cuts: [],
				};
			},
			created() {
				this._sizes = [
					this.goods.length * 1000,
					this.goods.width * 1000,
					this.goods.height * 1000,
				]
					.sort(function (a, b) {
						return a - b;
					})
					.reverse();
				this.size = this._sizes[0];
				this.sub_size = this._sizes[1];

				this.resetCurrent();
				this.initializeData();
			},
			watch: {
				cuts(new_value, old_value) {


				},
				slice(new_value, old_value) {
					new_value = parseInt(new_value, 10);

					let clamped = new_value;
					// if(!clamped) {
					// 	clamped=this.min
					// }
					this.sliceInput = parseInt(clamped);
					
					if (new_value !== clamped && clamped >= this.min) {
						const self = this;
						this.$nextTick(function () {
							self.slice = clamped;
						});
					}
				},
				size_available(new_value) {
					this.range_style = this.range_style_function();
				},
			},
			computed: {
				quantity_cutted() {
					let quantity = 0;
					for (let i in this.cuts) {
						quantity += parseInt(this.cuts[i].quantity);
					}

					return quantity;
				},

				size_available() {
					return this.size - this.currentSlicesTotal();
				},
				size_first() {
					return this.size === this._sizes[0];
				},
				allow_cut() {
					return this.size_available > this.min * 2;
				},
				allow_rotate() {
					const valid_width = this._sizes[1] > this.min * 2;
					const valid_rate =
						this._sizes[1] / this._sizes[0] > this.sizeRatio;
					return valid_width && valid_rate;
				},

			},
			mounted: function () {
				//let heightContentBlock=$(window).height()- 64 - 40 - $('.shopping_cart_cutting_popup.result .cart_popup_head').height();
				//$('.cutting_popup_content').css('height',heightContentBlock+'px');
				let widthBlock = Math.floor(
					$(".shopping_cart_cutting_popup .main-block")
						.eq(0)
						.innerWidth()
				);
				let heighthBlock = Math.floor(
					$(".shopping_cart_cutting_popup .main-block")
						.eq(0)
						.innerHeight()
				);
				this.viewArea = [widthBlock, heighthBlock];
				this.range_style = this.range_style_function();
				this.current_cut.quantity =1;
			},
			methods: {
				validateEmptyVal(){
					if(!parseInt(this.slice)){
						this.sliceInput = parseInt(this.min);
						this.slice= parseInt(this.min)
					}
				},
				initializeData() {
					const self = this;
					console.log(self.cutting_in_cart);
					self.cuts = [];
					if (self.cutting_in_cart.length > 0) {
						self.cutting_in_cart.forEach(function (cut_in_cart) {
							
								// Если элемент не найден, добавляем его в массив self.colors
								self.cuts.push({ ...cut_in_cart });

						});
					}
					console.log(self.cuts)
					self.validateCuts(self.cuts);
				},

				validateCuts(cuts) {
					const g_cuts = cuts;
					let quantity = this.quantity_cutted;
					let free_quantity = this.is_company ? 0 : quantity;
					for (let i in g_cuts) {
						const cut = g_cuts[i];
						if (!cut.quantity) {
							cut.quantity = 0;
							g_cuts.splice(i, 1);
						}
						if (cut.quantity==0) {
							g_cuts.splice(i, 1);
						}
						// if (cut.quantity > quantity && !this.is_mobile) {
						// 	cut.quantity = quantity;
						// }

						cut.free_quantity = Math.min(
							free_quantity,
							cut.quantity * (cut.slices.length - 1)
						);

						// quantity -= cut.quantity;
						free_quantity -= cut.free_quantity;
					}
				},
				range_style_function() {
					const thumb_size = 18;

					const rate =
						(this.size_first
							? this.viewArea[0]
							: this.viewArea[1]) / this.size;
					let deltaRange = 0;
					if (
						(this.size_available / 2) % 5 == 0 &&
						(this.size_available / 2) % 10 != 0
					) {
						deltaRange = 1.5;
					}
					if (!this.cutting_direction) {
						return {
							width:
								"" +
								(thumb_size +
									rate *
										(this.size_available -
											this.min -
											this.min)) +
								"px",
							left:
								"" +
								(rate *
									(this.size -
										(this.size_available - this.min)) -
									deltaRange) +
								"px",
						};
					} else {
						return {
							width:
								"" +
								(thumb_size +
									rate *
										(this.size_available -
											this.min -
											this.min)) +
								"px",
							// 'top': '' +(rate * (this.size - this.size_available
							// ) )+ 'px',
							bottom:
								"" + (rate * this.min - thumb_size / 2) + "px",
							top: "unset",
						};
					}
				},
				sum(slices) {
					let result = 0;
					for (let i = 0; i < slices.length; i++) {
						result += slices[i];
					}

					return result;
				},
				reduce() {
					const n = this.current_cut.slices.length;
					if (n === 0) {
						return;
					}

					this.current_cut.slices.splice(n - 1, 1);
					this.slice = Math.floor(this.size_available / 2);
				},
				currentSlicesTotal() {
					let slices = 0;
					for (let i in this.current_cut.slices) {
						slices += this.current_cut.slices[i];
					}

					return slices;
				},
				price() {
					let q = this.is_company ? 0 : (this.quantity_cutted>this.quantity?this.quantity_cutted:this.quantity);
					if (this.cutsTotal() <= q) {
						return 0;
					}
					return (this.cutsTotal() - q) * this.goods.cut_price;
				},
				total() {
					const p = this.price();
					return p === 0 ? "Бесплатно" : this.nf_price(p) + " ₽";
				},
				cutsTotal() {
					let cuts = 0;
					for (let i in this.cuts) {
						const c = this.cuts[i];
						cuts += c.quantity * (c.slices.length - 1);
					}

					return cuts;
				},
				resetCurrent() {
					this.current_cut = {
						quantity: this.current_cut.quantity,
						free_quantity: 0,
						slices: [], // Math.floor(this.size / 2),
					};
					this.slice = Math.floor(this.size / 2);
				},
				addSlice() {
					dataLayerPush("mic_click_popup_rezkaraspil_srez");
					const s = parseInt(this.slice, 10);
					if (s <= 0 || s > this.size_available) {
						return;
					}

					this.current_cut.slices.push(s);
					this.slice = Math.floor(this.size_available / 2);
				},
				add() {
					dataLayerPush("mic_click_popup_rezkaraspil_applyconf");
					console.log(this.current_cut);
					if (this.currentSlicesTotal() >= this.size) {
						return;
					}

					if (this.current_cut.slices.length === 0) {
						return;
					}

					this.current_cut.slices.push(this.size_available);
					
					this.cuts.push(this.current_cut);

					this.resetCurrent();
					this.current_cut.quantity = 1;
				},
				close() {
					$("body").css("overflow-y", "auto");
					this.$emit("close");
				},
				_validateQuantity(q) {
					if (q <= 0) {
						q = 1;
					}
					return q;
				},
				change_current(delta) {
					this.current_cut.quantity = this._validateQuantity(
						this.current_cut.quantity + delta
					);
				},
				change(cut, delta, index) {
					let q = parseInt(cut.quantity) + delta;

						if (q <= 0) {
							this.cuts.splice(index, 1);
						}
						cut.quantity = q;
				},
				_rotate(direction) {
					this.cutting_direction = direction;
					if (this.cutting_direction) {
						this.size = this._sizes[1];
						this.sub_size = this._sizes[0];
					} else {
						this.size = this._sizes[0];
						this.sub_size = this._sizes[1];
					}

					this.resetCurrent();
				},
				rotate(direction) {
					const self = this;
					popups.confirm(
						"Текущая конфигурация будет сброшена. Произвести поворот?",
						function () {
							self._rotate(direction);
						},
						"Да",
						"Нет"
					);
				},
				deleteCutPop(index) {
					const self = this;
					popups.confirm(
						'Текущая конфигурация будет удалена. Удалить конфигурацию?',
						function() {
							self.cuts.splice(index, 1);
						},
						'Да',
						'Нет'
					);
				},
				slice2css(slice) {
					const rate =
						(this.size_first
							? this.viewArea[0]
							: this.viewArea[1]) / this.size;
					return "" + rate * slice + "px";
				},

				saveCutsClose() {
					let self = this;
					let saveC = this.cuts;
					if(self.quantity<self.quantity_cutted){
						$('.js-addCart-btn').click();
						$('.catalog__goods__param__form__add_block__form__group__input').val(self.quantity_cutted).change();

						setTimeout(function () {
							self.$emit("save_cut", saveC);
							//self.saveColors(saveC);
							self.close();
						}, 400);
					} else {
						self.$emit("save_cut", saveC);
						//self.saveColors(saveC);
						self.close();
					}
				},
				number_format(number, decimals, dec_point, thousands_sep) {
					return number_format(
						number,
						decimals,
						dec_point,
						thousands_sep
					);
				},
				number_text(number, textes) {
					return number_text(number, textes);
				},
				nf_price(price, decimals)
				{
					return nf_price(price, decimals);
				},

				changeValueInput(cut) {
					this.validateCuts(this.cuts);
				},
			},
		});
	},
};
