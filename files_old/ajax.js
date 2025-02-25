'use strict';

class SlickLoader
{
	/**
	 *
	 * @param {string} url
	 * @param {number} page
	 * @param {number} per_page
	 * @param {number} count
	 * @param {jQuery} $navigation
	 * @param {jQuery} $slick
	 */
	constructor(url, page, per_page, count, $navigation, $slick)
	{
		this.url = url;
		this._page = page;
		this.per_page = per_page;
		this._count = count;

		this.$navigation = $navigation;
		this.$slick = $slick;

		const self = this;

		this.$navigation.on('click', function(){
			const $e = $(this);
			self.$navigation.removeClass('active');
			$e.addClass('active');

			self._toggleNavigation();

			return false;
		});

		this.$slick.on('beforeChange', function(event, slick, currentSlide, nextSlide){
			self._preload(nextSlide);
		});

		this._update();
	}

	_toggleNavigation()
	{
		this._update();

		const self = this;
		$.get(this.url, this._request(), function(goods) {
			self.$slick.slick('unslick');
			self.$slick.html(goods);
			create_slick(self.$slick);
		});
	}

	_preload(nextSlide)
	{
		const next_visible = nextSlide + (this.$slick.slick('getOption', 'slidesToShow') * 2);
		const next_page = Math.ceil(next_visible / this.per_page);
		const max_page = Math.round(this._count / this.per_page);

		if ((next_page > max_page) || (next_page <= this._page))
		{
			return;
		}

		this._page += 1;

		const self = this;
		$.get(this.url, this._request(), function(goods) {
			self.$slick.slick('slickAdd', goods);
		});
	}

	_$active()
	{
		return this.$navigation.filter('.active');
	}

	_request()
	{
		return {
			c: this._$active().data('id'),
			page: this._page,
			per_page: this.per_page,
			id: this._$active().data('good_id')
		};
	}

	_update()
	{
		this._page = 1;
		this._count = parseInt(this._$active().data('count'));
	}
}

class SlickLoader2
{
	/**
	 *
	 * @param {string} url
	 * @param {number} page
	 * @param {number} per_page
	 * @param {number} count
	 * @param {jQuery} $navigation
	 * @param {jQuery} $slick
	 */
	constructor(url, page, per_page, count, $navigation, slick)
	{
		this.url = url;
		this._page = page;
		this.per_page = per_page;
		this._count = count;

		this.$navigation = $navigation;
		this.$slick = slick;
		const self = this;
		this.$navigation.on('click', function(){
			const $e = $(this);
			self.$navigation.removeClass('active');
			$e.addClass('active');

			self._toggleNavigation();

			return false;
		});

		this.$slick.on('slideNextTransitionEnd', function(e){
			self._preload(self.$slick.realIndex);
		});

		this._update();
	}

	_toggleNavigation()
	{
		this._update();

		const self = this;
		$.get(this.url, this._request(), function(goods) {
			self.$slick.removeAllSlides();
			self.$slick.appendSlide(goods);
			updateCardStock();
			//self.$slick.slick('unslick');
			//self.$slick.html(goods);
			//create_slick(self.$slick);
			self.$slick.update()
		});
	}

	_preload(nextSlide)
	{
		const showSlide = this.$slick.params.slidesPerView;
		const next_visible = nextSlide + (showSlide * 2);
		const next_page = Math.ceil(next_visible / this.per_page);
		const max_page = Math.round(this._count / this.per_page);

		if ((next_page > max_page) || (next_page <= this._page))
		{
			return;
		}

		this._page += 1;

		const self = this;
		$.get(this.url, this._request(), function(goods) {
			self.$slick.appendSlide(goods);
			updateCardStock();
		});
	}

	_$active()
	{
		return this.$navigation.filter('.active');
	}

	_request()
	{
		return {
			c: this._$active().data('id'),
			page: this._page,
			per_page: this.per_page,
			id: this._$active().data('good_id')
		};
	}

	_update()
	{
		this._page = 1;
		this._count = parseInt(this._$active().data('count'));
	}
}



class Pagination
{
	/**
	 *
	 * @param {number?} page
	 * @param {number?} per_page
	 * @param {number?} count
	 */
	constructor(page, per_page, count)
	{
		this.page = typeof page === 'undefined' ? 1 : page;
		this.per_page = typeof per_page === 'undefined' ? 10 : per_page;
		this.count = typeof count === 'undefined' ? 0 : count;
	}

	pages()
	{
		return Math.ceil(this.count / this.per_page);
	}
}

class Loader
{
	/**
	 *
	 * @param {string} url
	 * @param {object} request
	 * @param {Pagination} pagination
	 */
	constructor(url, request, pagination)
	{
		this.url = url;
		this.request = request;
		this.pagination = pagination;

		this.is_history = false;

		this.$load_more = null;
		this.on_more = [];
		this.paginator_selector = null;
		this.on_page = [];


		this.beforeOnMore = null;
		this.beforeOnPage = null;

		this.json = false;
	}

	/**
	 *
	 * @param {number?} delta
	 * @returns {boolean}
	 * @private
	 */
	_isLastPage(delta)
	{
		if (typeof delta == 'undefined')
		{
			delta = 0;
		}

		return this.pagination.pages() <= (this.pagination.page + delta);
	}

	/**
	 *
	 * @param {number} count
	 */
	setCount(count)
	{
		if (this.pagination.count !== count)
		{
			this.pagination.count = count;
			this.updateLoadMore();
			this.updatePaginator();
		}
	}

	updateLoadMore()
	{
		if (!this.$load_more)
		{
			return;
		}

		if (this._isLastPage())
		{
			this.$load_more.hide();
		}
		else
		{
			this.$load_more.show();
		}
	}

	/**
	 *
	 * @param {jQuery} $load_more
	 * @param {function} onload
	 */
	setLoadMore($load_more, onload)
	{
		this.$load_more = $load_more;
		this.on_more.push(onload);
		if (typeof updateCardStock === "function") {
			this.on_more.push(updateCardStock);
		  }

		this.updateLoadMore();

		const self = this;
		this.$load_more.on('click', function(){
			self.loadMore();
			return false;
		});
	}
	setBeforeLoadMore(func){
		this.beforeOnMore = func;
	}
	setBeforeLoadPage(func){
		this.beforeOnPage = func;
	}

	updatePaginator(data)
	{
		if (!this.paginator_selector)
		{
			return;
		}

		if(typeof data == 'object' && typeof data.paginator == 'string')
			$(this.paginator_selector).replaceWith(data.paginator);
		else
		{
			const self = this;
			$.get('/paginator/', this.pagination, function(paginator){
				$(self.paginator_selector).replaceWith(paginator);
			});
		}
	}

	/**
	 *
	 * @param {string} selector
	 * @param {function} onload
	 */
	setPaginator(selector, onload)
	{
		this.paginator_selector = selector;
		this.on_page.push(onload);
		if (typeof updateCardStock === "function") {
			this.on_page.push(updateCardStock);
		  }
		const self = this;

		$('body').on('click', this.paginator_selector + ' a', function() {
			self.setPage(parseInt($(this).data('page')));

			return false;
		});
	}

	loadMore()
	{
		if (this._isLastPage())
		{
			return;
		}

		this.setPage(this.pagination.page + 1, {}, true);
	}

	/**
	 *
	 * @param {number} page
	 * @param {object?} [settings]
	 * @param {boolean} [load_more]
	 */
	setPage(page, settings, load_more)
	{
		const request = Object.assign({}, this.request);
		if (typeof settings != 'undefined')
		{
			Object.assign(request, settings);
		}

		if (typeof load_more === 'undefined')
		{
			load_more = false;
		}

		request.page = page;
		request.per_page = this.pagination.per_page;
		this.request = request;
		request.ajax = 1;

		if(load_more && typeof this.beforeOnMore=='function') this.beforeOnMore();
		if(!load_more && typeof this.beforeOnPage=='function') this.beforeOnPage();

		const self = this;
		if (this.json)
		{
			$.getJSON(this.url, request, function(response) {
				self._processResponse(request, response, load_more);
			});

		}
		else
		{
			$.get(this.url, request, function(response) {
				self._processResponse(request, response, load_more);
			});
		}
	}

	_processResponse(request, response, load_more)
	{
		if (typeof response.pagination !== 'undefined')
		{
			this.pagination = Object.assign(this.pagination, response.pagination);
		}
		else
		{
			this.pagination.page = request.page;
		}

		this.updateLoadMore();
		this.updatePaginator(response);

		this._callback(load_more ? this.on_more : this.on_page, response);

		this.is_history = false;
	}

	/**
	 *
	 * @param {function[]} callbacks
	 * @param {any} arg
	 * @private
	 */
	_callback(callbacks, arg)
	{
		for (let i in callbacks)
		{
			callbacks[i](arg);
		}
	}
}

const compare = {
	_card: {
		init: function() {
			$('body').on('click','.js-card-wrapper .goods_card_icon_compare', function() {
				const $card = $(this).parents('.js-card-wrapper');

				if (compare._card.is_active($card))
				{
					compare.remove($card.data('id'));
				}
				else
				{
					compare.add($card.data('id'));
				}
			});
		},
		_element: function(id) {
			return $('.js-card-wrapper[data-id='+id+']');
		},
		is_active: function($card) {
			return $card.find('.goods_card_icon_compare').hasClass('active');
		},
		set: function(id, state) {
			const $card = compare._card._element(id);

			if (state && !compare._card.is_active($card))
			{

				$card.find('.goods_card_icon_compare').addClass('active');
				
			}
			else if (!state && compare._card.is_active($card))
			{
				$card.find('.goods_card_icon_compare').removeClass('active');
			}
		},
	},
	_page: {
		init: function() {
			const $body = $('body');



			$body.on('click', '.catalog__goods__header_action .js-compare', function() {
				const $card = $(this).parents('.catalog__goods__header_action');

				if (compare._page.is_active($card))
				{
					compare.remove($card.data('id'));
				}
				else
				{
					compare.add($card.data('id'));
				}
			});
		},

		element: function(id) {
			return $('.catalog__goods__header_action[data-id=' + id + ']');
		},
		is_active: function($card) {
			return $card.find('.compare_icon').hasClass('active');
		},
		set: function(id, state) {
			const $card = compare._page.element(id);

			if (state && !compare._page.is_active($card))
			{
				$card.find('.compare_icon').addClass('active');
			}
			else if (!state && compare._page.is_active($card))
			{
				$card.find('.compare_icon').removeClass('active');
			}
		},
	},

	count: 0,
	callbacks: [],
	add: function(id) {
		compare._request({id: id, add: 1});
		compare._set(id, true);
		
		if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'mic_click_katalog_list_compare');
		if(document.location.pathname == '/compare/') {
			setTimeout(function () {
				document.location.reload();
			}, 500);
		}
	},

	remove: function(id) {
		compare._request({id: id, remove: 1});
		compare._set(id, false);
	},

	init: function() {
		compare._card.init();
		compare._page.init();
	},

	_request: function(query){
		$.getJSON('/ajax/compare/', query, function(response){
			compare.count = response.ids.length;
			compare._update(response);
			if(response.is_added)popups.alertNew('Товар добавлен в сравнение','<a href="/compare">Перейти в раздел сравнения</a>',1)
			for (let i in compare.callbacks)
			{
				compare.callbacks[i](response);
			}
		});
	},

	_set: function(id, state) {
		compare._card.set(id, state);
		compare._page.set(id, state);
	},

	_update: function(data) {
		$('.goods_card_icon_compare.active').parents('.js-card-wrapper').each(function(){
			const $e = $(this);
			const id = $e.data('id');
			if (data.ids.indexOf(id) < 0)
			{
				if(data.error){
					//let textHtml='<div class="bubble_text">'+data.error+'</div>'
					//popups._tooltip._openCustomText($e.find('.goods_card_icon_compare'),textHtml);
					popups.alertNew('Добавление в сравнение',data.error,0)
				}
				compare._set(id, false);
			}
		});

		for (let i in data.ids)
		{
			compare._set(data.ids[i], true);
		}

		$('.compare_count').text(compare.count).toggleClass('hidden', !compare.count);
	}
};

const favorite = {
	_card: {
		init: function() {
			const $body = $('body');
			$('body').on('click','.js-card-wrapper .goods_card_icon_favorite', function() {
				const $card = $(this).parents('.js-card-wrapper');

				if (favorite._card.is_active($card))
				{
					favorite.remove($card.data('id'));
				}
				else
				{
					favorite.add($card.data('id'));
				}
			});
		},
		_element: function(id) {
			return $('.js-card-wrapper[data-id='+id+']');
		},
		is_active: function($card) {
			return $card.find('.goods_card_icon_favorite').hasClass('active');
		},
		set: function(id, state) {
			const $card = favorite._card._element(id);

			if (state && !favorite._card.is_active($card))
			{
				$card.find('.goods_card_icon_favorite').addClass('active');
			}
			else if (!state && favorite._card.is_active($card))
			{
				$card.find('.goods_card_icon_favorite').removeClass('active');
			}
		},
	},
	_page: {
		init: function() {
			const $body = $('body');



			$body.on('click', '.catalog__goods__header_action .js-favorite', function() {
				const $card = $(this).parents('.catalog__goods__header_action');
		
				if (favorite._page.is_active($card))
				{
					favorite.remove($card.data('id'));
				}
				else
				{
					favorite.add($card.data('id'));
				}
			});
		},

		element: function(id) {
			return $('.catalog__goods__header_action[data-id=' + id + ']');
		},
		is_active: function($card) {
			return $card.find('.favorite_icon').hasClass('active');
		},
		set: function(id, state) {
			const $card = favorite._page.element(id);

			if (state && !favorite._page.is_active($card))
			{
				$card.find('.favorite_icon').addClass('active');
			}
			else if (!state && favorite._page.is_active($card))
			{
				$card.find('.favorite_icon').removeClass('active');
			}
		},
	},

	count: 0,
	callbacks: [],
	add: function(id) {
		favorite._request({id: id, add: 1});
		favorite._set(id, true);
		if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'mic_click_katalog_list_favorites');
		if(document.location.pathname == '/favorite/') {
			setTimeout(function () {
				document.location.reload();
			}, 500);
		}
	},

	remove: function(id) {
		favorite._request({id: id, remove: 1});
		favorite._set(id, false);
	},

	init: function() {
		favorite._card.init();
		favorite._page.init();
	},

	_request: function(query){
		$.getJSON('/ajax/favorite/', query, function(response){
			favorite.count = response.ids.length;

			favorite._update(response);
			if(response.is_added)popups.alertNew('Товар добавлен в избранное','<a href="/favorite">Перейти в раздел избранное</a>',1)
			for (let i in favorite.callbacks)
			{
				favorite.callbacks[i](response);
			}
		});
	},

	_is_active: function($card) {
		return !$card.find('.favorite_icon_active').hasClass('hidden');
	},

	_set: function(id, state) {
		favorite._card.set(id, state);
		favorite._page.set(id, state);
	},

	_update: function(data) {
		$('.favorite_icon_active:not(.hidden)').parents('.js-card-wrapper').each(function(){
			const $e = $(this);
			const id = $e.data('id');
			if (data.ids.indexOf(id) < 0)
			{
				favorite._set(id, false);
			}
		});

		for (let i in data.ids)
		{
			favorite._set(data.ids[i], true);
		}

		$('.favorite_count').text(favorite.count).toggleClass('hidden', !favorite.count);
	}
};

function enable_prices_toggle()
{
	const $body = $('body');

	$body.on('click','.goods_card_price_units .price_unit_item', function() {
		const $e = $(this);
		const $prices = $e.parents('.js-footer-card');

		$prices.find('.price_unit_item').removeClass('units_active');
		$e.addClass('units_active');

		const rate = parseFloat($e.data('rate'));
		$prices.find('.js-price-value').each(function(){
			const $e = $(this);
			const price = parseFloat($e.data('price'));

			$e.html(nf_price(price * rate));
		});
	});

	$body.on('click', '.catalog__goods__price__header .price_unit_item ', function() {
		const $e = $(this);
		const $prices = $e.parents('.catalog__goods__price__header');

		$prices.find('.price_unit_item').removeClass('units_active');
		$e.addClass('units_active');

		const rate = parseFloat($e.data('rate'));
		$prices.find('.js-price-value').each(function(){
			const $e = $(this);
			const price = parseFloat($e.data('price'));

			$e.html(nf_price(price * rate));
		});
	});
}

const goods_details = {
	init: function(){
		goods_details._$popup = $('.goods_card_mini_popup');
		goods_details._$wrap = $('.goods_card_mini_popup_wrap');

		$('body').on('click', '.goods_card_availability', function(e) {

				e.stopPropagation();
				e.stopImmediatePropagation();
				const $card = $(this).closest('.js-card-wrapper');
				const id = $card.data('id');
				goods_details._$popup.html('');
				const elem=$(this);
				if(goods_details._$wrap.hasClass('popup_hidden')){
				// cache does not support fav/compare changes
				
					$.get('/ajax/goods_popup/', {id: id}, function(response) {
						goods_details._cache[id] = response;
						goods_details._open(id);
						//goods_details._update_popup_pos(elem)
						if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'offer_click_availability');
					});


				} else {
					goods_details._close();

				}
		});
		$('body').on('click','.goods_card_icon_action', function(e) {

			e.stopPropagation();
			e.stopImmediatePropagation();
			const $card = $(this).closest('.js-card-wrapper');
			const id = $card.data('id');
			goods_details._$popup.html('');
			const elem=$(this);
            const url = new URL(window.location.href);
            const actionId = url.searchParams.get('viewaction');
            const isActionPage = ['/catalog/', '/news/'].indexOf(url.pathname)>=0 && actionId !== null;
            let popupData = {id: id};
            if(isActionPage){
                popupData.action_id = actionId;
            }

			// cache does not support fav/compare changes
			if(goods_details._$wrap.hasClass('popup_hidden')){
				$.get('/ajax/goods_popupAction/', popupData, function(response) {
					goods_details._cache[id] = response;
					goods_details._open(id);
					//goods_details._update_popup_pos(elem)
				});
			}else {
					goods_details._close();
				}
		});
		$('body').on('click','.catalog__goods__info__bonus__list__item--action', function(e) {

			e.stopPropagation();
			e.stopImmediatePropagation();
			const $card = $(this).closest('.card_item');
			const id = $card.data('idpage');
			goods_details._$popup.html('');

            let popupData = {id: id};

			// cache does not support fav/compare changes
			if(goods_details._$wrap.hasClass('popup_hidden')){
				$.get('/ajax/goods_popupAction/', popupData, function(response) {
					goods_details._cache[id] = response;
					goods_details._open(id);
					//goods_details._update_popup_pos(elem)
				});
			}else {
					goods_details._close();
				}
		});
		goods_details._$wrap.on('click', '.goods_card_mini_popup_hidden_icon',function(event) {
			goods_details._$wrap.addClass('popup_hidden');
			goods_details._$popup.addClass('hidden');
			$("body").css('padding-right',  '0px');
            $('body').css('overflow-y','scroll');
			// if (event.target === this)
			// {
			// 	$(this).addClass('popup_hidden');
			// }
		});
		$('.goods_card_mini_popup_wrap').click( function(e){ // событие клика по веб-документу
			var div = $( ".goods_card_mini_popup" ); 
			if ( !div.is(e.target) 
				&& div.has(e.target).length === 0 ) { 
					goods_details._close();
			}
		});
	},

	_cache: {},
	_$popup: null,
	_$wrap: null,
	_close(){
		goods_details._$wrap.addClass('popup_hidden');
		goods_details._$popup.addClass('hidden');
		$("body").css('padding-right',  '0px');
		$('body').css('overflow-y','scroll');
	},
	_open: function(id) {
		goods_details._$popup.attr('data-id', id);
		goods_details._$popup.data('id', id);

		goods_details._$popup.html(goods_details._cache[id]);
		goods_details._$wrap.removeClass('popup_hidden');
		goods_details._$wrap.fadeIn(100);
		goods_details._$popup.removeClass('hidden');
		$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
		$('body').css('overflow-y', 'hidden');
		
	},
	_update_popup_pos(elm){
		const popup_elm = goods_details._$popup;
		const popup_width = popup_elm.innerWidth();
		const popup_height = popup_elm.height()+10;
        const card_width = $(elm).closest('.goods_card_wrap--new').width();
		const coordinates = $(elm).offset(); //Получаем координаты кликнутой кнопки
        const top = $(elm).offset().top;
        const left = $(elm).closest('.goods_card_wrap--new').offset().left;
        const leftScroll=$(window).scrollLeft();
  
        const leftWind=left-leftScroll;

        coordinates.top=top+$(elm).height()-popup_height/2; // На высоте середины кнопки
        coordinates.left=leftWind+card_width
        if (coordinates.left + popup_width >= $(window).width())
        {
            // сдвинуть влево
            coordinates.left = leftWind-popup_width;
        }
		goods_details._$wrap.css({
			left: '' + coordinates.left + 'px',
			top: '' + coordinates.top + 'px',
		});
		
		popup_elm.data('clicked', elm);
	}
};

const popup_recommendation = {
	init: function(){
		popup_recommendation._$popup = $('.popup_profit_offer');
		popup_recommendation._$wrap = $('.goods_card_mini_popup_wrap');

		const $body = $('body');
		$body.on('click', '.goods_card_icon_recomend', function(event) {
			popup_recommendation._open(event);
		});

		$body.on('click', '.catalog__goods__info__bonus__list__item.recommendation', function(event) {
			popup_recommendation._open(event);
		});

		popup_recommendation._$popup.find('.popup_profit_offer_icon').on('click', function(event) {
			popup_recommendation._close();
		});

		$(document).on('mouseup', function(event) {
			const $block = $(popup_recommendation._$popup);
			if (!$block.is(event.target) && $block.has(event.target).length === 0)
			{
				popup_recommendation._close();
			}
		});
	},

	_cache: {},
	_$popup: null,
	_$wrap: null,
	_open: function(event) {
		popup_recommendation._$popup.css({
			display: 'block',
			position: 'absolute',
			left: event.pageX + 20,
			top: event.pageY + 20
		});
	},
	_close: function(id) {
		popup_recommendation._$popup.css('display', 'none');
	},
};

const cart = {
	init: function(token) {
		cart._token = token;
		cart._$popup = $('.basket_popup');
		const $body = $('body');
		$body.on('click', '.goods_card_cart_block .goods_card_cart_link', function(){
			if(!$(this).hasClass('goods_card_cart_link_notIn')&&!$(this).hasClass('goods_card_cart_link__active')) {
				const $card = $(this).parents('.js-card-wrapper'),
					$input = $card.find('.basket__form__table__coll__input'),
					quantity = parseInt($input.val()), goods_id = $card.data('id');
				cart.add(goods_id, parseInt(quantity));
				cart.changeButton($card);
				return false;
			}
		}).on('click', '.js-card-wrapper .basket__form__table__coll__input__btn.minus', function(){
			const $card = $(this).parents('.js-card-wrapper'),
				$countBlock=$card.find('.basket__form__table__coll__form__group');
			if(!$countBlock.hasClass('disabled')){
				const $input = $card.find('.basket__form__table__coll__input'),
					quantity = parseInt($input.val()), goods_id = $card.data('id');
				$input.val(quantity - 1);
				if($card.find('.goods_card_cart_link').hasClass('goods_card_cart_link__active')){
					cart.change(goods_id, (quantity-1));
					cart.changeButton($card);
					if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'mac_click_katalog_list_minus');
				}

				if((quantity-1)<1){
					$countBlock.addClass('disabled');
					setTimeout(function(){
						$input.val(1);
						$countBlock.removeClass('disabled');
					},1000);
				}
			}
						
			return false;
		}).on('click', '.js-card-wrapper .basket__form__table__coll__input__btn.plus',  function(){
			const $card = $(this).parents('.js-card-wrapper'),
				$input = $card.find('.basket__form__table__coll__input'),
				quantity = parseInt($input.val()), goods_id = $card.data('id');

			$card.find('.basket__form__table__coll__form__group').removeClass('disabled');
			$input.val(quantity + 1);
			if($card.find('.goods_card_cart_link ').hasClass('goods_card_cart_link__active')){
				cart.change(goods_id, (quantity+1));
				cart.changeButton($card);
				if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'mac_click_katalog_list_plus');
			}
			return false;
		}).on('change', '.js-card-wrapper .basket__form__table__coll__input',  function(){
			const $self=$(this), $card = $self.parents('.js-card-wrapper'),
				// $input = $card.find('.basket__form__table__coll__input'),
				$countBlock=$card.find('.basket__form__table__coll__form__group'),
				goods_id = $card.data('id');
			let quantity = parseInt($self.val());

			if($card.find('.goods_card_cart_link ').hasClass('goods_card_cart_link__active')){
				cart.change(goods_id, (quantity));
				cart.changeButton($card);
			}

			if(!quantity) quantity=0;
			if(quantity<1){
				$countBlock.addClass('disabled');
				setTimeout(function(){
					$self.val(1);
					$countBlock.removeClass('disabled');
				},1000);
			} 

			return false;
		}).on('keydown','.goods_card_cart_block .basket__form__table__coll__input', function(event) {
			if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
				// Разрешаем: Ctrl+A
				(event.keyCode == 65 && event.ctrlKey === true) ||
				// Разрешаем: home, end, влево, вправо
				(event.keyCode >= 35 && event.keyCode <= 40)) {
		  
				// Ничего не делаем
				return;
			} else {
				// Запрещаем все, кроме цифр на основной клавиатуре, а так же Num-клавиатуре
				if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
					event.preventDefault();
				}
			}
		});
		let tippyInstances=[], inCard=false;
		document.onmouseover = function(event) {
			let anchorElem = event.target.closest('.js-card-wrapper')||event.target.closest('.h_s_list_categor_item');
			if (!anchorElem){
				inCard=false;
				tippyInstances.forEach(instance => {
					instance.destroy();
				});
				
				return;
			} 
			if(!inCard){
				inCard=true;

				let tooltip=tippy('.goods_card_price_tooltip.goods_card_price_tooltip--card', {
					content:"<div class='tippy-box-wrapper'>\
								<h3 class='tippy-box__title'>Карта лояльности «Стандартное оборудованиеа»</h3>\
								<div class='tippy-box-cont'>\
									<p class='tippy-box__text'>Дает возможность на получение дополнительных скидок и предложений.</p>\
									<a href='/structure/Programma-loyalnosti/' class='tippy-box__link'>Подробнее в разделе «Покупателям»</a>\
								</div>\
							</div>",
					trigger: 'click focus mouseenter',
					allowHTML: true,
					placement: "top-start",
					interactive: true,
				})
				let tooltipCompare=tippy('.goods_card_icon_compare.active', {
					content:"<div class='tippy-box-wrapper tippy-box-wrapper-compare'>\
								<a href='/compare' class='tippy-box__compareLink'>Перейти в раздел сравнения</a>\
							</div>",
					trigger: 'focus mouseenter',
					allowHTML: true,
					placement: "top",
					interactive: true,
					maxWidth: 230,
					arrow: false,
					offset: [0, -5],
				})
				let tooltipFavorite=tippy('.goods_card_icon_favorite.active', {
					content:"<div class='tippy-box-wrapper tippy-box-wrapper-compare'>\
								<a href='/favorite' class='tippy-box__compareLink'>Перейти в раздел избранное</a>\
							</div>",
					trigger: 'focus mouseenter',
					allowHTML: true,
					placement: "top",
					interactive: true,
					maxWidth: 230,
					arrow: false,
					offset: [0, -5],
				})
				tippyInstances = tippyInstances.concat(tooltipCompare);
				tippyInstances = tippyInstances.concat(tooltipFavorite);
				tippyInstances = tippyInstances.concat(tooltip);
			}
		}

		cart._$quantity = $('.js-cart-quantity');
		cart.callbacks.push(cart._cards_update);
	},
	changeButton(card){
		const $input = card.find('.basket__form__table__coll__input'),
			quantity = parseInt($input.val()), button=card.find('.goods_card_cart_link');
		if(quantity){
			button.addClass('goods_card_cart_link__active');
			button.attr('href','/cart');
		} else {
			button.removeClass('goods_card_cart_link__active');
			button.attr('href','');
		}
	},
	_cards_update: function(response) {
		cart._$quantity.html(response.result.count);
		cart._$quantity.css('display', response.result.count ? 'flex' : 'none');
	},

	add: function(id, quantity) {
		if(typeof quantity == 'undefined' || quantity < 0) quantity = 1;
		cart._request({add: id, quantity: quantity});
	},

	change: function(id, quantity, share_hash) {
		if (quantity < 0) quantity = 0;

		const request = {};
		request[id] = quantity;
		let data = {update: request};
		if(typeof share_hash != 'undefined') data.share_hash = share_hash; else data.share_hash = '';

		cart._request(data);
	},
	_request_id: 0,
	_last_request_id: '',
	_request: function(request) {
		if ('request_id' in request)
		{
			cart._last_request_id = request.request_id;
		}
		else
		{
			cart._last_request_id = 'cart_' + cart._request_id;
			cart._request_id += 1;

			request.request_id = cart._last_request_id;
		}

		// var cartIsEmpty = cart._$quantity && cart._$quantity.length && +cart._$quantity.text().trim() == 0;

		return new Promise((resolve, reject) => {
			const settings = {
				method: 'POST',
				data: request,
				dataType: 'json',
				headers: {
					'X-Token': cart._token,
				},
				success: function(response) {
					let action_event = '';
					if(request.add){
						action_event = typeof is_action_page != 'undefined' ? 'mac_click_promo_list_addtocart' : 'add_item_to_cart';
						if (typeof is_goods_page != 'undefined') action_event = 'mac_click_card_sidebar_addtocart';
						if (typeof ym != 'undefined') ym(ymID,'reachGoal', action_event);
						if (typeof ga != 'undefined') ga('send', 'event', 'click', 'button', action_event);
					}

					if (!response) return;

					if(typeof ecommerce=='function' && (request.del || request.add || request.change || request.update)) {
						if (response.goods_changed.add) {
							ecommerce('add', response.goods_changed.add);
                            if (typeof ym != 'undefined' && action_event!='add_item_to_cart') ym(ymID,'reachGoal', 'add_item_to_cart');
						} else if(response.goods_changed.remove) {
							ecommerce('remove', response.goods_changed.remove);
						}
					}

					if (response.request_id !== cart._last_request_id) return;
					cart._data = response;

					if (cart._$popup)
					{
						cart._$popup.html(response.popup);
					}

					for (let i in cart.callbacks)
					{
						cart.callbacks[i](response);
					}

					resolve(response);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					popups.alert('error', jqXHR.responseText);

					reject();
				},
			};

			$.ajax('/ajax/', settings);
		});
	},

	callbacks: [],
	_data: null,
	_$popup: null,
	_$quantity: null,
};

/**
 *
 * @param {string|Request} url
 * @param {RequestInit?} settings
 * @returns {Promise<?any>}
 */
async function fetch_local(url, settings)
{
	const init = {
		method: 'GET',
		headers: [
			['X-Token', cart._token],
		],
		mode: 'same-origin',
		credentials: 'same-origin',
	};

	if (typeof settings !== 'undefined')
	{
		Object.assign(init, settings);
	}

	return fetch(url, init)
}

/**
 *
 * @param {string|Request} url
 * @param {RequestInit?} settings
 * @returns {Promise<?any>}
 */
async function fetch_json(url, settings)
{
	const response = await fetch_local(url, settings).catch(e => {
		//console.error(e.message, e);
		return {ok: false};
	});

	return response.ok ? response.json() : Promise.resolve(null);
}

/**
 *
 * @param {string|Request} url
 * @param {FormData|object} data
 * @param {RequestInit?} settings
 * @returns {Promise<?any>}
 */
async function fetch_post(url, data, settings)
{
	if (typeof settings === 'undefined')
	{
		settings = {};
	}

	settings.method = 'POST';
	settings.body = data instanceof FormData ? data : object2formData(data);

	const response = await fetch_local(url, settings).catch(e => {
		//console.error(e.message, e);
		return {ok: false};
	});

	return response.ok ? response.json() : Promise.resolve(null);
}

function object2formData(obj)
{
	const result = new FormData();

	for (let k in obj)
	{
		result.append(k, obj[k]);
	}

	return result;
}

class SearchAutocomplete
{
	constructor($block_input, $block_view, $suggest_view, $search_in_cart, $search_in_draft, $use_new_search = false)
	{
		this.urlParams = new URLSearchParams(window.location.search);
		this.$block_input = $block_input;
		this.$block_view = $block_view;

		this.$block_categories = this.$block_view.find('.h_s_heading_container');
		this.$block_goods = this.$block_view.find('.h_s_list_categories_wrap');
		this.$block_suggest = this.$block_view.find('.js-suggestions');
		this.$input = this.$block_input.find('input[name="s"]');
		this.cache = {};
		this.timeout = null;
		this.categories_default = this.$block_categories.html();
		this.search_in_cart=$search_in_cart;
		this.search_in_draft=$search_in_draft;
		this.use_new_search=$use_new_search;
		this.items_default = this.$block_goods.html();
		this.visible = false;
		this.orig_value = '';

		this._suggest = new SearchSuggestions($suggest_view, this.$input);

		this._addListeners();
	
	}

	get value()
	{
		var s = this.$input.val().trim(); 
		this.orig_value = s;
		if(s.length < 3) return '';
		return s;
	}

	set value(v)
	{
		this.$input.val(v);
	}

	_onAutocompleteItemClick(item)
	{
		this.value = $(item).text();
		this.$input.trigger('input');

		this._searchDelay();
	}

	_onKeyDown(event)
	{
		clearTimeout(this.timeout);

		if (event.keyCode === 13)
		{
			this._redirect();
		}
	}

	_onInput()
	{
		//this.reset();
		//this._hideMenu();
		this._searchDelay();
	}

	_onFocus()
	{
		// if (this.value === '')
		// {
		// 	this.$block_view.hide();
		// }
		//this._hideMenu();

		clearTimeout(this.timeout);
		this._search();

	}

	_onClear()
	{
		this.reset();
		//this._hideMenu();
		this.value = '';
	}

	_redirect()
	{
		this.value;
		document.location.href = '/catalog/?sp%5Bname%5D=1&sp%5Bartikul%5D=1&search=&s=' + this.orig_value;
	}

	_addListeners()
	{
		const self = this;
		this.$block_view.on('click', '.h_s_list_item', function() {
			self._onAutocompleteItemClick(this);
		}).on('mouseenter', 'li.h_s_list_item_lev2', function () {
			// console.log('_addListeners mouseenter')
			self._toggleCategory($(this));
		});

		this.$block_input.on('click', '#icon_delete', function() {
			self._onClear();
		}).on('click', '#icon_search', function() {
			self._redirect();
		});

		this.$input.on('keydown', function(e) {
			self._onKeyDown(e);
		}).on('input', function() {
			self._onInput();
		}).on('focus', function() {
			self._onFocus();
			setTimeout(() => {
				$(window).trigger('resize');
			}, 5);

		});
		$(window).on('resize',function(){
			if(!($('.header_search_wrap').hasClass('popup_hidden'))){
				self._markShortLines();
			}

		});
	}

	_hideMenu()
	{
		if ($('.header_catalog_wrap.popup_hidden').length === 0)
		{
			$('.header_catalog_wrap').addClass('popup_hidden');
			$('.js-suggestions').css('display', 'none');
			$('.top_catalog_btn_icon').removeClass('open');
			$('body').css('overflow-y', 'scroll');
            $("body").css('padding-right', '0px');
		}
	}

	_searchDelay()
	{
		const self = this;
		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => self._search(), 450);
	}

	async _search()
	{
		const v = this.value;
		if (v === '')
		{
			this.reset();
			return;
		}

		if (!(v in this.cache))
		{
			var params = window['params'] ? window['params'] : {};
			var srchInCart = this.$input.hasClass('main_input')	? '&cart':'';
			
			var srchInDraft = (srchInCart && this.search_in_draft)? '&draft':'';
			var srchInCartNew = (srchInCart && this.use_new_search)? '&new_search_cart':'';
			this.$input.parent().find('.search_clear').hide();
			this.$input.attr('style','background: #FFF url(/img/ajax-loader.gif) no-repeat center right '+(this.$input.hasClass('search_input')?'42':'42')+'px; background-size: auto 36px;');
			//this.$block_goods.addClass('ajax-loader');
			this.cache[v] = await fetch_json('/ajax/autocomplete/?term=' + v + srchInCart + srchInDraft + srchInCartNew, params);
		} 
		else 
		{
			this.$input.removeAttr('style');
			this.$block_goods.removeClass('ajax-loader');
			$('.search_clear').show();
		}

		this._processResult(this.cache[v]);
		this.visible = true;
	}

	_processResult(result)
	{
		if(result.suggestions.length > 0)
		{


			this.$block_categories.html('<ul class="h_s_list_goods">' + result.autocomplete + '</ul>');
			this.$input.removeAttr('style');
			$('.search_clear').show();
			this.$block_goods.html('');
			this.$block_goods.hide();
			this.$block_suggest.find('.menu_catalog__suggestions__list').html('');
			this.$block_suggest.show();
			this.$block_suggest.find('.menu_catalog__suggestions__list').append(result.suggestions);
			if(this.$block_view.hasClass('header_search_module'))
				$('.header_search_wrap').removeClass('popup_hidden');
			this.$block_view.show();

			this._markShortLines();

			//this._suggest.set(this.value, result.suggestions);
			return;

		}
		else
		{
			this._suggest.hide();
			this.$block_suggest.hide();
		}

		this.$input.removeAttr('style');
		this.$input.parent().find('.search_clear').show();
		this.$block_goods.show();
		this.$block_goods.removeClass('ajax-loader');
		
		this.$block_categories.html('<ul class="h_s_list_goods">' + result.autocomplete + '</ul>');
		const $goods = this.$block_categories.find('.h_s_list_item_lev2.ui_header.ui_header_all .h_s_list:eq(0)').clone().removeClass('hidden');
		const text = $goods.text().trim();
		if (text !== '')
		{
			this.$block_goods.html('');
			this.$block_goods.append($goods);
		}
		else
		{
			this.$block_goods.html(`<div class='h_s_list_categor_item_wrap nothing_find'> 
					<img src='/img/new_icon/no_find.svg' width='154' height='152'/>
					<p>По Вашему запросу ничего не найдено</p>
					<a href='/catalog/'class='new_blue_button_border'>Перейти в каталог</a>
					</div>`);
		}

		if(this.$block_view.hasClass('header_search_module'))
			$('.header_search_wrap').removeClass('popup_hidden');
		this.$block_goods.removeClass('popup_hidden');
		this.$block_view.show();

		this._markShortLines();
	}

	_markShortLines()
	{
		let widthSearchWrap=Math.round(($('.h_s_list_categories').width())*0.662);
		$('.h_s_list .h_s_list_categor_item_txt p').each(function () {
			const $e = $(this);

			$e.css('max-width', widthSearchWrap);
			$e.css('padding-right', 0);
			if ($e.width() < widthSearchWrap)
			{
				$e.addClass('short');
			}
			else
			{
				$e.removeClass('short');
			}

			//$e.css('max-width', '');
			$e.css('padding-right', '');
		});
	}

	_toggleCategory($category)
	{
		this.$block_goods.html('');
		const $goods = $category.find('.h_s_list');
		if ($goods.length > 0)
		{
			const $content = $goods.clone().removeClass('hidden');
			this.$block_goods.append($content);
			this._markShortLines();
		}
	}

	reset()
	{
		this.visible = false;
		this.$block_goods.html(this.items_default);
		this.$block_categories.html(this.categories_default);
		this.$input.parent().find('.search_clear').hide();
		// if(!this.$block_view.hasClass('results-wrapper')){
		// 	this.$block_goods.html(this.items_default);
		// 	this.$block_categories.html(this.categories_default);
		// } else {
		// 	this.$block_view.hide();
		// }

	}
}

class SearchSuggestions
{
	constructor($view, $input)
	{
		this._term = '';
		this._options = [];
		this._current = -1;
		this._redirect = true;

		this._$block = $view;
		this._$input = $input;
		this.set('', []);

		const self = this;
		this._$block.on('click', '.js-suggest', function() {
			self._submit($(this).data('value'));
		});
	}

	_code()
	{
		if (this._options.length === 0)
		{
			return '';
		}

		let code = '';

		$.each(this._options, function(i,v) {
			code += '<div class="search-modern__block js-suggest" data-value="'+v.suggestion+'">'+v.suggestion+'</div>';
		});

		return code;
	}

	_change(delta)
	{
		if (this._options.length === 0)
		{
			return;
		}

		this._current += delta;
		if (this._current < 0)
		{
			this._current = this._options.length - 1;
		}

		if (this._current >= this._options.length)
		{
			this._current = 0;
		}

		let $options = this._$block.find('.js-suggest');
		$options.removeClass('selected');
		$options.eq(this._current).addClass('selected');

		//var search = suggestions._options[suggestions._current];
		//suggestions._$search.val(search);
	}

	_submit(search)
	{
		if (this._redirect)
		{
			document.location = '/catalog/?sp%5Bname%5D=1&sp%5Bartikul%5D=1&search=&s=' + search;

		}
		else
		{
			this.hide();

			this._$input.val(search);
			//console.log(this._$input);
			this._$input.trigger('input');
		}
	}

	set(term, options)
	{
		this._current = -1;
		this._term = term;
		this._options = options;

		this._$block.find('.js-suggest').remove();
		this._$block.append(this._code());

		if (this._options.length > 0)
		{
			this._$block.css('display', 'flex');
		}
		else
		{
			this.hide();
		}
	}

	up()
	{
		this._change(-1);
	}

	down()
	{
		this._change(+1);
	}

	hide()
	{
		this._$block.css('display', 'none');
	}

	submit()
	{
		if (this._current >= 0)
		{
			let search = this._options[this._current].suggestion;
			this._submit(search);
		}
	}

	active()
	{
		return (this._options.length > 0)
			&& (this._term === this._$input.val())
			&& (this._$block.css('display') !== 'none');
	}
}