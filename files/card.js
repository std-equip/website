const cart_mobile = {
	init: function(token) {
		cart_mobile._token = token;
		cart_mobile._$popup = $('#header__cartBox_content');
		cart_mobile._delayInpChange = cart_mobile.debounce(null, cart_mobile.delayInpChange, 1500);
		
		const $body = $('body');

		$body.on('click', '.js-card .js-card-linkCart', function(e){
			//e.preventDefault();
			const $self = $(this),
				$card = $self.parents('.js-card');
			if($self.hasClass('goods_card_cart_link')){
				if(!$self.hasClass('goods_card_cart_link_notIn')&&!$self.hasClass('goods_card_cart_link__active')){
					$self.addClass('goods_card_cart_link__active');
					const goods_id = $card.data('id');
					cart_mobile.add(goods_id);
					return false;
				}
			}
		});
		
		$body.on('change', '.js-card .js-card-result', function(){
			const $card = $(this).parents('.js-card'),
				goods_id = $card.data('id'),
				$countBlock = $card.find('.js-card-actionCart'),
				$input = $card.find('.js-card-result'),
				quantity = parseInt($input.val()),
				$jsCard = $card.find('.js-card-linkCart');
			if($jsCard.hasClass('goods_card_cart_link')){
				if($jsCard.hasClass('goods_card_cart_link__active')){
					cart_mobile.change(goods_id, quantity);
					cart_mobile.changeButton($card);
				}
				if((this.value)<1){
					$countBlock.addClass('disabled');
						setTimeout(function(){
							$input.val(1);
							$countBlock.removeClass('disabled');
						},1000);
				}
			} else {
				cart_mobile.change(goods_id, quantity);
				//cart_mobile.changeButton($card);
			}
		});

		$body.on('click', '.js-card .js-card-minus', function(event){
			event.stopPropagation();
			event.preventDefault();
			const $card = $(this).parents('.js-card');
			const $countBlock = $card.find('.js-card-actionCart');
			if(!$countBlock.hasClass('disabled')){
				const $input = $card.find('.js-card-result');
				const quantity = parseInt($input.val());
				$input.val(quantity - 1).change();
			}
			return false;
		});

		$body.on('click', '.js-card .js-card-plus', function(e){
			e.stopPropagation();
			const $card = $(this).parents('.js-card');
			const $input = $card.find('.js-card-result');

			const quantity = parseInt($input.val());
			//$input.val(quantity + 1);
			$input.val(quantity + 1).change();

			return false;
		});
		$body.on('keydown','.js-card .js-card-result', function(event){
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
		$body.on('click', '.js-card-metric-item', function(event) {
			event.stopPropagation()
			event.preventDefault();
			
			const $e = $(this);
			let $prices;
			if($e.closest('.js-card').length){
				$prices = $e.closest('.js-card').find('.js-prices-row');
			} else {
				$prices = $e.parents('.js-card-prices').find('.js-prices-row');
			}
			const $metric=$e.parents('.js-card-metric')
			if($e.hasClass('price_unit_item')){
				$metric.find('.js-card-metric-item').removeClass('units_active');
				$e.addClass('units_active');
			} else {
				$metric.find('.js-card-metric-item').removeClass('active_metric');
				$e.addClass('active_metric');
			}
			const rate = parseFloat($e.data('rate'));

			$prices.each(function(){
				const $e2 = $(this).find('.js-priceItem');
				$(this).find('.card__prices__unit').html($e.html())
				const price = parseFloat($e2.data('price'));
				if($e2.hasClass('js-price-value')){
					$e2.html(nf_price(price * rate));
				} else {
					$e2.html(nf_price(price * rate)+' ₽');
				}
				
			});
		});

	
		
		cart_mobile._$quantity = $('.js-cart-quantity');
		cart_mobile.callbacks.push(cart_mobile._cards_update);
	},
	debounce: function(context, callback, wait){
		let timeoutId = null;
		return (...args) => {
			if(timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				callback.apply(context, args);
			}, wait);
		};
	},
	changeButton(card){
		const $input = card.find('.js-card-result');
		const quantity = parseInt($input.val());
		const button=card.find('.js-card-linkCart');
		if(button.hasClass('goods_card_cart_link')){
			if(quantity){
				button.addClass('goods_card_cart_link__active');
				button.attr('href','/cart')
			} else {
				button.removeClass('goods_card_cart_link__active');
				button.attr('href','')
			}
		}

	},
	delayInpChange: function(event){
		$(event.target).blur();
	},
	
	_cards_update: function(response) {
		const list = response.result.list;
		for (let id in list)
		{
			cart_mobile._card_update(id, list[id].quantity);
		}

		cart_mobile._$quantity.html(response.result.count);
		cart_mobile._$quantity.css('display', response.result.count ? 'initial' : 'none');
	},
	_card_update: function(goods_id, quantity) {
		const $card = $('.card[data-id='+goods_id+']');
		if ($card.length === 0)
		{
			return;
		}

		const $button = $card.find('.card__btns__action__item--cart');
		const $controls = $card.find('.card__btns__action__item--quantity');
		const $input = $controls.find('.card_res');

		$input.val(quantity);
		$input.data('val', quantity);

		if (quantity)
		{
			$button.addClass('hidden');
			$controls.removeClass('hidden');
		}
		else
		{
			$button.removeClass('hidden');
			$controls.addClass('hidden');
		}
	},

	add: function(id) {
		cart_mobile._request({add: id});
		cart_mobile._card_update(id, 1);
	},

	change: function(id, quantity, share_hash) {
		if (quantity < 0) quantity = 0;

		const request = {};
		request[id] = quantity;
		let data = {update: request};
		if(typeof share_hash != 'undefined') data.share_hash = share_hash; else data.share_hash = '';
		
		cart_mobile._request(data);
		cart_mobile._card_update(id, quantity);
	},
	_request_id: 0,
	_last_request_id: '',
	_request: function(request) {
		if ('request_id' in request)
		{
			cart_mobile._last_request_id = request.request_id;
		}
		else
		{
			cart_mobile._last_request_id = 'cart_' + cart_mobile._request_id;
			cart_mobile._request_id += 1;

			request.request_id = cart_mobile._last_request_id;
		}
		// var cartIsEmpty = cart_mobile._$quantity.length && +cart_mobile._$quantity.text().trim() == 0;

		return new Promise((resolve, reject) => {
			const settings = {
				method: 'POST',
				data: request,
				dataType: 'json',
				headers: {
					'X-Token': cart_mobile._token,
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

                    if(typeof ecommerce=='function' && (request.del || request.add || request.change || request.update)){
                        if(response.goods_changed.add) {
                            ecommerce('add', response.goods_changed.add);
                            if (typeof ym != 'undefined' && action_event!='add_item_to_cart') ym(ymID,'reachGoal', 'add_item_to_cart');
                        } else if (response.goods_changed.remove){
                            ecommerce('remove', response.goods_changed.remove);
                        }
                    }

					if (response.request_id !== cart_mobile._last_request_id) return;
					cart_mobile._data = response;
					cart_mobile._$popup.html(response.popup);

					for (let i in cart_mobile.callbacks)
					{
						cart_mobile.callbacks[i](response);
					}

					resolve(response);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					popups.mobileAlert('error', jqXHR.responseText);

					reject();
				}
			};
			$.ajax(MOBIL+'/ajax/', settings);
		});
	},

	callbacks: [],
	_data: null,
	_$popup: null,
	_$quantity: null,
};
var draft_goods_id = 0;
var callbacksArray=[];

function compare_handler(res, elm) {
	// if (res.is_added) return;
	let good_id = res.goods.id,
		cat_id = res.goods.category_id,
		cat_btns_active = 'active',
		$cat_btns = $('.goods_slider_nav_container a'),
		totalFav = res['ids'].length;

	if($cat_btns.length){
		item = $('.swiper-comprasion .swiper-slide.goods-card[data-id=' + good_id + ']'),
		item2 = $('.swiper-comprasion2 .swiper-slide.goods-card[data-id=' + good_id + ']'),
		item3 = $('.swiper-comprasion3 .swiper-slide.goods-card[data-id=' + good_id + ']'),
		item4 = $('.swiper-comprasion4 .swiper-slide.goods-card[data-id=' + good_id + ']'),
		values = $('.product_parametrs_item[data-id=' + good_id + ']'),
		titleItem=$('.title_page--new span');
		item.remove();
		item2.remove();
		item3.remove();
		values.remove();

		titleItem.html(totalFav +' '+ num_word(totalFav, ['товар', 'товара', 'товаров']));
		if (totalFav == 0) {
			document.location = '/compare/';
			return;
		} else {
			var $catBtn = $cat_btns.filter('[data-id="' + cat_id + '"]'),
				$amount = $('.js-amount', $catBtn),
				totalCat = parseInt($amount.data('total')) - 1;
			if (totalCat) { // не пустая
				$amount.data('total', totalCat);
				$amount.html('(' + totalCat + ')');
			} else {
				if ($catBtn.hasClass(cat_btns_active)) { // выбрана подкатегория
					document.location = '/compare/';
				} else {
					$catBtn.remove();
				}
			}
			addOpacityClass()
			updateSliders();
		}
	}else if(elm.hasClass('cardModal-action-list-item')){
		$('img', elm).toggleClass('hidden');
	}
}
callbacksArray.push(compare_handler);

function showGoodsId(){
	$.ajax({
		type: 'POST',
		url: MOBIL+'/ajax/draft/',
		data: {goods_id: draft_goods_id},
		dataType: 'json',
		success: function(draft_ids) {
			$('.modalDraft-form:first').find('input[name=draft_id]').each(function(){
				this.disabled = $.inArray(parseInt(this.value), draft_ids) !== -1;
				this.checked = this.checked && !this.disabled;
			});
			$(window).trigger('resize');
		},
	});	
}
function doAjax(type, query, handler){
	$.getJSON(MOBIL+'/ajax/'+type+'/', query, response => handler(response));
}
$(document).ready(function(){
	const $body = $('body');
	function updateFavorites(res,id,elm){
		if(!res.is_added && $('.favorites-list:eq(0)').length){
			setTimeout(() => elm.closest('.favorites-list__item').remove(), 300, this);

			let $cat_btns = $('.favorites-sort-item')
			,$btnAll=$cat_btns.filter('[data-id="0"]')
			,$favCnt = $('.grey_counter_icon.favorite_count')
			
			,totalFav = parseInt($favCnt.text()) // кол-во всего
			;
			if (totalFav == 0){
				document.location = MOBIL+'/favorite/';
				return;
			}else{
				if($btnAll.hasClass('active'))
					document.location = $btnAll.attr('href');
				else{
					let $amountAll = $btnAll.find('.favorites-sort-item__label');
					$amountAll.data('total', totalFav);
					$amountAll.html('('+totalFav+')'); // Все
	
					let $catBtn = $cat_btns.filter('.active')
					,$amount = $('.favorites-sort-item__label', $catBtn)
					,totalCat = parseInt($amount.data('total')) - 1  // кол-во в подкатегории
					;
	
					if(totalCat){ // не пустая
						$amount.data('total', totalCat);
						$amount.html('('+totalCat+')');
						// returnSldier().update();
					}else{
						document.location = $btnAll.attr('href');
					}
				}
			}
		}else{
			$('img', elm).toggleClass('hidden');
		}
	}
	$body.on('click', '.js-action', function(event) {
		let type = '',
			$elm = $(this),
			added = +$elm.data('added'),
			id=$elm.closest('.js-action-list').data('id'),
			query = {id:id};

		if(!$elm.hasClass('js-action-draft')){
			event.stopPropagation();
			event.preventDefault();
		}

		if($elm.hasClass('js-action-favorite')) type = 'favorite';
		else if($elm.hasClass('js-action-compare')) type = 'compare';

		if(type=='') {
			draft_goods_id = id;
			$('.modalDraft').find('.js-form').show();
			$('.modalDraft').find('.js-results').hide();
			return;
		}
		
		if(added) query.remove=1; else query.add=1;
		doAjax(type, query, function(res){
			if(added && !res.is_added || !added && res.is_added){
				$elm.find('svg').toggleClass('active');
				if($elm.hasClass('goods_card_icon_actionItem')) 
					$elm.toggleClass('active');
				$elm.data('added', added ? 0 : 1);
				if(type == 'favorite'){
					$('.favorite_count').text(res.ids.length).toggleClass('hidden', !res.ids.length);
					updateFavorites(res,id, $elm);
					if(res.is_added && typeof ym != 'undefined') ym(ymID, 'reachGoal', 'mic_click_katalog_list_favorites');
					if(res.is_added){
						popups.mobilealertNew('Товар добавлен в избранное','<a href="/favorite">Перейти в раздел избранное</a>',1)
					}
				}
				if(type == 'compare'){
					$('.compare_count').text(res.ids.length).toggleClass('hidden', !res.ids.length);
					for (let i in callbacksArray)
					{
						callbacksArray[i](res, $elm);
					}
					if(res.is_added && typeof ym != 'undefined') ym(ymID, 'reachGoal', 'mic_click_katalog_list_compare');
					if(res.is_added){
						popups.mobilealertNew('Товар добавлен в сравнение','<a href="/compare">Перейти в раздел сравнения</a>',1)
					}
					
				}
			} else {
				if(type == 'compare'){
					if(res.error){
						popups.mobilealertNew('Добавление в сравнение',res.error,0)
					}
				}
			}
		});
		
	}).on('click', '.openCredit', function() {
		$('.helpModal').hide();
		$('#' + $(this).attr('data-modal')).show();
	}).on('click', '.closeCredit', function() {
		$('#' + $(this).attr('data-modal')).hide();
	});
	$('.addToDraft_popup_btn.add').click(function(e){
		e.preventDefault();
		$('.addToDraft-form').trigger('submit');
	})
	$('.addToDraft-form').submit(function(){
		const $draft_id = $(this).find('input[name=draft_id]:checked');
		if ($draft_id.length === 0)
		{
			popups.mobilealertNew('Не выбрана смета.','',0);
			return false;
		}

		const request = {
			draft_id: $draft_id.val(),
			draft_name: $.trim($(this).find('input[name=draft_name]').val()),
			add: draft_goods_id,
		};

		if ((request.draft_id === '0') && (request.draft_name === ''))
		{
			popups.mobilealertNew('Не указано название сметы.','',0);
			return false;
		}
		
		var url = MOBIL+'/ajax/draft/', messOk = 'Товар успешно добавлен в смету.';
		let goods_id=draft_goods_id?draft_goods_id:-1;
		if(typeof cartStep1=='boolean'&&cartStep1){
			url = MOBIL+'/ajax/cart2draft/';
			messOk = 'Товары из корзины добавлены в смету';
			request.id = request.draft_id;
			request.name = request.draft_name;
		}
		
		const self = this;
		$.ajax({
			type: 'POST',
			url: url,
			data: request,
			dataType: 'json',
			success: function(response) {
				//popups.mobileAlert(messOk);
				self.count = response.count;
				
				if((request.draft_id === '0') && response.name){
					
					let newItem=$('.addToDraft_popup_list_item--main:last').clone();
					newItem.find('input').attr("id", 'draft_'+(response['count'])).attr('checked','checked').val(response['draft']['id']);
					newItem.find('label').attr("for", 'draft_'+(response['count'])).text(response['name']);
					newItem.find('input[name="draft_name"').remove();
					$('.addToDraft_popup_capcha_block').append(newItem);
				}
				let $card=$('.goods_card_wrap[data-id="'+draft_goods_id+'"]');
				$card.find('.goods_card_icon_draft').addClass('active');
				cartStep1=false;
				$(self).closest('.modal').find('.js-form').hide();
				$(self).closest('.modal').find('.js-results').show();

			},
		});
		
		return false;
	});
	const icons = $('.cardPage-content-slider-iconLeft img[title]');
	icons.on('mouseleave focusout mouseover focusin', function(event) {
		event.stopImmediatePropagation();
	}).tooltip({ position: { my: 'left+10 center', at: 'right center' } }).click(function() {
		var elm = $(this);
		if(elm.data('opened')){
			elm.tooltip('close');
			elm.data('opened', false);
		}else{
			elm.tooltip('open');
			elm.data('opened', true);
		}
	});
	$('.modalDraft').click(function(e) {
		if (!$(e.target).closest(".wrap").length) {
			$('.addToDraft_popup .system_popup_hide').click()
		}
	})
	$('.popups_system--newCont').click(function(e) {
		if (!$(e.target).closest(".wrap").length) {
			$(this).hide();
			$('body').css('overflow-y', 'scroll');
			$("body").css('padding-right', '0px');
		}
	})

});
