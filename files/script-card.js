var arraySlider = [];
function initializeSwipers() {
	const sliders = document.querySelectorAll('.goods_card_photo_swiper');
	sliders.forEach((slider) => {
		if (!slider.classList.contains('swiper-initialized')) {
			// Создаем новый экземпляр Swiper для контейнера
			let paginationItem = slider.querySelector(
				'.goods_card_photo_pagination'
			);
			let pushSlider = new Swiper(slider, {
				slidesPerView: 1,
				watchSlideProgress: true,
				nested: true, // Разрешает вложенные слайдеры,
				pagination: {
					el: paginationItem,
					bulletClass: 'goods_card_photo_pagination_item', // Класс для обычных буллетов
					bulletActiveClass:
						'goods_card_photo_pagination_item_active', // Класс для активного буллета
					clickable: true, // Возможность клика по буллетам
				},
                on: {
                    touchStart: function(swiper, event) {
                        event.stopPropagation();
                        
                    },
                    touchEnd: function(swiper, event) {
                        event.stopPropagation();
                    },
                },
			});
			arraySlider.push(pushSlider);
		}
	});
}
function initializeCardBlock(){
	if ($('.main-content__wrapper').length>0){
		tippy('.goods_card_price_tooltip.goods_card_price_tooltip--card', {
			content:"<div class='tippy-box-wrapper'>\
						<h3 class='tippy-box__title'>Карта лояльности «СТАНДАРТНОЕ ОБОРУДОВАНИЕа»</h3>\
						<div class='tippy-box-cont'>\
							<p class='tippy-box__text'>Дает возможность на получение дополнительных скидок и предложений.</p>\
							<a href='/structure/Programma-loyalnosti/' class='tippy-box__link'>Подробнее в разделе «Покупателям»</a>\
						</div>\
					</div>",
			trigger: 'click',
			allowHTML: true,
			placement: "top-start",
			interactive: true,
		});
	}

}
function updateCardStock() {
    initializeSwipers();
	initializeCardBlock();
	let arrayBlock = $('.goods_card_availability__notIn');
	arrayBlock.each(function () {
		$(this).html(
			"<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'>\
					<circle cx='8' cy='8' r='5.25' stroke='#E2E2E2' stroke-width='1.5'/>\
					<path d='M6 7.5L8 9.5L12 5' stroke='#E2E2E2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/>\
				</svg>\
				Нет в наличии"
		);
	});
    

}
$(document).ready(function () {
	updateCardStock();
	const config = { childList: true };
	const red_counter_icon = document.querySelectorAll('.red_counter_icon');
	const fixRedCounter = function (node) {
		var elm = $(node),
			num = parseInt(elm.text());
		if (num > 99) elm.text('+99');
	};
	const mutationCallback = function (mutationsList) {
		for (var mutation of mutationsList) {
			if (mutation.type == 'childList' || mutation.type == 'subtree')
				fixRedCounter(mutation.target);
		}
	};
	const observer = new MutationObserver(mutationCallback);
	red_counter_icon.forEach(function (elm) {
		fixRedCounter(elm);
		observer.observe(elm, config);
	});

	$(document).on('mouseenter', '.goods_card_photo_wrapMouse_hover', function () {
			var self = $(this),
				index = self.index(), // Получаем индекс элемента hover
				photoBox =self.closest('.goods_card_photo,.goods_card_wrap_fullCard_photo'),
				imgWrap = photoBox.find('.goods_card_photo_imgWrap'),
				paginationWrap = photoBox.find('.goods_card_photo_pagination');
			imgWrap
				.find('.goods_card_img')
				.addClass('goods_card_img_hidden')
				.eq(index)
				.removeClass('goods_card_img_hidden');
			paginationWrap
				.find('.goods_card_photo_pagination_item')
				.removeClass('goods_card_photo_pagination_item_active')
				.eq(index)
				.addClass('goods_card_photo_pagination_item_active');
		}
	);
	$(document).on('mouseleave', '.goods_card_photo_wrapMouse', function () {
		var self = $(this),
			photoBox =self.closest('.goods_card_photo,.goods_card_wrap_fullCard_photo'),
			imgWrap = photoBox.find('.goods_card_photo_imgWrap'),
			paginationWrap = photoBox.find('.goods_card_photo_pagination');
		imgWrap
			.find('.goods_card_img')
			.addClass('goods_card_img_hidden')
			.first()
			.removeClass('goods_card_img_hidden');
		paginationWrap
			.find('.goods_card_photo_pagination_item')
			.removeClass('goods_card_photo_pagination_item_active')
			.first()
			.addClass('goods_card_photo_pagination_item_active');
	});
	$(document).on('click', '.js-openNotification', function () {
		let good_id_notify = $(this).data('good_id');
		notificationsApp.open(good_id_notify);
	});
});
