window['_YandexMap_cache'] = {};

class YandexMap
{
	constructor(config, data_references, page, mobile=false)
	{
		if (typeof page === 'undefined')
		{
			page = 'order';
		}

		/**
		 * @type {object}
		 */
		this.config = config;

		/**
		 * @type {object}
		 */
		this.data_references = data_references;

		/**
		 *
		 * @type {string}
		 */
		this.page = page;

		this.app = null;
		this.map = null;
		this.mobile = mobile;
		/**
		 *
		 * @type {HTMLElement}
		 */
		this.map_element = null;

		this.action_areas = null;

		this.temp_route = null;
		this.route = null;

		this.placemark = null;
		this.balloon = null;
		this.balloon_content = null;

		this.shops_clusterer = null;
		if (this.page === 'shops')
		{
			this.ballon_template = '<div class="shop__map__popover map__popover modal testClass">\n' +
				'	<a class="map__popover__close close" href="#" role="button">\n' +
				'		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">\n' +
						'<path d="M3 3L13 13M13 3L3 13" stroke="#6C6C6C" stroke-width="1.5" stroke-linecap="round"/>\n' +
						'</svg>\n' +
				'	</a>' +
				'	<div class="map__popover__content text">\n' +
				'   	$[[options.contentLayout observeSize minWidth=320 minHeight=10 maxWidth=650 maxHeight=350]]' +
				'	</div>\n' +
				'</div>';
		}
		else
		{
			this.ballon_template = '<div class="modal">\n' +
				'	<img src="/img/shopping_cart_details/close_map_modal.svg" class="close" alt="Закрыть">\n' +
				'   <div class="text">\n' +
				'   	$[[options.contentLayout observeSize minWidth=312 minHeight=10 maxWidth=322 maxHeight=350]]' +
				'	</div>\n' +
				'</div>';
		}
		this.ballon_top = -20;
		if (this.page === 'shops')
		{
			this.arrow_rate = 2;
			this.ballon_left = 20;
		}
		else if (this.page === 'delivery')
		{
			this.arrow_rate = 3.8;
			this.ballon_left = 0;
		}
		else
		{
			this.arrow_rate = 1.4;
			this.ballon_left = 0;
		}

		this.key = '_map_' + random_string(20);

		window[this.key] = this;
	}

	/**
	 *
	 * @param {string} type
	 * @param {string} key
	 * @param {*?} value
	 * @returns {*}
	 * @private
	 */
	_cache(type, key, value)
	{
		if (!window._YandexMap_cache[type])
		{
			window._YandexMap_cache[type] = {};
		}

		const cache = window._YandexMap_cache[type];

		// get value from cache
		if (typeof value === 'undefined')
		{
			return cache[key];
		}
		// set value
		else
		{
			cache[key] = value;

			return value;
		}
	}

	/**
	 *
	 * @param {string} address
	 * @param {boolean} bounded
	 * @returns {Promise<Number[]>}
	 */
	address2coords(address, bounded)
	{
		const self = this;
		const coords = this._cache('address', address);
		if (coords)
		{
			return new Promise((resolve) => {
				resolve(coords);
			});
		}

		const config = bounded
			? {results: 1, boundedBy: this.map.getBounds()}
			: {results: 1};

		return ymaps.geocode('Россия, ' + address, config).then(function (response) {
			let coords = null;
			if (response.geoObjects.getLength() > 0)
			{
				const firstGeoObject = response.geoObjects.get(0);
				coords = firstGeoObject.geometry.getCoordinates();
			}

			self._cache('address', address, coords);

			return coords;
		});
	}

	/**
	 *
	 * @param {Number[]} coords
	 * @returns {Promise<string>}
	 */
	coords2address(coords)
	{
		const self = this;
		const address = this._cache('coords', JSON.stringify(coords));
		if (address)
		{
			return new Promise((resolve) => {
				resolve(address);
			});
		}

		return ymaps.geocode(coords, {results: 1}).then(function (response) {
			let address = null;
			if (response.geoObjects.getLength() > 0)
			{
				const first = response.geoObjects.get(0);
				address = first.properties.get('text').replace('Россия, ', '');
			}

			self._cache('coords', JSON.stringify(coords), address);

			return address;
		});
	}

	/**
	 *
	 * @returns {boolean}
	 */
	created()
	{
		return this.map !== null;
	}

	/**
	 *
	 * @param {Number[]} coords
	 * @param {Number?} zoom
	 * @param {Number?} padding
	 */
	async setCenter(coords, zoom, padding)
	{
		if (typeof zoom === 'undefined')
		{
			zoom = this.map.getZoom();
		}
		if (typeof padding === 'undefined')
		{
			padding = 0;
		}

		await this.map.setCenter(coords, zoom);

		if (padding)
		{
			const center = this.map.getGlobalPixelCenter();
			center[1] -= padding;
			this.map.setGlobalPixelCenter(center);
		}
	}

	/**
	 *
	 * @param {string} address
	 * @param {Number?} zoom
	 */
	setCenterByAddress(address, zoom)
	{
		if (address === '')
		{
			return;
		}

		if (typeof zoom === "undefined")
		{
			zoom = this.map.getZoom();
		}

		const self = this;
		this.address2coords(address).then(function (coords) {
			if (!coords)
			{
				return;
			}

			self.map.setCenter(coords, zoom);
			self._setPlacemark(coords);
		});
	}

	reset()
	{
		this.resetRoute();
		this.map.setCenter(this.config.center);
		this.map.setZoom(this.config.zoom);
	}

	resetRoute()
	{
		if (this.route != null)
		{
			this.map.geoObjects.remove(this.route);
			//this.route = null;
		}

		if (this.placemark != null)
		{
			this.map.geoObjects.remove(this.placemark);

			if (this.placemark.balloon.isOpen())
			{
				this.placemark.balloon.close();
			}
		}
	}

	setRoute()
	{
		this.resetRoute();

		if (this.temp_route !== null)
		{
			this.route = this.temp_route;
			this.route.getPaths().options.set({strokeColor: '094286ff', strokeWidth: 3, opacity: 0.9});
			this.map.geoObjects.add(this.route);

			//this.temp_route = null;
		}
	}

	/**
	 *
	 * @param {Number[]} coords
	 * @private
	 */
	_setPlacemark(coords)
	{
		if (this.placemark === null)
		{
			this.placemark = new ymaps.Placemark(coords, {}, {
				balloonShadow: false,
				balloonLayout: this.balloon,
				balloonContentLayout: this.balloon_content,
				balloonPanelMaxMapArea: 0,

				hideIconOnBalloonOpen: false,
				iconLayout: 'default#image',
				iconImageHref: '/img/!old/cart_end_placemark.png',
				iconImageSize: [30, 30],
				iconImageOffset: [-Math.ceil(42 / 2), -Math.ceil(42 / 2)]
			});
		}
		else
		{
			this.map.geoObjects.remove(this.placemark);
			this.placemark.geometry.setCoordinates(coords);
		}

		this.map.geoObjects.add(this.placemark);
	}

	/***
	 *
	 * @param {Number[]} coords
	 * @param {String} content
	 * @param {boolean} calculated
	 */
	showPlacemark(coords, content, calculated)
	{
		this._setPlacemark(coords);

		const icon = calculated
			? '/img/!old/cart_end_placemark.png'
			: '/img/cart_end_placemark_empty.svg';
		this.placemark.options.set('iconImageHref', icon);
		this.placemark.properties.set('balloonContent', content);
		this.placemark.balloon.open();
	}

	refreshPlacemark()
	{
		if (this.placemark.balloon.isOpen())
		{
			this.placemark.balloon.close();
			this.placemark.balloon.open();
		}
	}

	getBounds()
	{
		return this.map.getBounds();
	}

	/**
	 *
	 * @param {Number[]} area_ids
	 */
	setBounds(area_ids)
	{
		if (this.map == null)
		{
			return;
		}

		if (this.action_areas === null)
		{
			this.action_areas = new ymaps.GeoObjectCollection({});
			this.map.geoObjects.add(this.action_areas);
		}

		const action_areas = this.action_areas;
		const areas = [];
		for (let i in this.data_references.areas)
		{
			const area = this.data_references.areas[i];

			if ((area['geo']) && (area_ids.indexOf(area.id) !== -1))
			{
				action_areas.add(area.geo);
				areas.push(area.geo);
			}
		}

		if (action_areas.getLength() > 0)
		{
			this.map.setBounds(action_areas.getBounds(), {zoomMargin: [0, 0, 0, 0]});
			action_areas.removeAll();

			for (let i in areas)
			{
				this.map.geoObjects.add(areas[i]);
			}
		}
	}

	/**
	 *
	 * @param {object} e
	 * @private
	 */
	_processClick(e)
	{
		const coords = e.get('coords');
		this.app.setCoords(coords);
	}


	/**
	 *
	 * @param {HTMLElement} element
	 */
	create(element)
	{
		if (this.map != null)
		{
			return;
		}

		this.map_element = element;
		this.map = new ymaps.Map(element, {
			center: this.config.center,
			zoom: this.config.zoom,
			type: 'yandex#map',
			controls: []
		}, {
			searchControlProvider: 'yandex#search'
		});

		//this.map.behaviors.disable('scrollZoom');
		this.map.behaviors.enable('drag');

		const self = this;
		this.map.events.add('click', function ($e) {
			self._processClick($e);
		});

		new ymaps.Clusterer({
			preset: 'islands#invertedVioletClusterIcons',
			groupByCoordinates: false,
			clusterDisableClickZoom: true,
			clusterHideIconOnBalloonOpen: false,
			geoObjectHideIconOnBalloonOpen: false
		});
		
		this._addFullscreenControl();
		this._addZoomControl();
		this._createBalloon();
		this._initShops(this.app.delivery_shops);
		this._initAreas();
		this.updateAreas();

		$(window).on('resize', function () {
			self.map_element.style.display = 'none';
			self.map.container.fitToViewport();
			self.map_element.style.display = 'block';
			self.map.container.fitToViewport();
		})
	}

	_fullsreenToggle()
	{
		const $e = $(this.map_element);

		if ($e.hasClass('map-fullscreen'))
		{
			this._fullsreeenOff($e);
		}
		else
		{
			this._fullsreeenOn($e);
		}

		this.map.container.fitToViewport();
	}

	/**
	 *
	 * @param {object} $e
	 * @private
	 */
	_fullsreeenOn($e)
	{
		$e.addClass('map-fullscreen');

		$('.js-fixed-header').addClass('header_fixed');
		if($('.js-fixed-header').hasClass('js-header-scroll') && !$('.js-fixed-header').hasClass('header--scroll')){
			$('.header').addClass('header--scroll');
			$('.header').addClass('header--fullscrean');
		}
		$('.js-header-hide').hide()
		$('body').css('overflow-y', 'hidden')


		/* DELIVERY ACTIONS MAP == FULLSCREEN */
		if ($e.closest('.modal').hasClass('showMap_modal'))
		{
			$e.closest('.showMap_modal').addClass('showMap__wrapper');
			$('html, body').css('overflow', 'hidden');
		}
	}

	/**
	 *
	 * @param {object} $e
	 * @private
	 */
	_fullsreeenOff($e)
	{

		$e.removeClass('map-fullscreen');
		$('.js-header-hide').show()
		$('.js-fixed-header').removeClass('header_fixed');
		$('body').css('overflow-y', 'auto')
		if($('.js-fixed-header').hasClass('js-header-scroll') && $('.js-fixed-header').hasClass('header--fullscrean')){
			$('.header').removeClass('header--scroll');
			$('.header').removeClass('header--fullscrean');
		}
		/* DELIVERY ACTIONS MAP == FULLSCREEN */
		if ($e.closest('.modal').hasClass('showMap_modal'))
		{
			$e.closest('.showMap_modal').removeClass('showMap__wrapper');
			$('html, body').css('overflow', 'auto');
		}
	}

	/**
	 *
	 * @private
	 */
	_addFullscreenControl()
	{
		const self = this;
		const buttonLayout = ymaps.templateLayoutFactory.createClass('<div class="map-buttons"><div id="map-fullscreen"></div></div>', {
			build: function () {
				buttonLayout.superclass.build.call(this);
				this.fullscreenCallback = ymaps.util.bind(this.fullscreen, this);
				window.$('#map-fullscreen').on('click', this.fullscreenCallback);
			},
			clear: function () {
				window.$('#map-fullscreen').off('click', this.fullscreenCallback);
				buttonLayout.superclass.clear.call(this);
			},
			fullscreen: function () {
				self._fullsreenToggle();
			}
		});

		const buttonControl = new ymaps.control.ZoomControl({
			options: {
				float: 'none',
				position: {
					top: 0,
					right: 0,
					left: 0
				},
				layout: buttonLayout
			}
		});

		this.map.controls.add(buttonControl);
	}

	/**
	 *
	 * @private
	 */
	_addZoomControl()
	{
		const ZoomLayout = ymaps.templateLayoutFactory.createClass('<div class="zoom-container">' +
			'<span class="btn btn-outline-revers-primary zoom-in" id="zoom-in"></span>' +
			'<span class="btn btn-outline-revers-primary zoom-out" id="zoom-out"></span>' +
			'</div>', {
			build: function () {
				ZoomLayout.superclass.build.call(this);

				this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
				this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

				$(this._parentElement).on('click', '.zoom-in', this.zoomInCallback);
				$(this._parentElement).on('click', '.zoom-out', this.zoomOutCallback);
			},

			clear: function () {
				$(this._parentElement).unbind('click', '.zoom-in', this.zoomInCallback);
				$(this._parentElement).unbind('click', '.zoom-out', this.zoomOutCallback);

				ZoomLayout.superclass.clear.call(this);
			},

			zoomIn: function () {
				const map = this.getData().control.getMap();
				this.events.fire('zoomchange', {
					oldZoom: map.getZoom(),
					newZoom: map.getZoom() + 1
				});

				map.behaviors.enable('drag');
			},

			zoomOut: function () {
				const map = this.getData().control.getMap();
				this.events.fire('zoomchange', {
					oldZoom: map.getZoom(),
					newZoom: map.getZoom() - 1
				});

				map.behaviors.enable('drag');
			}
		});

		const zoomControl = new ymaps.control.ZoomControl({
			options: {
				float: 'none',
				position: {right: 0, left: 0},
				layout: ZoomLayout
			}
		});
		this.map.controls.add(zoomControl);
	}

	/**
	 *
	 * @private
	 */
	_createBalloon()
	{
		const self = this;
		this.balloon = ymaps.templateLayoutFactory.createClass(
			this.ballon_template,
			{
				build: function () {
					this.constructor.superclass.build.call(this);
					this._$element = $('.modal', this.getParentElement());
					if (this._$element.length == 0)
					{
						this._$element = $('.popover', this.getParentElement());
					}

					this.applyElementOffset();
					this._$element.find('.close')
						.on('click', $.proxy(this.onCloseClick, this));
				},
				clear: function () {
					this._$element.find('.close').off('click');
					this.constructor.superclass.clear.call(this);
				},
				onSublayoutSizeChange: function () {
					self.balloon.superclass.onSublayoutSizeChange.apply(this, arguments);
					if (!this._isElement(this._$element))
					{
						return;
					}
					this.applyElementOffset();
					this.events.fire('shapechange');
				},
				applyElementOffset: function () {
					let left = -(this._$element[0].offsetWidth / self.arrow_rate) + self.ballon_left;
					let top = -(this._$element[0].offsetHeight) + self.ballon_top;
					if (self.page === 'shops'){
						top=Math.abs(self.ballon_top);
					}
					this._$element.css({
						left: left,
						top: top
					});
				},
				onCloseClick: function (e) {
					e.preventDefault();

					this.events.fire('userclose');
				},
				getShape: function () {
					if (!this._isElement(this._$element))
					{
						return self.balloon.superclass.getShape.call(this);
					}

					const position = this._$element.position();
					return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
							[position.left, position.top], [
								position.left + this._$element[0].offsetWidth,
								position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
							]
						]
					));
				},
				_isElement: function (element) {
					return element && element[0] && element.find('.arrow')[0];
				}
			}
		);

		self.balloon_content = ymaps.templateLayoutFactory.createClass(
			'$[properties.balloonContent]'
		);
	}

	/**
	 *
	 * @param {object[]} shops
	 * @returns {object[]}
	 * @private
	 */
	_uniqueShops(shops)
	{
		const keys = [];
		const result = [];

		for (let i in shops)
		{
			const shop = shops[i];
			const key = '' + shop.latitude + 'x' + shop.longitude;
			if (!keys.includes(key))
			{
				result.push(shop);
				keys.push(key);
			}
		}

		return result;
	}

	/**
	 *
	 * @param {object[]} shops
	 * @private
	 */
	_initShops(shops)
	{
		shops = this._uniqueShops(shops);
		const placemarks = [];

		const self = this;
		for (let k in shops)
		{
			const shop = shops[k];
			const image = get_placemark_image(shop);

			const placemark = new ymaps.Placemark([shop.latitude, shop.longitude], {
				name: shop.id,
				balloonContentHeader: '',
				balloonContent: this._shop2text(shop),
				hintContent: shop.name
			}, {
				balloonLayout: this.balloon,
				balloonContentLayout: this.balloon_content,
				balloonShadow: false,
				balloonPanelMaxMapArea: 0,
				hideIconOnBalloonOpen: false,
				//preset: 'islands#nightDotIcon'
				iconLayout: 'default#image',
				iconImageHref: image.src,
				iconImageSize: [image.width, image.height],
				iconImageOffset: [-Math.ceil(image.width / 2), -Math.ceil(image.height / 2)]
			});

			placemark.events.add('click', async function (e) {
				const target = e.get('target');

				if ('order' in self.app)
				{
					
						self.app.order.shop_id = parseInt(target.properties.get('name'));
						await self.setCenter(target.geometry.getBounds()[0], 15);
						const center = self.map.getGlobalPixelCenter();
						center[1] -= 160;
						self.map.setGlobalPixelCenter(center);
						
					
					
				}
				else
				{
					await self.setCenter(target.geometry.getBounds()[0], 15);
					const center = self.map.getGlobalPixelCenter();
					center[1] -= 100;
					if (self.page === 'shops'){
						center[1] += 280;
					}
					self.map.setGlobalPixelCenter(center);
				}
			});

			placemarks.push(placemark);
		}

		if (this.shops_clusterer != null)
		{
			this.shops_clusterer.removeAll();
		}
		else
		{
			this.shops_clusterer = new ymaps.Clusterer({
				clusterIcons: [{
					href: '/img/svg/map/cluster.svg',
					size: [30, 30],
					offset: [-21, -21]
				}],

				zoomMargin: 200,
				clusterDisableClickZoom: false,
				clusterHideIconOnBalloonOpen: false,
				geoObjectHideIconOnBalloonOpen: false
			});

			this.map.geoObjects.add(this.shops_clusterer);
		}

		this.shops_clusterer.add(placemarks);
	}

	/**
	 *
	 * @param {object} shop
	 * @returns {string}
	 * @private
	 */
	_shop2text(shop)
	{
		let content = '';
		function formatPhone(schedule) {
				const res2 =  schedule.replaceAll(/(\b[0-9\-() ]{11,}\b)(?=\s*\(|\b)/g, function (match) {
					const rawPhone = match.replaceAll(/[^0-9]+/g, '');
					const linkPhone = '+7' + rawPhone.substring(1);
					const formattedPhone = rawPhone.substring(0, 1)
						+ ' (' + rawPhone.substring(1, 4) + ') '
						+ rawPhone.substring(4, 7) + '-'
						+ rawPhone.substring(7, 9) + '-'
						+ rawPhone.substring(9, 11);
				
					return `<a href="tel:${linkPhone}">${formattedPhone}</a>`;
				});
				return res2;
		}
		if (this.page === 'shops')
		{
			function formatPhone(schedule) {
				const res2 =  schedule.replaceAll(/(\b[0-9\-() ]{11,}\b)(?=\s*\(|\b)/g, function (match) {
					const rawPhone = match.replaceAll(/[^0-9]+/g, '');
					const linkPhone = '+7' + rawPhone.substring(1);
					const formattedPhone = rawPhone.substring(0, 1)
						+ ' (' + rawPhone.substring(1, 4) + ') '
						+ rawPhone.substring(4, 7) + '-'
						+ rawPhone.substring(7, 9) + '-'
						+ rawPhone.substring(9, 11);
				
					return `<a href="tel:${linkPhone}">${formattedPhone}</a>`;
				});
				return res2;
			}
			content += 	'<div class="shop__map__popover__body">' +
				'	<img class="shop__map__popover__baner" src="' + shop.photo + '" alt="' + shop.name + '" title="' + shop.name + '">\n' +
				'	<div class="popover-description">\n' + 
				'<div class="popover-title popover_description-title">' + shop.short_address + '</div>';

			let src_icon;
			const shop_types = shop.shop_type.split(',');
			content +='<div class="popover_shop_type">';
			for(let idx in shop_types){
				let typeVal = +shop_types[idx];
				switch(typeVal){
					case 1: src_icon = '/img/svg/map/icon_shop.svg'; break;
					case 2: src_icon = '/img/svg/map/icon_store.svg'; break;
					case 3: src_icon = '/img/svg/map/icon_office.svg'; break;
					case 4: src_icon = '/img/svg/map/icon_sale_office.svg'; break;
					default: src_icon = '/img/svg/map/icon_shop.svg'; typeVal=1;
				}
				content += '<div class="popover_shop_type_item"><img src="'+src_icon+'" alt="shop_type_icon" width="24" height="24"/> ' + this.config.shop_types[typeVal] + '</div>';
			}
			content +='</div>';
			if (shop.phone1 || shop.phone2)
			{
				content += `<div class="popover-line popover-phone"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  								<path d="M9.37472 4.26718C9.95663 4.3805 10.4914 4.66455 10.9106 5.08298C11.3299 5.5014 11.6145 6.03517 11.728 6.61596M9.37472 1.88867C10.5837 2.02272 11.7111 2.56308 12.5718 3.42103C13.4324 4.27898 13.9752 5.40352 14.1111 6.61002M13.5153 11.3552V13.139C13.516 13.3046 13.482 13.4686 13.4155 13.6203C13.349 13.772 13.2516 13.9082 13.1293 14.0202C13.007 14.1321 12.8627 14.2174 12.7055 14.2704C12.5483 14.3235 12.3818 14.3432 12.2165 14.3283C10.3833 14.1295 8.62227 13.5042 7.07507 12.5028C5.63559 11.5898 4.41517 10.3717 3.50047 8.93502C2.49361 7.38375 1.86702 5.61758 1.67146 3.77959C1.65657 3.61515 1.67615 3.44943 1.72895 3.29296C1.78175 3.13649 1.86662 2.99271 1.97814 2.87077C2.08967 2.74883 2.22541 2.65141 2.37672 2.5847C2.52804 2.51799 2.69162 2.48346 2.85704 2.4833H4.64434C4.93347 2.48046 5.21377 2.58265 5.43299 2.77082C5.65221 2.95899 5.7954 3.22031 5.83587 3.50606C5.91131 4.07694 6.05121 4.63748 6.25291 5.17697C6.33306 5.3898 6.35041 5.6211 6.3029 5.84347C6.25538 6.06584 6.14499 6.26996 5.98481 6.43163L5.22819 7.18681C6.0763 8.67549 7.31126 9.90809 8.80279 10.7546L9.55941 9.9994C9.7214 9.83953 9.9259 9.72935 10.1487 9.68192C10.3715 9.6345 10.6032 9.65181 10.8165 9.73182C11.357 9.93313 11.9186 10.0728 12.4906 10.1481C12.78 10.1888 13.0443 10.3343 13.2332 10.5569C13.4222 10.7794 13.5226 11.0635 13.5153 11.3552Z" stroke="#D3D3D3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
							</svg><div class="popover-line-title">`;
				if (shop.phone1)
				{
					content +=formatPhone(shop.phone1);
				}
				if (shop.phone2)
				{
					if(shop.phone1) content += '<br/>'
					content +=formatPhone(shop.phone2) ;
				}
				content += `</div></div>`;
			}
			
				content += `<div class="popover-line popover-metro"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M8.07333 13.2287L11.3 8.94348C11.8355 8.23228 12.125 7.36726 12.125 6.47826C12.125 4.20909 10.2782 2.36957 8 2.36957C5.72183 2.36957 3.875 4.20909 3.875 6.47826C3.875 7.36726 4.16448 8.23228 4.7 8.94348L7.92667 13.2287C7.95247 13.263 7.97684 13.2953 8 13.326C8.02316 13.2953 8.04753 13.263 8.07333 13.2287ZM8 1C4.96243 1 2.5 3.4527 2.5 6.47826C2.5 7.66359 2.88598 8.81695 3.6 9.76522L6.82667 14.0504C7.22472 14.5791 7.42374 14.8434 7.66774 14.9379C7.88145 15.0207 8.11855 15.0207 8.33227 14.9379C8.57626 14.8434 8.77528 14.5791 9.17333 14.0504L12.4 9.76522C13.114 8.81695 13.5 7.66359 13.5 6.47826C13.5 3.4527 11.0376 1 8 1Z" fill="#D3D3D3"/>
						<circle cx="8" cy="6" r="2" fill="#D3D3D3"/>
						</svg><div class="popover-line-title">N (`  + shop.longitude + '), E (' + shop.latitude + ')</div></div> ';
			

			if (shop.metro_all)
			{
				content += `<div class="popover-line popover-metro"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<rect width="16" height="16" fill="white"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8ZM15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM6.04311 4.5H5.32201H4.5H4V11.5H5.56238V9.50961L5.39439 6.00856L7.4644 9.5H8.53037L10.6001 6.01524L10.4324 9.50961V11.5H12V4.5H11.5H11.3364H10.6728H9.95167L7.99739 7.63942L6.04311 4.5Z" fill="#D3D3D3"/>
				  </svg><div class="popover-line-title">` + shop.metro_all + '</div></div> ';
			}
			if (shop.business_hours)
				{
					function formatSchedule(schedule) {
						const days = schedule.split('<br>');
						let formattedSchedule = '';
						
						for (const day of days) {
							const [dayOfWeek, time] = day.split(': ');
							formattedSchedule += `<div><b>${dayOfWeek}:</b> ${time}</div>`;
						}
					
						return formattedSchedule;
					}
	
					content += `<div class="popover-line popover-time"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M10.2 3.5H5.8C4.93517 3.5 4.37676 3.50117 3.95175 3.53589C3.54426 3.56918 3.39318 3.6257 3.31901 3.66349C3.03677 3.8073 2.8073 4.03677 2.66349 4.31901C2.6257 4.39318 2.56918 4.54426 2.53589 4.95175C2.50117 5.37676 2.5 5.93517 2.5 6.8V9.2C2.5 11.0648 2.50117 11.6232 2.53589 12.0482C2.56918 12.4557 2.6257 12.6068 2.66349 12.681C2.8073 12.9632 3.03677 13.1927 3.31901 13.3365C3.39318 13.3743 3.54426 13.4308 3.95175 13.4641C4.37676 13.4988 4.93517 13.5 5.8 13.5H10.2C11.0648 13.5 11.6232 13.4988 12.0482 13.4641C12.4557 13.4308 12.6068 13.3743 12.681 13.3365C12.9632 13.1927 13.1927 12.9632 13.3365 12.681C13.3743 12.6068 13.4308 12.4557 13.4641 12.0482C13.4988 11.6232 13.5 11.0648 13.5 9.2V6.8C13.5 5.93517 13.4988 5.37676 13.4641 4.95175C13.4308 4.54426 13.3743 4.39318 13.3365 4.31901C13.1927 4.03677 12.9632 3.8073 12.681 3.66349C12.6068 3.6257 12.4557 3.56918 12.0482 3.53589C11.6232 3.50117 11.0648 3.5 10.2 3.5ZM1.32698 3.63803C1 4.27976 1 5.11984 1 6.8V9.2C1 11.8802 1 12.7202 1.32698 13.362C1.6146 13.9265 2.07354 14.3854 2.63803 14.673C3.27976 15 4.11984 15 5.8 15H10.2C11.8802 15 12.7202 15 13.362 14.673C13.9265 14.3854 14.3854 13.9265 14.673 13.362C15 12.7202 15 11.8802 15 9.2V6.8C15 5.11984 15 4.27976 14.673 3.63803C14.3854 3.07354 13.9265 2.6146 13.362 2.32698C12.7202 2 11.8802 2 10.2 2H5.8C4.11984 2 3.27976 2 2.63803 2.32698C2.07354 2.6146 1.6146 3.07354 1.32698 3.63803Z" fill="#D3D3D3"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 0.75C5.91421 0.75 6.25 1.08579 6.25 1.5V4C6.25 4.41421 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 4.41421 4.75 4V1.5C4.75 1.08579 5.08579 0.75 5.5 0.75Z" fill="#D3D3D3"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 7.5C1.25 7.08579 1.58579 6.75 2 6.75H14C14.4142 6.75 14.75 7.08579 14.75 7.5C14.75 7.91421 14.4142 8.25 14 8.25H2C1.58579 8.25 1.25 7.91421 1.25 7.5Z" fill="#D3D3D3"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 0.75C10.9142 0.75 11.25 1.08579 11.25 1.5V4C11.25 4.41421 10.9142 4.75 10.5 4.75C10.0858 4.75 9.75 4.41421 9.75 4V1.5C9.75 1.08579 10.0858 0.75 10.5 0.75Z" fill="#D3D3D3"/>
				  </svg><div class="popover-line-title">` + formatSchedule(shop.business_hours) + '</div></div>';
				}
			content += '	</div>\n' +
				'</div>\n';
		}
		else
		{
			content += '<div class="popover-description"><div class="popover-title popover_description-title">' + shop.name + '</div>';
			content += `<div class="popover-line popover-address"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M8.07333 13.2287L11.3 8.94348C11.8355 8.23228 12.125 7.36726 12.125 6.47826C12.125 4.20909 10.2782 2.36957 8 2.36957C5.72183 2.36957 3.875 4.20909 3.875 6.47826C3.875 7.36726 4.16448 8.23228 4.7 8.94348L7.92667 13.2287C7.95247 13.263 7.97684 13.2953 8 13.326C8.02316 13.2953 8.04753 13.263 8.07333 13.2287ZM8 1C4.96243 1 2.5 3.4527 2.5 6.47826C2.5 7.66359 2.88598 8.81695 3.6 9.76522L6.82667 14.0504C7.22472 14.5791 7.42374 14.8434 7.66774 14.9379C7.88145 15.0207 8.11855 15.0207 8.33227 14.9379C8.57626 14.8434 8.77528 14.5791 9.17333 14.0504L12.4 9.76522C13.114 8.81695 13.5 7.66359 13.5 6.47826C13.5 3.4527 11.0376 1 8 1Z" fill="#D3D3D3"/>
			<circle cx="8" cy="6" r="2" fill="#D3D3D3"/>
		  </svg><div class="popover-line-title">` + shop.address + '</div></div>';
			if (shop.phone)
			{
				content += `<div class="popover-line popover-phone"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  								<path d="M9.37472 4.26718C9.95663 4.3805 10.4914 4.66455 10.9106 5.08298C11.3299 5.5014 11.6145 6.03517 11.728 6.61596M9.37472 1.88867C10.5837 2.02272 11.7111 2.56308 12.5718 3.42103C13.4324 4.27898 13.9752 5.40352 14.1111 6.61002M13.5153 11.3552V13.139C13.516 13.3046 13.482 13.4686 13.4155 13.6203C13.349 13.772 13.2516 13.9082 13.1293 14.0202C13.007 14.1321 12.8627 14.2174 12.7055 14.2704C12.5483 14.3235 12.3818 14.3432 12.2165 14.3283C10.3833 14.1295 8.62227 13.5042 7.07507 12.5028C5.63559 11.5898 4.41517 10.3717 3.50047 8.93502C2.49361 7.38375 1.86702 5.61758 1.67146 3.77959C1.65657 3.61515 1.67615 3.44943 1.72895 3.29296C1.78175 3.13649 1.86662 2.99271 1.97814 2.87077C2.08967 2.74883 2.22541 2.65141 2.37672 2.5847C2.52804 2.51799 2.69162 2.48346 2.85704 2.4833H4.64434C4.93347 2.48046 5.21377 2.58265 5.43299 2.77082C5.65221 2.95899 5.7954 3.22031 5.83587 3.50606C5.91131 4.07694 6.05121 4.63748 6.25291 5.17697C6.33306 5.3898 6.35041 5.6211 6.3029 5.84347C6.25538 6.06584 6.14499 6.26996 5.98481 6.43163L5.22819 7.18681C6.0763 8.67549 7.31126 9.90809 8.80279 10.7546L9.55941 9.9994C9.7214 9.83953 9.9259 9.72935 10.1487 9.68192C10.3715 9.6345 10.6032 9.65181 10.8165 9.73182C11.357 9.93313 11.9186 10.0728 12.4906 10.1481C12.78 10.1888 13.0443 10.3343 13.2332 10.5569C13.4222 10.7794 13.5226 11.0635 13.5153 11.3552Z" stroke="#D3D3D3" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
							</svg><div class="popover-line-title">` + formatPhone(shop.phone) + '</div></div>';
			}
			if (shop.metro)
			{
				content += `<div class="popover-line popover-metro"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<rect width="16" height="16" fill="white"/>
				<path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8ZM15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM6.04311 4.5H5.32201H4.5H4V11.5H5.56238V9.50961L5.39439 6.00856L7.4644 9.5H8.53037L10.6001 6.01524L10.4324 9.50961V11.5H12V4.5H11.5H11.3364H10.6728H9.95167L7.99739 7.63942L6.04311 4.5Z" fill="#D3D3D3"/>
			  </svg><div class="popover-line-title">` + shop.metro + '</div></div> ';
			}
			if (shop.business_hours)
			{
				function formatSchedule(schedule) {
					const days = schedule.split('<br>');
					let formattedSchedule = '';
					
					for (const day of days) {
						const [dayOfWeek, time] = day.split(': ');
						formattedSchedule += `<div><b>${dayOfWeek}:</b> ${time}</div>`;
					}
				
					return formattedSchedule;
				}

				content += `<div class="popover-line popover-time"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path fill-rule="evenodd" clip-rule="evenodd" d="M10.2 3.5H5.8C4.93517 3.5 4.37676 3.50117 3.95175 3.53589C3.54426 3.56918 3.39318 3.6257 3.31901 3.66349C3.03677 3.8073 2.8073 4.03677 2.66349 4.31901C2.6257 4.39318 2.56918 4.54426 2.53589 4.95175C2.50117 5.37676 2.5 5.93517 2.5 6.8V9.2C2.5 11.0648 2.50117 11.6232 2.53589 12.0482C2.56918 12.4557 2.6257 12.6068 2.66349 12.681C2.8073 12.9632 3.03677 13.1927 3.31901 13.3365C3.39318 13.3743 3.54426 13.4308 3.95175 13.4641C4.37676 13.4988 4.93517 13.5 5.8 13.5H10.2C11.0648 13.5 11.6232 13.4988 12.0482 13.4641C12.4557 13.4308 12.6068 13.3743 12.681 13.3365C12.9632 13.1927 13.1927 12.9632 13.3365 12.681C13.3743 12.6068 13.4308 12.4557 13.4641 12.0482C13.4988 11.6232 13.5 11.0648 13.5 9.2V6.8C13.5 5.93517 13.4988 5.37676 13.4641 4.95175C13.4308 4.54426 13.3743 4.39318 13.3365 4.31901C13.1927 4.03677 12.9632 3.8073 12.681 3.66349C12.6068 3.6257 12.4557 3.56918 12.0482 3.53589C11.6232 3.50117 11.0648 3.5 10.2 3.5ZM1.32698 3.63803C1 4.27976 1 5.11984 1 6.8V9.2C1 11.8802 1 12.7202 1.32698 13.362C1.6146 13.9265 2.07354 14.3854 2.63803 14.673C3.27976 15 4.11984 15 5.8 15H10.2C11.8802 15 12.7202 15 13.362 14.673C13.9265 14.3854 14.3854 13.9265 14.673 13.362C15 12.7202 15 11.8802 15 9.2V6.8C15 5.11984 15 4.27976 14.673 3.63803C14.3854 3.07354 13.9265 2.6146 13.362 2.32698C12.7202 2 11.8802 2 10.2 2H5.8C4.11984 2 3.27976 2 2.63803 2.32698C2.07354 2.6146 1.6146 3.07354 1.32698 3.63803Z" fill="#D3D3D3"/>
				<path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 0.75C5.91421 0.75 6.25 1.08579 6.25 1.5V4C6.25 4.41421 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 4.41421 4.75 4V1.5C4.75 1.08579 5.08579 0.75 5.5 0.75Z" fill="#D3D3D3"/>
				<path fill-rule="evenodd" clip-rule="evenodd" d="M1.25 7.5C1.25 7.08579 1.58579 6.75 2 6.75H14C14.4142 6.75 14.75 7.08579 14.75 7.5C14.75 7.91421 14.4142 8.25 14 8.25H2C1.58579 8.25 1.25 7.91421 1.25 7.5Z" fill="#D3D3D3"/>
				<path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 0.75C10.9142 0.75 11.25 1.08579 11.25 1.5V4C11.25 4.41421 10.9142 4.75 10.5 4.75C10.0858 4.75 9.75 4.41421 9.75 4V1.5C9.75 1.08579 10.0858 0.75 10.5 0.75Z" fill="#D3D3D3"/>
			  </svg><div class="popover-line-title">` + formatSchedule(shop.business_hours) + '</div></div>';
			}
			content += '</div>';
		}

		return content;
	}

	_initAreas()
	{
		const settings = this._defaultAreaSettings();

		for (let k in this.data_references.areas)
		{
			const area = this.data_references.areas[k];

			if (area.coordinates === '[[[,]]]')
			{
				area.geo = null;
				continue;
			}
			if (area.coordinates === '[[]]')
			{
				area.geo = null;
				continue;
			}

			area.geo = this._createGeoArea(area, settings);
			area.fill_color = settings.fillColor;
		}
	}

	updateAreas()
	{
		const action_area_ids = this.app.getDeliveryActionAreas();
		const prices_colors = this._pricesColors();

		for (let k in this.data_references.areas)
		{
			const area = this.data_references.areas[k];
			if (area.geo === null)
			{
				continue;
			}

			const settings = this._areaSettings(area, prices_colors);

			let fill_color = settings.fillColor;
            area.green_zone = settings.groupName === 'green_zone';

			if (action_area_ids.length > 0)
			{
				const action_fill_color = this._actionAreaColor(area);
				const default_color = (action_area_ids.indexOf(area.id) !== -1
				)
					? this.config.action_color
					: 'rgba(255,255,255,0)';

				fill_color = (action_fill_color != null
				)
					? action_fill_color
					: default_color;
			}

			if (area.fill_color !== fill_color)
			{
				area.fill_color = fill_color;
				area.geo.options.set('fillColor', fill_color);
			}
		}

		const self = this;
		setTimeout(function () {
			self.map.container.fitToViewport();
		}, 0);
	}

	/**
	 *
	 * @param {object} area
	 * @returns {null|*}
	 * @private
	 */
	_actionAreaColor(area)
	{
		if (this.app.order.is_company)
		{
			return null;
		}

		if (area == null)
		{
			return null;
		}

		let current_action_id;
		if (('tech' in this.app) && ('delivery_action_id' in this.app.tech))
		{
			current_action_id = this.app.tech.delivery_action_id;
		}
		else
		{
			const action = this.app.view_action_delivery;
			current_action_id = action ? action.id : 0;
		}

		for (let i = 0; i < this.app.actions_delivery.length; i++)
		{
			const action = this.app.actions_delivery[i];

			const allow_action = (current_action_id === 0) || (current_action_id === action.id);
			const allow_color = parseInt(action.allow_color) === 1;
			if (allow_action && allow_color && (action.area_ids.indexOf(area.id) !== -1))
			{
				return action.color;
			}
		}

		return null;
	}

	/**
	 *
	 * @returns {{fillColor: string, strokeWidth: number, strokeStyle: string, opacity: number, strokeColor: string}}
	 * @private
	 */
	_defaultAreaSettings()
	{
		return {
			fillColor: 'rgba(255,255,255,0)',//'#888';//'#00FF00';
			opacity: 0.30,
			strokeColor: '#FF0000',//'#0000FF',
			strokeStyle: 'solid',//'shortdash'
			strokeWidth: this.config.border
		};
	}

	/**
	 *
	 * @param {object} area
	 * @param {object} prices_colors
	 * @returns {{fillColor: string, strokeWidth: number, strokeStyle: string, opacity: number, strokeColor: string}}
	 * @private
	 */
	_areaSettings(area, prices_colors)
	{
		const settings = this._defaultAreaSettings();
        settings.groupName = 'default_zone';
		if (this.app.forced_transport == null)
		{
			const action_fill_color = this._actionAreaColor(area);
			if (action_fill_color != null)
			{
				settings.fillColor = action_fill_color;
				return settings;
			}
		}

		const prices = this.app.getPrices(area);

		if (prices)
		{
			if (this.config.msk)
			{
                settings.groupName = 'green_zone';
				if (prices.is_courier)
				{
					if (prices.colored)
					{
						settings.fillColor = '#9cfbbb';//'#00ff00';
					}
					else if (prices.price > 0)
					{
						settings.fillColor = 'rgba(255,255,255,0)';//colors[i % colors.length];//'#FF0000';
					}
				}
				else if (prices.price > 0)
				{
					settings.fillColor = prices_colors[prices.price];
					settings.opacity = 0.5;
				}
			}
			else
			{
				if (prices.colored)
				{
					settings.fillColor = '#9cfbbb';//'#00ff00';
                    settings.groupName = 'green_zone';
				}
				else if (prices.price > 0)
				{
					settings.fillColor = 'rgba(255,255,255,0)';//colors[i % colors.length];//'#FF0000';
				}
			}
		}

		return settings;
	}

	/**
	 *
	 * @param {object} area
	 * @param {object} settings
	 * @returns {ymaps.GeoObject|null}
	 * @private
	 */
	_createGeoArea(area, settings)
	{
		let coords;
		try
		{
			coords = JSON.parse(area.coordinates.replace('],]]', ']]]'));
		}
		catch (err)
		{
			return null;
		}
		const geo = new ymaps.GeoObject({
			geometry: {
				type: 'Polygon',
				coordinates: coords,
				fillRule: 'nonZero'
			},
			properties: this.config.hints ? { hintContent: area.name } : {}
		}, settings);

		const self = this;
		geo.events.add('click', function ($e) {
			self._processClick($e);
		});

		this.map.geoObjects.add(geo);

		return geo;
	}

	/**
	 *
	 * @returns {{}}
	 * @private
	 */
	_pricesColors()
	{
		const prices = this._areasPrices();
		if (prices.length === 0)
		{
			return {};
		}

		if (prices.length === 1)
		{
			const result = {};
			result[prices[0]] = '#00ff00';
			return result;
		}

		const prices_colors = {};

		if (this.config.msk)
		{
			const colors = [
				'#aabdcd', '#eed0a0', '#ffa0a0', '#9adbb9', '#d1e8b2',
				'#fffa9a', '#fac0a8', '#fddfbd', '#cdc999', '#d0d0d0',
				'#e9a2cc', '#89cfe9', '#89adbd', '#8acba9', '#c1d8a2',
				'#efea8a', '#eab098', '#edcfad', '#bdb989', '#c0c0c0'
			];
			for (let i = 0; i < prices.length; i++)//>
			{
				prices_colors[prices[i]] = colors[i];
			}
		}
		else
		{
			const step = 300 / (prices.length - 1); // distribute the colors evenly on the hue range
			for (let i = 0; i < prices.length; i++)
			{
				const h = (step * i + 120) % 360;
				prices_colors[prices[i]] = this.hsv2rgb(h, 100, 100);
			}
		}

		return prices_colors;
	}

	_areasPrices()
	{
		const prices = [];

		for (let k in this.data_references.areas)
		{
			const area = this.data_references.areas[k];
			const area_prices = this.app.getPrices(area);
			if ((area_prices) && (area_prices.price > 0) && ($.inArray(area_prices.price, prices) === -1))
			{
				prices.push(area_prices.price);
			}
		}

		return prices;
	}

	hsv2rgb(h, s, v)
	{
		let r, g, b;
		let i;
		let f, p, q, t;

		// Make sure our arguments stay in-range
		h = Math.max(0, Math.min(360, h));
		s = Math.max(0, Math.min(100, s));
		v = Math.max(0, Math.min(100, v));

		// We accept saturation and value arguments from 0 to 100 because that's
		// how Photoshop represents those values. Internally, however, the
		// saturation and value are calculated from a range of 0 to 1. We make
		// That conversion here.
		s /= 100;
		v /= 100;

		if (s === 0)
		{
			// Achromatic (grey)
			r = g = b = v;
			return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
		}

		h /= 60; // sector 0 to 5
		i = Math.floor(h);
		f = h - i; // factorial part of h
		p = v * (1 - s);
		q = v * (1 - s * f);
		t = v * (1 - s * (1 - f));

		switch (i)
		{
			case 0:
				r = v;
				g = t;
				b = p;
				break;

			case 1:
				r = q;
				g = v;
				b = p;
				break;

			case 2:
				r = p;
				g = v;
				b = t;
				break;

			case 3:
				r = p;
				g = q;
				b = v;
				break;

			case 4:
				r = t;
				g = p;
				b = v;
				break;

			default: // case 5:
				r = v;
				g = p;
				b = q;
		}

		r = Math.round(r * 255);
		g = Math.round(g * 255);
		b = Math.round(b * 255);
		return 'rgba(' + r + ',' + g + ',' + b + ',1)';
	}
}