/**
 *
 * @param {String} id
 * @param {Object} data
 * @param {Object} references
 * @param {Object} constants
 * @param {Object} map_config
 * @param {DOMHighResTimeStamp} time
 * @returns {Object}
 * @param {String} page
 */
function create_order_app_wrapper(id, data, references, constants, map_config, time, page='order', mobile=false)
{
	const coords = data.order.address_coords;
	data.order.address_coords = null;

	if (!data.order.date || (data.order.date === '01.01.1970'))
	{
		data.order.date = data.date.today;
	}
	const map = new YandexMap(map_config, references,page, mobile);
	constants.MAP_KEY = map.key;
	data.errors={
		'fullname_client':'',
		'email':'',
		'phone':'',
		'orgnCompany':'',
		'kppCompany':'',
		'RscCompany':'',
		'KscCompany':'',
		'nameCompany':'',
		'innCompany':'',
		'orgnCompanyRes':'',
		'kppCompanyRes':'',
		'RscCompanyRes':'',
		'KscCompanyRes':'',
		'nameCompanyRes':'',
		'innCompanyRes':'',
		'receiver_phone':'',
		'receiver_fullname':'',
		'politics':'',
		
	};
	data.timeoutElement=null;
	data.widthWindow=false;
	data.widthWindowSmall=false;
	data.currentCreditPeriodKey="3 мeс.";
	data.sidebarSmall=true;
	data.triesToSetDate=0;
	data.showCancel=false;
	data.currentWidth= window.innerWidth;

	data.temp_unload_list=JSON.parse(JSON.stringify(data.unload_list));
	data.temp_unload_base_price = 0;
	data.temp_unload_min_price = 0;
	data.temp_unload_price=0;
	data.showInfoDelivery=null;
	data.order.politics=false;

	if(window.sessionStorage.getItem('step_to_save')){
		data.tech.step=1;
	} else {
		data.tech.step=0;
	}
	app = create_order_app(id, data, constants, references, map);
	window.app = app;

	$(id).css('display', 'block');

	console.log('Создание приложения = ' + (performance.now() - time) / 1000 + ' с');

	const date = references.valid_dates.indexOf(app.order.date) === -1
		? app.date.today
		: app.order.date;
	app.order.date = app.availableDate(date) ? date : app.date.tomorrow;

	app.validateDeliveryType(app.order.date);
	app.validatePayType(app.order.delivery);

	console.log('Загрузка с картой = ' + (performance.now() - time) / 1000 + ' с');

	if (!app.constants.delivery_page)
	{
		setTimeout(function () {
			app.setCoords(coords);
			app.setDate(app.order.date);
			app.validateBalls(app.tech.balls);

			//set_placemarks_grey(<?=json_encode(get_nearest_shops(REGION))?>, map.map);
		}, 1000);
	}
	else
	{
		//set_placemarks_grey(<?=json_encode(get_nearest_shops(REGION))?>, map.map);
	}
	return app;
}

/**
 *
 * @param {String} id
 * @param data
 * @param constants
 * @param references
 * @param {YandexMap} map
 * @returns {*}
 */
function create_order_app(id, data, constants, references, map)
{
	const mixins = vue_cart._mixins(constants);

	const app = new Vue({
		el: id,
		data: data,
		template: '#order-template',
		mixins: mixins,
		watch: {
			forced_shop: function (new_value, old_value) {
				if (new_value !== old_value)
				{
					if (this.order.delivery)
					{
						this.calculateDistance();
					}
					else
					{
						this.order.shop_id = new_value.id;
					}
				}
			},
			'tech.company': function (new_value, old_value) {
				if ((new_value == null) && (old_value != null))
				{
					const self = this;
					this.$nextTick(function () {
						self.tech.company = old_value;
					});
				}
			},
			'order.company_type': function (new_value, old_value) {
				if ((new_value == null) && (old_value != null))
				{
					const self = this;
					this.$nextTick(function () {
						self.order.company_type = old_value;
					});
				}
			},
			'order.company_receiver_type': function (new_value, old_value) {
				if ((new_value == null) && (old_value != null))
				{
					const self = this;
					this.$nextTick(function () {
						self.order.company_receiver_type = old_value;
					});
				}
			},
			'tech.contracts.current': function (new_value, old_value) {
				const self = this;
				if (!new_value != null)
				{
					this.$nextTick(function () {
						self.checkDogovorSelect();
					});
				}

				if ((new_value == null) && (old_value != null))
				{
					this.$nextTick(function () {
						self.tech.contracts.current = old_value;
					});
				}
			},
			'tech.parking_max_height': function (new_value, old_value) {
				if ((new_value == null) && (old_value != null))
				{
					const self = this;
					this.$nextTick(function () {
						self.tech.parking_max_height = old_value;
					});

					this.order.parking_max_height = old_value.id;
				}
			},
			'tech.savedAddressInput': function (new_val) {
				this.filterSavedAddress(new_val);
			},
			'tech.delivery_action_id': function (new_value, old_value) {
				if (new_value !== old_value)
				{
					map.updateAreas();
					const action = this.getActionDelivery(new_value);
					map.setBounds(action ? action.area_ids : []);
				}
			},
			'tech.forced_transport_id': function (new_value) {
				const t = this.getTransport(new_value);
				const type = t.courier ? 'courier' : 'standard';
				if (this.order.delivery_type !== type)
				{
					this.order.delivery_type = type;
				}
			},
			order: {
				handler: function () {
					this.autosave();
				},
				deep: true,
			},
			'order.address_coords': function (new_value, old_value) {
				//this.setCoords(new_value, true);
			},
			'order.buy_type': function () {
				const self = this;
				this.$nextTick(function () {
					self.validatePayType(self.order.delivery);
				});
			},
			'order.date': function (new_value) {
				this.setDate(new_value);
				if (!this.order.delivery)
				{
					this.setShop(this.order.shop_id);
				}
			},
			'order.distance': function () {
				this.fixSliders(this.order.date);
			},
			'order.delivery': function (new_value) {
				if (new_value)
				{
					this.refreshCoords();
				}
				else
				{
					map.resetRoute();
				}
				const self = this;
				if(new_value){
					this.date.custom=this.order.date;
					this.setCustomDate(this.order.date);

				}
				this.$nextTick(function () {
					
					if(!new_value){
						map.setCenter(map.config.center, map.config.zoom);
					}
					map._initShops(self.delivery_shops);

                    if (!this.is_company) {
                        if (!new_value && (this.delivery_shops.length > 0)) {
                            this.order.shop_id = this.delivery_shops[0].id;
                            this.setShop(this.order.shop_id);
                        }
                        if (new_value && (this.delivery_shops.length === 0)) {
						    this.order.shop_id = 0;
                        }
                    } else {
                        if(this.pickup_warehouse !== undefined) {
                            let index = this.delivery_points.findIndex(x => x.id === this.pickup_warehouse.id);
                            if (index === -1) index = 0;
                            this.tech.forced_warehouse_index = index;
                        } else {
                            this.tech.forced_warehouse_index = 0;
                        }
                    }
					if(!new_value){
						if(this.current_shop != null) {
							map.setCenter([this.current_shop.latitude, this.current_shop.longitude], 15);
							this.setShop(this.current_shop.id);
						}
					}

				});



				this.validatePayType(new_value);
			},
			'tech.forced_warehouse_index': function () {
				this.fixSliders(this.order.date);
				this.getUnloadPrice();
				this.mapUpdate();

				if (!this.order.delivery && (this.forced_shop != null))
				{
					this.order.shop_id = this.forced_shop.id;
					this.setShop(this.order.shop_id);
				}
				if(!this.order.delivery){
					if(this.current_shop != null) {
						map.setCenter([this.current_shop.latitude, this.current_shop.longitude], 15);
					}
				}

                this.pickup_warehouse = this.delivery_points[this.tech.forced_warehouse_index];
			},
			'order.delivery_type': function () {
				this.fixSliders(this.order.date);
				this.getUnloadPrice();
				this.mapUpdate();
			},
			'order.manipulator': function (new_value) {
				if (new_value)
				{
					this.order.parking = false;
				}

				this.getUnloadPrice();
				this.mapUpdate();
			},
			'order.parking': function (new_value) {
				if (new_value)
				{
					this.order.manipulator = false;
				}

				this.getUnloadPrice();
				this.mapUpdate();
			},
			'order.shop_id': function (new_value) {
				this.setShop(new_value);
			},
			'order.unload': function (new_value) {
				if (new_value)
				{
					this.getUnloadPrice();
				}
			},
			'order.unload_full': function () {
				this.getUnloadPrice();
			},
			'order.is_ground_floor': function (new_value, old_value) {
				if(new_value){
					this.order.floor = 2;
					this.afterChangeFloor();
					this.order.climb = 0;
				}
				new_value = new_value ? 1 : 0;
				old_value = old_value ? 1 : 0;

				for (let id in this.unload_list)
				{
					const goods = this.unload_list[id];
					if (goods.is_ground_floor === old_value)
					{
						goods.is_ground_floor = new_value;
					}
				}

				this.getUnloadPrice();
			},
			'order.climb': function (new_value, old_value) {
				if(new_value !== '0' && this.order.floor < 2){
					this.order.floor = 2;
					this.afterChangeFloor();
				}
				const old_sizes = this.constants.LIFT_SIZES[old_value];
				const new_sizes = this.constants.LIFT_SIZES[new_value];

				for (let k in new_sizes)
				{
					if (true)//(this.order['delivery_lift_' + k] === old_sizes[k])
					{
						this.order['delivery_lift_' + k] = new_sizes[k];
					}
				}

				this.getUnloadPrice();
			},
			'order.bringing': function (new_value, old_value) {
				for (let id in this.unload_list)
				{
					const goods = this.unload_list[id];
					if (goods.bringing === old_value)
					{
						goods.bringing = new_value;
					}
				}

				this.getUnloadPrice();
			},
			'order.delivery_lift_length': function () {
				this.getUnloadPrice();
			},
			'order.delivery_lift_width': function () {
				this.getUnloadPrice();
			},
			'order.delivery_lift_height': function () {
				this.getUnloadPrice();
			},
			'order.delivery_lift_entrance': function () {
				this.getUnloadPrice();
			},
			'order.delivery_lift_weight': function () {
				this.getUnloadPrice();
			},
			unload_list:  function () {
				// handler: function () {
				// 	this.getUnloadPrice();
				// },
				// deep: true,
				this.getUnloadPrice();
			},
			temp_unload_list: {
				handler: function () {
					this.getUnloadPrice(true);
				},
				deep: true,
			},
			'tech.balls': function (new_value) {
				this.validateBalls(new_value);
			},
			total_price_base: function () {
				this.validateBalls(this.tech.balls);
			},
			'tech.forced_shop_index': function () {
				const self = this;
				if (this.order.delivery)
				{
					if (this.order.address_coords)
					{
						this.$nextTick(function () {
							self.calculateDistance();
						});
					}
				}
				else
				{
					this.$nextTick(function () {
						const w = self.forced_shop;
						if (w)
						{
							map.setCenter([w.latitude, w.longitude], 15);
						}
					});
				}
			},
			'order.politics':function(new_value){
				if(new_value){
					this.errors.politics=''
				} else {
					this.errors.politics='Не приняты условия'
				}
			}
		},
		mounted: function () {
            this.deliveryTooltip = tippy('#cart_delivery_info_btn', {
                content: '',
                trigger: 'click',
                allowHTML: true,
                placement: "bottom-start",
                interactive: true,
            });
            this.processDeliveryInfo();
			this.fullValidateEmail(this.order.email);
			$('.v-autocomplete-input').attr('autocomplete', 'off');
			const self = this;
            /*setTimeout(function(){
                if(self.current_shop != null) {
                    map.setCenter([self.current_shop.latitude, self.current_shop.longitude], 15);
                }
            }, 1000);

             */
			$(document).mouseup(function (e) {
				const select1 = self.$refs.select1;
				const select2 = self.$refs.select2;
				const sel_contracts = self.$refs.sel_contracts;
				if (typeof select1 != 'undefined') self.closeSelect(e, select1);
				if (typeof select2 != 'undefined') self.closeSelect(e, select2);
				if (typeof sel_contracts != 'undefined') self.closeSelect(e, sel_contracts);
				if (!$(e.target).closest(".select_new").length) {
					$(".select__head__new").removeClass("open");
					$(".select__list__new").slideUp();
				};
				if(!$(e.target).closest(".shopping_cart_details_services_item").length){
					$('.shopping_cart_details_services_item_body').slideUp();
					setTimeout(function(){
						$('.shopping_cart_details_services_item_header').removeClass('shopping_cart_details_services_item_header_open')
					},400)

				}
				
			});
			$('body').on('click', '.js_cancel_unload', function(){
				self.unload_list=self.temp_unload_list;
				$('#popup_alertNew .system_popup_hide').click();
			})
			self.checkWidthPage();
			$(window).on('resize', function(){
				const newWidth = window.innerWidth;
				if (newWidth !== self.currentWidth) {
					self.checkWidthPage();
				}
			});
			const swiper = new Swiper('.swiper_table_details_unload', {
				'slidesPerView': 'auto',
				'freeMode': true,
				scrollbar: {
					el: '.scrollbar_table_details_unload',
					draggable: true,
				}
			});
			self.date.custom=self.order.date
			self.setCustomDate(self.order.date);
			// $('.shopping_cart_details_company_ogrn_input').mask('9999999999999');
			// $('.shopping_cart_details_company_kpp_input').mask('999999999');
			// $('.shopping_cart_details_company_rschet_input').mask('99999 999 9 9999 9999999');
		},

		methods: {
			afterChangeFloor(){
				let new_value = this.order.floor;
				
				if(parseInt(new_value) < 1)
					this.order.floor = new_value = 1;
				else if(parseInt(new_value) > 200)
					this.order.floor = new_value = 200;
				if(parseInt(this.order.climb) && new_value < 2 || this.order.is_ground_floor)
					this.order.floor = new_value = 2;

				for (let id in this.unload_list)
				{
					const goods = this.unload_list[id];
					goods.floor = new_value;
				}
	
				this.getUnloadPrice();
			},
			checkWidthPage(){
				const self = this;
				if(self.constants.is_mobile){
					if($(window).width()<768 && $(window).width()>660){
						self.widthWindow=true
					} else {
						self.widthWindow=false
					}
					if($(window).width()<576){
						self.widthWindowSmall=true
					}else{
						self.widthWindowSmall=false
					}
				}else {
					if($(window).width()<1440){
						self.widthWindow=true;
					
						} else{
							self.widthWindow=false
						}
				}
			},
			isPeriodSelected: function(data, index) {
				if (index === (data.periods.length - 1))
				{
					return data.value >= data.periods[index].value;
				}
				else
				{
					return (data.value >= data.periods[index].value) && (data.value < data.periods[index + 1].value);
				}
			},
			closeSelect: function (e, select) {
				const $block = $(select.$el);
				if (!$block.is(e.target) && $block.has(e.target).length === 0)
				{
					select.open = false;
				}
			},
			checkDogovorSelect: function () {
				if (!this.constants.MODE_COMPANY)
				{
					return;
				}

				const $elDrop = $(this.$refs.sel_contracts.$el).find('.dropdown-toggle');
				const $elText = $(this.$refs.sel_contracts.$el).find('.selected-tag');
				$elDrop.toggleClass('short', $elText.width() < 275);
			},
			setCompany: function (company) {
				this.order.company_name = company.name;
				this.order.company_inn = company.inn;
				this.order.company_kpp = company.kpp;
				this.order.company_ogrn = company.ogrn;
				this.order.company_address = company.address;
				this.order.company_bank = company.bank;
				this.order.company_bik = company.bik;
				this.order.company_rschet = company.rschet;
				this.order.company_kschet = company.kschet;
				this.order.company_type = company.type;
			},
			setCompanyReceiver: function (company) {
				if (company === null)
				{
					return;
				}

				this.order.company_receiver_name = company.name;
				this.order.company_receiver_inn = company.inn;
				this.order.company_receiver_kpp = company.kpp;
				this.order.company_receiver_ogrn = company.ogrn;
				this.order.company_receiver_address = company.address;
				this.order.company_receiver_bank = company.bank;
				this.order.company_receiver_bik = company.bik;
				this.order.company_receiver_rschet = company.rschet;
				this.order.company_receiver_kschet = company.kschet;
				this.order.company_receiver_type = company.type;
			},

			/* Context search for saved adress */
			filterSavedAddress: function (search_val) {
				const regExp = new RegExp(search_val.trim(), 'gi');
				this.address_list_filter = this.address_list.filter((addr) => {
					return addr.match(regExp) !== null;
				});

				// If search input is empty => then show address list
				if (this.address_list_filter.length === 0)
				{
					this.address_list_filter = this.address_list;
				}
			},
			/* ////////////// */

			validateAddress: function () {
				if (this.addressEmpty)
				{
					popups.alert('Укажите, пожалуйста, адрес доставки!');
				}
				// если выбрана доставка, то true

				const data = this.deliveryData();
				const valid_shop = !this.delivery_calculation || !!data.shop_id;
				if (!data.address && !valid_shop)
				{
					popups.alert('Необходимо указать адрес доставки');
				}

				return !this.addressEmpty;
			},
			testOrderValidation: function () {
				const d = this.deliveryData();
				$.ajax({
					type: 'POST',
					url: this.url_prefix + '/ajax/order_test/',
					data: { delivery: d },
					success: function (data) {
						//console.log('response', data);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.error(jqXHR, textStatus, errorThrown);
					},
					dataType: 'json',
				});
			},

			toggleUnload: function () {
				if (this.unload_available) {
					this.order.unload = this.order.unload === 0 ? 1 : 0;
				}
			},
			showDeliveryActionTransport: function (action, $event) {
				action.transport_visib = 1;

				if (0)
				{
					const $e = window.$('div.action_transport_info[data-id="' + action.id + '"] .delivery-info-caption');
					const $t = window.$($event.target);
					$e.css({
						top: $t.position().top + 20,
						left: $t.position().left - 80,
					});
				}
			},
			showDeliveryActionMap: function (action_id) {
				this.tech.delivery_action_id = action_id;
				$([document.documentElement, document.body]).animate({
					scrollTop: $("#map").offset().top - 200,
				}, 500);
			},
			log: function (obj) {
				if (!this.tech.log)
				{
					return;
				}
			},
			logTable: function (obj) {
				if (!this.tech.log)
				{
					return;
				}
			},

			setPayType: function (pay_type) {
				pay_type = parseInt(pay_type);
				if (pay_type === this.constants.PAY_CREDIT)
				{
					this.order.buy_type = this.constants.BUY_TYPE_CREDIT;
				}
				else if (pay_type === this.constants.PAY_INSTALLMENT)
				{
					this.order.pay_balls = 0;
					this.order.buy_type = this.constants.BUY_TYPE_INSTALLMENT;
				}
				else
				{
					this.order.buy_type = this.constants.BUY_TYPE_SELF;
				}

				if (this.is_company)
				{
					if (pay_type !== this.constants.PAY_INVOICE)
					{
						pay_type = this.constants.PAY_INVOICE;
					}
				}
				else
				{
					if (pay_type === this.constants.PAY_INVOICE)
					{
						pay_type = this.constants.PAY_SHOP;
					}
				}

				if (this.order.pay_type === pay_type)
				{
					return;
				}
				const is_credit = (pay_type === this.constants.PAY_CREDIT) || (pay_type === this.constants.PAY_INSTALLMENT);
				const ajax_data = {
					json: 1,
					buy_type_key: is_credit ? this.order.buy_type : this.constants.BUY_TYPE_SELF,
				};

				const self = this;
				const request = function () {
					cart._request(ajax_data);
					self.order.pay_type = pay_type;
				};

				if (is_credit && this.order.delivery)
				{
					const ok_click = function () {
						request();

						// if (window.window_close)
						// {
						// 	window.window_close();
						// }
						return false;
					};
					let subtext=(pay_type === this.constants.PAY_CREDIT?'В кредит': 'В рассрочку')
					const message = 'Вы выбрали тип оплаты "'+subtext +'". Ранее установленный Вами интервал доставки может быть скорректирован в большую сторону.';
					popups.confirm('Информация', ok_click, 'ОК', 'Отмена',message);
				}
				else
				{
					request();
				}
			},
			validatePayType: function (delivery) {
				if (this.order.buy_type === this.constants.BUY_TYPE_CREDIT)
				{
					this.order.pay_type = this.constants.PAY_CREDIT;
					return;
				}

				if (this.order.buy_type === this.constants.BUY_TYPE_INSTALLMENT)
				{
					this.order.pay_type = this.constants.PAY_INSTALLMENT;
					return;
				}

				if (this.is_company)
				{
					this.order.pay_type = this.constants.PAY_INVOICE;
				}
				else
				{
					if (this.order.pay_type === this.constants.PAY_INVOICE)
					{
						this.order.pay_type = this.constants.PAY_CARD_ONLINE;
					}
					if (this.order.pay_type === this.constants.PAY_CASH_DRIVER)
					{
						this.order.pay_type = this.constants.PAY_CARD_ONLINE;
					}
					if (!delivery)
					{
						if ((this.order.pay_type === this.constants.PAY_CASH_DRIVER)
							|| (this.order.pay_type === this.constants.PAY_CARD_DRIVER))
						{
							this.order.pay_type = this.constants.PAY_CARD_ONLINE;
						}
					}
				}
			},
			setForcedTransport: function (transport_id) {
				this.tech.forced_transport_id = transport_id;
				this.order.delivery_type = this.forced_transport.courier === 1 ? 'courier' : 'standard';
				this.tech.show_delivery_transport = false;
                this.processDeliveryInfo();
				this.mapUpdate();
			},
			mapUpdate: function () {
				if (!this.order.address_coords)
				{
					return;
				}
				if (!this.order.distance && this.delivery_calculation)
				{
					return;
				}
				if (!this.order.delivery)
				{
					return;
				}

				map.setRoute();
				map.showPlacemark(this.order.address_coords, this.placemarkText(), this.delivery_calculation);
				map.updateAreas();
			},
			refreshPlacemark: function () {
				if (!map.placemark||!map.placemark.balloon.isOpen())
				{
					return;
				}

				const self = this;
				this.$nextTick(function () {
					map.refreshPlacemark();

					if (self.order.address_coords && self.order.delivery)
					{
						map.setCenter(self.order.address_coords);
					}
				});
			},

			placemarkText: function () {
				const delivery_price = this.delivery_price;

				let content;
				if (this.delivery_prices[this.order.delivery_type].error)
				{
					content = this.delivery_prices[this.order.delivery_type].error;
					if(delivery_price == null)
					{
						this.order.operator_call = true;
						this.delivery_error = true;
					}
				}
				else if (delivery_price == null)
				{
					content = 'Неизвестная ошибка.';
				}
				else
				{
					const delivery_price = this.actionDeliveryPrice(); // delivery_price
					const prefix = this.delivery_price_approx ? 'от ' : '';
					const action_text = this.is_company ? '' : '<span style="color: black;"> по акции</span>';
					let price_text = '';
					if ((delivery_price != null) && this.isFreeDelivery())
					{
						price_text = 'Будет рассчитана оператором';
					}
					else if (delivery_price === 0)
					{
						price_text = '<span style="color: #3CA755;">Бесплатно</span>' + action_text;
					}
					else
					{
						price_text = prefix + this.number_format(delivery_price, this.is_company ? 2 : 0) + ' ₽';
					}
					
					if(this.delivery_error)
					{
						this.order.operator_call = false;
						this.delivery_error = false;
					}

                    let placemark_template = this.constants.PLACEMARK_TEMPLATE;
                    if(this.route_calculator.disableYandexRoute){
                        placemark_template = this.constants.PLACEMARK_TEMPLATE_WITHOUT_DISTANCE;
                    }
					content = placemark_template.replace(
						'%address%', this.order.address == null ? '' : this.order.address
					).replace(
						'%price%', price_text
					).replace(
						'%distance%', this.order.distance
					);
				}

				return content;
			},

			setCustomDate: function (date) {
				if (date)
				{	
					this.triesToSetDate=0;
					this.order.date=date;
					if(date==this.date.today||date==this.date.tomorrow||date==this.date.day2){
						this.date.custom='';
						$('.shopping_cart_details_date_itemInput--delivery input').val('');
					}
					if(!this.constants.is_mobile){
						if(date==this.date.day3 && this.availableDate(this.date.day3) && ((this.availableDate(this.date.today) && !this.widthWindow) || (!this.availableDate(this.date.today)))){
							this.date.custom='';
							$('.shopping_cart_details_date_itemInput--delivery input').val('');
						}
						if(date==this.date.day4 && this.availableDate(this.date.day4) && !this.availableDate(this.date.today) && !this.widthWindow){
							this.date.custom='';
							$('.shopping_cart_details_date_itemInput--delivery input').val('');
						}
					} else {
						if(date==this.date.day3 && this.availableDate(this.date.day3) &&
						((this.availableDate(this.date.today) &&
						this.widthWindow)||(!this.availableDate(this.date.today) &&
						!this.widthWindow)||(!this.availableDate(this.date.today) &&
						this.widthWindow) )){
							this.date.custom='';
							$('.shopping_cart_details_date_itemInput--delivery input').val('');
						}
						if(date==this.date.day4 && this.availableDate(this.date.day4) && !this.availableDate(this.date.today) && this.widthWindow){
							this.date.custom='';
							$('.shopping_cart_details_date_itemInput--delivery input').val('');
						}
					}

				} else{
					if(this.availableDate(this.date.today)){
						this.order.date=this.date.today;
					} else {
						this.order.date=this.date.tomorrow;
					}
					this.date.custom=''
				}
			},

			getTransportIds: function (delivery_type) {
				if (delivery_type === 'courier')
				{
					return this.tech.courier_id ? [this.tech.courier_id] : [];
				}

				return references.transports_types[this.transport_type];
			},

			findAllowedTransport: function (delivery_type) {
				if (this.tech.forced_transport_id)
				{
					return this.tech.forced_transport_id;
				}

				const only_areas = this.price_calculator.onlyAreasField(delivery_type);

				const transport_ids = this.getTransportIds(delivery_type);
				if (transport_ids.length === 0)
				{
					if (this.order.parking)
					{
						const ids = references.transports_types.parking_all;
						if (ids.length > 0)
						{
							return ids[ids.length - 1];
						}
					}

					return null;
				}

				const target = this.deliveryTarget(0);

				for (let i in transport_ids)
				{
					const transport_id = transport_ids[i];
					const transport = this.getTransport(transport_id);
					if (transport == null)
					{
						continue;
					}

					target.delivery_type = delivery_type;
					target.transport = transport;
					const area_prices = this.price_calculator.areaPrices(target);
					const invalid_price = (area_prices === null) || (area_prices.id === 0) || (area_prices.price === 0);

					if (area_prices && (area_prices.price > 0))
					{
						return transport_id;
					}
					else if (invalid_price && transport[only_areas])
					{
					}
					else
					{
						return transport_id;
					}
				}

				return null;
			},
			calculateDistance: function () {
				map.resetRoute();

				if (!this.order.address_coords)
				{
					return;
				}

				this.order.distance = null;

                this.order.disableYandexRoute = this.route_calculator.disableYandexRoute = this.disableYandexRoute;

				const self = this;
				const shop = this.constants.MODE_COMPANY
					? (this.forced_shop != null ? this.forced_shop : { warehouses_ids: [] })
					: null;

				this.route_calculator.calculate(this.order.address_coords, shop).then(function () {
					self.deliveryCalculated();
				});
			},
			deliveryCalculated: function () {
				this.tech.show_delivery_info = true;
				const shop = this.route_calculator.shop;
				if (shop != null)
				{
					this.log('Выбран магазин: ' + shop.name + ' -> ' + shop.distance + 'км.');

					map.temp_route = shop.route;

					this.order.shop_id = shop.id;
					this.order.distance = shop.distance;

					if (this.tech.is_restore)
					{
						this.tech.is_restore = false;
					}
					else
					{
						const is_available = this.availableDelivery(this.order.delivery_type, this.order.date);
						const price = this.delivery_prices[this.order.delivery_type].price;
						if ((price == null) || !is_available)
						{
							this.order.delivery_type = this.cheapestDeliveryType();
						}
					}
				}

				this.getUnloadPrice();
				this.mapUpdate();
			},
			cheapestDeliveryType: function () {
				const prices = [];

				for (let type in references.delivery_types)
				{
					const is_available = this.availableDelivery(type, this.order.date);
					if (is_available)
					{
						const price = this.delivery_prices[type].price;
						if (price != null)
						{
							prices.push({ type: type, price: price });
						}
					}
				}
				if (prices.length === 0)
				{
					return this.order.delivery_type;
				}

				let min = prices[0];
				for (let i = 1; i < prices.length; i++)
				{
					if (prices[i]['price'] < min.price)
					{
						min = prices[i];
					}
				}
				return min.type;
			},

			openingHours: function (id) {
				if (this.shops[id] === undefined)
				{
					id = 1;
				}

				const arrHours = [];

				const hours = this.shops[id].business_hours;
				const first = hours.indexOf(';');
				const firstHours = hours.slice(0, first);
				const beginH = String(firstHours.match(/[0-9/.]+/)).replace('.', ':');
				const endH = String(firstHours.match(/[0-9][0-9].00$/)).replace('.', ':');
				arrHours.push(beginH, endH);

				return arrHours;
			},
			getOpeningHours: function (id) {
				return this.openingHours(id)[0];
			},
			getClosingHours: function (id) {
				return this.openingHours(id)[1];
			},

			getTransport: function (transport_id) {
				return transport_id ? references.transports[transport_id] : null;
			},
			showTimeInOrder(time){
				
				return time.replace(/\s/ig, '-');
			},
			deliveryTarget: function (transport_id) {
				if (typeof transport_id == 'undefined')
				{
					transport_id = this.findAllowedTransport(this.order.delivery_type);
				}

				const is_company = this.constants.MODE_COMPANY
					? references.delivery_type === this.constants.DELIVERY_TYPE_COMPANY
					: this.is_company;

				const vat = this.constants.MODE_COMPANY || this.is_company
					? 1.2
					: 1;

				let warehouses_id = null;
				if (this.constants.MODE_COMPANY && (this.forced_shop != null))
				{
					warehouses_id = this.forced_shop.warehouses_id;
				}
				else if (this.is_company)
				{
					const shop = this.getCurrentShop();
					warehouses_id = shop ? shop.warehouses_id : null;
				}

				const parking = references.transports_types.parking_all.length > 0
					? this.order.parking
					: false;

				return new DeliveryTarget(
					this.current_area,
					this.order.delivery_type,
					this.getTransport(transport_id),
					this.order.distance > -1 ? this.order.distance : null,
					this.getCurrentShop(),
					this.result.price,
					is_company,
					parking,
					this.isFreeDelivery(),
					warehouses_id,
					this.delivery_calculation,
					vat
				);
			},
			isFreeDelivery() {
				return references.delivery_type === this.constants.DELIVERY_TYPE_FREE;
			},
			getPrices: function (area) {
				const target = this.deliveryTarget();
				target.area = area;
				return this.price_calculator.areaPrices(target);
			},


			getUnloadPrice: _.debounce(function (calc_in_temp=false) {
                this.processDeliveryInfo();

				if (!this.current_area)
				{
					this.order.unload_base_price = null;
					this.order.unload_min_price = null;
					this.order.unload_price = null;

					$('#unloadPanel h2').html('Разгрузка и подъем. <span style="color: #ff0000;">Для расчета нужно выбрать адрес доставки</span>');
					$('#moreUnloadPanel h2').html('Разгрузка и подъем. <span style="color: #ff0000;">Для расчета нужно выбрать адрес доставки</span>');

					return;
				}
				if(this.order.floor < 1) this.order.floor = 1;
				else if(this.order.floor > 200) this.order.floor = 200;
				if(parseInt(this.order.climb) && this.order.floor < 2)
					this.order.floor = 2;

				const request = {
					is_company: this.is_company ? 1 : 0,

					floor: this.order.floor, //этаж
					bringing: this.order.bringing, //пронос
					climb: this.order.climb, //подъем - лестница, лифт

					lift_length: this.order.delivery_lift_length,
					lift_width: this.order.delivery_lift_width,
					lift_height: this.order.delivery_lift_height,
					lift_entrance: this.order.delivery_lift_entrance,
					lift_weight: this.order.delivery_lift_weight,

					transport_id: this.delivery_transport,
					area: this.current_area.id,
					shop: this.current_shop != null ? this.current_shop.id : 0,
					unload: this.unloadData(calc_in_temp),
					unload_full: this.order.unload_full ? 1 : 0,
					is_ground_floor: this.order.is_ground_floor ? 1 : 0,
				};

				this.order.unload_base_price = null;
				//this.order.unload_price = null;

				const self = this;
				$.post(this.url_prefix + '/ajax/unload/', request, function (response) {
					for (let id in response.prices)
					{
						const info = response.prices[id];
						const goods = self.result.list_all[id];

						goods.climb_type = info.climb_type;
						goods.climb = info.climb;
						goods.total = info.total;
					}
					if(!calc_in_temp) {
						self.order.unload_base_price = response.unload_base_price;
						self.order.unload_min_price = response.unload_min_price;
						self.order.unload_price = response.unload_price;
					} else{
						self.temp_unload_base_price = response.unload_base_price;
						self.temp_unload_min_price = response.unload_min_price;
						self.temp_unload_price = response.unload_price;
					}

				}, 'json');
			}, 250),

			validateBalls: function (new_value) {
				if (new_value < 0)
				{
					new_value = 0;
				}

				const balls = this.tech.available_balls > 0
					? Math.min(new_value, this.tech.available_balls, this.total_price_base)
					: 0;
				this.order.balls = balls;
				this.tech.balls = balls;
			},

			transportMaxWeight: function (transport_id) {
				const transport = this.getTransport(transport_id);
				return transport ? transport.max_weight : 0;
			},
			isTransportHuge: function (transport_id) {
				return this.transportMaxWeight(transport_id) > 15000;
			},
			validateDeliveryType: function (date) {
				if (this.availableDelivery(this.order.delivery_type, date))
				{
					return;
				}

				for (let type in references.delivery_types)
				{
					if (this.availableDelivery(type, date))
					{
						this.order.delivery_type = type;
						return;
					}
				}
			},
			setDeliveryType: function (type) {
				const addressEmpty = !this.validateAddress();
				const is_available = this.availableDelivery(type, this.order.date);

				if (!is_available || (this.delivery_prices[type].price == null) || addressEmpty)
				{
					return false;
				}

				this.order.delivery_type = type;
			},

			setDeliveryTypeDay: function () {
				this.setDeliveryType('day');
			},
			setDeliveryTypeStandard: function () {
				this.setDeliveryType('standard');
			},
			setDeliveryTypeExpress: function () {
				this.setDeliveryType('express');
			},
			setDeliveryTypeExact: function () {
				this.setDeliveryType('exact');
			},
			setDeliveryTypeCourier: function () {
				this.setDeliveryType('courier');
			},

			dt2text: function (dt) {
				let d = dt.getDate();
				if (d < 10)
				{
					d = '0' + d;
				}
				let m = dt.getMonth() + 1;
				if (m < 10)
				{
					m = '0' + m;
				}

				return d + '.' + m + '.' + dt.getFullYear();
			},
			text2dt: function (date) {
				const dmy = date.split('.');
				return new Date(dmy[2], parseInt(dmy[1]) - 1, dmy[0]);
			},
			increaseDate: function (date, days) {
				const dt = this.text2dt(date);
				dt.setDate(dt.getDate() + days);

				return this.dt2text(dt);
			},
			availableDateNext: function () {
				const max_date = new Date();
				max_date.setDate(max_date.getDate() + 14);

				const next_date = this.text2dt(this.order.date);
				next_date.setDate(next_date.getDate() + 1);

				return next_date < max_date;
			},
			toggleExactNextDay: function () {
				if (this.availableDateNext())
				{
					this.order.date = this.increaseDate(this.order.date, 1);
					if ((this.order.date !== this.date.today)
						&& (this.order.date !== this.date.tomorrow)
						&& (this.order.date !== this.date.day2)
						&& (this.order.date !== this.date.day3))
					{
						this.date.custom = this.order.date;
					}

					this.setDeliveryType('exact');
					const self = this;
					this.$nextTick(function () {
						self.tech.time.exact.value = self.tech.time.exact.min;
					});
				}
			},

			availableDate: function(date) {
				if (this.order.delivery)
				{
					return this.availableDeliveryDate(date)
				}

				return this.availablePickUp(date);
			},
			availableDeliveryDate(date){
				if (!this._availableDeliveryDate(date))
				{
					return false;
				}
				return this.availableDeliveryDay(date)
					|| this.availableDeliveryStandard(date)
					|| this.availableDeliveryExpress(date)
					|| this.availableDeliveryExact(date)
					|| this.availableDeliveryCourier(date);
			},
			_availableDeliveryDate: function (date) {
				if (date == null)
				{
					return false;
				}
				if (this.constants.MODE_COMPANY)
				{
					if (date === this.date.today)
					{
						return this.constants.ALLOW_TODAY_DELIVERY && (this.getHourNow() < 12);
					}

					if (date === this.date.tomorrow)
					{
						return this.constants.ALLOW_TODAY_DELIVERY || (this.getHourNow() < 17);
					}
				}

				return true;
			},
			getMaxSlice: function(gid, cut_type) {
				if (this.cuts[gid] !== undefined) {
					if(this.cuts[gid][cut_type] !== undefined) {
						let slice = this.cuts[gid][cut_type];
						if(slice.slices.length > 1) {
							return parseInt(Math.max(...slice.slices)) / 1000; // метры
						}
					}
				}
				return 0;
			},
			availableDelivery: function (type, date) {
				if (!this._availableDeliveryDate(date))
				{
					return false;
				}

				if (type in references.delivery_types)
				{
					type = references.delivery_types[type];
				}

				return this['availableDelivery' + type](date);
			},
			availableDeliveryDay: function (date) {
				return this.optionsDeliveryDay(date) !== false;
			},
			availableDeliveryStandard: function (date) {
				return this.optionsDeliveryStandard(date) !== false;
			},
			availableDeliveryExpress: function (date) {
				return this.optionsDeliveryExpress(date) !== false;
			},
			availableDeliveryExact: function (date) {
				return this.optionsDeliveryExact(date) !== false;
			},
			availableDeliveryCourier: function (date) {
				let total_weight = total_volume = max_size = max_width = max_length = length = width = 0;
					
				for (let index in this.result.list_all) {
					const element = this.result.list_all[index];
					length = element.length > element.width ? element.length : element.width;
					width = element.length > element.width ? element.width : element.length;
					total_weight+=element.weight * element.quantity;
					total_volume+=element.volume * element.quantity;
					max_width = this.getMaxSlice(element.id, 1);
					max_width = max_width > 0 ? max_width : width;
					max_length = this.getMaxSlice(element.id, 0);
					max_length = max_length > 0 ? max_length : length;
					max_size = Math.max(max_size, max_width, max_length);
				}
				// console.log(total_weight, total_volume, max_size);
				if (total_weight > 10 || total_volume > 0.15 || max_size > 1.1)
					return false;

				return this.optionsDeliveryCourier(date) !== false;
			},
			availablePickUp: function (date) {
				if (date !== this.date.today)
				{
					return true;
				}

				const last_hour = this.tech.time_shops.hours[1] - (this.tech.time_shops.length * 2);
				return this.getHourNow() < last_hour;
			},
			showDeliveryType: function (type) {
				if (type === 'express')
				{
					return (this.cutsQuantity === 0) && (this.order.date === this.date.today);
				}

				if (type === 'courier')
				{
					return !this.constants.MODE_COMPANY;
				}

				return true;
			},
			getMaxTodayTime: function(end_time){
				const dw = end_time.getDay();
				var time_hmax = 17, time_mmax = 0;
				switch(this.constants.region_id){
					case 10: time_hmax = 16; break;
					case 7: if(dw == 0 || dw == 6) {time_hmax = 15; time_mmax = 30; } else time_hmax = 17; break;
					case 15: if(dw == 0 || dw == 6) {time_hmax = 14; time_mmax = 30; } else time_hmax = 17; break;
				}
				return [time_hmax, time_mmax];
			},
			
			getDeliveryDelay: function (type) {
				const has_delay = (this.order.pay_type === this.BUY_TYPE_CREDIT)
					|| (this.order.pay_type === this.BUY_TYPE_INSTALLMENT);
				if (!has_delay)
				{
					return 0;
				}

				return type === 'express' ? 60 : 30; // minutes
			},
			optionsDeliveryDay: function (date) {
				if (!this.constants.MODE_COMPANY && !this.transports_valid.day)
				{
					return false;
				}

				const dt = this.str2date(date);
				const max_time = this.getNow();
				max_time.setHours(11, 30 - this.getDeliveryDelay('day'), 0, 0);

				const now = this.getNow();

				/*
				в течение дня 9-18
				- доступно если дата!=сегодня или now() < 10:30
				- price_rate = 1

				в течение дня 18-22
				- доступно если дата!=сегодня или now() < 10:30
				- price_rate = 1
				*/

				if (!this.isToday(dt) || (now.getTime() < max_time.getTime()))
				{
					return [0, 1];
				}
				else
				{
					return false;
				}
			},
			optionsDeliveryStandard: function (date) {
				if (!this.constants.MODE_COMPANY && !this.transports_valid.standard)
				{
					return false;
				}

				/*
				в течение 4 часов
				- доступно если дата!=сегодня или now() < 17:30 и (время доставки) > (now() + 30минут)
				- время доставки = 9 + max(0, ceil((distance - 50) / 20)) * 0.5
				- диапазон = 4 часа
				- максимум 18-00...22-00
				*/
				
				let more_hours = this.additional_hours;
				more_hours += this.getDeliveryDelay('standard') / 60;

				const dt = this.str2date(date);
				let mins = 0;

				if (this.isToday(dt))
				{
					if (this.isTransportHuge(this.transports.standard))
					{
						return false;
					}

					let end_time = this.getNow(), time_hmax = 0, time_mmax = 0;
					//end_time.setHours(this.constants.HOUR_STANDARD_MAX-1,30,0,0);
					[time_hmax, time_mmax] = this.getMaxTodayTime(end_time);
					end_time.setHours(time_hmax, time_mmax, 0, 0);

					if (this.getNow().getTime() >= end_time.getTime())
					{
						return false;
					}
					more_hours += 0.5;

					if ((more_hours % 1) === 0.5)
					{
						mins = 30;
						more_hours -= 0.5;
					}

					const t = this.getNow();
					t.setHours(Math.max(this.constants.HOUR_STANDARD_MIN, t.getHours()) + more_hours);
					t.setMinutes(t.getMinutes() + mins + 1);
					t.setMinutes(Math.ceil(t.getMinutes() / 30) * 30);
					t.setSeconds(0);

					if (!this.isSameDate(t, dt))
					{
						return false;
					}

					if ((t.getHours() > this.constants.HOUR_STANDARD_MAX)
						|| ((t.getHours() === this.constants.HOUR_STANDARD_MAX)
							&& (t.getMinutes() !== 0)))
					{
						return false;
					}

					return [t.getHours(), t.getMinutes()];
				}
				else
				{
					const max_time = this.getNow();
					max_time.setHours(17, 0, 0, 0);

					const hour_min = (this.isTomorrow(dt) && (this.getNow().getTime() >= max_time.getTime()))
						? 9
						: this.constants.HOUR_STANDARD_MIN;

					if ((more_hours + hour_min) > this.constants.HOUR_STANDARD_MAX)
					{
						return false;
					}

					if ((more_hours % 1) === 0.5)
					{
						mins = 30;
						more_hours -= 0.5;
					}
					return [hour_min + more_hours, mins];
				}
			},
			optionsDeliveryExpress: function (date) {
				if (!this.constants.MODE_COMPANY && !this.transports_valid.express)
				{
					return false;
				}

				/*
				экспресс
				- доступно если
					дата=сегодня
					и now() в диапазоне 9:00...17:00
					и транспорт = экспресс
					и расстояние < 30 км
				- время начала = ceil(now(), 30 минут)
				- диапазон = 2 часа
				- price_rate = 1.8
				*/
				
				const dt = this.str2date(date);
				if (!this.isToday(dt))
				{
					return false;
				}

				const end_time = this.getNow();
				let time_hmax = 0, time_mmax = 0;
				[time_hmax, time_mmax] = this.getMaxTodayTime(end_time);
				
				if ((end_time.getHours() < 9) || (end_time.getHours() >= time_hmax && end_time.getMinutes() >= time_mmax))
				{
					return false;
				}

				if (this.order.distance > this.constants.DISTANCE_EXPRESS)
				{
					return false;
				}

				const t = end_time;
				const mins = 30 + this.getDeliveryDelay('express');

				t.setHours(t.getHours());
				t.setMinutes(t.getMinutes() + mins + 1);
				t.setMinutes(Math.ceil(t.getMinutes() / 30) * 30);
				t.setSeconds(0);

				if ((t.getHours() > this.constants.HOUR_EXPRESS_MAX)
					|| ((t.getHours() === this.constants.HOUR_EXPRESS_MAX)
						&& (t.getMinutes() !== 0)))
				{
					return false;
				}

				return [t.getHours(), t.getMinutes()];
			},
			optionsDeliveryExact: function (date) {
				if (!this.constants.MODE_COMPANY && !this.transports_valid.exact)
				{
					return false;
				}

				/*
				точно ко времени
				- доступно если дата!=сегодня или now() в диапазоне 8:00...17:00
				- время доставки = 13 + max(0, ceil((distance - 50) / 20)) * 0.5
				- время доставки = max(сейчас + 5 часов, время доставки)
				- price_rate = 1.8
				- максимум 22-00
				*/

				let more_hours = this.additional_hours;
				more_hours += this.getDeliveryDelay('exact') / 60;

				const dt = this.str2date(date);

				const last_hour = 24;
				const step_minutes = this.tech.time.exact.step;
				let end_time;
				let mins = 0;
				let t = this.getNow();

				if (this.isToday(dt))
				{
					if (this.isTransportHuge(this.transports.exact))
					{
						return false;
					}

					end_time = this.getNow();
					end_time.setMinutes(end_time.getMinutes() + 15);
					if (end_time.getHours() >= 17)
					{
						return false;
					}

					more_hours += 0.5;

					if ((more_hours % 1) === 0.5)
					{
						mins = 30;
						more_hours -= 0.5;
					}

					t.setHours(Math.max(13, t.getHours()) + more_hours);
					t.setMinutes(t.getMinutes() + mins + 1);
					t.setMinutes(Math.ceil(t.getMinutes() / step_minutes) * step_minutes);
					t.setSeconds(0);

					const max_time = this.getNow();
					max_time.setMinutes(Math.ceil(max_time.getMinutes() / step_minutes) * step_minutes);
					max_time.setHours(max_time.getHours() + 5);

					if (t.getTime() < max_time.getTime())
					{
						t = max_time;
					}
					if (!this.isSameDate(t, dt))
					{
						return false;
					}

					if ((t.getHours() > last_hour) || ((t.getHours() === last_hour) && (t.getMinutes() !== 0)))
					{
						return false;
					}

					return [t.getHours(), t.getMinutes()];
				}
				else if (this.isTomorrow(dt))
				{
					end_time = this.getNow();
					end_time.setMinutes(end_time.getMinutes() + 15);
					if (end_time.getHours() >= 17)
					{
						if ((more_hours + 9) > last_hour)
						{
							return false;
						}

						if ((more_hours % 1) === 0.5)
						{
							mins = 30;
							more_hours -= 0.5;
						}

						const start_hour = 13;
						return [start_hour + more_hours, mins];
					}
					else
					{
						more_hours += 0.5;

						if ((more_hours % 1) === 0.5)
						{
							mins = 30;
							more_hours -= 0.5;
						}

						t.setHours(Math.max(13, t.getHours()) + more_hours);
						t.setMinutes(t.getMinutes() + mins + 1);
						t.setMinutes(Math.ceil(t.getMinutes() / step_minutes) * step_minutes);
						t.setSeconds(0);
						if (this.isSameDate(t, end_time))
						{
							return [0, 0];
						}

						return [t.getHours(), t.getMinutes()];
					}
				}
				else
				{
					return [0, 0];
				}
			},
			optionsDeliveryCourier: function (date) {
				if (!this.constants.MODE_COMPANY && !this.transports_valid.courier)
				{
					return false;
				}

				const dt = this.str2date(date);
				const max_time = this.getNow();
				max_time.setHours(14, 30 - this.getDeliveryDelay('courier'), 0, 0);

				const now = this.getNow();

				/*
				- Временные интервалы: с 9-00 до 15-00 и с 15-00 до 22-00 только эти
				- Такую доставку можно оформить на любой последующий интервал, кроме текущего. (до 15:00 на
				вечер, после 15:00 на любой в последующие дни)
				*/
				if (!this.isToday(dt))
				{
					return [0, 1];
				}

				if (now.getTime() > max_time.getTime())
				{
					return false;
				}
				max_time.setHours(8, 30 - this.getDeliveryDelay('courier'), 0, 0);
				if (now.getTime() > max_time.getTime())
				{
					return [1, 1];
				}

				return [0, 1];
			},

			showDeliveryPrice: function (value, approx, null_text, price_symbol) {
				if (value == null)
				{
					const operator_only = !this.delivery_calculation
						|| (this.constants.MODE_COMPANY && this.order.address);
					if (operator_only)
					{
						return 'Рассчитает оператор';
					}
				}

				if ((value != null) && this.isFreeDelivery())
				{
					return 'Рассчитает оператор';
				}

				return this.showPrice(value, approx, null_text, price_symbol);
			},
			showGoodsPrice: function (value, approx, null_text, price_symbol) {
				if (this.constants.MODE_COMPANY && (value === 0))
				{
					return 'по запросу';
				}

				return this.showPrice(value, approx, null_text, price_symbol);
			},
			showPrice: function (value, approx, null_text, price_symbol) {
				if (typeof price_symbol === 'undefined')
				{
					price_symbol = ' &#8381;';
				}
				if (typeof null_text === 'undefined')
				{
					null_text = '—';
				}
				if (typeof approx == 'undefined')
				{
					approx = false;
				}

				if (value == null)
				{	
					

					return null_text;
				}
				if (value === 0)
				{
					return '<span style="color: #3CA755; text-decoration: none; font-size: inherit; line-height: inherit">Бесплатно</span>';
				}

				const prefix = approx ? 'от ' : '';
				return prefix + this.number_format(value, this.is_company ? 2 : 0) + price_symbol;
			},
			showPriceBonus: function (value, approx, null_text) {
				if (typeof null_text === 'undefined')
				{
					null_text = '—';
				}
				if (typeof approx == 'undefined')
				{
					approx = false;
				}

				if (value == null)
				{
					return null_text;
				}
				if (value === 0)
				{
					return '<span style="color: #3CA755; text-decoration: none;">Бесплатно</span>';
				}

				const prefix = approx ? 'от ' : '';
				return prefix + this.number_format(value, this.is_company ? 2 : 0) + `&nbsp;<svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.19419 5.14045V2.53652H6.19964V1.5H0V10.5H4.21779C5.98367 10.5 7 9.52668 7 7.83286C7 6.1264 5.99637 5.14045 4.21779 5.14045H1.19419ZM5.80581 7.83286C5.80581 8.93258 5.14519 9.46348 3.82396 9.46348H1.19419V6.17697H3.82396C5.15789 6.17697 5.80581 6.72051 5.80581 7.83286Z" fill="#000C2C"></path> <path d="M2.5 0L3.5 0V1.5H2.5V0Z" fill="#000C2C"></path> <path d="M2.5 10.5L3.5 10.5V12H2.5V10.5Z" fill="#000C2C"></path></svg>
				`;
			},
			showPrice2: function (value, approx) {
				if (typeof approx == 'undefined')
				{
					approx = false;
				}
				if (value == null)
				{
					return '&mdash;';
				}
				if (value === 0)
				{
					return '<span style="color: #3CA755; text-decoration: none;">Бесплатно</span>';
				}

				const prefix = approx ? 'от ' : '';
				return prefix + this.number_format(value, this.is_company ? 2 : 0);
			},

			autocompleteGetLabel: function (item) {
				return item;
			},
			autocompleteFind: function (request) {
				const self = this;
				if (!request)
				{
					self.clearValueSearch();
					return;
				}
				// $('.shopping_cart_details_search input.v-autocomplete-input').removeClass('input--incorrect')
				self.showCancel=true;
				if (request.length < 5)
				{
					return;
				}

				self.timeoutElement=setTimeout(function(){
					const myGeocoder = window.ymaps.geocode(request, {
						boundedBy: map.getBounds(),
					});
					const max = 30;
					myGeocoder.then(
						function (res) {
							const n = Math.min(max, res.geoObjects.getLength());
							const options = [];
							for (let i = 0; i < n; i++)
							{
								const obj = res.geoObjects.get(i);
								options.push(obj.properties.get('text').replace('Россия, ', ''));
							}
							self.tech.autocomplete.items = options;
						},
						function (err) {
							//alert('Ошибка');
						}
					);
				}, 2000)


			},
			resetNewTimeOut(){
				clearTimeout(this.timeoutElement);
			},
			clearValueSearch(){
				this.resetNewTimeOut();
				this.showCancel=false;
				this.order.address_coords=[];
				this.order.address='';
				this.tech.autocomplete.items=[];
				this.tech.autocomplete.item='';
				this.order.distance = null;
				this.tech.autocomplete.item=null;
				this.$refs.search_address.searchText='';
				$('.shopping_cart_details_search input.v-autocomplete-input').addClass('input--incorrect')
				map.resetRoute();
			},

			autosave: _.debounce(function () {
				const request = { delivery: this.deliveryData() };
				$.post(this.url_prefix + '/ajax/delivery/', request, function (response) {}, 'json');
			}, 1000),

			showUnloadInfo: function () {
				this.tech.prev_scroll_top = $(window).scrollTop();
				this.tech.show_unload_info = true;
				$('body').css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
				$('body').css('overflow', 'hidden');
				this.temp_unload_list=JSON.parse(JSON.stringify(this.unload_list));
				this.temp_unload_base_price = this.order.unload_base_price;
				this.temp_unload_min_price = this.order.unload_min_price;
				this.temp_unload_price=this.order.unload_price;
			},
			hideUnloadInfo: function () {
				this.tech.show_unload_info = false;
				$('body').css('padding-right', '0px');
				$('body').css('overflow', 'scroll');
			},
			saveUnloadInfo(){
				this.tech.show_unload_info = false;
				$('body').css('padding-right', '0px');
				$('body').css('overflow', 'scroll');
				const tempVal=JSON.parse(JSON.stringify(this.unload_list));
				this.unload_list=JSON.parse(JSON.stringify(this.temp_unload_list))
				this.temp_unload_list=tempVal;
				this.order.unload_base_price = this.temp_unload_base_price;
				this.order.unload_min_price = this.temp_unload_min_price;
				this.order.unload_price = this.temp_unload_price;
				popups.alertNew('Параметры успешно обновлены','<a class="js_cancel_unload">Отменить</a> <span id="js_timer_unload">5</span> сек', true, true);
				this.timeUnloadInfo()
			},
			timeUnloadInfo(){
				let time = 5; // Задаём начальное время
				const timer = setInterval(() => {
				document.getElementById('js_timer_unload').textContent = time <= 0 
					? clearInterval(timer) // Останавливаем таймер, поскольку время истекло
					: time--; // С каждой секундой уменьшаем время
				}, 1000); // Интервал делаем одной секунды
			},
			showLiftSize: function () {
				this.tech.show_lift_info = true;
				$('body').css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
				$('body').css('overflow', 'hidden');
			},
			hideLiftSize: function () {
				this.tech.show_lift_info = false;
				$('body').css('padding-right', '0px');
				$('body').css('overflow-y','scroll');
			},

			short_date: function (date) {
				
				if (date)
				{
					const d = date.split('.');
					return d[0]+ '.'+  d[1] ;
				}
				return '';
			},
			short_date_month: function (date) {
				
				if (date)
				{
					const d = date.split('.');
					return d[0] +' '+  references.monthArray[d[1]-1] ;
				}
				return '';
			},
			shortWeekDay:function(date){
				let dataFormat=this.text2dt(date);
				return references.dayWeek[dataFormat.getDay()]
			},

			setAddressAutocomplete: _.debounce(function (item) {
				if (item)
				{
					this.setAddress(item);
				}
			}, 500),
			setAddressData: function (data) {
				this.setAddress(data.address);

				this.order.pass_entry = data.pass_entry;
				this.order.narrow_road = data.narrow_road;
				this.order.barrier = data.barrier;
				this.order.narrow_stairs = data.narrow_stairs;
				this.order.technical_floor = data.technical_floor;
				this.order.arch = data.arch;

				this.order.floor = data.floor;
				this.order.comments += ' '+data.comments;
				this.order.comments = this.order.comments.trim();
			},
			removeAddressFormSave: function(address){
				const index = this.address_list.indexOf(address);
				if (index !== -1)
				{
					this.address_list.splice(index, 1);

					this._requestAddress({remove: address.id}, function () {
						
					});
					if(!this.address_list.length){
						//this.emptyList=true;
						this.$refs.addressPopup.close()
					}
				}
			},
			myAddressesClick: function(){
				if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'mac_click_checkout_my_addresses_addres');
				this.$refs.addressPopup.toggle();
			},
			_requestAddress(data, success) {
				$.ajax({
					type: 'POST',
					url: '/ajax/address/',
					data: data,
					success: success,
					//processData: false,
					dataType: 'json'
				});
			},
			setAddress: function (new_value) {
				if ((new_value === '') || (new_value === this.order.address))
				{
					return;
				}
				this.order.address = new_value;
				if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'mac_click_checkout_searchbar_addres');

				const self = this;
				ymaps.geocode('Россия, ' + this.order.address, { results: 1 }).then(function (res) {
					const firstGeoObject = res.geoObjects.get(0);
					self.order.address_coords = firstGeoObject.geometry.getCoordinates();
					self.refreshCoords();
				});

				this.tech.autocomplete.item = this.order.address;
				self.showCancel=true;
				$('.shopping_cart_details_search input.v-autocomplete-input').removeClass('input--incorrect');
			},
			setCoords: function (new_value) {
				if (new_value)
				{
					this.order.address_coords = new_value;

					const self = this;
					ymaps.geocode(new_value, { results: 1 }).then(function (res) {
						const first = res.geoObjects.get(0);
						self.order.address = first.properties.get('text').replace('Россия, ', '');
						self.tech.autocomplete.item = self.order.address;
						self.showCancel=true;
						$('.shopping_cart_details_search input.v-autocomplete-input').removeClass('input--incorrect')

					}).then(function(res){
                        self.refreshCoords();
                    });
				}
			},
			refreshCoords: function () {
				if (!map.created())
				{
					const self = this;
					setTimeout(function () {
						self.refreshCoords();
					}, 500);
					return;
				}
				if (this.order.address_coords && this.order.delivery)
				{
                    this.disableYandexRoute = false;
                    if(this.current_area && this.current_area.green_zone === true){
                        this.disableYandexRoute = true;
                    }
					this.order.distance = null;
					map.setCenter(this.order.address_coords, 10);			
					this.calculateDistance();
				}
			},
			setShop: function (new_value) {
				//const change = !this.order.delivery && new_value && (new_value !== '0');
                const change = new_value && (new_value !== '0');
				if (!change)
				{
					return;
				}

				if (!(new_value in this.shops))
				{
					new_value = Object.keys(this.shops)[0];
				}

				const shop = this.shops[new_value];

				if (map.created())
				{
					if(!this.order.delivery){
						map.setCenter([shop.latitude, shop.longitude], 15);
					}
				}

				this.fixPickupTime(new_value);
			},
			date2weekday: function (date) {
				const weekday = this.text2dt(date).getDay();
				return weekday === 0 ? 7 : weekday;
			},
			shop2work_hours: function (shop) {
				const weekday = this.date2weekday(this.order.date);
				const start = parseInt(shop['hour_from_' + weekday]);
				const end = parseInt(shop['hour_to_' + weekday]);
				if ((start === 0) || (end === 0))
				{
					return [0, 0];
				}

				return [start, end];
			},
			fixSliders: function (date) {
				for (let type in references.delivery_types)
				{
					const k = references.delivery_types[type];
					const range = this['optionsDelivery' + k](date);
					if (range)
					{
						let min = 0;
						if (this.tech.time[type].step != null)
						{
							const step_hour = 60 / this.tech.time[type].step;
							min = range[0] * step_hour + (range[1] / this.tech.time[type].step);
						}
						else
						{
							min = range[0];
						}
						this.tech.time[type].min = min;
						this.tech.time[type].value = Math.max(this.tech.time[type].value, min);
					}

					const slider = this.$refs['slider_' + type];
					if (slider)
					{
						this.$nextTick(slider.refresh);
					}
				}

				this.fixPickupTime();
			},
			fixPickupTime: function (shop_id) {
				if (typeof shop_id === 'undefined')
				{
					shop_id = this.order.shop_id;
				}
				if (!(shop_id in this.shops))
				{
					shop_id = Object.keys(this.shops)[0];
				}

				const shop = this.shops[shop_id];
				this.tech.time_shops.hours = this.shop2work_hours(shop);
				this.tech.time_shops.value = Math.max(this.tech.time_shops.value, this.tech.time_shops.hours[0]);
			},

			setDate: function (new_value) {
				if (this.availableDate(new_value)){
					this.fixSliders(new_value);
					this.validateDeliveryType(new_value);
				} else{
					popups.alert('Доставка недоступна', 'Доставка на данную дату недоступна, выберите другую дату или адрес')
				}
				
			},

			validateDeliveryDestination: function (data) {
				if (data.delivery)
				{
					if (!data.address)
					{
						//this.alert('Не указан адрес доставки');
						popups.alertNew('Не указан адрес доставки', 'Для оформления заказа необходимо указать адрес', false)
						let posScroll=$('#delivery_address').offset().top - 20
						$([document.documentElement, document.body]).animate({
							scrollTop: posScroll
						}, 300);
						$('.shopping_cart_details_search input.v-autocomplete-input').addClass('input--incorrect')
						return false;
					}

					if (this.delivery_calculation)
					{
						if (!data.distance)
						{
							popups.alertNew('Выберите другой адрес', 'Для указанной вами точки доставки невозможно произвести расчет стоимости. Пожалуйста, выберете другой адрес доставки.', false)
							let posScroll=$('#delivery_address').offset().top - 20
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							//this.alert('Для указанной вами точки доставки невозможно произвести расчет стоимости. Пожалуйста, выберете другой адрес доставки.');
							return false;
						}

						if (!this.availableDelivery(data.time_type, data.date))
						{
							popups.alertNew('Выберите другую дату', 'На указанную дату доставка невозможна. Выберите другую дату.', false)
							let posScroll=$('#delivery_date').offset().top - 20
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							//this.alert('На указанную дату доставка невозможна. Выберите другую дату.');
							return false;
						}

						const is_available = (this.constants.MODE_COMPANY && this.order.address) || (this.delivery_prices[data.time_type].price != null);
						if (!is_available)
						{
							popups.alertNew('Выберите другой способ доставки', 'Указан недоступный способ доставки.', false)
							let posScroll=$('#delivery_type').offset().top - 120;
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							//this.alert('Указан недоступный способ доставки.');
							return false;
						}

						const func = this['optionsDelivery' + references.delivery_types[data.time_type]];
						const range = func(data.date);
						if (range === false)
						{
							popups.alertNew('Выберите другое время доставки', 'Выбрано недоступное время доставки.', false)
							let posScroll=$('#delivery_type').offset().top - 20
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							//this.alert('Выбрано недоступное время доставки.');
							return false;
						}
						if (range[1] !== 1)
						{
							const min = range[0] * 2 + (range[1] === 30 ? 1 : 0);
							if (min > data.time_value)
							{
								popups.alertNew('Выберите другое время доставки', 'Выбрано недоступное время доставки.', false)
								let posScroll=$('#delivery_type').offset().top - 20
								$([document.documentElement, document.body]).animate({
									scrollTop: posScroll
								}, 300);
								//this.alert('Выбрано недоступное время доставки.');
								return false;
							}
						}
					}

					if (data.receiver_change)
					{
						if (data.receiver_last_name === '')
						{
							popups.alertNew('Не указаны данные получателя.', 'Укажите фамилию получателя заказа', false)
							let posScroll=$('#delivery_receiver').offset().top - 120
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							this.errors.receiver_fullname='Поле обязательно для заполнения'
							setTimeout(function(){
								
								$('#delivery_receiver').find('.shopping_cart_details_services_item_body').slideDown();
								$('#delivery_receiver').find('.shopping_cart_details_services_item_header').addClass('shopping_cart_details_services_item_header_open'); 
							}, 400)
							return false;
						}
						if (data.receiver_first_name === '')
						{
							popups.alertNew('Не указаны данные получателя.', 'Укажите имя получателя заказа в поле ФИО через пробел', false)
							let posScroll=$('#delivery_receiver').offset().top - 120
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							this.errors.receiver_fullname='Не указано имя получателя'
							setTimeout(function(){
								$('#delivery_receiver').find('.shopping_cart_details_services_item_body').slideDown();
								$('#delivery_receiver').find('.shopping_cart_details_services_item_header').addClass('shopping_cart_details_services_item_header_open'); 
							}, 400)
							
							//this.alert('Не указано имя получателя.');
							return false;
						}
						if (data.receiver_phone.replace(/[^0-9]/g,'').length != 11)
						{
							popups.alertNew('Не указаны данные получателя.', 'Укажите телефон получателя заказа', false)
							let posScroll=$('#delivery_receiver').offset().top - 120
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							this.errors.receiver_phone='Поле обязательно для заполнения'
							setTimeout(function(){
								$('#delivery_receiver').find('.shopping_cart_details_services_item_body').slideDown();
								$('#delivery_receiver').find('.shopping_cart_details_services_item_header').addClass('shopping_cart_details_services_item_header_open'); 
							}, 400)
							//this.alert('Не указан телефон получателя.');
							return false;
						}
					}
				}

				if (!data.delivery || this.constants.MODE_COMPANY)
				{
					const shop_check = !this.constants.MODE_COMPANY || this.delivery_calculation;
					if (shop_check)
					{
						if (this.constants.MODE_COMPANY && (data.warehouses_id === 0))
						{
							popups.alertNew('Не выбрана база.', 'Выберите базу отгрузки заказа', false)
							let posScroll=$('#shops_list').offset().top - 120
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							//this.alert('Не выбрана база.');
							return false;
						}

						if (!data.shop_id || (data.shop_id === 0) || (data.shop_id === '0'))
						{
							popups.alertNew('Не указан магазин.', 'Выберите магазин, с которого Вы заберете заказа', false)
							let posScroll=$('#shops_list').offset().top - 120
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							//this.alert('Не указан магазин.');
							return false;
						}

						const unavailable = this.constants.MODE_COMPANY
							? this.shop2unavailable(data.warehouses_id) > 0
							: this.shop2unavailable(data.shop_id) > 0;
						if (unavailable && !this.order.allow_unavailable)
						{
							popups.alertNew('На выбранной Вами базе товар присутствует не в полном объеме', 'На выбранной Вами базе товар присутствует не в полном объеме. Произведите корректировку списка товаров в корзине или установите признак "Продолжить оформление заказа".', false)
							let posScroll=$('#shops_list').offset().top - 120
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							//this.alert('На выбранной Вами базе товар присутствует не в полном объеме. Произведите корректировку списка товаров в корзине или установите признак "Продолжить оформление заказа".');
							return false;
						}
					}
				}

				return true;
			},
			validateClientData: function (data) {
				let errors = [];

				if (data.is_company)
				{
					if (data.company_name === '')
					{
						//errors.push('Не указано название юридического лица.');
						popups.alertNew('Не указаны данные юридического лица.', 'Укажите название юридического лица.', false);
						let posScroll=$('#delivery_company_info').offset().top - 120
						$([document.documentElement, document.body]).animate({
							scrollTop: posScroll
						}, 300);
						this.errors.nameCompany='Не указано название юр.лица'
						return false;
					}

					if (data.company_inn.replaceAll(/[^0-9]+/g, '').length===0)
					{
						//errors.push('Не указан ИНН.');
						popups.alertNew('Не указаны данные юридического лица.', 'Укажите ИНН юридического лица.', false)
						let posScroll=$('#delivery_company_info').offset().top - 120
						$([document.documentElement, document.body]).animate({
							scrollTop: posScroll
						}, 300);
						this.errors.innCompany='Не указано ИНН юр.лица';
						return false;
					}

					if (!this.constants.MODE_COMPANY && (data.email === ''))
					{
						popups.alertNew('Не указаны данные клиента.', 'Укажите e-mail контактного лица', false)
						let posScroll=$('#delivery_company_contacts').offset().top - 120
						$([document.documentElement, document.body]).animate({
							scrollTop: posScroll
						}, 300);
						this.errors.email='Поле обязательно для заполнения'
						return false;
						errors.push('Не указан e-mail.');
					}
					if(data.company_receiver_change){
						if (data.company_receiver_name === '')
						{
							popups.alertNew('Не указаны данные грузополучателя.', 'Не указано название юридического лица получателя.', false)
							let posScroll=$('#delivery_company_info_receiver').offset().top - 120
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							this.errors.nameCompanyRes='Не указано название юр.лица грузополучателя'
							return false;
							//errors.push('Не указано название юридического лица получателя.');
						}

						if (data.company_receiver_inn.replaceAll(/[^0-9]+/g, '').length===0)
						{
							popups.alertNew('Не указаны данные грузополучателя.', 'Не указано ИНН юридического лица получателя.', false)
							let posScroll=$('#delivery_company_info_receiver').offset().top - 120
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							this.errors.innCompanyRes='Не указано ИНН юр.лица грузополучателя';

							return false;
							//errors.push('Не указан ИНН получателя.');
						}
					}
				}

				if(!this._validatePersonalData(data)){
					return false;
				}

				return true;
			},

			_validatePersonalData: function (data) {
				const self=this;
				const errors = [];
				if (!this.constants.IS_AUTH || (this.tech.step === 1 && data.is_company))
				{
					if (data.last_name === '')
					{
						popups.alertNew('Не указаны данные клиента.', 'Укажите фамилию контактного лица', false)
						let posScroll;
						if(this.tech.step === 1 && data.is_company){
							posScroll=$('#delivery_company_contacts').offset().top - 120
						} else {
							posScroll=$('#delivery_contacts_main').offset().top - 120
						};
						$([document.documentElement, document.body]).animate({
							scrollTop: posScroll
						}, 300);
						self.errors.fullname_client='';
						self.errors.fullname_client='Поле обязательно для заполнения';
						return false;
					}

					if (data.first_name === '')
					{
						popups.alertNew('Не указаны данные клиента.', 'Укажите имя контактного лица в поле ФИО через пробел', false)
						let posScroll;
						if(this.tech.step === 1 && data.is_company){
							posScroll=$('#delivery_company_contacts').offset().top - 120
						} else {
							posScroll=$('#delivery_contacts_main').offset().top - 120
						} 
						self.errors.fullname_client='';
						self.errors.fullname_client='Не указано имя клиента'
						$([document.documentElement, document.body]).animate({
							scrollTop: posScroll
						}, 300);

						return false;
						
					}

					if (data.phone === '')
					{
						//errors.push('Не указан телефон получателя.');
						popups.alertNew('Не указаны данные клиента.', 'Укажите телефон контактного лица', false)
						let posScroll;
						if(this.tech.step === 1 && data.is_company){
							posScroll=$('#delivery_company_contacts').offset().top - 120
						} else {
							posScroll=$('#delivery_contacts_main').offset().top - 120
						} 
						$([document.documentElement, document.body]).animate({
							scrollTop: posScroll
						}, 300);
						self.errors.phone='Поле обязательно для заполнения'
						return false;
					}
					else if (data.phone.search('_') !== -1)
					{
						popups.alertNew('Некорректные данные клиента.', 'Указан некорректный телефон контактного лица', false)
						let posScroll;
						if(this.tech.step === 1 && data.is_company){
							posScroll=$('#delivery_company_contacts').offset().top - 120
						} else {
							posScroll=$('#delivery_contacts_main').offset().top - 120
						} 
						$([document.documentElement, document.body]).animate({
							scrollTop: posScroll
						}, 300);
						self.errors.phone='Некорректный формат телефона';
						return false;
					}

					if (data.email !== '')
					{
						if (!this.validateEmail(data.email))
						{
							popups.alertNew('Некорректные данные клиента.', 'Указан неправильный e-mail контактного лица', false)
							let posScroll;
							if(this.tech.step === 1 && data.is_company){
								posScroll=$('#delivery_company_contacts').offset().top - 120
							} else {
								posScroll=$('#delivery_contacts_main').offset().top - 120
							}
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							this.errors.email='Некорректный формат e-mail';
							return false;
							//errors.push('Указан неправильный e-mail.');
						}
					}
					if(!this.constants.IS_AUTH && this.tech.step === 0){
						if(false && !this.order.politics){
							let posScroll=$('#delivery_contacts_main').offset().top - 120;
							popups.alertNew('Не приняты условия.', 'Не приняты условия Пользовательского соглашения и Политики обработки персональных данных', false);
							$([document.documentElement, document.body]).animate({
								scrollTop: posScroll
							}, 300);
							this.errors.politics='Не приняты условия';
							return false;
						}
					}
				}
				return true;
			},
			validateDeliveryData: function (data) {
				if (!this.validateDeliveryDestination(data))
				{
					return false;
				}

				if (!this.validateClientData(data))
				{
					return false;
				}

				if (
					this.cutsQuantity &&
					(this.order.pay_type !== this.constants.PAY_CARD_ONLINE) &&
					(this.order.pay_type !== this.constants.PAY_QR_SBP) &&
					(this.order.pay_type !== this.constants.PAY_SHOP) &&
					(this.order.pay_type !== this.constants.PAY_INVOICE)
				)
				{
					const label_online = this.constants.PAY_LABELS[this.constants.PAY_CARD_ONLINE];
					const label_sbp = this.constants.PAY_LABELS[this.constants.PAY_QR_SBP];
					const label_shop = this.constants.PAY_LABELS[this.constants.PAY_SHOP];

					const text = 'В Вашем заказе присутствует услуга резки. В соответствии с действующими правилами, для таких заказов необходимо произвести предоплату. <br><br>' +
						'Пожалуйста, выберите другой способ оплаты <br>' +
						'(' + label_online + ', ' + label_sbp + ' или ' + label_shop + ')';
					this.alert(text);
					return false;
				}

				return true;
			},

			validateEmail: function (email) {
				const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				return re.test(String(email).toLowerCase());
			},
			fullValidateEmail: function(email){
				let validateFlag=false;
				switch(this.tech.step){
					case 1:
						if(!this.validateEmail(email)){
							validateFlag= true;
						} else {
							validateFlag= false;
						};
						break;
					case 0:
						if((email !== '') && !this.validateEmail(email))	{
							validateFlag= true;
						} else {
							validateFlag= false;
						};
						break;

				}

				this.tech.validateEmailValue = validateFlag;
			},
			setLiftWeight: function (value) {
				this.order.delivery_lift_weight = value;
			},

			hideUserInfo: function () {
				if (this.order.last_name === '')
				{
					this.alert('Не указана фамилия получателя.');
					return false;
				}
				if (this.order.first_name === '')
				{
					this.alert('Не указано имя получателя.');
					return false;
				}
				if (this.order.phone === '')
				{
					this.alert('Не указан телефон получателя.');
					return false;
				}
				if (this.order.phone.search('_') !== -1)
				{
					this.alert('Указан неверный телефон получателя.');
					return false;
				}
				this.tech.userinfo_edit = false;
			},

			alert: function (msg) {
				if (popups['alert'])
				{
					popups.alert(msg.split('\r\n').join('<br>'));
				}
				else
				{
					window.alert(msg);
				}
			},
			confirm: function (msg, action, button) {
				if (window.confirm_js)
				{
					window.confirm_js(msg, action, button);
				}
				else
				{
					if (window.confirm(msg))
					{
						if (typeof action === 'string' || action instanceof String)
						{
							document.location = action;
						}
						else
						{
							action();
						}
					}
				}
			},

			addComments: function (comment) {
				this.order.comments = this.order.comments === ''
					? comment
					: this.order.comments + ', ' + comment;
			},

			unloadData: function (temp_in_modal=false) {
				const result = {};

				const allow = this.order.unload || this.unload_available;
				if (!allow)
				{
					return result;
				}
				let unloadFromVal=(temp_in_modal?this.temp_unload_list:this.unload_list)
				for (let id in unloadFromVal)
				{
					const goods = unloadFromVal[id];
					result[id] = {
						unload: 1,
						climb: 1,
						floor: goods.is_ground_floor ? 2 : goods.floor,
						bringing: goods.bringing,
						is_ground_floor: goods.is_ground_floor,
					};
				}

				return result;
			},

			deliveryData: function () {
				const info = {
					delivery: this.order.delivery ? 1 : 0, //доставка или самовывоз

					shop_id: this.order.shop_id, //доставка из магазина
					warehouses_id: this.forced_warehouse != null ? this.forced_warehouse.id : 0,
					transport_id: this.delivery_transport ?? 0, //транспорт

					address: (this.order.delivery && this.order.address)
						? this.order.address.replace('Россия, ', '')
						: '', //адрес
					address_coords: this.order.address_coords, //адрес
					price: this.delivery_price ?? -1, //стоимость доставки

					area: this.current_area ? this.current_area.id : null,

					date: this.order.date, //дата доставки
					time: this.delivery_time, //время доставки
					time_type: this.order.delivery_type,
					time_value: this.delivery_value,

					samovyvoz_date: !this.order.delivery ? this.order.date : '01.01.1999', //this.tech.samovyvoz_date,//дата самовывоза
					samovyvoz_time_from: !this.order.delivery
						? this.tech.time_shops.start()
						: '00:00:00', //дата начала интервала самовывоза
					samovyvoz_time_to: !this.order.delivery
						? this.tech.time_shops.end()
						: '00:00:00', //дата конца интервала самовывоза

					time_start: '',
					time_end: '',

					distance: this.order.distance ? this.order.distance : -1,

					load: this.order.load ? 1 : 0, //погрузка
					unload: (this.order.unload && this.unload_available) ? 1 : 0, //разгрузка
					unload_full: this.order.unload_full ? 1 : 0,
					manipulator: this.order.manipulator ? 1 : 0, //разгрузка с манипулятором

					floor: this.order.floor, //этаж
					bringing: this.order.bringing, //пронос
					climb: this.order.climb, //подъем - лестница, лифт
					is_ground_floor: this.order.is_ground_floor ? 1 : 0, //цокольный этаж

					lift_length: this.order.delivery_lift_length, //лифт - длина
					lift_width: this.order.delivery_lift_width, //лифт - глубина
					lift_height: this.order.delivery_lift_height, //лифт - высота
					lift_entrance: this.order.delivery_lift_entrance, //лифт - ширина двери
					lift_weight: this.order.delivery_lift_weight, //лифт - грузоподъемность

					delivery_limitations: 0,
					delivery_limitations_text: '',

					pass_entry: this.order.pass_entry ? 1 : 0,
					narrow_road: this.order.narrow_road ? 1 : 0,
					arch: this.order.arch ? 1 : 0,
					barrier: this.order.barrier ? 1 : 0,
					narrow_stairs: this.order.narrow_stairs ? 1 : 0,
					technical_floor: this.order.technical_floor ? 1 : 0,

					direct_access: 0,

					unload_list: this.unloadData(),

					// данные пользователя
					comments: this.order.comments,
					last_name: this.order.last_name,
					first_name: this.order.first_name,
					middle_name: this.order.middle_name,
					phone: this.order.phone,
					email: this.order.email,

					receiver_change: this.order.receiver_change ? 1 : 0,
					receiver_last_name: this.order.receiver_change
						? this.order.receiver_last_name
						: this.order.last_name,
					receiver_first_name: this.order.receiver_change
						? this.order.receiver_first_name
						: this.order.first_name,
					receiver_middle_name: this.order.receiver_change
						? this.order.receiver_middle_name
						: this.order.middle_name,
					receiver_phone: this.order.receiver_change
						? this.order.receiver_phone
						: this.order.phone,

					// данные оплаты
					pay_type: this.order.pay_type,
					pay_balls: this.order.pay_balls ? 1 : 0,
					balls: this.order.balls,

					// данные юр лица
					is_company: this.is_company,
					company_name: this.order.company_name,
					company_inn: this.order.company_inn,
					company_kpp: this.order.company_kpp,
					company_ogrn: this.order.company_ogrn,
					company_address: this.order.company_address,
					company_bank: this.order.company_bank,
					company_bik: this.order.company_bik,
					company_rschet: this.order.company_rschet,
					company_kschet: this.order.company_kschet,
					company_type: this.order.company_type,

					company_receiver_change: this.order.company_receiver_change ? 1 : 0,
					company_receiver_name: this.order.company_receiver_change
						? this.order.company_receiver_name
						: this.order.company_name,
					company_receiver_inn: this.order.company_receiver_change
						? this.order.company_receiver_inn
						: this.order.company_inn,
					company_receiver_kpp: this.order.company_receiver_change
						? this.order.company_receiver_kpp
						: this.order.company_kpp,
					company_receiver_ogrn: this.order.company_receiver_change
						? this.order.company_receiver_ogrn
						: this.order.company_ogrn,
					company_receiver_address: this.order.company_receiver_change
						? this.order.company_receiver_address
						: this.order.company_address,
					company_receiver_bank: this.order.company_receiver_change
						? this.order.company_receiver_bank
						: this.order.company_bank,
					company_receiver_bik: this.order.company_receiver_change
						? this.order.company_receiver_bik
						: this.order.company_bik,
					company_receiver_rschet: this.order.company_receiver_change
						? this.order.company_receiver_rschet
						: this.order.company_rschet,
					company_receiver_kschet: this.order.company_receiver_change
						? this.order.company_receiver_kschet
						: this.order.company_kschet,
					company_receiver_type: this.order.company_receiver_change
						? this.order.company_receiver_type
						: this.order.company_type,

					operator_call: this.order.operator_call ? 1 : 0,

					parking: this.order.parking ? 1 : 0,
					parking_max_height: this.order.parking_max_height,
					contracts_id: this.tech.contracts.current != null
						? this.tech.contracts.current.id
						: 0,
				};

				if (!info.delivery)
				{
					info.price = 0;
				}

				const time = info.time.replace(' - ', ' ').replace('-', ' ');

				if (time.indexOf(' ') !== -1)
				{
					const range = time.split(' ');
					info.time_start = range[0].trim();
					info.time_end = range[1].trim();
				}
				else
				{
					info.time_start = time.replace('точно к ', '');
					info.time_end = info.time_start;
				}

				return info;
			},

			createOrder: function () {
				if (this.tech.order_sended)
				{
					return;
				}

				this.tech.order_sended = true;

				const data = this.deliveryData();

				data.comments = this.full_comments;
				if (!this.validateDeliveryData(data))
				{
					this.tech.order_sended = false;
					return;
				}
                const is_company = data.is_company;
				const self = this;
				$.ajax({
					type: 'POST',
					url: this.url_prefix + '/ajax/order/',
					data: { delivery: data, colorsPrice: Math.ceil(parseFloat(this.colorsPrice)) },
					success: function (data) {
						self.tech.order_sended = false;
						if (data.redirect && data.redirect.indexOf('//')==-1)
						{
							data.redirect = self.url_prefix + data.redirect;
						}

						if (data.error)
						{
							if (self.order.pay_type === self.constants.PAY_QR_SBP) popups.alert && popups.alert(data.error) || self.alert(data.error); 
							else self.confirm(data.error, data.redirect, 'Изменить');
						}
						else
						{
							if(typeof reach_goal=='function') {
                                reach_goal('order');
                                if(is_company) {
                                    reach_goal('mac_sendform_korzina_all_ul');
                                } else {
                                    reach_goal('mac_sendform_korzina_all_fl');
                                }
                            }
							document.location = data.redirect;
						}
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.error(jqXHR, textStatus, errorThrown);
						console.error(jqXHR.responseText);
						self.alert('Ошибка: ' + jqXHR.responseText.replace('\n', '<br>'));
						self.tech.order_sended = false;
					},
					dataType: 'json',
				});
			},
			getCurrentShop: function () {
				return this.order.shop_id in this.shops
					? this.shops[this.order.shop_id]
					: null;
			},

			/**
			 *
			 * @param {Date} date
			 * @returns {string}
			 */
			date2str: function (date) {
				let d = date.getDate();
				if (d < 10)
				{
					d = '0' + d;
				}

				let m = date.getMonth() + 1;
				if (m < 10)
				{
					m = '0' + m;
				}

				const y = date.getFullYear();
				return '' + d + '.' + m + '.' + y;
			},

			/**
			 *
			 * @param {string} date
			 * @returns {Date}
			 */
			str2date: function (date) {
				const d = date.split('.');
				const r = new Date(parseInt(d[2]), parseInt(d[1]) - 1, parseInt(d[0]));

				return r;
			},

			/**
			 *
			 * @param {Date} date
			 * @returns {boolean}
			 */
			isToday: function (date) {
				const today = this.getNow();

				return this.isSameDate(date, today);
			},

			/**
			 *
			 * @param {Date} date
			 * @returns {boolean}
			 */
			isTomorrow: function (date) {
				const tomorrow = this.getNow();
				tomorrow.setDate(tomorrow.getDate() + 1);

				return this.isSameDate(date, tomorrow);
			},
			/**
			 *
			 * @param {Date} date
			 * @param {Date} date2
			 * @returns {boolean}
			 */
			isSameDate: function (date, date2) {
				const d = new Date(date);
				const d2 = new Date(date2);
				d.setHours(0, 0, 0, 0);
				d2.setHours(0, 0, 0, 0);

				return d.getTime() === d2.getTime();
			},
			getNow: function () {
				const d = new Date();

				// utc
				d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

				// to timezone
				d.setSeconds(d.getSeconds() + this.constants.TIMEZONE);

				return d;
			},
			getHourNow: function () {
				return this.getNow().getHours();
			},

			getDeliveryActionAreas: function () {
				if (this.is_company)
				{
					return [];
				}

				for (let i = 0; i < this.actions_delivery.length; i++)
				{
					const action = this.actions_delivery[i];
					if (this.tech.delivery_action_id === action.id)
					{
						return 'area_ids' in action ? action.area_ids : [];
					}
				}

				return [];
			},
			validActionDelivery: function (action, delivery_type) {
				if (this.is_company)
				{
					return false;
				}

				if (!this.order.delivery)
				{
					return false;
				}

				if (this.order.date === this.date.today && delivery_type === 'day')
				{
					return false;
				}

				const valid_type = delivery_type === 'day';
				if (!valid_type)
				{
					return false;
				}

				if (this.result.price < action.price)
				{
					return false;
				}
				
				if (this.constants.region_id == 1)
				{
					if (this.tech.time[delivery_type].max != this.tech.time[delivery_type].value) // free only if all day choosen
					{
						return false;
					}
				}
				else if (this.tech.time[delivery_type].value != 2)
				{
					return false;
				}
				
				if ((action.action_type === this.constants.ACTION_DELIVERY_TYPE_ALL) || (action.action_type === this.constants.ACTION_DELIVERY_TYPE_BALLS))
				{
					if (action.transport_ids.indexOf(this.delivery_transport) === -1)
					{
						return false;
					}

					const area_id = this.current_area ? this.current_area.id : null;
					if (action.area_ids.indexOf(area_id) === -1)
					{
						return false;
					}
				}

				return true;
			},
			show_array: function (arr) {
				return arr.length > 0 ? arr.join(', ') : 'не указаны';
			},
			actionDeliveryPrice: function () {
				if (this.is_company)
				{
					return this.delivery_price;
				}

				if (this.delivery_price == null)
				{
					return null;
				}

				const action = this.getActionDelivery(this.active_action_id);
				if (action == null)
				{
					return this.delivery_price;
				}

				if (action.action_type === this.constants.ACTION_DELIVERY_TYPE_BALLS)
				{
					return this.delivery_price;
				}

				return 0;
			},
			getActionDelivery: function (action_id) {
				for (let i = 0; i < this.actions_delivery.length; i++)
				{
					const action = this.actions_delivery[i];
					if (action_id === action.id)
					{
						return action;
					}
				}

				return null;
			},
			goodsCuts: function (goods) {
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
			goodsCutPrice: function (cut, goods) {
                let free_quantity = this.is_company ? 0 : cut.free_quantity;
				return (cut.quantity * (cut.slices.length - 1) - free_quantity) * goods.cut_price;
			},
			goodsCutPriceText: function (cut, goods) {
				const price = this.goodsCutPrice(cut, goods);
				return price === 0 ? 'Бесплатно' : this.nf_price(price);
			},
			goodsCutsPrice: function (cuts, goods) {
				let price = 0;
				for (let i in cuts)
				{
					price += this.goodsCutPrice(cuts[i], goods);
				}

				return price;
			},
			goodsCutsPriceText: function (goods) {
				const cuts = this.goodsCuts(goods);
				const price = this.goodsCutsPrice(cuts, goods);
				return price === 0 ? 'Бесплатно' : this.nf_price(price);
			},

			colorData(color_id) {
				return references.colors2names[color_id];
			},
			colorName(color_id) {
				const color = this.colorData(color_id);
				if (typeof color === 'undefined')
				{
					return '---';
				}
				return color.brand_name + ' ' + color.name;
			},
			goodsColors: function (goods) {
				if (!goods.coloring)
				{
					return [];
				}

				const k = '' + goods.id;
				if (typeof this.colors[k] === 'undefined')
				{
					Vue.set(this.colors, k, []);
				}

				return this.colors[k];
			},
			goodsColorsPriceText: function (color, goods) {
				var price = goods.price_per_coloring * color.quantity;
				if (goods.price_per_coloring < 0 || this.is_company) {
					return '<span class="color-value">Уточним цену</span>';
				} else if (price === 0) {
					return '<span class="color-value">Бесплатно</span>';
				}
				return this.showPrice(price);
			},

			shop2unavailable: function (shop_id) {
				return this.shops_availability[shop_id].length;
			},
			shop_available_text: function (shop_id) {
				const a = this.shop2unavailable(shop_id);
				return a === 0
					? 'Все товары в наличии' + `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M2.42951 7.50777C2.7224 7.21487 3.19728 7.21487 3.49017 7.50777L6.30044 10.3324L12.5098 4.07612C12.8027 3.78322 13.2776 3.78322 13.5705 4.07612C13.8634 4.36901 13.8634 4.84388 13.5705 5.13678L6.83077 11.9234C6.53788 12.2162 6.06301 12.2162 5.77011 11.9234L2.42951 8.56843C2.13662 8.27553 2.13662 7.80066 2.42951 7.50777Z" fill="#6CCA70"/>
				  </svg>`
					: '<a>Ожидается <span style="color:#ED1C24">' + number_text(a, ['товар', 'товара', 'товаров']) + '</span> из ' + this.result.count + '</a>' + `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
							<path d="M2.62581 4.0709C3.95806 2.46768 5.92258 1.56445 8 1.56445C11.8613 1.56445 15 4.70316 15 8.56445C15 12.4257 11.8613 15.5645 8 15.5645C4.13871 15.5645 1 12.4257 1 8.56445" stroke="#6C6C6C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M5.69597 4.07097H2.625V1" stroke="#6C6C6C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M8.02344 5.56152V8.56475L12.0654 9.94217" stroke="#6C6C6C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>`;
			},
			shop_available_textMobileMain: function (shop_id) {
				const a = this.shop2unavailable(shop_id);
				return a === 0
					? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M2.42951 7.50777C2.7224 7.21487 3.19728 7.21487 3.49017 7.50777L6.30044 10.3324L12.5098 4.07612C12.8027 3.78322 13.2776 3.78322 13.5705 4.07612C13.8634 4.36901 13.8634 4.84388 13.5705 5.13678L6.83077 11.9234C6.53788 12.2162 6.06301 12.2162 5.77011 11.9234L2.42951 8.56843C2.13662 8.27553 2.13662 7.80066 2.42951 7.50777Z" fill="#6CCA70"/>
				  </svg>`
					: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
							<path d="M2.62581 4.0709C3.95806 2.46768 5.92258 1.56445 8 1.56445C11.8613 1.56445 15 4.70316 15 8.56445C15 12.4257 11.8613 15.5645 8 15.5645C4.13871 15.5645 1 12.4257 1 8.56445" stroke="#6C6C6C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M5.69597 4.07097H2.625V1" stroke="#6C6C6C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M8.02344 5.56152V8.56475L12.0654 9.94217" stroke="#6C6C6C" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>`;
			},
			shop_available_textMobileValue: function (shop_id) {
				const a = this.shop2unavailable(shop_id);
				return number_text(a, ['товар', 'товара', 'товаров']) + ' из ' + this.result.count;
			},
			_deleteUnavailable: function (redirect) {
				if (typeof redirect === 'undefined')
				{
					redirect = '/cart/?order';
				}

				const request = {
					del: [],
					no_response: 1,
				};
				for (let k in this.goods_unavailable)
				{
					request.del.push(this.goods_unavailable[k].id);
				}

				$.post(this.url_prefix + '/ajax/', request, function (response) {
					document.location = redirect;
				}, 'json');
			},
			deleteUnavailable: function (redirect) {
				const self = this;
				popups.confirm(
					'Удалить отсутствующие товары?',
					function() { self._deleteUnavailable(redirect); },
					'Удалить',
					'Отмена',
					'Удалить из корзины товары, которые отсутствуют на этой базе в полном объеме?'
				);
			},
			toggleUnavailable: function (shop) {
				if (this.shop2unavailable(shop.id) === 0)
				{
					this.tech.shop_unavailable = null;
				}
				else
				{
					this.tech.shop_unavailable = this.tech.shop_unavailable === shop ? null : shop;
				}
			},

			goodsById: function (goods_id) {
				for (let index in this.result.list_all)
				{
					const g = this.result.list_all[index];
					if (g.id === goods_id)
					{
						return g;
					}
				}

				return null;
			},
			prev: function () {
				
				this.tech.step = 0;
				jQuery("html,body").animate({scrollTop:0},"slow"); 
				window.sessionStorage.removeItem('step_to_save');
			},
			next: function () {
				// check delivery data if enabled
				if (this.tech.step === 0)
				{
					const data = this.deliveryData();
					if (!this.validateDeliveryDestination(data) || !this._validatePersonalData(data))
					{
						return;
					}
					window.sessionStorage.setItem('step_to_save', 1)
					this.tech.step = 1;
					jQuery("html,body").animate({scrollTop:0},"slow"); 
					const self = this;
					this.$nextTick(function() {
						self.checkDogovorSelect();
					});

				}
			},
			isPayType: function(pay_type) {
				return this.order.pay_type === pay_type;
			},
			togglePayType: function(pay_type) {
				this.setPayType(pay_type);
			},
			contractsLabel: function (option) {
				return '№' + option.name + ' от ' + option.start_date_ru;
			},
			companyLabel: function (option) {
				return option.type + ' ' + option.name;
			},

			_setCompany: function (company) {
				this.order.company_inn = company.inn;
				this.order.company_kpp = company.kpp;
				this.order.company_type = company.opf;
				this.order.company_name = company.name;
				this.order.company_ogrn = company.ogrn;
				this.order.company_address = company.address;
				this.tech.block_company = true;
			},
			_setCompanyBank: function (bank) {
				this.order.company_bik = bank.bik;
				this.order.company_bank = bank.name;
				this.order.company_kschet = bank.kschet;
				this.tech.block_bank = true;
			},
			_setCompanyReceiver: function (company) {
				this.order.company_receiver_inn = company.inn;
				this.order.company_receiver_kpp = company.kpp;
				this.order.company_receiver_type = company.opf;
				this.order.company_receiver_name = company.name;
				this.order.company_receiver_ogrn = company.ogrn;
				this.order.company_receiver_address = company.address;
				this.tech.block_company_receiver = true;
			},
			_setCompanyReceiverBank: function (bank) {
				this.order.company_receiver_bik = bank.bik;
				this.order.company_receiver_bank = bank.name;
				this.order.company_receiver_kschet = bank.kschet;
				this.tech.block_bank_receiver = true;
			},

			getGoodsUnavailable: function (delivery_point) {
				const result = [];

				if (delivery_point == null)
				{
					return result;
				}

				const unavailable = this.shops_availability[delivery_point.id];
				for (let i in unavailable)
				{
					const u = unavailable[i];
					const goods = this.goodsById(u.id);
					if (goods === null)
					{
						this.log('goods not found: ' + u.id);
						continue;
					}

					result.push({
						id: goods.id,
						name: goods.name,
						quantity: goods.quantity,
						available: u.available,
					});
				}

				return result;
			},
			editComment: function(event) {
				if(event.target.checked){
					if(this.order.comments.indexOf(event.target.value)==-1){
						this.order.comments += ' '+event.target.value;
						this.order.comments = this.order.comments.trim();
					}
				}else{
					if(this.order.comments.indexOf(event.target.value)!=-1){
						this.order.comments = this.order.comments.replace(event.target.value,'');
						this.order.comments = this.order.comments.trim();
					}
				}
			},
			toggleMobileBlock(element) {
				$(element).next().slideToggle();
				$(element).find('svg').toggleClass('animationFooterArrow2');
			},
			showBodyBlock(element, inputValue=''){
				// $('.shopping_cart_details_services_item_body').hide();
				// $('.shopping_cart_details_services_item_header').removeClass('shopping_cart_details_services_item_header_open');
				if($(element).hasClass('shopping_cart_details_services_item_header_open')){
					$('.shopping_cart_details_services_item_body').slideUp();
					setTimeout(function(){
						$('.shopping_cart_details_services_item_header').removeClass('shopping_cart_details_services_item_header_open')
					},400)
				} else {
					$('.shopping_cart_details_services_item_body').slideUp();
					$(element).closest('.shopping_cart_details_services_item').find('.shopping_cart_details_services_item_body').slideDown();
					if(this.order.address){
						if(inputValue=='manipulator' && this.order.delivery_type !=='courier'){
							this.order.manipulator=true;
						}
						if(inputValue=='unload' && this.order.delivery_type !=='courier'){
							this.order.unload=true;
						}
						if(inputValue=='parking' && this.order.delivery_type !=='courier'){
							this.order.parking=true;
						}
						if(inputValue=='receiver_change'){
							this.order.receiver_change=true;
						}
					}

					if(inputValue=='operator_call'){
						this.order.operator_call=true;
					}
					$(element).addClass('shopping_cart_details_services_item_header_open'); 
					setTimeout(function(){
						$('.shopping_cart_details_services_item_header').not(element).removeClass('shopping_cart_details_services_item_header_open');
					},400)

				}

				
			},
			checkboxShowBodyBlock(value, element, disabledCheckboxFlag){
				if(value){
					$('.shopping_cart_details_services_item_body').slideUp();
					setTimeout(function(){
						$('.shopping_cart_details_services_item_header').removeClass('shopping_cart_details_services_item_header_open')
					},400)
				} else {
					if(disabledCheckboxFlag){
						this.showBodyBlock(element,'')
					} else {
						$('.shopping_cart_details_services_item_body').slideUp();
						$(element).closest('.shopping_cart_details_services_item').find('.shopping_cart_details_services_item_body').slideDown();
						$(element).addClass('shopping_cart_details_services_item_header_open'); 
						setTimeout(function(){
							$('.shopping_cart_details_services_item_header').not(element).removeClass('shopping_cart_details_services_item_header_open');
						},400)
					}

				}
			},
			getPosition(e){
				var x = 0, y = 0;
				y= $(e.srcElement).closest('.shopping_cart_details_deliveryBlock_item_time_block').offset().top - $('.shopping_cart_details_deliveryBlock').offset().top  + 60;
				return {x: x, y: y}
			},
			openTimeDelivery(deliveryInfo, info_del){
				if(this.order.delivery_type==info_del){
					this.$refs.timeModal.toggle();
					var e = window.event;	
					let cords = this.getPosition(e);
					$('.deliveryTimes_block').css({
						'top':cords.y+'px'
					});
					let valueMinPeriod=0;
					if(deliveryInfo.periods){
						deliveryInfo.periods.forEach((item, index)=>{
							if(item.value<deliveryInfo.min){
								valueMinPeriod=index;
							}
						})
						this.tech.show_subLabel_time=valueMinPeriod;
					}
				}
				

			},
			getPosition2(e){
				var x = 0, y = 0;
				y= $(e.srcElement).closest('.shopping_cart_details_deliveryBlock_item_info').offset().top - $('.shopping_cart_details_deliveryBlock').offset().top + 25;
				return {x: x, y: y}
			},
			changeFullNameVal(){
				let nameArray=this.order.receiver_fullname.split(" ");
				if(nameArray[0]){
					this.order.receiver_last_name=nameArray[0];
				} else{
					this.order.receiver_last_name=''
				}
				if(nameArray[1]){
					this.order.receiver_first_name=nameArray[1];
				}else{
					this.order.receiver_first_name=''
				}
				if(nameArray.length>2){
					let lastName=''
					for(let i=2; i<nameArray.length;i++){
						lastName+=nameArray[i] + ' ';
					}
					this.order.receiver_middle_name=lastName.trim();

				}else{
					this.order.receiver_middle_name=''
				}
			},
			changeFullNameValCl(){
				let nameArray=this.order.fullname_client.split(" ");
				if(nameArray[0]){
					this.order.last_name=nameArray[0].trim();
				} else{
					this.order.last_name=''
				}
				if(nameArray[1]){
					this.order.first_name=nameArray[1].trim();
				} else {
					this.order.first_name=''
				}
				if(nameArray.length>2){
					let lastName=''
					for(let i=2; i<nameArray.length;i++){
						lastName+=nameArray[i] + ' ';
					}
					this.order.middle_name=lastName.trim();
				}
				else {
					this.order.middle_name=''
				}
			},
			blurValidateNameClient(){
				this.changeFullNameValCl();
				if(this.order.last_name.length==0){
					this.errors.fullname_client='Поле обязательно для заполнения'
				} else if(this.order.first_name.length==0){
					this.errors.fullname_client='Не заполнено имя'
				} else{
					this.errors.fullname_client='';
				}
			},
			validateLetters(){
				this.order.receiver_fullname = this.order.receiver_fullname.replace(/[^а-яё\s-]/gi, '');
				this.order.fullname_client = this.order.fullname_client.replace(/[^а-яё\s-]/gi, '');
			},
			validateLettersEnglish(){
				this.order.email = this.order.email.replace(/[^a-zA-Z0-9._%+-@]/g, '')
			},
			valChangeEmail(){
				this.errors.email='';
				if(!this.validateEmail(this.order.email) && this.order.email >0){
					this.errors.email='Неправильный формат email';
				}
			},
			valChangePhone(){
				let newPhone = this.order.phone.replace(/[^0-9]/g, '');
				this.errors.phone='';
				if(newPhone.length>1&&newPhone.length<11){
					this.errors.phone='Некорректно введен номер ';
				}else if(newPhone.length==0){
					this.errors.phone='Поле обязательно для заполнения';
				}
			},
			valChangeNameReceiver(){
				let nameReciveier = this.order.receiver_fullname;
				this.errors.receiver_fullname='';
				if(nameReciveier.length==0){
					this.errors.receiver_fullname='Поле обязательно для заполнения';
				}
			},
			valChangePhoneReceiver(){
				let newPhone = this.order.receiver_phone.replace(/[^0-9]/g, '');
				this.errors.receiver_phone='';
				if(newPhone.length>1&&newPhone.length<11){
					this.errors.receiver_phone='Некорректно введен номер ';
				}
			},
			showLogin(){
				popups.authorization.open();
			},
			phone_formatFunct(phoneItem){
				const rawPhone = phoneItem.replaceAll(/[^0-9]+/g, '');
				let formattedPhone='';
				if(rawPhone.length==11){
					formattedPhone = '+7'
						+ ' (' + rawPhone.substring(1, 4) + ') '
						+ rawPhone.substring(4, 7) + '-'
						+ rawPhone.substring(7, 9) + '-'
						+ rawPhone.substring(9, 11);
				} else {
					formattedPhone = '+7'
						+ ' (' + rawPhone.substring(0, 3) + ') '
						+ rawPhone.substring(3, 6) + '-'
						+ rawPhone.substring(6, 8) + '-'
						+ rawPhone.substring(8, 10);
				}
				
				return formattedPhone;
			},
			changeValueCompanyOGRN(){
				this.order.company_ogrn=this.order.company_ogrn.replaceAll(/[^0-9]+/g, '');
				if(this.order.company_ogrn.length<13){
					this.errors.orgnCompany='Неправильный формат ОГРН'
				} else {
					this.errors.orgnCompany='';
				}
			},
			changeValueCompanyKPP(){
				this.order.company_kpp=this.order.company_kpp.replaceAll(/[^0-9]+/g, '');
				if(this.order.company_kpp.length<9){
					this.errors.kppCompany='Неправильный формат KPP'
				} else {
					this.errors.kppCompany=''
				}
			},
			changeValueCompanyRsChet(){
				this.order.company_rschet=this.order.company_rschet.replaceAll(/[^0-9]+/g, '');
				if(this.order.company_rschet.length<20){
					this.errors.RscCompany='Неправильный формат Расчетного счета'
				} else {
					this.errors.RscCompany=''
				}
			},
			changeValueCompanyKscChet(){
				this.order.company_kschet=this.order.company_kschet.replaceAll(/[^0-9]+/g, '');
				if(this.order.company_kschet.length<20){
					this.errors.KscCompany='Неправильный формат Кор. счета'
				} else {
					this.errors.KscCompany=''
				}
			},
			changeValueCompanyOGRNRes(){
				this.order.company_receiver_ogrn=this.order.company_receiver_ogrn.replaceAll(/[^0-9]+/g, '');
				if(this.order.company_receiver_ogrn.length<13){
					this.errors.orgnCompanyRes='Неправильный формат ОГРН'
				} else {
					this.errors.orgnCompanyRes='';
				}
			},
			changeValueCompanyKPPRes(){
				this.order.company_receiver_kpp=this.order.company_receiver_kpp.replaceAll(/[^0-9]+/g, '');
				if(this.order.company_receiver_kpp.length<9){
					this.errors.kppCompanyRes='Неправильный формат KPP'
				} else {
					this.errors.kppCompanyRes=''
				}
			},
			changeValueCompanyRsChetRes(){
				this.order.company_receiver_rschet=this.order.company_receiver_rschet.replaceAll(/[^0-9]+/g, '');
				if(this.order.company_receiver_rschet.length<20){
					this.errors.RscCompanyRes='Неправильный формат Расчетного счета'
				} else {
					this.errors.RscCompanyRes=''
				}
			},
			changeValueCompanyKscChetRes(){
				this.order.company_receiver_kschet=this.order.company_receiver_kschet.replaceAll(/[^0-9]+/g, '');
				if(this.order.company_receiver_kschet.length<20){
					this.errors.KscCompanyRes='Неправильный формат Кор. счета'
				} else {
					this.errors.KscCompanyRes=''
				}
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
			copyLinkCard(linkToCopy){
				var $tmp = $("<textarea>");
				$("body").append($tmp);
				$tmp.val(linkToCopy).select();
				document.execCommand("copy");
				$tmp.remove();
				popups.alertNew('Номер карты успешно скопирована', 'Вы можете поделиться номером карты',true);
			},
			closeSubModal(){
				$('body').css('padding-right', '0px');
				$('body').css('overflow-y','scroll');
			},
			openSubModal(){
				$('body').css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
				$('body').css('overflow', 'hidden');
			},
            processDeliveryInfo() {
                if(this.deliveryTooltip[0] !== undefined) {
                    let transportObject = references.transports_list.find(obj => {
                        return obj.id === this.delivery_transport
                    })
                    let tooltipContent = "<div class='tippy-box-wrapper delivery-tippy-box-wrapper'>\
                        <div class='tippy-box-cont'>\
                            <p class='tippy-box__text'>Вам рассчитано: <b>" + transportObject.name + "</b></p>\
                        </div>\
                    </div>";
                    this.deliveryTooltip[0].setContent(tooltipContent);
                }
            },
			openSubBlockSidebar(){
				var container=$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_smallwrapper')
				var contentHeight=$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_subwrapper').outerHeight() + 16;
				var container2=$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_footer_wrap')
				var contentHeight2=$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_footer').outerHeight();
				var fullwidth=$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_subblock').width();
				var halfwidth=fullwidth/2
				if (container.height() === 0) {
					container.animate({ height: contentHeight }, 500);
					$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_button').animate({ width: fullwidth }, 500);
					$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_subblock_minheight_text').animate({ width: 0 }, 500);
					container2.animate({ height: contentHeight2 }, 500);
					$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_subblock_minheight_text').css('opacity', 0)
					setTimeout(function(){
						$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_smallwrapper').css('padding-top', '16px')
						$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_subblock_minheight').css('gap', '0px')
						$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_wrapper').css('gap', '16px')
					},250)
					this.sidebarSmall=false;
				} else {
					container.animate({ height: 0 }, 500);
					$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_button').animate({ width: halfwidth }, 500);
					$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_subblock_minheight_text').animate({ width: halfwidth }, 500);
					this.sidebarSmall=true;
					container2.animate({ height: 0 }, 500);
					setTimeout(function(){
						$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_smallwrapper').css('padding-top', '0px')
						$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_subblock_minheight').css('gap', '24px');
						$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_wrapper').css('gap', '0px');
					},250);
					setTimeout(function(){
						$('.shopping_cart_main_smallSidebar .shopping_cart_main_sidebar_subblock_minheight_text').css('opacity', 1)
					}, 750)
				}

			},
			validateFloorValue(item){
				if(this.temp_unload_list[item].floor>999){
					this.temp_unload_list[item].floor=999
				}
			},
			validateBringingValue(item){
				if(this.temp_unload_list[item].bringing>9999){
					this.temp_unload_list[item].bringing=9999;
				}
			},
			validateBringingValueMain(){
				if(this.order.bringing>9999){
					this.order.bringing=9999;
				}
			},
			checkMaxValueLift(nameInput){
				if(this.order[nameInput]>999){
					this.order[nameInput]=999
				}
			},
			clearItemValue: function (nameInput) {
				if(nameInput=='fullname_client'){
					this.order.middle_name='';
					this.order.first_name='';
					this.order.last_name='';
				}
				if(nameInput=='email'){
					if(this.is_company && !this.constants.MODE_COMPANY && this.tech.step==1){
						this.errors[nameInput]='Поле обязательно для заполнения'
					} else {
						this.errors[nameInput]=''
					}
				} else{
					this.errors[nameInput]='Поле обязательно для заполнения'
				}
				this.order[nameInput]='';
				// this.request[nameInput] = "";
				// this.errors[nameInput] = "";
			},
			changeValueCompanyName(){
				if(this.order.company_name.length==0){
					this.errors.nameCompany='Поле обязательно для заполнения'
				} else {
					this.errors.nameCompany='';
				}
			},
			changeValueCompanyNameReceiver(){
				if(this.order.company_receiver_name.length==0){
					this.errors.nameCompanyRes='Поле обязательно для заполнения'
				} else {
					this.errors.nameCompanyRes='';
				}
			},
		},
		computed: {
			
			
			require_manipulator: function() {
				for (let i in this.result.list_all)
				{
					let g = this.result.list_all[i];
					if (g.lift_limits === this.constants.LIFT_LIMIT_MANIPULATOR_ONLY)
					{
						return true;
					}
				}

				return false;
			},

			forced_warehouse: function () {
				const i = this.tech.forced_warehouse_index;
				if ((i >= 0) && (i < this.delivery_warehouses.length))
				{
					return this.delivery_warehouses[i];
				}

				return null;
			},
			delivery_warehouses: function () {
				if (!this.constants.MODE_COMPANY)
				{
					return [];
				}

				const result = [];
				const ids = this.order.delivery
					? references.warehouses_delivery
					: references.warehouses_pickup;
				for (let i = 0; i < this.tech.warehouses.length; i++)
				{
					const w = this.tech.warehouses[i];
					if (ids.includes(w.id))// && this.forced_shop.warehouses_ids.includes(w.id))
					{
						result.push(w);
					}
				}

				return result;
			},
			forced_shop: function() {
				if (this.constants.DELIVERY_PAGE)
				{
					// delivery page
					const i = this.tech.forced_shop_index;
					if ((i >= 0) && (i < this.delivery_shops.length))
					{
						return this.delivery_shops[i];
					}
				}

				if (this.forced_warehouse != null)
				{
					// order page
					for (let k in this.delivery_shops)
					{
						const s = this.delivery_shops[k];
						if (s.warehouses_ids.includes(this.forced_warehouse.id))
						{
							return s;
						}
					}
				}

				return null;
			},
			delivery_shops: function () {
				const result = [];
				
				if (!this.constants.MODE_COMPANY)
				{
					for (let i in this.shops)
					{
						const shop = this.shops[i];
						result.push(shop);
					}
					return result;
				}

				const ids = this.order.delivery
					? references.warehouses_delivery
					: references.warehouses_pickup;
				for (let i in this.shops)
				{
					const shop = this.shops[i];
					if (ids.includes(shop.warehouses_id))
					{
						result.push(shop);
					}
				}
				
				return result;
			},
			delivery_points: function() {
				if (this.constants.MODE_COMPANY)
				{
					return this.delivery_warehouses;
				}

				return this.delivery_shops;
			},
			delivery_calculation: function () {
				if (!this.constants.MODE_COMPANY)
				{
					return true;
				}

				if (this.delivery_points.length === 0)
				{
					return false;
				}

				return this.order.address;
			},

			is_company: function () {
				if (this.constants.MODE_COMPANY)
				{
					return true;
				}

				return this.order.is_company;
			},
			goods_unavailable: function () {
				if (this.constants.MODE_COMPANY)
				{
					return this.getGoodsUnavailable(this.forced_warehouse);
				}

				return this.getGoodsUnavailable(this.tech.shop_unavailable);
			},

			full_comments: function () {
				return this.order.comments;
			},

			colorsGoods() {
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
			colorsQuantity() {
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
			cutsGoods() {
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
			cutsQuantity: function () {
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
			cutsPrice: function () {
				let price = 0;

				for (let g in this.cutsGoods)
				{
					const goods = this.cutsGoods[g];
					const cuts = this.goodsCuts(goods);
					for (let i in cuts)
					{
						const cut = cuts[i];
                        let free_quantity = this.is_company ? 0 : cut.free_quantity;
						const q = Math.max(0, (cut.quantity * (cut.slices.length - 1) - free_quantity));
						price += q * goods.cut_price;
					}
				}

				if (this.is_company)
				{
					price = price_rounding(price);
				}

				return price;
			},
			cutsPriceText: function () {
				return this.cutsPrice === 0
					? 'Бесплатно'
					: this.nf_price(this.cutsPrice) + ' ₽';
			},
			parking_available: function () {
				return references.transports_types.parking_all.length > 0;
			},
			deliveryActionHeadText: function () {
				return this.actions_delivery.length > 1
					? 'доступны специальные предложения'
					: 'доступно специальное предложение';
			},

			balls_all: function () {
				const additional_price = Math.max(0, this.total_price - this.result.price);
				const additional_balls = Math.floor(additional_price / this.constants.RUB2BALLS);
				const balls_all = this.balls.all + additional_balls;

				if (!this.constants.IS_AUTH)
				{
					return balls_all;
				}

				const action = this.getActionDelivery(this.active_action_id);
				if (action == null)
				{
					return balls_all;
				}

				if (action.action_type !== this.constants.ACTION_DELIVERY_TYPE_BALLS)
				{
					return balls_all;
				}

				return balls_all + (this.delivery_price ?? 0);
			},
			active_action_id: function () {
				if (this.is_company)
				{
					return 0;
				}

				for (let i = 0; i < this.actions_delivery.length; i++)
				{
					const action = this.actions_delivery[i];
					if (this.validActionDelivery(action, this.order.delivery_type))
					{
						return action.id;
					}
				}

				return 0;
			},
			list_ordered: function () {
				return _.orderBy(this.result.list, 'index');
			},
			list_all_ordered: function () {
				return _.orderBy(this.result.list_all, 'index');
			},

			forced_transport: function () {
				return this.getTransport(this.tech.forced_transport_id);
			},
			forced_transport_unload_price: function () {
				if (!this.tech.forced_transport_id || !this.current_area)
				{
					return this.constants.MIN_UNLOAD_PRICE;
				}

				const target = this.deliveryTarget(this.tech.forced_transport_id);
				const prices = this.price_calculator.areaTransportPrices(target);
				if (!prices)
				{
					return this.constants.MIN_UNLOAD_PRICE;
				}

				return Math.max(this.constants.MIN_UNLOAD_PRICE, prices.min_unload_price);
			},
			transports_list: function () {
				return references.transports_list;
			},

			any_service_visible: function () {
				if (!this.order.delivery)
				{
					return true;
				}

				if (this.order.delivery && this.order.delivery_type !== 'courier')
				{
					return true;
				}

				return false;
			},
			unload_available: function () {
				if (!this.order.delivery)
				{
					return false;
				}
				if (this.order.delivery_type === 'courier')
				{
					return false;
				}
				if (!this.current_area)
				{
					return false;
				}

				if (!this.delivery_calculation)
				{
					return true;
				}
				const prices = this.price_calculator.areaPrices(this.deliveryTarget());
				if (prices)
				{
					if (prices.price <= 0)
					{
						return false;
					}
				}
				else
				{
					return false;
				}

				return true; //this.order.delivery_type!='express';
			},
			cut_available: function () {
				return this.order.delivery_type !== 'express';
			},

			additional_hours: function () {
				return Math.max(0, Math.ceil((this.order.distance - this.constants.DISTANCE_FREE) / 20)) * 0.5;
			},

			transports: function () {
				return {
					day: this.findAllowedTransport('day'),
					standard: this.findAllowedTransport('standard'),
					express: this.findAllowedTransport('express'),
					exact: this.findAllowedTransport('exact'),
					courier: this.findAllowedTransport('courier'),
				};
			},
			transports_valid: function () {
				const t = this.transports;
				return {
					day: t.day != null,
					standard: (this.constants.DISALLOW_MANIPULATOR && this.order.manipulator) ? false : (t.standard != null),
					express: (this.constants.DISALLOW_MANIPULATOR && this.order.manipulator) ? false : (t.express != null),
					exact: (this.constants.DISALLOW_MANIPULATOR && this.order.manipulator) ? false : (t.exact != null),
					courier: (this.tech.courier_id != null) && (t.courier != null),
				};
			},

			delivery_prices: function () {
				const transports = this.transports;

				const target = this.deliveryTarget();
				target.transport = this.getTransport(transports.day);
				target.delivery_type = 'day';
				const day = this.price_calculator.get(target);

				target.transport = this.getTransport(transports.standard);
				target.delivery_type = 'standard';
				const standard = this.price_calculator.get(target);

				target.transport = this.getTransport(transports.express);
				target.delivery_type = 'express';
				const express = this.price_calculator.get(target);

				target.transport = this.getTransport(transports.exact);
				target.delivery_type = 'exact';
				const exact = this.price_calculator.get(target);

				target.transport = this.getTransport(transports.courier);
				target.delivery_type = 'courier';
				const courier = this.price_calculator.get(target);

				const result = {
					day: day,
					standard: standard,
					express: express,
					exact: exact,
					courier: courier,
				};
				if (this.is_company)
				{
					for (let type in result)
					{
						if (result[type].price > 0)
						{
							result[type].price = price_rounding(result[type].price);
						}

						if (result[type].action > 0)
						{
							result[type].action = price_rounding(result[type].action);
						}
					}
				}

				for (let i in this.actions_delivery)
				{
					const action = this.actions_delivery[i];
					for (let type in result)
					{
						if (this.validActionDelivery(action, type) && (action.action_type !== this.constants.ACTION_DELIVERY_TYPE_BALLS))
						{
							result[type].action = 0;
							result[type].error = '';
							result[type].price = 0;
						}
					}
				}

				return result;
			},

			delivery_type_label: function () {
				for (let i in this.constants.deliveries)
				{
					const d = this.constants.deliveries[i];
					if (d.id === this.order.delivery_type)
					{
						return d.name;
					}
				}
				return '';
			},
			delivery_time: function () {
				const time = this.tech.time[this.order.delivery_type];
				return time.format(time.value, time.step);
			},
			delivery_value: function () {
				const time = this.tech.time[this.order.delivery_type];
				return time.value;
			},
			delivery_price: function () {
				return this.delivery_prices[this.order.delivery_type].price;
			},
			delivery_transport: function () {
				return this.transports[this.order.delivery_type];
			},
			delivery_price_full: function () {
				let result = this.delivery_price;
				if (result == null)
				{
					return null;
				}
				if (this.order.delivery && this.order.unload)
				{
					result += this.order.unload_price;
				}

				return result;
			},

			current_area: function () {
				if (!this.order.address_coords)
				{
					return null;
				}
				for (let i in references.areas)
				{
					const area = references.areas[i];

					if (area['geo'] && area.geo.geometry.contains(this.order.address_coords))
					{
						return area;
					}
				}
				return null;
			},
			current_shop: function () {
				if (this.forced_shop != null)
				{
					return this.forced_shop;
				}

				if (this.order.shop_id in this.shops)
				{
					return this.shops[this.order.shop_id];
				}

				return null;
			},

			delivery_price_approx: function () {
				if (this.delivery_price == null)
				{
					return false;
				}

				return this.order.parking && (references.transports_types.parking_real.indexOf(this.delivery_transport) === -1);
			},
			transport_type: function () {
				if (this.order.parking && (references.transports_types.parking_all.length > 0))
				{
					return 'parking';
				}
				if (this.order.manipulator)
				{
					return 'manipulator';
				}

				return 'default';
			},
			colorsPrice()
			{
				var price = 0;
				for (let index in this.colors)
				{
					if( this.colorsGoods[index].price_per_coloring < 0 || this.is_company) {
						price = 0;
						break;
					}
					for (let indexItem in this.colors[index]) {
						price += this.colorsGoods[index].price_per_coloring * this.colors[index][indexItem].quantity
					}
				}
				return price;
			},
			total_price_base: function () {
				let price = this.result.price;
				if (this.order.delivery)
				{
					const dp = this.actionDeliveryPrice();
					price += dp != null ? dp : 0;
					if (this.order.unload)
					{
						price += this.order.unload_price;
					}
				}

				price += this.cutsPrice;
				price += this.colorsPrice;
				return price;
			},
			colorsPriceText()
			{
				var price = 0;
				for (let index in this.colors)
				{
					if( this.colorsGoods[index].price_per_coloring < 0 ) {
						price = -1;
						break;
					}
					for (let indexItem in this.colors[index]) {
						price += this.colorsGoods[index].price_per_coloring * this.colors[index][indexItem].quantity
					}
				}
				if (price < 0||this.is_company ) {
					return '<span class="color-value">Уточним цену</span>';
				}
				return this.showPrice(price);
			},
			total_price: function () {
				let price = this.total_price_base;
				if (this.order.pay_balls)
				{
					price -= this.order.balls;
				}

				return price;
			},
			filteredList() {
				const lower = this.filter.toLowerCase();
				if (lower.length === 0)
				{
					return this.address_list;
				}

				const result = [];
				for (let i = 0; i < this.address_list.length; i++)
				{
					const address = this.address_list[i].address.toLowerCase();
					if (address.indexOf(lower) !== -1)
					{
						result.push(this.address_list[i]);
					}
				}

				return result;
			},
			url_prefix() {
				if (typeof MOBIL === 'undefined')
				{
					return '';
				}

				return MOBIL;
			},

		},
		components: {
			vueSlider: window['vue-slider-component'],
		},
	});

	app.setPayType(app.order.pay_type);
	if (!app.order.delivery)
	{
		app.setShop(app.order.shop_id);
	}

	cart.callbacks.push(function (response) {
		app.result = response.result;
		app.balls = response.balls;
	});

	map.app = app;

	return app;
}
