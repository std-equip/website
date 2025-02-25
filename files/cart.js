'use strict';

const vue_cart = {
	_inited: false,
	mixins: null,
	mixins_format: {
		methods: {
			valid_goods_price(price, price_type)
			{
				if (typeof price_type === 'undefined')
				{
					price_type = 'request';
				}

				return !(price === 0 && price_type === 'request'
				);
			},
			goods_price(price, price_type, symbol, decimals)
			{
				if (typeof symbol === 'undefined')
				{
					symbol = '';
				}
				
				if (decimals)
				{
					decimals = this.constants.MODE_COMPANY ? parseInt(decimals) : undefined;
				}				

				return this.valid_goods_price(price, price_type)
					? nf_price(price, decimals) + symbol
					: 'по запросу';
			},
			nf_price(price, decimals)
			{
				return nf_price(price, decimals);
			},
			number_format(number, decimals, dec_point, thousands_sep)
			{
				return number_format(number, decimals, dec_point, thousands_sep);
			},
			number_text(number, textes)
			{
				return number_text(number, textes);
			},
			phone_format(phone)
			{
				return phone_format(phone);
			},
			close_custom_window()
			{
				$('.shopping_cart_cutting_popup').css('zIndex', '9991');
				$('.shopping_cart_cutting_popup').removeClass('shopping_cart_cutting_popup--noscroll');
				$('.cut_link_info_popup').addClass('popup_hidden');
				$('#overlay').off('click');
			},
			copyLinkCart(linkToCopy){
				var $tmp = $("<textarea>");
				$("body").append($tmp);
				$tmp.val(linkToCopy).select();
				document.execCommand("copy");
				$tmp.remove();
				popups.alertNew('Ссылка успешно скопирована', 'Вы можете поделиться корзиной где угодно',true);
			},
			 
			open_custom_window()
			{
				$('.shopping_cart_cutting_popup').css('zIndex', '9988');
				$('.shopping_cart_cutting_popup').addClass('shopping_cart_cutting_popup--noscroll');
				$('.cut_link_info_popup').removeClass('popup_hidden');
				$('#overlay').on('click', this.close_custom_window);
			},
		},
	},
	/**
	 *
	 * @param {*} data
	 * @param {*} ajax_cart
	 * @param {*} constants
	 * @param {YandexMap} map
	 * @param {*} references
	 * @param {*} map_config
	 * @returns {*}
	 */
	create(data, ajax_cart, constants, map, references,map_config)
	{
		vue_cart.mixins = vue_cart._mixins(constants);
		if (!vue_cart._inited)
		{
			vue_cart._goods_cut(vue_cart.mixins);
			vue_cart._goods_colors_brands(vue_cart.mixins);
			vue_cart._goods_colors(vue_cart.mixins, references);
			vue_cart._transport(vue_cart.mixins);
			vue_cart._action_delivery(vue_cart.mixins);
			vue_cart._action_bonus(vue_cart.mixins);
			vue_cart._action_modal(vue_cart.mixins);
			vue_cart._action_delivery_modal(vue_cart.mixins,constants, map);
			vue_cart._action_delivery_mapblock(vue_cart.mixins,references,map_config,ajax_cart);
			vue_cart._action(vue_cart.mixins);
			vue_cart._goods(vue_cart.mixins, references);
			vue_cart._soldout_modal(vue_cart.mixins);

			vue_cart._inited = true;
		}
		window.sessionStorage.removeItem('step_to_save')
		return vue_cart._cart(data, ajax_cart, vue_cart.mixins, map);
	},
	colors2names(brands)
	{
		const names = {};
		for (let i in brands)
		{
			const brand = brands[i];
			for (let j in brand.groups)
			{
				const group = brand.groups[j];
				for (let k in group.colors)
				{
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
	optimize_cuts(goods_cuts)
	{
		return Array.isArray(goods_cuts) ? {} : goods_cuts;
	},
	optimize_colors(goods_colors)
	{
		return Array.isArray(goods_colors) ? {} : goods_colors;
	},

	_mixins(constants)
	{
		const mixins_constants = {
			computed: {
				constants()
				{
					return deepFreeze(constants);
				},
			},
		};

		return [vue_cart.mixins_format, mixins_constants];
	},

	_goods_colors_brands(mixins)
	{
		return Vue.component('cart-goods-colors-brand', {
			mixins: mixins,
			props: ['brand', 'selected', 'colors'],
			template: '#cart-goods-colors-brand',
			methods: {
				select(brand)
				{
					this.$emit('select', brand);
				},
			},
		});
	},

	_goods_cut(mixins)
	{
		return Vue.component('cart-goods-cuts', {
			mixins: mixins,
			props: ['goods', 'quantity', 'cuts', 'tech_url', 'is_company'],
			template: '#cart-goods-cuts',
			data()
			{
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
					cutting_direction:false,
					viewArea:[0,0],
					range_style:null,
					sliceInput:0,
				};
			},
			created()
			{
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
				
				
				
			},
			watch: {
				cuts(new_value, old_value)
				{
					let quantity = this.quantity;
					if (new_value.length === 0)
					{
						this.show_add = true;
					}

					for (let i in new_value)
					{
						const cut = new_value[i];
						if (cut.quantity > quantity)
						{
							cut.quantity = quantity;
						}

						quantity -= cut.quantity;
					}
				},
				slice(new_value, old_value)
				{
					new_value = parseInt(new_value, 10);

					let clamped = new_value;

					this.sliceInput=clamped;
					if (new_value !== clamped && clamped >= this.min)
					{
						const self = this;
						this.$nextTick(function () {
							self.slice = clamped;
							
						});
					}
				},
				size_available(new_value){
					this.range_style=this.range_style_function();
				},
			},
			computed: {
				quantity_cutted()
				{
					let quantity = 0;
					for (let i in this.cuts)
					{
						quantity += this.cuts[i].quantity;
					}

					return quantity;
				},

				size_available()
				{
					return this.size - this.currentSlicesTotal();
				},
				size_first()
				{
					return this.size === this._sizes[0];
				},
				allow_cut()
				{
					return this.size_available > this.min * 2;
				},
				allow_rotate()
				{
					const valid_width = this._sizes[1] > this.min * 2;
					const valid_rate = this._sizes[1] / this._sizes[0] > this.sizeRatio;
					return valid_width && valid_rate;
				},

			},
			mounted: function(){
					$('body').css('overflow-y', 'hidden');
					//let heightContentBlock=$(window).height()- 64 - 40 - $('.shopping_cart_cutting_popup.result .cart_popup_head').height();
					//$('.cutting_popup_content').css('height',heightContentBlock+'px');
					let widthBlock=Math.floor($('.shopping_cart_cutting_popup .main-block').eq(0).innerWidth())
					let heighthBlock=Math.floor($('.shopping_cart_cutting_popup .main-block').eq(0).innerHeight())
					this.viewArea=[widthBlock, heighthBlock];
					this.range_style=this.range_style_function();
					this.current_cut.quantity=(this.quantity - this.quantity_cutted===0?0:1);
				},
			methods: {
				range_style_function()
				{
					const thumb_size = 18;
					
					const rate =
						((this.size_first ? this.viewArea[0] : this.viewArea[1]
						) /
						this.size);
					let deltaRange=0;
					if((this.size_available/2)%5==0&&(this.size_available/2)%10!=0){
						deltaRange=1.5
					}
					if(!this.cutting_direction){
						return {
							width: '' + (thumb_size +rate * (this.size_available - this.min - this.min)
							) + 'px',
							'left': '' +( rate * (this.size - (this.size_available- this.min)
							) - deltaRange)+ 'px',
						};
					} else {
						return {
							width: '' + (thumb_size +rate * (this.size_available - this.min - this.min)
							) + 'px',
							// 'top': '' +(rate * (this.size - this.size_available
							// ) )+ 'px',
							bottom: '' +( rate * this.min
						 - thumb_size/2)+ 'px',
							top: 'unset'
						};
					}
					
				},
				sum(slices)
				{
					let result = 0;
					for (let i = 0; i < slices.length; i++)
					{
						result += slices[i];
					}

					return result;
				},
				reduce()
				{
					const n = this.current_cut.slices.length;
					if (n === 0)
					{
						return;
					}

					this.current_cut.slices.splice(n - 1, 1);
					this.slice = Math.floor(this.size_available / 2);
				},
				currentSlicesTotal()
				{
					let slices = 0;
					for (let i in this.current_cut.slices)
					{
						slices += this.current_cut.slices[i];
					}

					return slices;
				},
				price()
				{
					let q = this.is_company ? 0 : this.quantity;
					if (this.cutsTotal() <= q)
					{
						return 0;
					}
					return (this.cutsTotal() - q) * this.goods.cut_price;
				},
				total()
				{
					const p = this.price();
					return p === 0 ? 'Бесплатно' : this.nf_price(p) + ' ₽';
				},
				cutsTotal()
				{
					let cuts = 0;
					for (let i in this.cuts)
					{
						const c = this.cuts[i];
						cuts += c.quantity * (c.slices.length - 1);
					}

					return cuts;
				},
				resetCurrent()
				{
					this.current_cut = {
						quantity: this.current_cut.quantity,
						free_quantity: 0,
						slices: [], // Math.floor(this.size / 2),
					};
					this.slice = Math.floor(this.size / 2);
				},
				addSlice()
				{
					dataLayerPush('mic_click_popup_rezkaraspil_srez');
					const s = parseInt(this.slice, 10);
					if (s <= 0 || s > this.size_available)
					{
						return;
					}

					this.current_cut.slices.push(s);
					this.slice = Math.floor(this.size_available / 2);
				},
				add()
				{
					dataLayerPush('mic_click_popup_rezkaraspil_applyconf');
					if (this.currentSlicesTotal() >= this.size)
					{
						return;
					}
					if (this.quantity <= this.quantity_cutted)
					{
						return;
					}
					if (this.current_cut.slices.length === 0)
					{
						return;
					}

					this.current_cut.slices.push(this.size_available);
					this.cuts.push(this.current_cut);

					this.resetCurrent();
					this.current_cut.quantity = 1;
				},
				close()
				{
					$('body').css('overflow-y', 'auto');
					this.$emit('close');
				},
				_validateQuantity(q)
				{
					if (q <= 0)
					{
						q = 1;
					}

					const n = this.quantity - this.quantity_cutted;
					if (q > n)
					{
						q = n;
					}

					return q;
				},
				change_current(delta)
				{
					this.current_cut.quantity = this._validateQuantity(
						this.current_cut.quantity + delta
					);
				},
				change(cut, delta)
				{
					let q = cut.quantity + delta;
					if (q <= 0)
					{
						q = 1;
					}
					cut.quantity = q;
				},
				remove(index)
				{
					this.cuts.splice(index, 1);
				},
				_rotate(direction)
				{
					this.cutting_direction=direction;
					if (this.cutting_direction)
					{
						this.size = this._sizes[1];
						this.sub_size = this._sizes[0];
					}
					else
					{
						this.size = this._sizes[0];
						this.sub_size = this._sizes[1];
					}

					this.resetCurrent();
				},
				rotate(direction)
				{
					const self = this;
					popups.confirm(
						'Текущая конфигурация будет сброшена. Произвести поворот?',
						function () {
							self._rotate(direction);
						},
						'Да',
						'Нет'
					);
				},
				deleteCutPop(index)
				{
					const self = this;
					popups.confirm(
						'Текущая конфигурация будет удалена. Удалить конфигурацию?',
						function () {
							self.remove(index);
							$('body').css('overflow','hidden')
						},
						'Да',
						'Нет'
					);
				},
				slice2css(slice)
				{
					const rate =
						((this.size_first ? this.viewArea[0] : this.viewArea[1]
						) /
						this.size);
					return '' + rate * slice + 'px';
				},
				
			},
		});
	},
	_goods_colors(mixins, references)
	{
		return Vue.component('cart-goods-colors', {
			mixins: mixins,
			props: ['goods', 'colors', 'quantity', 'tech_url','is_company'],
			template: '#cart-goods-colors',
			data()
			{
				return {
					current_brand: null,
					current_group: null,
					current_color: null,
					showListColor:false,
					borderColor:null,
					filter: '',
					current_color_quantity:1,
				};
			},

			watch: {
				visible_colors(new_value,old_value)
				{
					if(new_value!==old_value)
						this.current_color = new_value.length > 0 ? new_value[0] : null;
				},
				current_brand(new_value)
				{
					// this.current_group =
					// 	new_value != null && new_value.groups.length > 0
					// 		? new_value.groups[0]
					// 		: null;
					this.current_group = null;
				},
				colors(new_value)
				{
					let quantity = this.quantity;
					for (let i in new_value)
					{
						if (new_value[i].quantity > quantity)
						{
							new_value[i].quantity = quantity;
						}

						quantity -= new_value[i].quantity;
					}
				},
				current_color(new_value){
					if(new_value){
						this.borderColor = this.changeBorderColor(new_value.color);
						const n = this.quantity - this.quantity_colored;
						this.current_color_quantity=(n===0? n : 1 );
					}

				},
				quantity_colored(new_value){
					const n = this.quantity - new_value;
					this.current_color_quantity=(n===0? n : 1 );
				}
			},
			mounted: function(){
				$('body').css('overflow-y', 'hidden');
				const self = this;
				$(document).mouseup( function(e){ // событие клика по веб-документу
					var div = $( ".select" ); 
					if ( !div.is(e.target) 
						&& div.has(e.target).length === 0 ) { 
							self.showListColor=false;
					}
				});

				let heightContentBlock=$(window).height()- 64 - 40 - $('.shopping_cart_color_popup .cart_popup_head').height();
				$('.color_popup_content').css('height',heightContentBlock+'px');
			},
			computed: {
				filtered_colors()
				{
					let result = [];
					if(this.current_brand){
						const colors = this._filterColors(
							this.brands2colors[this.current_brand.id],
							this.filter
						);
						if (colors.length > 0)
						{
							result.push({
								brand: this.current_brand,
								colors: colors,
							});
						} else{
							result = []
						}
					} else {
						for (let i in references.colors)
							{
								const brand = references.colors[i];
								const colors = this._filterColors(
									this.brands2colors[brand.id],
									this.filter
								);
								if (colors.length > 0)
								{
									result.push({
										brand: brand,
										colors: colors,
									});
								} 

							}
					}
					
					return result;
				},
				filtered_colors_length()
				{
					let result = 0;

					for (let k in this.filtered_colors)
					{
						result += this.filtered_colors[k].colors.length;
					}

					return result;
				},
				brands()
				{
					return references.colors;
				},
				quantity_colored()
				{
					let quantity = 0;
					for (let i in this.colors)
					{
						quantity += parseInt(this.colors[i].quantity);
					}

					return quantity;
				},
				all_groups()
				{
					let colors = [];
					for (let i in references.colors)
					{
						const brand = references.colors[i];
						for (let j in brand.groups)
						{
							const group = brand.groups[j];
							colors = colors.concat(group);
						}
					}

					const result = {};
					for (let color of colors)
					{
						if (!(color.name in result
						))
						{
							result[color.name] = color;
						}
						else
						{
							let new_colors = result[color.name].colors.concat(
								color.colors.filter(
									(item) => result[color.name].colors.indexOf(item) < 0
								)
							);
							result[color.name].colors = new_colors;
						}
					}

					return result;
				},
				brands2colors()
				{
					const result = {};
					for (let i in references.colors)
					{
						const brand = references.colors[i];
						let colors = [];
						for (let j in brand.groups)
						{
							const group = brand.groups[j];
							colors = colors.concat(group.colors);
						}

						result[brand.id] = colors;
					}

					return result;
				},
				
				fullColorPallete(){
					return $.merge($.merge( $.merge( [], this.brands2colors[1] ), this.brands2colors[2] ), this.brands2colors[3])
				},
				visible_colors()
				{


					let unfiltered_result = [];
					if (this.current_brand != null)
					{
						unfiltered_result =
							this.current_group != null
								? this.current_group.colors
								: this.brands2colors[this.current_brand.id];
					}
					else
					{
						if (this.current_group === null)
						{
							//this.current_group = this.brands[0].groups[0];
							// if(this.current_color===null){
							// 	this.current_color = this.fullColorPallete[0];
							// }
							// this.borderColor = this.changeBorderColor(this.current_color.color);
							unfiltered_result=this.fullColorPallete;
						} else {
							unfiltered_result = this.current_group.colors;
						}
						
					}
					
					if (this.filter === '')
					{
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
				_filterColors(colors, search)
				{
					const lower = search.toLowerCase();
					let result = [];

					for (let i in colors)
					{
						const color = colors[i];
						if (color.name_lower.includes(lower))
						{
							result.push(color);
						}
					}
					return result;
				},
				colorMain(color_id)
				{
					const color = references.colors2names[color_id];
					return color.color;
				},
				colorText(color_id)
				{
					var bgColor = references.colors2names[color_id].color; // .color_bg
					var color = (bgColor.charAt(0) === '#'
					) ? bgColor.substring(1, 7) : bgColor;
					var r = parseInt(color.substring(0, 2), 16); // hexToR
					var g = parseInt(color.substring(2, 4), 16); // hexToG
					var b = parseInt(color.substring(4, 6), 16); // hexToB
					return (((r * 0.299
							) + (g * 0.587
							) + (b * 0.114
							)
						) > 186
					) ? '#000' : '#FFF';
				},
				colorName(color_id)
				{
					const color = references.colors2names[color_id];
					return "<span class='cart_popup_sidebar_item_name_brand'>"+color.brand_name + "</span><span class='cart_popup_sidebar_item_name_color'>"  + color.name+ "</span>";
				},
				change(color, delta)
				{
					let q = color.quantity + delta;
					if((this.quantity_colored + delta)>this.quantity){
						console.log('Больше возможного');
					} else{
						if (q <= 0)
							{
								q = 1;
							}
							color.quantity = q;
					}

				},
				remove(index)
				{
					this.colors.splice(index, 1);
				},
				deleteColorPop(index)
				{
					const self = this;
					popups.confirm(
						'Данный цвет будет удален. Удалить цвет?',
						function () {
							self.remove(index);
						},
						'Да',
						'Нет'
					);
				},
				close()
				{
					$('body').css('overflow-y', 'auto');
					this.$emit('close');
				},

				_indexOf(color_id)
				{
					for (let i = 0; i < this.colors.length; i++)
					{
						if (this.colors[i].id === color_id)
						{
							return i;
						}
					}

					return -1;
				},
				add()
				{
					if (this.current_color === null)
					{
						return;
					}

					if (this.quantity < this.quantity_colored+this.current_color_quantity)
					{
						return;
					}

					const index = this._indexOf(this.current_color.id);
					if (index === -1)
					{
						this.colors.push({
							id: this.current_color.id,
							quantity: this.current_color_quantity,
						});
					}
					else
					{
						this.change(this.colors[index], +this.current_color_quantity);
					}
				},
				changeBorderColor(bgColor){
					var color = (bgColor.charAt(0) === '#'
					) ? bgColor.substring(1, 7) : bgColor;
					var r = parseInt(color.substring(0, 2), 16); // hexToR
					var g = parseInt(color.substring(2, 4), 16); // hexToG
					var b = parseInt(color.substring(4, 6), 16); // hexToB
					return (((r * 0.299
						) + (g * 0.587
						) + (b * 0.114
						)
					) > 186
				) ? '#DAE0E8' : bgColor;
				},
				changeCount(value){
					let q = this.current_color_quantity+value;
					if (q <= 0)
					{
						q = 1;
					}
					const n = this.quantity - this.quantity_colored;
					if (q > n)
					{
						q = n;
					}
					this.current_color_quantity = q;
				},
				colorsPriceOpenModalText()
				{
					if( this.goods.price_per_coloring < 0 || this.is_company) {
						return '<span class="color-value">Уточним цену</span>';
					}
					var price = 0;
					for (let indexItem in this.colors) {
						price += Math.ceil(this.goods.price_per_coloring * this.colors[indexItem].quantity);
					}
					//var price =  Math.ceil(this.goods.price_per_coloring * this.quantity_colored)
					if(price <= 0) {
						return '<span class="color-value">Бесплатно</span>';
					}
					return this.nf_price(price) + ` <svg
						width="10"
						height="11"
						viewBox="0 0 10 12"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M2.2395 12V9.824H0.8475V8.784H2.2395V7.36H0.8475V6.144H2.2395V0.575999H5.2475C6.64483 0.575999 7.6795 0.858666 8.3515 1.424C9.03417 1.98933 9.3755 2.81067 9.3755 3.888C9.3755 4.976 9.0075 5.82933 8.2715 6.448C7.5355 7.056 6.45283 7.36 5.0235 7.36H3.6795V8.784H6.3195V9.824H3.6795V12H2.2395ZM4.8155 6.144C5.78617 6.144 6.53817 5.984 7.0715 5.664C7.6155 5.344 7.8875 4.768 7.8875 3.936C7.8875 3.21067 7.6635 2.672 7.2155 2.32C6.7675 1.968 6.06883 1.792 5.1195 1.792H3.6795V6.144H4.8155Z"
							fill="#000c2c"></path>
					</svg>`;
				}
			},
		});
	},

	_transport(mixins)
	{
		return Vue.component('cart-transport', {
			mixins: mixins,
			props: ['action_transport'],
			template: '#cart-transport',
			created()
			{
			},
			computed: {},
			methods: {},
		});
	},
	_action_modal(mixins){
		return Vue.component('cart-action-modal', {
			mixins: mixins,
			props: ['action'],
			template: '#cart-action-modal',
			created()
			{
			},
			mounted(){
				var e = window.event;
				let cords = this.getPosition(e);
				$('.cart-action-modal').css({
					'top':cords.y+'px',
					'left':cords.x+'px',
				})
			},
			watch:{
				action(new_value){
					var e = window.event;	
					let cords = this.getPosition(e);
					$('.cart-action-modal').css({
							'top':cords.y+'px',
							 'left':cords.x+'px',
					})
				}
			},
			computed: {
				url()
				{
					return this.action.news.id > 0
						? '/catalog/?viewaction=' + this.action.news.id
						: '#';
				},
				name()
				{
					return this.action.news.id > 0
						? this.action.news.name
						: this.action.name;
				},
				short_text()
				{
					return this.action.news.short_text;
				},
			},
			methods: {
				getPosition(e){
					var x = 0, y = 0;
								 
					if (e.pageX || e.pageY){
						x = e.pageX;
						y = e.pageY;
						
						if(this.constants.IS_MOBILE){
							if($(window).width()<524){
								x=$(e.srcElement).closest('.shopping_cart_goods_list_item_row ').offset().left;
								y=$(e.srcElement).closest('.shopping_cart_goods_list_item_header_act').offset().top + 20;
							}
							x=x-$('.shopping_cart').offset().left
						}
					} else if (e.clientX || e.clientY){
						x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
						y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
					}
				 
					return {x: x, y: y}
				},
				close(){
					this.$emit('close');
				}
			},
		})
	},
	_action_delivery_modal(mixins,constants,map1,map2){
		return Vue.component('cart-action-delivery-modal', {
			mixins: mixins,
			props: ['action_delivery_info','is_company'],
			template: '#cart-action-delivery-modal',
			created()
			{
				
				$('body').css('overflow-y', 'hidden');
			},
			mounted:function(){
				$('.delivery_popup_main_header').click(function(){
					if($(this).hasClass('delivery_popup_main_header--active')){
						$(this).closest('.delivery_popup_main_item').find('.delivery_popup_main_body').slideDown();
					} else {
						$(this).closest('.delivery_popup_main_item').find('.delivery_popup_main_body').slideUp();
					}
					const self=$(this)
					setTimeout(()=>{
						
						var vpHeight = $('.shopping_cart_popup_delivery_methods .new_fixed_container').height() + 64;
						var offset = self.closest('.delivery_popup_main_item').find('.delivery_popup_main_body').offset();
						$('.shopping_cart_popup_delivery_methods').animate({
					  		scrollTop: offset.top
						}, 500);
					},500)
					
					
					
					$(this).toggleClass('delivery_popup_main_header--active');
				})
			},
			methods: {
				createRefName(index){
					return 'map'+(index+1);
				},
				close(){
					$('body').css('overflow-y', 'auto');
					this.$emit('close');
				}
			},
		})
	},
	_action_delivery_mapblock(mixins,references,map_config,ajax_cart){
		return Vue.component('cart-maps-action', {
			mixins: mixins,
			props: ['current_action','id_map','is_company'],
			template: '#cart-action-delivery-map',
			data()
			{
				return {
					mapNew: new YandexMap(map_config, references),
				};
			},
			created()
			{
				const self = this;
				self.mapNew.app = {
					actions_delivery: self.current_action,
					getDeliveryActionAreas:function(){
						if (self.current_action == null)
						{
							return [];
						}
	
						return self.current_action.area_ids;
					},
					setCoords(coords)
					{
							// do nothing
					},
					getPrices(area)
					{
						// do nothing
					},
					order()
					{
						return {
							is_company: self.is_company,
						};
					},
				};

				ymaps.ready(function(){
					
					window[self.mapNew.key].create(self.$refs[self.id_map]);
				})
				

			},

			watch:{

			},
			computed: {

			},
			methods: {
				setCoords(coords)
				{
					// do nothing
				},
			},
		})
	},
	_action_delivery(mixins)
	{
		return Vue.component('cart-action-delivery', {
			mixins: mixins,
			props: ['action', 'active_id', 'valid', 'total'],
			template: '#cart-action-delivery',
			created()
			{
			},
			computed: {
				tooltip_id()
				{
					return 'action-delivery-tooltip-' + this.action.id;
				},
				url()
				{
					return '/delivery/?delivery_action=' + this.action.id;
				},
			},
			methods: {
				openTransport($event)
				{
					popups._tooltip._open($event.target, $event);
				},
				openMap()
				{
					this.$emit('open-map');
				},
			},
		});
	},

	_action(mixins)
	{
		return Vue.component('cart-action', {
			mixins: mixins,
			props: ['action'],
			template: '#cart-action',
			data()
			{
				return {
					popup: false,
				};
			},
			created()
			{
			},
			computed: {
				canShowGoods()
				{
					if (this.action.goods_quantity <= 1)
					{
						return false;
					}

					if (this.action.action_type === this.constants.ACTION_BONUS_RANGE)
					{
						return this.action.value_required > this.action.value_available;
					}

					return true;
				},
				canSelectGift()
				{
					if (this.action.action_type !== this.constants.ACTION_BONUS_RANGE)
					{
						return false;
					}

					return (
						this.action.value_required <= this.action.value_available &&
						!this.action.valid
					);
				},
				canChangeGift()
				{
					if (this.action.action_type !== this.constants.ACTION_BONUS_RANGE)
					{
						return false;
					}

					return (
						this.action.value_required <= this.action.value_available &&
						this.action.valid &&
						this.action.bonus_goods_ids.length > 1
					);
				},

				url()
				{
					return this.action.news.id > 0
						? '/catalog/?viewaction=' + this.action.news.id
						: '#';
				},
				name()
				{
					return this.action.news.id > 0
						? this.action.news.name
						: this.action.name;
				},
				short_text()
				{
					return this.action.news.short_text;
				},
			},
			methods: {
				show()
				{
					this.popup = !this.popup;
				},
				popupGoods()
				{
					this.$emit('popup-action', this.action, 'goods');
					$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
					$('body').css('overflow-y','hidden');
				},
				popupBonus()
				{
					this.$emit('popup-action', this.action, 'bonus');
				},
			},
		});
	},

	_action_bonus(mixins)
	{
		return Vue.component('cart-action-bonus', {
			mixins: mixins,
			props: ['action', 'goods'],
			template: '#cart-action-bonus',
			created()
			{
			},
			computed: {
				url()
				{
					return this.action.news.id > 0
						? '/catalog/?viewaction=' + this.action.news.id
						: '#';
				},
				name()
				{
					return this.action.news.id > 0
						? this.action.news.name
						: this.action.name;
				},
			},
			methods: {
				updateId(goods_code){
					return goods_code.replace('тов-', '')
				}
			},
		});
	},

	_goods(mixins, references)
	{
		const cart_goods = Vue.component('cart-goods', {
			mixins: mixins,
			props: ['goods', 'actions','action_id', 'showAction', 'cuts', 'colors','is_company','is_share_cart', 'clients', 'share_hash'],
			template: '#cart-goods',
			data()
			{
				return {
					touch: {
						start: 0,
						direction: '',
					},
					removing_ids: this.$removing_ids,
				};
			},
			computed: {
				isActionSet()
				{
					for (let i in this.actions)
					{
						if (this.actions[i].action_type === this.constants.ACTION_SET)
						{
							return true;
						}
					}

					return false;
				},
				visibleActions()
				{
					const result = [];
					for (let i in this.actions)
					{
						const action = this.actions[i];
						if (this.showAction(action, this.goods))
						{
							result.push(action);
						}
					}

					return result;
				},
			},
			methods: {
				removeCut(index)
				{
					this.cuts.splice(index, 1);
				},
				deleteCutPop(index)
				{
					const self = this;
					popups.confirm(
						'Текущая конфигурация будет удалена. Удалить конфигурацию?',
						function () {
							self.removeCut(index);
						},
						'Да',
						'Нет'
					);
				},
				removeColor(index)
				{
					this.colors.splice(index, 1);
				},
				deleteColorPop(index)
				{
					const self = this;
					popups.confirm(
						'Данный цвет будет удален. Удалить цвет?',
						function () {
							self.removeColor(index);
						},
						'Да',
						'Нет'
					);
				},
				_swipe_left() {
					this.touch.direction = 'left';
					const $e = $(this.$el).find('.cartStep1-item');
					$e.addClass('itemSwiped');
					$e.find('.cartStep1-item--close').fadeOut(100);
					$e.next().addClass('active');
				},
				_swipe_right() {
					this.touch.direction = 'right';
					const $e = $(this.$el).find('.cartStep1-item');
					$e.removeClass('itemSwiped');
					$e.find('.cartStep1-item--close').fadeIn(100);
					$e.next().removeClass('active');
				},
				touch_start(ev) {
					this.touch.start = ev.targetTouches[0].screenX;
				},
				touch_move(ev) {
					this._touch_scroll(ev);
				},
				touch_end() {
					if (this.touch.direction === 'left')
					{
						this._swipe_left();
					}
					else
					{
						this._swipe_right();
					}
				},
				touch_cancel(ev) {
				},
				_touch_scroll(ev) {
					const distance = this.touch.start - ev.targetTouches[0].screenX;
					this.touch.direction = distance > 0 ? 'left' : 'right';
				},

				colorData(color_id)
				{
					return references.colors2names[color_id];
				},
				colorName(color_id)
				{
					const color = this.colorData(color_id);
					if (typeof color === 'undefined')
					{
						return '---';
					}
					return color.brand_name + ' ' + color.name;
				},
				colorPriceText(color)
				{
					return this.nf_price(Math.ceil(this.goods.price_per_coloring * color.quantity));
				},
				cutPrice(cut)
				{
					let free_quantity = this.is_company ? 0 : cut.free_quantity;
					return (
						(cut.quantity * (cut.slices.length - 1) - free_quantity) * this.goods.cut_price
					);
				},
				cutPriceText(cut)
				{
					const price = this.cutPrice(cut);
					return price === 0 ? 'Бесплатно' : this.nf_price(price) + ' ₽';
				},
				cutTotal(cuts){
					let totalSum=0;
					cuts.forEach(cut => {
						totalSum+=this.cutPrice(cut);
					});
					return totalSum === 0 ? 'Бесплатно' : this.nf_price(totalSum) + ' ₽';
				},
				colorsTotal(colors){
					let totalSum=0;
					colors.forEach(color => {
						totalSum+=Math.ceil(this.goods.price_per_coloring * color.quantity);
					});
					return this.nf_price(totalSum) + ' ₽';
				},
				popupAction(action, type)
				{
					this.$emit('popup-action', action, type);
				},
				openCuts()
				{
					dataLayerPush('mic_click_korzina_list_rezkaraspil');
					$('body').addClass('no_scroll');
					this.$emit('open-cuts');
				},
				openColors()
				{
					dataLayerPush('mic_click_korzina_list_kolerovka');
					$('body').addClass('no_scroll');
					this.$emit('open-colors');
				},
				openAction(event){
					this.$emit('open-action')
				},
				openSoldOut(new_id,goods_id){
					this.$emit('open-soldout',new_id,goods_id);
				},
				changeQuantity(quantity, reachGoal)
				{

					if(reachGoal == 'click_product_minus') {
						dataLayerPush('mic_click_korzina_list_minus');
					}
					if(reachGoal == 'click_product_plus') {
						dataLayerPush('mac_click_korzina_list_plus');
					}
					if (quantity <= 0)
					{
						if (this.goods.quantity <= 0)
						{
							this.goods.quantity = 1;
						}
						this.removeStart(this.goods.id);
						return;
					}
					if (typeof ym != 'undefined' && reachGoal) {
						ym(ymID, 'reachGoal', reachGoal);
					}

					this.$emit('change-quantity', this.goods.id, quantity);
				},
				animate(goods_id)
				{
					const count = $(this.$refs.count);
					const duration = 3 * 1000;
					const self = this;

					count.text(duration / 1000);
					$({Counter: 0}).animate(
						{Counter: count.text()},
						{
							duration: duration,
							easing: 'linear',
							step()
							{
								count.text(((duration/1000)-Math.ceil(this.Counter))+1);
							},
							complete()
							{
								if (self.removing(goods_id))
								{
									self.remove(goods_id);
								}
							},
						}
					);

					const progress = Snap(this.$refs.progress);
					progress.attr({strokeDasharray: '0, 251.2'});

					Snap.animate(
						0,
						251.2,
						function (value) {
							progress.attr({'stroke-dasharray': value + ',251.2'});
						},
						duration
					);
				},

				addToCart(goods_id, quantity, event)
				{
					const self = this;
					const goodName = $(event.target).closest('.shopping_cart_goods_list_item').find('.title').text();
					popups.confirm(
						'Добавить "'+goodName+'" в вашу корзину ?',
						function () {
							cart.callbacks.push(function(){
								popups.alertNew('Товар добавлен в вашу корзину', '','1');
								cart.callbacks.pop();
							});
							cart.change(goods_id, quantity, self.share_hash);
						},
						'Да',
						'Нет'
					);
				},
				removing(goods_id)
				{
					return this.removing_ids.indexOf(goods_id) >= 0;
				},
				removeStart(goods_id)
				{
					dataLayerPush('mic_click_korzina_list_remove');

					if (this.removing(goods_id))
					{
						return;
					}

					this.removing_ids.push(goods_id);

					const self = this;
					this.$nextTick(function () {
						self.animate(goods_id);
					});
				},
				removeReset(goods_id)
				{
					if (this.removing(goods_id))
					{
						this.removing_ids.splice(this.removing_ids.indexOf(goods_id), 1);
					}
				},
				remove(goods_id)
				{
					this._swipe_right();
					this.$emit('remove', goods_id);
					const self=this;
					setTimeout(function(){
						self.removeReset(goods_id);
					}, 500)
				},
				updateId(goods_code){
					return goods_code.replace('тов-', '')
				},
				colorIdBlock(goods_code){
					return 'goods_color_id'+this.updateId(goods_code)
				},
				colorNameTooltip(goods_code, color_code){
					return 'externalTrigger'+goods_code+color_code
				}
			},
		});

		cart_goods.prototype.$removing_ids = [];

		return cart_goods;
	},
	_soldout_modal(mixins){
		return Vue.component('cart-soldout-modal', {
			mixins: mixins,
			props: ['action','good_id'],
			template: '#cart-soldout-modal',
			created()
			{
			},
			mounted(){
				var e = window.event;
				let cords = this.getPosition(e);
				$('.cart-soldout-modal').css({
						'top':cords.y+'px',
					 	'left':cords.x+'px',
				})
			},
			watch:{
				action(new_value){
					var e = window.event;	
					let cords = this.getPosition(e);
					$('.cart-soldout-modal').css({
							'top':cords.y+'px',
							 'left':cords.x+'px',
					})
				},
				good_id(new_value, old_value){
						var e = window.event;	
						let cords = this.getPosition(e);
						$('.cart-soldout-modal').css({
								'top':cords.y+'px',
								 'left':cords.x+'px',
						})

				}
			},
			computed: {
				url()
				{
					return this.action
						? '/catalog/?viewaction=' + this.action
						: '#';
				},
			},
			methods: {
				getPosition(e){
					var x = 0, y = 0;
					let posX = $(e.srcElement).closest('.shopping_cart_goods_list_item_header_soldout').offset();
					// if (e.pageX || e.pageY){
					// 	x = e.pageX;
					// 	y = e.pageY;
					// 	if(this.constants.IS_MOBILE){
					// 		x=x-$('.shopping_cart').offset().left
					// 	}
					// } else if (e.clientX || e.clientY){
					// 	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					// 	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
					// }
					x=posX.left;
					if(this.constants.IS_MOBILE){
						if($(window).width()>424){
							x=$(e.srcElement).closest('.shopping_cart_goods_list_item_header').offset().left;
						} else {
							x=$(e.srcElement).closest('.shopping_cart_goods_list_item_row ').offset().left;
						}
						x=x-$('.shopping_cart').offset().left;
					}
					y=posX.top + 20;
					return {x: x, y: y}
				},
				close(){
					this.$emit('close');
				}
			},
		})
	},


	/**
	 *
	 * @param data
	 * @param ajax_cart
	 * @param mixins
	 * @param {YandexMap} map
	 * @returns {*}
	 * @private
	 */
	_cart(data, ajax_cart, mixins, map)
	{
		const $popup_action = $('.js-popup-action');

		$popup_action.find('.system_popup_hide').on('click', function () {
			
			$popup_action.css('display', 'none');
			$("body").css('padding-right', '0px');
			$('body').css('overflow-y','scroll');
		});

        const app = new Vue({
			el: '#app-cart',
			template: '#cart-template',
			data: data,
			mixins: mixins,
			computed: {
				is_mobile()
				{
					return (typeof MOBIL !== 'undefined'
					) && (MOBIL === '/m'
					);
				},
				showServices()
				{
					for (let i = 0; i < this.sortedGoods.length; i++)
					{
						const g = this.sortedGoods[i];
						if (g.coloring || g.cut_id > 0)
						{
							return true;
						}
					}

					return false;
				},
				showOverlay()
				{
					return (
						//this.view_action_delivery != null ||
						//this.tech.goods2cuts != null ||
						//this.tech.goods2colors != null ||
						this.tech.cuts_total
					);
				},
				result()
				{
					return this.is_company ? this.result_company : this.result_private;
				},
				balls()
				{
					return this.is_company ? this.balls_company : this.balls_private;
				},
				order()
				{
					return {
						is_company: this.is_company,
					};
				},
				deliveryActionHeadText()
				{
					return this.actions_delivery.length > 1
						? 'доступны специальные предложения'
						: 'доступно специальное предложение';
				},
				required_price()
				{
					if (this.is_company)
					{
						return 0;
					}
					return this.buy_types[this.buy_type_key].min_price;
				},
				required_buy_type()
				{
					return this.buy_types[this.buy_type_key].buy_type;
				},
				sortedGoods()
				{
					const self = this;
					return _.orderBy(this.result.list, function (g) {
						const actions = self.goodsId2Actions(g.id);
						const a_id = actions.length ? actions[0].id : 0;
						return (a_id * 10000
						) + g.index;
					});
				},
				actionsGoods()
				{
					const result = [];
					let action_id = 0;
					let action_goods = [];
					for (let i = 0; i < this.sortedGoods.length; i++)
					{
						const g = this.sortedGoods[i];
						const actions = this.goodsId2Actions(g.id);
						const a_id = actions.length ? actions[0].id : 0;

						if (a_id !== action_id)
						{
							if (action_goods.length > 0)
							{
								result.push({
									id: action_id,
									goods: action_goods,
								});
								action_goods = [];
							}

							action_id = a_id;
						}

						action_goods.push(g);
					}

					if (action_goods.length > 0)
					{
						result.push({
							id: action_id,
							goods: action_goods,
						});
					}

					return result;
				},

				active_action_id()
				{
					if (this.is_company)
					{
						return 0;
					}

					for (let i = 0; i < this.actions_delivery.length; i++)
					{
						const action = this.actions_delivery[i];
						if (this.validActionDelivery(action))
						{
							return action.id;
						}
					}
					return 0;
				},

				cutsGoods()
				{
					let result = {};
					for (let index in this.result.list_all)
					{
						const g = this.result.list_all[index];
						if (g.cut_id <= 0)
						{
							continue;
						}

						if (typeof result[g.id] === 'undefined')
						{
							result[g.id] = g;
						}
					}

					return result;
				},
				cutsQuantity()
				{
					let q = 0;

					for (let g in this.cutsGoods)
					{
						const goods = this.cutsGoods[g];

						const cuts = this.goodsCuts(goods);
						for (let i in cuts)
						{
							q += cuts[i].quantity;
						}
					}

					return q;
				},
				cutsPrice()
				{
					let price = 0;

					for (let g in this.cutsGoods)
					{
						const goods = this.cutsGoods[g];
						const cuts = this.goodsCuts(goods);
						for (let i in cuts)
						{
							const cut = cuts[i];
							let free_quantity = this.is_company ? 0 : cut.free_quantity;
							const q = Math.max(0, (cut.quantity * (cut.slices.length - 1
								) - free_quantity
							));
							price += q * goods.cut_price;
						}
					}
					if (this.is_company)
					{
						price = price_rounding(price);
					}

					return price;
				},
				cutsPriceText()
				{
					return this.cutsPrice === 0
						? 'Бесплатно'
						: this.nf_price(this.cutsPrice) + ` <svg
						width="10"
						height="11"
						viewBox="0 0 10 12"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M2.2395 12V9.824H0.8475V8.784H2.2395V7.36H0.8475V6.144H2.2395V0.575999H5.2475C6.64483 0.575999 7.6795 0.858666 8.3515 1.424C9.03417 1.98933 9.3755 2.81067 9.3755 3.888C9.3755 4.976 9.0075 5.82933 8.2715 6.448C7.5355 7.056 6.45283 7.36 5.0235 7.36H3.6795V8.784H6.3195V9.824H3.6795V12H2.2395ZM4.8155 6.144C5.78617 6.144 6.53817 5.984 7.0715 5.664C7.6155 5.344 7.8875 4.768 7.8875 3.936C7.8875 3.21067 7.6635 2.672 7.2155 2.32C6.7675 1.968 6.06883 1.792 5.1195 1.792H3.6795V6.144H4.8155Z"
							fill="#000c2c"></path>
					</svg>`;
				},
				colorsPrice()
				{
					var price = 0;
					for (let index in this.colors)
					{
						if( (this.colorsGoods[index].price_per_coloring < 0  && this.colors[index].length > 0) || this.is_company) {
							price = 0;
							break;
						}
						for (let indexItem in this.colors[index]) {
							price +=  Math.ceil(this.colorsGoods[index].price_per_coloring * this.colors[index][indexItem].quantity)
						}
					}
					return price;
				},
				colorsPriceText()
				{
					var price = 0;
					for (let index in this.colors)
					{
						if( this.colorsGoods[index].price_per_coloring < 0 && this.colors[index].length > 0) {
							price = -1;
							break;
						}
						for (let indexItem in this.colors[index]) {
							price +=  Math.ceil(this.colorsGoods[index].price_per_coloring * this.colors[index][indexItem].quantity)
						}
					}
					if(price === 0 && !this.is_company) {
						return 'Бесплатно';
					} else if (price < 0|| this.is_company) {
						return 'Уточним цену';
					}
					return this.nf_price(price) + ` <svg
						width="10"
						height="11"
						viewBox="0 0 10 12"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M2.2395 12V9.824H0.8475V8.784H2.2395V7.36H0.8475V6.144H2.2395V0.575999H5.2475C6.64483 0.575999 7.6795 0.858666 8.3515 1.424C9.03417 1.98933 9.3755 2.81067 9.3755 3.888C9.3755 4.976 9.0075 5.82933 8.2715 6.448C7.5355 7.056 6.45283 7.36 5.0235 7.36H3.6795V8.784H6.3195V9.824H3.6795V12H2.2395ZM4.8155 6.144C5.78617 6.144 6.53817 5.984 7.0715 5.664C7.6155 5.344 7.8875 4.768 7.8875 3.936C7.8875 3.21067 7.6635 2.672 7.2155 2.32C6.7675 1.968 6.06883 1.792 5.1195 1.792H3.6795V6.144H4.8155Z"
							fill="#000c2c"></path>
					</svg>`;
				},
				colorsGoods()
				{
					let result = {};
					for (let index in this.result.list_all)
					{
						const g = this.result.list_all[index];
						if (!g.coloring)
						{
							continue;
						}

						if (typeof result[g.id] === 'undefined')
						{
							result[g.id] = g;
						}
					}

					return result;
				},
				colorsQuantity()
				{
					let q = 0;

					for (let g in this.colorsGoods)
					{
						const goods = this.colorsGoods[g];

						const colors = this.goodsColors(goods);
						for (let i in colors)
						{
							q += colors[i].quantity;
						}
					}

					return q;
				},
			},

			watch: {
				cuts: {
					handler(new_value)
					{
						if (this.save_pause)
						{
							return;
						}
						this.validateCuts(new_value);
						this.saveCuts();
					},
					deep: true,
				},
				cuts_comments(new_value, old_value)
				{
					if (new_value === old_value)
					{
						return;
					}

					this.saveCutsComments();
				},
				colors: {
					handler(new_value)
					{
						if (this.save_pause)
						{
							return;
						}

						this.validateColors(new_value);
						this.saveColors();
					},
					deep: true,
				},
				is_company(new_value, old_value)
				{
					if (new_value === old_value)
					{
						return;
					}
					ajax_cart._request({
						is_company: new_value ? 1 : 0,
						no_response: 1,
					});
					this.companyChange(new_value);
					this.validateCuts(this.cuts);
				},
				buy_type_key(new_value, old_value)
				{
					if (new_value === old_value)
					{
						return;
					}

					ajax_cart._request({
						buy_type_key: new_value,
					});
				},
			},
			mounted: function () {
				$(document).mouseup(function (e) {
					if (!$(e.target).closest(".select_new").length) {
						$(".select_new").removeClass("select--open");
						$(".select__list__new").slideUp();
					};
				})
			},
			methods: {
				cutsGoodsTotal(goods)
				{
					const cuts = this.goodsCuts(goods);
					let q = 0;
					for (let i in cuts)
					{
						q += cuts[i].quantity;
					}

					return q;
				},
				validateCuts(cuts)
				{
					for (let goods_id in cuts)
					{
						const g_cuts = cuts[goods_id];
						let quantity = this.goodsQuantity(parseInt(goods_id));
						let free_quantity = this.is_company ? 0 : quantity;
						for (let i in g_cuts)
						{
							const cut = g_cuts[i];
							if(!cut.quantity){
								cut.quantity = 0;
							}
							if ((cut.quantity > quantity
							) && !this.is_mobile)
							{
								cut.quantity = quantity;
							}

							cut.free_quantity = Math.min(
								free_quantity,
								cut.quantity * (cut.slices.length - 1
								)
							);

							quantity -= cut.quantity;
							free_quantity -= cut.free_quantity;
						}
					}
				},
				saveCutsComments: _.throttle(function () {
					this.cartQuery({
						cuts_comments: this.cuts_comments,
						no_response: 1,
					});
				}, 1000),
				saveCuts: _.throttle(function () {
					this.cartQuery({change_cuts: true, cuts: this.cuts});
				}, 100),
				goodsCuts(goods)
				{
					if (goods.cut_id <= 0)
					{
						return [];
					}

					const k = '' + goods.id;
					if (typeof this.cuts[k] === 'undefined')
					{
						Vue.set(this.cuts, k, []);
					}

					return this.cuts[k];
				},
				removeCut(goods, index)
				{
					if (goods.cut_id <= 0)
					{
						return;
					}

					if (typeof this.cuts[goods.id] === 'undefined')
					{
						return;
					}

					this.cuts[goods.id].splice(index, 1);
				},

				colorsGoodsTotal(goods)
				{
					const colors = this.goodsColors(goods);
					let q = 0;
					for (let i in colors.quantity)
					{
						q += colors[i].quantity;
					}

					return q;
				},
				validateColors(colors)
				{
					for (let goods_id in colors)
					{
						const g_colors = colors[goods_id];
						let quantity = this.goodsQuantity(parseInt(goods_id));
						for (let i in g_colors)
						{
							if(!g_colors[i].quantity){
								g_colors[i].quantity = 0;
							}
							if (g_colors[i].quantity > quantity)
							{
								g_colors[i].quantity = quantity;
							}

							quantity -= g_colors[i].quantity;
						}
					}
				},
				saveColors: _.throttle(function () {
					this.cartQuery({change_colors: true, colors: this.colors});
				}, 100),
				goodsColors(goods)
				{
					if (!goods.coloring)
					{
						return {};
					}

					const k = '' + goods.id;
					if (typeof this.colors[k] === 'undefined')
					{
						Vue.set(this.colors, k, []);
					}

					return this.colors[k];
				},
				removeColor(goods, index)
				{
					if (!goods.coloring)
					{
						return;
					}

					if (typeof this.colors[goods.id] === 'undefined')
					{
						return;
					}

					this.colors[goods.id].splice(index, 1);
				},

				goodsQuantity(goods_id)
				{
					let quantity = 0;
					for (let i in this.result.list_all)
					{
						const g = this.result.list_all[i];
						if (g.id === goods_id)
						{
							quantity += g.quantity;
						}
					}

					return quantity;
				},
				update(response)
				{
					this.result_private = response.result_private;
					this.result_company = response.result_company;
					this.balls_private = response.balls_private;
					this.balls_company = response.balls_company;

					this.save_pause = true;

					const cuts = vue_cart.optimize_cuts(response.cuts);
					this.validateCuts(cuts);
					this.cuts = cuts;

					const colors = vue_cart.optimize_colors(response.colors);
					this.validateColors(colors);
					this.colors = colors;

					this.$nextTick(function () {
						this.save_pause = false;
					});

					this.companyChange(this.is_company);
				},
				openMap(action)
				{
					this.view_action_delivery = action;

					map.updateAreas();
					setTimeout(function () {
						map.setBounds(action.area_ids);
					}, 100);
				},
				confirm(message, action, ok_label='OK', canel_label='Отмена', information='Вы действительно хотите продолжить?')
				{
					popups.confirm(
						message,
						action,
						ok_label,
						canel_label,
						information
					);
				},
				setBuyType(buy_type)
				{
					if (this.is_company)
					{
						buy_type = this.constants.BUY_TYPE_SELF;
					}

					if (buy_type === this.constants.BUY_TYPE_SELF)
					{
						this.buy_type_key = buy_type;
						return;
					}

					let message;
					if (buy_type === this.constants.BUY_TYPE_CREDIT)
					{
						// credit
						message =
							'Вы выбрали тип оплаты "В кредит". Установленный Вами интервал доставки может быть скорректирован в большую сторону';
					} // installment
					else
					{
						if (this.constants.IS_BASE_PRICE)
						{
							message =
								'Вы выбрали тип оплаты "В рассрочку",<br> бонусные баллы не будут начислены.';
						}
						else
						{
							message =
								'Вы выбрали тип оплаты "В рассрочку",<br> приобретение товаров по ценам «по карте» будет невозможно, итоговая стоимость заказа скорректирована. Бонусные баллы не будут начислены.';
						}

						message +=
							'<br>Установленный Вами интервал доставки может быть скорректирован в большую сторону.';
					}

					const self = this;
					const ok_click = function () {
						self.buy_type_key = buy_type;
						if (window.window_close)
						{
							window.window_close();
						}
						return false;
					};

					this.confirm(message, ok_click);
				},
				showAction(action, goods)
				{
					if (action == null)
					{
						return false;
					}

					const viewable = [
						this.constants.ACTION_SET,
						this.constants.ACTION_XY,
						this.constants.ACTION_N1,
						this.constants.ACTION_BONUS_RANGE,
					];
					// ignore ACTION_BALLS ACTION_MARKET ACTION_BONUS
					if (viewable.indexOf(parseInt(action.action_type)) === -1)
					{
						return false;
					}

					const index = this.sortedGoods.indexOf(goods);

					// товар последний из списка с этой акций
					const next_goods_actions =
						this.sortedGoods.length === index + 1
							? []
							: this.goodsId2Actions(this.sortedGoods[index + 1].id);
					for (let i = 0; i < next_goods_actions.length; i++)
					{
						if (next_goods_actions[i].id === action.id)
						{
							return false;
						}
					}

					return true;
				},
				goodsId2Actions(goods_id)
				{
					const result = [];
					for (let i = 0; i < this.result.actions.length; i++)
					{
						const action = this.result.actions[i];
						if (action.cart_goods_ids.indexOf(goods_id) !== -1)
						{
							result.push(action);
						}
					}

					return result;
				},
				id2action(action_id)
				{
					for (let i = 0; i < this.result.actions.length; i++)
					{
						const action = this.result.actions[i];
						if (action.id === action_id)
						{
							return action;
						}
					}

					return null;
				},

				companyChange(is_company)
				{
					if (is_company)
					{
						this.setBuyType(this.constants.BUY_TYPE_SELF);
					}
				},
				cartQuery(request)
				{
					request.is_company = this.is_company ? 1 : 0;

					ajax_cart._request(request);
				},
				cartSetBonus(action_id, goods_id)
				{
					this.cartQuery({bonus_action: action_id, bonus: goods_id});
				},
				cartChangeForced(id, quantity)
				{
					this.cartQuery({change: id, change_quantity: quantity});
				},
				cartChange(id, quantity)
				{
					if (this.isNumeric(quantity))
					{
						this.cartQuery({change: id, change_quantity: quantity});
					}
				},
				cartRemove(id)
				{
					delete this.result_private.list[id];
					delete this.result_company.list[id];
					this.cartQuery({del: id});
				},

				cartClear()
				{
					const self = this;
					const clear = function () {
						$('html, body').animate({ scrollTop: 0 }, 150);
						self.cartQuery({clear: 1});
						//$('html, body').animate({ scrollTop: 0 }, 'slow');
						popups.alertNew('Корзина очищена!','','1');
						

					};
					this.confirm('Очистить корзину?', clear,'Да','Отмена','Все '+number_text(this.result.count, [
						"товар",
						"товара",
						"товаров",
					])+ ' будут удалены без возможности восстановления');
					//this.confirm('Все товары будут удалены! Вы действительно хотите продолжить?', clear);
				},
				cartAddAutocomplete(goods_id, quantity)
				{
					if (goods_id <= 0)
					{
						return;
					}

					this.cartQuery({change: goods_id, change_quantity: quantity});
				},

				isNumeric(value)
				{
					return !isNaN(value - parseFloat(value));
				},

				popupAction(action, type)
				{
					const $title = $popup_action.find('.js-title');
					const $content = $popup_action.find('.js-content');

					$popup_action.data('id', action.id);
					$popup_action.data('type', type);
					$popup_action.css('display', 'block');
					$title.html(
						type === 'goods' ? 'Товары акции' : 'Выберите Ваш подарок'
					);
					$content.html('');
					$content.load('/ajax/action/?' + type + '=' + action.id);
				},
				
				showReg()
				{
					popups.registration.open();
				},
				showOrder()
				{
					dataLayerPush('mac_click_korzina_sidebar_makeorder');

					if (typeof gtag == 'function')
					{
						gtag('event', 'order_login_step1', {event_category: 'cliсks'});
					}

					const redirect = './?order';
					document.location = redirect;
					// if (this.constants.IS_AUTH)
					// {
					// 	document.location = redirect;
					// }
					// else
					// {
					// 	if (popups.authorization)
					// 	{
					// 		popups.authorization.open(redirect);
					// 	}
					// 	else
					// 	{
					// 		document.location = redirect;
					// 	}
					// }
				},
				addAllToCart()
				{
					popups.goods2cart.fromCart(this.share_hash);
					return false;
				},
				showSaveDraft()
				{
					if (!this.constants.IS_AUTH)
                    {
						if(this.constants.IS_MOBILE)
						{
							$('.authorization input[name=redirect]').val('/cart/?1#modalDraft');
							modFunction('login');
						}
						else
							popups.authorization.open('/cart/?1#cart2draft');							
						
                        return;
                    }
					
					if(this.constants.IS_MOBILE){
						$('.modalDraft .js-form').show();
						$('.modalDraft .js-results').hide();
						modFunction('modalDraft');
						cartStep1=true;
						$('.modalDraft').find('.js-form').show();
						$('.modalDraft').find('.js-results').hide();
					}
					else
					{
						let cart_popup_draft = $('#popup_cart2drafts');
						$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
        				$('body').css('overflow-y','hidden');
						cart_popup_draft.show();
						$('.js-form', cart_popup_draft).show();
						$('.js-results', cart_popup_draft).hide();
						let heigth=$(window).height()-24 - 24 - 80 - 16 - 24 - 42 - 40;
						if(heigth<500){
							$('.addToDraft_popup_capcha_block').css('max-height', heigth+'px');
						} else {
							$('.addToDraft_popup_capcha_block').css('max-height', '500px');
						}
						$('.addToDraft_popup').on('click', '.cancle, .system_popup_hide', function () {
							cart_popup_draft.hide();
							$("body").css('padding-right', '0px');
							$('body').css('overflow-y','auto');
						});
						$('.addToDraft_popup_input', cart_popup_draft).on('click', function(){
							$('#cart2draft_new').prop('checked', true);
						})
						if(!$(this).data('save_handler'))
						$('.addToDraft_popup').on('click', '.add_cart2draft', function () {
							var draft_name = '';
							var draft_id = $('input[name="cart2draft_id"]:checked').val();

							if (draft_id == 0)
							{
								draft_name = $.trim($('input[name="cart2draft_name"]').val());

								if (draft_name == '')
								{
									cart_popup_draft.css('display', 'none');
									$("body").css('padding-right', '0px');
									$('body').css('overflow-y','auto');
									popups.alertNew('Не указано название сметы.','', false);
									
								}
							}
							if((draft_id == 0 && draft_name != '') || draft_id != 0){
								$.ajax({
									type: 'POST',
									url: '/ajax/cart2draft/',

									data: {
										name: draft_name,
										id: draft_id,
									},
									dataType: 'json',
									success: function (response) {
										if(response.name){
											let newItem=$('.addToDraft_popup_list_item--cart:last', cart_popup_draft).clone();
											newItem.find('input').attr("id", 'cart2draft_'+(response['count'])).attr('checked','checked').val(response['draft']);
											newItem.find('label').attr("for", 'cart2draft_'+(response['count'])).text(response['name']);
											$('.addToDraft_popup_input', cart_popup_draft).val('');
											newItem.find('input[name=cart2draft_name]').remove();
											$('.addToDraft_popup_capcha_block', cart_popup_draft).append(newItem);
										}

										$('.js-form', cart_popup_draft).hide();
										$('.js-results', cart_popup_draft).show();
									},
								});
							}

							return false;
						});
						$(this).data('save_handler', true);
					}
				},

				autocompleteGetLabel(item)
				{
					return item ? item.name : '';
				},
				autocompleteFind(request)
				{
					const self = this;
					$.post(
						'/ajax/cart_autocomplete/',
						{term: request},
						function (data) {
							self.tech.autocomplete.items = data.goods;
							self.tech.autocomplete.categories = data.categories;
						},
						'json'
					);
				},

				validActionDelivery(action)
				{
					if (this.is_company)
					{
						return false;
					}

					return this.result.price >= action.price;
				},

				getDeliveryActionAreas()
				{
					if (this.view_action_delivery == null)
					{
						return [];
					}

					return this.view_action_delivery.area_ids;
				},
				setCoords(coords)
				{
					// do nothing
				},
				getPrices(area)
				{
					// do nothing
				},
				// closeAddPanel($event)
				// {

				// 	if (!($event.target.tagName == 'INPUT' && $event.target.name == 's'
				// 	))
				// 	{
				// 		this.$refs.addAutocomplete.clearBlockValue();
				// 	}
				// },
				openAddPanel()
				{
					this.tech.cuts_total = true;
					$('body').addClass('no_scroll');
				},
				closeAddPanelCutting()
				{
					this.tech.cuts_total = false;
					$('body').removeClass('no_scroll');
				},
				getCartShareLink()
				{
					if(this.ajax) return;
					this.ajax=1;
					const self = this;
					var scarts = localStorage.getItem('yourShareCarts');
					
					$.post(
						'/ajax/cart_share/',
						{'comp': this.is_company ? 1 : 0, 'scarts': JSON.parse(scarts)},
						function (data) {
							if(data.error){
								popups.alert('Ошибка!', data.message);
							}else{
								if(data.scarts) localStorage.setItem('yourShareCarts', JSON.stringify(data.scarts));
								
								var $tmp = $('<textarea>');
								$('body').append($tmp);
								$tmp.val(data.message).select();
								document.execCommand('copy');
								$tmp.remove();
								popups.alertNew('Ссылка успешно скопирована', 'Вы можете поделиться корзиной где угодно','1');
							}
						},
						'json'
					).always(function() {
						self.ajax=0;
					});
				},
				copyLinkCart()
				{
					// const self = this;
					// popups.confirm(
					// 	'Создать ссылку на текущий состав корзины?',
					// 	function () {
					// 		self.getCartShareLink();
					// 	},
					// 	'Да',
					// 	'Нет'
					// );
					this.getCartShareLink();
				},
				
				soldOutModal(url_link, goods_id){
					if(this.tech.soldoutClick_good_id && this.tech.soldoutClick_good_id==goods_id){
						this.tech.soldoutClick = null;
						this.tech.soldoutClick_good_id = null
					}else {
					this.tech.soldoutClick=url_link;
					this.tech.soldoutClick_good_id=goods_id; }
				},
				cartSetGift(selectedGoods,action_id, giftsBeforeChange)
				{
					const self=this;
                    let giftsBeforeChanged = [];
					giftsBeforeChange.forEach(gift => {
						if (!selectedGoods.includes(gift)) {
                            giftsBeforeChanged.push({bonus: gift.id, bonus_quantity: 0});
						}
					});
                    self.cartQuery({bonus_action: action_id, gifts: giftsBeforeChanged, is_gift: 1});
                    let giftsChanged = [];
					selectedGoods.forEach(function(product) {
                        giftsChanged.push({bonus: product.id, bonus_quantity: product.quantity});
					})
                    self.cartQuery({bonus_action: action_id, gifts: giftsChanged, is_gift: 1});
				},
				openSubListCredit(){
					$('.credit_installment_popup .select__list__new').slideToggle();
					$('.credit_installment_popup .select_new').toggleClass('select--open')
				},
				setCreditValue(value){
					this.currentCreditPeriodKey=value;
					$('.credit_installment_popup .select__list__new').slideUp();
					$('.credit_installment_popup .select_new').removeClass('select--open')
				},
				closeSubModal(){
					$('body').css('padding-right', '0px');
					$('body').css('overflow-y','scroll');
				},
				openSubModal(){
					$('body').css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
					$('body').css('overflow', 'hidden');
				},
			},

            created: function(){
                const self = this;
                if (typeof ymab !== 'undefined')
                ymab('metrika.' + ymID, 'getFlags', function(flags) {
                    for (const [key, value] of Object.entries(flags)) {
                        if (key==='newcart') {
                            self.newcart = value[0];
                        }
                    }
                });
            }
		});
		
		map.app = app;
		app.companyChange(app.is_company);

		ajax_cart.callbacks.push(function (response) {
			if(data.is_share_cart) return;
			
			app.update(response);
		});

		return app;
	},
};
